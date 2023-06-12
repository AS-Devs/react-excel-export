"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExcelSheet = void 0;
var react_1 = require("react");
var ExcelColumn_1 = __importDefault(require("./ExcelColumn"));
var ExcelSheet = /*#__PURE__*/function (_react_1$Component) {
  (0, _inherits2.default)(ExcelSheet, _react_1$Component);
  var _super = _createSuper(ExcelSheet);
  function ExcelSheet(props) {
    var _this;
    (0, _classCallCheck2.default)(this, ExcelSheet);
    _this = _super.call(this, props);
    if (!props.children.every(function (child) {
      return child.type === ExcelColumn_1.default;
    })) {
      throw new Error("<ExcelSheet> can only have <ExcelColumn> as children");
    }
    return _this;
  }
  (0, _createClass2.default)(ExcelSheet, [{
    key: "render",
    value: function render() {
      return null;
    }
  }]);
  return ExcelSheet;
}(react_1.Component);
exports.ExcelSheet = ExcelSheet;
exports.default = ExcelSheet;