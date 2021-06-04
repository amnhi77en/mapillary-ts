(self.webpackChunkmapillary_js_doc=self.webpackChunkmapillary_js_doc||[]).push([[428],{3905:function(e,t,r){"use strict";r.d(t,{Zo:function(){return s},kt:function(){return f}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var o=n.createContext({}),v=function(e){var t=n.useContext(o),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},s=function(e){var t=v(e.components);return n.createElement(o.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,o=e.parentName,s=p(e,["components","mdxType","originalType","parentName"]),u=v(r),f=a,d=u["".concat(o,".").concat(f)]||u[f]||c[f]||i;return r?n.createElement(d,l(l({ref:t},s),{},{components:r})):n.createElement(d,l({ref:t},s))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,l=new Array(i);l[0]=u;var p={};for(var o in t)hasOwnProperty.call(t,o)&&(p[o]=t[o]);p.originalType=e,p.mdxType="string"==typeof e?e:a,l[1]=p;for(var v=2;v<i;v++)l[v]=r[v];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},5972:function(e,t,r){"use strict";r.r(t),r.d(t,{frontMatter:function(){return l},metadata:function(){return p},toc:function(){return o},default:function(){return s}});var n=r(2122),a=r(9756),i=(r(7294),r(3905)),l={id:"viewer.viewernavigationedgeevent",title:"Interface: ViewerNavigationEdgeEvent",sidebar_label:"ViewerNavigationEdgeEvent",custom_edit_url:null},p={unversionedId:"interfaces/viewer.viewernavigationedgeevent",id:"interfaces/viewer.viewernavigationedgeevent",isDocsHomePage:!1,title:"Interface: ViewerNavigationEdgeEvent",description:"viewer.ViewerNavigationEdgeEvent",source:"@site/api/interfaces/viewer.viewernavigationedgeevent.md",sourceDirName:"interfaces",slug:"/interfaces/viewer.viewernavigationedgeevent",permalink:"/mapillary-js/api/interfaces/viewer.viewernavigationedgeevent",editUrl:null,version:"current",sidebar_label:"ViewerNavigationEdgeEvent",frontMatter:{id:"viewer.viewernavigationedgeevent",title:"Interface: ViewerNavigationEdgeEvent",sidebar_label:"ViewerNavigationEdgeEvent",custom_edit_url:null},sidebar:"api",previous:{title:"Interface: ViewerNavigableEvent",permalink:"/mapillary-js/api/interfaces/viewer.viewernavigableevent"},next:{title:"Interface: ViewerOptions",permalink:"/mapillary-js/api/interfaces/viewer.vieweroptions"}},o=[{value:"Hierarchy",id:"hierarchy",children:[]},{value:"Properties",id:"properties",children:[{value:"status",id:"status",children:[]},{value:"target",id:"target",children:[]},{value:"type",id:"type",children:[]}]}],v={toc:o};function s(e){var t=e.components,r=(0,a.Z)(e,["components"]);return(0,i.kt)("wrapper",(0,n.Z)({},v,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"/mapillary-js/api/modules/viewer"},"viewer"),".ViewerNavigationEdgeEvent"),(0,i.kt)("p",null,"Interface for navigation edge viewer events."),(0,i.kt)("h2",{id:"hierarchy"},"Hierarchy"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("a",{parentName:"p",href:"/mapillary-js/api/interfaces/viewer.viewerevent"},(0,i.kt)("em",{parentName:"a"},"ViewerEvent"))),(0,i.kt)("p",{parentName:"li"},"\u21b3 ",(0,i.kt)("strong",{parentName:"p"},"ViewerNavigationEdgeEvent")))),(0,i.kt)("h2",{id:"properties"},"Properties"),(0,i.kt)("h3",{id:"status"},"status"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("strong",{parentName:"p"},"status"),": ",(0,i.kt)("a",{parentName:"p",href:"/mapillary-js/api/interfaces/viewer.navigationedgestatus"},(0,i.kt)("em",{parentName:"a"},"NavigationEdgeStatus"))),(0,i.kt)("p",null,"The viewer's current navigation edge status."),(0,i.kt)("p",null,"Defined in: ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/mapillary/mapillary-js/blob/4a51ddef/src/viewer/events/ViewerNavigationEdgeEvent.ts#L12"},"viewer/events/ViewerNavigationEdgeEvent.ts:12")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"target"},"target"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("strong",{parentName:"p"},"target"),": ",(0,i.kt)("a",{parentName:"p",href:"/mapillary-js/api/interfaces/viewer.iviewer"},(0,i.kt)("em",{parentName:"a"},"IViewer"))),(0,i.kt)("p",null,"The viewer object that fired the event."),(0,i.kt)("p",null,"Inherited from: ",(0,i.kt)("a",{parentName:"p",href:"/mapillary-js/api/interfaces/viewer.viewerevent"},"ViewerEvent"),".",(0,i.kt)("a",{parentName:"p",href:"/mapillary-js/api/interfaces/viewer.viewerevent#target"},"target")),(0,i.kt)("p",null,"Defined in: ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/mapillary/mapillary-js/blob/4a51ddef/src/viewer/events/ViewerEvent.ts#L11"},"viewer/events/ViewerEvent.ts:11")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"type"},"type"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("strong",{parentName:"p"},"type"),": ",(0,i.kt)("inlineCode",{parentName:"p"},'"sequenceedges"')," ","|"," ",(0,i.kt)("inlineCode",{parentName:"p"},'"spatialedges"')),(0,i.kt)("p",null,"The event type."),(0,i.kt)("p",null,"Overrides: ",(0,i.kt)("a",{parentName:"p",href:"/mapillary-js/api/interfaces/viewer.viewerevent"},"ViewerEvent"),".",(0,i.kt)("a",{parentName:"p",href:"/mapillary-js/api/interfaces/viewer.viewerevent#type"},"type")),(0,i.kt)("p",null,"Defined in: ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/mapillary/mapillary-js/blob/4a51ddef/src/viewer/events/ViewerNavigationEdgeEvent.ts#L14"},"viewer/events/ViewerNavigationEdgeEvent.ts:14")))}s.isMDXComponent=!0}}]);