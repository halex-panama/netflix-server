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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const PORT = process.env.PORT || 8000;
const API_KEY = process.env.API_KEY;
const API_URL = "https://api.themoviedb.org/3";
// Helper function to make API requests
const fetchFromTMDB = (endpoint_1, ...args_1) => __awaiter(void 0, [endpoint_1, ...args_1], void 0, function* (endpoint, queryParams = {}) {
    const params = new URLSearchParams(Object.assign({ api_key: API_KEY }, queryParams));
    const response = yield fetch(`${API_URL}${endpoint}?${params}`);
    return response.json();
});
// Define endpoints
app.get("/:mediaType(popular|top_rated)", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mediaType } = req.params;
        const type = mediaType.includes("movie") ? "movie" : "tv";
        const data = yield fetchFromTMDB(`/${type}/${mediaType}`);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.get("/:mediaType(movie|tv)/:id/:info(videos|credits|images|similar)?", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mediaType, id, info } = req.params;
        const endpoint = info
            ? `/${mediaType}/${id}/${info}`
            : `/${mediaType}/${id}`;
        const data = yield fetchFromTMDB(endpoint);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.get("/search/:mediaType(movie|tv)", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mediaType } = req.params;
        const { query, page } = req.query;
        const data = yield fetchFromTMDB(`/search/${mediaType}`, {
            query: query,
            page: page,
        });
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
//# sourceMappingURL=index.js.map