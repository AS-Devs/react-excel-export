"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const xlsx_js_style_1 = require("xlsx-js-style");
const ExcelFile = ({ hideElement = false, filename = "Download", fileExtension = "xlsx", element = react_1.default.createElement("button", null, "Download"), children, }) => {
    const fileExtensions = ["xlsx", "xls", "csv", "txt", "html"];
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
                const getValue = typeof column.props.value === "function"
                    ? column.props.value
                    : (row) => row[column.props.value];
                const itemValue = getValue(row);
                sheetRow.push(isNaN(itemValue) ? itemValue || "" : itemValue);
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
                // ws = excelSheetFromAoA(createSheetData(sheet));
            }
            else {
                // ws = excelSheetFromDataSet(sheet.props.dataSet);
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
        if (extension.length === 0) {
            const slugs = filename.split(".");
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
