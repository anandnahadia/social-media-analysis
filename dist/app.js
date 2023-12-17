"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const postController_1 = require("./controllers/postController");
const rabbitmq_1 = require("./rabbitmq");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const app = (0, express_1.default)();
const port = 3000;
// Apply IP-based rate limiting middleware
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after a few minutes',
});
app.use(limiter);
app.use(body_parser_1.default.json());
(0, rabbitmq_1.connectRabbitMQ)();
// Create post endpoint
app.post('/api/v1/posts', postController_1.createPost);
// Get analysis endpoint
app.get('/api/v1/posts/:id/analysis', postController_1.getAnalysis);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
