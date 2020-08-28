(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{"./src/components/post/PostItem.js":
/*!*****************************************!*\
  !*** ./src/components/post/PostItem.js ***!
  \*****************************************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var r=n(/*! @babel/runtime/helpers/defineProperty */"./node_modules/@babel/runtime/helpers/defineProperty.js"),o=n.n(r),a=n(/*! @babel/runtime/helpers/slicedToArray */"./node_modules/@babel/runtime/helpers/slicedToArray.js"),s=n.n(a),c=n(/*! react */"./node_modules/react/index.js"),l=n.n(c),i=n(/*! @apollo/client */"./node_modules/@apollo/client/index.js"),u=n(/*! ../../Queries */"./src/Queries.js"),m=n(/*! react-router-dom */"./node_modules/react-router-dom/esm/react-router-dom.js"),p=n(/*! react-spring */"./node_modules/react-spring/web.js");function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function f(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?d(Object(n),!0).forEach((function(t){o()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var h=Object(c.lazy)((function(){return n.e(/*! import() */10).then(n.bind(null,/*! ../SVG/Like.svg */"./src/components/SVG/Like.svg"))})),b=Object(c.lazy)((function(){return n.e(/*! import() */9).then(n.bind(null,/*! ../SVG/Heart.svg */"./src/components/SVG/Heart.svg"))})),g=Object(c.lazy)((function(){return n.e(/*! import() */8).then(n.bind(null,/*! ../SVG/Comments.svg */"./src/components/SVG/Comments.svg"))}));t.default=function(e){var t=e.text,n=e.title,r=e.username,o=e.id,a=e.likes,d=e.creation,j=e.user_id,O={done:!1,likes:a,hasMore:!1,height:"32vh",loading:!1,comments:e.comments},k=Object(i.useLazyQuery)(u.LIKED,{variables:{post_id:o},onCompleted:function(e){D(f(f({},_),{},{liked:e.liked}))}}),v=s()(k,1)[0],y=Object(c.useState)(!1),E=s()(y,2),x=E[0],N=E[1],w=Object(c.useRef)(null),M=Object(i.useMutation)(u.LIKE),P=s()(M,1)[0],H=Object(c.useState)(O),S=s()(H,2),_=S[0],D=S[1],L=Object(p.useSpring)({to:{maxHeight:_.expand?"".concat(w.current.scrollHeight,"px"):"230px",height:_.expand?"".concat(w.current.scrollHeight,"px"):"230px"},from:{maxHeight:_.expand?"".concat(w.current.scrollHeight,"px"):"230px",height:_.expand?"".concat(w.current.scrollHeight,"px"):"230px"},duration:"1s"});Object(c.useEffect)((function(){v(),D(f(f({},_),{},{hasMore:w.current.scrollHeight>w.current.clientHeight,loading:!1}))}),[]);return l.a.createElement("div",{className:"post card"},l.a.createElement("div",{className:"post-top card-top"},l.a.createElement("div",{className:"post-info-top"},l.a.createElement(m.Link,{to:"user/".concat(j),className:"post-user"}," ",r," "),l.a.createElement("small",{className:"post-time"},function(e){var t=Math.floor((new Date-e)/1e3),n=t/31536e3;if(n>1){var r=Math.floor(n);return Math.floor(n)+(1===r?" year":" years")}if((n=t/2592e3)>1){var o=Math.floor(n);return o+(1===o?" month":" months")}if((n=t/86400)>1){var a=Math.floor(n);return Math.floor(a)+(1===a?" day":" days")}if((n=t/3600)>1){var s=Math.floor(n);return s+(1===s?" hour":" hours")}if((n=t/60)>1){var c=Math.floor(n);return c+(1==c?" minute":" minutes")}return"Seconds"}(new Date(d))," ago"," ")),l.a.createElement("h5",{className:"post-title"},n)),l.a.createElement(p.animated.pre,{ref:w,className:"post-text",style:_.hasMore?L:{}},t,_.hasMore&&l.a.createElement("button",{className:"more",onClick:function(){D(f(f({},_),{},{expand:!_.expand}))}},_.expand?"less":"more")),!_.loading&&l.a.createElement("div",{className:"info-bottom"},l.a.createElement("span",{className:"like",onClick:function(){P({variables:{post_id:o}}).catch((function(e){return console.log(e)})).then((function(e){var t=e.data.likePost;D(f(f({},_),{},{liked:!_.liked,likes:t.post.likers.length}))}))},onMouseOver:function(){return N(!0)},onMouseOut:function(){return N(!1)}},x?_.liked?l.a.createElement(b,{className:"like-icon"}):l.a.createElement(h,{className:"like-icon"}):_.liked?l.a.createElement(h,{className:"like-icon"}):l.a.createElement(b,{className:"like-icon"}),_.likes>0&&_.likes),l.a.createElement("span",{className:"like"},l.a.createElement(m.Link,{to:"/post/".concat(o),className:"like-icon"},l.a.createElement(g,null)),_.comments>0&&_.comments)))}}}]);
//# sourceMappingURL=1.main.js.map