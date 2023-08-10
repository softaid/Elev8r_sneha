/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["sap/ui/core/Control","sap/m/library","sap/ui/core/Icon","sap/m/Label","sap/m/Breadcrumbs","sap/ui/core/CustomData","sap/esh/search/ui/controls/SearchLink","../sinaNexTS/sina/LogicalOperator","../sinaNexTS/sina/ComparisonOperator","../sinaNexTS/sina/ComplexCondition","../sinaNexTS/sina/SimpleCondition","../sinaNexTS/sina/Filter","sap/base/strings/formatMessage"],function(e,r,a,t,n,i,s,o,l,c,u,d,p){var h=r["LabelDesign"];var g=o["LogicalOperator"];var b=l["ComparisonOperator"];var m=c["ComplexCondition"];var f=u["SimpleCondition"];var v=d["Filter"];var y=e.extend("sap.esh.search.ui.controls.SearchCountBreadcrumbs",{renderer:{apiVersion:2,render:function e(r,a){r.openStart("div",a);r["class"]("sapUshellSearchTotalCountBreadcrumbs");r.openEnd();r.renderControl(a.getAggregation("icon"));r.renderControl(a.getAggregation("label"));var t=a.getModel();if(t.config.FF_hierarchyBreadcrumbs===true){r.renderControl(a.getAggregation("breadcrumbs"))}r.close("div")}},metadata:{aggregations:{icon:{type:"sap.ui.core.Icon",multiple:false},label:{type:"sap.m.Label",multiple:false},breadcrumbs:{type:"sap.m.Breadcrumbs",multiple:false}}},constructor:function r(a,t){e.prototype.constructor.call(this,a,t);this.initIcon();this.initLabel();this.initBreadCrumbs()},initIcon:function e(){var r=new a(this.getId()+"-Icon",{visible:{parts:[{path:"/count"},{path:"/breadcrumbsHierarchyNodePaths"}],formatter:function e(r,a){if(a&&Array.isArray(a)&&a.length>0){return false}return true}},src:{path:"/searchInIcon"}});r.addStyleClass("sapUiTinyMarginEnd");r.addStyleClass("sapUshellSearchTotalCountBreadcrumbsIcon");this.setAggregation("icon",r)},initLabel:function e(){var r=new t(this.getId()+"-Label",{visible:{parts:[{path:"/count"},{path:"/breadcrumbsHierarchyNodePaths"}],formatter:function e(r,a){if(a&&Array.isArray(a)&&a.length>0){return false}return true}},design:h.Bold,text:{path:"/countText"}});r.addStyleClass("sapUshellSearchTotalCountSelenium");this.setAggregation("label",r)},initBreadCrumbs:function e(){var r={path:"/breadcrumbsHierarchyNodePaths",template:new s("",{text:{path:"label"},icon:new a("",{src:{path:"icon"}}),visible:true,enabled:{path:"isLast",formatter:function e(r){if(r===true){return false}return true}},customData:[new i("",{key:"containerId",value:{path:"id"}}),new i("",{key:"containerName",value:{path:"label"}})],press:this.handleBreadcrumbLinkPress.bind(this)}).addStyleClass("sapUshellSearchTotalCountBreadcrumbsLinks"),templateShareable:false};var t={visible:{parts:[{path:"/breadcrumbsHierarchyNodePaths"}],formatter:function e(r){if(r&&Array.isArray(r)&&r.length>0){return true}return false}},currentLocationText:{parts:[{path:"i18n>countnumber"},{path:"/count"}],formatter:p},separatorStyle:sap.m.BreadcrumbsSeparatorStyle.GreaterThan,links:r};var o=new n(this.getId()+"-Breadcrumbs",t).addStyleClass("sapUshellSearchTotalCountBreadcrumbs sapUiNoMarginBottom");this.setAggregation("breadcrumbs",o)},handleBreadcrumbLinkPress:function e(r){var a=r.getSource();var t=a.data().containerId;var n=a.data().containerName;var i=a.getModel();var s=i.sinaNext;var o=i.getDataSource();var l=i.getProperty("/breadcrumbsHierarchyAttribute");var c=function e(r){var a=b.ChildOf;if(r.isHierarchyDefinition!==true||r.hierarchyDisplayType!==s.HierarchyDisplayType.HierarchyResultView){a=b.DescendantOf}return a};var u=c(o);var d=new f({attribute:l,operator:u,value:t,valueLabel:n});var p=new m({operator:g.And,conditions:[d]});var h=new m({operator:g.And,conditions:[p]});var y=new v({dataSource:o,searchTerm:"*",rootCondition:h,sina:s});var C={top:10,filter:encodeURIComponent(JSON.stringify(y.toJson()))};var S=i.config.renderSearchUrl(C);var A=s._createNavigationTarget({targetUrl:S,label:"Children Folders",target:"_self"});A.performNavigation()},setModel:function e(r){this.getAggregation("icon").setModel(r);this.getAggregation("label").setModel(r);this.getAggregation("breadcrumbs").setModel(r);return this}});return y})})();