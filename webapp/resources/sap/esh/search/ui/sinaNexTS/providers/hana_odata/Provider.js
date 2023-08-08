/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../../core/core","../../core/ajax","./MetadataParserXML","./MetadataParserJson","./ItemParser","./FacetParser","./suggestionParser","./eshObjects/src/index","./conditionSerializerEshObj","../../core/Log","../../sina/SearchQuery","../../sina/SortOrder","../AbstractProvider","../../sina/SuggestionType","../../sina/ComplexCondition","../../core/errors","./HierarchyParser","./HierarchyNodePathParser","../../sina/SuggestionCalculationMode"],function(e,r,t,a,i,n,u,s,o,c,f,l,v,y,p,h,d,g,S){function b(e){return j(e)||x(e)||P(e)||m()}function m(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function P(e,r){if(!e)return;if(typeof e==="string")return A(e,r);var t=Object.prototype.toString.call(e).slice(8,-1);if(t==="Object"&&e.constructor)t=e.constructor.name;if(t==="Map"||t==="Set")return Array.from(e);if(t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return A(e,r)}function x(e){if(typeof Symbol!=="undefined"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function j(e){if(Array.isArray(e))return A(e)}function A(e,r){if(r==null||r>e.length)r=e.length;for(var t=0,a=new Array(r);t<r;t++)a[t]=e[t];return a}function C(e,r){if(!(e instanceof r)){throw new TypeError("Cannot call a class as a function")}}function O(e,r){for(var t=0;t<r.length;t++){var a=r[t];a.enumerable=a.enumerable||false;a.configurable=true;if("value"in a)a.writable=true;Object.defineProperty(e,a.key,a)}}function w(e,r,t){if(r)O(e.prototype,r);if(t)O(e,t);Object.defineProperty(e,"prototype",{writable:false});return e}function q(e,r){if(typeof r!=="function"&&r!==null){throw new TypeError("Super expression must either be null or a function")}e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,writable:true,configurable:true}});Object.defineProperty(e,"prototype",{writable:false});if(r)Q(e,r)}function Q(e,r){Q=Object.setPrototypeOf||function e(r,t){r.__proto__=t;return r};return Q(e,r)}function _(e){var r=D();return function t(){var a=R(e),i;if(r){var n=R(this).constructor;i=Reflect.construct(a,arguments,n)}else{i=a.apply(this,arguments)}return k(this,i)}}function k(e,r){if(r&&(typeof r==="object"||typeof r==="function")){return r}else if(r!==void 0){throw new TypeError("Derived constructors may only return object or undefined")}return T(e)}function T(e){if(e===void 0){throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}return e}function D(){if(typeof Reflect==="undefined"||!Reflect.construct)return false;if(Reflect.construct.sham)return false;if(typeof Proxy==="function")return true;try{Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}));return true}catch(e){return false}}function R(e){R=Object.setPrototypeOf?Object.getPrototypeOf:function e(r){return r.__proto__||Object.getPrototypeOf(r)};return R(e)}function I(e,r,t){if(r in e){Object.defineProperty(e,r,{value:t,enumerable:true,configurable:true,writable:true})}else{e[r]=t}return e}var M=r["Client"];var E=t["MetadataParserXML"];var B=a["MetadataParserJson"];var $=i["ItemParser"];var F=n["FacetParser"];var H=u["SuggestionParser"];var N=s["getEshSearchQuery"];var L=s["Comparison"];var z=s["Phrase"];var J=s["Term"];var G=s["SearchQueryComparisonOperator"];var V=s["ESOrderType"];var U=s["HierarchyFacet"];var X=c["Log"];var K=f["SearchQuery"];var W=l["SortOrder"];var Y=v["AbstractProvider"];var Z=y["SuggestionType"];var ee=p["ComplexCondition"];var re=h["ESHNotActiveError"];var te=d["HierarchyParser"];var ae=g["HierarchyNodePathParser"];var ie=S["SuggestionCalculationMode"];function ne(e,r,t){if(t){return r?r(e):e}if(!e||!e.then){e=Promise.resolve(e)}return r?e.then(r):e}function ue(e,r,t){if(t){return r?r(e()):e()}try{var a=Promise.resolve(e());return r?a.then(r):a}catch(e){return Promise.reject(e)}}function se(e,r){var t=e();if(t&&t.then){return t.then(r)}return r(t)}var oe=function(r){q(a,r);var t=_(a);function a(){var e;C(this,a);for(var r=arguments.length,i=new Array(r),n=0;n<r;n++){i[n]=arguments[n]}e=t.call.apply(t,[this].concat(i));I(T(e),"id","hana_odata");return e}w(a,[{key:"initAsync",value:function e(r){var t=this;return ue(function(){var e,a;t.requestPrefix=r.url;t.odataVersion=r.odataVersion;t.responseAttributes=r===null||r===void 0?void 0:r.responseAttributes;t.facetAttributes=r===null||r===void 0?void 0:r.facetAttributes;t.sina=r.sina;t.querySuffix=t.convertQuerySuffixToExpression(r.querySuffix);t.metaDataSuffix=(e=r.metaDataSuffix)!==null&&e!==void 0?e:"";var i;if(typeof r.getLanguage==="function"){i={csrf:false,getLanguage:r.getLanguage}}else{i={csrf:false}}t.ajaxClient=(a=r.ajaxClient)!==null&&a!==void 0?a:new M(i);var n=r.metaDataJsonType;if(n){t.metadataParser=new B(t)}else{t.metadataParser=new E(t)}t.itemParser=new $(t);t.facetParser=new F(t);t.suggestionParser=new H(t);t.hierarchyNodePathParser=new ae(t.sina);return ne(t.loadServerInfo(),function(e){t.serverInfo=e;if(!t.supports("Search")){throw new re}return ne(t.loadBusinessObjectDataSources(),function(){return t.sina.dataSources.length===0?Promise.reject(new re("Enterprise Search is not active - no datasources")):{capabilities:t.sina._createCapabilities({fuzzy:false})}})})})}},{key:"supports",value:function e(r,t){var a=this.serverInfo.services;for(var i in a){if(i===r){if(!t){return true}var n=a[i].Capabilities;for(var u=0;u<n.length;++u){var s=n[u];if(s===t){return true}}}}return false}},{key:"loadServerInfo",value:function e(){return ue(function(){var e={rawServerInfo:{Services:[{Service:"Search",Capabilities:[{Capability:"SemanticObjectType"}]},{Service:"Suggestions2",Capabilities:[{Capability:"ScopeTypes"}]}]},services:{Suggestions:{suggestionTypes:["objectdata"]},Search:{capabilities:["SemanticObjectType"]}}};return ne(e)})}},{key:"_prepareMetadataRequest",value:function e(){var r={metadataCall:true,resourcePath:this.getPrefix()+"/$metadata"};if(typeof this.metaDataSuffix==="string"&&this.metaDataSuffix.length>0){r.metadataObjects={entitySets:this.metaDataSuffix}}return N(r)}},{key:"loadBusinessObjectDataSources",value:function e(){var r=this;return ue(function(){var e=r._prepareMetadataRequest();return ne(r.metadataParser.fireRequest(r.ajaxClient,e),function(e){return ne(r.metadataParser.parseResponse(e),function(e){for(var t=0;t<e.dataSourcesList.length;++t){var a=e.dataSourcesList[t];r.metadataParser.fillMetadataBuffer(a,e.businessObjectMap[a.id])}})})})}},{key:"assembleOrderBy",value:function e(r){var t=[];if(Array.isArray(r.sortOrder)){for(var a=0;a<r.sortOrder.length;++a){var i=r.sortOrder[a];var n=i.order===W.Descending?V.Descending:V.Ascending;t.push({key:i.id,order:n})}}return t}},{key:"assembleGroupBy",value:function e(r){var t=null;if(r.groupBy&&r.groupBy.attributeName&&r.groupBy.attributeName.length>0){t.properties=r.groupBy.attributeName;if(r.groupBy.aggregateCountAlias&&r.groupBy.aggregateCountAlias!==""){t.aggregateCountAlias=r.groupBy.aggregateCountAlias}}return t}},{key:"executeSearchQuery",value:function e(r){var t=this._prepareSearchObjectSuggestionRequest(r);return this._fireSearchQuery(t)}},{key:"_prepareSearchObjectSuggestionRequest",value:function e(r){var t=r.filter.rootCondition.clone();var a=o.serialize(r.filter.dataSource,t);if(!Array.isArray(a.items)){a.items=[]}var i=r.filter.searchTerm||"*";if(this.querySuffix&&r.filter.dataSource.id==="SEARCH_DESIGN"){a.items.push(this.querySuffix)}var n=r.filter.dataSource;var u=r.top||10;var s=r.skip||0;var c=this.assembleOrderBy(r);var f={resourcePath:this.getPrefix()+"/$all",$top:u,$skip:s,whyfound:true,$count:true,$orderby:c,freeStyleText:i,searchQueryFilter:a};if(n!==this.sina.getAllDataSource()){f.scope=n.id}if(r instanceof K){if(typeof this.responseAttributes!=="undefined"){f.$select=this.responseAttributes}if(r.calculateFacets){if(typeof this.facetAttributes!=="undefined"){f.facets=this.facetAttributes}else{f.facets=["all"]}f.facetlimit=r.facetTop||5}var l=this.assembleGroupBy(r);if(l){f.groupby=l;f.whyfound=false}}var v={url:this.assembleEshSearchQuery(f),query:r};return v}},{key:"assembleEshSearchQuery",value:function e(r){var t,a;if(!((t=this.sina)!==null&&t!==void 0&&(a=t.configuration)!==null&&a!==void 0&&a.enableQueryLanguage)||!r.freeStyleText){return N(r)}var i="FDGhfdhgfHFGHrdthfgcvgzjmbvndf";var n=r.freeStyleText;r.freeStyleText=i;var u=N(r);var s=u.replace(i,encodeURIComponent("("+n+")"));return s}},{key:"_fireSearchQuery",value:function e(r){var t=this;return ue(function(){return ne(t.ajaxClient.getJson(r.url),function(e){t.metadataParser.parseDynamicMetadata(e);var a=t.hierarchyNodePathParser.parse(e,r.query);return ne(t.itemParser.parse(r.query,e.data),function(i){var n;var u;var s=(n=e.data["@com.sap.vocabularies.Search.v1.SearchStatistics"])===null||n===void 0?void 0:n.ConnectorStatistics;return se(function(){if(r.query.getDataSource()===t.sina.getAllDataSource()&&s&&Array.isArray(s)&&s.length===1){var a=[{"@com.sap.vocabularies.Search.v1.Facet":{PropertyName:"scope",isConnectorFacet:true},Items:[{scope:s[0].OdataID,_Count:e.data["@odata.count"]}]}];return ne(t.facetParser.parse(r.query,a),function(e){u=e})}else{return ne(t.facetParser.parse(r.query,e.data),function(e){u=e})}},function(){return t.sina._createSearchResultSet({title:"Search Result List",query:r.query,items:i,totalCount:e.data["@odata.count"]||0,facets:u,hierarchyNodePaths:a})})})})})}},{key:"_fireObjectSuggestionsQuery",value:function e(r){var t=this;return ue(function(){return ne(t.ajaxClient.getJson(r.url),function(e){t.metadataParser.parseDynamicMetadata(e);return ne(t.itemParser.parse(r.query,e.data),function(e){return t.suggestionParser.parseObjectSuggestions(r.query,e)})})})}},{key:"_prepareChartQueryRequest",value:function e(r,t,a){var i=r.filter.searchTerm;var n=r.filter.dataSource;var u=15;var s=a.deleted||false;var c=o.serialize(n,t);if(!Array.isArray(c.items)){c.items=[]}var f=r.top||5;if(s===true){var l=a.value;if(!a.value||a.value===""||l.match(/^[*\s]+$/g)!==null){a.value="*";c.items.push(new L({property:a.attribute,operator:G.Search,value:new J({term:"*"})}))}else{c.items.push(new L({property:a.attribute,operator:G.EqualCaseInsensitive,value:new z({phrase:a.value+"*"})}))}}if(this.querySuffix){c.items.push(this.querySuffix)}var v={resourcePath:this.getPrefix()+"/$all",$top:0,$count:true,searchQueryFilter:c,freeStyleText:i};if(n!==this.sina.getAllDataSource()){v.scope=n.id}var y=[];v.facetlimit=f;if(r.dimension){y.push(r.dimension);var p=r.filter.dataSource.getAttributeMetadata(r.dimension);if(p&&(p.type==="Double"||p.type==="Integer")&&f>=20){v.facetlimit=u}}v.facets=y;return N(v)}},{key:"executeChartQuery",value:function e(r){var t=new X;var a=r.filter.rootCondition.clone();var i=a.removeAttributeConditions(r.dimension);var n=this._prepareChartQueryRequest(r,a,i);return this.ajaxClient.getJson(n).then(function(e){var a=this.facetParser.parse(r,e.data,t);return a}.bind(this)).then(function(e){if(e.length>0){return e[0]}var a="";var i=r.filter.dataSource.getAttributeMetadata(r.dimension);if(i&&i.label){a=i.label}return this.sina._createChartResultSet({title:a,items:[],query:r,log:t})}.bind(this))}},{key:"executeHierarchyQuery",value:function r(t){var a=this;return ue(function(){var r=new te;var i=o.serialize(t.filter.dataSource,t.filter.rootCondition);if(!Array.isArray(i.items)){i.items=[]}if(a.querySuffix){i.items.push(a.querySuffix)}var n=N({resourcePath:a.getPrefix()+"/$all",$top:0,searchQueryFilter:i,freeStyleText:t.filter.searchTerm,scope:t.filter.dataSource.id,facets:[t.attributeId],facetroot:[new U({facetColumn:t.attributeId,rootIds:[t.nodeId],levels:1})]});return ne(a.ajaxClient.getJson(n),function(a){var i=t.filter.dataSource.getAttributeMetadata(t.attributeId);var n=a.data["@com.sap.vocabularies.Search.v1.Facets"]||[];var u=n.find(function(r){var a=e.getProperty(r,["@com.sap.vocabularies.Search.v1.Facet","Dimensions",0,"PropertyName"]);return a===t.attributeId});return r.parseHierarchyFacet(t,i,u||{})})})}},{key:"executeSuggestionQuery",value:function e(r){var t=this;return ue(function(){return Promise.all([t.executeRegularSuggestionQuery(r),t.executeObjectSuggestionQuery(r)]).then(function(e){var t=[];t.push.apply(t,b(e[1]));t.push.apply(t,b(e[0]));return this.sina._createSuggestionResultSet({title:"Suggestions",query:r,items:t})}.bind(t))})}},{key:"isObjectSuggestionQuery",value:function e(r){return r.types.indexOf(Z.Object)>=0&&r.filter.dataSource.type===r.sina.DataSourceType.BusinessObject}},{key:"executeObjectSuggestionQuery",value:function e(r){var t=this;return ue(function(){return t.isObjectSuggestionQuery(r)?ne(t._prepareSearchObjectSuggestionRequest(r),function(e){return t._fireObjectSuggestionsQuery(e)}):Promise.resolve([])})}},{key:"executeRegularSuggestionQuery",value:function e(r){if(r.calculationModes.includes(ie.Data)&&r.types.includes(Z.SearchTerm)){return this._fireSuggestionQuery(r)}return Promise.resolve([])}},{key:"_prepareSuggestionQueryRequest",value:function e(r){var t=r.filter.searchTerm;var a=r.filter.dataSource;var i=r.filter.rootCondition.clone();var n=o.serialize(r.filter.dataSource,i);if(!Array.isArray(n.items)){n.items=[]}var u=r.top||10;var s=r.skip||0;if(this.querySuffix){n.items.push(this.querySuffix)}var c={suggestTerm:t,resourcePath:this.getPrefix()+"/$all",$top:u,$skip:s,searchQueryFilter:n};if(a!==this.sina.getAllDataSource()){c.scope=a.id}return N(c)}},{key:"_fireSuggestionQuery",value:function e(r){var t=this._prepareSuggestionQueryRequest(r);return this.ajaxClient.getJson(t).then(function(e){var t=[];if(e.data.value){t=this.suggestionParser.parse(r,e.data.value)}return t}.bind(this))}},{key:"getPrefix",value:function e(){var r,t;var a=(r=this.odataVersion)!==null&&r!==void 0?r:"/v20411";var i=(t=this.requestPrefix)!==null&&t!==void 0?t:"/sap/es/odata";var n=i+a;return n}},{key:"convertQuerySuffixToExpression",value:function e(r){var t=null;if(r&&r instanceof ee){t=o.serialize(null,r)}return t}},{key:"getDebugInfo",value:function e(){return"ESH API Provider: "+this.id}}]);return a}(Y);var ce={__esModule:true};ce.Provider=oe;return ce})})();