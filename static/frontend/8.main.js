(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{"./src/components/pages/Home.js":
/*!**************************************!*\
  !*** ./src/components/pages/Home.js ***!
  \**************************************/
/*! exports provided: default */function(e,n,t){"use strict";t.r(n);var s=t(/*! @babel/runtime/helpers/toConsumableArray */"./node_modules/@babel/runtime/helpers/toConsumableArray.js"),a=t.n(s),r=t(/*! @babel/runtime/helpers/slicedToArray */"./node_modules/@babel/runtime/helpers/slicedToArray.js"),o=t.n(r),l=t(/*! react */"./node_modules/react/index.js"),c=t.n(l),i=t(/*! ../../Queries */"./src/Queries.js"),u=t(/*! @apollo/client */"./node_modules/@apollo/client/index.js"),p=t(/*! react-waypoint */"./node_modules/react-waypoint/es/index.js"),m=t(/*! react-spinners-kit */"./node_modules/react-spinners-kit/lib/index.js"),d=Object(l.lazy)((function(){return t.e(/*! import() */2).then(t.bind(null,/*! ./Offline */"./src/components/pages/Offline.js"))}));n.default=function(){var e=Object(u.useQuery)(i.GET_POSTS),n=e.loading,t=e.data,s=e.error,r=e.fetchMore,f=e.refetch,b=Object(l.useState)(!0),g=o()(b,2),E=g[0],j=g[1];return n?c.a.createElement("div",{className:"spinner"},c.a.createElement(m.ImpulseSpinner,{size:50,style:{margin:"auto"}})):s?c.a.createElement(c.a.Fragment,null,c.a.createElement(d,null),c.a.createElement("button",{className:"btn btn-teal",onClick:f},"Refresh")):c.a.createElement(c.a.Fragment,null,c.a.createElement("div",{className:"main"},c.a.createElement(p.Waypoint,{onEnter:function(){r({query:i.GET_POSTS,variables:{cursor:t.posts.pageInfo.endCursor},updateQuery:function(e,n){var t=n.fetchMoreResult;if(j(!0),!e.posts.pageInfo.hasNextPage)return j(!1),e;var s=t.posts.edges,r=t.posts.pageInfo;return s.length?{posts:{__typename:e.posts.__typename,edges:[].concat(a()(e.posts.edges),a()(s)),pageInfo:r}}:e}})}},c.a.createElement("div",{className:"spinner"},E&&c.a.createElement(m.ImpulseSpinner,{size:40})))))}}}]);
//# sourceMappingURL=8.main.js.map