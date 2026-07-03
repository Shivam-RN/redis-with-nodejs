import express from "express";
import Redis from "ioredis";

const app = express()
app.use(express.json())

const redis  = new Redis('redis://localhost:6379')

const QUEUE_NAME = 'queue:emails'

app.post('/emails', async(req, res) => {
    const job = {
        to : req.body.to,
        subject : req.body.subject || 'No Subject',
        body : req.body.body || 'No Body',
        createdAt : new Date().toISOString()
    }
    await redis.lpush(QUEUE_NAME, JSON.stringify(job))
    res.json({message: 'Email added to queue', job}) 
})

app.get('/emails/process-one', async(req, res) => {
    const rawJob = await redis.rpop(QUEUE_NAME)
    if(!rawJob) {
        return res.json({message: 'No jobs in the queue'})
    }
    const job = JSON.parse(rawJob)
    res.json({message: 'Email sent', job})
})

app.get('/', async (req, res) => {
    res.send('Welcome to Redis Basics')
}) 

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})