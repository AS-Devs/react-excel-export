import React from "react";
import { utils, writeFile } from "xlsx-js-style";
import type { BookType, WorkSheet } from "xlsx-js-style";
import { excelSheetFromAoA, excelSheetFromDataSet } from "../utils/DataUtil";
import type {
  DataProps,
  ExcelColumnProps,
  ExcelSheetData,
  ExcelSheetProps,
  ExcelValue,
} from "react-xlsx-wrapper";

interface ExcelFileProps {
  hideElement?: boolean;
  filename?: string;
  fileExtension?: BookType;
  element?: React.ReactNode;
  children: React.ReactElement<ExcelSheetProps<DataProps, ExcelSheetData>>[];
}

const ExcelFile: React.FC<ExcelFileProps> = ({
  hideElement = false,
  filename = "Download",
  fileExtension = "xlsx",
  element = <button>Download</button>,
  children,
}) => {
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
  ] as const;
  const defaultFileExtension = "xlsx";

  const createSheetData = (
    sheet: React.ReactElement<ExcelSheetProps<DataProps, ExcelSheetData>>
  ) => {
    const columns = sheet.props.children;
    const sheetData = [
      React.Children.map(
        columns,
        (column: React.ReactElement<ExcelColumnProps>) => column.props.label
      ),
    ] as ExcelValue[][];

    const data = sheet.props.data;
    if (!data) throw new Error("No data provided");
    data.forEach((row: DataProps) => {
      let sheetRow: ExcelValue[] = [];

      React.Children.forEach(
        columns,
        (column: React.ReactElement<ExcelColumnProps>) => {
          const getValue = (row: DataProps) =>
            row[column.props.value as string];
          const itemValue = getValue(row);
          sheetRow.push(isNaN(Number(itemValue)) ? itemValue || "" : itemValue);
        }
      );

      sheetData.push(sheetRow);
    });

    return sheetData;
  };

  const download = () => {
    const wb = utils.book_new();
    const fileName = getFileName();
    const fileExtension: BookType = getFileExtension();

    React.Children.forEach(children, (sheet) => {
      let ws: WorkSheet = {};
      const wsName = sheet.props.name || fileName.split(".")[0] || "Sheet1";
      if (
        typeof sheet.props.dataSet === "undefined" ||
        sheet.props.dataSet.length === 0
      ) {
        ws = excelSheetFromAoA(createSheetData(sheet));
      } else {
        ws = excelSheetFromDataSet(sheet.props.dataSet);
      }
      // add worksheet to workbook
      utils.book_append_sheet(wb, ws, wsName);
    });

    writeFile(wb, fileName, {
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
    return getFileNameWithExtension(
      filename?.split(".")[0],
      getFileExtension()
    );
  };

  const getFileExtension = (): BookType => {
    let extension = fileExtension;
    if (fileExtensions.indexOf(extension) !== -1) {
      return extension;
    }
    // file Extension not provided, we need to get it from the filename
    let extFromFileName = "xlsx" satisfies BookType;
    if (extension.length === 0) {
      const slugs = filename.split(".");
      if (slugs.length === 0) {
        throw new Error("Invalid file name provided");
      }
      extFromFileName = slugs[slugs.length - 1];
    }
    const isExtensionValid = fileExtensions.includes(
      extFromFileName.toLowerCase() as any
    );

    if (isExtensionValid) {
      return extFromFileName as BookType;
    }

    return defaultFileExtension;
  };

  const getFileNameWithExtension = (filename: string, extension: string) => {
    return `${filename}.${extension}`;
  };

  const handleDownload = () => {
    download();
  };

  if (hideElement) {
    return null;
  } else {
    return <span onClick={handleDownload}>{element}</span>;
  }
};

export default ExcelFile;
