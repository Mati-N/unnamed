(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{"./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js ***!
  \******************************************************************/
/*! no static exports found */function(e,n,r){var t=r(/*! ./arrayLikeToArray */"./node_modules/@babel/runtime/helpers/arrayLikeToArray.js");e.exports=function(e){if(Array.isArray(e))return t(e)}},"./node_modules/@babel/runtime/helpers/iterableToArray.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArray.js ***!
  \****************************************************************/
/*! no static exports found */function(e,n){e.exports=function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}},"./node_modules/@babel/runtime/helpers/nonIterableSpread.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableSpread.js ***!
  \******************************************************************/
/*! no static exports found */function(e,n){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},"./node_modules/@babel/runtime/helpers/toConsumableArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toConsumableArray.js ***!
  \******************************************************************/
/*! no static exports found */function(e,n,r){var t=r(/*! ./arrayWithoutHoles */"./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js"),s=r(/*! ./iterableToArray */"./node_modules/@babel/runtime/helpers/iterableToArray.js"),o=r(/*! ./unsupportedIterableToArray */"./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js"),a=r(/*! ./nonIterableSpread */"./node_modules/@babel/runtime/helpers/nonIterableSpread.js");e.exports=function(e){return t(e)||s(e)||o(e)||a()}},"./src/components/pages/Home.js":
/*!**************************************!*\
  !*** ./src/components/pages/Home.js ***!
  \**************************************/
/*! exports provided: default */function(e,n,r){"use strict";r.r(n);var t=r(/*! @babel/runtime/helpers/extends */"./node_modules/@babel/runtime/helpers/extends.js"),s=r.n(t),o=r(/*! @babel/runtime/helpers/toConsumableArray */"./node_modules/@babel/runtime/helpers/toConsumableArray.js"),a=r.n(o),l=r(/*! @babel/runtime/helpers/slicedToArray */"./node_modules/@babel/runtime/helpers/slicedToArray.js"),u=r.n(l),i=r(/*! react */"./node_modules/react/index.js"),m=r.n(i),d=r(/*! ../../Queries */"./src/Queries.js"),c=r(/*! @apollo/client */"./node_modules/@apollo/client/index.js"),p=r(/*! react-waypoint */"./node_modules/react-waypoint/es/index.js"),b=r(/*! react-spinners-kit */"./node_modules/react-spinners-kit/lib/index.js"),f=Object(i.lazy)((function(){return r.e(/*! import() */0).then(r.bind(null,/*! ./Offline */"./src/components/pages/Offline.js"))})),y=Object(i.lazy)((function(){return Promise.resolve().then(r.bind(null,/*! ../post/PostItem */"./src/components/post/PostItem.js"))}));n.default=function(){var e=Object(c.useQuery)(d.GET_POSTS),n=e.loading,r=e.data,t=e.error,o=e.fetchMore,l=e.refetch,h=Object(i.useState)(!1),j=u()(h,2),_=j[0],g=j[1];return n?m.a.createElement("div",{className:"spinner"},m.a.createElement(b.ImpulseSpinner,{size:50,style:{margin:"auto"}})):t?m.a.createElement(m.a.Fragment,null,m.a.createElement(f,null),m.a.createElement("button",{className:"btn btn-teal",onClick:l},"Refresh")):m.a.createElement(m.a.Fragment,null,m.a.createElement("div",{className:"main"},r.posts.edges.map((function(e){var n=e.node;return m.a.createElement(y,s()({key:n.id},n,{likes:n.likers.length,comments:n.commentSet.length,user_id:n.user.id,username:n.user.username}))})),m.a.createElement(p.Waypoint,{onEnter:function(){o({query:d.GET_POSTS,variables:{cursor:r.posts.pageInfo.endCursor},updateQuery:function(e,n){var r=n.fetchMoreResult;if(g(!0),!e.posts.pageInfo.hasNextPage)return g(!1),e;var t=r.posts.edges,s=r.posts.pageInfo;return t.length?{posts:{__typename:e.posts.__typename,edges:[].concat(a()(e.posts.edges),a()(t)),pageInfo:s}}:e}})}},m.a.createElement("div",{className:"spinner"},_&&m.a.createElement(b.ImpulseSpinner,{size:40})))))}}}]);
//# sourceMappingURL=2.main.js.map