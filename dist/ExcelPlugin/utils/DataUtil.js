"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.excelSheetFromDataSet = exports.excelSheetFromAoA = exports.dateToNumber = exports.strToArrBuffer = void 0;
var xlsx_js_style_1 = require("xlsx-js-style");
/**
 * Converts a string to an ArrayBuffer.
 *
 * @param {string} s The string to convert.
 * @returns {ArrayBuffer} The ArrayBuffer representation of the string.
 *
 * @author Susanta Chakraborty
 * @date 2023-05-31
 */
var strToArrBuffer = function strToArrBuffer(s) {
  // Create a new ArrayBuffer with the same length as the string.
  var buf = new ArrayBuffer(s.length);
  // Create a new Uint8Array view of the ArrayBuffer.
  var view = new Uint8Array(buf);
  // Iterate over the string and copy each character to the ArrayBuffer.
  for (var i = 0; i <= s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF;
  }
  // Return the ArrayBuffer.
  return buf;
};
exports.strToArrBuffer = strToArrBuffer;
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
var dateToNumber = function dateToNumber(v, date1904) {
  // If the date is in Excel 1904 format, add 1462 days to the string representation.
  if (date1904) {
    v += 1462;
  }
  // Parse the string representation of the date into a Date object.
  var epoch = Date.parse(v);
  // Calculate the number of milliseconds since the Unix epoch.
  return (epoch - Number(new Date(Date.UTC(1899, 11, 30)))) / (24 * 60 * 60 * 1000);
};
exports.dateToNumber = dateToNumber;
var excelSheetFromDataSet = function excelSheetFromDataSet(dataSet) {
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
  var ws = {};
  var range = {
    s: {
      c: 10000000,
      r: 10000000
    },
    e: {
      c: 0,
      r: 0
    }
  };
  var rowCount = 0;
  dataSet.forEach(function (dataSetItem) {
    var columns = dataSetItem.columns;
    var xSteps = typeof dataSetItem.xSteps === 'number' ? dataSetItem.xSteps : 0;
    var ySteps = typeof dataSetItem.ySteps === 'number' ? dataSetItem.ySteps : 0;
    var data = dataSetItem.data;
    if (dataSet === undefined || dataSet.length === 0) {
      return;
    }
    rowCount += ySteps;
    var columnsInfo = [];
    if (columns.length >= 0) {
      columns.forEach(function (col, index) {
        var cellRef = xlsx_js_style_1.utils.encode_cell({
          c: xSteps + index,
          r: rowCount
        });
        fixRange(range, 0, 0, rowCount, xSteps, ySteps);
        var colTitle = col;
        if ((0, _typeof2.default)(col) === 'object') {
          //colTitle = col.title; //moved to getHeaderCell
          columnsInfo.push(col.width || {
            wpx: 100,
            hidden: false
          }); /* wch (chars), wpx (pixels) - e.g. [{wch:6},{wpx:50}] */
        }

        getHeaderCell(colTitle, cellRef, ws);
      });
      rowCount += 1;
    }
    if (columnsInfo.length > 0) {
      ws['!cols'] = columnsInfo;
    }
    for (var R = 0; R !== data.length; ++R, rowCount++) {
      for (var C = 0; C !== data[R].length; ++C) {
        var cellRef = xlsx_js_style_1.utils.encode_cell({
          c: C + xSteps,
          r: rowCount
        });
        fixRange(range, R, C, rowCount, xSteps, ySteps);
        getCell(data[R][C], cellRef, ws);
      }
    }
  });
  if (range.s.c < 10000000) {
    ws['!ref'] = xlsx_js_style_1.utils.encode_range(range);
  }
  return ws;
};
exports.excelSheetFromDataSet = excelSheetFromDataSet;
function getHeaderCell(v, cellRef, ws) {
  var cell = {
    t: 's'
  };
  var headerCellStyle = v.style ? v.style : {
    font: {
      bold: true
    }
  }; //if style is then use it
  cell.v = v.title;
  cell.t = 's';
  cell.s = headerCellStyle;
  ws[cellRef] = cell;
}
function getCell(v, cellRef, ws) {
  var isDate = v instanceof Date;
  var cell = {
    t: 's'
  };
  if (v === null) {
    return;
  }
  //assume v is indeed the value. for other cases (object, date...) it will be overriden.
  if ((0, _typeof2.default)(v) !== 'object') {
    cell.v = v;
  }
  // v is not a Date and v is object as well.
  var tempValue = 'Demo Value';
  if ((0, _typeof2.default)(v) === 'object' && !isDate) {
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
    cell.z = xlsx_js_style_1.SSF._table[14];
    cell.v = dateToNumber(tempValue.toString(), false);
  } else {
    cell.t = 's';
  }
  ws[cellRef] = cell;
}
function fixRange(range, R, C, rowCount, xSteps, ySteps) {
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
var excelSheetFromAoA = function excelSheetFromAoA(data) {
  var ws = {};
  var range = {
    s: {
      c: 10000000,
      r: 10000000
    },
    e: {
      c: 0,
      r: 0
    }
  };
  for (var R = 0; R !== data.length; ++R) {
    for (var C = 0; C !== data[R].length; ++C) {
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
      var cell = {
        v: data[R][C],
        t: 's'
      };
      if (cell.v === null) {
        continue;
      }
      var cellRef = xlsx_js_style_1.utils.encode_cell({
        c: C,
        r: R
      });
      if (typeof cell.v === 'number') {
        cell.t = 'n';
      } else if (typeof cell.v === 'boolean') {
        cell.t = 'b';
      } else if (cell.v instanceof Date) {
        var _cell$v;
        cell.t = 'n';
        cell.z = xlsx_js_style_1.SSF._table[14];
        cell.v = dateToNumber((_cell$v = cell.v) === null || _cell$v === void 0 ? void 0 : _cell$v.toDateString(), false);
      } else {
        cell.t = 's';
      }
      ws[cellRef] = cell;
    }
  }
  if (range.s.c < 10000000) {
    ws['!ref'] = xlsx_js_style_1.utils.encode_range(range);
  }
  return ws;
};
exports.excelSheetFromAoA = excelSheetFromAoA;