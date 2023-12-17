"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// worker.ts
const messageQueue_1 = require("./messageQueue/messageQueue");
const posts_1 = __importDefault(require("./models/posts"));
// messageQueue.enqueue('postAnalysis', { postId: '123' });
messageQueue_1.messageQueue.process('postAnalysis', ({ postId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("postID.........", postId);
        if (!postId) {
            throw new Error('Post not found');
        }
        // Retrieve the post from the database
        const post = yield posts_1.default.findOne({ where: { postId } });
        if (!post) {
            throw new Error('Post not found');
        }
        // Perform analysis (dummy analysis for illustration purposes)
        const wordCount = post.textContent.split(/\s+/).length;
        const averageWordLength = wordCount > 0
            ? post.textContent.length / wordCount
            : 0;
        // Update the post with the analysis results
        yield post.update({
            wordCount,
            averageWordLength,
        });
        console.log(`Analysis completed for post ${postId}: Word Count - ${wordCount}, Average Word Length - ${averageWordLength}`);
    }
    catch (error) {
        console.error(`Error processing analysis for post ${postId}:`, error);
    }
}));
