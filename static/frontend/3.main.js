(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{"./src/components/post/Posts.js":
/*!**************************************!*\
  !*** ./src/components/post/Posts.js ***!
  \**************************************/
/*! exports provided: default */function(e,n,s){"use strict";s.r(n);var t=s(/*! @babel/runtime/helpers/extends */"./node_modules/@babel/runtime/helpers/extends.js"),o=s.n(t),r=s(/*! react */"./node_modules/react/index.js"),u=s.n(r),c=Object(r.lazy)((function(){return s.e(/*! import() */1).then(s.bind(null,/*! ./PostItem */"./src/components/post/PostItem.js"))}));n.default=function(e){var n=e.posts,s=e.self,t=e.id;return u.a.createElement("div",null,n.map((function(e){var n=e.node;return u.a.createElement(c,o()({key:n.id},n,{likes:n.likers.length,comments:n.commentSet.length,user_id:s?t:n.user.id,username:s?"You":n.user.username}))})))}}}]);
//# sourceMappingURL=3.main.js.map