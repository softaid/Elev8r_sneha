/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../../core/util","./typeConverter","../../core/Log","../../core/errors","../tools/WhyfoundProcessor"],function(e,t,r,a,i){function n(e){"@babel/helpers - typeof";return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(e)}function u(e,t){if(!(e instanceof t)){throw new TypeError("Cannot call a class as a function")}}function s(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||false;a.configurable=true;if("value"in a)a.writable=true;Object.defineProperty(e,a.key,a)}}function o(e,t,r){if(t)s(e.prototype,t);if(r)s(e,r);Object.defineProperty(e,"prototype",{writable:false});return e}function l(e,t,r){if(t in e){Object.defineProperty(e,t,{value:r,enumerable:true,configurable:true,writable:true})}else{e[t]=r}return e}var v=r["Log"];var c=a["InternalServerError"];var f=i["WhyfoundProcessor"];function g(e,t,r){if(r){return t?t(e()):e()}try{var a=Promise.resolve(e());return t?a.then(t):a}catch(e){return Promise.reject(e)}}function p(e,t,r){if(r){return t?t(e):e}if(!e||!e.then){e=Promise.resolve(e)}return t?e.then(t):e}var d=function(){function r(e){u(this,r);l(this,"log",new v("hana_odata item parser"));this.provider=e;this.sina=e.sina;this.intentsResolver=this.sina._createFioriIntentsResolver({sina:this.sina});this.suvNavTargetResolver=this.sina._createSuvNavTargetResolver({sina:this.sina})}o(r,[{key:"parse",value:function e(t,r){var a=this;return g(function(){if(r.error&&!r.value){return Promise.reject(new c(r.error.message))}if(!r.value){return Promise.resolve([])}if(r.error){a.log.warn("Server-side Warning: "+r.error.message)}var e=r.value;var i=[];for(var n=0;n<e.length;++n){var u=e[n];var s=void 0;try{s=a.parseItem(u,t);i.push(s)}catch(e){a.log.warn("Error occurred by parsing result item number "+n+": "+e.message)}}return Promise.all(i)})}},{key:"parseItem",value:function r(a,i){var u=this;return g(function(){var r;var s=[];var o=[];var l=[];var v=[];var c={};var g={};var d=a["@odata.context"]||"";var h=d.lastIndexOf("#");if(h>-1){d=d.slice(h+1)}var m=(r=u.sina.getDataSource(d))!==null&&r!==void 0?r:i.getDataSource();var b=a["@com.sap.vocabularies.Search.v1.WhyFound"]||{};var y=a["@com.sap.vocabularies.Search.v1.hasChildren"]||false;var S=u.sina._createSearchResultSetItemAttribute({id:"HASHIERARCHYNODECHILD",label:"HASHIERARCHYNODECHILD",value:y.toString(),valueFormatted:y.toString(),valueHighlighted:y.toString(),isHighlighted:false,metadata:undefined,groups:[]});c[S.id]=S;s.push(S);var A;var T="";var I={};var P,R;var _=[];var H;var N=a["@com.sap.vocabularies.Search.v1.Ranking"];var O=new f(u.sina);var D=u.preParseItem(a);for(var w in D){if(i.groupBy&&i.groupBy.aggregateCountAlias&&i.groupBy.aggregateCountAlias===w){continue}var C=D[w];A=m.getAttributeMetadata(w);if(A.id=="LOC_4326"){A.usage.Detail.displayOrder=-1}var U=t.odata2Sina(A.type,C.value);var M=O.processRegularWhyFoundAttributes(w,C,b,A);var j="";if(typeof U==="string"){j=U}else if(U!==null&&U!==undefined){j=JSON.stringify(U)}var E=u.sina._createSearchResultSetItemAttribute({id:A.id,label:A.label,value:U,valueFormatted:j,valueHighlighted:M,isHighlighted:O.calIsHighlighted(M),metadata:A,groups:[]});if(A.iconUrlAttributeName&&D[A.iconUrlAttributeName]){var k=D[A.iconUrlAttributeName];if(n(k)==="object"&&k.value){E.iconUrl=k.value}else{E.iconUrl=k}}e.appendRemovingDuplicates(_,e.extractHighlightedTerms(E.valueHighlighted));if(A.usage.Title){o.push(E)}if(A.usage.TitleDescription){v.push(E)}if(A.usage.Detail){l.push(E)}s.push(E);if(A.usage.Navigation){if(A.usage.Navigation.mainNavigation){H=u.sina._createNavigationTarget({label:E.value,targetUrl:E.value,target:"_blank"})}}c[E.id]=E;T=m.attributeMetadataMap[A.id]._private.semanticObjectType||"";if(T.length>0){g[T]=U}}for(R in I){P=I[R];if(typeof P.suvTargetUrlAttribute==="string"){P.suvTargetUrlAttribute=c[P.suvTargetUrlAttribute]}if(typeof P.suvTargetMimeTypeAttribute==="string"){P.suvTargetMimeTypeAttribute=c[P.suvTargetMimeTypeAttribute]}if(!(P.suvTargetUrlAttribute||P.suvTargetMimeTypeAttribute)){delete I[R]}}o.sort(function(e,t){return e.metadata.usage.Title.displayOrder-t.metadata.usage.Title.displayOrder});l.sort(function(e,t){return e.metadata.usage.Detail.displayOrder-t.metadata.usage.Detail.displayOrder});u.suvNavTargetResolver.resolveSuvNavTargets(m,I,_);var W=u.sina._createSearchResultSetItem({dataSource:m,attributes:s,titleAttributes:o,titleDescriptionAttributes:v,detailAttributes:l,defaultNavigationTarget:H,navigationTargets:[],score:N});W._private.allAttributesMap=c;W._private.semanticObjectTypeAttributes=g;var F=u.sina._createItemPostParser({searchResultSetItem:W});return p(F.postParseResultSetItem(),function(e){return p(O.processAdditionalWhyfoundAttributes(b,e))})})}},{key:"preParseItem",value:function e(t){var r={};for(var a in t){if(a[0]==="@"||a[0]==="_"){continue}var i=t[a];var n=a.split("@");var u=n[0];var s=r[u];if(!s){s={};r[u]=s}if(n.length===1){s.value=i;continue}if(n.length===2){s[n[1]]=i;continue}throw"more than two @ in property name"}return r}}]);return r}();var h={__esModule:true};h.ItemParser=d;return h})})();