"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ExcelColumn_1 = __importDefault(require("./ExcelColumn"));
const ExcelSheet = ({ name, data, dataSet, value, children, }) => {
    if (!children.every((child) => child.type === ExcelColumn_1.default)) {
        throw new Error("<ExcelSheet> can only have <ExcelColumn> as children");
    }
    return null;
};
exports.default = ExcelSheet;
