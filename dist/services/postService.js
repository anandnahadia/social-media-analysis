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
exports.savePostToRabbitMQ = exports.getPostAnalysis = exports.savePosts = void 0;
const posts_1 = __importDefault(require("../models/posts"));
const sequelize_1 = require("sequelize");
const savePosts = (textContent, postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Use findOrCreate with a unique constraint on postId
        const [post, created] = yield posts_1.default.findOrCreate({
            where: { postId },
            defaults: { textContent },
        });
        if (!created) {
            // If not created, it means the post already existed
            throw new sequelize_1.UniqueConstraintError({ message: 'Post with the given postId already exists' });
        }
    }
    catch (error) {
        throw error;
    }
});
exports.savePosts = savePosts;
const getPostAnalysis = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch post analysis data from the database based on postId
        const analysisData = yield posts_1.default.findOne({
            where: { postId },
        });
        if (analysisData) {
            if (analysisData.status == 'created') {
                // Enqueue analysis tasks for each post
                savePostToRabbitMQ(analysisData.postId);
                return { 'message': "Post is not analysed, Added to queue!" };
            }
            if (analysisData.status == 'enqueued') {
                return { 'message': "Analysis is in progress!" };
            }
            // If analysis data is found, return the results
            return {
                wordCount: analysisData.numberOfWords,
                averageWordLength: analysisData.averageWordLength,
            };
        }
        else {
            // If no analysis data is found, return default values or handle accordingly
            return { 'message': "Post does not exist!" };
        }
    }
    catch (error) {
        // Handle database query errors
        console.error('Error fetching post analysis:', error);
        throw error; // You might want to handle this more gracefully in a real application
    }
});
exports.getPostAnalysis = getPostAnalysis;
const rabbitmq_1 = require("../rabbitmq");
function savePostToRabbitMQ(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, rabbitmq_1.connectRabbitMQ)();
        const channel = yield connection.createChannel();
        const queueName = 'postAnalysis';
        yield channel.assertQueue(queueName);
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify({ postId })));
        const post = yield posts_1.default.findOne({
            where: { postId },
        });
        if (!post)
            return;
        yield post.update({
            status: 'enqueued'
        });
        console.log(`Post sent to RabbitMQ: ${postId}`);
    });
}
exports.savePostToRabbitMQ = savePostToRabbitMQ;
