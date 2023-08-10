// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/m/Bar","sap/ui/Device","sap/ui/thirdparty/jquery","sap/base/util/isEmptyObject","sap/m/Button","sap/ushell/resources","sap/ushell/library","./AnchorNavigationBarRenderer"],function(t,e,s,o,i,r){"use strict";var l=t.extend("sap.ushell.ui.launchpad.AnchorNavigationBar",{metadata:{library:"sap.ushell",properties:{accessibilityLabel:{type:"string",defaultValue:null},selectedItemIndex:{type:"int",group:"Misc",defaultValue:0},overflowEnabled:{type:"boolean",group:"Misc",defaultValue:true}},aggregations:{groups:{type:"sap.ushell.ui.launchpad.AnchorItem",multiple:true,singularName:"group"}},events:{afterRendering:{},itemPress:{}}}});l.prototype.init=function(){e.resize.attachHandler(this.reArrangeNavigationBarElements,this);this.bGroupWasPressed=false;this.bIsRtl=sap.ui.getCore().getConfiguration().getRTL();this._bIsRenderedCompletely=false;this.fnNavigationBarItemsVisibility=this.setNavigationBarItemsVisibility.bind(this);this.fnAdjustVisibleAnchorItemsAccessibility=this.adjustVisibleAnchorItemsAccessibility.bind(this)};l.prototype.onBeforeRendering=function(){var t=window.document.getElementsByClassName("sapUshellAnchorNavigationBarItemsScroll")[0];if(t){t.removeEventListener("scroll",this.fnNavigationBarItemsVisibility)}};l.prototype.onAfterRendering=function(){if(this._bIsRenderedCompletely){this.reArrangeNavigationBarElements();this.adjustVisibleAnchorItemsAccessibility();var t=window.document.getElementsByClassName("sapUshellAnchorNavigationBarItemsScroll")[0];if(t){t.addEventListener("scroll",this.fnNavigationBarItemsVisibility)}}};l.prototype.openOverflowPopup=function(){var t=s(".sapUshellAnchorItemOverFlow").hasClass("sapUshellAnchorItemOverFlowOpen");if(this.oOverflowButton&&!t){this.oOverflowButton.firePress()}};l.prototype.closeOverflowPopup=function(){if(this.oPopover){this.oPopover.close()}};l.prototype.reArrangeNavigationBarElements=function(){this.anchorItems=this.getVisibleGroups();var t=this.getSelectedItemIndex()||0;if(this.anchorItems.length){this.adjustItemSelection(t)}if(e.system.phone&&this.anchorItems.length){this.anchorItems.forEach(function(t){t.setIsGroupVisible(false)});this.anchorItems[this.getSelectedItemIndex()].setIsGroupVisible(true)}else{setTimeout(function(){this.setNavigationBarItemsVisibility()}.bind(this),200)}};l.prototype._scrollToGroupByGroupIndex=function(t,o){var i=e.system.tablet?".sapUshellAnchorNavigationBarItemsScroll":".sapUshellAnchorNavigationBarItems";var r=document.documentElement.querySelector(i);var l=this.anchorItems[t].getDomRef();if(r&&l){var n=r.getBoundingClientRect();var h=l.getBoundingClientRect();var a=s(r);var f=this.bIsRtl?a.scrollLeftRTL():r.scrollLeft;var p;if(h.left<n.left){p=h.left-n.left-16}else if(h.right>n.right){p=h.right-n.right+16}if(p){if(this.bIsRtl){a.scrollLeftRTL(f+p)}else{r.scrollLeft=f+p}}this.setNavigationBarItemsVisibility()}};l.prototype.setNavigationBarItemsVisibility=function(){if(!e.system.phone){this.setNavigationBarItemsVisibilityOnDesktop()}else if(this.anchorItems&&this.anchorItems.length>0){this.oOverflowButton.removeStyleClass("sapUshellShellHidden");var t=this.getSelectedItemIndex()||0;if(this.oPopover){this.oPopover.setTitle(this.anchorItems[t].getTitle())}}};l.prototype.setNavigationBarItemsVisibilityOnDesktop=function(){if(this.anchorItems.length&&(!this.isMostRightAnchorItemVisible()||!this.isMostLeftAnchorItemVisible())){this.oOverflowButton.removeStyleClass("sapUshellShellHidden")}else if(this.oOverflowButton){this.oOverflowButton.addStyleClass("sapUshellShellHidden")}if(this.bIsRtl){if(this.anchorItems.length&&!this.isMostLeftAnchorItemVisible()){this.oOverflowRightButton.removeStyleClass("sapUshellShellHidden")}else if(this.oOverflowRightButton){this.oOverflowRightButton.addStyleClass("sapUshellShellHidden")}if(this.anchorItems.length&&!this.isMostRightAnchorItemVisible()){this.oOverflowLeftButton.removeStyleClass("sapUshellShellHidden")}else if(this.oOverflowLeftButton){this.oOverflowLeftButton.addStyleClass("sapUshellShellHidden")}}else{if(this.anchorItems.length&&!this.isMostLeftAnchorItemVisible()){this.oOverflowLeftButton.removeStyleClass("sapUshellShellHidden")}else if(this.oOverflowLeftButton){this.oOverflowLeftButton.addStyleClass("sapUshellShellHidden")}if(this.anchorItems.length&&!this.isMostRightAnchorItemVisible()){this.oOverflowRightButton.removeStyleClass("sapUshellShellHidden")}else if(this.oOverflowRightButton){this.oOverflowRightButton.addStyleClass("sapUshellShellHidden")}}};l.prototype.adjustItemSelection=function(t){setTimeout(function(){if(this.anchorItems&&this.anchorItems.length){this.anchorItems.forEach(function(t){t.setSelected(false)});if(t>=0&&t<this.anchorItems.length){this.anchorItems[t].setSelected(true);this._scrollToGroupByGroupIndex(t)}}}.bind(this),50)};l.prototype.isMostRightAnchorItemVisible=function(){var t=s(".sapUshellAnchorNavigationBarInner"),e=!o(t)?t.width():0,i=!o(t)&&t.offset()?t.offset().left:0,r=this.bIsRtl?this.anchorItems[0].getDomRef():this.anchorItems[this.anchorItems.length-1].getDomRef(),l=!o(r)?s(r).width():0,n;if(l<0){l=80}n=r&&s(r).offset()?s(r).offset().left:0;return Math.ceil(n)+l<=i+e};l.prototype.isMostLeftAnchorItemVisible=function(){var t=s(".sapUshellAnchorNavigationBarInner"),e=!o(t)&&t.offset()&&t.offset().left||0,i=this.bIsRtl?this.anchorItems[this.anchorItems.length-1].getDomRef():this.anchorItems[0].getDomRef(),r=!o(i)&&s(i).offset()?s(i).offset().left:0;return Math.ceil(r)>=e};l.prototype.setSelectedItemIndex=function(t){if(t!==undefined){this.setProperty("selectedItemIndex",t,true)}};l.prototype.setOverflowEnabled=function(t){this.setProperty("overflowEnabled",t);if(this.oOverflowButton){this.oOverflowButton.setEnabled(t)}};l.prototype._getOverflowLeftArrowButton=function(){if(!this.oOverflowLeftButton){this.oOverflowLeftButton=new i({icon:"sap-icon://slim-arrow-left",tooltip:r.i18n.getText("scrollToTop"),press:function(){this._scrollToGroupByGroupIndex(0)}.bind(this)}).addStyleClass("sapUshellShellHidden");this.oOverflowLeftButton._bExcludeFromTabChain=true}return this.oOverflowLeftButton};l.prototype._getOverflowRightArrowButton=function(){if(!this.oOverflowRightButton){this.oOverflowRightButton=new i({icon:"sap-icon://slim-arrow-right",tooltip:r.i18n.getText("scrollToEnd"),press:function(){this._scrollToGroupByGroupIndex(this.anchorItems.length-1)}.bind(this)}).addStyleClass("sapUshellShellHidden");this.oOverflowRightButton._bExcludeFromTabChain=true}return this.oOverflowRightButton};l.prototype._getOverflowButton=function(){if(!this.oOverflowButton){this.oOverflowButton=new i("sapUshellAnchorBarOverflowButton",{icon:"sap-icon://slim-arrow-down",tooltip:r.i18n.getText("more_groups"),enabled:this.getOverflowEnabled(),press:function(){this._togglePopover()}.bind(this)}).addStyleClass("sapUshellShellHidden")}return this.oOverflowButton};l.prototype._togglePopover=function(){sap.ui.require(["sap/m/Popover","sap/ui/model/Filter","sap/ushell/ui/launchpad/GroupListItem","sap/m/List","sap/m/library"],function(t,e,o,i,r){var l=r.ListMode;if(!this.oPopover){this.oList=new i({mode:l.SingleSelectMaster,rememberSelections:false,selectionChange:function(t){this.fireItemPress({group:t.getParameter("listItem")});this.oPopover.close()}.bind(this)});this.oPopover=new t("sapUshellAnchorBarOverflowPopover",{showArrow:false,showHeader:false,placement:"Left",content:[this.oList],horizontalScrolling:false,beforeOpen:function(){var t=s(".sapUshellAnchorItemOverFlow"),e=sap.ui.getCore().getConfiguration().getRTL(),o=e?-1*t.outerWidth():t.outerWidth();this.setOffsetX(o)},afterClose:function(){s(".sapUshellAnchorItemOverFlow").removeClass("sapUshellAnchorItemOverFlowOpen");s(".sapUshellAnchorItemOverFlow").toggleClass("sapUshellAnchorItemOverFlowPressed",false)}}).addStyleClass("sapUshellAnchorItemsPopover").addStyleClass("sapContrastPlus")}if(this.oPopover.isOpen()){this.oPopover.close()}else{this.anchorItems=this.getVisibleGroups();this.oList.setModel(this.getModel());var n=this.getModel().getProperty("/tileActionModeActive");var h=new e("","EQ","a");h.fnTest=function(t){if(!t.visibilityModes[n?1:0]){return false}return t.isGroupVisible||n};this.oList.bindItems({path:"/groups",template:new o({title:"{title}",groupId:"{groupId}",index:"{index}"}),filters:[h]});var a=s(".sapUshellAnchorItemSelected").attr("id");var f=sap.ui.getCore().byId(a);this.oList.getItems().forEach(function(t){if(f.mProperties.groupId===t.mProperties.groupId){t.addStyleClass("sapUshellAnchorPopoverItemSelected")}else{t.addStyleClass("sapUshellAnchorPopoverItemNonSelected")}});s(".sapUshellAnchorItemOverFlow").toggleClass("sapUshellAnchorItemOverFlowPressed",true);this.oPopover.openBy(this.oOverflowButton)}}.bind(this))};l.prototype.getVisibleGroups=function(){return this.getGroups().filter(function(t){return t.getVisible()})};l.prototype._setRenderedCompletely=function(t){this._bIsRenderedCompletely=t};l.prototype.handleAnchorItemPress=function(t){this.bGroupWasPressed=true;this.fireItemPress({group:t.getSource(),manualPress:true})};l.prototype.adjustVisibleAnchorItemsAccessibility=function(){var t=this.getVisibleGroups(),e=t.length;t.forEach(function(t,s){t.setPosinset(s+1);t.setSetsize(e)})};l.prototype.addGroup=function(t,e){t.attachVisibilityChanged(this.fnAdjustVisibleAnchorItemsAccessibility);return this.addAggregation("groups",t,e)};l.prototype.insertGroup=function(t,e,s){t.attachVisibilityChanged(this.fnAdjustVisibleAnchorItemsAccessibility);return this.insertAggregation("groups",t,e,s)};l.prototype.removeGroup=function(t,e){t.detachVisibilityChanged(this.fnAdjustVisibleAnchorItemsAccessibility);return this.removeAggregation("groups",t,e)};l.prototype.exit=function(){if(this.oOverflowLeftButton){this.oOverflowLeftButton.destroy()}if(this.oOverflowRightButton){this.oOverflowRightButton.destroy()}if(this.oOverflowButton){this.oOverflowButton.destroy()}if(this.oPopover){this.oPopover.destroy()}if(t.prototype.exit){t.prototype.exit.apply(this,arguments)}};return l});