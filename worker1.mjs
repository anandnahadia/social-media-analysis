import { messageQueue } from './dist/messageQueue/messageQueue.js';
import Post from './dist/models/posts.js';
messageQueue.process('postAnalysis', async (postId) => {
    try {
        console.log("postID......................",postId)
        // Retrieve the existing post from the database
        const existingPost = await Post.findOne({ where: { postId: 1 } });

        if (!existingPost) {
            console.error(`Worker - Post with ID ${postId} not found.`);
            return;
        }

        // Perform analysis
        const wordCount = countWords(existingPost.textContent);
        const averageWordLength = calculateAverageWordLength(postContent);

        // Update the post with the analysis results
        await existingPost.update({
            wordCount,
            averageWordLength,
        });

        console.log(`Worker - Updated post ${postId} with analysis results: Word Count - ${wordCount}, Average Word Length - ${averageWordLength}`);
    } catch (error) {
        console.error('Worker - Error performing analysis and updating post:', error);
    }
});

// Helper function to count words
function countWords(text) {
    // Implement word counting logic based on your requirements
    // For simplicity, this example uses a basic word count based on spaces
    return text.split(/\s+/).filter(Boolean).length;
}

// Helper function to calculate average word length
function calculateAverageWordLength(text) {
    const words = text.split(/\s+/).filter(Boolean);
    const totalWordLength = words.reduce((sum, word) => sum + word.length, 0);
    return words.length > 0 ? totalWordLength / words.length : 0;
}
