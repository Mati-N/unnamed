(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{"./node_modules/@babel/runtime/helpers/extends.js":
/*!********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/extends.js ***!
  \********************************************************/
/*! no static exports found */function(e,t){function n(){return e.exports=n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},n.apply(this,arguments)}e.exports=n},"./node_modules/@babel/runtime/helpers/objectWithoutProperties.js":
/*!************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/objectWithoutProperties.js ***!
  \************************************************************************/
/*! no static exports found */function(e,t,n){var o=n(/*! ./objectWithoutPropertiesLoose */"./node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js");e.exports=function(e,t){if(null==e)return{};var n,r,a=o(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}},"./node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js ***!
  \*****************************************************************************/
/*! no static exports found */function(e,t){e.exports=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}},"./src/components/Routing/AuthenticationRoute.js":
/*!*******************************************************!*\
  !*** ./src/components/Routing/AuthenticationRoute.js ***!
  \*******************************************************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var o=n(/*! @babel/runtime/helpers/extends */"./node_modules/@babel/runtime/helpers/extends.js"),r=n.n(o),a=n(/*! @babel/runtime/helpers/objectWithoutProperties */"./node_modules/@babel/runtime/helpers/objectWithoutProperties.js"),s=n.n(a),c=n(/*! react */"./node_modules/react/index.js"),u=n.n(c),l=n(/*! react-router-dom */"./node_modules/react-router-dom/esm/react-router-dom.js"),i=n(/*! ../../context/auth/AuthContext */"./src/context/auth/AuthContext.js"),m=n(/*! react-spinners-kit */"./node_modules/react-spinners-kit/lib/index.js");t.default=function(e){var t=e.component,n=(e.auth,s()(e,["component","auth"])),o=Object(c.useContext)(i.default),a=o.isAuthenticated,d=o.loading;return u.a.createElement(l.Route,r()({},n,{render:function(e){return d||null==a?u.a.createElement("div",{className:"spinner"},u.a.createElement(m.ImpulseSpinner,{size:60,style:{}})):a?u.a.createElement(l.Redirect,{to:"/"}):u.a.createElement(t,e)}}))}},"./src/components/Routing/PrivateRoute.js":
/*!************************************************!*\
  !*** ./src/components/Routing/PrivateRoute.js ***!
  \************************************************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var o=n(/*! @babel/runtime/helpers/extends */"./node_modules/@babel/runtime/helpers/extends.js"),r=n.n(o),a=n(/*! @babel/runtime/helpers/objectWithoutProperties */"./node_modules/@babel/runtime/helpers/objectWithoutProperties.js"),s=n.n(a),c=n(/*! react */"./node_modules/react/index.js"),u=n.n(c),l=n(/*! react-router-dom */"./node_modules/react-router-dom/esm/react-router-dom.js"),i=n(/*! ../../context/auth/AuthContext */"./src/context/auth/AuthContext.js"),m=n(/*! react-spinners-kit */"./node_modules/react-spinners-kit/lib/index.js");t.default=function(e){var t=e.component,n=(e.auth,s()(e,["component","auth"])),o=Object(c.useContext)(i.default),a=o.isAuthenticated,d=o.loading;return u.a.createElement(l.Route,r()({},n,{render:function(e){return d||null==a?u.a.createElement("div",{className:"spinner"},u.a.createElement(m.ImpulseSpinner,{size:68})):a?u.a.createElement(t,e):u.a.createElement(l.Redirect,{to:"/login"})}}))}},"./src/components/Routing/Routes.js":
/*!******************************************!*\
  !*** ./src/components/Routing/Routes.js ***!
  \******************************************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var o=n(/*! react */"./node_modules/react/index.js"),r=n.n(o),a=n(/*! react-router-dom */"./node_modules/react-router-dom/esm/react-router-dom.js"),s=n(/*! ./PrivateRoute */"./src/components/Routing/PrivateRoute.js"),c=n(/*! ./AuthenticationRoute */"./src/components/Routing/AuthenticationRoute.js"),u=n(/*! react-spring */"./node_modules/react-spring/web.js"),l=n(/*! ../../context/auth/AuthContext */"./src/context/auth/AuthContext.js"),i=n(/*! react-spinners-kit */"./node_modules/react-spinners-kit/lib/index.js"),m=Object(o.lazy)((function(){return Promise.all(/*! import() */[n.e(0),n.e(7)]).then(n.bind(null,/*! ../post/Post */"./src/components/post/Post.js"))})),d=Object(o.lazy)((function(){return Promise.all(/*! import() */[n.e(0),n.e(16)]).then(n.bind(null,/*! ../pages/Home */"./src/components/pages/Home.js"))})),p=Object(o.lazy)((function(){return Promise.all(/*! import() */[n.e(0),n.e(15)]).then(n.bind(null,/*! ../pages/Account */"./src/components/pages/Account.js"))})),b=Object(o.lazy)((function(){return n.e(/*! import() */6).then(n.bind(null,/*! ../pages/NewPost */"./src/components/pages/NewPost.js"))})),f=Object(o.lazy)((function(){return n.e(/*! import() */11).then(n.bind(null,/*! ../auth/Login */"./src/components/auth/Login.js"))})),j=Object(o.lazy)((function(){return n.e(/*! import() */12).then(n.bind(null,/*! ../auth/Register */"./src/components/auth/Register.js"))})),h=Object(o.lazy)((function(){return n.e(/*! import() */17).then(n.bind(null,/*! ../pages/NotFound */"./src/components/pages/NotFound.js"))})),x=Object(o.lazy)((function(){return Promise.all(/*! import() */[n.e(0),n.e(18)]).then(n.bind(null,/*! ../pages/User */"./src/components/pages/User.js"))}));t.default=function(){var e=Object(o.useContext)(l.default).loggedIn,t=Object(a.useLocation)(),n=Object(u.useTransition)(t,(function(e){return e.pathname}),{from:{opacity:0,transform:"scale(0.6) translateX(-100%)"},enter:{opacity:1,transform:"scale(1) translateX(0%)"},leave:{opacity:0,transform:"scale(0.6) translateX(70%)"},config:u.config.stiff});return Object(o.useEffect)((function(){e()}),[]),r.a.createElement(r.a.Fragment,null,n.map((function(e){var t=e.item,n=e.props,l=e.key;return r.a.createElement(u.animated.div,{key:"".concat(l,"anim"),style:n,className:"container"},r.a.createElement(o.Suspense,{fallback:r.a.createElement("div",{className:"main"},r.a.createElement("div",{className:"spinner"},r.a.createElement(i.ImpulseSpinner,{size:50,style:{margin:"auto"}})))},r.a.createElement(a.Switch,{location:t},r.a.createElement(c.default,{exact:!0,path:"/login",component:f}),r.a.createElement(c.default,{exact:!0,path:"/register",component:j}),r.a.createElement(s.default,{exact:!0,path:"/",component:d}),r.a.createElement(s.default,{exact:!0,path:"/add-post",component:b}),r.a.createElement(s.default,{exact:!0,path:"/account",component:p}),r.a.createElement(s.default,{exact:!0,path:"/user/:id",component:x}),r.a.createElement(s.default,{exact:!0,path:"/post/:id",component:m}),r.a.createElement(a.Route,{component:h}))))})))}}}]);
//# sourceMappingURL=5.main.js.map