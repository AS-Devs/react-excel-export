"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const xlsx_js_style_1 = require("xlsx-js-style");
const DataUtil_1 = require("../utils/DataUtil");
const ExcelFile = ({ hideElement = false, filename = "Download", fileExtension = "xlsx", element = react_1.default.createElement("button", null, "Download"), children, }) => {
    const fileExtensions = [
        "xlsx",
        "xlsm",
        "xlsb",
        "xls",
        "xla",
        "biff2",
        "biff5",
        "biff8",
        "xlml",
        "ods",
        "fods",
        "csv",
        "txt",
        "sylk",
        "slk",
        "html",
        "dif",
        "rtf",
        "prn",
        "eth",
        "dbf",
    ];
    const defaultFileExtension = "xlsx";
    const createSheetData = (sheet) => {
        const columns = sheet.props.children;
        const sheetData = [
            react_1.default.Children.map(columns, (column) => column.props.label),
        ];
        const data = sheet.props.data;
        if (!data)
            throw new Error("No data provided");
        data.forEach((row) => {
            let sheetRow = [];
            react_1.default.Children.forEach(columns, (column) => {
                const getValue = (row) => row[column.props.value];
                const itemValue = getValue(row);
                sheetRow.push(isNaN(Number(itemValue)) ? itemValue || "" : itemValue);
            });
            sheetData.push(sheetRow);
        });
        return sheetData;
    };
    const download = () => {
        const wb = xlsx_js_style_1.utils.book_new();
        const fileName = getFileName();
        const fileExtension = getFileExtension();
        react_1.default.Children.forEach(children, (sheet) => {
            let ws = {};
            const wsName = sheet.props.name || fileName.split(".")[0] || "Sheet1";
            if (typeof sheet.props.dataSet === "undefined" ||
                sheet.props.dataSet.length === 0) {
                ws = (0, DataUtil_1.excelSheetFromAoA)(createSheetData(sheet));
            }
            else {
                ws = (0, DataUtil_1.excelSheetFromDataSet)(sheet.props.dataSet);
            }
            // add worksheet to workbook
            xlsx_js_style_1.utils.book_append_sheet(wb, ws, wsName);
        });
        (0, xlsx_js_style_1.writeFile)(wb, fileName, {
            bookType: fileExtension,
            bookSST: true,
            type: "binary",
            cellStyles: true,
        });
    };
    const getFileName = () => {
        if (filename === null || typeof filename !== "string") {
            throw new Error("Invalid file name provided");
        }
        return getFileNameWithExtension(filename?.split(".")[0], getFileExtension());
    };
    const getFileExtension = () => {
        let extension = fileExtension;
        if (fileExtensions.indexOf(extension) !== -1) {
            return extension;
        }
        // file Extension not provided, we need to get it from the filename
        let extFromFileName = "xlsx";
        if (extension.length === 0) {
            const slugs = filename.split(".");
            if (slugs.length === 0) {
                throw new Error("Invalid file name provided");
            }
            extFromFileName = slugs[slugs.length - 1];
        }
        const isExtensionValid = fileExtensions.includes(extFromFileName.toLowerCase());
        if (isExtensionValid) {
            return extFromFileName;
        }
        return defaultFileExtension;
    };
    const getFileNameWithExtension = (filename, extension) => {
        return `${filename}.${extension}`;
    };
    const handleDownload = () => {
        download();
    };
    if (hideElement) {
        return null;
    }
    else {
        return react_1.default.createElement("span", { onClick: handleDownload }, element);
    }
};
exports.default = ExcelFile;
