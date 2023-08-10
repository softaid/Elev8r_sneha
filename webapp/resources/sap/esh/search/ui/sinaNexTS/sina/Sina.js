/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../core/core","../core/errors","../core/util","./AttributeType","./AttributeFormatType","./AttributeGroupTextArrangement","./DataSourceType","./MatchingStrategy","./LogicalOperator","./ComparisonOperator","./FacetType","./SuggestionCalculationMode","./SuggestionType","./SortOrder","./ConditionType","../providers/tools/cds/CDSAnnotationsParser","../providers/tools/sors/NavigationTargetGenerator","./SearchResultSet","./SearchResultSetItem","./SearchResultSetItemAttribute","./ObjectSuggestion","./SearchQuery","./ChartQuery","./SuggestionQuery","./DataSourceQuery","./Filter","./ComplexCondition","./SimpleCondition","./AttributeMetadata","./AttributeGroupMetadata","./AttributeGroupMembership","./SearchResultSetItemAttributeGroup","./SearchResultSetItemAttributeGroupMembership","./SearchTermSuggestion","./SearchTermAndDataSourceSuggestion","./DataSourceSuggestion","./SuggestionResultSet","./ChartResultSet","./DataSourceResultSet","./ChartResultSetItem","./DataSourceResultSetItem","./Capabilities","./Configuration","./NavigationTarget","./formatters/Formatter","./DataSource","./UserCategoryDataSource","../providers/tools/ItemPostParser","../providers/tools/fiori/SuvNavTargetResolver","../providers/tools/fiori/NavigationTargetForIntent","../providers/tools/fiori/FioriIntentsResolver","./formatters/ResultValueFormatter","./formatters/NavtargetsInResultSetFormatter","./formatters/HierarchyResultSetFormatter","./formatters/ConfigSearchResultSetFormatter","./formatters/ConfigMetadataFormatter","./FilteredDataSource","../providers/inav2/Provider","../providers/abap_odata/Provider","./HierarchyQuery","./HierarchyNode","./HierarchyResultSet","../providers/inav2/typeConverter","./HierarchyNodePath","./HierarchyDisplayType"],function(e,t,r,a,i,o,n,s,u,c,h,l,S,v,f,y,d,p,m,g,b,F,C,A,D,O,R,T,j,_,w,I,M,P,N,k,H,x,G,Q,E,L,J,U,B,V,z,q,$,K,W,X,Y,Z,ee,te,re,ae,ie,oe,ne,se,ue,ce,he){function le(e,t){var r=typeof Symbol!=="undefined"&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=Se(e))||t&&e&&typeof e.length==="number"){if(r)e=r;var a=0;var i=function(){};return{s:i,n:function(){if(a>=e.length)return{done:true};return{done:false,value:e[a++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o=true,n=false,s;return{s:function(){r=r.call(e)},n:function(){var e=r.next();o=e.done;return e},e:function(e){n=true;s=e},f:function(){try{if(!o&&r.return!=null)r.return()}finally{if(n)throw s}}}}function Se(e,t){if(!e)return;if(typeof e==="string")return ve(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor)r=e.constructor.name;if(r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return ve(e,t)}function ve(e,t){if(t==null||t>e.length)t=e.length;for(var r=0,a=new Array(t);r<t;r++)a[r]=e[r];return a}function fe(e,t){if(!(e instanceof t)){throw new TypeError("Cannot call a class as a function")}}function ye(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||false;a.configurable=true;if("value"in a)a.writable=true;Object.defineProperty(e,a.key,a)}}function de(e,t,r){if(t)ye(e.prototype,t);if(r)ye(e,r);Object.defineProperty(e,"prototype",{writable:false});return e}function pe(e,t,r){if(t in e){Object.defineProperty(e,t,{value:r,enumerable:true,configurable:true,writable:true})}else{e[t]=r}return e}var me=a["AttributeType"];var ge=i["AttributeFormatType"];var be=o["AttributeGroupTextArrangement"];var Fe=n["DataSourceSubType"];var Ce=n["DataSourceType"];var Ae=s["MatchingStrategy"];var De=u["LogicalOperator"];var Oe=c["ComparisonOperator"];var Re=h["FacetType"];var Te=l["SuggestionCalculationMode"];var je=S["SuggestionType"];var _e=v["SortOrder"];var we=f["ConditionType"];var Ie=y["CDSAnnotationsParser"];var Me=d["NavigationTargetGenerator"];var Pe=p["SearchResultSet"];var Ne=m["SearchResultSetItem"];var ke=g["SearchResultSetItemAttribute"];var He=b["ObjectSuggestion"];var xe=F["SearchQuery"];var Ge=C["ChartQuery"];var Qe=A["SuggestionQuery"];var Ee=D["DataSourceQuery"];var Le=O["Filter"];var Je=R["ComplexCondition"];var Ue=T["SimpleCondition"];var Be=j["AttributeMetadata"];var Ve=_["AttributeGroupMetadata"];var ze=w["AttributeGroupMembership"];var qe=I["SearchResultSetItemAttributeGroup"];var $e=M["SearchResultSetItemAttributeGroupMembership"];var Ke=P["SearchTermSuggestion"];var We=N["SearchTermAndDataSourceSuggestion"];var Xe=k["DataSourceSuggestion"];var Ye=H["SuggestionResultSet"];var Ze=x["ChartResultSet"];var et=G["DataSourceResultSet"];var tt=Q["ChartResultSetItem"];var rt=E["DataSourceResultSetItem"];var at=L["Capabilities"];var it=J["Configuration"];var ot=U["NavigationTarget"];var nt=B["Formatter"];var st=V["DataSource"];var ut=z["UserCategoryDataSource"];var ct=q["ItemPostParser"];var ht=$["SuvNavTargetResolver"];var lt=K["NavigationTargetForIntent"];var St=W["FioriIntentsResolver"];var vt=X["ResultValueFormatter"];var ft=Y["NavtargetsInResultSetFormatter"];var yt=Z["HierarchyResultSetFormatter"];var dt=ee["ConfigSearchResultSetFormatter"];var pt=te["ConfigMetadataFormatter"];var mt=re["FilteredDataSource"];var gt=ae["Provider"];var bt=ie["Provider"];var Ft=oe["HierarchyQuery"];var Ct=ne["HierarchyNode"];var At=se["HierarchyResultSet"];var Dt=ce["HierarchyNodePath"];var Ot=he["HierarchyDisplayType"];function Rt(){}function Tt(e,t){if(!t){return e&&e.then?e.then(Rt):Promise.resolve()}}function jt(e,t){var r=e();if(r&&r.then){return r.then(t)}return t(r)}function _t(e,t,r){if(r){return t?t(e):e}if(!e||!e.then){e=Promise.resolve(e)}return t?e.then(t):e}function wt(e,t,r){if(r){return t?t(e()):e()}try{var a=Promise.resolve(e());return t?a.then(t):a}catch(e){return Promise.reject(e)}}var It=function(){function a(i){fe(this,a);pe(this,"isNeededCache",{});this.core=e;this.errors=t;this.util=r;this.inav2TypeConverter=ue;this.provider=i;this.createSearchQuery=this.createSinaObjectFactory(xe);this.createChartQuery=this.createSinaObjectFactory(Ge);this.createHierarchyQuery=this.createSinaObjectFactory(Ft);this.createSuggestionQuery=this.createSinaObjectFactory(Qe);this.createDataSourceQuery=this.createSinaObjectFactory(Ee);this.createFilter=this.createSinaObjectFactory(Le);this.createComplexCondition=this.createSinaObjectFactory(Je);this.createSimpleCondition=this.createSinaObjectFactory(Ue);this.createHierarchyNode=this.createSinaObjectFactory(Ct);this.createHierarchyNodePath=this.createSinaObjectFactory(Dt);this._createAttributeMetadata=this.createSinaObjectFactory(Be);this._createAttributeGroupMetadata=this.createSinaObjectFactory(Ve);this._createAttributeGroupMembership=this.createSinaObjectFactory(ze);this._createSearchResultSetItemAttribute=this.createSinaObjectFactory(ke);this._createSearchResultSetItemAttributeGroup=this.createSinaObjectFactory(qe);this._createSearchResultSetItemAttributeGroupMembership=this.createSinaObjectFactory($e);this._createSearchResultSetItem=this.createSinaObjectFactory(Ne);this._createSearchResultSet=this.createSinaObjectFactory(Pe);this._createSearchTermSuggestion=this.createSinaObjectFactory(Ke);this._createSearchTermAndDataSourceSuggestion=this.createSinaObjectFactory(We);this._createDataSourceSuggestion=this.createSinaObjectFactory(Xe);this._createObjectSuggestion=this.createSinaObjectFactory(He);this._createSuggestionResultSet=this.createSinaObjectFactory(Ye);this._createChartResultSet=this.createSinaObjectFactory(Ze);this._createHierarchyResultSet=this.createSinaObjectFactory(At);this._createChartResultSetItem=this.createSinaObjectFactory(tt);this._createDataSourceResultSetItem=this.createSinaObjectFactory(rt);this._createCapabilities=this.createSinaObjectFactory(at);this._createConfiguration=this.createSinaObjectFactory(it);this._createNavigationTarget=this.createSinaObjectFactory(ot);this._createSorsNavigationTargetGenerator=this.createSinaObjectFactory(Me);this._createFioriIntentsResolver=this.createSinaObjectFactory(St);this._createNavigationTargetForIntent=this.createSinaObjectFactory(lt);this._createCDSAnnotationsParser=this.createSinaObjectFactory(Ie);this._createItemPostParser=this.createSinaObjectFactory(ct);this._createSuvNavTargetResolver=this.createSinaObjectFactory(ht);this.searchResultSetFormatters=[];this.suggestionResultSetFormatters=[];this.metadataFormatters=[];this.dataSources=[];this.dataSourceMap={};this.allDataSource=this.createDataSource({id:"All",label:"All",type:Ce.Category});this.searchResultSetFormatters.push(new ft);this.searchResultSetFormatters.push(new yt);this.searchResultSetFormatters.push(new vt);this.DataSourceType=Ce;this.DataSourceSubType=Fe;this.HierarchyDisplayType=Ot;this.AttributeGroupTextArrangement=be;this.AttributeType=me;this.AttributeFormatType=ge;this.FacetType=Re;this.SuggestionType=je;this.ConditionType=we;this.SuggestionCalculationMode=Te;this.SortOrder=_e;this.MatchingStrategy=Ae;this.ComparisonOperator=Oe;this.LogicalOperator=De}de(a,[{key:"initAsync",value:function e(r){var a=this;return wt(function(){a.configuration=r;a.isDummyProvider=r.provider.indexOf("dummy")>-1;a.provider.label=r.label;return _t(a._evaluateConfigurationAsync(r),function(){r.sina=a;return _t(a.provider.initAsync(r),function(e){e=e||{capabilities:null};a.capabilities=e.capabilities||a._createCapabilities({sina:a});return _t(a._formatMetadataAsync(),function(){return jt(function(){if(r.initAsync){return Tt(r.initAsync(a))}},function(){if(a.getBusinessObjectDataSources().length===0&&!a.isDummyProvider){throw new t.ESHNotActiveError("Not active - no datasources")}})})})})})}},{key:"_formatMetadataAsync",value:function t(){return e.executeSequentialAsync(this.metadataFormatters,function(e){return e.formatAsync({dataSources:this.dataSources})}.bind(this))}},{key:"_evaluateConfigurationAsync",value:function e(t){var r=this;return wt(function(){var e=[];if(t.searchResultSetFormatters){for(var a=0;a<t.searchResultSetFormatters.length;++a){var i=t.searchResultSetFormatters[a];if(!(i instanceof nt)&&!i.formatAsync){i=new dt(i)}r.searchResultSetFormatters.push(i);if(i.initAsync){e.push(i.initAsync())}}}if(t.suggestionResultSetFormatters){for(var o=0;o<t.suggestionResultSetFormatters.length;++o){var n=t.suggestionResultSetFormatters[o];r.suggestionResultSetFormatters.push(n);if(n.initAsync){e.push(n.initAsync())}}}if(t.metadataFormatters){for(var s=0;s<t.metadataFormatters.length;++s){var u=t.metadataFormatters[s];if(!(u instanceof nt)&&!u.formatAsync){u=new pt(u)}r.metadataFormatters.push(u);if(u.initAsync){e.push(u.initAsync())}}}return Promise.all(e)})}},{key:"loadMetadata",value:function e(t){var r=this;return wt(function(){if(r.provider instanceof gt){if(r.provider.loadMetadata){return _t(r.provider.loadMetadata(t))}}return Promise.resolve()})}},{key:"createDataSourceMap",value:function e(t){var r={};for(var a=0;a<t.length;++a){var i=t[a];r[i.id]=i}return r}},{key:"createSinaObjectFactory",value:function e(t){return function(e){var r;e=(r=e)!==null&&r!==void 0?r:{sina:this};e.sina=this;return new t(e)}}},{key:"_createDataSourceResultSet",value:function e(t){var r=this.removeHierarchyHelperDataSources(t.items,function(e){return e.dataSource});t.items=r;var a=new et(t);a.sina=this;return a}},{key:"removeHierarchyHelperDataSources",value:function e(t,r){var a=this;var i=function e(t){var r=a.isNeededCache[t.id];if(typeof r!=="undefined"){return r}var i=le(a.dataSources),o;try{for(i.s();!(o=i.n()).done;){var n=o.value;var s=le(n.attributesMetadata),u;try{for(s.s();!(u=s.n()).done;){var c=u.value;if(c.hierarchyName===t.hierarchyName&&c.hierarchyDisplayType===Ot.HierarchyResultView){a.isNeededCache[t.id]=true;return true}}}catch(e){s.e(e)}finally{s.f()}}}catch(e){i.e(e)}finally{i.f()}a.isNeededCache[t.id]=false;return false};for(var o=0;o<t.length;o++){var n=t[o];var s=r(n);if(!s.isHierarchyDefinition){continue}if(!i(s)){t.splice(o,1);o--}}return t}},{key:"createDataSource",value:function e(r){r.sina=this;var a;switch(r.type){case Ce.BusinessObject:switch(r.subType){case Fe.Filtered:a=new mt(r);break;default:a=new st(r)}break;case Ce.UserCategory:a=new ut(r);break;default:a=new st(r)}if(this.dataSourceMap[a.id]){throw new t.CanNotCreateAlreadyExistingDataSourceError('cannot create an already existing datasource: "'+a.id+'"')}this._addDataSource(a);return a}},{key:"_createDataSource",value:function e(t){return this.createDataSource(t)}},{key:"_addDataSource",value:function e(t){if(t.type===Ce.BusinessObject&&t.subType===Fe.Filtered){var r=-1;for(var a=this.dataSources.length-1;a>=1;--a){var i=this.dataSources[a];if(i.type===Ce.BusinessObject&&i.subType===Fe.Filtered){r=a;break}}if(r>=0){this.dataSources.splice(r+1,0,t)}else{this.dataSources.push(t)}}else{this.dataSources.push(t)}this.dataSourceMap[t.id]=t}},{key:"getAllDataSource",value:function e(){return this.allDataSource}},{key:"getBusinessObjectDataSources",value:function e(){var t=[];for(var r=0;r<this.dataSources.length;++r){var a=this.dataSources[r];if(!a.hidden&&a.type===Ce.BusinessObject&&a.subType!==Fe.Filtered){t.push(a)}}return this.removeHierarchyHelperDataSources(t,function(e){return e})}},{key:"getDataSource",value:function e(t){return this.dataSourceMap[t]}},{key:"getConfigurationAsync",value:function e(){var t=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var r=this;return wt(function(){if(r.provider instanceof gt||r.provider instanceof bt){if(r.configurationPromise&&!t.forceReload){return _t(r.configurationPromise)}r.configurationPromise=r.provider.getConfigurationAsync();return _t(r.configurationPromise)}return Promise.resolve(r._createConfiguration({personalizedSearch:false,isPersonalizedSearchEditable:false}))})}},{key:"logUserEvent",value:function e(t){if(this.provider instanceof gt||this.provider instanceof bt){this.provider.logUserEvent(t)}}},{key:"getDebugInfo",value:function e(){return this.provider.getDebugInfo()}},{key:"parseDataSourceFromJson",value:function e(r){var a=this.getDataSource(r.id);if(a){return a}if(r.type!==Ce.Category){throw new t.DataSourceInURLDoesNotExistError("Datasource in URL does not exist "+r.id)}a=this._createDataSource(r);return a}},{key:"parseSimpleConditionFromJson",value:function t(a){var i;if(e.isObject(a.value)){i=r.dateFromJson(a.value)}else{i=a.value}var o;if(a.userDefined){o=true}else{o=false}return this.createSimpleCondition({operator:a.operator,attribute:a.attribute,value:i,attributeLabel:a.attributeLabel,valueLabel:a.valueLabel,userDefined:o})}},{key:"parseComplexConditionFromJson",value:function e(t){var r=[];for(var a=0;a<t.conditions.length;++a){var i=t.conditions[a];r.push(this.parseConditionFromJson(i))}var o;if(t.userDefined){o=true}else{o=false}return this.createComplexCondition({operator:t.operator,conditions:r,attributeLabel:t.attributeLabel,valueLabel:t.valueLabel,userDefined:o})}},{key:"parseConditionFromJson",value:function e(r){switch(r.type){case we.Simple:return this.parseSimpleConditionFromJson(r);case we.Complex:return this.parseComplexConditionFromJson(r);default:throw new t.UnknownConditionTypeError('unknown condition type "'+r.type+'"')}}},{key:"parseFilterFromJson",value:function e(r){var a=this.parseConditionFromJson(r.rootCondition);if(a instanceof Je){return this.createFilter({searchTerm:r===null||r===void 0?void 0:r.searchTerm,rootCondition:a,dataSource:this.parseDataSourceFromJson(r.dataSource)})}else{throw new t.UnknownConditionTypeError("Only complex condition is allowed in Filter JSON")}}}]);return a}();var Mt={__esModule:true};Mt.Sina=It;return Mt})})();