import { Job, Queue, Worker } from "bullmq";
import { defaultJobOptions, redisConnection } from "../../constants";
import { HandlingOtp } from "../handlingOtp";
import nodemailer from "nodemailer";
import { otpMailTemplate } from "../../email/verificationEmailTemplate";

export const emailQueueName = "emailQueue";
const transporter = nodemailer.createTransport({
  service: process.env.SERVICE as string,
  auth: {
    user: process.env.MAIL_USER as string,
    pass: process.env.MAIL_PASS as string,
  },
});

export const emailQueue = new Queue(emailQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultJobOptions,
});

export const handler = new Worker(
  emailQueueName,
  async (job: Job) => {
    // create otp
    //hash otp
    //store otp in db
    //send otp to user
    const otp = await HandlingOtp(job.data);
    const mailOptions = {
      from: process.env.MAIL_USER as string,
      to: job.data.email,
      subject: "OTP for email verification",
      html: otpMailTemplate(job.data.fullName, otp.toString()),
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw new Error(error.message);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    console.log(job.data);
  },
  { connection: redisConnection }
);

handler.on("completed", (job: Job) => {
  console.log(`Job with id ${job.id} has been completed`);
});
handler.on("failed", (job, error: Error) => {
  // Do something with the return value.
  console.log(`Job with id ${job?.id} has failed with error ${error.message}`);
});
