(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{119:function(e,n,r){"use strict";r.r(n);var t=r(41),a=r.n(t),l=(r(103),r(40),r(21)),c=r.n(l),o=r(0),u=r.n(o),s=(r(107),r(8)),i=r(30),m=r(33),d=r(111);var p=function(e){var n=e.error,r=e.componentStack,t=e.resetErrorBoundary;return u.a.createElement("div",{role:"alert"},u.a.createElement("p",null,"Something went wrong:"),u.a.createElement("pre",null,n.message),u.a.createElement("pre",null,r),u.a.createElement("button",{onClick:t},"Try again"))};var E=Object(o.lazy)((function(){return r.e(0).then(r.bind(null,109))}));n.default=function(e){var n=e.match.params.id,r=Object(s.useQuery)(i.d,{variables:{id:n}}),t=r.loading,l=r.data,b=(r.error,r.fetchMore,r.refetch,Object(o.useState)(!0)),v=c()(b,2),f=v[0];v[1];if(t&&!l)return u.a.createElement(m.ImpulseSpinner,{size:40});var g=l.posts.edges[0].node;return u.a.createElement(d.ErrorBoundary,{FallbackComponent:p},u.a.createElement("div",{className:"main"},u.a.createElement(E,a()({key:g.id,likes:g.likers.length,comments:g.commentSet.length,user_id:g.user.id,username:g.user.username},g)),(t||f)&&u.a.createElement(m.ImpulseSpinner,null)))}}}]);
//# sourceMappingURL=11.main.js.map