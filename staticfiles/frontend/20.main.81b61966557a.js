(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{"./src/components/pages/FollowingPosts.js":
/*!************************************************!*\
  !*** ./src/components/pages/FollowingPosts.js ***!
  \************************************************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var r=n(/*! react */"./node_modules/react/index.js"),o=n.n(r),a=n(/*! react-router-dom */"./node_modules/react-router-dom/esm/react-router-dom.js"),l=n(/*! ../../Queries */"./src/Queries.js"),s=n(/*! @apollo/client */"./node_modules/@apollo/client/index.js"),i=n(/*! react-spinners-kit */"./node_modules/react-spinners-kit/lib/index.js");function c(e){return function(e){if(Array.isArray(e))return f(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||m(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function u(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var n=[],r=!0,o=!1,a=void 0;try{for(var l,s=e[Symbol.iterator]();!(r=(l=s.next()).done)&&(n.push(l.value),!t||n.length!==t);r=!0);}catch(e){o=!0,a=e}finally{try{r||null==s.return||s.return()}finally{if(o)throw a}}return n}(e,t)||m(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function m(e,t){if(e){if("string"==typeof e)return f(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?f(e,t):void 0}}function f(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var d=Object(r.lazy)((function(){return n.e(/*! import() */1).then(n.bind(null,/*! ./Offline */"./src/components/pages/Offline.js"))})),p=Object(r.lazy)((function(){return Promise.all(/*! import() */[n.e(0),n.e(2)]).then(n.bind(null,/*! ../post/Posts */"./src/components/post/Posts.js"))}));t.default=function(){var e=Object(s.useQuery)(l.FOLLOWING_POSTS,{pollInterval:1e5}),t=e.loading,n=e.data,m=e.error,f=e.fetchMore,y=e.refetch,g=u(Object(r.useState)(!0),2),b=g[0],v=g[1];return t||!n?o.a.createElement("div",{className:"spinner"},o.a.createElement(i.ImpulseSpinner,{size:50,style:{margin:"auto"}})," "):m?o.a.createElement(o.a.Fragment,null,o.a.createElement(d,null),o.a.createElement("button",{className:"btn btn-teal",onClick:y},"Refresh"," ")," "):o.a.createElement(o.a.Fragment,null,o.a.createElement("ul",{className:"nav nav-pills nav-fill home-pages"},o.a.createElement("li",{className:"nav-item"},o.a.createElement(a.Link,{to:"/all",className:"nav-link"},"All Posts")),o.a.createElement("li",{className:"nav-item"},o.a.createElement("a",{className:"nav-link active"},"Following"))),o.a.createElement(p,{posts:n.followingPosts.edges,self:!1,id:null,spin:b,more:function(){f({query:l.FOLLOWING_POSTS,variables:{cursor:n.followingPosts.pageInfo.endCursor},updateQuery:function(e,t){var n=t.fetchMoreResult;if(v(!0),!e.followingPosts.pageInfo.hasNextPage)return v(!1),e;var r=n.followingPosts.edges,o=n.followingPosts.pageInfo;return r.length?{followingPosts:{__typename:e.followingPosts.__typename,edges:[].concat(c(e.followingPosts.edges),c(r)),pageInfo:o}}:e}})},refetch:y}))}}}]);
//# sourceMappingURL=20.main.js.map