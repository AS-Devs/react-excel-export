import ExcelFile from "./ExcelPlugin/components/ExcelFile";
import ExcelSheet from "./ExcelPlugin/elements/ExcelSheet";
import ExcelColumn from "./ExcelPlugin/elements/ExcelColumn";

ExcelFile.ExcelSheet = ExcelSheet;
ExcelFile.ExcelColumn = ExcelColumn;

export default ExcelFile;

export {
    ExcelSheet,
    ExcelColumn
};
