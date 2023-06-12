import ExcelFile from "./ExcelPlugin/components/ExcelFileNew";
import ExcelSheet from "./ExcelPlugin/elements/ExcelSheet";
import ExcelColumn from "./ExcelPlugin/elements/ExcelColumn";

ExcelFile.ExcelSheet = ExcelSheet;
ExcelFile.ExcelColumn = ExcelColumn;

export default ExcelFile;

export {
    ExcelSheet,
    ExcelColumn
};
