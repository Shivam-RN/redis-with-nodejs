import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis("redis://localhost:6379");

const LEADERBOARD_KEY = "leaderboard";

app.post("/post/:id/views", async (req, res) => {
  const views = await redis.incr(`post:${req.params.id}:views`);

  res.json({
    postId: req.params.id,
    views: views,
  });
});

app.post("/leaderboard/score", async (req, res) => {
  const { userId, score } = req.body;

  if (!userId || score === undefined) {
    return res.status(400).json({
      message: "Both userid and score are required",
    });
  }
  const newScore = await redis.zincrby(
    LEADERBOARD_KEY,
    Number(score),
    String(userId),
  );
  res.json({
    message: "Score updated",
    userId,
    score: Number(newScore),
  });
});

app.get("/leaderboard", async (req, res) => {
  const data = await redis.zrevrange(LEADERBOARD_KEY, 0, 9, "WITHSCORES");

  const leaderboard = [];

  for (let i = 0; i < data.length; i += 2) {
    leaderboard.push({
      userId: data[i],
      score: Number(data[i + 1]),
    });
  }
  res.json(leaderboard);
});

app.get("/leaderboard/:userId/rank", async (req, res) => {
  const rank = await redis.zrevrank(LEADERBOARD_KEY, req.params.userId);

  if (rank === null) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const score = await redis.zscore(LEADERBOARD_KEY, req.params.userId);

  res.json({
    userId: req.params.userId,
    rank: rank + 1,
    score: Number(score),
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
