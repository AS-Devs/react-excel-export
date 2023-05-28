import React from "react";
import PropTypes from "prop-types";
import { utils, writeFile } from "xlsx-js-style";
import { saveAs } from 'file-saver';
import ExcelSheet from "../elements/ExcelSheet";
import { excelSheetFromAoA, excelSheetFromDataSet, strToArrBuffer } from "../utils/DataUtil";

class ExcelFile extends React.Component {
    static props = {
        hideElement: PropTypes.bool,
        filename: PropTypes.string,
        fileExtension: PropTypes.string,
        element: PropTypes.any,
        children: function (props, propName, componentName) {
            React.Children.forEach(props[propName], child => {
                if (child.type !== ExcelSheet) {
                    throw new Error('<ExcelFile> can only have <ExcelSheet> as children. ');
                }
            });
        }
    };

    static defaultProps = {
        hideElement: false,
        filename: "Download",
        fileExtension: "xlsx",
        element: <button>Download</button>
    };

    constructor(props) {
        super(props);

        if (this.props.hideElement) {
            this.download();
        } else {
            this.handleDownload = this.download.bind(this);
        }

        this.createSheetData = this.createSheetData.bind(this);
    }

    fileExtensions = ['xlsx', 'xls', 'csv', 'txt', 'html'];
    defaultFileExtension = 'xlsx';

    createSheetData(sheet) {
        const columns = sheet.props.children;
        const sheetData = [React.Children.map(columns, column => column.props.label)];
        const data = typeof (sheet.props.data) === 'function' ? sheet.props.data() : sheet.props.data;

        data.forEach(row => {
            const sheetRow = [];

            React.Children.forEach(columns, column => {
                const getValue = typeof (column.props.value) === 'function' ? column.props.value : row => row[column.props.value];
                const itemValue = getValue(row);
                sheetRow.push(isNaN(itemValue) ? (itemValue || '') : itemValue);
            });

            sheetData.push(sheetRow);
        });

        return sheetData;
    }

    download() {
        const wb = utils.book_new();
        const fileName = this.getFileName();
        const fileExtension = this.getFileExtension();

        React.Children.forEach(this.props.children, sheet => {
            let ws = {};
            const wsName = sheet.props.name || fileName.split('.')[0] || 'Sheet1';
            if (typeof sheet.props.dataSet === 'undefined' || sheet.props.dataSet.length === 0) {
                ws = excelSheetFromAoA(this.createSheetData(sheet));
            } else {
                ws = excelSheetFromDataSet(sheet.props.dataSet);
            }
            // add worksheet to workbook
            utils.book_append_sheet(wb, ws, wsName);
        });


        writeFile(wb, fileName, { bookType: fileExtension, bookSST: true, type: 'binary', cellStyles: true });
        // saveAs(new Blob([strToArrBuffer(wb)], { type: 'application/octet-stream' }), fileName);

    }
        
    

    getFileName() {
        if (this.props.filename === null || typeof this.props.filename !== 'string') {
            throw Error('Invalid file name provided');
        }
        return this.getFileNameWithExtension(this.props.filename?.split('.')[0], this.getFileExtension());
    }

    getFileExtension() {
        let extension = this.props.fileExtension;

        if (extension.length === 0) {
            const slugs = this.props.filename.split('.');
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

    getFileNameWithExtension(filename, extension) {
        return `${filename}.${extension}`;
    }

    render() {
        const { hideElement, element } = this.props;

        if (hideElement) {
            return null;
        } else {
            return (<span onClick={this.handleDownload}>{element}</span>);
        }
        
    }
}

export default ExcelFile;
