import { Worker } from "bullmq";
import { connection } from "./queue.js";

const worker = new Worker(
    'emails',
    async(job) => {
        console.log(`Processing email job... ${job.id} of type ${job.name} ${job.data}`);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log(`Job ${job.id} completed`);
    },
    {connection}
)

worker.on('completed', (job) => {
    console.log(`Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
    console.log(`Job ${job.id} has failed with ${err.message}`);
});
