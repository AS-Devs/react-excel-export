import React from "react";
import ExcelColumn from "./ExcelColumn";
import type { DataProps, ExcelValue, ExcelSheetData } from "react-xlsx-wrapper";

export interface ExcelSheetProps<D, DS> {
  name: string;
  data?: D[];
  dataSet?: DS[];
  value: ExcelValue[] | (() => void);
  children: React.ReactElement<typeof ExcelColumn>[];
}

const ExcelSheet: React.FC<ExcelSheetProps<DataProps, ExcelSheetData>> = ({
  name,
  data,
  dataSet,
  value,
  children,
}) => {
  if (!children.every((child) => child.type === ExcelColumn)) {
    throw new Error("<ExcelSheet> can only have <ExcelColumn> as children");
  }

  return null;
};

export default ExcelSheet;
