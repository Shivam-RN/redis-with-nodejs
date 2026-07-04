import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const publisher = new Redis('redis://localhost:6379');

app.post('/notificatons', async(req, res) => {
    const payload = {
        title : req.body.title,
        createdAt : new Date().toISOString(),
    }

    const receivers = await publisher.publish('notifications', JSON.stringify(payload));
    res.json({message: `Notification sent to ${receivers} receivers`});
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})