(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{"./src/components/layout/Navbar.js":
/*!*****************************************!*\
  !*** ./src/components/layout/Navbar.js ***!
  \*****************************************/
/*! exports provided: default */function(e,a,t){"use strict";t.r(a);var n=t(/*! @babel/runtime/helpers/slicedToArray */"./node_modules/@babel/runtime/helpers/slicedToArray.js"),l=t.n(n),s=t(/*! react */"./node_modules/react/index.js"),i=t.n(s),c=t(/*! react-router-dom */"./node_modules/react-router-dom/esm/react-router-dom.js"),r=t(/*! ../../context/auth/AuthContext */"./src/context/auth/AuthContext.js");a.default=function(){var e=Object(s.useContext)(r.default),a=e.isAuthenticated,t=e.loading,n=Object(s.useRef)(null),o=Object(s.useState)({displayed:!1}),m=l()(o,2),d=m[0],h=m[1];if(t||null==a)return"";var p=function(){h({displayed:!d.displayed})},u=function(){d.displayed&&p()};return i.a.createElement("nav",{className:"nav",style:{position:"fixed",top:0,width:"100%"}},i.a.createElement("div",{className:"nav-top"},i.a.createElement(c.Link,{to:"/",className:"navbar-brand"},"UNNAMED"),i.a.createElement("svg",{viewBox:"0 0 100 80",width:"40",height:"40",className:"fa fa-bars",id:d.displayed?"fa":"",onClick:p},i.a.createElement("rect",{className:"line0",fill:"white",width:"100",height:"17",id:d.displayed?"line0":" ",rx:"0.25em"}),i.a.createElement("rect",{className:"line1",fill:"white",y:"30",width:"100",height:"17",id:d.displayed?"line1":" ",rx:"0.25em"}),i.a.createElement("rect",{className:"line2",fill:"white",y:"60",width:"100",height:"17",id:d.displayed?"line2":" ",rx:"0.25em"}))),i.a.createElement("ul",{className:"navbar-items",id:d.displayed?"navitems-block":"navitems-none",ref:n},!a&&i.a.createElement("li",{className:"right",id:"right"},i.a.createElement("span",{className:"navItem"},i.a.createElement(c.Link,{to:"/login",className:"nav-link",onClick:u},"Login")),i.a.createElement("span",{className:"navItem"},i.a.createElement(c.Link,{className:"nav-link",to:"/register",onClick:u},"Register"))),a&&i.a.createElement(i.a.Fragment,null,i.a.createElement("li",{className:"left"},i.a.createElement("span",{className:"navItem"},i.a.createElement(c.Link,{className:"nav-link",to:"/",onClick:u},"Home")),i.a.createElement("span",{className:"navItem"},i.a.createElement(c.Link,{className:"nav-link",to:"/add-post",onClick:u},"New Post"))),i.a.createElement("li",{className:"right"},i.a.createElement("span",{className:"navItem"},i.a.createElement("button",{className:"to-up",onClick:function(){return window.scrollTo({top:0,behavior:"smooth"})}},i.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",className:"icon icon-tabler icon-tabler-chevron-up",width:"44",height:"44",viewBox:"0 0 24 24",strokeWidth:"1.5",stroke:"rgb(248, 248, 248)",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",onClick:u},i.a.createElement("path",{stroke:"none",d:"M0 0h24v24H0z"}),i.a.createElement("polyline",{points:"6 15 12 9 18 15"})))),i.a.createElement("span",{className:"navItem"},i.a.createElement(c.Link,{className:"nav-link",to:"/account",onClick:u},i.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",className:"icon icon-tabler icon-tabler-settings",width:"45",height:"45",viewBox:"0 0 24 24",strokeWidth:"2",stroke:"rgb(248, 248, 248)",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"},i.a.createElement("path",{stroke:"none",d:"M0 0h24v24H0z"}),i.a.createElement("path",{d:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"}),i.a.createElement("circle",{cx:"12",cy:"12",r:"3"}))))))))}}}]);
//# sourceMappingURL=14.main.js.map