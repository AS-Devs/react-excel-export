"use strict";

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
var ExcelColumn_1 = __importDefault(require("./ExcelColumn"));
var ExcelSheet = function ExcelSheet(_ref) {
  var name = _ref.name,
    data = _ref.data,
    dataSet = _ref.dataSet,
    value = _ref.value,
    children = _ref.children;
  if (!children.every(function (child) {
    return child.type === ExcelColumn_1.default;
  })) {
    throw new Error("<ExcelSheet> can only have <ExcelColumn> as children");
  }
  return null;
};
exports.default = ExcelSheet;