(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{"./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js ***!
  \******************************************************************/
/*! no static exports found */function(e,t,n){var a=n(/*! ./arrayLikeToArray */"./node_modules/@babel/runtime/helpers/arrayLikeToArray.js");e.exports=function(e){if(Array.isArray(e))return a(e)}},"./node_modules/@babel/runtime/helpers/iterableToArray.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArray.js ***!
  \****************************************************************/
/*! no static exports found */function(e,t){e.exports=function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}},"./node_modules/@babel/runtime/helpers/nonIterableSpread.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableSpread.js ***!
  \******************************************************************/
/*! no static exports found */function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},"./node_modules/@babel/runtime/helpers/toConsumableArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toConsumableArray.js ***!
  \******************************************************************/
/*! no static exports found */function(e,t,n){var a=n(/*! ./arrayWithoutHoles */"./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js"),o=n(/*! ./iterableToArray */"./node_modules/@babel/runtime/helpers/iterableToArray.js"),r=n(/*! ./unsupportedIterableToArray */"./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js"),s=n(/*! ./nonIterableSpread */"./node_modules/@babel/runtime/helpers/nonIterableSpread.js");e.exports=function(e){return a(e)||o(e)||r(e)||s()}},"./src/components/pages/Account.js":
/*!*****************************************!*\
  !*** ./src/components/pages/Account.js ***!
  \*****************************************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var a=n(/*! @babel/runtime/helpers/extends */"./node_modules/@babel/runtime/helpers/extends.js"),o=n.n(a),r=n(/*! @babel/runtime/helpers/toConsumableArray */"./node_modules/@babel/runtime/helpers/toConsumableArray.js"),s=n.n(r),l=n(/*! @babel/runtime/helpers/slicedToArray */"./node_modules/@babel/runtime/helpers/slicedToArray.js"),i=n.n(l),c=n(/*! react */"./node_modules/react/index.js"),m=n.n(c),u=n(/*! ../../Queries */"./src/Queries.js"),d=n(/*! @apollo/client */"./node_modules/@apollo/client/index.js"),p=n(/*! react-waypoint */"./node_modules/react-waypoint/es/index.js"),h=n(/*! react-spinners-kit */"./node_modules/react-spinners-kit/lib/index.js"),b=n(/*! ../../context/auth/AuthContext */"./src/context/auth/AuthContext.js"),g=n(/*! ../../context/alert/AlertContext */"./src/context/alert/AlertContext.js"),v=n(/*! react-router-dom */"./node_modules/react-router-dom/esm/react-router-dom.js"),E=Object(c.lazy)((function(){return n.e(/*! import() */0).then(n.bind(null,/*! ../post/PostItem */"./src/components/post/PostItem.js"))}));t.default=function(){var e=Object(d.useQuery)(u.SELF_USER),t=e.loading,n=e.data,a=e.error,r=Object(d.useQuery)(u.SELF_POSTS),l=r.loading,f=r.data,w=r.error,y=r.fetchMore,k=Object(c.useContext)(b.default).Logout,j=Object(c.useContext)(g.default).removeAlert,x=Object(c.useState)(!1),_=i()(x,2),N=_[0],L=_[1];if(Object(c.useEffect)((function(){j()}),[]),l||!f||t)return m.a.createElement("div",{className:"spinner"},m.a.createElement(h.ImpulseSpinner,{size:50,style:{margin:"auto"}}));if(w||a)return"".concat(w);var S=f.post;return m.a.createElement("div",{className:"main"},m.a.createElement("div",{className:"account-info"},m.a.createElement("div",{className:"account-info-top"},m.a.createElement("span",{className:"username",style:{display:"block"}},n.user.username)),m.a.createElement("div",{className:"info-mini"},m.a.createElement("span",{className:"info"},"Posts",m.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",className:"icon icon-tabler icon-tabler-chevron-right",width:"34",height:"34",viewBox:"0 0 24 24",strokeWidth:"1.5",stroke:"#607D8B",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"},m.a.createElement("path",{stroke:"none",d:"M0 0h24v24H0z"}),m.a.createElement("polyline",{points:"9 6 15 12 9 18"}))," ",n.user.posts.edges.length),m.a.createElement("span",{className:"info"},"Followers",m.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",className:"icon icon-tabler icon-tabler-chevron-right",width:"34",height:"34",viewBox:"0 0 24 24",strokeWidth:"1.5",stroke:"#607D8B",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"},m.a.createElement("path",{stroke:"none",d:"M0 0h24v24H0z"}),m.a.createElement("polyline",{points:"9 6 15 12 9 18"}))," ",n.user.followers.edges.length)),m.a.createElement("div",{className:"options-container"},m.a.createElement("ul",{className:"options"},m.a.createElement("li",{className:"option"},m.a.createElement("button",{style:{background:"none",border:"none"},onClick:k},m.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",className:"icon icon-tabler icon-tabler-logout",width:"45",height:"45",viewBox:"0 0 24 24",strokeWidth:"2",stroke:"#607D8B",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"},m.a.createElement("path",{stroke:"none",d:"M0 0h24v24H0z"}),m.a.createElement("path",{d:"M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"}),m.a.createElement("path",{d:"M7 12h14l-3 -3m0 6l3 -3"}))," ","Logout")),m.a.createElement("li",{className:"option"},m.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",className:"icon icon-tabler icon-tabler-pencil",width:"45",height:"45",viewBox:"0 0 24 24",strokeWidth:"2",stroke:"#607D8B",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"},m.a.createElement("path",{stroke:"none",d:"M0 0h24v24H0z"}),m.a.createElement("path",{d:"M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"}),m.a.createElement("line",{x1:"13.5",y1:"6.5",x2:"17.5",y2:"10.5"})),m.a.createElement(v.Link,{to:"/password"},"Change Password")),m.a.createElement("li",{className:"option"},m.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",className:"icon icon-tabler icon-tabler-pencil",width:"45",height:"45",viewBox:"0 0 24 24",strokeWidth:"2",stroke:"#607D8B",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"},m.a.createElement("path",{stroke:"none",d:"M0 0h24v24H0z"}),m.a.createElement("path",{d:"M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"}),m.a.createElement("line",{x1:"13.5",y1:"6.5",x2:"17.5",y2:"10.5"})),m.a.createElement(v.Link,{to:"/username"},"Change Username"))))),m.a.createElement("div",{className:"main"},S.edges.map((function(e){var t=e.node;return m.a.createElement(E,o()({key:"".concat(t.id,"k")},t,{likes:t.likers.length,comments:t.commentSet.length,user_id:n.user.id,username:"You"}))})),m.a.createElement(p.Waypoint,{onEnter:function(){y({query:u.SELF_POSTS,variables:{cursor:f.post.pageInfo.endCursor},updateQuery:function(e,t){var n=t.fetchMoreResult;L(!0);var a=n.post.edges,o=n.post.pageInfo;return e.post.pageInfo.hasNextPage?a.length?{post:{__typename:e.post.__typename,edges:[].concat(s()(e.post.edges),s()(a)),pageInfo:o}}:e:(L(!1),e)}})}},m.a.createElement("div",{className:"spinner"},N&&m.a.createElement(h.ImpulseSpinner,{size:40})))))}}}]);
//# sourceMappingURL=4.main.js.map