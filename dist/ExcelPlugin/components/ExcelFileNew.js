"use strict";

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
var react_1 = __importDefault(require("react"));
var xlsx_js_style_1 = require("xlsx-js-style");
var DataUtil_1 = require("../utils/DataUtil");
var ExcelFile = function ExcelFile(_ref) {
  var _ref$hideElement = _ref.hideElement,
    hideElement = _ref$hideElement === void 0 ? false : _ref$hideElement,
    _ref$filename = _ref.filename,
    filename = _ref$filename === void 0 ? "Download" : _ref$filename,
    _ref$fileExtension = _ref.fileExtension,
    fileExtension = _ref$fileExtension === void 0 ? "xlsx" : _ref$fileExtension,
    _ref$element = _ref.element,
    element = _ref$element === void 0 ? react_1.default.createElement("button", null, "Download") : _ref$element,
    children = _ref.children;
  var fileExtensions = ["xlsx", "xls", "csv", "txt", "html"];
  var defaultFileExtension = "xlsx";
  var createSheetData = function createSheetData(sheet) {
    var columns = sheet.props.children;
    var sheetData = [react_1.default.Children.map(columns, function (column) {
      return column.props.label;
    })];
    var data = sheet.props.data;
    if (!data) throw new Error("No data provided");
    data.forEach(function (row) {
      var sheetRow = [];
      react_1.default.Children.forEach(columns, function (column) {
        var getValue = function getValue(row) {
          return row[column.props.value];
        };
        var itemValue = getValue(row);
        sheetRow.push(isNaN(Number(itemValue)) ? itemValue || "" : itemValue);
      });
      sheetData.push(sheetRow);
    });
    return sheetData;
  };
  var download = function download() {
    var wb = xlsx_js_style_1.utils.book_new();
    var fileName = getFileName();
    var fileExtension = getFileExtension();
    react_1.default.Children.forEach(children, function (sheet) {
      var ws = {};
      var wsName = sheet.props.name || fileName.split(".")[0] || "Sheet1";
      if (typeof sheet.props.dataSet === "undefined" || sheet.props.dataSet.length === 0) {
        ws = (0, DataUtil_1.excelSheetFromAoA)(createSheetData(sheet));
      } else {
        ws = (0, DataUtil_1.excelSheetFromDataSet)(sheet.props.dataSet);
      }
      // add worksheet to workbook
      xlsx_js_style_1.utils.book_append_sheet(wb, ws, wsName);
    });
    (0, xlsx_js_style_1.writeFile)(wb, fileName, {
      bookType: fileExtension,
      bookSST: true,
      type: "binary",
      cellStyles: true
    });
  };
  var getFileName = function getFileName() {
    if (filename === null || typeof filename !== "string") {
      throw new Error("Invalid file name provided");
    }
    return getFileNameWithExtension(filename === null || filename === void 0 ? void 0 : filename.split(".")[0], getFileExtension());
  };
  var getFileExtension = function getFileExtension() {
    var extension = fileExtension;
    if (extension.length === 0) {
      var slugs = filename.split(".");
      if (slugs.length === 0) {
        throw new Error("Invalid file name provided");
      }
      extension = slugs[slugs.length - 1];
    }
    if (fileExtensions.indexOf(extension) !== -1) {
      return extension;
    }
    return defaultFileExtension;
  };
  var getFileNameWithExtension = function getFileNameWithExtension(filename, extension) {
    return "".concat(filename, ".").concat(extension);
  };
  var handleDownload = function handleDownload() {
    download();
  };
  if (hideElement) {
    return null;
  } else {
    return react_1.default.createElement("span", {
      onClick: handleDownload
    }, element);
  }
};
exports.default = ExcelFile;