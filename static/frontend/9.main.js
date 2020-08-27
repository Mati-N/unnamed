(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{"./src/components/pages/NewPost.js":
/*!*****************************************!*\
  !*** ./src/components/pages/NewPost.js ***!
  \*****************************************/
/*! exports provided: default */function(e,t,n){"use strict";n.r(t);var r=n(/*! @babel/runtime/helpers/toConsumableArray */"./node_modules/@babel/runtime/helpers/toConsumableArray.js"),o=n.n(r),a=n(/*! @babel/runtime/helpers/defineProperty */"./node_modules/@babel/runtime/helpers/defineProperty.js"),l=n.n(a),c=n(/*! @babel/runtime/helpers/slicedToArray */"./node_modules/@babel/runtime/helpers/slicedToArray.js"),s=n.n(c),i=n(/*! react */"./node_modules/react/index.js"),u=n.n(i),m=n(/*! @apollo/client */"./node_modules/@apollo/client/index.js"),d=n(/*! ../../Queries */"./src/Queries.js"),b=n(/*! ../../context/alert/AlertContext */"./src/context/alert/AlertContext.js");function g(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?g(Object(n),!0).forEach((function(t){l()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):g(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var f=Object(i.lazy)((function(){return Promise.resolve().then(n.bind(null,/*! react-router-dom */"./node_modules/react-router-dom/esm/react-router-dom.js"))})).Redirect;t.default=function(){var e,t=Object(i.useState)({title:"",content:""}),n=s()(t,2),r=n[0],a=n[1],c=Object(i.useState)(!0),g=s()(c,2),h=g[0],j=g[1],O=Object(i.useState)(!1),v=s()(O,2),y=v[0],w=v[1],E=Object(m.useMutation)(d.CREATE_POST),P=s()(E,1)[0],S=Object(i.useContext)(b.default),T=S.setAlert,_=S.removeAlert,N=function(e){var t=e.target.name;switch(a(p(p({},r),{},l()({},t,e.target.value))),t){case"title":e.target.value.length<1?(T("Title too short","warning"),j(!0)):e.target.value.length>260?(T("Title too long","warning"),a(p(p({},r),{},{title:r.title.substring(0,260)})),j(!0)):r.content.length>0&&r.content.length<=5500&&(_(),j(!1));case"content":e.target.value.length<1?(T("Content too short","warning"),j(!0)):e.target.value.length>5500?(T("Content too long","warning"),a(p(p({},r),{},{content:r.content.substring(0,5500)})),j(!0)):r.title.length>0&&r.title.length<=260&&(_(),j(!1))}};Object(i.useEffect)((function(){_()}),[]);return y?u.a.createElement(f,{to:"/"}):u.a.createElement("div",{className:"main"},u.a.createElement("form",{onSubmit:function(e){e.preventDefault(),P({variables:{title:r.title,text:r.content},update:function(e,t){var n=t.data;if(e){var r=e.readQuery({query:d.GET_POSTS}).posts;console.log(r);var a=p(p({},r),{},{edges:[{__typename:"PostNodeEdge",node:n.createPost.post}].concat(o()(r.edges))});e.writeQuery({query:d.GET_POSTS,data:{posts:a}})}}}).catch((function(e){return console.log(e)})).then((function(e){e&&(null!==e&&e.data.createPost.ok?(T("Post Sent","primary"),w(!0)):T("Something went wrong","warning"))}))},method:"post",className:"form-auth"},u.a.createElement("div",{className:"form-group"},u.a.createElement("label",{className:"label-hide",htmlFor:"title"},"Title"),u.a.createElement("input",l()({type:"text",className:"form-control",name:"title",placeholder:"Title","aria-describedby":"emailHelp",value:r.title,onChange:N},"name","title"))),u.a.createElement("div",{className:"form-group"},u.a.createElement("label",{htmlFor:"content"},"Content"),u.a.createElement("textarea",(e={name:"content",value:r.text,className:"form-control"},l()(e,"name","content"),l()(e,"rows","3"),l()(e,"onChange",N),l()(e,"id","content"),e))),u.a.createElement("button",{disabled:h,type:"submit",className:"btn btn-teal"},"Submit")))}}}]);
//# sourceMappingURL=9.main.js.map