(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{"./src/components/post/Comment.js":
/*!****************************************!*\
  !*** ./src/components/post/Comment.js ***!
  \****************************************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var a=n(/*! react */"./node_modules/react/index.js"),o=n.n(a),s=n(/*! react-router-dom */"./node_modules/react-router-dom/esm/react-router-dom.js");t.default=function(e){var t=e.id,n=e.username,a=e.content,c=e.creation;return o.a.createElement("div",{className:"comment card"},o.a.createElement("div",{className:"post-top card-top"},o.a.createElement("div",{className:"post-info-top"},o.a.createElement(s.Link,{to:"user/".concat(t),className:"post-user"}," ",n," "),o.a.createElement("small",{className:"post-time"},timeSince(new Date(c))," ago"," ")),o.a.createElement("pre",{className:"comment-content"},a)))}},"./src/components/post/Comments.js":
/*!*****************************************!*\
  !*** ./src/components/post/Comments.js ***!
  \*****************************************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var a=n(/*! @babel/runtime/helpers/extends */"./node_modules/@babel/runtime/helpers/extends.js"),o=n.n(a),s=n(/*! react */"./node_modules/react/index.js"),c=n.n(s),m=n(/*! ./Comment */"./src/components/post/Comment.js");t.default=function(e){var t=e.comments;return c.a.createElement(c.a.Fragment,null,t.map((function(e){var t=e.node;return c.a.createElement(c.a.Fragment,null,c.a.createElement(m.default,o()({key:"com".concat(t.id)},t)))})))}}}]);
//# sourceMappingURL=8.main.js.map