(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{"./src/components/post/Posts.js":
/*!**************************************!*\
  !*** ./src/components/post/Posts.js ***!
  \**************************************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var a=n(/*! react */"./node_modules/react/index.js"),s=n.n(a),r=n(/*! react-waypoint */"./node_modules/react-waypoint/es/index.js"),c=n(/*! react-spinners-kit */"./node_modules/react-spinners-kit/lib/index.js"),o=n(/*! ../SVG/NoData.svg */"./src/components/SVG/NoData.svg");function i(){return(i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}var l=Object(a.lazy)((function(){return Promise.all(/*! import() */[n.e(0),n.e(1),n.e(2),n.e(10),n.e(11)]).then(n.bind(null,/*! ./PostItem */"./src/components/post/PostItem.js"))}));t.default=function(e){var t=e.posts,n=e.self,a=e.username,m=e.id,u=e.more,p=e.spin,d=e.refetch,f=e.imagePath;return s.a.createElement("div",{className:"posts"},0==t.length&&s.a.createElement("div",{className:"w-75 h-75 m-auto d-flex align-items-center justify-content-center flex-column"},s.a.createElement(o.default,{className:"w-50 h-50",preserveAspectRatio:!0})),t.map((function(e){var t=e.node;return s.a.createElement(l,i({key:"".concat(t.id,"p")},t,{user_id:n?m:t.user.id,username:n?a:t.user.username,show_comment:!1,imagePath:n?f:t.user.imagePath}))})),s.a.createElement(r.Waypoint,{onEnter:u},s.a.createElement("div",{className:"refetch-and-spinner"},s.a.createElement("button",{className:"btn btn-teal",onClick:function(){return d()}},"Refetch"),p&&s.a.createElement("div",{className:"spinner"},s.a.createElement(c.ImpulseSpinner,{size:40})))))}}}]);
//# sourceMappingURL=9.main.js.map