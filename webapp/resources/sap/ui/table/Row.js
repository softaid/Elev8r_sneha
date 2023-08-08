/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Element","./utils/TableUtils","sap/ui/thirdparty/jquery"],function(t,e,o){"use strict";var n=Object.freeze({Standard:"Standard",Summary:"Summary",GroupHeader:"GroupHeader"});function i(){var t=null;var e=n.Standard;var o=false;var i="";var r=false;var a=false;var l=0;Object.defineProperties(this,{context:{get:function(){return t},set:function(e){t=e||null}},Type:{get:function(){return n}},type:{get:function(){return e},set:function(t){if(!(t in n)){throw Error("Is not a valid type for sap.ui.table.Row: "+t)}e=t}},empty:{get:function(){return this.context==null}},contentHidden:{get:function(){return this.empty?true:o},set:function(t){o=t===true}},title:{get:function(){return this.empty?"":i},set:function(t){i=typeof t==="string"?t:""}},expandable:{get:function(){return this.empty?false:a},set:function(t){a=t===true}},expanded:{get:function(){return this.expandable?r:false},set:function(t){r=t===true}},level:{get:function(){return this.empty?0:l},set:function(t){l=typeof t==="number"?Math.max(1,t||1):1}},reset:{value:function(){t=null;e=n.Standard;o=false;i="";a=false;r=false;l=1}}})}var r=new window.WeakMap;function a(t){if(!r.has(t)){r.set(t,Object.seal(new i))}return r.get(t)}var l=t.extend("sap.ui.table.Row",{metadata:{library:"sap.ui.table",defaultAggregation:"cells",aggregations:{cells:{type:"sap.ui.core.Control",multiple:true,singularName:"cell"},_rowAction:{type:"sap.ui.table.RowAction",multiple:false,visibility:"hidden"},_settings:{type:"sap.ui.table.RowSettings",multiple:false,visibility:"hidden"}}}});l.prototype.init=function(){this.initDomRefs()};l.prototype.exit=function(){this.initDomRefs()};l.prototype.getFocusInfo=function(){var e=this.getTable();return e?e.getFocusInfo():t.prototype.getFocusInfo.apply(this,arguments)};l.prototype.applyFocusInfo=function(e){var o=this.getTable();if(o){o.applyFocusInfo(e)}else{t.prototype.applyFocusInfo.apply(this,arguments)}return this};l.prototype._setFocus=function(t){var o=e.getFirstInteractiveElement(this);if(t===true&&o){o.focus()}else{this.getDomRef("col0").focus()}};l.prototype.addStyleClass=function(t){this.getDomRefs(true).row.addClass(t)};l.prototype.removeStyleClass=function(t){this.getDomRefs(true).row.removeClass(t)};l.prototype.initDomRefs=function(){this._mDomRefs={}};l.prototype.getIndex=function(){var t=this.getTable();if(!t){return-1}var e=t.indexOfRow(this);var o=t._getRowCounts();if(o.fixedTop>0&&e<o.fixedTop){return e}if(o.fixedBottom>0&&e>=o.count-o.fixedBottom){var n=t._getTotalRowCount();if(n>=o.count){return n-(o.count-e)}else{return e}}return t._getFirstRenderedRowIndex()+e};l.prototype.getDomRefs=function(t,e){t=t===true;e=e===true;var n=t?"jQuery":"dom";var i=this._mDomRefs;if(!i[n]){var r=this.getTable();var a=function(e){var n=document.getElementById(e);if(n){return t?o(n):n}return null};var l=function(e){if(e){return t?e.parent():e.parentNode}return null};i[n]={};if(r){var s=r.indexOfRow(this);i[n].rowSelector=a(r.getId()+"-rowsel"+s);i[n].rowAction=a(r.getId()+"-rowact"+s)}i[n].rowHeaderPart=l(i[n].rowSelector);i[n].rowFixedPart=a(this.getId()+"-fixed");i[n].rowScrollPart=a(this.getId());i[n].rowActionPart=l(i[n].rowAction);i[n].rowSelectorText=a(this.getId()+"-rowselecttext");if(t){i[n].row=o().add(i[n].rowHeaderPart).add(i[n].rowFixedPart).add(i[n].rowScrollPart).add(i[n].rowActionPart)}else{i[n].row=[i[n].rowHeaderPart,i[n].rowFixedPart,i[n].rowScrollPart,i[n].rowActionPart].filter(Boolean)}}var p=i[n];if(e){return Object.keys(p).map(function(t){return t==="row"?null:p[t]}).filter(Boolean)}return p};l.prototype._updateSelection=function(){var t=this.getTable();var e=t._getSelectionPlugin().isIndexSelected(this.getIndex());this._setSelected(e);t._getAccExtension().updateSelectionStateOfRow(this)};l.prototype.setRowBindingContext=function(t,o){var n=o.getBindingInfo("rows");var i=n?n.model:undefined;var r=a(this);r.reset();r.context=t;if(r.context){e.Hook.call(o,e.Hook.Keys.Row.UpdateState,r)}this.setBindingContext(r.context,i);this.getDomRefs(true).row.toggleClass("sapUiTableRowHidden",this.isContentHidden());this._updateTableCells(o)};l.prototype.getRowBindingContext=function(){return a(this).context};l.prototype.setBindingContext=function(e,o){return t.prototype.setBindingContext.call(this,e||null,o)};l.prototype._updateTableCells=function(t){var e=this.getCells(),o=this.getIndex(),n=!!t._updateTableCell,i,r,a,l=this.getRowBindingContext();for(var s=0;s<e.length;s++){i=e[s];a=!!i._updateTableCell;r=a||n?i.$().closest("td"):null;if(a){i._updateTableCell(i,l,r,o)}if(n){t._updateTableCell(i,l,r,o)}}};l.prototype.getType=function(){return a(this).type};l.prototype.isGroupHeader=function(){return this.getType()===n.GroupHeader};l.prototype.isSummary=function(){return this.getType()===n.Summary};l.prototype.isGroupSummary=function(){return this.isSummary()&&this.getLevel()>1};l.prototype.isTotalSummary=function(){return this.isSummary()&&this.getLevel()===1};l.prototype.isEmpty=function(){return a(this).empty};l.prototype.isContentHidden=function(){return a(this).contentHidden};l.prototype.getLevel=function(){return a(this).level};l.prototype.getTitle=function(){return a(this).title};l.prototype.isExpandable=function(){return a(this).expandable};l.prototype.isExpanded=function(){return a(this).expanded};l.prototype.destroy=function(){this.removeAllCells();return t.prototype.destroy.apply(this,arguments)};l.prototype.invalidate=function(){return this};l.prototype.getDragGhost=function(){var t=this.getTable();var e=t.getDomRef();var o=this.getDomRefs();var n;var i;var r;var a=t._getSelectionPlugin().getSelectedCount();function l(t){t.removeAttribute("id");t.removeAttribute("data-sap-ui");t.removeAttribute("data-sap-ui-related");var e=t.children.length;for(var o=0;o<e;o++){l(t.children[o])}}function s(t,e){var o=t.cloneNode();var n=t.querySelector("thead").cloneNode(true);var i=t.querySelector("tbody").cloneNode();var r=e.cloneNode(true);i.appendChild(r);o.appendChild(n);o.appendChild(i);return o}n=e.cloneNode();n.classList.add("sapUiTableRowGhost");n.classList.remove("sapUiTableVScr");n.classList.remove("sapUiTableHScr");n.style.width=e.getBoundingClientRect().width+"px";if(o.rowSelector){i=t.getDomRef("sapUiTableRowHdrScr").cloneNode();r=o.rowSelector.cloneNode(true);i.appendChild(r);n.appendChild(i)}if(o.rowFixedPart){i=t.getDomRef("sapUiTableCtrlScrFixed").cloneNode();r=s(t.getDomRef("table-fixed"),o.rowFixedPart);i.appendChild(r);n.appendChild(i)}if(o.rowScrollPart){var p=t.getDomRef("sapUiTableCtrlScr");i=p.cloneNode();r=s(t.getDomRef("table"),o.rowScrollPart);i.appendChild(t.getDomRef("tableCtrlCnt").cloneNode());i.firstChild.appendChild(r);n.appendChild(i)}if(o.rowAction){i=t.getDomRef("sapUiTableRowActionScr").cloneNode();r=o.rowAction.cloneNode(true);i.appendChild(r);n.appendChild(i)}if(a>1){i=document.createElement("div");i.classList.add("sapUiTableRowGhostCount");var u=document.createElement("div");u.textContent=a;i.appendChild(u);n.appendChild(i)}l(n);return n};l.prototype._setSelected=function(t){var o=this.getTable();if(t){this.addStyleClass("sapUiTableRowSel")}else{this.removeStyleClass("sapUiTableRowSel")}if(o){e.dynamicCall(o._getSyncExtension,function(e){e.syncRowSelection(o.indexOfRow(this),t)},this)}};l.prototype._setHovered=function(t){var o=this.getTable();if(t){this.addStyleClass("sapUiTableRowHvr")}else{this.removeStyleClass("sapUiTableRowHvr")}if(o){e.dynamicCall(o._getSyncExtension,function(e){e.syncRowHover(o.indexOfRow(this),t)},this)}};l.prototype.getRowAction=function(){return this.getAggregation("_rowAction")};l.prototype.getTable=function(){var t=this.getParent();return e.isA(t,"sap.ui.table.Table")?t:null};l.prototype.expand=function(){if(this.isExpandable()&&!this.isExpanded()){e.Hook.call(this.getTable(),e.Hook.Keys.Row.Expand,this)}};l.prototype.collapse=function(){if(this.isExpandable()&&this.isExpanded()){e.Hook.call(this.getTable(),e.Hook.Keys.Row.Collapse,this)}};l.prototype.toggleExpandedState=function(){if(this.isExpanded()){this.collapse()}else{this.expand()}};l.prototype.Type=n;return l});