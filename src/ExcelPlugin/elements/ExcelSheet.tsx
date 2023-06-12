import React, { Component } from "react";
import ExcelColumn from "./ExcelColumn";
import type { DataProps, ExcelValue, ExcelSheetData } from "react-xlsx-wrapper";

export interface ExcelSheetProps<D, DS> {
  name: string;
  data?: D[];
  dataSet?: DS[];
  value: ExcelValue[] | (() => void);
  children: React.ReactElement<typeof ExcelColumn>[];
}
export default class ExcelSheet extends Component<
  ExcelSheetProps<DataProps, ExcelSheetData>
> {
  constructor(props: ExcelSheetProps<DataProps, ExcelSheetData>) {
    super(props);

    if (!props.children.every((child) => child.type === ExcelColumn)) {
      throw new Error("<ExcelSheet> can only have <ExcelColumn> as children");
    }
  }

  render() {
    return null;
  }
}
