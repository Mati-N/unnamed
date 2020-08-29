(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{"./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js ***!
  \******************************************************************/
/*! no static exports found */function(e,t,n){var r=n(/*! ./arrayLikeToArray */"./node_modules/@babel/runtime/helpers/arrayLikeToArray.js");e.exports=function(e){if(Array.isArray(e))return r(e)}},"./node_modules/@babel/runtime/helpers/iterableToArray.js":
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
/*! no static exports found */function(e,t,n){var r=n(/*! ./arrayWithoutHoles */"./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js"),o=n(/*! ./iterableToArray */"./node_modules/@babel/runtime/helpers/iterableToArray.js"),a=n(/*! ./unsupportedIterableToArray */"./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js"),l=n(/*! ./nonIterableSpread */"./node_modules/@babel/runtime/helpers/nonIterableSpread.js");e.exports=function(e){return r(e)||o(e)||a(e)||l()}},"./src/components/pages/NewPost.js":
/*!*****************************************!*\
  !*** ./src/components/pages/NewPost.js ***!
  \*****************************************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var r=n(/*! @babel/runtime/helpers/toConsumableArray */"./node_modules/@babel/runtime/helpers/toConsumableArray.js"),o=n.n(r),a=n(/*! @babel/runtime/helpers/defineProperty */"./node_modules/@babel/runtime/helpers/defineProperty.js"),l=n.n(a),s=n(/*! @babel/runtime/helpers/slicedToArray */"./node_modules/@babel/runtime/helpers/slicedToArray.js"),i=n.n(s),c=n(/*! react */"./node_modules/react/index.js"),u=n.n(c),m=n(/*! @apollo/client */"./node_modules/@apollo/client/index.js"),b=n(/*! ../../Queries */"./src/Queries.js"),d=n(/*! ../../context/alert/AlertContext */"./src/context/alert/AlertContext.js");function p(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function f(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(Object(n),!0).forEach((function(t){l()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var h=Object(c.lazy)((function(){return Promise.resolve().then(n.bind(null,/*! react-router-dom */"./node_modules/react-router-dom/esm/react-router-dom.js"))})).Redirect;t.default=function(){var e,t=Object(c.useState)({title:"",content:""}),n=i()(t,2),r=n[0],a=n[1],s=Object(c.useState)(!0),p=i()(s,2),g=p[0],y=p[1],j=Object(c.useState)(!1),v=i()(j,2),O=v[0],w=v[1],_=Object(m.useMutation)(b.CREATE_POST),E=i()(_,1)[0],S=Object(c.useContext)(d.default),P=S.setAlert,T=S.removeAlert,A=function(e){var t=e.target.name;switch(a(f(f({},r),{},l()({},t,e.target.value))),t){case"title":e.target.value.length<1?(P("Title too short","warning"),y(!0)):e.target.value.length>260?(P("Title too long","warning"),a(f(f({},r),{},{title:r.title.substring(0,260)})),y(!0)):r.content.length>0&&r.content.length<=5500&&(T(),y(!1));case"content":e.target.value.length<1?(P("Content too short","warning"),y(!0)):e.target.value.length>5500?(P("Content too long","warning"),a(f(f({},r),{},{content:r.content.substring(0,5500)})),y(!0)):r.title.length>0&&r.title.length<=260&&(T(),y(!1))}};Object(c.useEffect)((function(){T()}),[]);return O?u.a.createElement(h,{to:"/"}):u.a.createElement("div",{className:"main"},u.a.createElement("form",{onSubmit:function(e){e.preventDefault(),E({variables:{title:r.title,text:r.content},update:function(e,t){var n=t.data;if(e){var r=e.readQuery({query:b.GET_POSTS}).posts;console.log(r);var a=f(f({},r),{},{edges:[{__typename:"PostNodeEdge",node:n.createPost.post}].concat(o()(r.edges))});e.writeQuery({query:b.GET_POSTS,data:{posts:a}})}}}).catch((function(e){return console.log(e)})).then((function(e){e&&(null!==e&&e.data.createPost.ok?(P("Post Sent","primary"),w(!0)):P("Something went wrong","warning"))}))},method:"post",className:"form-auth"},u.a.createElement("div",{className:"form-group"},u.a.createElement("label",{className:"label-hide",htmlFor:"title"},"Title"),u.a.createElement("input",l()({type:"text",className:"form-control",name:"title",placeholder:"Title","aria-describedby":"emailHelp",value:r.title,onChange:A},"name","title"))),u.a.createElement("div",{className:"form-group"},u.a.createElement("label",{htmlFor:"content"},"Content"),u.a.createElement("textarea",(e={name:"content",value:r.text,className:"form-control"},l()(e,"name","content"),l()(e,"rows","3"),l()(e,"onChange",A),l()(e,"id","content"),e))),u.a.createElement("button",{disabled:g,type:"submit",className:"btn btn-teal"},"Submit")))}}}]);
//# sourceMappingURL=6.main.js.map