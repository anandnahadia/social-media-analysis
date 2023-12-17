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
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageQueue = void 0;
const redis_1 = require("redis");
class MessageQueue {
    constructor() {
        this.client = (0, redis_1.createClient)();
        this.intervals = new Map();
        this.client.on('error', (err) => {
            console.error(`Redis Error: ${err}`);
        });
    }
    enqueue(queue, data) {
        console.log("data", JSON.stringify(data), queue);
        this.client.rpush(queue, JSON.stringify(data));
    }
    process(queue, handler) {
        // Start with no interval
        this.intervals.set(queue, null);
        console.log("queue", queue);
        // Function to check the queue and process data
        const checkQueueAndProcess = () => __awaiter(this, void 0, void 0, function* () {
            // const queueContentBefore = await this.client.lrange(queue, 0, -1);
            // console.log(`Queue content before dequeue: ${queueContentBefore}`);
            const dataString = yield this.client.lpop(queue);
            if (dataString) {
                const data = JSON.parse(dataString);
                console.log('Processing data:', dataString);
                yield handler(data);
            }
            else {
                // Queue is empty, stop processing until data is available
                const currentInterval = this.intervals.get(queue);
                if (currentInterval) {
                    clearInterval(currentInterval);
                    this.intervals.set(queue, null);
                }
            }
        });
        // Set an interval to check the queue periodically
        this.intervals.set(queue, setInterval(checkQueueAndProcess, 1000) // Adjust the interval based on your needs
        );
    }
}
exports.messageQueue = new MessageQueue();
