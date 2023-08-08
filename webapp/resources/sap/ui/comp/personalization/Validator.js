/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/comp/library","sap/m/library","sap/ui/core/library"],function(e,r,s){"use strict";var n=s.MessageType;var o=r.P13nPanelType;var a=e.personalization.TableType;var i={checkGroupAndColumns:function(e,r,s,i,t){if(e!==a.AnalyticalTable||!r.group||!r.columns){return Promise.resolve(t)}for(var u in s){var l=r.columns.controller.isColumnSelected(i.columns,u);var c=r.group.controller.isGroupSelected(i.group,u);if(c&&!l){t.push({columnKey:u,panelTypes:[o.group,o.columns],messageType:n.Warning,messageText:sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("PERSODIALOG_MSG_GROUPING_NOT_POSSIBLE_DESCRIPTION")})}}return Promise.resolve(t)},checkSaveChanges:function(e,r,s,i){if(e!==a.SelectionWrapper){return Promise.resolve(i)}return r.selection.payload.callbackSaveChanges(s).then(function(e){if(e){return i}i.push({panelTypes:[o.selection],messageType:n.Error,messageText:sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("PERSODIALOG_MSG_CHANGES_SAVE_FAILED")});return i})},checkChartConsistency:function(e,r,s,i){if(e!==a.ChartWrapper){return Promise.resolve(i)}return r.dimeasure.controller.isChartConsistent(s).then(function(e){if(!e){i.push({panelTypes:[o.dimeasure],messageType:n.Error,messageText:sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("PERSODIALOG_MSG_VALIDATION_CHARTTYPE")})}return i})},checkVisibleItemsThreshold:function(e,r,s,a){if(!r.columns){return Promise.resolve(a)}var i=-1;if(r.columns.payload&&r.columns.payload.visibleItemsThreshold){i=r.columns.payload.visibleItemsThreshold}var t=s.columns.columnsItems.filter(function(e){return e.visible}).length;if(i>-1&&t>i){a.push({panelTypes:[o.columns],messageType:n.Warning,messageText:sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_P13N_VISIBLE_ITEMS_THRESHOLD_MESSAGE")})}return Promise.resolve(a)}};return i},true);