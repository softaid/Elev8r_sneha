/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["sap/base/Log","./i18n","./SearchHelper","./sinaNexTS/sina/ComplexCondition","./sinaNexTS/sina/HierarchyDisplayType","./suggestions/SuggestionType"],function(e,t,r,i,n,a){function o(e){return e&&e.__esModule&&typeof e.default!=="undefined"?e.default:e}function l(e,t){var r=typeof Symbol!=="undefined"&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=s(e))||t&&e&&typeof e.length==="number"){if(r)e=r;var i=0;var n=function(){};return{s:n,n:function(){if(i>=e.length)return{done:true};return{done:false,value:e[i++]}},e:function(e){throw e},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a=true,o=false,l;return{s:function(){r=r.call(e)},n:function(){var e=r.next();a=e.done;return e},e:function(e){o=true;l=e},f:function(){try{if(!a&&r.return!=null)r.return()}finally{if(o)throw l}}}}function s(e,t){if(!e)return;if(typeof e==="string")return u(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor)r=e.constructor.name;if(r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return u(e,t)}function u(e,t){if(t==null||t>e.length)t=e.length;for(var r=0,i=new Array(t);r<t;r++)i[r]=e[r];return i}function c(e,t){if(!(e instanceof t)){throw new TypeError("Cannot call a class as a function")}}function f(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||false;i.configurable=true;if("value"in i)i.writable=true;Object.defineProperty(e,i.key,i)}}function d(e,t,r){if(t)f(e.prototype,t);if(r)f(e,r);Object.defineProperty(e,"prototype",{writable:false});return e}function g(e,t,r){if(t in e){Object.defineProperty(e,t,{value:r,enumerable:true,configurable:true,writable:true})}else{e[t]=r}return e}var h=o(t);var v=r["getHashFromUrl"];var p=r["parseUrlParameters"];var y=i["ComplexCondition"];var m=n["HierarchyDisplayType"];var b=a["Type"];var S=a["SuggestionType"];function I(e,t,r){if(r){return t?t(e):e}if(!e||!e.then){e=Promise.resolve(e)}return t?e.then(t):e}function T(e,t,r){if(r){return t?t(e()):e()}try{var i=Promise.resolve(e());return t?i.then(t):i}catch(e){return Promise.reject(e)}}var x=function(){function t(r){c(this,t);g(this,"maxItems",10);g(this,"key","ESH-Recent-Searches");this.personalizationStorage=r.personalizationStorage;this._oLogger=e.getLogger("sap.esh.search.ui.RecentlyUsedStorage");this.maxItems=r.maxItems||10;this.searchModel=r.searchModel}d(t,[{key:"deleteAllItems",value:function e(){var t=this;return T(function(){t.personalizationStorage.deleteItem(t.key);return I(t.personalizationStorage.save())})}},{key:"assembleLabel",value:function e(t,r){if(this.searchModel.getProperty("/dataSources").length>1){return h.getText("resultsIn",["<span>"+t+"</span>",r.labelPlural])}return t}},{key:"hasFilter",value:function e(t){var r=p(t.url);if(typeof r.filter==="string"){try{var i;var n=JSON.parse(r.filter);var a=new y({operator:n.rootCondition.operator,conditions:n.rootCondition.conditions});if(this.filterWithoutFilterByCondition(a)){return false}if((i=this.searchModel.config)!==null&&i!==void 0&&i.dimensionNameSpace_Description){var o;var l=a.getAttributeConditions((o=this.searchModel.config)===null||o===void 0?void 0:o.dimensionNameSpace_Description);if(l.length===1&&a.conditions.length===1){return false}}return n.rootCondition.conditions.length>0}catch(e){this._oLogger.error(e);return false}}return false}},{key:"filterWithoutFilterByCondition",value:function e(t){var r=[];var i=l(this.searchModel.getProperty("/uiFilter").rootCondition.getAttributes()),n;try{for(i.s();!(n=i.n()).done;){var a=n.value;var o=this.searchModel.getProperty("/uiFilter").dataSource.attributeMetadataMap[a];if(o&&o.isHierarchy===true&&o.hierarchyDisplayType===m.StaticHierarchyFacet){r.push(t.getAttributeConditions(a))}}}catch(e){i.e(e)}finally{i.f()}return r.length===t.conditions.length}},{key:"getItems",value:function e(){var t;return(t=this.personalizationStorage.getItem("ESH-Recent-Searches"))!==null&&t!==void 0?t:[]}},{key:"addItem",value:function e(){var t,r,i,n,a,o,l,s,u,c,f,d,g=this;var h=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{label:""};if(!this.personalizationStorage.isStorageOfPersonalDataAllowed())return;var p=(t=h.searchTerm)!==null&&t!==void 0?t:this.searchModel.getSearchBoxTerm();if(!p||p==="*"||p==="")return;var y={label:h.label||this.assembleLabel(p,(r=h.dataSource)!==null&&r!==void 0?r:this.searchModel.getDataSource()),dataSourceId:(i=(n=h.dataSource)===null||n===void 0?void 0:n.id)!==null&&i!==void 0?i:this.searchModel.getDataSource().id,dataSourceLabel:(a=(o=h.dataSource)===null||o===void 0?void 0:o.labelPlural)!==null&&a!==void 0?a:this.searchModel.getDataSource().labelPlural,url:(l=(s=h.url)!==null&&s!==void 0?s:(u=h.titleNavigation)===null||u===void 0?void 0:u._href)!==null&&l!==void 0?l:v(),icon:(c=h.icon)!==null&&c!==void 0?c:"sap-icon://search",uiSuggestionType:b.Recent,originalUiSuggestionType:h.uiSuggestionType,position:S.properties.Recent.position,storedAt:Date.now(),searchTerm:p,imageUrl:h.imageUrl,imageExists:h.imageExists,imageIsCircular:h.imageIsCircular,exists:h.exists,label1:h.label1,label2:h.label2,titleNavigation:{_href:(f=h.titleNavigation)===null||f===void 0?void 0:f._href,_target:(d=h.titleNavigation)===null||d===void 0?void 0:d._target}};if(this.hasFilter(y)){y.filterIcon="sap-icon://filter"}var m=this.getItems();var I=m.some(function(e,t,r){if(e.label===y.label&&e.icon===y.icon){g._oLogger.debug("Removing already existing item "+y.label+" at pos "+t);r.splice(t,1);return true}});if(!I){if(m.length>=this.maxItems){var T=m.pop();this._oLogger.debug("Removing oldest item "+T.label)}}this._oLogger.debug("Adding item "+y.label);m.unshift(y);this.personalizationStorage.setItem("ESH-Recent-Searches",m)}}]);return t}();return x})})();