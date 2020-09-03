(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{"./src/components/pages/ChangePassword.js":
/*!************************************************!*\
  !*** ./src/components/pages/ChangePassword.js ***!
  \************************************************/
/*! exports provided: default */function(e,t,r){"use strict";r.r(t);var a=r(/*! react */"./node_modules/react/index.js"),n=r.n(a),o=r(/*! ../../context/alert/AlertContext */"./src/context/alert/AlertContext.js"),s=r(/*! ../../Queries */"./src/Queries.js"),c=r(/*! @apollo/client */"./node_modules/@apollo/client/index.js"),l=r(/*! react-router-dom */"./node_modules/react-router-dom/esm/react-router-dom.js");function u(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?u(Object(r),!0).forEach((function(t){m(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):u(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function m(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function p(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var r=[],a=!0,n=!1,o=void 0;try{for(var s,c=e[Symbol.iterator]();!(a=(s=c.next()).done)&&(r.push(s.value),!t||r.length!==t);a=!0);}catch(e){n=!0,o=e}finally{try{a||null==c.return||c.return()}finally{if(n)throw o}}return r}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return f(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return f(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,a=new Array(t);r<t;r++)a[r]=e[r];return a}t.default=function(){var e=p(Object(a.useState)({password:"",newPassword:"",disabled:!1,change:!0}),2),t=e[0],r=e[1],u=Object(c.useMutation)(s.UPDATE_USER),f=Object(a.useContext)(o.default),w=f.setAlert,b=(f.removeAlert,function(e){r(i(i({},t),{},m({},e.target.name,e.target.value)))});return t.changed?n.a.createElement(l.Redirect,{to:"/"}):n.a.createElement("form",{className:"form-auth",method:"post",onSubmit:function(e){e.preventDefault(),u({variables:{newPassword:t.newPassword,password:t.password}}).then((function(e){e.data&&(d.data.updateUser.ok?r(i(i({},t),{},{changed:!0})):w(d.data.updateUser.message,"danger"))}))}},n.a.createElement("p",{className:"h2"},"Change Password"),n.a.createElement("div",{className:"form-group"},n.a.createElement("label",{className:"label-hide",htmlFor:"password"},"Password"),n.a.createElement("input",{type:"password",className:"form-control",name:"password",onChange:b,placeholder:"Password",value:t.password,id:"password"})),n.a.createElement("div",{className:"form-group"},n.a.createElement("label",{className:"label-hide",htmlFor:"newPassword"},"New Password"),n.a.createElement("input",{type:"password",className:"form-control",name:"newPassword",onChange:b,placeholder:"New Password",value:t.newPassword,id:"newPassword"})),n.a.createElement("button",{type:"submit",className:"btn btn-teal",disabled:t.disabled},"Change"))}}}]);
//# sourceMappingURL=15.main.js.map