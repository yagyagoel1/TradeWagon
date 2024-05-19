import { Job, Queue, Worker } from "bullmq";
import { defaultJobOptions, redisConnection } from "../../constants";
import { HandlingOtp } from "../handlingOtp";
import nodemailer from "nodemailer";
import { otpMailTemplate } from "../../email/verificationEmailTemplate";

export const emailQueueName = "emailQueue";
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
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
    const otp = await HandlingOtp(job.data);
    job.updateProgress(40);
    const mailOptions = {
      from: {
        name: "Product Seller",
        address: process.env.MAIL_USER as string,
      },
      to: job.data.email,
      subject: "OTP for email verification",
      html: otpMailTemplate(job.data.fullName, otp.toString()),
    };
    job.updateProgress(50);
    const info = await transporter.sendMail(mailOptions);
    console.log(`Message sent: ${info.messageId}`);
    job.updateProgress(100);
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
