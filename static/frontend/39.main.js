(window.webpackJsonp=window.webpackJsonp||[]).push([[39],{"./src/components/pages/NewPost.js":
/*!*****************************************!*\
  !*** ./src/components/pages/NewPost.js ***!
  \*****************************************/
/*! exports provided: default */function(e,t,r){"use strict";r.r(t);var n=r(/*! react */"./node_modules/react/index.js"),o=r.n(n),a=r(/*! @apollo/client */"./node_modules/@apollo/client/index.js"),i=r(/*! ../../Queries */"./src/Queries.js"),s=r(/*! ../../context/alert/AlertContext */"./src/context/alert/AlertContext.js"),l=r(/*! react-router-dom */"./node_modules/react-router-dom/esm/react-router-dom.js"),c=r(/*! formik */"./node_modules/formik/dist/formik.esm.js"),u=r(/*! @material-ui/core */"./node_modules/@material-ui/core/esm/index.js"),m=r(/*! yup */"./node_modules/yup/es/index.js");function d(e){return function(e){if(Array.isArray(e))return g(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||p(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function y(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?f(Object(r),!0).forEach((function(t){O(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):f(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function b(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var r=[],n=!0,o=!1,a=void 0;try{for(var i,s=e[Symbol.iterator]();!(n=(i=s.next()).done)&&(r.push(i.value),!t||r.length!==t);n=!0);}catch(e){o=!0,a=e}finally{try{n||null==s.return||s.return()}finally{if(o)throw a}}return r}(e,t)||p(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function p(e,t){if(e){if("string"==typeof e)return g(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?g(e,t):void 0}}function g(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function O(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var h=Object(u.makeStyles)((function(e){return{form:O({marginTop:e.spacing(15),width:"75%",margin:"auto"},e.breakpoints.up("sm"),{width:"90%"}),formField:{padding:"0.2em"},formControl:{margin:"0.1em",padding:"0.1em"},formLabel:{margin:"auto",width:"auto",fontSize:"2.5em"},submit:{margin:e.spacing(3,0,2)}}}));t.default=function(){var e=h(),t=b(Object(a.useMutation)(i.CREATE_POST),1)[0],r=Object(l.useHistory)(),f=Object(n.useContext)(s.default),p=f.setAlert,g=f.removeAlert;Object(n.useEffect)((function(){g()}),[]);return o.a.createElement(c.Formik,{initialValues:{title:"",content:""},validationSchema:m.object({title:m.string().max(30,"Must be 30 characters or less").required("Required"),content:m.string().min(20,"Must be 20 characters or more").required("Required")}),onSubmit:function(e,n){var o,a=n.setSubmitting;a(!0),t({variables:{title:(o=e).title,text:o.content},update:function(e,t){var r=t.data;if(e){try{var n=e.readQuery({query:i.FOLLOWING_POSTS}).followingPosts;if(n){var o=y(y({},n),{},{edges:[{__typename:"PostNodeEdge",node:r.createPost.post}].concat(d(n.edges))});e.writeQuery({query:i.FOLLOWING_POSTS,data:{followingPosts:o}})}}catch(e){}try{var a=e.readQuery({query:i.GET_POSTS}).posts;if(a){var s=y(y({},a),{},{edges:[{__typename:"PostNodeEdge",node:r.createPost.post}].concat(d(a.edges))});e.writeQuery({query:i.GET_POSTS,data:{posts:s}})}}catch(e){}try{var l=e.readQuery({query:i.SELF_POSTS}).selfPost;if(l){var c=y(y({},l),{},{edges:[{__typename:"PostNodeEdge",node:r.createPost.post}].concat(d(l.edges))});e.writeQuery({query:i.SELF_POSTS,data:{selfPost:c}})}}catch(e){}}}}).catch((function(e){return console.log(e)})).then((function(e){e&&(null!==e&&e.data.createPost.ok?(p("Post Sent","success"),r.push("/")):p("Something went wrong","warning"))})),a(!1)}},(function(t){var r=t.isSubmitting,n=t.isValid,a=t.dirty;return o.a.createElement(c.Form,{className:e.form},o.a.createElement("p",{className:e.formLabel},"New Post"),o.a.createElement(u.FormControl,{className:e.formControl,fullWidth:!0},o.a.createElement(c.Field,{type:"text",name:"title",as:u.TextField,label:"Title",className:e.formField,fullWidth:!0}),o.a.createElement(c.ErrorMessage,{name:"title",component:u.FormHelperText,error:!0})),o.a.createElement(u.FormControl,{className:e.formControl,fullWidth:!0},o.a.createElement(c.Field,{type:"text",name:"content",as:u.TextField,label:"Content",className:e.formField,multiline:!0,variant:"outlined",fullWidth:!0,rows:10,rowsMax:35}),o.a.createElement(c.ErrorMessage,{name:"content",component:u.FormHelperText,error:!0})),o.a.createElement(u.FormControl,{className:e.formControl,fullWidth:!0},o.a.createElement("button",{type:"submit",className:"btn btn-teal",disabled:r||!n||!a},"Submit")))}))}}}]);
//# sourceMappingURL=39.main.js.map