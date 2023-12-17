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
exports.getAnalysis = void 0;
const analysisService_1 = require("../services/analysisService");
const getAnalysis = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    try {
        // Get analysis for the specified post
        const analysisResult = yield (0, analysisService_1.getPostAnalysis)(postId);
        res.json(analysisResult);
    }
    catch (error) {
        console.error(`Error getting analysis for post ${postId}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getAnalysis = getAnalysis;
