/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../core/core","./Query","./EqualsMode","./ConditionType","./DataSourceType","../core/errors","./ComparisonOperator"],function(e,t,r,n,a,i,u){function o(e,t){var r=typeof Symbol!=="undefined"&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=s(e))||t&&e&&typeof e.length==="number"){if(r)e=r;var n=0;var a=function(){};return{s:a,n:function(){if(n>=e.length)return{done:true};return{done:false,value:e[n++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i=true,u=false,o;return{s:function(){r=r.call(e)},n:function(){var e=r.next();i=e.done;return e},e:function(e){u=true;o=e},f:function(){try{if(!i&&r.return!=null)r.return()}finally{if(u)throw o}}}}function l(e,t){return y(e)||v(e,t)||s(e,t)||c()}function c(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function s(e,t){if(!e)return;if(typeof e==="string")return f(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor)r=e.constructor.name;if(r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return f(e,t)}function f(e,t){if(t==null||t>e.length)t=e.length;for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function v(e,t){var r=e==null?null:typeof Symbol!=="undefined"&&e[Symbol.iterator]||e["@@iterator"];if(r==null)return;var n=[];var a=true;var i=false;var u,o;try{for(r=r.call(e);!(a=(u=r.next()).done);a=true){n.push(u.value);if(t&&n.length===t)break}}catch(e){i=true;o=e}finally{try{if(!a&&r["return"]!=null)r["return"]()}finally{if(i)throw o}}return n}function y(e){if(Array.isArray(e))return e}function d(e,t){if(!(e instanceof t)){throw new TypeError("Cannot call a class as a function")}}function h(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||false;n.configurable=true;if("value"in n)n.writable=true;Object.defineProperty(e,n.key,n)}}function p(e,t,r){if(t)h(e.prototype,t);if(r)h(e,r);Object.defineProperty(e,"prototype",{writable:false});return e}function m(){if(typeof Reflect!=="undefined"&&Reflect.get){m=Reflect.get}else{m=function e(t,r,n){var a=b(t,r);if(!a)return;var i=Object.getOwnPropertyDescriptor(a,r);if(i.get){return i.get.call(arguments.length<3?t:n)}return i.value}}return m.apply(this,arguments)}function b(e,t){while(!Object.prototype.hasOwnProperty.call(e,t)){e=A(e);if(e===null)break}return e}function S(e,t){if(typeof t!=="function"&&t!==null){throw new TypeError("Super expression must either be null or a function")}e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:true,configurable:true}});Object.defineProperty(e,"prototype",{writable:false});if(t)g(e,t)}function g(e,t){g=Object.setPrototypeOf||function e(t,r){t.__proto__=r;return t};return g(e,t)}function F(e){var t=C();return function r(){var n=A(e),a;if(t){var i=A(this).constructor;a=Reflect.construct(n,arguments,i)}else{a=n.apply(this,arguments)}return _(this,a)}}function _(e,t){if(t&&(typeof t==="object"||typeof t==="function")){return t}else if(t!==void 0){throw new TypeError("Derived constructors may only return object or undefined")}return k(e)}function k(e){if(e===void 0){throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}return e}function C(){if(typeof Reflect==="undefined"||!Reflect.construct)return false;if(Reflect.construct.sham)return false;if(typeof Proxy==="function")return true;try{Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}));return true}catch(e){return false}}function A(e){A=Object.setPrototypeOf?Object.getPrototypeOf:function e(t){return t.__proto__||Object.getPrototypeOf(t)};return A(e)}function T(e,t,r){if(t in e){Object.defineProperty(e,t,{value:r,enumerable:true,configurable:true,writable:true})}else{e[t]=r}return e}var Q=t["Query"];var R=r["EqualsMode"];var O=n["ConditionType"];var w=a["DataSourceSubType"];var q=a["DataSourceType"];var I=i["QueryIsReadOnlyError"];var M=u["ComparisonOperator"];function j(e,t,r){if(r){return t?t(e):e}if(!e||!e.then){e=Promise.resolve(e)}return t?e.then(t):e}function x(e,t,r){if(r){return t?t(e()):e()}try{var n=Promise.resolve(e());return t?n.then(t):n}catch(e){return Promise.reject(e)}}function P(e,t){var r=e();if(r&&r.then){return r.then(t)}return t(r)}var B=function(t){S(n,t);var r=F(n);function n(e){var t,a,i,u,o;var l;d(this,n);l=r.call(this,e);T(k(l),"calculateFacets",false);T(k(l),"multiSelectFacets",false);T(k(l),"nlq",false);T(k(l),"facetTop",5);l.calculateFacets=(t=e.calculateFacets)!==null&&t!==void 0?t:l.calculateFacets;l.multiSelectFacets=(a=e.multiSelectFacets)!==null&&a!==void 0?a:l.multiSelectFacets;l.nlq=(i=e.nlq)!==null&&i!==void 0?i:l.nlq;l.facetTop=(u=e.facetTop)!==null&&u!==void 0?u:l.facetTop;l.groupBy=(o=e.groupBy)!==null&&o!==void 0?o:l.groupBy;return l}p(n,[{key:"setCalculateFacets",value:function e(){var t=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;this.calculateFacets=t}},{key:"setMultiSelectFacets",value:function e(){var t=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;this.multiSelectFacets=t}},{key:"setNlq",value:function e(){var t=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;this.nlq=t}},{key:"setFacetTop",value:function e(){var t=arguments.length>0&&arguments[0]!==undefined?arguments[0]:5;this.facetTop=t}},{key:"_createReadOnlyClone",value:function e(){var t=this.clone();t.getResultSetAsync=function(){throw new I("this query is readonly")};return t}},{key:"clone",value:function e(){var e=new n({skip:this.skip,top:this.top,filter:this.filter.clone(),sortOrder:this.sortOrder,sina:this.sina,groupBy:this.groupBy,calculateFacets:this.calculateFacets,multiSelectFacets:this.multiSelectFacets,nlq:this.nlq,facetTop:this.facetTop});return e}},{key:"equals",value:function e(t){var r=arguments.length>1&&arguments[1]!==undefined?arguments[1]:R.CheckFireQuery;if(!(t instanceof n)){return false}if(!t){return false}if(!m(A(n.prototype),"equals",this).call(this,t)){return false}if(this.groupBy!==t.groupBy){return false}if(this.nlq!==t.nlq){return false}if(this.multiSelectFacets!==t.multiSelectFacets){return false}if(this.facetTop!==t.facetTop){return false}switch(r){case R.CheckFireQuery:if(t.calculateFacets&&!this.calculateFacets){return true}return this.calculateFacets===t.calculateFacets;default:return this.calculateFacets===t.calculateFacets}}},{key:"_execute",value:function e(t){var r=this;return x(function(){var e;var n=[];if(r.multiSelectFacets){e=r._collectAttributesWithFilter(t);n=r._createChartQueries(t,e)}var a=[];var i=[];a.push(r._executeSearchQuery(t));for(var u=0;u<n.length;++u){var o=n[u];var l=t.filter.dataSource.getAttributeMetadata(o.dimension);if(!l){i.push(o)}else{if(l.usage.Facet){a.push(o.getResultSetAsync())}}}return j(Promise.all(a),function(e){var n=[];for(var a=0;a<i.length;++a){var u=i[a];var o=t.filter.dataSource.getAttributeMetadata(u.dimension);if(o.usage.Facet){n.push(u.getResultSetAsync())}}return j(Promise.all(n),function(t){e=e.concat(t);var n=e[0];var a=e.slice(1);r._mergeFacetsToSearchResultSet(n,a);return n})})})}},{key:"_executeSearchQuery",value:function e(t){var r=this;return x(function(){if(t.filter.isFolderMode()){return j(r._executeSearchQueryInFolderMode(t))}else{return j(r._executeSearchQueryInSearchMode(t))}return j()})}},{key:"_executeSearchQueryInSearchMode",value:function e(t){var r=this;return x(function(){return j(r._doExecuteSearchQuery(t))})}},{key:"_executeSearchQueryInFolderMode",value:function e(t){var r=this;return x(function(){var e=false;return j(P(function(){if(!r._isAdditionalFolderQueryNeeded(t)){return j(r._doExecuteSearchQuery(t),function(t){e=true;return t})}},function(n){if(e)return n;var a=r._assembleAdditionalFolderQuery(t);return j(r._doExecuteSearchQuery(t),function(e){return j(r._doExecuteSearchQuery(a),function(t){return j(Promise.all([e,t]),function(e){var t=l(e,2),n=t[0],a=t[1];var i=r._mergeResultSetsInNavigationFolderMode(n,a);return i})})})}))})}},{key:"_mergeResultSetsInNavigationFolderMode",value:function e(t,r){t.items=[];var n=o(r.items),a;try{for(n.s();!(a=n.n()).done;){var i=a.value;i.parent=t;t.items.push(i)}}catch(e){n.e(e)}finally{n.f()}t.totalCount=r.totalCount;return t}},{key:"_assembleAdditionalFolderQuery",value:function e(t){var r=t.clone();r.calculateFacets=false;var n=r.filter.getFolderAttribute();var a=r.filter.rootCondition.getConditionsByAttribute(n);var i=a.filter(function(e){return e.operator===M.DescendantOf});var u=o(i),l;try{for(u.s();!(l=u.n()).done;){var c=l.value;c.operator=M.ChildOf}}catch(e){u.e(e)}finally{u.f()}return r}},{key:"_isAdditionalFolderQueryNeeded",value:function e(t){var r=t.filter.getFolderAttribute();var n=t.filter.rootCondition.getConditionsByAttribute(r);var a=n.filter(function(e){return e.operator===M.DescendantOf});return a.length>0}},{key:"_doExecuteSearchQuery",value:function e(t){var r=this;return x(function(){var e=r._filteredQueryTransform(t);return j(r.sina.provider.executeSearchQuery(e),function(e){return r._filteredQueryBackTransform(t,e)})})}},{key:"_filteredQueryTransform",value:function e(t){return this._genericFilteredQueryTransform(t)}},{key:"_filteredQueryBackTransform",value:function e(t,r){if(t.filter.dataSource.type!==q.BusinessObject||t.filter.dataSource.subType!==w.Filtered){return r}r.query=t;var n=o(r.facets),a;try{for(n.s();!(a=n.n()).done;){var i=a.value;i.query.filter=t.filter.clone()}}catch(e){n.e(e)}finally{n.f()}return r}},{key:"_formatResultSetAsync",value:function t(r){var n=this;return x(function(){return j(e.executeSequentialAsync(n.sina.searchResultSetFormatters,function(e){return e.formatAsync(r)}))})}},{key:"_collectAttributesWithFilter",value:function e(t){var r={};this._doCollectAttributes(r,t.filter.rootCondition);var n=Object.keys(r);return n.filter(function(e){var r=t.filter.dataSource.getAttributeMetadata(e);if(!r){return true}return!r.isHierarchy})}},{key:"_doCollectAttributes",value:function e(t,r){switch(r.type){case O.Simple:t[r.attribute]=true;break;case O.Complex:for(var n=0;n<r.conditions.length;++n){var a=r.conditions[n];this._doCollectAttributes(t,a)}break}}},{key:"_createChartQuery",value:function e(t,r){var n=this.sina.createChartQuery({dimension:r,top:this.facetTop});n.setFilter(t.filter.clone());n.filter.rootCondition.removeAttributeConditions(r);return n}},{key:"_createChartQueries",value:function e(t,r){var n=[];for(var a=0;a<r.length;++a){var i=r[a];var u=this._createChartQuery(t,i);n.push(u)}return n}},{key:"_mergeFacetsToSearchResultSet",value:function e(t,r){this._addSelectedFiltersToSearchResultSet(t);for(var n=0;n<r.length;++n){var a=r[n];this._addChartResultSetToSearchResultSet(t,a)}}},{key:"_calculateFacetTitle",value:function e(t,r){var n=t.getFirstAttribute();var a=r.getAttributeMetadata(n);return a.label}},{key:"_addSelectedFiltersToSearchResultSet",value:function e(t){var r=t.query.filter.dataSource;var n=t.query.filter.rootCondition;for(var a=0;a<n.conditions.length;a++){var i=n.conditions[a].conditions;var u=this._calculateFacetTitle(i[0],t.query.filter.dataSource);var o=void 0;switch(i[0].type){case O.Simple:o=i[0].attribute;break;case O.Complex:o=i[0].conditions[0].attribute;break}var l=r.getAttributeMetadata(o);if(l.isHierarchy){continue}var c=this._findMatchFacet(o,t.facets);var s=t.facets[c];if(!s){var f=this._createChartQuery(t.query,o);s=this.sina._createChartResultSet({title:u,items:[],query:f});t.facets.splice(c,1,s)}var v=null;if(i.length===1){v=t.totalCount}var y=[];for(var d=0;d<i.length;d++){var h=void 0;if(this._findFilterConditionInFacetItemList(i[d],s.items)>=0){h=this._findFilterConditionInFacetItemList(i[d],s.items);y.push(s.items[h])}else{y.push(this.sina._createChartResultSetItem({filterCondition:i[d],dimensionValueFormatted:i[d].valueLabel||i[d].value,measureValue:v,measureValueFormatted:i[d].valueLabel||i[d].value}))}}s.items=y}}},{key:"_addChartResultSetToSearchResultSet",value:function e(t,r){if(r.items.length===0){return}var n=r.query.dimension;var a=this._findMatchFacet(n,t.facets);var i=t.facets[a];var u=i.items;var o=false;var l=[];for(var c=0;c<u.length;c++){var s=this._findFilterConditionInFacetItemList(u[c].filterCondition,r.items);if(s>=0){if(this._isRangeFacet(r.query)){l.push(r.items[s])}}else{if(this._isRangeFacet(r.query)){o=true}l.push(u[c])}}l.sort(function(e,t){return t.measureValue-e.measureValue});if(this._isRangeFacet(r.query)){if(o){r.items=l}}else{r.items=r.items.concat(l)}t.facets.splice(a,1,r)}},{key:"_findMatchFacet",value:function e(t,r){var n=0;for(;n<r.length;n++){var a=r[n];if(a.query.dimension===t){break}}return n}},{key:"_findFilterConditionInFacetItemList",value:function e(t,r){var n=-1;for(var a=0;a<r.length;a++){var i=r[a];if(t.equals(i.filterCondition)){n=a;break}}return n}},{key:"_isRangeFacet",value:function e(t){var r=t.filter.dataSource.getAttributeMetadata(t.dimension);if(r.type===t.sina.AttributeType.Double){return true}return false}}]);return n}(Q);var E={__esModule:true};E.SearchQuery=B;return E})})();