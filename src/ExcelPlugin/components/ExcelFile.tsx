import React from "react";
import { utils, writeFile } from "xlsx-js-style";
import type { BookType, WorkSheet } from "xlsx-js-style";
import { excelSheetFromAoA, excelSheetFromDataSet } from "../utils/DataUtil";
import type {
  ExcelColumnProps,
  ExcelSheetProps,
  ExcelValue,
} from "react-xlsx-wrapper";

interface ExcelFileProps {
  hideElement?: boolean;
  filename?: string;
  fileExtension?: BookType;
  element?: React.ReactNode;
  children: React.ReactElement<ExcelSheetProps>[];
}

class ExcelFile extends React.Component<ExcelFileProps> {
  state = {
    fileName: "Download",
    fileExtension: "xlsx" as BookType,
  };
  static ExcelColumn: typeof import("/Users/susanta96/Develop/OwnProject/AS-Devs/react-xlsx-wrapper/src/ExcelPlugin/elements/ExcelColumn").default;
  static ExcelSheet: typeof import("/Users/susanta96/Develop/OwnProject/AS-Devs/react-xlsx-wrapper/src/ExcelPlugin/elements/ExcelSheet").default;

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
  }

  createSheetData = (sheet: React.ReactElement<ExcelSheetProps>) => {
    const columns = sheet.props.children;
    const sheetData = [
      React.Children.map(
        columns,
        (column: React.ReactElement<ExcelColumnProps>) => column.props.label
      ),
    ] as ExcelValue[][];

    const data = sheet.props.data;
    if (!data) throw new Error("No data provided");
    data.forEach((row: any) => {
      let sheetRow: ExcelValue[] = [];

      React.Children.forEach(
        columns,
        (column: React.ReactElement<ExcelColumnProps>) => {
          const getValue = (row: any) => row[column.props.value as string];
          const itemValue = getValue(row);
          sheetRow.push(isNaN(Number(itemValue)) ? itemValue || "" : itemValue);
        }
      );

      sheetData.push(sheetRow);
    });

    return sheetData;
  };

  download = () => {
    const wb = utils.book_new();
    const fileName = this.getFileName();
    const fileExtension: BookType = this.getFileExtension();

    React.Children.forEach(this.props.children, (sheet) => {
      let ws: WorkSheet = {};
      const wsName = sheet.props.name || fileName.split(".")[0] || "Sheet1";
      if (
        typeof sheet.props.dataSet === "undefined" ||
        sheet.props.dataSet.length === 0
      ) {
        ws = excelSheetFromAoA(this.createSheetData(sheet));
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

  getFileNameWithExtension = (filename: string, extension: string) => {
    return `${filename}.${extension}`;
  };

  getFileName = () => {
    if (
      this.state.fileName === null ||
      typeof this.state.fileName !== "string"
    ) {
      throw new Error("Invalid file name provided");
    }
    return this.getFileNameWithExtension(
      this.state.fileName?.split(".")[0],
      this.getFileExtension()
    );
  };

  getFileExtension = (): BookType => {
    let extension = this.state.fileExtension;
    if (this.props.fileExtension?.indexOf(extension) !== -1) {
      return extension;
    }
    // file Extension not provided, we need to get it from the filename
    let extFromFileName = "xlsx" satisfies BookType;
    if (extension.length === 0) {
      const slugs = this.state.fileName.split(".");
      if (slugs.length === 0) {
        throw new Error("Invalid file name provided");
      }
      extFromFileName = slugs[slugs.length - 1];
    }
    const isExtensionValid = this.props.fileExtension?.includes(
      extFromFileName.toLowerCase() as any
    );

    if (isExtensionValid) {
      return extFromFileName as BookType;
    }

    return this.state.fileExtension;
  };

  handleDownload = () => {
    this.download();
  };

  render() {
    const { hideElement, element } = this.props;

    if (hideElement) {
      return null;
    } else {
      return <span onClick={this.handleDownload}>{element}</span>;
    }
  }
}

export default ExcelFile;
