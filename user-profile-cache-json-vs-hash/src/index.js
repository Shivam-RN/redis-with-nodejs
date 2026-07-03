import express from "express";
import Redis from "ioredis";

const app = express()
app.use(express.json())

const redis  = new Redis('redis://localhost:6379')

app.get('/', async (req, res) => {
    res.send('Welcome to Redis Basics')
})  

app.post('/user/:id/json', async (req, res) => {
    await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body))
    res.send('User profile cached as JSON')
})

app.get('/user/:id/json', async (req, res) => {
    const raw = await redis.get(`user:${req.params.id}:json`)
    res.json({user : raw ? JSON.parse(raw) : null})
})

app.post('/user/:id/hash', async (req, res) => {
    await redis.hset(`user:${req.params.id}:hash`, req.body)
    res.json({message: 'User profile cached as Hash'})
})

app.get('/user/:id/hash', async (req, res) => {
    const user = await redis.hgetall(`user:${req.params.id}:hash`)
    res.json({user})
})


app.listen(3000, () => {
    console.log('Server is running on port 3000')
})