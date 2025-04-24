import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { pipeline } from "@xenova/transformers";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

var VectorStore = /** @class */ (function () {
    function VectorStore() {
        this.store = null;
        this.initialized = false;
    }
    VectorStore.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.initialized) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, (0, transformers_1.pipeline)("feature-extraction", "Xenova/all-MiniLM-L6-v2")];
                    case 1:
                        _a.embedder = _b.sent();
                        // Create memory vector store
                        this.store = new memory_1.MemoryVectorStore(this.embedder);
                        this.initialized = true;
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    VectorStore.prototype.addDocument = function (text_1) {
        return __awaiter(this, arguments, void 0, function (text, metadata) {
            var output, embedding;
            var _a;
            if (metadata === void 0) { metadata = {}; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.initialize()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.embedder(text, { pooling: "mean" })];
                    case 2:
                        output = _b.sent();
                        embedding = Array.from(output.data);
                        // Add to memory store
                        return [4 /*yield*/, ((_a = this.store) === null || _a === void 0 ? void 0 : _a.addDocuments([
                                {
                                    pageContent: text,
                                    metadata: metadata
                                },
                            ]))];
                    case 3:
                        // Add to memory store
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    VectorStore.prototype.similaritySearch = function (query_1) {
        return __awaiter(this, arguments, void 0, function (query, k) {
            var output, embedding, numberEmbedding;
            var _a;
            if (k === void 0) { k = 3; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.initialize()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.embedder(query, { pooling: "mean" })];
                    case 2:
                        output = _b.sent();
                        embedding = Array.from(output.data);
                        numberEmbedding = embedding.map(function (val) { return Number(val); });
                        return [2 /*return*/, ((_a = this.store) === null || _a === void 0 ? void 0 : _a.similaritySearchVectorWithScore(numberEmbedding, k)) || []];
                }
            });
        });
    };
    return VectorStore;
}());
export const vectorStore = new VectorStore();
