(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{"./src/components/pages/Home.js":
/*!**************************************!*\
  !*** ./src/components/pages/Home.js ***!
  \**************************************/
/*! exports provided: default */function(e,n,t){"use strict";t.r(n);var s=t(/*! @babel/runtime/helpers/extends */"./node_modules/@babel/runtime/helpers/extends.js"),a=t.n(s),r=t(/*! @babel/runtime/helpers/toConsumableArray */"./node_modules/@babel/runtime/helpers/toConsumableArray.js"),o=t.n(r),l=t(/*! @babel/runtime/helpers/slicedToArray */"./node_modules/@babel/runtime/helpers/slicedToArray.js"),u=t.n(l),c=t(/*! react */"./node_modules/react/index.js"),i=t.n(c),m=t(/*! ../../Queries */"./src/Queries.js"),d=t(/*! @apollo/client */"./node_modules/@apollo/client/index.js"),p=t(/*! react-waypoint */"./node_modules/react-waypoint/es/index.js"),b=t(/*! react-spinners-kit */"./node_modules/react-spinners-kit/lib/index.js"),f=Object(c.lazy)((function(){return t.e(/*! import() */9).then(t.bind(null,/*! ./Offline */"./src/components/pages/Offline.js"))})),g=Object(c.lazy)((function(){return t.e(/*! import() */1).then(t.bind(null,/*! ../post/PostItem */"./src/components/post/PostItem.js"))}));n.default=function(){var e=Object(d.useQuery)(m.GET_POSTS),n=e.loading,t=e.data,s=e.error,r=e.fetchMore,l=e.refetch,j=Object(c.useState)(!0),h=u()(j,2),E=h[0],_=h[1];return n?i.a.createElement("div",{className:"spinner"},i.a.createElement(b.ImpulseSpinner,{size:50,style:{margin:"auto"}})):s?i.a.createElement(i.a.Fragment,null,i.a.createElement(f,null),i.a.createElement("button",{className:"btn btn-teal",onClick:l},"Refresh")):i.a.createElement(i.a.Fragment,null,i.a.createElement("div",{className:"main"},t.posts.edges.map((function(e){var n=e.node;return i.a.createElement(g,a()({key:n.id},n,{likes:n.likers.length,comments:n.commentSet.length,user_id:n.user.id,username:n.user.username}))})),i.a.createElement(p.Waypoint,{onEnter:function(){r({query:m.GET_POSTS,variables:{cursor:t.posts.pageInfo.endCursor},updateQuery:function(e,n){var t=n.fetchMoreResult;if(_(!0),!e.posts.pageInfo.hasNextPage)return _(!1),e;var s=t.posts.edges,a=t.posts.pageInfo;return s.length?{posts:{__typename:e.posts.__typename,edges:[].concat(o()(e.posts.edges),o()(s)),pageInfo:a}}:e}})}},i.a.createElement("div",{className:"spinner"},E&&i.a.createElement(b.ImpulseSpinner,{size:40})))))}}}]);
//# sourceMappingURL=11.main.js.map