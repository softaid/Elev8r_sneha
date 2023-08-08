/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define([],function(){function r(r,e,n){if(e in r){Object.defineProperty(r,e,{value:n,enumerable:true,configurable:true,writable:true})}else{r[e]=n}return r}function e(r,e){if(!(r instanceof e)){throw new TypeError("Cannot call a class as a function")}}function n(r,e){for(var n=0;n<e.length;n++){var t=e[n];t.enumerable=t.enumerable||false;t.configurable=true;if("value"in t)t.writable=true;Object.defineProperty(r,t.key,t)}}function t(r,e,t){if(e)n(r.prototype,e);if(t)n(r,t);Object.defineProperty(r,"prototype",{writable:false});return r}function o(r,e){if(typeof e!=="function"&&e!==null){throw new TypeError("Super expression must either be null or a function")}r.prototype=Object.create(e&&e.prototype,{constructor:{value:r,writable:true,configurable:true}});Object.defineProperty(r,"prototype",{writable:false});if(e)f(r,e)}function a(r){var e=c();return function n(){var t=d(r),o;if(e){var a=d(this).constructor;o=Reflect.construct(t,arguments,a)}else{o=t.apply(this,arguments)}return i(this,o)}}function i(r,e){if(e&&(typeof e==="object"||typeof e==="function")){return e}else if(e!==void 0){throw new TypeError("Derived constructors may only return object or undefined")}return u(r)}function u(r){if(r===void 0){throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}return r}function s(r){var e=typeof Map==="function"?new Map:undefined;s=function r(n){if(n===null||!v(n))return n;if(typeof n!=="function"){throw new TypeError("Super expression must either be null or a function")}if(typeof e!=="undefined"){if(e.has(n))return e.get(n);e.set(n,t)}function t(){return l(n,arguments,d(this).constructor)}t.prototype=Object.create(n.prototype,{constructor:{value:t,enumerable:false,writable:true,configurable:true}});return f(t,n)};return s(r)}function l(r,e,n){if(c()){l=Reflect.construct}else{l=function r(e,n,t){var o=[null];o.push.apply(o,n);var a=Function.bind.apply(e,o);var i=new a;if(t)f(i,t.prototype);return i}}return l.apply(null,arguments)}function c(){if(typeof Reflect==="undefined"||!Reflect.construct)return false;if(Reflect.construct.sham)return false;if(typeof Proxy==="function")return true;try{Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}));return true}catch(r){return false}}function v(r){return Function.toString.call(r).indexOf("[native code]")!==-1}function f(r,e){f=Object.setPrototypeOf||function r(e,n){e.__proto__=n;return e};return f(r,e)}function d(r){d=Object.setPrototypeOf?Object.getPrototypeOf:function r(e){return e.__proto__||Object.getPrototypeOf(e)};return d(r)}var p=function(r){o(i,r);var n=a(i);function i(r){var t,o;var a;e(this,i);a=n.call(this,r.message);a.message=(t=r.message)!==null&&t!==void 0?t:"Unspecified ESH Client Error";a.name=(o=r.name)!==null&&o!==void 0?o:"ESHClientError";a.previous=r.previous;return a}t(i,[{key:"toString",value:function r(){return this.name+": "+this.message}}]);return i}(s(Error));var m=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"InternalESHClientError",message:r!==null&&r!==void 0?r:"Internal ESH Client Error"};return n.call(this,t)}return t(i)}(p);function h(r,e){var n=new E(r,e);try{var t,o,a,i,u,s,l,c,v,f,d;var p;if(r!==null&&r!==void 0&&r.responseText){p=JSON.parse(r===null||r===void 0?void 0:r.responseText)}if((t=p)!==null&&t!==void 0&&(o=t.Error)!==null&&o!==void 0&&o.Code&&(a=p)!==null&&a!==void 0&&(i=a.Error)!==null&&i!==void 0&&i.Message){return new y(r)}if((u=p)!==null&&u!==void 0&&(s=u.error)!==null&&s!==void 0&&s.code&&(l=p)!==null&&l!==void 0&&(c=l.error)!==null&&c!==void 0&&(v=c.message)!==null&&v!==void 0&&v.value){return new g(r)}if((f=p)!==null&&f!==void 0&&(d=f.error)!==null&&d!==void 0&&d.details){return new S(r)}return n}catch(r){var h=new m("Error while extracting server error");h.previous=r;n.previous=h;return n}}var E=function(r){o(i,r);var n=a(i);function i(r,t){var o,a;var u;e(this,i);var s=r.status;var l=(o=r.statusText)!==null&&o!==void 0?o:"";var c=(a=r.responseText)!==null&&a!==void 0?a:"";u=n.call(this,{message:s+": "+l+" - "+c,name:"ESHAjaxError"});u.xhttp=r;u.responseHeaders=t;return u}return t(i)}(p);var g=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t="Internal Server Error";if(r!==null&&r!==void 0&&r.responseText){var o,a,u;var s=JSON.parse(r===null||r===void 0?void 0:r.responseText);if(s!==null&&s!==void 0&&(o=s.error)!==null&&o!==void 0&&o.code){t=s.error.code}if(s!==null&&s!==void 0&&(a=s.error)!==null&&a!==void 0&&(u=a.message)!==null&&u!==void 0&&u.value){t+=": "+s.error.message.value}}return n.call(this,{message:t,name:"ESHABAPODataError"})}return t(i)}(p);var y=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t=["Internal Server Error"];if(r!==null&&r!==void 0&&r.responseText){var o,a;var u=JSON.parse(r===null||r===void 0?void 0:r.responseText);if(u!==null&&u!==void 0&&(o=u.Error)!==null&&o!==void 0&&o.Code&&u!==null&&u!==void 0&&(a=u.Error)!==null&&a!==void 0&&a.Message){t.push(u.Error.Code+": "+u.Error.Message)}if(u!==null&&u!==void 0&&u.ErrorDetails){for(var s=0;s<u.ErrorDetails.length;++s){var l=u.ErrorDetails[s];t.push(l.Code+": "+l.Message)}}if(u!==null&&u!==void 0&&u.Messages){for(var c=0;c<u.Messages.length;++c){var v=u.Messages[c];t.push(v.Number+": "+v.Text+" ("+v.Type+")")}}}return n.call(this,{message:t.join("\n"),name:"ESHINAV2Error"})}return t(i)}(p);var S=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t="Internal Server Error";if(r!==null&&r!==void 0&&r.responseText){var o;var a=JSON.parse(r===null||r===void 0?void 0:r.responseText);if(a!==null&&a!==void 0&&(o=a.error)!==null&&o!==void 0&&o.details){t=a.error.details}}return n.call(this,{message:t,name:"ESHHANAODataError"})}return t(i)}(p);var b=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"NoJSONDateError",message:r!==null&&r!==void 0?r:"No JSON Date"};return n.call(this,t)}return t(i)}(p);var w=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"TimeOutError",message:r!==null&&r!==void 0?r:"Time out"};return n.call(this,t)}return t(i)}(p);var C=function(r){o(i,r);var n=a(i);function i(){e(this,i);return n.call(this,{message:"Not implemented",name:"ESHNotImplementedError"})}return t(i)}(p);var O=function(r){o(i,r);var n=a(i);function i(){e(this,i);var r={name:"ForcedBySearchTermTestError",message:"Forced error, triggered by search term '".concat(i.forcedBySearchTerm,"'.")};return n.call(this,r)}return t(i)}(p);r(O,"forcedBySearchTerm","EshForceErrorSearchterm");var T=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"UnknownAttributeTypeError",message:r!==null&&r!==void 0?r:"Unknown attribute type"};return n.call(this,t)}return t(i)}(p);var x=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"UnknownComparisonOperatorError",message:r!==null&&r!==void 0?r:"Unknown comparison operator"};return n.call(this,t)}return t(i)}(p);var A=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"UnknownLogicalOperatorError",message:r!==null&&r!==void 0?r:"Unknown logical operator"};return n.call(this,t)}return t(i)}(p);var N=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"UnknownPresentationUsageError",message:r!==null&&r!==void 0?r:"Unknown presentation usage"};return n.call(this,t)}return t(i)}(p);var I=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"UnknownDataTypeError",message:r!==null&&r!==void 0?r:"Unknown data type"};return n.call(this,t)}return t(i)}(p);var D=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"UnknownConditionTypeError",message:r!==null&&r!==void 0?r:"Unknown condition type"};return n.call(this,t)}return t(i)}(p);var U=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"InternalServerError",message:r!==null&&r!==void 0?r:"Internal server error"};return n.call(this,t)}return t(i)}(p);var P=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"ESHNotActiveError",message:r!==null&&r!==void 0?r:"Enterprise Search is not active"};return n.call(this,t)}return t(i)}(p);var k=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"FacetsParseError",message:r!==null&&r!==void 0?r:"Facets parse error"};return n.call(this,t)}return t(i)}(p);var j=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"WhyFoundAttributeMetadataMissingError",message:r!==null&&r!==void 0?r:"Why found attribute metadata missing"};return n.call(this,t)}return t(i)}(p);var F=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"TimeConversionError",message:r!==null&&r!==void 0?r:"Time conversion error"};return n.call(this,t)}return t(i)}(p);var H=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"DateConversionError",message:r!==null&&r!==void 0?r:"Date conversion error"};return n.call(this,t)}return t(i)}(p);var M=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"SubProviderError",message:r!==null&&r!==void 0?r:"subprovider error"};return n.call(this,t)}return t(i)}(p);var B=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"CanOnlyAutoInsertComplexConditionError",message:r!==null&&r!==void 0?r:"Can only insert complex condition"};return n.call(this,t)}return t(i)}(p);var R=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"CanNotCreateAlreadyExistingDataSourceError",message:r!==null&&r!==void 0?r:"Can not create already existing data source"};return n.call(this,t)}return t(i)}(p);var _=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"DataSourceInURLDoesNotExistError",message:r!==null&&r!==void 0?r:"Data source in url does not exist"};return n.call(this,t)}return t(i)}(p);var J=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"DataSourceAttributeMetadataNotFoundError",message:r!==null&&r!==void 0?r:"data source attribute metadata not found"};return n.call(this,t)}return t(i)}(p);var L=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"NoValidEnterpriseSearchAPIConfigurationFoundError",message:"Tried following providers: "+r};return n.call(this,t)}return t(i)}(p);var V=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"QueryIsReadOnlyError",message:r!==null&&r!==void 0?r:"Query is read only"};return n.call(this,t)}return t(i)}(p);var Q=function(r){o(i,r);var n=a(i);function i(r){e(this,i);var t={name:"InBetweenConditionInConsistent",message:r!==null&&r!==void 0?r:"In between condition is inconsistent"};return n.call(this,t)}return t(i)}(p);var W=function(r){o(i,r);var n=a(i);function i(){e(this,i);return n.call(this,{message:"program error in sina",name:"SinaProgramErrror"})}return t(i)}(p);var q={__esModule:true};q.ESHClientError=p;q.InternalESHClientError=m;q.ajaxErrorFactory=h;q.AjaxError=E;q.ABAPODataError=g;q.ABAPInAV2Error=y;q.HANAODataError=S;q.NoJSONDateError=b;q.TimeOutError=w;q.NotImplementedError=C;q.ForcedBySearchTermTestError=O;q.UnknownAttributeTypeError=T;q.UnknownComparisonOperatorError=x;q.UnknownLogicalOperatorError=A;q.UnknownPresentationUsageError=N;q.UnknownDataTypeError=I;q.UnknownConditionTypeError=D;q.InternalServerError=U;q.ESHNotActiveError=P;q.FacetsParseError=k;q.WhyFoundAttributeMetadataMissingError=j;q.TimeConversionError=F;q.DateConversionError=H;q.SubProviderError=M;q.CanOnlyAutoInsertComplexConditionError=B;q.CanNotCreateAlreadyExistingDataSourceError=R;q.DataSourceInURLDoesNotExistError=_;q.DataSourceAttributeMetadataNotFoundError=J;q.NoValidEnterpriseSearchAPIConfigurationFoundError=L;q.QueryIsReadOnlyError=V;q.InBetweenConditionInConsistent=Q;q.SinaProgramError=W;return q})})();