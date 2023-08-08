/*
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["../library","../utils/TableUtils","./RowMode","sap/ui/Device","sap/ui/thirdparty/jquery"],function(t,e,o,i,a){"use strict";var s=e.createWeakMapFacade();var n=o.extend("sap.ui.table.rowmodes.AutoRowMode",{metadata:{library:"sap.ui.table",properties:{minRowCount:{type:"int",defaultValue:5,group:"Appearance"},maxRowCount:{type:"int",defaultValue:-1,group:"Appearance"},fixedTopRowCount:{type:"int",defaultValue:0,group:"Appearance"},fixedBottomRowCount:{type:"int",defaultValue:0,group:"Appearance"},rowContentHeight:{type:"int",defaultValue:0,group:"Appearance"},hideEmptyRows:{type:"boolean",defaultValue:false,group:"Appearance"}}},constructor:function(t){Object.defineProperty(this,"bLegacy",{value:typeof t==="boolean"?t:false});o.apply(this,arguments)}});var r={};function l(t){var e=t.getTable();var o=e?e.getDomRef("tableCCnt"):null;if(o&&i.browser.chrome&&window.devicePixelRatio!==1){var a=document.createElement("table");var s=a.insertRow();var n=t.getRowContentHeight();var r;a.classList.add("sapUiTableCtrl");s.classList.add("sapUiTableTr");if(n>0){s.style.height=t.getBaseRowHeightOfTable()+"px"}o.appendChild(a);r=s.getBoundingClientRect().height;o.removeChild(a);return r}else{return t.getBaseRowHeightOfTable()}}n.prototype.init=function(){o.prototype.init.apply(this,arguments);s(this).iPendingStartTableUpdateSignals=0;s(this).bRowCountAutoAdjustmentActive=false;s(this).iLastAvailableSpace=0;s(this).rowCount=-1;s(this).bTableIsFlexItem=false;s(this).adjustRowCountToAvailableSpaceAsync=e.throttleFrameWise(this.adjustRowCountToAvailableSpace.bind(this))};n.prototype.attachEvents=function(){o.prototype.attachEvents.apply(this,arguments);e.addDelegate(this.getTable(),r,this)};n.prototype.detachEvents=function(){o.prototype.detachEvents.apply(this,arguments);e.removeDelegate(this.getTable(),r)};n.prototype.cancelAsyncOperations=function(){o.prototype.cancelAsyncOperations.apply(this,arguments);this.stopAutoRowMode()};n.prototype.registerHooks=function(){o.prototype.registerHooks.apply(this,arguments);e.Hook.register(this.getTable(),e.Hook.Keys.Table.RefreshRows,this._onTableRefreshRows,this);e.Hook.register(this.getTable(),e.Hook.Keys.Table.UpdateSizes,this._onUpdateTableSizes,this)};n.prototype.deregisterHooks=function(){o.prototype.deregisterHooks.apply(this,arguments);e.Hook.deregister(this.getTable(),e.Hook.Keys.Table.RefreshRows,this._onTableRefreshRows,this);e.Hook.deregister(this.getTable(),e.Hook.Keys.Table.UpdateSizes,this._onUpdateTableSizes,this)};n.prototype.getFixedTopRowCount=function(){if(this.bLegacy){var t=this.getTable();return t?t.getFixedRowCount():0}return this.getProperty("fixedTopRowCount")};n.prototype.getFixedBottomRowCount=function(){if(this.bLegacy){var t=this.getTable();return t?t.getFixedBottomRowCount():0}return this.getProperty("fixedBottomRowCount")};n.prototype.getMinRowCount=function(){if(this.bLegacy){var t=this.getTable();return t?t.getMinAutoRowCount():0}return this.getProperty("minRowCount")};n.prototype.getRowContentHeight=function(){if(this.bLegacy){var t=this.getTable();return t?t.getRowHeight():0}return this.getProperty("rowContentHeight")};n.prototype.setHideEmptyRows=function(t){this.setProperty("hideEmptyRows",t);if(t){this.disableNoData()}else{this.enableNoData()}return this};n.prototype._getMinRowCount=function(){var t=this.getMinRowCount();var e=this.getMaxRowCount();if(e>=0){return Math.min(t,e)}else{return t}};n.prototype.getMinRequestLength=function(){var t=this.getTable();var o=this.getConfiguredRowCount();if(p(this)||t&&!t._bContextsAvailable){var a=Math.ceil(i.resize.height/e.DefaultRowHeight.sapUiSizeCondensed);o=Math.max(o,a)}return o};n.prototype.updateTableRows=function(){if(this.getHideEmptyRows()&&this.getComputedRowCounts().count===0){var t=this.getConfiguredRowCount();if(t>0){return this.getRowContexts(t).length>0}}else{return o.prototype.updateTableRows.call(this)}};n.prototype.getComputedRowCounts=function(){if(p(this)){return{count:0,scrollable:0,fixedTop:0,fixedBottom:0}}var t=this.getConfiguredRowCount();var e=this.getFixedTopRowCount();var o=this.getFixedBottomRowCount();if(this.getHideEmptyRows()){t=Math.min(t,this.getTotalRowCountOfTable())}return this.computeStandardizedRowCounts(t,e,o)};n.prototype.getTableStyles=function(){var t="0px";if(p(this)){t="auto"}else{var e=this.getConfiguredRowCount();if(e===0||e===this._getMinRowCount()){t="auto"}}return{height:t}};n.prototype.getTableBottomPlaceholderStyles=function(){if(!this.getHideEmptyRows()){return undefined}var t;if(p(this)){t=this._getMinRowCount()}else{t=this.getConfiguredRowCount()-this.getComputedRowCounts().count}return{height:t*this.getBaseRowHeightOfTable()+"px"}};n.prototype.getRowContainerStyles=function(){return{height:this.getComputedRowCounts().count*Math.max(this.getBaseRowHeightOfTable(),l(this))+"px"}};n.prototype.renderRowStyles=function(t){var e=this.getRowContentHeight();if(e>0){t.style("height",this.getBaseRowHeightOfTable()+"px")}};n.prototype.renderCellContentStyles=function(t){var e=this.getRowContentHeight();if(!this.bLegacy&&e<=0){e=this.getDefaultRowContentHeightOfTable()}if(e>0){t.style("max-height",e+"px")}};n.prototype.getBaseRowContentHeight=function(){return Math.max(0,this.getRowContentHeight())};n.prototype._onTableRefreshRows=function(){var t=this.getConfiguredRowCount();if(t>0){if(!p(this)){this.initTableRowsAfterDataRequested(t)}this.getRowContexts(t)}};n.prototype.getConfiguredRowCount=function(){var t=Math.max(0,this.getMinRowCount(),s(this).rowCount);var e=this.getMaxRowCount();if(e>=0){t=Math.min(t,e)}return t};n.prototype.startAutoRowMode=function(){s(this).adjustRowCountToAvailableSpaceAsync(e.RowsUpdateReason.Render,true)};n.prototype.stopAutoRowMode=function(){this.deregisterResizeHandler();s(this).adjustRowCountToAvailableSpaceAsync.cancel();s(this).bRowCountAutoAdjustmentActive=false;h(this)};n.prototype.registerResizeHandler=function(t){var o=this.getTable();if(o){e.registerResizeHandler(o,"AutoRowMode",this.onResize.bind(this),null,t===true);e.registerResizeHandler(o,"AutoRowMode-BeforeTable",this.onResize.bind(this),"before");e.registerResizeHandler(o,"AutoRowMode-AfterTable",this.onResize.bind(this),"after")}};n.prototype.deregisterResizeHandler=function(){var t=this.getTable();if(t){e.deregisterResizeHandler(t,["AutoRowMode, AutoRowMode-BeforeTable, AutoRowMode-AfterTable"])}};n.prototype.onResize=function(t){var o=t.oldSize.height;var i=t.size.height;if(o!==i){u(this);s(this).adjustRowCountToAvailableSpaceAsync(e.RowsUpdateReason.Resize)}};n.prototype._onUpdateTableSizes=function(t){if(t===e.RowsUpdateReason.Resize||t===e.RowsUpdateReason.Render){return}if(s(this).bRowCountAutoAdjustmentActive){u(this);s(this).adjustRowCountToAvailableSpaceAsync(t)}};n.prototype.adjustRowCountToAvailableSpace=function(t,o){o=o===true;var i=this.getTable();var a=i?i.getDomRef():null;if(!i||i._bInvalid||!a||!sap.ui.getCore().isThemeApplied()){h(this);return}s(this).bTableIsFlexItem=window.getComputedStyle(a.parentNode).display==="flex";if(a.scrollHeight===0){if(o){this.registerResizeHandler(!s(this).bTableIsFlexItem);s(this).bRowCountAutoAdjustmentActive=true}h(this);return}var n=this.determineAvailableSpace();var r=this.getConfiguredRowCount();var u=Math.floor(n/l(this));var p=this.getComputedRowCounts().count;var g;s(this).rowCount=u;g=this.getComputedRowCounts().count;if(this.bLegacy){i.setProperty("visibleRowCount",g,true)}if(p!==g){this.updateTable(t)}else{if(r!==u||t===e.RowsUpdateReason.Zoom){this.applyTableStyles();this.applyRowContainerStyles();this.applyTableBottomPlaceholderStyles()}if(!this._bFiredRowsUpdatedAfterRendering&&i.getRows().length>0){this.fireRowsUpdated(t)}}if(o){this.registerResizeHandler(!s(this).bTableIsFlexItem);s(this).bRowCountAutoAdjustmentActive=true}h(this)};n.prototype.determineAvailableSpace=function(){var t=this.getTable();var e=t?t.getDomRef():null;var o=t?t.getDomRef("tableCCnt"):null;var n=t?t.getDomRef("placeholder-bottom"):null;if(!e||!o||!e.parentNode){return 0}var r=0;var l=o.clientHeight;var u=n?n.clientHeight:0;if(s(this).bTableIsFlexItem){var h=e.childNodes;for(var p=0;p<h.length;p++){r+=h[p].offsetHeight}r-=l-u}else{r=e.scrollHeight-l-u}var g=t._getScrollExtension();if(!g.isHorizontalScrollbarVisible()){var d={};d[i.browser.BROWSER.CHROME]=16;d[i.browser.BROWSER.FIREFOX]=16;d[i.browser.BROWSER.SAFARI]=16;d[i.browser.BROWSER.ANDROID]=8;r+=d[i.browser.name]}var R=s(this).bTableIsFlexItem?e:e.parentNode;var f=Math.max(0,Math.floor(a(R).height()-r));var b=Math.abs(f-s(this).iLastAvailableSpace);if(b>=5){s(this).iLastAvailableSpace=f}return s(this).iLastAvailableSpace};r.onBeforeRendering=function(t){var e=t&&t.isMarked("renderRows");if(!e){this.stopAutoRowMode()}};r.onAfterRendering=function(t){var e=t&&t.isMarked("renderRows");if(!e){this.startAutoRowMode()}};function u(t){s(t).iPendingStartTableUpdateSignals++;e.Hook.call(t.getTable(),e.Hook.Keys.Signal,"StartTableUpdate")}function h(t){for(var o=0;o<s(t).iPendingStartTableUpdateSignals;o++){e.Hook.call(t.getTable(),e.Hook.Keys.Signal,"EndTableUpdate")}s(t).iPendingStartTableUpdateSignals=0}function p(t){return s(t).rowCount===-1}return n});