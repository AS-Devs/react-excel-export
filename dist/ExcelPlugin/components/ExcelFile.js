"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _xlsxJsStyle = require("xlsx-js-style");
var _fileSaver = require("file-saver");
var _ExcelSheet = _interopRequireDefault(require("../elements/ExcelSheet"));
var _DataUtil = require("../utils/DataUtil");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var ExcelFile = /*#__PURE__*/function (_React$Component) {
  _inherits(ExcelFile, _React$Component);
  var _super = _createSuper(ExcelFile);
  function ExcelFile(props) {
    var _this;
    _classCallCheck(this, ExcelFile);
    _this = _super.call(this, props);
    _defineProperty(_assertThisInitialized(_this), "fileExtensions", ['xlsx', 'xls', 'csv', 'txt', 'html']);
    _defineProperty(_assertThisInitialized(_this), "defaultFileExtension", 'xlsx');
    if (_this.props.hideElement) {
      _this.download();
    } else {
      _this.handleDownload = _this.download.bind(_assertThisInitialized(_this));
    }
    _this.createSheetData = _this.createSheetData.bind(_assertThisInitialized(_this));
    return _this;
  }
  _createClass(ExcelFile, [{
    key: "createSheetData",
    value: function createSheetData(sheet) {
      var columns = sheet.props.children;
      var sheetData = [_react.default.Children.map(columns, function (column) {
        return column.props.label;
      })];
      var data = typeof sheet.props.data === 'function' ? sheet.props.data() : sheet.props.data;
      data.forEach(function (row) {
        var sheetRow = [];
        _react.default.Children.forEach(columns, function (column) {
          var getValue = typeof column.props.value === 'function' ? column.props.value : function (row) {
            return row[column.props.value];
          };
          var itemValue = getValue(row);
          sheetRow.push(isNaN(itemValue) ? itemValue || '' : itemValue);
        });
        sheetData.push(sheetRow);
      });
      return sheetData;
    }
  }, {
    key: "download",
    value: function download() {
      var _this2 = this;
      var wb = _xlsxJsStyle.utils.book_new();
      var fileName = this.getFileName();
      var fileExtension = this.getFileExtension();
      _react.default.Children.forEach(this.props.children, function (sheet) {
        var ws = {};
        var wsName = sheet.props.name || fileName.split('.')[0] || 'Sheet1';
        if (typeof sheet.props.dataSet === 'undefined' || sheet.props.dataSet.length === 0) {
          ws = (0, _DataUtil.excelSheetFromAoA)(_this2.createSheetData(sheet));
        } else {
          ws = (0, _DataUtil.excelSheetFromDataSet)(sheet.props.dataSet);
        }
        // add worksheet to workbook
        _xlsxJsStyle.utils.book_append_sheet(wb, ws, wsName);
      });
      (0, _xlsxJsStyle.writeFile)(wb, fileName, {
        bookType: fileExtension,
        bookSST: true,
        type: 'binary',
        cellStyles: true
      });
      // saveAs(new Blob([strToArrBuffer(wb)], { type: 'application/octet-stream' }), fileName);
    }
  }, {
    key: "getFileName",
    value: function getFileName() {
      var _this$props$filename;
      if (this.props.filename === null || typeof this.props.filename !== 'string') {
        throw Error('Invalid file name provided');
      }
      return this.getFileNameWithExtension((_this$props$filename = this.props.filename) === null || _this$props$filename === void 0 ? void 0 : _this$props$filename.split('.')[0], this.getFileExtension());
    }
  }, {
    key: "getFileExtension",
    value: function getFileExtension() {
      var extension = this.props.fileExtension;
      if (extension.length === 0) {
        var slugs = this.props.filename.split('.');
        if (slugs.length === 0) {
          throw Error('Invalid file name provided');
        }
        extension = slugs[slugs.length - 1];
      }
      if (this.fileExtensions.indexOf(extension) !== -1) {
        return extension;
      }
      return this.defaultFileExtension;
    }
  }, {
    key: "getFileNameWithExtension",
    value: function getFileNameWithExtension(filename, extension) {
      return "".concat(filename, ".").concat(extension);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        hideElement = _this$props.hideElement,
        element = _this$props.element;
      if (hideElement) {
        return null;
      } else {
        return /*#__PURE__*/_react.default.createElement("span", {
          onClick: this.handleDownload
        }, element);
      }
    }
  }]);
  return ExcelFile;
}(_react.default.Component);
_defineProperty(ExcelFile, "props", {
  hideElement: _propTypes.default.bool,
  filename: _propTypes.default.string,
  fileExtension: _propTypes.default.string,
  element: _propTypes.default.any,
  children: function children(props, propName, componentName) {
    _react.default.Children.forEach(props[propName], function (child) {
      if (child.type !== _ExcelSheet.default) {
        throw new Error('<ExcelFile> can only have <ExcelSheet> as children. ');
      }
    });
  }
});
_defineProperty(ExcelFile, "defaultProps", {
  hideElement: false,
  filename: "Download",
  fileExtension: "xlsx",
  element: /*#__PURE__*/_react.default.createElement("button", null, "Download")
});
var _default = ExcelFile;
exports.default = _default;