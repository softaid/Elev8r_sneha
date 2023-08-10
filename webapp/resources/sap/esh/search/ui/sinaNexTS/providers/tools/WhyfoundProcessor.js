/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../../sina/SearchResultSetItemAttributeGroup"],function(e){function t(e,t){if(!(e instanceof t)){throw new TypeError("Cannot call a class as a function")}}function r(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||false;i.configurable=true;if("value"in i)i.writable=true;Object.defineProperty(e,i.key,i)}}function i(e,t,i){if(t)r(e.prototype,t);if(i)r(e,i);Object.defineProperty(e,"prototype",{writable:false});return e}
/*!
   * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
   */var a=e["SearchResultSetItemAttributeGroup"];function n(e,t,r){if(r){return t?t(e):e}if(!e||!e.then){e=Promise.resolve(e)}return t?e.then(t):e}function u(e,t,r){if(r){return t?t(e()):e()}try{var i=Promise.resolve(e());return t?i.then(t):i}catch(e){return Promise.reject(e)}}var s=function(){function e(r){t(this,e);this.sina=r}i(e,[{key:"processRegularWhyFoundAttributes",value:function e(t,r,i,a){var n;for(var u in i){if(u===t&&i[u][0]){n=i[u][0];if(a.usage.Title||a.usage.TitleDescription||a.usage.Detail){delete i[u]}}}n=this.calculateValueHighlighted(r,a,n);return n}},{key:"processAdditionalWhyfoundAttributes",value:function e(t,r){var i=this;return u(function(){for(var e in t){if(t[e][0]){(function(){var n=r.dataSource.getAttributeMetadata(e);var u=n.id||e;var s=t[e][0];var f="";if(r.attributesMap[e]){f=r.attributesMap[e].valueFormatted;f=typeof f==="string"?f:JSON.stringify(f)}var l=typeof s==="string"?s:JSON.stringify(s);var o=i.sina._createSearchResultSetItemAttribute({id:u,label:n.label||e,value:"",valueFormatted:f,valueHighlighted:l,isHighlighted:true,metadata:n});var c=r.attributes.find(function(e){return e.id===u});if(r.detailAttributes.find(function(e){return e instanceof a&&e.isAttributeDisplayed(u)})===undefined){r.detailAttributes.push(o);if(c===undefined){r.attributes.push(o)}}else if(c===undefined){r.attributes.push(o);r.detailAttributes.push(o)}else{o.value=c.value;c=o}delete t[e]})()}}return n(r)})}},{key:"_getFirstItemIfArray",value:function e(t){if(Array.isArray(t)){t=t[0]}return t}},{key:"calculateValueHighlighted",value:function e(t,r,i){var a="com.sap.vocabularies.Search.v1.Highlighted";var n="com.sap.vocabularies.Search.v1.Snippets";var u="";if(r.format==="MultilineText"){u=t[a];if(u){return this._getFirstItemIfArray(u)}u=t[n];if(u){return this._getFirstItemIfArray(u)}return i}u=t[n];if(u){return this._getFirstItemIfArray(u)}u=t[a];if(u){return this._getFirstItemIfArray(u)}return this._getFirstItemIfArray(i)}},{key:"calIsHighlighted",value:function e(t){if(typeof t==="string"&&t.length>0&&t.indexOf("<b>")>-1&&t.indexOf("</b>")>-1){return true}if(Array.isArray(t)&&t.length>0){return true}return false}}]);return e}();var f={__esModule:true};f.WhyfoundProcessor=s;return f})})();