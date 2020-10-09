(window.webpackJsonp=window.webpackJsonp||[]).push([[38],{"./src/components/layout/NotificationItem.js":
/*!***************************************************!*\
  !*** ./src/components/layout/NotificationItem.js ***!
  \***************************************************/
/*! exports provided: default */function(e,t,a){"use strict";a.r(t);var r=a(/*! react */"./node_modules/react/index.js"),n=a.n(r),o=a(/*! react-router-dom */"./node_modules/react-router-dom/esm/react-router-dom.js"),l=a(/*! ../../Queries */"./src/Queries.js"),i=a(/*! @apollo/client */"./node_modules/@apollo/client/index.js"),c=a(/*! @material-ui/icons/MarkunreadMailboxTwoTone */"./node_modules/@material-ui/icons/MarkunreadMailboxTwoTone.js"),u=a.n(c),d=a(/*! @material-ui/core/Button */"./node_modules/@material-ui/core/esm/Button/index.js"),s=a(/*! @material-ui/core/Card */"./node_modules/@material-ui/core/esm/Card/index.js"),m=a(/*! @material-ui/core/CardActions */"./node_modules/@material-ui/core/esm/CardActions/index.js"),f=a(/*! @material-ui/core/CardContent */"./node_modules/@material-ui/core/esm/CardContent/index.js"),p=a(/*! @material-ui/core/Typography */"./node_modules/@material-ui/core/esm/Typography/index.js"),y=a(/*! @material-ui/core/styles */"./node_modules/@material-ui/core/esm/styles/index.js");function E(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var a=[],r=!0,n=!1,o=void 0;try{for(var l,i=e[Symbol.iterator]();!(r=(l=i.next()).done)&&(a.push(l.value),!t||a.length!==t);r=!0);}catch(e){n=!0,o=e}finally{try{r||null==i.return||i.return()}finally{if(n)throw o}}return a}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return h(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);"Object"===a&&e.constructor&&(a=e.constructor.name);if("Map"===a||"Set"===a)return Array.from(e);if("Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return h(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function h(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,r=new Array(t);a<t;a++)r[a]=e[a];return r}var v=Object(y.makeStyles)((function(e){return{card:{margin:e.spacing(6)},title:{fontSize:14},pos:{marginBottom:12}}}));t.default=function(e){var t=e.node,a=v(),r=E(Object(i.useMutation)(l.READ_NOTIFICATION),1)[0],c=function(e){var t=Math.floor((new Date-e)/1e3),a=t/31536e3;if(a>1){var r=Math.floor(a);return Math.floor(a)+(1===r?" year":" years")}if((a=t/2592e3)>1){var n=Math.floor(a);return n+(1===n?" month":" months")}if((a=t/86400)>1){var o=Math.floor(a);return Math.floor(o)+(1===o?" day":" days")}if((a=t/3600)>1){var l=Math.floor(a);return l+(1===l?" hour":" hours")}if((a=t/60)>1){var i=Math.floor(a);return i+(1==i?" minute":" minutes")}return"Seconds"};switch(t.category){case"new_follow":return n.a.createElement(s.default,{fullWidth:!0,className:t.read?"notification-read":"None",classes:{root:a.card},variant:"outlined"},n.a.createElement(f.default,null,n.a.createElement(p.default,{className:a.title,color:"textSecondary",gutterBottom:!0},"New Follow"),n.a.createElement(p.default,{variant:"h5",component:"h2"},n.a.createElement(o.Link,{to:"user/".concat(t.sender.id),onClick:function(){return!t.read&&r({variables:{id:t.id}})}},t.sender.username)," ","Followed You"," "),n.a.createElement(p.default,{className:a.pos,color:"textSecondary"},c(new Date(t.createdAt))," ago"," ")),n.a.createElement(m.default,null,n.a.createElement(d.default,{size:"small",onClick:function(){return!t.read&&r({variables:{id:t.id}})},startIcon:n.a.createElement(u.a,null)},"Mark Read")));case"new_like":return n.a.createElement(s.default,{fullWidth:!0,className:t.read?"notification-read":"None",classes:{root:a.card},variant:"outlined"},n.a.createElement(f.default,null,n.a.createElement(p.default,{className:a.title,color:"textSecondary",gutterBottom:!0},"New Like"),n.a.createElement(p.default,{variant:"h5",component:"h2"},n.a.createElement(o.Link,{to:"user/".concat(t.sender.id),onClick:function(){return!t.read&&r({variables:{id:t.id}})}},t.sender.username)," ","Liked your post"),n.a.createElement(p.default,{className:a.pos,color:"textSecondary"},c(new Date(t.createdAt))," ago"," "),n.a.createElement(p.default,{variant:"body2",component:"p"},n.a.createElement(o.Link,{to:"/post/".concat(t.post.id),onClick:function(){return!t.read&&r({variables:{id:t.id}})}},t.post.title))),n.a.createElement(m.default,null,n.a.createElement(d.default,{size:"small",onClick:function(){return!t.read&&r({variables:{id:t.id}})},startIcon:n.a.createElement(u.a,null)},"Mark Read")));case"new_comment":return n.a.createElement(s.default,{fullWidth:!0,className:t.read?"notification-read":"None",classes:{root:a.card},variant:"outlined"},n.a.createElement(f.default,null,n.a.createElement(p.default,{className:a.title,color:"textSecondary",gutterBottom:!0},"New Comment"),n.a.createElement(p.default,{variant:"h5",component:"h2"},n.a.createElement(o.Link,{to:"user/".concat(t.sender.id),onClick:function(){return!t.read&&r({variables:{id:t.id}})}},t.sender.username)," ","Commented on your post:"," ",n.a.createElement(p.default,{display:"inline"},n.a.createElement(o.Link,{to:"/post/".concat(t.comment.post.id),onClick:function(){return!t.read&&r({variables:{id:t.id}})},size:30},t.comment.post.title))),n.a.createElement(p.default,{className:a.pos,color:"textSecondary",gutterBottom:!0},c(new Date(t.createdAt))," ago"," "),n.a.createElement(p.default,{paragraph:!0},n.a.createElement(o.Link,{to:"/post/".concat(t.comment.post.id),onClick:function(){return!t.read&&r({variables:{id:t.id}})},color:"grey",style:"color: grey !important;"},t.comment.content.substr(0,60)))),n.a.createElement(m.default,null,n.a.createElement(d.default,{size:"small",onClick:function(){return!t.read&&r({variables:{id:t.id}})},startIcon:n.a.createElement(u.a,null)},"Mark Read")));default:return null}}}}]);
//# sourceMappingURL=38.main.js.map