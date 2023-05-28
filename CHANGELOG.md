# CHANGELOG

This log is intended to keep track of backwards-incompatible changes, including
but not limited to API changes and file location changes.  Minor behavioral
changes may not be included if they are not expected to break existing code.

* Export `NaN` values to `#NUM!` and infinite values to `#DIV/0!`

## v1.1.4

* Removed TS config for MultidataSet prop as any. column has some issue. I will check it later...

## v1.1.3

* Removed File Saver as a dependency.

## v1.1.2

* Excel file generating properly


## v1.1.1

* Minor Error Fixed

## v1.1.0

* Minor Error Fixed


## v1.0.9

* Minor Error Fixed

## v1.0.8

* Types changed.
* I hope to resolve this ts related issue.

## v1.0.7

* Changed the structure.
* I hope to resolve this ts related issue.

## v1.0.6

* Changed Index.d.ts still, finding out issue.
* I hope to resolve this ts related issue.

## v1.0.5

* Remove older babel packages
* Upgraded all bebel packages and config
* Example Import changed

## v1.0.4

* Remove XLSX package
* Added xlsx-js-style package instead of tempa-xlsx 
* xlsx-js-style uses XLSX package under the hood (0.18.5 --older public version)
* Fixed "Prototype Pollution" vulnerability (CVE-2023-30533)
* Lots of API changes

## 1.0.3

* Include local XLSX package (0.19.3) -- Latest
* trying out styles with XLSX package