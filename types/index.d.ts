declare module 'react-xlsx-wrapper' {
  import * as React from 'react';
  
  export type DataProps = {
    [key: string]: ExcelValue;
  };

  // export interface ExcelFile {
  //   ExcelSheet: ExcelSheet
  //   ExcelColumn: ExcelColumn;
  // }

  export interface ExcelFile {
    ExcelSheet: ExcelSheetProps<DataProps|undefined, ExcelSheetData|undefined>;
    ExcelColumn: ExcelColumnProps;
  }

  export interface ExcelFileProps {
    filename?: string;
    fileExtension?: string;
    element?: React.ReactElement; //Download Element
    children?: Array<React.ReactElement> | React.ReactElement; // Array<ExcelSheetProps>;
  }

  export interface ExcelSheetProps<D, DS> {
    name: string;
    data?: D[];
    dataSet?: DS[];
    value: ExcelValue[] | (() => void);
    children: React.ReactElement | Array<React.ReactElement>;
  }

  export interface ExcelSheetData {
    xSteps?: number;
    ySteps?: number;
    columns: ExcelSheetCol[];
    data: ExcelCellData[][];
  }

  export interface ExcelSheetCol {
    title: string;
    width?: ExcelWidth;
    style?: ExcelStyle;
  }

  export interface ExcelWidth {
   /** width in screen pixels */
   wpx?: number;

   /** width in "characters" */
   wch?: number;
    /** hidden column if true, default, false */
   hidden?: boolean;
  }

  export type ExcelCellData = ExcelValue | ExcelCell;
  export type ExcelValue = string | number | boolean | Date;

  export interface ExcelCell {
    value: string | number | boolean | Date;
    style: ExcelStyle;
  }

  export interface ExcelColumnProps {
    label: string;
    value: ExcelValue;
  }

  export interface ExcelStyle {
    fill?: ExcelCellFillType;
    font?: ExcelFont;
    numFmt?: ExcelNumFormat;
    alignment?: ExcelAlignment;
    border?: ExcelBorder;
  }

  /* ExcelCell Fill Type */
  export type ExcelCellPatternType = "solid" | "none";

  export interface ExcelColorSpec {
    auto?: number; //default 1
    rgb?: string; //hex ARGB color
    theme?: ExcelTheme;
    indexed?: number;
  }

  export interface ExcelTheme {
    theme: string;
    tint: string;
  }

  export interface ExcelCellFillType {
    patternType?: ExcelCellPatternType;
    fgColor?: ExcelColorSpec;
    bgColor?: ExcelColorSpec;
  }

  /* Excel Font */
  export interface ExcelFont {
    name?: string;          // default `"Calibri"`
    sz?: number;             //font size in points default 11
    color?: ExcelColorSpec;
    bold?: boolean;
    underline?: boolean;
    italic?: boolean;
    strike?: boolean;
    outline?: boolean;
    shadow?: boolean;
    vertAlign?: boolean;
  }

  /* ExcelNumFormat */
  export type ExcelNumFormat = "0" | "0.00%" | "0.0%" | "0.00%;\\(0.00%\\);\\-;@" | "m/dd/yy" | string;

  /* ExcelAlignment */
  export interface ExcelAlignment {
    vertical?: ExcelAlignmentType;
    horizontal?: ExcelAlignmentType;
    wrapText?: boolean;
    readingOrder?: ExcelReadingOrder;
    textRotation?: ExcelTextRotation;
  }

  export type ExcelTextRotation = 0 | 45 | 90 | 135 | 180 | 255;

  export enum ExcelReadingOrder { LeftToRight = 1, RightToLeft}

  export type ExcelAlignmentType = "bottom" | "center" | "top";

  /* ExcelBorder */
  export interface ExcelBorder {
    style: ExcelBorderStyle;
    color: ExcelColorSpec;
  }

  export type ExcelBorderStyle =
    "thin"
    | "medium"
    | "thick"
    | "dotted"
    | "hair"
    | "dashed"
    | "mediumDashed"
    | "dashDot"
    | "mediumDashDot"
    | "dashDotDot"
    | "mediumDashDotDot"
    | "slantDashDot";

}
