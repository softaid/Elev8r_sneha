/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/base/Log","./ComboBox","./library","sap/ui/core/History","sap/ui/core/SeparatorItem","./DropdownBoxRenderer","sap/ui/Device","./TextField","sap/ui/core/ListItem","sap/ui/dom/containsOrEquals","sap/ui/events/jquery/EventExtension","sap/ui/events/KeyCodes","sap/ui/core/Configuration","sap/ui/dom/jquery/cursorPos","sap/ui/dom/jquery/selectText"],function(e,t,s,i,o,r,a,h,p,n,l,u,d,f){"use strict";var c=s.extend("sap.ui.commons.DropdownBox",{metadata:{library:"sap.ui.commons",deprecated:true,properties:{searchHelpEnabled:{type:"boolean",group:"Behavior",defaultValue:false},searchHelpText:{type:"string",group:"Appearance",defaultValue:null},searchHelpAdditionalText:{type:"string",group:"Appearance",defaultValue:null},searchHelpIcon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},maxHistoryItems:{type:"int",group:"Behavior",defaultValue:0}},events:{searchHelp:{parameters:{value:{type:"string"}}}}}});c.prototype.init=function(){s.prototype.init.apply(this,arguments);this._oValueBeforePaste=null;this._oValueBeforeOpen=null;this.__aItems=null;this._iCursorPosBeforeBackspace=null;this._searchHelpItem=null;this._iItemsForHistory=10;this._oHistory=new o(this.getId())};c.prototype.exit=function(){var e=this.getId()+"-h-";if(this._searchHelpItem){this._searchHelpItem[0].destroy();this._searchHelpItem[1].destroy();this._searchHelpItem=null}s.prototype.exit.apply(this,arguments);function t(e){var t=sap.ui.getCore().byId(e);if(t){t.destroy()}}for(var i=0;i<this.getMaxHistoryItems();i++){t(e+i)}if(this.__oSeparator){this.__oSeparator.destroy();this.__oSeparator=null}this._oHistory=null;this.__aItems=null;this._sWantedValue=undefined};c.prototype.onAfterRendering=function(e){s.prototype.onAfterRendering.apply(this,arguments);if(!this._sHandleItemsChanged){this.checkValueInItems()}};c.prototype.getItems=function(){if(this.oPopup&&this.oPopup.isOpen()){return this.__aItems}else{return s.prototype.getItems.apply(this,arguments)}};c.prototype.insertItem=function(t,i){if(this.oPopup&&this.oPopup.isOpen()){this.__aItems.splice(i,0,t);if(this.__aItems.length<=this._iItemsForHistory&&!this._searchHelpItem){this._getListBox().insertItem(t,i)}if(!this._bNoItemCheck){var o=e(this.getInputDomRef());var r=o.cursorPos();this._doTypeAhead(o.val().substr(0,r),"")}return this}else{return s.prototype.insertItem.apply(this,arguments)}};c.prototype.addItem=function(t){if(this.oPopup&&this.oPopup.isOpen()){this.__aItems.push(t);if(this.__aItems.length<=this._iItemsForHistory&&!this._searchHelpItem){this._getListBox().addItem(t)}if(!this._bNoItemCheck){var i=e(this.getInputDomRef());var o=i.cursorPos();this._doTypeAhead(i.val().substr(0,o),"")}return this}else{return s.prototype.addItem.apply(this,arguments)}};c.prototype.removeItem=function(i){if(this.oPopup&&this.oPopup.isOpen()){var o=null;var r=i;if(typeof i=="string"){i=sap.ui.getCore().byId(i)}if(typeof i=="object"){for(var a=0;a<this.__aItems.length;a++){if(this.__aItems[a]==i){i=a;break}}}if(typeof i=="number"){if(i<0||i>=this.__aItems.length){t.warning("Element.removeAggregation called with invalid index: Items, "+i)}else{o=this.__aItems[i];this.__aItems.splice(i,1)}}if(this.__aItems.length<=this._iItemsForHistory&&!this._searchHelpItem){this._getListBox().removeItem(r)}if(!this._bNoItemCheck){var h=e(this.getInputDomRef());var p=h.cursorPos();this._doTypeAhead(h.val().substr(0,p),"")}return o}else{return s.prototype.removeItem.apply(this,arguments)}};c.prototype.removeAllItems=function(){if(this.oPopup&&this.oPopup.isOpen()){var e=this.__aItems;if(!e){return[]}s.prototype.removeAllItems.apply(this,arguments);this.__aItems=[];return e}else{return s.prototype.removeAllItems.apply(this,arguments)}};c.prototype.indexOfItem=function(e){if(this.oPopup&&this.oPopup.isOpen()){if(this.__aItems){if(this.__aItems.length==undefined){return-2}for(var t=0;t<this.__aItems.length;t++){if(this.__aItems[t]==e){return t}}}return-1}else{return s.prototype.indexOfItem.apply(this,arguments)}};c.prototype.destroyItems=function(){if(this.oPopup&&this.oPopup.isOpen()){if(!this.__aItems){return this}this._getListBox().removeAllItems();for(var e=0;e<this.__aItems.length;e++){if(this.__aItems[e]){this.__aItems[e].destroy()}}this.__aItems=[];return this}else{return s.prototype.destroyItems.apply(this,arguments)}};c.prototype.updateItems=function(){s.prototype.updateItems.apply(this,arguments);if(this.oPopup&&this.oPopup.isOpen()){var t=e(this.getInputDomRef());var i=t.cursorPos();this._doTypeAhead(t.val().substr(0,i),"")}};c.prototype._handleItemsChanged=function(t,i){if(i){this._sHandleItemsChanged=null;this._bNoItemCheck=undefined}if(this._bNoItemCheck){return}if(this.__aItems&&(!this.oPopup||!this.oPopup.isOpen())){throw new Error("DropdownBox "+this.getId()+" : this.__aItems is not empty!")}if(this.getListBox()&&this.oPopup&&this.oPopup.isOpen()){if(this.__aItems.length>this._iItemsForHistory||this._searchHelpItem){var o;var r=0;switch(t.getParameter("event")){case"destroyItems":for(r=0;r<this.__aItems.length;r++){o=this.__aItems[r];if(!o.bIsDestroyed){o.destroy()}}this.__aItems=[];if(this.getSearchHelpEnabled()){this._searchHelpItem=null;this.setSearchHelpEnabled(this.getSearchHelpEnabled(),this.getSearchHelpText(),this.getSearchHelpAdditionalText(),this.getSearchHelpIcon())}break;case"removeAllItems":this.__aItems=[];break;case"removeItem":o=t.getParameter("item");for(r=0;r<this.__aItems.length;r++){if(this.__aItems[r]==o){this.__aItems.splice(r,1);break}}if(this.__aItems.length<=this._iItemsForHistory){this._getListBox().setItems(this.__aItems,false,true)}break;case"insertItem":this.__aItems.splice(t.getParameter("index"),0,t.getParameter("item"));break;case"addItem":this.__aItems.push(t.getParameter("item"));break;case"setItems":this.__aItems=t.getParameter("items");break;case"updateItems":for(r=0;r<this.__aItems.length;r++){o=this.__aItems[r];if(!o.bIsDestroyed){o.destroy()}}if(this.getSearchHelpEnabled()){this._searchHelpItem=null;this.setSearchHelpEnabled(this.getSearchHelpEnabled(),this.getSearchHelpText(),this.getSearchHelpAdditionalText(),this.getSearchHelpIcon())}this.__aItems=this._getListBox().getItems();break;default:break}}else{this.__aItems=this._getListBox().getItems()}var a=e(this.getInputDomRef());var h=a.cursorPos();this._doTypeAhead(a.val().substr(0,h),"")}s.prototype._handleItemsChanged.apply(this,arguments);this.checkValueInItems()};c.prototype.onclick=function(e){if(!this.mobile&&this.getEnabled&&this.getEnabled()&&this.getEditable()){if(this.oPopup&&this.oPopup.isOpen()){this._close();this._doSelect()}else if(!this._F4ForClose){this._open()}this.focus()}this._F4ForClose=false};c.prototype.onmousedown=function(e){if(!this.getEnabled()||!this.getEditable()){return}if(this.oPopup&&this.oPopup.isOpen()){this._F4ForClose=true}else{this._F4ForOpen=true}s.prototype.onmousedown.apply(this,arguments)};c.prototype.onsapshow=function(t){if(this.mobile){return}if(!this.getEnabled()||!this.getEditable()){t.preventDefault();t.stopImmediatePropagation();return}if(t.which===d.F4&&this._searchHelpItem){this._close();this.fireSearchHelp({value:e(this.getInputDomRef()).val()});t.preventDefault();t.stopImmediatePropagation();return}if(this.oPopup&&this.oPopup.isOpen()){this._close()}else{this._open();var s=this._getListBox();s.scrollToIndex(s.getSelectedIndex());this._doSelect()}t.preventDefault();t.stopImmediatePropagation()};c.prototype.onkeydown=function(e){if(e.target.id==this.getId()+"-select"){return}if(h.browser.webkit&&(e.which==d.DELETE||e.which==d.BACKSPACE)){this.onkeypress(e)}if(e.which!==d.BACKSPACE){return}};c.prototype.onpaste=function(t){if(t.target.id==this.getId()+"-select"){return}if(this._oValueBeforePaste===null){this._oValueBeforePaste=e(this.getInputDomRef()).val()}};c.prototype.oncut=c.prototype.onpaste;c.prototype.oninput=function(t){if(this.mobile){return}var s=e(this.getInputDomRef());var i=s.val();if(!this.oPopup||!this.oPopup.isOpen()){this.noTypeAheadByOpen=true;this._open();this.noTypeAheadByOpen=undefined}var o=this._doTypeAhead(i,"");if(!o&&this._oValueBeforePaste){this._doTypeAhead("",this._oValueBeforePaste)}this._oValueBeforePaste=null;this._fireLiveChange(t)};c.prototype.onkeyup=function(t){if(t.target.id==this.getId()+"-select"){return}if(!this.getEnabled()||!this.getEditable()){return}var s=t.which;p.prototype.onkeyup.apply(this,arguments);if(this._oValueBeforePaste===null||s===d.TAB){return}if(!this.oPopup||!this.oPopup.isOpen()){this.noTypeAheadByOpen=true;this._open();this.noTypeAheadByOpen=undefined}var i=e(this.getInputDomRef()),o=false;if(s===d.BACKSPACE&&this._iCursorPosBeforeBackspace!==null){var r=i.cursorPos();if(this._iCursorPosBeforeBackspace!==r){r++}this._iCursorPosBeforeBackspace=null;o=this._doTypeAhead(i.val().substr(0,r-1),"")}else if(!(o=this._doTypeAhead("",i.val()))){i.val(this._oValueBeforePaste)}if(o){this._getListBox().rerender()}this._oValueBeforePaste=null};c.prototype.onsaphome=function(t){if(t.target.id==this.getId()+"-select"){return}if((!this.oPopup||!this.oPopup.isOpen())&&this.getEditable()&&this.getEnabled()){p.prototype.onsaphome.apply(this,arguments);var i=e(this.getInputDomRef());i.cursorPos(0);this._updateSelection();t.preventDefault()}else{s.prototype.onsaphome.apply(this,arguments)}};c.prototype.onsapdelete=function(e){if(e.target.id==this.getId()+"-select"){return}if(!this.oPopup||!this.oPopup.isOpen()){return}var t=this._getListBox(),s=t.getSelectedItem(),i=s.getId().match(/\-h\-([0-4])/),o=t.getSelectedIndex();if(i&&i.length===2){this._oHistory.remove(s.getText());t.removeItem(o);var r=this._oHistory.get().length;if(r===0){t.removeItem(0)}t.rerender();var a=o+(this._searchHelpItem?2:0);if(a==r){a++}t.setSelectedIndex(a);this.setValue(t.getSelectedItem().getText())}};c.prototype.onkeypress=function(t){if(t.target.id==this.getId()+"-select"){return}if(!this.getEnabled()||!this.getEditable()){return}var i=t.which,o=t.keyCode;if((s._isHotKey(t)||h.browser.firefox&&o===d.HOME||o===d.F4&&t.which===0)&&!(t.ctrlKey&&t.which==120)){return}else if(o==d.ESCAPE){var r=this.getProperty("value");var a=this.getInputDomRef();if(a&&a.value!==r){e(a).val(r)}return}var p=String.fromCharCode(i),n=e(this.getInputDomRef()),l=n.cursorPos(),u=n.val();if(!this.oPopup||!this.oPopup.isOpen()){this.noTypeAheadByOpen=true;this._open();this.noTypeAheadByOpen=undefined}if(i===d.BACKSPACE){this._doTypeAhead(u.substr(0,l-1),"")}else{this._doTypeAhead(u.substr(0,l),p)}if(u!=n.val()){this._fireLiveChange(t)}this._bFocusByOpen=undefined;t.preventDefault()};c.prototype.onsapright=function(e){if(e.target.id==this.getId()+"-select"){return}if(!this.getEnabled()||!this.getEditable()){return}var t=f.getRTL();if(!t){this._updateSelection(1)}else{this._updateSelection(-1)}e.preventDefault()};c.prototype.onsapleft=function(e){if(e.target.id==this.getId()+"-select"){return}if(!this.getEnabled()||!this.getEditable()){return}var t=f.getRTL();if(!t){this._updateSelection(-1)}else{this._updateSelection(1)}e.preventDefault()};c.prototype.onfocusin=function(t){if(!this.oPopup||!this.oPopup.isOpen()||this._bFocusByOpen){var i=e(this.getInputDomRef()),o=i.val().length;if(o>0&&!this.mobile){this._callDoSelectAfterFocusIn(0,o)}this._bFocusByOpen=undefined}s.prototype.onfocusin.apply(this,arguments)};c.prototype._callDoSelectAfterFocusIn=function(e,t){this._doSelect(e,t)};c.prototype.onselect=function(t){var s=(new Date).getTime();if(this._bIgnoreSelect){this._bIgnoreSelect=false;this.iOldTimestamp=s;return}if(this.iOldTimestamp&&s-this.iOldTimestamp<50){return}this.iOldTimestamp=undefined;if(!this.getEnabled()||!this.getEditable()){return}var i=e(this.getInputDomRef()),o=i.cursorPos(),r=i.val();if(r.length>0&&o>0){this._doTypeAhead(r.substr(0,o),"");if(!this.oPopup||!this.oPopup.isOpen()){this._cleanupClose(this._getListBox())}}t.preventDefault()};c.prototype._determinePosinset=function(e,t){var s=t+1;if(this.oPopup&&this.oPopup.isOpen()){this.dontSetPoisinset=undefined;var i=e[t];var o=e[0].getId().search(this.getId()+"-h-")!=-1;if(i.getId().search(this.getId()+"-h-")==-1){if(o){s=s-1}if(this._searchHelpItem){s=s-2}}}return s};c.prototype._doSelect=function(t,s){this._bIgnoreSelect=true;var i=this.getInputDomRef();if(i){var o=e(i);o.selectText(t?t:0,s?s:o.val().length)}return this};c.prototype._updateSelection=function(t){var s=e(this.getInputDomRef()),i=s.cursorPos()+(t||0),o=s.val();this._doTypeAhead(o.substr(0,i),"");if(!this.oPopup||!this.oPopup.isOpen()){this._cleanupClose(this._getListBox())}else{this._getListBox().rerender()}};c.prototype._doTypeAhead=function(t,s,i,o){if(this.__doTypeAhead===true){return}this.__doTypeAhead=true;this._sWantedSelectedKey=undefined;this._sWantedSelectedItemId=undefined;this._sWantedValue=undefined;var r=this._getListBox(),a=this.getMaxPopupItems(),h=this.__aItems||r.getItems(),p=h.length,n=this.getMaxHistoryItems()>0&&h.length>this._iItemsForHistory,l=!i&&n,u=t+s,d=new RegExp("[.*+?|()\\[\\]{}\\\\]","g"),f=u.toLowerCase().replace(d,"\\$&"),c=RegExp("^"+f+".*$"),_=s&&s.length||0,m=e(this.getInputDomRef());this.__aItems=h;if(p<=0){this.__doTypeAhead=false;return false}var g,I=this._getFilteredItems(h,c),y=I.length>0;if(!y){l=false}if(l){g=I}else{g=h.slice(0)}var v=[];if(n){v=this._addHistoryItems(g,l&&c);r.setItems(g,false,true);p=g.length}r.setVisibleItems(a<p?a:-1);var H,x=v.length;var P=0;if(o>=0){H=h[o]}if(!l&&x>0&&y){v=this._getFilteredItems(v,c);H=v[0]}if(l){H=I[0]}else if(!H){if(I.length>0){H=I[0]}else{var b=m.val();var S=0;for(P=0;P<g.length;P++){var T=g[P];if(T.getEnabled()){if(!S){S=P}if(T.getText()==b){H=T;break}}}if(!H){H=g[S]}}}var B=this._searchHelpItem;if(B){g.splice(x++,0,B[0],B[1]);r.setItems(g,false,true)}P=r.indexOfItem(H);var A=H.getText();var D=P+1;var C=g.length;if(v.length>0){C=C-1}if(B){C=C-2}if(D>v.length){if(v.length>0){D=D-1}if(B){D=D-2}}this._updatePosInSet(m,D,H.getAdditionalText?H.getAdditionalText():"");m.attr("aria-setsize",C);m.val(A);this._sTypedChars=u;this._doSelect(t.length+_,A.length);r.setSelectedIndex(P);if(B&&P==2){r.scrollToIndex(0)}else{r.scrollToIndex(P)}this._iClosedUpDownIdx=P;if(!y){m=this.$();m.addClass("sapUiTfErr");setTimeout(function(){m.removeClass("sapUiTfErr")},300);m.cursorPos(t.length);this._doSelect(t.length,A.length)}this.__doTypeAhead=false;return y};c.prototype._prepareOpen=function(t,s){this._oValueBeforeOpen=e(this.getInputDomRef()).val();this._bOpening=true;if(!this.noTypeAheadByOpen){var i;if(this._iClosedUpDownIdx>=0){i=this._iClosedUpDownIdx}else if(this.getSelectedItemId()){i=this.indexOfItem(sap.ui.getCore().byId(this.getSelectedItemId()))}this._doTypeAhead("",e(this.getInputDomRef()).val(),true,i);this._doSelect()}return this};c.prototype._handleOpened=function(){s.prototype._handleOpened.apply(this,arguments);e(this.getInputDomRef()).trigger("focus")};c.prototype._cleanupClose=function(e){if(this.__aItems){var t=e.getSelectedItem();e.setItems(this.__aItems,false,true);this._iClosedUpDownIdx=e.indexOfItem(t);e.setSelectedIndex(this._iClosedUpDownIdx);this.__aItems=undefined}this._oValueBeforeOpen=null;this._bOpening=undefined;return this};c.prototype._getFilteredItems=function(e,t){var s=e.slice(0),i;for(var o=s.length-1;o>=0;o--){i=s[o];if(!t.test(i.getText().toLowerCase())||!i.getEnabled()){s.splice(o,1)}}return s};c.prototype._addHistoryItems=function(e,t){var s=this.getId()+"-h-",i,o=this._oHistory.get(),r=o.length,a=[];for(var h=0,p=0;p<this.getMaxHistoryItems()&&h<r;h++){if(!t||t.test(o[h])){i=(i=sap.ui.getCore().byId(s+p))&&i.setText(o[h])||new n(s+p,{text:o[h]});a.push(i);p++}}if(a.length>0){var l=s+"separator",u=this._getSeparator(l);a.push(u)}e.unshift.apply(e,a);return a};c.prototype._getSeparator=function(e){if(!this.__oSeparator&&e){this.__oSeparator=sap.ui.getCore().byId(e)||new r(e)}return this.__oSeparator||null};c.prototype.fireChange=function(e){this.fireEvent("change",e);if(e.newValue&&this.getMaxHistoryItems()>0){this._oHistory.add(e.newValue)}this._sWantedValue=undefined;return this};c.prototype.setValue=function(e,t){e=e===undefined||e===null||e===""?"":e;var i=this.getItems(),o,r=false,a;for(var h=0,p=i.length;h<p&&!r;h++){var n=i[h];var l=n.getEnabled();o=n.getText();if(l&&!a){a=o}r=o===e&&l}if(r){s.prototype.setValue.call(this,e,t);this._sWantedValue=undefined}else if(e===""&&i.length>0){s.prototype.setValue.call(this,a,t)}else{this._sWantedValue=e}return this};c.prototype.applyFocusInfo=function(e){s.prototype.applyFocusInfo.apply(this,arguments);if(!this._bOpening&&(!this.oPopup||!this.oPopup.isOpen())){this._cleanupClose(this._getListBox())}return this};c.prototype._focusAfterListBoxClick=function(){if(!h.browser.webkit){this.focus()}else{var e=this._getListBox();e.addDelegate({onclick:function(){e.removeDelegate(this);this.focus()}.bind(this)})}};c.prototype.onsapfocusleave=function(e){var t=this._getListBox();if(e.relatedControlId&&l(t.getFocusDomRef(),sap.ui.getCore().byId(e.relatedControlId).getFocusDomRef())){this._focusAfterListBoxClick()}else{if(this.oPopup&&this.oPopup.isOpen()){this._close()}p.prototype.onsapfocusleave.apply(this,arguments)}};c.prototype.getTooltip_AsString=function(){var e=s.prototype.getTooltip_AsString.apply(this,arguments);if(!this._searchHelpItem){return e}else{var t=sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");var i=t.getText("DDBX_SHI_ARIA");i=i==="DDBX_SHI_ARIA"?"Open search help via {0}":i;var o=this._searchHelpItem[0]&&this._searchHelpItem[0].getAdditionalText()||t.getText("DDBX_SHIF4");o=o==="DDBX_SHIF4"?"F4":o;i=i.replace("{0}",o);return(e?e+" - ":"")+i}};c.prototype._handleSelect=function(t){if(this._searchHelpItem&&t.getParameter("selectedItem")===this._searchHelpItem[0]){var i=new e.Event("sapshow");i.which=d.F4;this.onsapshow(i)}else{var o=t.getParameter("selectedItem");if(!o){o=sap.ui.getCore().byId(t.getParameter("selectedId"))}if(o.getId().search(this.getId()+"-h-")!=-1){var r=this._getListBox(),a=r.getItems();var h=this._oHistory.get().length;if(h>this.getMaxHistoryItems()){h=Math.max(this.getMaxHistoryItems(),0)}for(var p=h;p<a.length;p++){if(a[p].getText()==o.getText()&&a[p].getEnabled()){t.mParameters.selectedIndex=p;if(!t.getParameter("selectedIndices")){t.mParameters.selectedIndices=new Array(1);t.mParameters.aSelectedIndices=new Array(1)}t.mParameters.selectedIndices[0]=p;t.mParameters.aSelectedIndices[0]=p;t.mParameters.selectedItem=a[p];break}}}this._sWantedValue=undefined;return s.prototype._handleSelect.apply(this,arguments)}};c.prototype.setSearchHelpEnabled=function(e,t,s,i){this.setProperty("searchHelpEnabled",e);if(t){this.setProperty("searchHelpText",t)}else{t=this.getSearchHelpText()}if(s){this.setProperty("searchHelpAdditionalText",s)}else{s=this.getSearchHelpAdditionalText()}if(i){this.setProperty("searchHelpIcon",i)}else{i=this.getSearchHelpIcon()}if(e){var o=sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");if(o){t=t||o.getText("DDBX_SHI");t=t==="DDBX_SHI"?"Search Help":t;s=s||o.getText("DDBX_SHIF4");s=s==="DDBX_SHIF4"?"F4":s}i=i||sap.ui.require.toUrl("sap/ui/commons/images/dropdown/ico12_f4.gif");if(!this._searchHelpItem){this._searchHelpItem=[new n(this.getId()+"_shi",{text:t,additionalText:s,enabled:true,icon:i}),new r]}else{this._searchHelpItem[0].setText(t).setAdditionalText(s).setIcon(i)}}else{if(this._searchHelpItem){this._searchHelpItem[0].destroy();this._searchHelpItem[1].destroy();this._searchHelpItem=null}}return this};c.prototype.setSearchHelpText=function(e){this.setProperty("searchHelpText",e);this.setSearchHelpEnabled(this.getSearchHelpEnabled(),e,this.getSearchHelpAdditionalText(),this.getSearchHelpIcon());return this};c.prototype.setSearchHelpAdditionalText=function(e){this.setProperty("searchHelpAdditionalText",e);this.setSearchHelpEnabled(this.getSearchHelpEnabled(),this.getSearchHelpText(),e,this.getSearchHelpIcon());return this};c.prototype.setSearchHelpIcon=function(e){this.setProperty("searchHelpIcon",e);this.setSearchHelpEnabled(this.getSearchHelpEnabled(),this.getSearchHelpText(),this.getSearchHelpAdditionalText(),e);return this};c.prototype.checkValueInItems=function(){var e=this.getValue();var t=s.prototype.getItems.apply(this);var i=this._sWantedSelectedKey;var o=this._sWantedSelectedItemId;if(t&&t.length>0){var r=false;var a;var h=0,p=0;var n;var l=false;var u="";if(this._sWantedValue){for(h=0,p=t.length;h<p&&!r;h++){n=t[h];l=n.getEnabled();u=n.getText();if(l&&!a){a=u}r=u===this._sWantedValue&&l}if(r){e=this._sWantedValue;this._sWantedValue=undefined;i=undefined;o=undefined;s.prototype.setValue.call(this,e)}}if(!r){for(h=0,p=t.length;h<p&&!r;h++){n=t[h];l=n.getEnabled();u=n.getText();if(l&&!a){a=u}r=u===e&&l}}if(!r){e=a;s.prototype.setValue.call(this,e)}}else{e="";s.prototype.setValue.call(this,e)}this._sWantedSelectedKey=i;this._sWantedSelectedItemId=o;return e};c.prototype.setMaxHistoryItems=function(e){var t=this.getMaxHistoryItems();var s=this.getId()+"-h-";var i;this.setProperty("maxHistoryItems",e,true);if(e<t){var o=this._getListBox();for(var r=Math.max(e,0);r<t;r++){i=sap.ui.getCore().byId(s+r);if(i){o.removeItem(i);i.destroy()}}if(e<=0&&this.__oSeparator){o.removeItem(this.__oSeparator)}}return this};c.prototype.clearHistory=function(){this._oHistory.clear();var e=this.getId()+"-h-";var t=this._getListBox();var s;for(var i=0;i<this.getMaxHistoryItems();i++){s=sap.ui.getCore().byId(e+i);if(s){t.removeItem(s);s.destroy()}}if(this.__oSeparator){t.removeItem(this.__oSeparator)}};c.prototype.ondrop=function(e){e.preventDefault()};c.prototype._isSetEmptySelectedKeyAllowed=function(){return false};return c});