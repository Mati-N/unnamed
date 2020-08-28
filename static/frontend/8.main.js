(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{"./src/components/post/Comment.js":
/*!****************************************!*\
  !*** ./src/components/post/Comment.js ***!
  \****************************************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var a=n(/*! react */"./node_modules/react/index.js"),s=n.n(a);t.default=function(e){var t=e.id,n=e.username,a=e.content,c=e.creation;return s.a.createElement("div",{className:"comment card"},s.a.createElement("div",{className:"post-top card-top"},s.a.createElement("div",{className:"post-info-top"},s.a.createElement(Link,{to:"user/".concat(t),className:"post-user"}," ",n," "),s.a.createElement("small",{className:"post-time"},timeSince(new Date(c))," ago"," ")),s.a.createElement("pre",{className:"comment-content"},a)))}},"./src/components/post/Comments.js":
/*!*****************************************!*\
  !*** ./src/components/post/Comments.js ***!
  \*****************************************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var a=n(/*! react */"./node_modules/react/index.js"),s=n.n(a),c=n(/*! ./Comment */"./src/components/post/Comment.js");t.default=function(e){var t=e.comments;return s.a.createElement(s.a.Fragment,null,t.map((function(e){var t=e.node;return s.a.createElement(s.a.Fragment,null,s.a.createElement(c.default,t))})))}}}]);
//# sourceMappingURL=8.main.js.map