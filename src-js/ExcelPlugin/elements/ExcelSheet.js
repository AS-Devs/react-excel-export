"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ExcelColumn_1 = __importDefault(require("./ExcelColumn"));
class ExcelSheet extends react_1.Component {
    constructor(props) {
        super(props);
        if (!props.children.every((child) => child.type === ExcelColumn_1.default)) {
            throw new Error("<ExcelSheet> can only have <ExcelColumn> as children");
        }
    }
    render() {
        return null;
    }
}
exports.default = ExcelSheet;
