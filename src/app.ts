import express from 'express';
import bodyParser from 'body-parser';
import  { createPost, getAnalysis } from './controllers/postController';
import { connectRabbitMQ } from './rabbitmq';
import rateLimit from 'express-rate-limit';

const app = express();
const port = 3000;

// Apply IP-based rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after a few minutes',
});

app.use(limiter);
app.use(bodyParser.json());

connectRabbitMQ()
// Create post endpoint
app.post('/api/v1/posts', createPost);

// Get analysis endpoint
app.get('/api/v1/posts/:id/analysis', getAnalysis);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});