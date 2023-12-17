import Post from '../models/posts';
import { UniqueConstraintError } from 'sequelize';

export const savePosts = async (textContent: string, postId: number): Promise<void> => {
    try {
        // Use findOrCreate with a unique constraint on postId
        const [post, created] = await Post.findOrCreate({
            where: { postId },
            defaults: { textContent },
        });

        if (!created) {
            // If not created, it means the post already existed
            throw new UniqueConstraintError({ message: 'Post with the given postId already exists' });
        }
      } catch (error) {
        throw error
    }
};
export const getPostAnalysis = async (postId: string): Promise<any> => {
    try {
        // Fetch post analysis data from the database based on postId
        const analysisData = await Post.findOne({
          where: { postId },
        });
    
        if (analysisData) {
          if(analysisData.status == 'created'){
            // Enqueue analysis tasks for each post
            savePostToRabbitMQ(analysisData.postId);
            return { 'message': "Post is not analysed, Added to queue!"}
          }
          if(analysisData.status == 'enqueued'){
            return { 'message': "Analysis is in progress!"}
          }
          // If analysis data is found, return the results
          return {
            wordCount: analysisData.numberOfWords,
            averageWordLength: analysisData.averageWordLength,
          };
        } else {
          // If no analysis data is found, return default values or handle accordingly
          return { 'message': "Post does not exist!" };
        }
      } catch (error) {
        // Handle database query errors
        console.error('Error fetching post analysis:', error);
        throw error; // You might want to handle this more gracefully in a real application
      }
};

import { connectRabbitMQ } from '../rabbitmq';

export async function savePostToRabbitMQ(postId: number): Promise<void> {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();

  const queueName = 'postAnalysis';

  await channel.assertQueue(queueName);
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify({ postId})));
  const post = await Post.findOne({
    where: { postId },
  });
  if(!post)return;
  await post.update({
    status: 'enqueued'
  });
  console.log(`Post sent to RabbitMQ: ${postId}`);
}

