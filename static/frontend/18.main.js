(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{"./src/components/pages/NewPost.js":
/*!*****************************************!*\
  !*** ./src/components/pages/NewPost.js ***!
  \*****************************************/
/*! exports provided: default */function(module,__webpack_exports__,__webpack_require__){"use strict";eval('__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @apollo/client */ "./node_modules/@apollo/client/index.js");\n/* harmony import */ var _Queries__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Queries */ "./src/Queries.js");\n/* harmony import */ var _context_alert_AlertContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../context/alert/AlertContext */ "./src/context/alert/AlertContext.js");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }\n\nfunction _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }\n\nfunction _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nfunction _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }\n\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\n\n\n\n\n //const { Redirect } = lazy(() => import("react-router-dom"));\n\n\n\nvar NewPost = function NewPost() {\n  var _React$createElement2;\n\n  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({\n    title: "",\n    content: ""\n  }),\n      _useState2 = _slicedToArray(_useState, 2),\n      state = _useState2[0],\n      setState = _useState2[1];\n\n  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(true),\n      _useState4 = _slicedToArray(_useState3, 2),\n      disabled = _useState4[0],\n      setDisabled = _useState4[1];\n\n  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false),\n      _useState6 = _slicedToArray(_useState5, 2),\n      sent = _useState6[0],\n      setSent = _useState6[1];\n\n  var _useMutation = Object(_apollo_client__WEBPACK_IMPORTED_MODULE_1__["useMutation"])(_Queries__WEBPACK_IMPORTED_MODULE_2__["CREATE_POST"]),\n      _useMutation2 = _slicedToArray(_useMutation, 1),\n      addPost = _useMutation2[0];\n\n  var _useContext = Object(react__WEBPACK_IMPORTED_MODULE_0__["useContext"])(_context_alert_AlertContext__WEBPACK_IMPORTED_MODULE_3__["default"]),\n      setAlert = _useContext.setAlert,\n      removeAlert = _useContext.removeAlert;\n\n  var onChange = function onChange(e) {\n    var name = e.target.name;\n    setState(_objectSpread(_objectSpread({}, state), {}, _defineProperty({}, name, e.target.value)));\n\n    switch (name) {\n      case "title":\n        if (e.target.value.length < 1) {\n          setAlert("Title too short", "warning");\n          setDisabled(true);\n        } else if (e.target.value.length > 260) {\n          setAlert("Title too long", "warning");\n          setState(_objectSpread(_objectSpread({}, state), {}, {\n            title: state.title.substring(0, 260)\n          }));\n          setDisabled(true);\n        } else if (state.content.length > 0 && state.content.length <= 5500) {\n          removeAlert();\n          setDisabled(false);\n        }\n\n      case "content":\n        if (e.target.value.length < 1) {\n          setAlert("Content too short", "warning");\n          setDisabled(true);\n        } else if (e.target.value.length > 5500) {\n          setAlert("Content too long", "warning");\n          setState(_objectSpread(_objectSpread({}, state), {}, {\n            content: state.content.substring(0, 5500)\n          }));\n          setDisabled(true);\n        } else if (state.title.length > 0 && state.title.length <= 260) {\n          removeAlert();\n          setDisabled(false);\n        }\n\n    }\n  };\n\n  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {\n    removeAlert();\n  }, []);\n\n  var onSubmit = function onSubmit(e) {\n    e.preventDefault();\n    addPost({\n      variables: {\n        title: state.title,\n        text: state.content\n      },\n      update: function update(cache, _ref) {\n        var data = _ref.data;\n\n        if (cache) {\n          var _cache$readQuery = cache.readQuery({\n            query: _Queries__WEBPACK_IMPORTED_MODULE_2__["GET_POSTS"]\n          }),\n              posts = _cache$readQuery.posts;\n\n          console.log(posts);\n\n          var newData = _objectSpread(_objectSpread({}, posts), {}, {\n            edges: [{\n              __typename: "PostNodeEdge",\n              node: data.createPost.post\n            }].concat(_toConsumableArray(posts.edges))\n          });\n\n          cache.writeQuery({\n            query: _Queries__WEBPACK_IMPORTED_MODULE_2__["GET_POSTS"],\n            data: {\n              posts: newData\n            }\n          });\n        }\n      }\n    })["catch"](function (e) {\n      return console.log(e);\n    }).then(function (data) {\n      if (data) {\n        if (data !== null && data.data.createPost.ok) {\n          setAlert("Post Sent", "primary");\n          setSent(true);\n        } else {\n          setAlert("Something went wrong", "warning");\n        }\n      }\n    });\n  };\n\n  if (sent) return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_4__["Redirect"], {\n    to: "/"\n  });\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {\n    onSubmit: onSubmit,\n    method: "post",\n    className: "form-auth"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n    className: "form-group"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {\n    className: "label-hide",\n    htmlFor: "title"\n  }, "Title"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", _defineProperty({\n    type: "text",\n    className: "form-control",\n    name: "title",\n    placeholder: "Title",\n    "aria-describedby": "emailHelp",\n    value: state.title,\n    onChange: onChange\n  }, "name", "title"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {\n    className: "form-group"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {\n    htmlFor: "content"\n  }, "Content"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("textarea", (_React$createElement2 = {\n    name: "content",\n    value: state.text,\n    className: "form-control"\n  }, _defineProperty(_React$createElement2, "name", "content"), _defineProperty(_React$createElement2, "rows", "3"), _defineProperty(_React$createElement2, "onChange", onChange), _defineProperty(_React$createElement2, "id", "content"), _React$createElement2))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {\n    disabled: disabled,\n    type: "submit",\n    className: "btn btn-teal"\n  }, "Submit")));\n};\n\n/* harmony default export */ __webpack_exports__["default"] = (NewPost);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9wYWdlcy9OZXdQb3N0LmpzPzc2OWYiXSwibmFtZXMiOlsiTmV3UG9zdCIsInVzZVN0YXRlIiwidGl0bGUiLCJjb250ZW50Iiwic3RhdGUiLCJzZXRTdGF0ZSIsImRpc2FibGVkIiwic2V0RGlzYWJsZWQiLCJzZW50Iiwic2V0U2VudCIsInVzZU11dGF0aW9uIiwiQ1JFQVRFX1BPU1QiLCJhZGRQb3N0IiwidXNlQ29udGV4dCIsIkFsZXJ0Q29udGV4dCIsInNldEFsZXJ0IiwicmVtb3ZlQWxlcnQiLCJvbkNoYW5nZSIsImUiLCJuYW1lIiwidGFyZ2V0IiwidmFsdWUiLCJsZW5ndGgiLCJzdWJzdHJpbmciLCJ1c2VFZmZlY3QiLCJvblN1Ym1pdCIsInByZXZlbnREZWZhdWx0IiwidmFyaWFibGVzIiwidGV4dCIsInVwZGF0ZSIsImNhY2hlIiwiZGF0YSIsInJlYWRRdWVyeSIsInF1ZXJ5IiwiR0VUX1BPU1RTIiwicG9zdHMiLCJjb25zb2xlIiwibG9nIiwibmV3RGF0YSIsImVkZ2VzIiwiX190eXBlbmFtZSIsIm5vZGUiLCJjcmVhdGVQb3N0IiwicG9zdCIsIndyaXRlUXVlcnkiLCJ0aGVuIiwib2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtDQUVBOztBQUNBOztBQUVBLElBQU1BLE9BQU8sR0FBRyxTQUFWQSxPQUFVLEdBQU07QUFBQTs7QUFBQSxrQkFDTUMsc0RBQVEsQ0FBQztBQUFFQyxTQUFLLEVBQUUsRUFBVDtBQUFhQyxXQUFPLEVBQUU7QUFBdEIsR0FBRCxDQURkO0FBQUE7QUFBQSxNQUNiQyxLQURhO0FBQUEsTUFDTkMsUUFETTs7QUFBQSxtQkFFWUosc0RBQVEsQ0FBQyxJQUFELENBRnBCO0FBQUE7QUFBQSxNQUViSyxRQUZhO0FBQUEsTUFFSEMsV0FGRzs7QUFBQSxtQkFHSU4sc0RBQVEsQ0FBQyxLQUFELENBSFo7QUFBQTtB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Q0UscUlBQ0U7QUFBTSxZQUFRLEVBQUVpQixRQUFoQjtBQUEwQixVQUFNLEVBQUMsTUFBakM7QUFBd0MsYUFBUyxFQUFDO0FBQWxELGtCQUNFO0FBQUssYUFBUyxFQUFDO0FBQWYsa0JBQ0U7QUFBTyxhQUFTLEVBQUMsWUFBakI7QUFBOEIsV0FBTyxFQUFDO0FBQXRDLGFBREYsZUFJRTtBQUNFLFFBQUksRUFBQyxNQURQO0FBRUUsYUFBUyxFQUFDLGNBRlo7QUFHRSxRQUFJLEVBQUMsT0FIUDtBQUlFLGVBQVcsRUFBQyxPQUpkO0FBS0Usd0JBQWlCLFdBTG5CO0FBTUUsU0FBSyxFQUFFckIsS0FBSyxDQUFDRixLQU5mO0FBT0UsWUFBUSxFQUFFZTtBQVBaLGFBUU8sT0FSUCxFQUpGLENBREYsZUFnQkU7QUFBSyxhQUFTLEVBQUM7QUFBZixrQkFDRTtBQUFPLFdBQU8sRUFBQztBQUFmLGVBREYsZUFFRTtBQUNFLFFBQUksRUFBQyxTQURQO0FBRUUsU0FBSyxFQUFFYixLQUFLLENBQUN3QixJQUZmO0FBR0UsYUFBUyxFQUFDO0FBSFosb0RBSU8sU0FKUCxrREFLTyxHQUxQLHNEQU1ZWCxRQU5aLGdEQU9LLFNBUEwsMEJBRkYsQ0FoQkYsZUE0QkU7QUFBUSxZQUFRLEVBQUVYLFFBQWxCO0FBQTRCLFFBQUksRUFBQyxRQUFqQztBQUEwQyxhQUFTLEVBQUM7QUFBcEQsY0E1QkYsQ0FERixDQURGO0FBb0NELENBeEhEOztBQTBIZU4sc0VBQWYiLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9wYWdlcy9OZXdQb3N0LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VDb250ZXh0LCB1c2VFZmZlY3QsIGxhenkgfSBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgdXNlTXV0YXRpb24gfSBmcm9tIFwiQGFwb2xsby9jbGllbnRcIjtcclxuaW1wb3J0IHsgQ1JFQVRFX1BPU1QsIEdFVF9QT1NUUyB9IGZyb20gXCIuLi8uLi9RdWVyaWVzXCI7XHJcbmltcG9ydCBBbGVydENvbnRleHQgZnJvbSBcIi4uLy4uL2NvbnRleHQvYWxlcnQvQWxlcnRDb250ZXh0XCI7XHJcbi8vY29uc3QgeyBSZWRpcmVjdCB9ID0gbGF6eSgoKSA9PiBpbXBvcnQoXCJyZWFjdC1yb3V0ZXItZG9tXCIpKTtcclxuaW1wb3J0IHsgUmVkaXJlY3QgfSBmcm9tIFwicmVhY3Qtcm91dGVyLWRvbVwiO1xyXG5cclxuY29uc3QgTmV3UG9zdCA9ICgpID0+IHtcclxuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlKHsgdGl0bGU6IFwiXCIsIGNvbnRlbnQ6IFwiXCIgfSk7XHJcbiAgY29uc3QgW2Rpc2FibGVkLCBzZXREaXNhYmxlZF0gPSB1c2VTdGF0ZSh0cnVlKTtcclxuICBjb25zdCBbc2VudCwgc2V0U2VudF0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgY29uc3QgW2FkZFBvc3RdID0gdXNlTXV0YXRpb24oQ1JFQVRFX1BPU1QpO1xyXG4gIGNvbnN0IHsgc2V0QWxlcnQsIHJlbW92ZUFsZXJ0IH0gPSB1c2VDb250ZXh0KEFsZXJ0Q29udGV4dCk7XHJcblxyXG4gIGNvbnN0IG9uQ2hhbmdlID0gKGUpID0+IHtcclxuICAgIGxldCBuYW1lID0gZS50YXJnZXQubmFtZTtcclxuICAgIHNldFN0YXRlKHsgLi4uc3RhdGUsIFtuYW1lXTogZS50YXJnZXQudmFsdWUgfSk7XHJcbiAgICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgICAgY2FzZSBcInRpdGxlXCI6XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0LnZhbHVlLmxlbmd0aCA8IDEpIHtcclxuICAgICAgICAgIHNldEFsZXJ0KFwiVGl0bGUgdG9vIHNob3J0XCIsIFwid2FybmluZ1wiKTtcclxuICAgICAgICAgIHNldERpc2FibGVkKHRydWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZS50YXJnZXQudmFsdWUubGVuZ3RoID4gMjYwKSB7XHJcbiAgICAgICAgICBzZXRBbGVydChcIlRpdGxlIHRvbyBsb25nXCIsIFwid2FybmluZ1wiKTtcclxuICAgICAgICAgIHNldFN0YXRlKHsgLi4uc3RhdGUsIHRpdGxlOiBzdGF0ZS50aXRsZS5zdWJzdHJpbmcoMCwgMjYwKSB9KTtcclxuICAgICAgICAgIHNldERpc2FibGVkKHRydWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUuY29udGVudC5sZW5ndGggPiAwICYmIHN0YXRlLmNvbnRlbnQubGVuZ3RoIDw9IDU1MDApIHtcclxuICAgICAgICAgIHJlbW92ZUFsZXJ0KCk7XHJcbiAgICAgICAgICBzZXREaXNhYmxlZChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICBjYXNlIFwiY29udGVudFwiOlxyXG4gICAgICAgIGlmIChlLnRhcmdldC52YWx1ZS5sZW5ndGggPCAxKSB7XHJcbiAgICAgICAgICBzZXRBbGVydChcIkNvbnRlbnQgdG9vIHNob3J0XCIsIFwid2FybmluZ1wiKTtcclxuICAgICAgICAgIHNldERpc2FibGVkKHRydWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZS50YXJnZXQudmFsdWUubGVuZ3RoID4gNTUwMCkge1xyXG4gICAgICAgICAgc2V0QWxlcnQoXCJDb250ZW50IHRvbyBsb25nXCIsIFwid2FybmluZ1wiKTtcclxuICAgICAgICAgIHNldFN0YXRlKHsgLi4uc3RhdGUsIGNvbnRlbnQ6IHN0YXRlLmNvbnRlbnQuc3Vic3RyaW5nKDAsIDU1MDApIH0pO1xyXG4gICAgICAgICAgc2V0RGlzYWJsZWQodHJ1ZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZS50aXRsZS5sZW5ndGggPiAwICYmIHN0YXRlLnRpdGxlLmxlbmd0aCA8PSAyNjApIHtcclxuICAgICAgICAgIHJlbW92ZUFsZXJ0KCk7XHJcbiAgICAgICAgICBzZXREaXNhYmxlZChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICByZW1vdmVBbGVydCgpO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgY29uc3Qgb25TdWJtaXQgPSAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgYWRkUG9zdCh7XHJcbiAgICAgIHZhcmlhYmxlczogeyB0aXRsZTogc3RhdGUudGl0bGUsIHRleHQ6IHN0YXRlLmNvbnRlbnQgfSxcclxuICAgICAgdXBkYXRlOiAoY2FjaGUsIHsgZGF0YSB9KSA9PiB7XHJcbiAgICAgICAgaWYgKGNhY2hlKSB7XHJcbiAgICAgICAgICBsZXQgeyBwb3N0cyB9ID0gY2FjaGUucmVhZFF1ZXJ5KHsgcXVlcnk6IEdFVF9QT1NUUyB9KTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHBvc3RzKTtcclxuICAgICAgICAgIGNvbnN0IG5ld0RhdGEgPSB7XHJcbiAgICAgICAgICAgIC4uLnBvc3RzLFxyXG4gICAgICAgICAgICBlZGdlczogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9fdHlwZW5hbWU6IFwiUG9zdE5vZGVFZGdlXCIsXHJcbiAgICAgICAgICAgICAgICBub2RlOiBkYXRhLmNyZWF0ZVBvc3QucG9zdCxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIC4uLnBvc3RzLmVkZ2VzLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGNhY2hlLndyaXRlUXVlcnkoe1xyXG4gICAgICAgICAgICBxdWVyeTogR0VUX1BPU1RTLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgcG9zdHM6IG5ld0RhdGEsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICB9KVxyXG4gICAgICAuY2F0Y2goKGUpID0+IGNvbnNvbGUubG9nKGUpKVxyXG4gICAgICAudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICBpZiAoZGF0YSAhPT0gbnVsbCAmJiBkYXRhLmRhdGEuY3JlYXRlUG9zdC5vaykge1xyXG4gICAgICAgICAgICBzZXRBbGVydChcIlBvc3QgU2VudFwiLCBcInByaW1hcnlcIik7XHJcbiAgICAgICAgICAgIHNldFNlbnQodHJ1ZSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZXRBbGVydChcIlNvbWV0aGluZyB3ZW50IHdyb25nXCIsIFwid2FybmluZ1wiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGlmIChzZW50KSByZXR1cm4gPFJlZGlyZWN0IHRvPVwiL1wiIC8+O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPD5cclxuICAgICAgPGZvcm0gb25TdWJtaXQ9e29uU3VibWl0fSBtZXRob2Q9XCJwb3N0XCIgY2xhc3NOYW1lPVwiZm9ybS1hdXRoXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwibGFiZWwtaGlkZVwiIGh0bWxGb3I9XCJ0aXRsZVwiPlxyXG4gICAgICAgICAgICBUaXRsZVxyXG4gICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICB0eXBlPVwidGV4dFwiXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXHJcbiAgICAgICAgICAgIG5hbWU9XCJ0aXRsZVwiXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiVGl0bGVcIlxyXG4gICAgICAgICAgICBhcmlhLWRlc2NyaWJlZGJ5PVwiZW1haWxIZWxwXCJcclxuICAgICAgICAgICAgdmFsdWU9e3N0YXRlLnRpdGxlfVxyXG4gICAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XHJcbiAgICAgICAgICAgIG5hbWU9XCJ0aXRsZVwiXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJjb250ZW50XCI+Q29udGVudDwvbGFiZWw+XHJcbiAgICAgICAgICA8dGV4dGFyZWFcclxuICAgICAgICAgICAgbmFtZT1cImNvbnRlbnRcIlxyXG4gICAgICAgICAgICB2YWx1ZT17c3RhdGUudGV4dH1cclxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcclxuICAgICAgICAgICAgbmFtZT1cImNvbnRlbnRcIlxyXG4gICAgICAgICAgICByb3dzPVwiM1wiXHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICAgICAgaWQ9XCJjb250ZW50XCJcclxuICAgICAgICAgID48L3RleHRhcmVhPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxidXR0b24gZGlzYWJsZWQ9e2Rpc2FibGVkfSB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi10ZWFsXCI+XHJcbiAgICAgICAgICBTdWJtaXRcclxuICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgPC9mb3JtPlxyXG4gICAgPC8+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE5ld1Bvc3Q7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/components/pages/NewPost.js\n')}}]);