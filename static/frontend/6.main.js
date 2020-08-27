(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{"./src/components/auth/Register.js":
/*!*****************************************!*\
  !*** ./src/components/auth/Register.js ***!
  \*****************************************/
/*! exports provided: default */function(e,t,a){"use strict";a.r(t);var r=a(/*! @babel/runtime/helpers/defineProperty */"./node_modules/@babel/runtime/helpers/defineProperty.js"),s=a.n(r),n=a(/*! @babel/runtime/helpers/slicedToArray */"./node_modules/@babel/runtime/helpers/slicedToArray.js"),o=a.n(n),l=a(/*! react */"./node_modules/react/index.js"),c=a.n(l),i=a(/*! ../../context/auth/AuthContext */"./src/context/auth/AuthContext.js"),u=a(/*! ../../context/alert/AlertContext */"./src/context/alert/AlertContext.js"),d=a(/*! react-spinners-kit */"./node_modules/react-spinners-kit/lib/index.js");function m(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function p(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?m(Object(a),!0).forEach((function(t){s()(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):m(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}t.default=function(){var e=Object(l.useState)({username:"",password:""}),t=o()(e,2),a=t[0],r=t[1],n=Object(l.useState)(!1),m=o()(n,2),b=(m[0],m[1],Object(l.useState)({disabled:!0,loading:!1})),g=o()(b,2),f=g[0],h=g[1],w=Object(l.useContext)(i.default),j=Object(l.useContext)(u.default),O=j.setAlert,v=j.removeAlert;Object(l.useEffect)((function(){v()}),[]);var y=function(e){var t=e.target.name;r(p(p({},a),{},s()({},t,e.target.value))),"username"===t?e.target.value.length<1?(O("Username too short","warning"),h(p(p({},f),{},{disabled:!0}))):a.password.length>8&&e.target.value.length>0&&(v(),h(p(p({},f),{},{disabled:!1}))):"password"===t&&(e.target.value.length<8?(O("Password too short","warning"),h(p(p({},f),{},{disabled:!0}))):a.username.length>0&&e.target.value.length>8&&(v(),h(p(p({},f),{},{disabled:!1}))))};return c.a.createElement("div",{className:"main"},c.a.createElement("form",{className:"form-auth",method:"post",onSubmit:function(e){e.preventDefault(),h({disabled:!0,loading:!0}),""!==a.username&&w.Register(a.username,a.password),h({disabled:!1,loading:!1})}},c.a.createElement("p",{className:"h2"},"Register"),c.a.createElement("div",{className:"form-group"},c.a.createElement("label",{className:"label-hide",htmlFor:"username"},"Username"),c.a.createElement("input",{type:"text",className:"form-control",name:"username",onChange:y,placeholder:"Username",id:"username",value:a.username})),c.a.createElement("div",{className:"form-group"},c.a.createElement("label",{className:"label-hide",htmlFor:"password"},"Password"),c.a.createElement("input",{id:"password",type:"password",className:"form-control",name:"password",onChange:y,placeholder:"Password",value:a.password})),c.a.createElement("button",{type:"submit",className:"btn btn-teal",disabled:f.disabled},f.loading?c.a.createElement(d.ImpulseSpinner,{size:40,style:{margin:"auto"}}):"Register")))}}}]);
//# sourceMappingURL=6.main.js.map