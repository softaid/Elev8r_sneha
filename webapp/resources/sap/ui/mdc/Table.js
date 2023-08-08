/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./Control","./ActionToolbar","./table/TableSettings","./table/GridTableType","./table/TreeTableType","./table/ResponsiveTableType","./table/PropertyHelper","./mixin/FilterIntegrationMixin","./library","sap/m/Text","sap/m/Title","sap/m/ColumnHeaderPopover","sap/m/ColumnPopoverSelectListItem","sap/m/OverflowToolbar","sap/m/library","sap/m/table/Util","sap/m/table/columnmenu/Menu","sap/ui/core/Core","sap/ui/core/format/NumberFormat","sap/ui/core/Item","sap/ui/core/format/ListFormat","sap/ui/core/library","sap/ui/events/KeyCodes","sap/ui/model/Sorter","sap/base/strings/capitalize","sap/base/util/deepEqual","sap/base/util/Deferred","sap/base/util/UriParameters","sap/ui/core/InvisibleMessage","sap/ui/core/InvisibleText","sap/ui/mdc/p13n/subcontroller/ColumnController","sap/ui/mdc/p13n/subcontroller/SortController","sap/ui/mdc/p13n/subcontroller/FilterController","sap/ui/mdc/p13n/subcontroller/GroupController","sap/ui/mdc/p13n/subcontroller/AggregateController","sap/ui/mdc/p13n/subcontroller/ColumnWidthController","sap/ui/mdc/actiontoolbar/ActionToolbarAction","sap/ui/mdc/table/menu/QuickActionContainer","sap/ui/mdc/table/menu/ItemContainer","sap/ui/core/theming/Parameters","sap/base/Log"],function(t,e,i,o,n,r,s,a,l,u,p,h,d,g,c,f,_,b,y,T,m,v,C,I,P,E,x,B,S,D,A,w,R,M,F,N,L,z,H,O,V){"use strict";var U=l.SelectionMode;var k=l.TableType;var G=l.TableP13nMode;var j=c.ToolbarDesign;var W=c.ToolbarStyle;var Q=c.IllustratedMessageType;var q=l.MultiSelectMode;var K=v.TitleLevel;var X=v.SortOrder;var $=new window.WeakMap;var J=function(t){if(!$.has(t)){$.set(t,{oFilterInfoBar:null})}return $.get(t)};var Y={Table:o,TreeTable:n,ResponsiveTable:r,null:o};var Z=t.extend("sap.ui.mdc.Table",{metadata:{library:"sap.ui.mdc",designtime:"sap/ui/mdc/designtime/table/Table.designtime",interfaces:["sap.ui.mdc.IFilterSource","sap.ui.mdc.IxState"],defaultAggregation:"columns",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null,invalidate:true},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null,invalidate:true},p13nMode:{type:"sap.ui.mdc.TableP13nMode[]",defaultValue:[]},delegate:{type:"object",defaultValue:{name:"sap/ui/mdc/TableDelegate",payload:{}}},headerLevel:{type:"sap.ui.core.TitleLevel",group:"Appearance",defaultValue:K.Auto},autoBindOnInit:{type:"boolean",group:"Misc",defaultValue:true},header:{type:"string",group:"Misc",defaultValue:null},headerVisible:{type:"boolean",group:"Misc",defaultValue:true},selectionMode:{type:"sap.ui.mdc.SelectionMode",defaultValue:U.None},showRowCount:{type:"boolean",group:"Misc",defaultValue:true},threshold:{type:"int",group:"Appearance",defaultValue:-1},noDataText:{type:"string"},sortConditions:{type:"object"},filterConditions:{type:"object",defaultValue:{}},groupConditions:{type:"object"},aggregateConditions:{type:"object"},enableExport:{type:"boolean",defaultValue:false},busyIndicatorDelay:{type:"int",defaultValue:100},enableColumnResize:{type:"boolean",group:"Behavior",defaultValue:true},showPasteButton:{type:"boolean",group:"Behavior",defaultValue:false},enablePaste:{type:"boolean",group:"Behavior",defaultValue:true},multiSelectMode:{type:"sap.ui.mdc.MultiSelectMode",group:"Behavior",defaultValue:q.Default},enableAutoColumnWidth:{type:"boolean",group:"Behavior",defaultValue:false}},aggregations:{_content:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},type:{type:"sap.ui.mdc.table.TableTypeBase",altTypes:["sap.ui.mdc.TableType"],multiple:false},columns:{type:"sap.ui.mdc.table.Column",multiple:true},creationRow:{type:"sap.ui.mdc.table.CreationRow",multiple:false},actions:{type:"sap.ui.core.Control",multiple:true,forwarding:{getter:"_createToolbar",aggregation:"actions"}},variant:{type:"sap.ui.fl.variants.VariantManagement",multiple:false},quickFilter:{type:"sap.ui.core.Control",multiple:false},rowSettings:{type:"sap.ui.mdc.table.RowSettings",multiple:false},dataStateIndicator:{type:"sap.m.plugins.DataStateIndicator",multiple:false},noData:{type:"sap.ui.core.Control",multiple:false,altTypes:["string"]}},associations:{filter:{type:"sap.ui.mdc.IFilter",multiple:false}},events:{rowPress:{parameters:{bindingContext:{type:"sap.ui.model.Context"}}},selectionChange:{parameters:{bindingContext:{type:"sap.ui.model.Context"},selected:{type:"boolean"},selectAll:{type:"boolean"}}},beforeExport:{parameters:{exportSettings:{type:"object"},userExportSettings:{type:"object"}}},paste:{parameters:{data:{type:"string[][]"}}}}},constructor:function(){this._oTableReady=new x;this._oFullInitialize=new x;this._bUseColumnMenu=B.fromQuery(window.location.search).get("sap-ui-xx-columnmenu")==="true";t.apply(this,arguments);this.bCreated=true;this._updateAdaptation();this._doOneTimeOperations();this._initializeContent()},renderer:{apiVersion:2,render:function(t,e){t.openStart("div",e);t.class("sapUiMdcTable");t.style("height",e.getHeight());t.style("width",e.getWidth());t.openEnd();t.renderControl(e.getAggregation("_content"));t.close("div")}}});var tt=["variant","quickFilter"];a.call(Z.prototype);tt.forEach(function(t){var e=P(t),i="_o"+e,o="get"+e,n="set"+e,r="destroy"+e;Z.prototype[o]=function(){return this[i]};Z.prototype[r]=function(){var t=this[i];this[n]();if(t){t.destroy()}return this};Z.prototype[n]=function(e){this.validateAggregation(t,e,false);var n=this._createToolbar(),r=e!==this[i];if(!e||r){n.removeBetween(this[o]());this[i]=e}if(r&&e){this._setToolbarBetween(n)}return this}});Z.prototype.init=function(){t.prototype.init.apply(this,arguments);this.mSkipPropagation={rowSettings:true};this._bForceRebind=true};Z.prototype.applySettings=function(e,i){if(e&&"type"in e){var o={type:e.type};if("delegate"in e){o.delegate=e.delegate;delete e.delegate}delete e.type;t.prototype.applySettings.call(this,o,i)}this._setPropertyHelperClass(s);t.prototype.applySettings.call(this,e,i);this.initControlDelegate()};Z.prototype._setToolbarBetween=function(t){[this._oVariant,this._oQuickFilter].forEach(function(e){if(e){t.addBetween(e)}})};Z.prototype.initialized=function(){return this._oTableReady.promise};Z.prototype._fullyInitialized=function(){return this._oFullInitialize.promise};Z.prototype.getDataStateIndicatorPluginOwner=function(t){return this._oTable||this._oFullInitialize.promise};Z.prototype.setDataStateIndicator=function(t){this._handleDataStateEvents(this.getDataStateIndicator(),"detach");this.setAggregation("dataStateIndicator",t,true);this._handleDataStateEvents(this.getDataStateIndicator(),"attach");return this};Z.prototype._handleDataStateEvents=function(t,e){if(t){t[e+"ApplyFilter"](this._onApplyMessageFilter,this);t[e+"ClearFilter"](this._onClearMessageFilter,this);t[e+"Event"]("filterInfoPress",ft,this)}};Z.prototype._onApplyMessageFilter=function(t){this._oMessageFilter=t.getParameter("filter");t.preventDefault();this._rebind()};Z.prototype._onClearMessageFilter=function(t){this._oMessageFilter=null;t.preventDefault();this._rebind()};Z.prototype._isOfType=function(t,e){var i=this._getType();if(e){return i.isA(Y[t].getMetadata().getName())}else{return i.constructor===Y[t]}};Z.prototype.scrollToIndex=function(t){if(typeof t!=="number"){return Promise.reject("The iIndex parameter has to be a number")}return this._getType().scrollToIndex(t)};Z.prototype.focusRow=function(t,e){return this.scrollToIndex(t).then(function(){return this._oTable._setFocus(t,e)}.bind(this))};Z.prototype.setType=function(t){if(!this.bCreated||this.getType()==t){return this.setAggregation("type",t,true)}if(this._oToolbar){this._getType().removeToolbar()}this._destroyDefaultType();this.setAggregation("type",t,true);if(this._oTable){var e=this.getNoData();this.setNoData();this._vNoData=e;this._oTable.destroy("KeepDom");this._oTable=null;this._bTableExists=false}else{this._onAfterTableCreated();this._onAfterFullInitialization()}if(this._oRowTemplate){this._oRowTemplate.destroy();this._oRowTemplate=null}this._oTableReady=new x;this._oFullInitialize=new x;this._bFullyInitialized=false;this._initializeContent();return this};Z.prototype._getType=function(){var t=this.getType();if(!this._oDefaultType&&(typeof t==="string"||t===null)){this._oDefaultType=new Y[t];this.addDependent(this._oDefaultType)}return this._oDefaultType||this.getType()};Z.prototype._destroyDefaultType=function(){if(this._oDefaultType){this._oDefaultType.destroy();delete this._oDefaultType}};Z.prototype.setRowSettings=function(t){this.setAggregation("rowSettings",t,true);this._getType().updateRowSettings();if(this._oTable){this._bForceRebind=true;this._rebind()}return this};Z.prototype.setHeaderLevel=function(t){if(this.getHeaderLevel()===t){return this}this.setProperty("headerLevel",t,true);this._oTitle&&this._oTitle.setLevel(t);return this};Z.prototype.focus=function(t){if(this._oTable){this._oTable.focus(t)}};Z.prototype.setBusy=function(t){this.setProperty("busy",t,true);if(this._oTable){this._oTable.setBusy(t)}return this};Z.prototype.setBusyIndicatorDelay=function(t){this.setProperty("busyIndicatorDelay",t,true);if(this._oTable){this._oTable.setBusyIndicatorDelay(t)}return this};Z.prototype.setSelectionMode=function(t){this.setProperty("selectionMode",t,true);this._getType().updateSelectionSettings();return this};Z.prototype.setMultiSelectMode=function(t){this.setProperty("multiSelectMode",t,true);this._getType().updateSelectionSettings();return this};Z.prototype.setCreationRow=function(t){this.setAggregation("creationRow",t,true);if(t){t.update()}return this};Z.prototype.setEnableColumnResize=function(t){var e=this.getEnableColumnResize();this.setProperty("enableColumnResize",t,true);if(this.getEnableColumnResize()!==e){this._updateColumnResize();this._updateAdaptation()}return this};Z.prototype._onModifications=function(){this.getColumns().forEach(function(t){t._onModifications()})};Z.prototype.setP13nMode=function(t){var e=this.getP13nMode();var i=[];if(t&&t.length>1){var o=t.reduce(function(t,e,i){t[e]=true;return t},{});if(o.Column){i.push("Column")}if(o.Sort){i.push("Sort")}if(o.Filter){i.push("Filter")}if(o.Group){i.push("Group")}if(o.Aggregate){i.push("Aggregate")}}else{i=t}this.setProperty("p13nMode",i,true);this._updateAdaptation();if(!E(e.sort(),this.getP13nMode().sort())){et(this)}return this};Z.prototype._updateAdaptation=function(){var t={controller:{}};var e={Column:A,Sort:w,Group:M,Filter:R,Aggregate:F,ColumnWidth:N};this.getActiveP13nModes().forEach(function(i){t.controller[i]=e[i]});if(this.getEnableColumnResize()){t.controller["ColumnWidth"]=e["ColumnWidth"]}this.getEngine().registerAdaptation(this,t)};function et(t){t._updateP13nButton();if(t._oTable){var e=t._oTable.getDragDropConfig()[0];if(e){e.setEnabled(t.getActiveP13nModes().indexOf("Column")>-1)}}if(t.isFilteringEnabled()){ot(t)}it(t)}Z.prototype.setFilterConditions=function(t){this.setProperty("filterConditions",t,true);var e=this.getInbuiltFilter();if(e){e.setFilterConditions(t)}it(this);return this};function it(t){var e=st(t);var i=at(t);var o=lt(t);if(!e){return}if(o.length===0){var n=e.getDomRef();if(n&&n.contains(document.activeElement)){t.focus()}e.setVisible(false);nt(t).setText("");return}t._fullyInitialized().then(function(){var n=t.getPropertyHelper();var r=o.map(function(t){return n.hasProperty(t)?n.getProperty(t).label:""});var s=b.getLibraryResourceBundle("sap.ui.mdc");var a=m.getInstance();var l;if(r.length>1){l=s.getText("table.MULTIPLE_FILTERS_ACTIVE",[r.length,a.format(r)])}else{l=s.getText("table.ONE_FILTER_ACTIVE",r[0])}if(!e.getVisible()){e.setVisible(true)}i.setText(l);nt(t).setText(l)})}function ot(t){if(!t._oTable){return}var e=st(t);var i=nt(t);if(!e){e=rt(t)}t._getType().insertFilterInfoBar(e,i.getId())}function nt(t){if(!t._oFilterInfoBarInvisibleText){t._oFilterInfoBarInvisibleText=(new D).toStatic()}return t._oFilterInfoBarInvisibleText}function rt(t){var e=t.getId()+"-filterInfoBar";var i=J(t).oFilterInfoBar;if(i&&!i.bIsDestroyed){i.destroy()}i=new g({id:e,active:true,design:j.Info,visible:false,content:[new u({id:e+"-text",wrapping:false})],press:[ft,t]});i.focus=function(){if(this.getDomRef()){g.prototype.focus.apply(this,arguments)}else{t.focus()}};J(t).oFilterInfoBar=i;it(t);return i}function st(t){var e=J(t).oFilterInfoBar;if(e&&(e.bIsDestroyed||e.bIsBeingDestroyed)){return null}return J(t).oFilterInfoBar}function at(t){var e=st(t);return e?e.getContent()[0]:null}Z.prototype.setThreshold=function(t){this.setProperty("threshold",t,true);if(!this._oTable){return this}t=this.getThreshold()>-1?this.getThreshold():undefined;if(this._isOfType(k.ResponsiveTable)){this._oTable.setGrowingThreshold(t)}else{this._oTable.setThreshold(t)}return this};Z.prototype._onFilterProvided=function(t){this._updateInnerTableNoData()};Z.prototype._onFilterRemoved=function(t){this._updateInnerTableNoData()};Z.prototype._onFiltersChanged=function(t){if(this.isTableBound()&&t.getParameter("conditionsBased")){this._oTable.setShowOverlay(true)}};Z.prototype._onFilterSearch=function(t){this._bAnnounceTableUpdate=true};Z.prototype.setNoData=function(t){this._vNoData=this.validateAggregation("noData",t,false);if(!this._oTable){return this}if(t&&t.isA&&t.isA("sap.m.IllustratedMessage")){this._sLastNoDataTitle="";t.setEnableVerticalResponsiveness(!this._isOfType(k.ResponsiveTable));var e=this._oTable.getAggregation("_noColumnsMessage");if(!e){var o=i.showPanel.bind(i,this,"Columns");e=f.getNoColumnsIllustratedMessage(o);e.setEnableVerticalResponsiveness(!this._isOfType(k.ResponsiveTable));this._oTable.setAggregation("_noColumnsMessage",e)}}this._oTable.setNoData(t);this._updateInnerTableNoData();return this};Z.prototype.getNoData=function(){return this._vNoData&&!this._vNoData.bIsDestroyed?this._vNoData:null};Z.prototype.destroyNoData=function(){if(this._oTable){this._oTable.destroyNoData(true);this._vNoData=null}return this};Z.prototype._updateInnerTableNoData=function(){var t=this.getNoData();if(!t||typeof t=="string"){return this._updateInnerTableNoDataText()}if(!t.isA("sap.m.IllustratedMessage")||this._sLastNoDataTitle!=t.getTitle()){return}var e=b.getLibraryResourceBundle("sap.ui.mdc");if(!this.isTableBound()){t.setDescription(" ");if(this.getFilter()){t.setTitle(e.getText("table.NO_DATA_WITH_FILTERBAR"));t.setIllustrationType(Q.SearchEarth)}else{t.setIllustrationType(Q.EmptyList);t.setTitle(e.getText("table.NO_DATA"))}}else{if(pt(this)){t.setTitle(e.getText("table.NO_RESULTS_TITLE"));t.setDescription(e.getText("table.NO_RESULTS_DESCRIPTION"));t.setIllustrationType(Q.NoFilterResults)}else{t.setTitle(e.getText("table.NO_DATA")).setDescription(" ");t.setIllustrationType(Q.NoEntries)}}this._sLastNoDataTitle=t.getTitle()};Z.prototype.setNoDataText=function(t){this.setProperty("noDataText",t,true);this._updateInnerTableNoDataText();return this};Z.prototype._updateInnerTableNoDataText=function(){if(this._oTable){this._oTable.setNoData(this._getNoDataText())}};Z.prototype._getNoDataText=function(){var t=this.getNoDataText();if(t){return t}var e=this.getNoData();if(e&&typeof e=="string"){return e}var i=b.getLibraryResourceBundle("sap.ui.mdc");if(!this.isTableBound()){return i.getText(this.getFilter()?"table.NO_DATA_WITH_FILTERBAR":"table.NO_DATA")}if(pt(this)){return i.getText("table.NO_RESULTS")}return i.getText("table.NO_DATA")};Z.prototype._updateRowActions=function(){this._getType().updateRowActions()};Z.prototype._initializeContent=function(){var t=this._getType();var e=[this.awaitControlDelegate(),t.loadModules()];if(this.isFilteringEnabled()){e.push(this.retrieveInbuiltFilter())}Promise.all(e).then(function(){if(this.bIsDestroyed){return}var e=this.getControlDelegate();this._updateAdaptation();if(e.preInit){this._pDelegatePreInit=e.preInit(this)}if(!this._bTableExists&&t.constructor===this._getType().constructor){this._createContent();this._bTableExists=true}}.bind(this)).catch(function(t){this._onAfterTableCreated();throw t}.bind(this))};Z.prototype._doOneTimeOperations=function(){if(!this.bColumnsOrdered){this.bColumnsOrdered=true;this._orderColumns()}};Z.prototype._onAfterTableCreated=function(t){this._oTableReady[t?"resolve":"reject"](this)};Z.prototype._onAfterFullInitialization=function(t){this._oFullInitialize[t?"resolve":"reject"](this)};Z.prototype._createContent=function(){this._createToolbar();this._createTable();this._updateColumnResize();this._updateRowActions();this._updateExportButton();this.getColumns().forEach(this._insertInnerColumn,this);this.setAggregation("_content",this._oTable);this._onAfterTableCreated(true);var t=this.initialized().then(function(){this.initPropertyHelper();var t=this.getCreationRow();if(t){t.update()}if(this.getAutoBindOnInit()){this.rebind()}return this.awaitPropertyHelper()}.bind(this));Promise.all([t,this._pDelegatePreInit]).then(function(){delete this._pDelegatePreInit;this._bFullyInitialized=true;this._onAfterFullInitialization(true)}.bind(this)).catch(function(t){this._onAfterFullInitialization();throw t}.bind(this))};Z.prototype.setHeader=function(t){this.setProperty("header",t,true);this._updateHeaderText();return this};Z.prototype.setHeaderVisible=function(t){this.setProperty("headerVisible",t,true);if(this._oTitle){this._oTitle.setWidth(this.getHeaderVisible()?undefined:"0px")}return this};Z.prototype.setShowRowCount=function(t){this.setProperty("showRowCount",t,true);this._updateHeaderText();return this};Z.prototype.setEnableExport=function(t){this.setProperty("enableExport",t,true);this._updateExportButton();return this};Z.prototype.setShowPasteButton=function(t){if((t=!!t)==this.getShowPasteButton()){return this}this.setProperty("showPasteButton",t,true);if(t&&!this._oPasteButton&&this._oToolbar){this._oToolbar.insertEnd(this._getPasteButton(),0);this._oPasteButton.setEnabled(this.getEnablePaste())}else if(this._oPasteButton){this._oPasteButton.setVisible(t);this._oPasteButton.setEnabled(this.getEnablePaste())}return this};Z.prototype.setEnablePaste=function(t){this.setProperty("enablePaste",t,true);if(this._oPasteButton){this._oPasteButton.setEnabled(this.getEnablePaste())}return this};Z.prototype._setShowP13nButton=function(t){this._bHideP13nButton=!t;this._updateP13nButton()};Z.prototype._createToolbar=function(){if(this.isDestroyStarted()||this.isDestroyed()){return}if(!this._oToolbar){this._oTitle=new p(this.getId()+"-title",{text:this.getHeader(),width:this.getHeaderVisible()?undefined:"0px",level:this.getHeaderLevel()});this._oToolbar=new e(this.getId()+"-toolbar",{design:j.Transparent,begin:[this._oTitle],end:[this._getPasteButton(),this._getP13nButton()]})}this._oToolbar.setStyle(this._isOfType(k.ResponsiveTable)?W.Standard:W.Clear);return this._oToolbar};Z.prototype._getVisibleProperties=function(){var t=[],e;this.getColumns().forEach(function(i,o){e=i&&i.getDataProperty();if(e){t.push({name:e})}});return t};Z.prototype.getConditions=function(){return this.getInbuiltFilter()?this.getInbuiltFilter().getConditions():[]};Z.prototype._getSortedProperties=function(){return this.getSortConditions()?this.getSortConditions().sorters:[]};Z.prototype._getGroupedProperties=function(){return this.getGroupConditions()?this.getGroupConditions().groupLevels:[]};Z.prototype._getAggregatedProperties=function(){return this.getAggregateConditions()?this.getAggregateConditions():{}};Z.prototype._getXConfig=function(){return this.getEngine().readXConfig(this)};function lt(t){return t.isFilteringEnabled()?ht(t.getFilterConditions()):[]}function ut(t){var e=b.byId(t.getFilter());return e?ht(e.getConditions()):[]}function pt(t){var e=b.byId(t.getFilter());return lt(t).length>0||ut(t).length>0||e&&e.getSearch()!==""}function ht(t){return Object.keys(t||{}).filter(function(e){return t[e].length>0})}Z.prototype.getCurrentState=function(){var t={};var e=this.getActiveP13nModes();if(e.indexOf("Column")>-1){t.items=this._getVisibleProperties()}if(this.isSortingEnabled()){t.sorters=this._getSortedProperties()}if(this.isFilteringEnabled()){t.filter=this.getFilterConditions()}if(this.isGroupingEnabled()){t.groupLevels=this._getGroupedProperties()}if(this.isAggregationEnabled()){t.aggregations=this._getAggregatedProperties()}if(this.getEnableColumnResize()){t.xConfig=this._getXConfig()}return t};Z.prototype.isFilteringEnabled=function(){return this.getActiveP13nModes().includes(G.Filter)};Z.prototype.isSortingEnabled=function(){return this.getActiveP13nModes().includes(G.Sort)};Z.prototype.isGroupingEnabled=function(){return this.getActiveP13nModes().includes(G.Group)};Z.prototype.isAggregationEnabled=function(){return this.getActiveP13nModes().includes(G.Aggregate)};Z.prototype.getSupportedP13nModes=function(){var t=dt(Object.keys(G),this._getType().getSupportedP13nModes());if(this.bDelegateInitialized){t=dt(t,this.getControlDelegate().getSupportedP13nModes(this))}return t};Z.prototype.getActiveP13nModes=function(){return dt(this.getP13nMode(),this.getSupportedP13nModes())};function dt(t,e){return t.filter(function(t){return e.includes(t)})}Z.prototype._getP13nButton=function(){if(!this._oP13nButton){this._oP13nButton=i.createSettingsButton(this.getId(),[ct,this])}this._updateP13nButton();return this._oP13nButton};Z.prototype._updateP13nButton=function(){if(this._oP13nButton){var t=this.getActiveP13nModes();var e=t.length===1&&t[0]==="Aggregate";this._oP13nButton.setVisible(t.length>0&&!e&&!this._bHideP13nButton)}};Z.prototype._getPasteButton=function(){if(this.getShowPasteButton()){if(!this._oPasteButton){this._oPasteButton=i.createPasteButton(this.getId())}return this._oPasteButton}};Z.prototype._isExportEnabled=function(){return this.getEnableExport()&&this.bDelegateInitialized&&this.getControlDelegate().isExportSupported(this)};Z.prototype._updateExportButton=function(){var t=this._oToolbar!=null&&this._isExportEnabled();if(t&&!this._oExportButton){this._oExportButton=this._createExportButton()}if(!this._oExportButton){return}if(this._oToolbar&&!this._oToolbar.getEnd().includes(this._oExportButton)){this._oToolbar.addEnd(this._oExportButton)}this._oExportButton.setEnabled(this._getRowCount(false)>0);this._oExportButton.setVisible(this._isExportEnabled())};Z.prototype._createExportButton=function(){return i.createExportButton(this.getId(),{default:[function(){this._onExport()},this],exportAs:[function(){this._onExport(true)},this]})};Z.prototype._createExportColumnConfiguration=function(){var t=this.getColumns();return this._fullyInitialized().then(function(){var e=this.getPropertyHelper();var i=[];t.forEach(function(t){var o=e.getColumnExportSettings(t);i=i.concat(o)},this);return i}.bind(this))};Z.prototype._getColumnLabel=function(t){var e=this.getPropertyHelper();var i=e.getProperty(t);return i&&i.label};Z.prototype._onExport=function(t){var e=this;return this._createExportColumnConfiguration().then(function(i){if(!i||!i.length){sap.ui.require(["sap/m/MessageBox"],function(t){t.error(b.getLibraryResourceBundle("sap.ui.mdc").getText("table.NO_COLS_EXPORT"),{styleClass:this.$()&&this.$().closest(".sapUiSizeCompact").length?"sapUiSizeCompact":""})}.bind(e));return}var o=e.getRowBinding();var n=e._getColumnLabel.bind(e);var r={workbook:{columns:i,context:{title:e.getHeader()}},dataSource:o,fileName:e.getHeader()};e._loadExportLibrary().then(function(){sap.ui.require(["sap/ui/export/ExportHandler"],function(i){var o;e.getControlDelegate().fetchExportCapabilities(e).then(function(s){if(!e._oExportHandler){o=new i(s);o.attachBeforeExport(function(t){e.fireBeforeExport({exportSettings:t.getParameter("exportSettings"),userExportSettings:t.getParameter("userExportSettings")})});e._oExportHandler=o}if(t){e._oExportHandler.exportAs(r,n)}else{e._oExportHandler.export(r,n)}})})})})};Z.prototype._loadExportLibrary=function(){if(!this._oExportLibLoadPromise){this._oExportLibLoadPromise=b.loadLibrary("sap.ui.export",true)}return this._oExportLibLoadPromise};Z.prototype.onkeydown=function(t){if(t.isMarked()){return}if((t.metaKey||t.ctrlKey)&&t.shiftKey&&t.which===C.E){if(this._oExportButton&&this._oExportButton.getEnabled()&&this._isExportEnabled()){this._onExport(true);t.setMarked();t.preventDefault()}}if((t.metaKey||t.ctrlKey)&&t.which===C.COMMA){if(this._oP13nButton&&this._oP13nButton.getVisible()){this._oP13nButton.firePress();t.setMarked();t.preventDefault()}}};Z.prototype._createTable=function(){var t=this._getType();this._oTable=t.createTable(this.getId()+"-innerTable");this._oRowTemplate=t.createRowTemplate(this.getId()+"-innerTableRow");t.updateTable();if(this.getNoData()){this.setNoData(this.getNoData())}if(this.isFilteringEnabled()){ot(this)}};Z.prototype._updateColumnResize=function(){var t=this._getType();if(this.getEnableColumnResize()){t.enableColumnResize()}else{t.disableColumnResize()}};Z.prototype._onColumnMove=function(t){i.moveColumn(this,t.column,t.newIndex)};Z.prototype._onColumnPress=function(t){if(this._bSuppressOpenMenu){return}var e=t.column;this._fullyInitialized().then(function(){if(this._bUseColumnMenu){if(!this._oColumnHeaderMenu){this._oQuickActionContainer=new z({table:this});this._oItemContainer=new H({table:this});this._oColumnHeaderMenu=new _({_quickActions:[this._oQuickActionContainer],_items:[this._oItemContainer]})}this._oQuickActionContainer.setAssociation("column",e);this._oItemContainer.setAssociation("column",e);Promise.all([this._oQuickActionContainer.initializeQuickActions(),this._oItemContainer.initializeItems()]).then(function(){if(this._oQuickActionContainer.hasQuickActions()||this._oItemContainer.hasItems()){this._oColumnHeaderMenu.openBy(e)}}.bind(this))}else{var t=b.getLibraryResourceBundle("sap.ui.mdc");if(this._oPopover){this._oPopover.destroy()}this._oPopover=new h;e.getInnerColumn().addDependent(this._oPopover);if(this.isSortingEnabled()){var i=[],o=[];var n=this.getPropertyHelper().getProperty(e.getDataProperty()).getSortableProperties();n.forEach(function(t){i.push(new T({text:t.label,key:t.name}));o.push(new T({text:t.label,key:t.name}))});if(i.length>0){this._oPopover.addItem(new d({items:i,label:t.getText("table.SETTINGS_ASCENDING"),icon:"sap-icon://sort-ascending",action:[X.Ascending,this._onCustomSort,this]}));this._oPopover.addItem(new d({items:o,label:t.getText("table.SETTINGS_DESCENDING"),icon:"sap-icon://sort-descending",action:[X.Descending,this._onCustomSort,this]}))}}if(this.isFilteringEnabled()){var r=this.getPropertyHelper().getProperty(e.getDataProperty()).getFilterableProperties();if(r.length>0){this._oPopover.addItem(new d({label:t.getText("table.SETTINGS_FILTER"),icon:"sap-icon://filter",action:[r,ft,this]}))}}var s=this.getControlDelegate();var a=s.addColumnMenuItems&&s.addColumnMenuItems(this,e)||[];a.forEach(function(t){this._oPopover.addItem(t)},this);if(this.getEnableColumnResize()){this._oPopover.addItem(this._getType().createColumnResizeMenuItem(e,this._oPopover))}if(this._oPopover.getItems().length>0){this._oPopover.openBy(e)}else{this._oPopover.destroy();this._oPopover=null}}}.bind(this))};Z.prototype._onCustomSort=function(t,e){var o=t.getParameter("property");this.getCurrentState().sorters.forEach(function(t){if(t.name===o){if(t.descending&&e===X.Descending||!t.descending&&e===X.Ascending){e=X.None}}});i.createSort(this,o,e,true)};Z.prototype._onRowPress=function(t){if(this.getSelectionMode()!==U.SingleMaster){this.fireRowPress({bindingContext:t.bindingContext})}};Z.prototype._onSelectionChange=function(t){if(!this._bSelectionChangedByAPI){this.fireSelectionChange({bindingContext:t.bindingContext,selected:t.selected,selectAll:t.selectAll})}};Z.prototype._onColumnResize=function(t){i.createColumnWidth(this,t.column.getDataProperty(),t.width)};Z.prototype._onCustomGroup=function(t){i.createGroup(this,t)};Z.prototype._onCustomAggregate=function(t){i.createAggregation(this,t)};Z.prototype._insertInnerColumn=function(t,e){if(!this._oTable){return}var i=t.getInnerColumn();this._setMobileColumnTemplate(t,e);this._bForceRebind=true;if(e===undefined){this._oTable.addColumn(i)}else{this._oTable.insertColumn(i,e)}};Z.prototype._orderColumns=function(){var t,e=[],i=this.getColumns();i.forEach(function(i){t=i.getInitialIndex();if(t>-1){e.push({index:t,column:this.removeColumn(i)})}},this);e.sort(function(t,e){return t-e});e.forEach(function(t){this.insertColumn(t.column,t.index)},this)};Z.prototype.moveColumn=function(t,e){t._bIsBeingMoved=true;this.removeAggregation("columns",t,true);this.insertAggregation("columns",t,e,true);delete t._bIsBeingMoved;if(this._oTable){var i=t.getInnerColumn();this._oTable.removeColumn(i);this._oTable.insertColumn(i,e);this._updateMobileColumnTemplate(t,e)}};Z.prototype.removeColumn=function(t){t=this.removeAggregation("columns",t,true);this._updateMobileColumnTemplate(t,-1);return t};Z.prototype.addColumn=function(t){this.addAggregation("columns",t,true);this._insertInnerColumn(t);return this};Z.prototype.insertColumn=function(t,e){this.insertAggregation("columns",t,e,true);this._insertInnerColumn(t,e);return this};Z.prototype._setMobileColumnTemplate=function(t,e){if(!this._oRowTemplate){return}var i=t.getTemplateClone();if(e>=0){this._oRowTemplate.insertCell(i,e);this._oTable.getItems().forEach(function(t){if(t.isA("sap.m.GroupHeaderListItem")){return}t.insertAggregation("cells",new D,e,true)})}else{this._oRowTemplate.addCell(i)}};Z.prototype._updateMobileColumnTemplate=function(t,e){if(!this._oRowTemplate){return}var i,o;if(this._oRowTemplate){i=t.getTemplateClone();o=this._oRowTemplate.indexOfCell(i);gt(this._oRowTemplate,o,e)}if(o>-1){this._oTable.getItems().forEach(function(t){if(t.removeCell){gt(t,o,e)}})}};function gt(t,e,i){var o=t.removeCell(e);if(o){if(i>-1){t.insertCell(o,i)}else{o.destroy()}}}Z.prototype.getSelectedContexts=function(){if(this._oTable){if(this._isOfType(k.ResponsiveTable)){return this._oTable.getSelectedContexts()}var t=this._oTable.getPlugins()[0].getSelectedIndices();return t.map(function(t){return this._oTable.getContextByIndex(t)},this)}return[]};Z.prototype.clearSelection=function(){if(this._oTable){if(this._isOfType(k.ResponsiveTable)){this._oTable.removeSelections(true)}else{this._bSelectionChangedByAPI=true;this._oTable.getPlugins()[0].clearSelection();this._bSelectionChangedByAPI=false}}};Z.prototype._registerInnerFilter=function(t){t.attachSearch(function(){this._rebind()},this)};Z.prototype.isTableBound=function(){return this._getType().isTableBound()};Z.prototype.bindRows=function(){if(!this.bDelegateInitialized||!this._oTable){return}var t={};this.getControlDelegate().updateBindingInfo(this,t);if(t.path){this._oTable.setShowOverlay(false);if(this._oRowTemplate){t.template=this._oRowTemplate}else{delete t.template}Z._addBindingListener(t,"dataRequested",this._onDataRequested.bind(this));Z._addBindingListener(t,"dataReceived",this._onDataReceived.bind(this));Z._addBindingListener(t,"change",this._onBindingChange.bind(this));this._updateColumnsBeforeBinding();this.getControlDelegate().updateBinding(this,t,this._bForceRebind?null:this.getRowBinding());this._updateInnerTableNoData();this._bForceRebind=false}};Z.prototype._onDataRequested=function(){this._bIgnoreChange=true};Z.prototype._onDataReceived=function(){this._bIgnoreChange=false;this._updateTableHeaderState()};Z.prototype._onBindingChange=function(){this._updateExportButton();if(this._bIgnoreChange){return}this._updateTableHeaderState()};Z.prototype._updateTableHeaderState=function(){this._updateHeaderText()};Z.prototype._updateHeaderText=function(){var t,e;if(!this._oNumberFormatInstance){this._oNumberFormatInstance=y.getFloatInstance()}if(this._oTitle&&this.getHeader()){t=this.getHeader();if(this.getShowRowCount()){e=this._getRowCount(true);if(e>0){var i=this._oNumberFormatInstance.format(e);t+=" ("+i+")"}}this._oTitle.setText(t)}if(!this._bIgnoreChange&&this._bAnnounceTableUpdate){this._bAnnounceTableUpdate=false;this._announceTableUpdate(e)}};Z.prototype._announceTableUpdate=function(t){var e=S.getInstance();if(e){var i=b.getLibraryResourceBundle("sap.ui.mdc");var o=this.getHeader();if(t===undefined&&this._getRowCount(false)>0){e.announce(i.getText("table.ANNOUNCEMENT_TABLE_UPDATED",[o]))}else if(t>1){e.announce(i.getText("table.ANNOUNCEMENT_TABLE_UPDATED_MULT",[o,t]))}else if(t===1){e.announce(i.getText("table.ANNOUNCEMENT_TABLE_UPDATED_SING",[o,t]))}else{e.announce(i.getText("table.ANNOUNCEMENT_TABLE_UPDATED_NOITEMS",[o]))}}};Z.prototype._updateColumnsBeforeBinding=function(){var t=this.getColumns();var e=this.getPropertyHelper();t.forEach(function(t){var i=e.getProperty(t.getDataProperty());var o=i?i.getSortableProperties().map(function(t){return t.name}):[];var n=this._getSortedProperties().find(function(t){return o.includes(t.name)});var r=X.None;if(n){r=n.descending?X.Descending:X.Ascending}this._getType().updateSortIndicator(t,r)},this)};Z.prototype._getRowCount=function(t){var e=this.getRowBinding();if(!e){return t?undefined:0}var i;if(!t){i=e.getLength()}else if(typeof e.getCount==="function"){i=e.getCount()}else if(e.isLengthFinal()){i=e.getLength()}if(i<0||i==="0"){i=0}return i};Z.prototype.getRowBinding=function(){return this._getType().getRowBinding()};Z.prototype._getRowBinding=function(){V.error(this+": The method '_getRowBinding' must not be used will be deleted soon. Use 'getRowBinding' instead.");return this.getRowBinding()};Z._addBindingListener=function(t,e,i){if(!t.events){t.events={}}if(!t.events[e]){t.events[e]=i}else{var o=t.events[e];t.events[e]=function(){i.apply(this,arguments);o.apply(this,arguments)}}};Z.prototype._rebind=function(){if(this._bFullyInitialized){this.bindRows()}else{this._fullyInitialized().then(this._rebind.bind(this))}};function ct(t){i.showPanel(this,"Columns")}function ft(t,e){i.showPanel(this,"Filter",e)}Z.prototype._getSorters=function(){var t=this.getSortConditions()?this.getSortConditions().sorters:[];var e=[],i=this.getPropertyHelper();t.forEach(function(t){if(i.hasProperty(t.name)){var o=i.getProperty(t.name).path;e.push(new I(o,t.descending))}});return e};Z.prototype._onPaste=function(t){if(this.getEnablePaste()){this.firePaste({data:t.data})}};Z.prototype.invalidate=function(e){if(e==="InvalidationSuppressedByMDCFlex"&&this._oTable){this._oTable.invalidate()}t.prototype.invalidate.apply(this,arguments)};Z.prototype.exit=function(){this._destroyDefaultType();if(this._oRowTemplate){this._oRowTemplate.destroy()}this._oRowTemplate=null;this._oTable=null;if(this._oToolbar&&!this._bTableExists){this._oToolbar.destroy()}this._oToolbar=null;this._oTitle=null;this._vNoData=null;this._oNumberFormatInstance=null;tt.forEach(function(t){var e=P(t),i="_o"+e;this[i]=null},this);this._oTableReady=null;this._oFullInitialize=null;this._oPasteButton=null;this._oP13nButton=null;if(this._oFilterInfoBarInvisibleText){this._oFilterInfoBarInvisibleText.destroy();this._oFilterInfoBarInvisibleText=null}t.prototype.exit.apply(this,arguments)};Z.prototype.addAction=function(e){if(e.getMetadata().getName()!=="sap.ui.mdc.actiontoolbar.ActionToolbarAction"){e=new L(e.getId()+"-action",{action:e})}return t.prototype.addAggregation.apply(this,["actions",e])};Z.prototype.onThemeChanged=function(){if(this._oExportButton){var t=c.ButtonType[O.get({name:"_sap_ui_mdc_Table_ExportButtonType"})];this._oExportButton.setType(t)}};return Z});