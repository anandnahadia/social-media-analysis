import * as amqp from 'amqplib';
import Post from './models/posts'
export async function connectRabbitMQ(): Promise<amqp.Connection> {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  return connection;
}

async function consumeMessages(id: number): Promise<void> {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();

  const queueName = 'postAnalysis';
  await channel.assertQueue(queueName);

  console.log('Waiting for messages. To exit, press CTRL+C');

  channel.consume(queueName, async(message) => {
    if (message !== null) {
      const { postId } = JSON.parse(message.content.toString());
      console.log(`Received post from RabbitMQ for analysis: ${postId}`);

      // Retrieve the post from the database
      const post = await Post.findOne({ where: { postId } });
      if(!post)return;
      // Perform analysis (dummy analysis for illustration purposes)
      const words: string[] = post.textContent.split(/\s+/);
      const wordCount = words.length;
      const totalLength: number = words.reduce((acc, word) => acc + word.length, 0);
      const averageLength: number = words.length > 0 ? totalLength / words.length : 0;


      // Update the post with the analysis results
      await post.update({
        numberOfWords: wordCount,
        averageWordLength: averageLength,
        status: 'processed'
      });
      console.log(`Analysis completed for post ${postId}: Word Count - ${wordCount}, Average Word Length - ${averageLength} worker id - ${id}`);

      channel.ack(message);
    }
  });
}

consumeMessages(1);
consumeMessages(2);