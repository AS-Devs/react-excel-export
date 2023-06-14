import type { ExcelCellData, ExcelSheetCol, ExcelSheetData, ExcelValue } from "react-xlsx-wrapper";
import { utils, SSF } from "xlsx-js-style";
import type { CellObject, WorkSheet, ColInfo, Range } from "xlsx-js-style";



/**
 * Converts a string to an ArrayBuffer.
 *
 * @param {string} s The string to convert.
 * @returns {ArrayBuffer} The ArrayBuffer representation of the string.
 * 
 * @author Susanta Chakraborty
 * @date 2023-05-31
 */
const strToArrBuffer = (s: string): ArrayBuffer => {
    // Create a new ArrayBuffer with the same length as the string.
    let buf = new ArrayBuffer(s.length);
    // Create a new Uint8Array view of the ArrayBuffer.
    let view = new Uint8Array(buf);

    // Iterate over the string and copy each character to the ArrayBuffer.
    for (let i = 0; i <= s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    // Return the ArrayBuffer.
    return buf;
};

/**
 * Converts a string representation of a date to a number of milliseconds since the Unix epoch.
 *
 * @param v - The string representation of the date.
 * @param date1904 - Whether the date is in Excel 1904 format.
 * @returns The number of milliseconds since the Unix epoch.
 *
 * @author Susanta Chakraborty
 * @date 2023-05-31
 */
const dateToNumber = (v: string, date1904?: boolean): number => {
    // If the date is in Excel 1904 format, add 1462 days to the string representation.
    if (date1904) {
        v += 1462;
    }
    // Parse the string representation of the date into a Date object.
    let epoch = Date.parse(v);
    // Calculate the number of milliseconds since the Unix epoch.
    return (epoch - Number(new Date(Date.UTC(1899, 11, 30)))) / (24 * 60 * 60 * 1000);
};

const excelSheetFromDataSet = (dataSet: ExcelSheetData[], bigHeading?: ExcelSheetCol): WorkSheet => {
    /*
    Assuming the structure of dataset
    {
        xSteps?: number; //How many cells to skips from left
        ySteps?: number; //How many rows to skips from last data
        columns: [array | string]
        data: [array_of_array | string|boolean|number | CellObject]
        fill, font, numFmt, alignment, and border
    }
     */
    if (dataSet === undefined || dataSet.length === 0) {
        return {};
    }
    
    let ws: WorkSheet = {};
    let range: Range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
    let rowCount = 0;

    dataSet.forEach(dataSetItem => {
        let columns = dataSetItem.columns;
        let xSteps = typeof(dataSetItem.xSteps) === 'number' ? dataSetItem.xSteps : 0;
        let ySteps = typeof(dataSetItem.ySteps) === 'number' ? dataSetItem.ySteps : 0;
        let data = dataSetItem.data;
        if (dataSet === undefined || dataSet.length === 0) {
            return;
        }

        rowCount += ySteps;

        if(bigHeading?.title) {
            let mergedRange: Range = { s: { c: xSteps, r: 0 }, e: { c: dataSetItem.columns.length - 1, r: 0 } };
            ws['!merges'] = [mergedRange];
            let cellRef = utils.encode_cell({ c: xSteps, r: rowCount });
            getHeaderCell(bigHeading, cellRef, ws);
            rowCount += 1;
        }

        var columnsInfo: ColInfo[] = [];
        if (columns.length >= 0) {
            columns.forEach((col, index) => {
                var cellRef = utils.encode_cell({ c: xSteps + index, r: rowCount });
                fixRange(range, 0, 0, rowCount, xSteps, ySteps);
                var colTitle = col;
                if (typeof col === 'object'){
                    //colTitle = col.title; //moved to getHeaderCell
                    columnsInfo.push(col.width || { wpx: 100, hidden: false }); /* wch (chars), wpx (pixels) - e.g. [{wch:6},{wpx:50}] */
                }
                getHeaderCell(colTitle, cellRef, ws);
            });

            rowCount += 1;
        }

        if (columnsInfo.length > 0){
            ws['!cols'] = columnsInfo;
        }

        for (let R = 0; R !== data.length; ++R, rowCount++) {
            for (let C = 0; C !== data[R].length; ++C) {
                let cellRef = utils.encode_cell({ c: C + xSteps, r: rowCount });
                fixRange(range, R, C, rowCount, xSteps, ySteps);
                getCell(data[R][C], cellRef, ws);
            }
        }
    });

    if (range.s.c < 10000000) {
        ws['!ref'] = utils.encode_range(range);
    }

    return ws;
};

function getHeaderCell(v: ExcelSheetCol, cellRef: string, ws: WorkSheet): void {
    var cell: CellObject = {
        t:  's',
    };
    var headerCellStyle = v.style ? v.style : { font: { bold: true } }; //if style is then use it
    cell.v = v.title;
    cell.t = 's';
    cell.s = headerCellStyle;
    ws[cellRef] = cell;
}

function getCell(v: ExcelCellData, cellRef: string, ws: WorkSheet): void {
    const isDate = v instanceof Date ;

    var cell: CellObject = { 
        t: 's'
    };
    if (v === null) {
        return;
    }
    
    //assume v is indeed the value. for other cases (object, date...) it will be overriden.
    if (typeof v !== 'object') {
        cell.v = v;
    }
    // v is not a Date and v is object as well.
    let tempValue: Date | number | string | boolean = 'Demo Value';
    if (typeof v === 'object' && !isDate) {
        cell.s = v.style;
        cell.v = v.value;
        tempValue = v.value;
    }
    
    if (typeof tempValue === 'number') {
        cell.t = 'n';
    } else if (typeof tempValue === 'boolean') {
        cell.t = 'b';
    } else if (isDate) {
        cell.t = 'n';
        cell.z = SSF._table[14];
        cell.v = dateToNumber(tempValue.toString(), false);
    } else {
        cell.t = 's';
    }
    ws[cellRef] = cell;
}

function fixRange(range: Range, R: number, C: number, rowCount: number, xSteps: number, ySteps: number): void {
    if (range.s.r > R + rowCount) {
        range.s.r = R + rowCount;
    }

    if (range.s.c > C + xSteps) {
        range.s.c = C + xSteps;
    }

    if (range.e.r < R + rowCount) {
        range.e.r = R + rowCount;
    }

    if (range.e.c < C + xSteps) {
        range.e.c = C + xSteps;
    }
}

const excelSheetFromAoA = (data: ExcelValue[][]): WorkSheet => {
    let ws: WorkSheet = {};
    let range: Range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };

    for (let R = 0; R !== data.length; ++R) {
        for (let C = 0; C !== data[R].length; ++C) {
            if (range.s.r > R) {
                range.s.r = R;
            }

            if (range.s.c > C) {
                range.s.c = C;
            }

            if (range.e.r < R) {
                range.e.r = R;
            }

            if (range.e.c < C) {
                range.e.c = C;
            }

            let cell: CellObject = { v: data[R][C], t: 's' };
            if (cell.v === null) {
                continue;
            }

            let cellRef = utils.encode_cell({ c: C, r: R });
            if (typeof cell.v === 'number') {
                cell.t = 'n';
            } else if (typeof cell.v === 'boolean') {
                cell.t = 'b';
            } else if (cell.v instanceof Date) {
                cell.t = 'n';
                cell.z = SSF._table[14];
                cell.v = dateToNumber(cell.v?.toDateString(), false);
            } else {
                cell.t = 's';
            }

            ws[cellRef] = cell;
        }
    }

    if (range.s.c < 10000000) {
        ws['!ref'] = utils.encode_range(range);
    }

    return ws;
};


export { strToArrBuffer, dateToNumber, excelSheetFromAoA, excelSheetFromDataSet };
