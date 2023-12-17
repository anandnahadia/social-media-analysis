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
exports.getAnalysis = exports.createPost = void 0;
const postService_1 = require("../services/postService");
const sequelize_1 = require("sequelize");
const redis_1 = __importDefault(require("../redis"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { textContent, postId } = req.body;
    try {
        if (!textContent || !postId) {
            res.status(400).json({ error: 'textContent and postId are required in the request body' });
            return;
        }
        // Save posts to the database
        yield (0, postService_1.savePosts)(textContent, postId);
        // Enqueue analysis tasks for each post
        (0, postService_1.savePostToRabbitMQ)(postId);
        res.json({ message: 'Posts saved. Analysis will be performed asynchronously.' });
    }
    catch (error) {
        if (error instanceof sequelize_1.UniqueConstraintError) {
            // Handle the specific error related to uniqueness constraint
            res.status(409).json({ error: 'Post with the given postId already exists' });
        }
        else {
            // Handle other errors
            console.error('Error saving posts:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});
exports.createPost = createPost;
const getAnalysis = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    try {
        redis_1.default.get(postId, (err, cachedAnalysis) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error('Redis Error:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            if (cachedAnalysis) {
                console.log("Analysis returning from redis!");
                // If cached, return the cached analysis
                res.json(JSON.parse(cachedAnalysis));
            }
            else {
                console.log("Analysis returning from Database!");
                // If not cached, retrieve analysis from the database
                const analysis = yield (0, postService_1.getPostAnalysis)(postId);
                // Cache the analysis result in Redis with a TTL (time-to-live) of your choice
                redis_1.default.setex(postId, 3600, JSON.stringify(analysis));
                // Return the analysis to the client
                res.json(analysis);
            }
        }));
    }
    catch (error) {
        console.error('Error retrieving analysis:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getAnalysis = getAnalysis;
