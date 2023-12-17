import { Request, Response } from 'express';
import { savePosts, savePostToRabbitMQ, getPostAnalysis } from '../services/postService';
import { UniqueConstraintError } from 'sequelize';
import redisClient from '../redis';


export const createPost = async (req: Request, res: Response): Promise<void> => {
    const { textContent, postId } = req.body;

    try {
        if (!textContent || !postId) {
            res.status(400).json({ error: 'textContent and postId are required in the request body' });
            return;
        }
        // Save posts to the database
        await savePosts(textContent, postId);

        // Enqueue analysis tasks for each post
        savePostToRabbitMQ(postId);
    

        res.json({ message: 'Posts saved. Analysis will be performed asynchronously.' });
    } catch (error) {

        if (error instanceof UniqueConstraintError) {
            // Handle the specific error related to uniqueness constraint
            res.status(409).json({ error: 'Post with the given postId already exists' });
        } else {
            // Handle other errors
            console.error('Error saving posts:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

export const getAnalysis = async (req: Request, res: Response): Promise<void> => {
    const postId = req.params.id;

    try {
        redisClient.get(postId, async (err, cachedAnalysis) => {
            if (err) {
                console.error('Redis Error:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            if (cachedAnalysis) {
                console.log("Analysis returning from redis!")
                // If cached, return the cached analysis
                res.json(JSON.parse(cachedAnalysis));
            } else {
                console.log("Analysis returning from Database!")
                // If not cached, retrieve analysis from the database
                const analysis = await getPostAnalysis(postId);

                // Cache the analysis result in Redis with a TTL (time-to-live) of your choice
                redisClient.setex(postId, 3600, JSON.stringify(analysis));

                // Return the analysis to the client
                res.json(analysis);
            }
        });
    } catch (error) {
        console.error('Error retrieving analysis:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};