/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ExtensionBase","../utils/TableUtils","../library"],function(e,t,r){"use strict";var i=r.SelectionMode;var o=function(e,t,r,i,o){o=o||[];o.push("sapUiInvisibleText");e.openStart("span",t+"-"+r);o.forEach(function(t){e.class(t)});e.attr("aria-hidden","true");e.openEnd();if(i){e.text(i)}e.close("span")};var a=e.extend("sap.ui.table.extensions.AccessibilityRender",{_init:function(e,t,r){return"AccRenderExtension"},writeHiddenAccTexts:function(e,r){if(!r._getAccExtension().getAccMode()){return}var a=r.getId();e.openStart("div");e.class("sapUiTableHiddenTexts");e.style("display","none");e.attr("aria-hidden","true");e.openEnd();o(e,a,"ariacount");o(e,a,"toggleedit",t.getResourceText("TBL_TOGGLE_EDIT_KEY"));var c=t.areAllRowsSelected(r);var n=r._getSelectionPlugin().getRenderConfig();var s;if(n.headerSelector.type==="toggle"){s=c?"TBL_DESELECT_ALL":"TBL_SELECT_ALL"}else if(n.headerSelector.type==="clear"){s="TBL_DESELECT_ALL"}o(e,a,"ariaselectall",t.getResourceText(s));o(e,a,"ariarowgrouplabel",t.getResourceText("TBL_ROW_GROUP_LABEL"));o(e,a,"ariagrandtotallabel",t.getResourceText("TBL_GRAND_TOTAL_ROW"));o(e,a,"ariagrouptotallabel",t.getResourceText("TBL_GROUP_TOTAL_ROW"));o(e,a,"rownumberofrows");o(e,a,"colnumberofcols");o(e,a,"cellacc");o(e,a,"ariacolmenu",t.getResourceText("TBL_COL_DESC_MENU"));o(e,a,"ariacolspan");o(e,a,"ariacolfiltered",t.getResourceText("TBL_COL_DESC_FILTERED"));o(e,a,"ariacolsortedasc",t.getResourceText("TBL_COL_DESC_SORTED_ASC"));o(e,a,"ariacolsorteddes",t.getResourceText("TBL_COL_DESC_SORTED_DES"));o(e,a,"ariainvalid",t.getResourceText("TBL_TABLE_INVALID"));o(e,a,"ariashowcolmenu",t.getResourceText("TBL_COL_VISBILITY_MENUITEM_SHOW"));o(e,a,"ariahidecolmenu",t.getResourceText("TBL_COL_VISBILITY_MENUITEM_HIDE"));o(e,a,"rowexpandtext",t.getResourceText("TBL_ROW_EXPAND_KEY"));o(e,a,"rowcollapsetext",t.getResourceText("TBL_ROW_COLLAPSE_KEY"));o(e,a,"ariarequired",t.getResourceText("TBL_COL_REQUIRED"));var T=r.getSelectionMode();if(T!==i.None){o(e,a,"ariaselection",t.getResourceText(T==i.MultiToggle?"TBL_TABLE_SELECTION_MULTI":"TBL_TABLE_SELECTION_SINGLE"))}if(r.getComputedFixedColumnCount()>0){o(e,a,"ariafixedcolumn",t.getResourceText("TBL_FIXED_COLUMN"))}if(t.hasRowNavigationIndicators(r)){o(e,a,"rownavigatedtext",t.getResourceText("TBL_ROW_STATE_NAVIGATED"))}e.close("div")},writeAriaAttributesFor:function(e,t,r,i){var o=t._getAccExtension();if(!o.getAccMode()){return}var a=o.getAriaAttributesFor(r,i);var c,n;for(n in a){c=a[n];if(Array.isArray(c)){c=c.join(" ")}if(c){e.attr(n.toLowerCase(),c)}}},writeAccRowSelectorText:function(e,t,r,i){if(!t._getAccExtension().getAccMode()){return}var a=t._getSelectionPlugin().isIndexSelected(i);var c=t._getAccExtension().getAriaTextsForSelectionMode(true);var n=c.keyboard[a?"rowDeselect":"rowSelect"];if(!r.isGroupHeader()&&!r.isSummary()){o(e,r.getId(),"rowselecttext",r.isEmpty()?"":n,["sapUiTableAriaRowSel"])}},writeAccRowHighlightText:function(e,t,r,i){if(!t._getAccExtension().getAccMode()){return}var a=r.getAggregation("_settings");var c=a._getHighlightText();o(e,r.getId(),"highlighttext",c)},writeAccCreationRowText:function(e,r,i){if(!r._getAccExtension().getAccMode()){return}o(e,i.getId(),"label",t.getResourceText("TBL_CREATEROW_LABEL"))}});return a});