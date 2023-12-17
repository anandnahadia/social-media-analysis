"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.connectRabbitMQ = void 0;
const amqp = __importStar(require("amqplib"));
const posts_1 = __importDefault(require("./models/posts"));
function connectRabbitMQ() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        return connection;
    });
}
exports.connectRabbitMQ = connectRabbitMQ;
function consumeMessages(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield connectRabbitMQ();
        const channel = yield connection.createChannel();
        const queueName = 'postAnalysis';
        yield channel.assertQueue(queueName);
        console.log('Waiting for messages. To exit, press CTRL+C');
        channel.consume(queueName, (message) => __awaiter(this, void 0, void 0, function* () {
            if (message !== null) {
                const { postId } = JSON.parse(message.content.toString());
                console.log(`Received post from RabbitMQ for analysis: ${postId}`);
                // Retrieve the post from the database
                const post = yield posts_1.default.findOne({ where: { postId } });
                if (!post)
                    return;
                // Perform analysis (dummy analysis for illustration purposes)
                const words = post.textContent.split(/\s+/);
                const wordCount = words.length;
                const totalLength = words.reduce((acc, word) => acc + word.length, 0);
                const averageLength = words.length > 0 ? totalLength / words.length : 0;
                // Update the post with the analysis results
                yield post.update({
                    numberOfWords: wordCount,
                    averageWordLength: averageLength,
                    status: 'processed'
                });
                console.log(`Analysis completed for post ${postId}: Word Count - ${wordCount}, Average Word Length - ${averageLength} worker id - ${id}`);
                channel.ack(message);
            }
        }));
    });
}
consumeMessages(1);
consumeMessages(2);
