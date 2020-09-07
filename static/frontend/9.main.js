(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{"./src/components/post/Comment.js":
/*!****************************************!*\
  !*** ./src/components/post/Comment.js ***!
  \****************************************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var a=n(/*! react */"./node_modules/react/index.js"),o=n.n(a),r=n(/*! react-router-dom */"./node_modules/react-router-dom/esm/react-router-dom.js");t.default=function(e){var t=e.user,n=t.username,a=t.id,c=e.content;return o.a.createElement("div",{className:"comment card"},o.a.createElement("div",{className:"post-top card-top"},o.a.createElement("div",{className:"post-info-top"},o.a.createElement(r.Link,{to:"user/".concat(a),className:"post-user"}," ",n," ")),o.a.createElement("pre",{className:"comment-content"},c)))}},"./src/components/post/Comments.js":
/*!*****************************************!*\
  !*** ./src/components/post/Comments.js ***!
  \*****************************************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var a=n(/*! react */"./node_modules/react/index.js"),o=n.n(a),r=n(/*! ./Comment */"./src/components/post/Comment.js");function c(){return(c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}t.default=function(e){var t=e.comments;return o.a.createElement(o.a.Fragment,null,t.map((function(e){var t=e.node;return o.a.createElement(o.a.Fragment,null,o.a.createElement(r.default,c({key:"com".concat(t.id)},t)))})))}}}]);
//# sourceMappingURL=9.main.js.map