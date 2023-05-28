# CHANGELOG

This log is intended to keep track of backwards-incompatible changes, including
but not limited to API changes and file location changes.  Minor behavioral
changes may not be included if they are not expected to break existing code.

* Export `NaN` values to `#NUM!` and infinite values to `#DIV/0!`

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