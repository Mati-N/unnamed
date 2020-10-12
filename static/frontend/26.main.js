(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{"./src/components/layout/Alert.js":
/*!****************************************!*\
  !*** ./src/components/layout/Alert.js ***!
  \****************************************/
/*! exports provided: default */function(e,s,t){"use strict";t.r(s);var o=t(/*! react */"./node_modules/react/index.js"),a=t.n(o),n=t(/*! @material-ui/lab */"./node_modules/@material-ui/lab/esm/index.js"),l=t(/*! recoil */"./node_modules/recoil/es/recoil.js"),r=t(/*! ../../atoms */"./src/atoms.js");s.default=function(){var e=Object(l.useRecoilValue)(r.alertAtom),s=Object(l.useResetRecoilState)(r.alertAtom);return e.message&&a.a.createElement(n.Alert,{onClose:s,severity:e.type},e.message)}}}]);
//# sourceMappingURL=26.main.js.map