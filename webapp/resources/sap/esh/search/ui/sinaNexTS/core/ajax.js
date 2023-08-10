/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["./errors","./util"],function(e,r){function t(e){"@babel/helpers - typeof";return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},t(e)}function n(e,r){if(!(e instanceof r)){throw new TypeError("Cannot call a class as a function")}}function o(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||false;n.configurable=true;if("value"in n)n.writable=true;Object.defineProperty(e,n.key,n)}}function i(e,r,t){if(r)o(e.prototype,r);if(t)o(e,t);Object.defineProperty(e,"prototype",{writable:false});return e}
/*!
   * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
   */var s=e["ajaxErrorFactory"];var a=e["InternalESHClientError"];var u=r["hasOwnProperty"];function f(e,r,t){if(t){return r?r(e):e}if(!e||!e.then){e=Promise.resolve(e)}return r?e.then(r):e}var c=p(function(e){if(typeof window!=="undefined"){return new Promise(function(r,t){var n=new XMLHttpRequest;n.onreadystatechange=function(){if(n.readyState==4&&(n.status==200||n.status==201||n.status==204)){r({data:n.responseText||"{}",headers:y(n.getAllResponseHeaders())});return}if(n.readyState==4){t(s(n,y(n.getAllResponseHeaders())))}};var o=g(e.url,e.parameters);n.open(e.method,o,true);for(var i in e.headers){var a=e.headers[i];n.setRequestHeader(i,a)}n.send(e.data)})}else{var r=require("node-fetch");var t=e.url.startsWith("https")?require("https"):require("http");var n=new t.Agent({rejectUnauthorized:false});var o={agent:n,headers:e.headers,method:e.method};if(typeof e.data!=="undefined"){o.body=e.data}var i=g(e.url,e.parameters);var a=function e(r){var t={};for(var n in r){var o=r[n];if(o instanceof Array&&o.length===1){t[n]=o[0]}else{t[n]=o}}return t};return l(function(){return f(r(i,o),function(e){if(e.ok){return f(e.text(),function(r){return{data:r||"{}",headers:a(e.headers.raw())}})}else{var r=e.statusText,t=e.status;return f(e.text(),function(e){throw s({status:t,statusText:r,responseText:e})})}})},function(e){throw s(e)})}});function d(e,r){var t=e();if(t&&t.then){return t.then(r)}return r(t)}function h(e,r,t){if(t){return r?r(e()):e()}try{var n=Promise.resolve(e());return r?n.then(r):n}catch(e){return Promise.reject(e)}}function l(e,r){try{var t=e()}catch(e){return r(e)}if(t&&t.then){return t.then(void 0,r)}return t}function p(e){return function(){for(var r=[],t=0;t<arguments.length;t++){r[t]=arguments[t]}try{return Promise.resolve(e.apply(this,r))}catch(e){return Promise.reject(e)}}}var v;(function(e){e["NONE"]="none";e["RECORD"]="record";e["REPLAY"]="replay"})(v||(v={}));function y(e){var r={};var t=e.split("\n");for(var n=0;n<t.length;++n){var o=t[n];var i=o.indexOf(":");if(i>=0){var s=o.slice(0,i).toLowerCase();var a=o.slice(i+1);r[s]=a.trim()}}return r}function m(e){var r=[];for(var t in e){var n=e[t];r.push(encodeURIComponent(t)+"="+encodeURIComponent(n+""))}return r.join("&")}function g(e,r){if(!r){return e}var t=m(r);if(t.length>0){e+="?"+t}return e}function O(e){for(var r in e){if(typeof e[r]!=="boolean"&&typeof e[r]!=="string"&&typeof e[r]!=="number"){return false}}return true}var w=function(){function e(r){var t;n(this,e);this._client=new q(r);this.recordOptions={headers:r.recordingHeaders,mode:(t=r.recordingMode)!==null&&t!==void 0?t:v.NONE,path:r.recordingPath,requestNormalization:r.requestNormalization||this._defaultRequestNormalization};if(typeof window!=="undefined"&&this.recordOptions.mode!==v.NONE){throw new a("Record/Replay is only supported on Node.js")}this.records={};if(this.recordOptions.mode===v.REPLAY){this.records=require(r.recordingPath)}this.authorization=undefined;if(r.authorization){this.authorization={user:r.authorization.user,password:r.authorization.password}}}i(e,[{key:"_encodeObj",value:function e(r){var t=[];for(var n in r){if(Object.prototype.hasOwnProperty.call(r,n)){t.push(encodeURIComponent(n)+"="+encodeURIComponent(r[n]))}}return t.join("&")}},{key:"getJson",value:function e(r,t){var n=this;if(t&&O(t)){var o="?"+n._encodeObj(t);r=r+o}if(n.recordOptions.mode==="none"){return n._client.getJson(r)}if(n.recordOptions.mode==="replay"){return n._replay(r,null)}return n._client.getJson(r).then(function(e){return n._record(r,null,e)})}},{key:"getXML",value:function e(r){var t=this;return h(function(){var e=false;var n=t;return n.recordOptions.mode==="none"?f(n._client.getXML(r)):f(d(function(){if(n.recordOptions.mode==="replay"){return f(n._replay(r,null),function(r){var t=r.data;e=true;return t})}},function(t){return e?t:n._client.getXML(r).then(function(e){return n._record(r,null,e)})}))})}},{key:"postJson",value:function e(r,t){t=JSON.parse(JSON.stringify(t));var n=this;if(n.recordOptions.mode==="none"){return n._client.postJson(r,t)}if(n.recordOptions.mode==="replay"){return n._replay(r,t)}return n._client.postJson(r,t).then(function(e){return n._record(r,t,e)})}},{key:"mergeJson",value:function e(r,t){t=JSON.parse(JSON.stringify(t));var n=this;if(n.recordOptions.mode==="none"){return n._client.mergeJson(r,t)}if(n.recordOptions.mode==="replay"){return n._replay(r,t)}return n._client.mergeJson(r,t).then(function(e){return n._record(r,t,e)})}},{key:"request",value:function e(r){return this._client.request(r)}},{key:"_record",value:function e(r,t,n){var o=this;var i=r;var s=o.recordOptions.requestNormalization(t);if(s){i+=JSON.stringify(s)}if(o.records[i]===undefined&&i.indexOf("NotToRecord")===-1){try{o.records[i]=JSON.parse(JSON.stringify(n.data))}catch(e){if(e.name==="SyntaxError"){o.records[i]=n+""}else{throw e}}}return o._client.putJson(o.recordOptions.path,o.records).then(function(){return n})}},{key:"_replay",value:function e(r,n){var o=this;return h(function(){var e=o;var i=r;var u=e.recordOptions.requestNormalization(n);if(u){i+=JSON.stringify(u)}var c=o.records[i];switch(t(c)){case"object":{var d=JSON.parse(JSON.stringify(c));var h={data:d};if(h.data.error||h.data.Error){return Promise.reject(s({responseText:JSON.stringify(d)}))}return f(h)}case"string":return f({data:c});case"undefined":{throw new a("No recording found for request '"+i+"' in file "+o.recordOptions.path)}default:throw new a("Don't know how to serialize recording data of type "+t(c))}return f()})}},{key:"_defaultRequestNormalization",value:function e(r){if(r===null){return""}if(t(r)==="object"&&u(r,"SessionID")){delete r.SessionID}if(t(r)==="object"&&u(r,"SessionTimestamp")){delete r.SessionTimestamp}return r}}]);return e}();var q=function(){function e(r){var t;n(this,e);this.csrf=r.csrf;this.csrfByPassCache=r.csrfByPassCache||false;this.csrfToken=null;this.csrfFetchRequest=r.csrfFetchRequest||null;this.getLanguage=r===null||r===void 0?void 0:r.getLanguage;this.recordOptions={headers:r.recordingHeaders,mode:(t=r.recordingMode)!==null&&t!==void 0?t:v.NONE,path:r.recordingPath,requestNormalization:r.requestNormalization};this.authorization=undefined;if(r.authorization){this.authorization={user:r.authorization.user,password:r.authorization.password}}if(typeof window!=="undefined"&&this.recordOptions.mode!==v.NONE){throw new Error("Record/Replay is only supported on Node.js")}}i(e,[{key:"getJsonHeaders",value:function e(){var r={"Content-Type":"application/json",Accept:"application/json"};this.addLanguageToHeader(r);return r}},{key:"getXmlHeaders",value:function e(){var r={"Content-Type":"application/xml",Accept:"application/xml"};this.addLanguageToHeader(r);return r}},{key:"addLanguageToHeader",value:function e(r){if(typeof this.getLanguage==="function"){try{r["Accept-Language"]=this.getLanguage()}catch(e){throw s(e)}}}},{key:"getJson",value:function e(r){var t=this;return h(function(){return f(t.request({headers:t.getJsonHeaders(),method:"GET",url:r}),function(e){if(typeof e.data==="string"){e.data=JSON.parse(e.data)}return e})})}},{key:"getXML",value:function e(r){var t=this;return h(function(){return f(t.request({headers:t.getXmlHeaders(),method:"GET",url:r}),function(e){return e.data})})}},{key:"postJson",value:function e(r,t){var n=this;return h(function(){return f(n.request({headers:n.getJsonHeaders(),method:"POST",url:r,data:JSON.stringify(t)}),function(e){if(typeof e.data==="string"){e.data=JSON.parse(e.data)}return e})})}},{key:"mergeJson",value:function e(r,t){var n=this;return h(function(){return f(n.request({headers:n.getJsonHeaders(),method:"MERGE",url:r,data:JSON.stringify(t)}),function(e){if(typeof e.data==="string"){e.data=JSON.parse(e.data)}return e})})}},{key:"putJson",value:function e(r,t){return h(function(){var e=require("fs");return f(new Promise(function(n,o){e.writeFile(r,JSON.stringify(t,null,4),"utf8",function(e){if(e){o(e)}else{n()}})}))})}},{key:"_fetchCsrf",value:function e(){if(this.csrfFetchRequestPromise){return this.csrfFetchRequestPromise}this.csrfFetchRequest.headers=this.csrfFetchRequest.headers||{};this.csrfFetchRequest.headers["x-csrf-token"]="fetch";this.csrfFetchRequest.parameters=this.csrfFetchRequest.parameters||{};if(this.csrfByPassCache){this.csrfFetchRequest.parameters._=Date.now()}this.csrfFetchRequestPromise=c(this.csrfFetchRequest).then(function(e){this.csrfFetchRequestPromise=null;if(e.headers["set-cookie"]){this.cookies=e.headers["set-cookie"].join("; ")}this.csrfToken=e.headers["x-csrf-token"];return e}.bind(this));return this.csrfFetchRequestPromise}},{key:"_requestWithCsrf",value:function e(r,t){var n=this;return h(function(){var e=false;return g(n.csrfFetchRequest.url,n.csrfFetchRequest.parameters)===g(r.url,r.parameters)?f(n._fetchCsrf()):f(d(function(){if(t&&!n.csrfToken){return f(n._fetchCsrf(),function(){var t=n._requestWithCsrf(r,false);e=true;return t})}},function(o){if(e)return o;r.headers=r.headers||{};if(n.cookies){r.headers.Cookie=n.cookies}r.headers["x-csrf-token"]=n.csrfToken;return c(r)["catch"](function(e){if(t&&e&&e.responseHeaders&&e.responseHeaders["x-csrf-token"]&&e.responseHeaders["x-csrf-token"].toLowerCase()==="required"){return this._fetchCsrf().then(function(){return this._requestWithCsrf(r,false)}.bind(this))}return Promise.reject(e)}.bind(n))}))})}},{key:"request",value:function e(r){var t=this;return h(function(){var e=false;r.headers=Object.assign({},r.headers,t.recordOptions.headers);if(t.authorization!==undefined){if(typeof Buffer==="function"){r.headers.Authorization="Basic "+Buffer.from(t.authorization.user+":"+t.authorization.password).toString("base64")}else if(window&&typeof window.btoa==="function"){r.headers.Authorization="Basic "+window.btoa(t.authorization.user+":"+t.authorization.password)}}return f(d(function(){if(!t.csrf){if(t.cookies){r.headers.Cookie=t.cookies}return f(c(r),function(r){e=true;return r})}},function(n){if(e)return n;if(!t.csrfFetchRequest){t.csrfFetchRequest=r}return f(t._requestWithCsrf(r,true))}))})}}]);return e}();var k={__esModule:true};k.RecordingMode=v;k.parseHeaders=y;k.encodeUrlParameters=m;k.addEncodedUrlParameters=g;k.Client=w;return k})})();