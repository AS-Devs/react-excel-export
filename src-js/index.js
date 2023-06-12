"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelColumn = exports.ExcelSheet = void 0;
const ExcelFileNew_1 = __importDefault(require("./ExcelPlugin/components/ExcelFileNew"));
const ExcelSheet_1 = __importDefault(require("./ExcelPlugin/elements/ExcelSheet"));
exports.ExcelSheet = ExcelSheet_1.default;
const ExcelColumn_1 = __importDefault(require("./ExcelPlugin/elements/ExcelColumn"));
exports.ExcelColumn = ExcelColumn_1.default;
ExcelFileNew_1.default.ExcelSheet = ExcelSheet_1.default;
ExcelFileNew_1.default.ExcelColumn = ExcelColumn_1.default;
exports.default = ExcelFileNew_1.default;
