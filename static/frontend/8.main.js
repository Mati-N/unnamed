(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{104:function(e,t,n){"use strict";n.r(t);var r=n(2),o=n.n(r),i=n(91),a=n(4),s=n(25),c=n(51);function l(){return(l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function u(e){return function(e){if(Array.isArray(e))return w(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||h(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function p(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function f(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(Object(n),!0).forEach((function(t){d(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function d(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function v(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var a,s=e[Symbol.iterator]();!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}(e,t)||h(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function h(e,t){if(e){if("string"==typeof e)return w(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?w(e,t):void 0}}function w(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var y=Object(r.lazy)((function(){return n.e(2).then(n.bind(null,95))})),b=Object(r.lazy)((function(){return n.e(20).then(n.bind(null,101))}));t.default=function(e){var t=e.match.params.id,n=Object(a.useQuery)(s.e,{variables:{id:t}}),p=n.loading,d=n.data,h=(n.error,n.fetchMore),w=(n.refetch,v(Object(r.useState)(!0),2)),m=w[0],g=w[1];if(p&&!d)return o.a.createElement(c.ImpulseSpinner,{size:40});var O=d.posts.edges[0].node;return o.a.createElement(o.a.Fragment,null,o.a.createElement(y,l({key:O.id,user_id:O.user.id,username:O.user.username,show_comment:!0},O)),o.a.createElement(b,{comments:d.postComments.edges}),o.a.createElement(i.a,{onEnter:function(){h({query:s.e,variables:{cursor:d.postComments.pageInfo.endCursor,id:t},updateQuery:function(e,t){var n=t.fetchMoreResult;if(g(!0),!e.postComments.pageInfo.hasNextPage)return g(!1),e;var r=n.postComments.edges,o=n.postComments.pageInfo;return r.length?{post:f(f({},e.post),{},{postComments:{__typename:e.postComments.__typename,edges:[].concat(u(e.postComments.edges),u(r)),pageInfo:o}})}:e}}),g(!1)}},o.a.createElement("div",{className:"spinner"},(p||m)&&o.a.createElement(c.ImpulseSpinner,{size:40}))))}},91:function(e,t,n){"use strict";(function(e){n.d(t,"a",(function(){return b}));var r=n(92),o=(n(24),n(2)),i=n.n(o),a=n(30);function s(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function c(e){return(c=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function l(e,t){return(l=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function u(e,t){return!t||"object"!=typeof t&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function p(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=c(e);if(t){var o=c(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return u(this,n)}}function f(e,t){var n,r=(n=e,!isNaN(parseFloat(n))&&isFinite(n)?parseFloat(n):"px"===n.slice(-2)?parseFloat(n.slice(0,-2)):void 0);if("number"==typeof r)return r;var o=function(e){if("%"===e.slice(-1))return parseFloat(e.slice(0,-1))/100}(e);return"number"==typeof o?o*t:void 0}function d(e){return"string"==typeof e.type}var v;var h=[];function w(e){h.push(e),v||(v=setTimeout((function(){var e;for(v=null;e=h.shift();)e()}),0));var t=!0;return function(){if(t){t=!1;var n=h.indexOf(e);-1!==n&&(h.splice(n,1),!h.length&&v&&(clearTimeout(v),v=null))}}}var y={debug:!1,scrollableAncestor:void 0,children:void 0,topOffset:"0px",bottomOffset:"0px",horizontal:!1,onEnter:function(){},onLeave:function(){},onPositionChange:function(){},fireOnRapidScroll:!0},b=function(t){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&l(e,t)}(v,t);var n,o,c,u=p(v);function v(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,v),(t=u.call(this,e)).refElement=function(e){t._ref=e},t}return n=v,(o=[{key:"componentDidMount",value:function(){var e=this;v.getWindow()&&(this.cancelOnNextTick=w((function(){e.cancelOnNextTick=null;var t=e.props,n=t.children;t.debug,function(e,t){if(e&&!d(e)&&!t)throw new Error("<Waypoint> needs a DOM element to compute boundaries. The child you passed is neither a DOM element (e.g. <div>) nor does it use the innerRef prop.\n\nSee https://goo.gl/LrBNgw for more info.")}(n,e._ref),e._handleScroll=e._handleScroll.bind(e),e.scrollableAncestor=e._findScrollableAncestor(),e.scrollEventListenerUnsubscribe=Object(r.a)(e.scrollableAncestor,"scroll",e._handleScroll,{passive:!0}),e.resizeEventListenerUnsubscribe=Object(r.a)(window,"resize",e._handleScroll,{passive:!0}),e._handleScroll(null)})))}},{key:"componentDidUpdate",value:function(){var e=this;v.getWindow()&&this.scrollableAncestor&&(this.cancelOnNextTick||(this.cancelOnNextTick=w((function(){e.cancelOnNextTick=null,e._handleScroll(null)}))))}},{key:"componentWillUnmount",value:function(){v.getWindow()&&(this.scrollEventListenerUnsubscribe&&this.scrollEventListenerUnsubscribe(),this.resizeEventListenerUnsubscribe&&this.resizeEventListenerUnsubscribe(),this.cancelOnNextTick&&this.cancelOnNextTick())}},{key:"_findScrollableAncestor",value:function(){var t=this.props,n=t.horizontal,r=t.scrollableAncestor;if(r)return function(t){return"window"===t?e.window:t}(r);for(var o=this._ref;o.parentNode;){if((o=o.parentNode)===document.body)return window;var i=window.getComputedStyle(o),a=(n?i.getPropertyValue("overflow-x"):i.getPropertyValue("overflow-y"))||i.getPropertyValue("overflow");if("auto"===a||"scroll"===a||"overlay"===a)return o}return window}},{key:"_handleScroll",value:function(e){if(this._ref){var t=this._getBounds(),n=function(e){return e.viewportBottom-e.viewportTop==0?"invisible":e.viewportTop<=e.waypointTop&&e.waypointTop<=e.viewportBottom||e.viewportTop<=e.waypointBottom&&e.waypointBottom<=e.viewportBottom||e.waypointTop<=e.viewportTop&&e.viewportBottom<=e.waypointBottom?"inside":e.viewportBottom<e.waypointTop?"below":e.waypointTop<e.viewportTop?"above":"invisible"}(t),r=this._previousPosition,o=this.props,i=(o.debug,o.onPositionChange),a=o.onEnter,s=o.onLeave,c=o.fireOnRapidScroll;if(this._previousPosition=n,r!==n){var l={currentPosition:n,previousPosition:r,event:e,waypointTop:t.waypointTop,waypointBottom:t.waypointBottom,viewportTop:t.viewportTop,viewportBottom:t.viewportBottom};i.call(this,l),"inside"===n?a.call(this,l):"inside"===r&&s.call(this,l),c&&("below"===r&&"above"===n||"above"===r&&"below"===n)&&(a.call(this,{currentPosition:"inside",previousPosition:r,event:e,waypointTop:t.waypointTop,waypointBottom:t.waypointBottom,viewportTop:t.viewportTop,viewportBottom:t.viewportBottom}),s.call(this,{currentPosition:n,previousPosition:"inside",event:e,waypointTop:t.waypointTop,waypointBottom:t.waypointBottom,viewportTop:t.viewportTop,viewportBottom:t.viewportBottom}))}}}},{key:"_getBounds",value:function(){var e,t,n=this.props,r=n.horizontal,o=(n.debug,this._ref.getBoundingClientRect()),i=o.left,a=o.top,s=o.right,c=o.bottom,l=r?i:a,u=r?s:c;this.scrollableAncestor===window?(e=r?window.innerWidth:window.innerHeight,t=0):(e=r?this.scrollableAncestor.offsetWidth:this.scrollableAncestor.offsetHeight,t=r?this.scrollableAncestor.getBoundingClientRect().left:this.scrollableAncestor.getBoundingClientRect().top);var p=this.props,d=p.bottomOffset;return{waypointTop:l,waypointBottom:u,viewportTop:t+f(p.topOffset,e),viewportBottom:t+e-f(d,e)}}},{key:"render",value:function(){var e=this,t=this.props.children;return t?d(t)||Object(a.isForwardRef)(t)?i.a.cloneElement(t,{ref:function(n){e.refElement(n),t.ref&&("function"==typeof t.ref?t.ref(n):t.ref.current=n)}}):i.a.cloneElement(t,{innerRef:this.refElement}):i.a.createElement("span",{ref:this.refElement,style:{fontSize:0}})}}])&&s(n.prototype,o),c&&s(n,c),v}(i.a.PureComponent);b.above="above",b.below="below",b.inside="inside",b.invisible="invisible",b.getWindow=function(){if("undefined"!=typeof window)return window},b.defaultProps=y,b.displayName="Waypoint"}).call(this,n(52))},92:function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));var r=!("undefined"==typeof window||!window.document||!window.document.createElement);var o=void 0;function i(){return void 0===o&&(o=function(){if(!r)return!1;if(!window.addEventListener||!window.removeEventListener||!Object.defineProperty)return!1;var e=!1;try{var t=Object.defineProperty({},"passive",{get:function(){e=!0}}),n=function(){};window.addEventListener("testPassiveEventSupport",n,t),window.removeEventListener("testPassiveEventSupport",n,t)}catch(e){}return e}()),o}function a(e){e.handlers===e.nextHandlers&&(e.nextHandlers=e.handlers.slice())}function s(e){this.target=e,this.events={}}s.prototype.getEventHandlers=function(e,t){var n,r=String(e)+" "+String((n=t)?!0===n?100:(n.capture<<0)+(n.passive<<1)+(n.once<<2):0);return this.events[r]||(this.events[r]={handlers:[],handleEvent:void 0},this.events[r].nextHandlers=this.events[r].handlers),this.events[r]},s.prototype.handleEvent=function(e,t,n){var r=this.getEventHandlers(e,t);r.handlers=r.nextHandlers,r.handlers.forEach((function(e){e&&e(n)}))},s.prototype.add=function(e,t,n){var r=this,o=this.getEventHandlers(e,n);a(o),0===o.nextHandlers.length&&(o.handleEvent=this.handleEvent.bind(this,e,n),this.target.addEventListener(e,o.handleEvent,n)),o.nextHandlers.push(t);var i=!0;return function(){if(i){i=!1,a(o);var s=o.nextHandlers.indexOf(t);o.nextHandlers.splice(s,1),0===o.nextHandlers.length&&(r.target&&r.target.removeEventListener(e,o.handleEvent,n),o.handleEvent=void 0)}}};function c(e,t,n,r){e.__consolidated_events_handlers__||(e.__consolidated_events_handlers__=new s(e));var o=function(e){if(e)return i()?e:!!e.capture}(r);return e.__consolidated_events_handlers__.add(t,n,o)}}}]);