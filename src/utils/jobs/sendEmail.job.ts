import { Job, Queue, Worker } from "bullmq";
import { defaultJobOptions, redisConnection } from "../../constants";

export const emailQueueName = "emailQueue";

export const emailQueue = new Queue(emailQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultJobOptions,
});

export const handler = new Worker(
  emailQueueName,
  async (job: Job) => {
    // send email
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
