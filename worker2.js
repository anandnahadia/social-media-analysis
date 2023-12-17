// worker2.js
import { messageQueue } from './dist/messageQueue';

messageQueue.process('postAnalysis', async ({ postContent }) => {
    // Implement analysis logic for worker 2
    console.log('Worker 2 - Analysis result:', postContent);
});
