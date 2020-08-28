(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{"./src/components/pages/User.js":
/*!**************************************!*\
  !*** ./src/components/pages/User.js ***!
  \**************************************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var r=n(/*! @babel/runtime/helpers/extends */"./node_modules/@babel/runtime/helpers/extends.js"),o=n.n(r),s=n(/*! @babel/runtime/helpers/defineProperty */"./node_modules/@babel/runtime/helpers/defineProperty.js"),a=n.n(s),l=n(/*! @babel/runtime/helpers/toConsumableArray */"./node_modules/@babel/runtime/helpers/toConsumableArray.js"),i=n.n(l),c=n(/*! @babel/runtime/helpers/slicedToArray */"./node_modules/@babel/runtime/helpers/slicedToArray.js"),u=n.n(c),m=n(/*! react */"./node_modules/react/index.js"),d=n.n(m),p=n(/*! ../../Queries */"./src/Queries.js"),f=n(/*! @apollo/client */"./node_modules/@apollo/client/index.js"),h=n(/*! react-waypoint */"./node_modules/react-waypoint/es/index.js"),g=n(/*! react-spinners-kit */"./node_modules/react-spinners-kit/lib/index.js"),b=n(/*! ../../context/auth/AuthContext */"./src/context/auth/AuthContext.js"),w=n(/*! ../../context/alert/AlertContext */"./src/context/alert/AlertContext.js"),v=n(/*! react-router-dom */"./node_modules/react-router-dom/esm/react-router-dom.js");function E(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function j(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?E(Object(n),!0).forEach((function(t){a()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):E(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var y=Object(m.lazy)((function(){return n.e(/*! import() */1).then(n.bind(null,/*! ./Offline */"./src/components/pages/Offline.js"))})),O=Object(m.lazy)((function(){return n.e(/*! import() */0).then(n.bind(null,/*! ../post/PostItem */"./src/components/post/PostItem.js"))}));t.default=function(e){var t=e.match,n=Object(f.useQuery)(p.GET_USER,{variables:{id:t.params.id}}),r=n.loading,s=n.data,a=n.error,l=Object(f.useQuery)(p.USER_POSTS,{variables:{id:t.params.id}}),c=l.loading,E=l.data,k=l.error,x=l.fetchMore,P=Object(m.useContext)(b.default),_=(P.Logout,P.user),N=Object(m.useContext)(w.default),S=N.removeAlert,L=(N.setAlert,Object(m.useState)(!1)),M=u()(L,2),z=M[0],C=M[1],I=Object(m.useState)({first:!0,following:!1,followers:""}),A=u()(I,2),B=A[0],D=A[1],G=Object(f.useMutation)(p.FOLLOW),U=u()(G,1)[0];if(Object(m.useEffect)((function(){S()}),[]),_==t.params.id)return d.a.createElement(v.Redirect,{to:"/account"});if(c||!E||r||!s)return d.a.createElement("div",{className:"spinner"},d.a.createElement(g.ImpulseSpinner,{size:50,style:{margin:"auto"}}));if(k||a)return d.a.createElement(y,null);c||B.first&&D({first:!1,following:s.isFollowing,followers:s.userGet.followers.edges.length});var W=E.userPost;return d.a.createElement("div",{className:"main"},d.a.createElement("div",{className:"account-info"},d.a.createElement("div",{className:"account-info-top"},d.a.createElement("span",{className:"username",style:{display:"block"}},s.userGet.username)),d.a.createElement("button",{className:"btn btn-teal",onClick:function(){U({variables:{id:t.params.id}}).then((function(e){var t=e.data.followUser;D(j(j({},B),{},{following:!B.following,followers:t.user.followers.edges.length}))}))}},B.following?d.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",className:"icon icon-tabler icon-tabler-user-minus",width:"25",height:"25",viewBox:"0 0 24 24",strokeWidth:"1.5",stroke:"rgb(248, 248, 248)",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"},d.a.createElement("path",{stroke:"none",d:"M0 0h24v24H0z"}),d.a.createElement("circle",{cx:"9",cy:"7",r:"4"}),d.a.createElement("path",{d:"M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}),d.a.createElement("line",{x1:"16",y1:"11",x2:"22",y2:"11"})):d.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",className:"icon icon-tabler icon-tabler-user-plus",width:"25",height:"25",viewBox:"0 0 24 24",strokeWidth:"1.5",stroke:"rgb(248, 248, 248)",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"},d.a.createElement("path",{stroke:"none",d:"M0 0h24v24H0z"}),d.a.createElement("circle",{cx:"9",cy:"7",r:"4"}),d.a.createElement("path",{d:"M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}),d.a.createElement("path",{d:"M16 11h6m-3 -3v6"}))," ",B.following?"Unfollow":"Follow"),d.a.createElement("div",{className:"info-mini"},d.a.createElement("span",{className:"info"},"Posts",d.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",className:"icon icon-tabler icon-tabler-chevron-right",width:"34",height:"34",viewBox:"0 0 24 24",strokeWidth:"1.5",stroke:"#607D8B",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"},d.a.createElement("path",{stroke:"none",d:"M0 0h24v24H0z"}),d.a.createElement("polyline",{points:"9 6 15 12 9 18"}))," ",s.userGet.posts.edges.length),d.a.createElement("span",{className:"info"},"Followers",d.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",className:"icon icon-tabler icon-tabler-chevron-right",width:"34",height:"34",viewBox:"0 0 24 24",strokeWidth:"1.5",stroke:"#607D8B",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"},d.a.createElement("path",{stroke:"none",d:"M0 0h24v24H0z"}),d.a.createElement("polyline",{points:"9 6 15 12 9 18"}))," ",B.followers))),d.a.createElement("div",{className:"main"},W.edges.map((function(e){var t=e.node;return d.a.createElement(O,o()({key:"".concat(t.id,"k")},t,{likes:t.likers.length,comments:t.commentSet.length,user_id:s.userGet.id,username:s.userGet.username}))})),d.a.createElement(h.Waypoint,{onEnter:function(){x({query:p.USER_POSTS,variables:{cursor:E.userPost.pageInfo.endCursor,id:t.params.id},updateQuery:function(e,t){var n=t.fetchMoreResult;C(!0);var r=n.userPost.edges,o=n.userPost.pageInfo;return e.userPost.pageInfo.hasNextPage?r.length?{userPost:{__typename:e.userPost.__typename,edges:[].concat(i()(e.userPost.edges),i()(r)),pageInfo:o}}:e:(C(!1),e)}})}},d.a.createElement("div",{className:"spinner"},z&&d.a.createElement(g.ImpulseSpinner,{size:40})))))}}}]);
//# sourceMappingURL=8.main.js.map