(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{"./src/components/pages/Account.js":
/*!*****************************************!*\
  !*** ./src/components/pages/Account.js ***!
  \*****************************************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var r=n(/*! react */"./node_modules/react/index.js"),a=n.n(r),o=n(/*! ../../Queries */"./src/Queries.js"),s=n(/*! @apollo/client */"./node_modules/@apollo/client/index.js"),l=n(/*! react-waypoint */"./node_modules/react-waypoint/es/index.js"),i=n(/*! react-spinners-kit */"./node_modules/react-spinners-kit/lib/index.js"),c=n(/*! ../../context/auth/AuthContext */"./src/context/auth/AuthContext.js"),m=n(/*! ../../context/alert/AlertContext */"./src/context/alert/AlertContext.js"),u=n(/*! react-router-dom */"./node_modules/react-router-dom/esm/react-router-dom.js");function d(e){return function(e){if(Array.isArray(e))return f(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||h(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function p(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var n=[],r=!0,a=!1,o=void 0;try{for(var s,l=e[Symbol.iterator]();!(r=(s=l.next()).done)&&(n.push(s.value),!t||n.length!==t);r=!0);}catch(e){a=!0,o=e}finally{try{r||null==l.return||l.return()}finally{if(a)throw o}}return n}(e,t)||h(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function h(e,t){if(e){if("string"==typeof e)return f(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?f(e,t):void 0}}function f(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var v=Object(r.lazy)((function(){return n.e(/*! import() */1).then(n.bind(null,/*! ../post/Posts */"./src/components/post/Posts.js"))}));t.default=function(){var e=Object(s.useQuery)(o.SELF_USER),t=e.loading,n=e.data,h=e.error,f=Object(s.useQuery)(o.SELF_POSTS),g=f.loading,E=f.data,w=f.error,y=f.fetchMore,b=Object(r.useContext)(c.default),k=b.doLogout,j=b.user,x=Object(r.useContext)(m.default).removeAlert,N=p(Object(r.useState)(!1),2),S=N[0],L=N[1];if(Object(r.useEffect)((function(){x()}),[]),g||!E||t)return a.a.createElement("div",{className:"spinner"},a.a.createElement(i.ImpulseSpinner,{size:50,style:{margin:"auto"}}));if(w||h)return"".concat(w);var A=E.post;return a.a.createElement(a.a.Fragment,null,a.a.createElement("div",{className:"account-info"},a.a.createElement("div",{className:"account-info-top"},a.a.createElement("span",{className:"username",style:{display:"block"}},n.selfUser.username)),a.a.createElement("div",{className:"info-mini"},a.a.createElement("span",{className:"info"},"Posts",a.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",className:"icon icon-tabler icon-tabler-chevron-right",width:"34",height:"34",viewBox:"0 0 24 24",strokeWidth:"1.5",stroke:"#607D8B",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"},a.a.createElement("path",{stroke:"none",d:"M0 0h24v24H0z"}),a.a.createElement("polyline",{points:"9 6 15 12 9 18"}))," ",n.selfUser.postCount),a.a.createElement("span",{className:"info"},"Followers",a.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",className:"icon icon-tabler icon-tabler-chevron-right",width:"34",height:"34",viewBox:"0 0 24 24",strokeWidth:"1.5",stroke:"#607D8B",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"},a.a.createElement("path",{stroke:"none",d:"M0 0h24v24H0z"}),a.a.createElement("polyline",{points:"9 6 15 12 9 18"}))," ",n.selfUser.followerCount)),a.a.createElement("div",{className:"options-container"},a.a.createElement("ul",{className:"options"},a.a.createElement("li",{className:"option"},a.a.createElement("button",{style:{background:"none",border:"none"},onClick:k},a.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",className:"icon icon-tabler icon-tabler-logout",width:"45",height:"45",viewBox:"0 0 24 24",strokeWidth:"2",stroke:"#607D8B",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"},a.a.createElement("path",{stroke:"none",d:"M0 0h24v24H0z"}),a.a.createElement("path",{d:"M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"}),a.a.createElement("path",{d:"M7 12h14l-3 -3m0 6l3 -3"}))," ","Logout")),a.a.createElement("li",{className:"option"},a.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",className:"icon icon-tabler icon-tabler-pencil",width:"45",height:"45",viewBox:"0 0 24 24",strokeWidth:"2",stroke:"#607D8B",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"},a.a.createElement("path",{stroke:"none",d:"M0 0h24v24H0z"}),a.a.createElement("path",{d:"M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"}),a.a.createElement("line",{x1:"13.5",y1:"6.5",x2:"17.5",y2:"10.5"})),a.a.createElement(u.Link,{to:"/password"},"Change Password")),a.a.createElement("li",{className:"option"},a.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",className:"icon icon-tabler icon-tabler-pencil",width:"45",height:"45",viewBox:"0 0 24 24",strokeWidth:"2",stroke:"#607D8B",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"},a.a.createElement("path",{stroke:"none",d:"M0 0h24v24H0z"}),a.a.createElement("path",{d:"M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"}),a.a.createElement("line",{x1:"13.5",y1:"6.5",x2:"17.5",y2:"10.5"})),a.a.createElement(u.Link,{to:"/username"},"Change Username"))))),a.a.createElement("div",{className:"main"},a.a.createElement(v,{posts:A.edges,self:!0,id:j,username:"You"}),a.a.createElement(l.Waypoint,{onEnter:function(){y({query:o.SELF_POSTS,variables:{cursor:E.post.pageInfo.endCursor},updateQuery:function(e,t){var n=t.fetchMoreResult;L(!0);var r=n.post.edges,a=n.post.pageInfo;return e.post.pageInfo.hasNextPage?r.length?{post:{__typename:e.post.__typename,edges:[].concat(d(e.post.edges),d(r)),pageInfo:a}}:e:(L(!1),e)}})}},a.a.createElement("div",{className:"spinner"},S&&a.a.createElement(i.ImpulseSpinner,{size:40})))))}}}]);
//# sourceMappingURL=14.main.js.map