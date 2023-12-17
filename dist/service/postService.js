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
exports.enqueuePostAnalysis = exports.savePosts = void 0;
const messageQueue_1 = require("../messageQueue");
const savePosts = (posts) => __awaiter(void 0, void 0, void 0, function* () {
    // Implement your logic to save posts to the database
    // ...
});
exports.savePosts = savePosts;
const enqueuePostAnalysis = (postContent) => {
    // Enqueue post analysis task
    messageQueue_1.messageQueue.enqueue('postAnalysis', { postContent });
};
exports.enqueuePostAnalysis = enqueuePostAnalysis;
