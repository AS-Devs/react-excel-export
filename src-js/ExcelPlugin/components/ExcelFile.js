"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const xlsx_js_style_1 = require("xlsx-js-style");
const DataUtil_1 = require("../utils/DataUtil");
class ExcelFile extends react_1.default.Component {
    state = {
        fileName: "Download",
        fileExtension: "xlsx",
        hideElement: false,
    };
    componentDidMount() {
        if (this.props.filename) {
            this.setState({
                fileName: this.props.filename,
            });
        }
        if (this.props.fileExtension) {
            this.setState({
                fileExtension: this.props.fileExtension,
            });
        }
        if (this.props.hideElement) {
            this.setState({
                hideElement: this.props.hideElement,
            });
        }
    }
    createSheetData = (sheet) => {
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
    download = () => {
        const wb = xlsx_js_style_1.utils.book_new();
        const fileName = this.getFileName();
        const fileExtension = this.getFileExtension();
        react_1.default.Children.forEach(this.props.children, (sheet) => {
            let ws = {};
            const wsName = sheet.props.name || fileName.split(".")[0] || "Sheet1";
            if (typeof sheet.props.dataSet === "undefined" ||
                sheet.props.dataSet.length === 0) {
                ws = (0, DataUtil_1.excelSheetFromAoA)(this.createSheetData(sheet));
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
    getFileNameWithExtension = (filename, extension) => {
        return `${filename}.${extension}`;
    };
    getFileName = () => {
        if (this.state.fileName === null ||
            typeof this.state.fileName !== "string") {
            throw new Error("Invalid file name provided");
        }
        return this.getFileNameWithExtension(this.state.fileName?.split(".")[0], this.getFileExtension());
    };
    getFileExtension = () => {
        let extension = this.state.fileExtension;
        if (this.props.fileExtension?.indexOf(extension) !== -1) {
            return extension;
        }
        // file Extension not provided, we need to get it from the filename
        let extFromFileName = "xlsx";
        if (extension.length === 0) {
            const slugs = this.state.fileName.split(".");
            if (slugs.length === 0) {
                throw new Error("Invalid file name provided");
            }
            extFromFileName = slugs[slugs.length - 1];
        }
        const isExtensionValid = this.props.fileExtension?.includes(extFromFileName.toLowerCase());
        if (isExtensionValid) {
            return extFromFileName;
        }
        return this.state.fileExtension;
    };
    handleDownload = () => {
        this.download();
    };
    render() {
        const { element } = this.props;
        if (this.state.hideElement === true) {
            return null;
        }
        else {
            return react_1.default.createElement("span", { onClick: this.handleDownload }, element);
        }
    }
}
exports.default = ExcelFile;
