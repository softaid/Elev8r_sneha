/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/IconPool","sap/ui/core/theming/Parameters","sap/base/security/encodeXML","sap/ui/core/Configuration"],function(e,t,a,i){"use strict";var r;var s={};s.render=function(e,a){r=r||sap.ui.require("sap/ui/ux3/Shell");var l=a.isPaneOpen();var o=a.getPaneWidth()+r.SIDE_BAR_BASE_WIDTH;var n=i.getRTL();var d=a.getId();if(r.FIRST_RENDERING){document.body.style.margin="0"}e.write("<div");e.writeControlData(a);e.addClass("sapUiUx3Shell");e.addClass("sapUiUx3ShellHead"+a.getHeaderType());e.addClass("sapUiUx3ShellDesign"+a.getDesignType());if(!a._hasDarkDesign()){e.addClass("sapUiUx3ShellDesignLight")}if(a.getFullHeightContent()){e.addClass("sapUiUx3ShellFullHeightContent")}if(!a.getApplyContentPadding()){e.addClass("sapUiUx3ShellNoContentPadding")}if(!a.getShowTools()){e.addClass("sapUiUx3ShellNoTools")}if(!a.getShowPane()){e.addClass("sapUiUx3ShellNoPane")}if(a._topSyncRefId&&!a.getAllowOverlayHeaderAccess()){e.addClass("sapUiUx3ShellBlockHeaderAccess")}e.writeClasses();e.write(">");e.write("<img id='"+d+"-hdrImg' class='sapUiUx3ShellHeaderImg' src='");var p=t._getThemeImage("sapUiUx3ShellHeaderImageURL",true);e.writeEscaped(p);e.write("'>");e.write("<header id='"+d+"-hdr' class='sapUiUx3ShellHeader' role='banner'>");var c=a._topSyncRefId?" tabindex='0'":"";e.write("<span class='sapUiUx3ShellFocusDummy' id='"+d+"-focusDummyHdrStart'"+c+"></span>");s.renderHeader(e,a);e.write("<span class='sapUiUx3ShellFocusDummy' id='"+d+"-focusDummyHdrEnd'"+c+"></span>");e.write("</header>");e.write("<div id='",d,"-bg' class='sapUiUx3ShellBg'></div>");e.write("<img id='",d,"-bgImg' class='sapUiUx3ShellBgImg' src='");p=t._getThemeImage("sapUiUx3ShellBackgroundImageURL",true);e.writeEscaped(p);e.write("'>");var g=l?" style='margin-"+(n?"left":"right")+":"+(o+22)+"px'":"";e.write("<div id='",d,"-wBar'"+g+" class='sapUiUx3ShellWorksetBar'>");s.renderWorksetItems(e,a);e.write("</div>");e.write("<section id='"+d+"-tp' class='sapUiUx3ShellToolPaletteArea' role='complementary' data-sap-ui-fastnavgroup='true'>");s.renderToolPalette(e,a);e.write("</section>");var U=l?" style='"+(n?"left":"right")+":"+o+"px'":"";e.write("<div class='sapUiUx3ShellCanvas'"+U+" id='"+d+"-canvas'>");s.renderFacetBar(e,a);e.write("<article class='sapUiUx3ShellContent' id='"+d+"-content' role='main' data-sap-ui-fastnavgroup='true'>");var u=a.getContent();for(var w=0;w<u.length;w++){e.renderControl(u[w])}e.write("</article><div class='sapUiUx3ShellNotifySpace'></div></div>");var c=a._topSyncRefId?" tabindex='0'":"";e.write("<span class='sapUiUx3ShellFocusDummy' id='"+d+"-focusDummyPane'"+c+"></span>");e.write("<aside id='"+d+"-paneBar' class='sapUiUx3ShellPaneBar "+(l?" sapUiUx3ShellPaneBarOpen sapUiUx3ShellPaneBarOpened":" sapUiUx3ShellPaneBarClose")+"' role='complementary' style='width:"+o+"px;'>");e.write("<section id='"+d+"-paneContent' style='width:"+a.getPaneWidth()+"px;' class='sapUiUx3ShellPaneBarContent' role='tabpanel'>");var h=a.getPaneContent();for(var w=0;w<h.length;w++){e.renderControl(h[w])}e.write("</section>");e.write("<div id='"+d+"-paneBarRight' class='sapUiUx3ShellPaneBarRight' data-sap-ui-fastnavgroup='true'>");e.write("<ul id='"+d+"-paneBarEntries' class='sapUiUx3ShellPaneEntries' role='tablist'>");s.renderPaneBarItems(e,a);e.write("</ul>");e.write("<div id='"+d+"-paneBarOverflowButton' class='sapUiUx3ShellPaneOverflowButton'");e.addStyle("display","none;");e.writeStyles();e.write(">");e.write("<div id='"+d+"-paneBarOverflowWrapper' class='sapUiUx3ShellPaneOverflowWrapper'>");e.write("<span id='"+d+"-paneBarOverflowText' class='sapUiUx3ShellPaneOverflowText sapUiUx3ShellPaneEntry'>");e.write(sap.ui.getCore().getLibraryResourceBundle("sap.ui.ux3").getText("SHELL_MORE_BUTTON"));e.write("</span>");e.write("</div>");e.write("</div>");e.write("</div>");e.write("</aside>");e.write("<div class='sapUiUx3ShellCanvasBackground "+(l?"sapUiUx3ShellCanvasBackgroundOpen":"sapUiUx3ShellCanvasBackgroundClosed")+"' id='"+d+"-canvasBackground'"+U+">");e.write("<div class='sapUiUx3ShellCanvasBackgroundRight'></div>");e.write("</div>");e.write("<div id='"+d+"-notify' class='sapUiUx3ShellNotify'>");s.renderNotificationArea(e,a);e.write("</div>");e.write("</div>")};s.renderHeader=function(e,i){var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.ux3");var s=i.getAppIcon();e.write("<hr id='"+i.getId()+"-hdrLine'>");e.write("<span id='"+i.getId()+"-hdr-items' class='sapUiUx3ShellHeaderTitleRight'>");var l=i.getHeaderItems();for(var o=0;o<l.length;o++){if(l[o]instanceof sap.ui.commons.MenuButton){if(l[o].getMenu()){l[o].getMenu().addStyleClass("sapUiMnuTop",true)}}e.renderControl(l[o]);if(o<l.length-1||i.getShowLogoutButton()){e.write("<span class='sapUiUx3ShellHeaderSep'></span>")}}if(i.getShowLogoutButton()){e.write("<a id='"+i.getId()+"-logout' title='");e.write(i.getLogoutButtonTooltip()?a(i.getLogoutButtonTooltip()):r.getText("SHELL_LOGOUT"));e.write("' tabindex='0' role='button' class='sapUiUx3ShellHeaderButton sapUiUx3ShellHeader-logout'></a>")}e.write("</span>");e.write("<span class='sapUiUx3ShellHeaderTitleLeft' ");e.writeAttributeEscaped("title",i.getAppTitle());e.write(">");e.write("<img id='"+i.getId()+"-logoImg' src='");if(s){e.writeEscaped(i.getAppIcon())}else{var n=t._getThemeImage("sapUiUx3ShellApplicationImageURL",true);e.writeEscaped(n)}e.write("'");var d=i.getAppIconTooltip()||r.getText("SHELL_LOGO");e.writeAttributeEscaped("alt",d);e.writeAttributeEscaped("title",d);e.write(">");e.write("<span>");e.writeEscaped(i.getAppTitle());e.write("</span>");e.write("</span>")};s.renderToolPalette=function(t,a){var i=sap.ui.getCore().getLibraryResourceBundle("sap.ui.ux3");var s=a.getId();var l=a._topSyncRefId?" tabindex='0'":"";t.write("<span class='sapUiUx3ShellFocusDummy' id='"+a.getId()+"-focusDummyTPStart'"+l+"></span>");var o=i.getText("SHELL_TOOLPANE_GENERIC"),n=false,d=true,p="";if(a.getShowSearchTool()){n=true;p+="<a id='"+s+r.TOOL_PREFIX+s+"-searchTool' title='"+i.getText("SHELL_SEARCH")+"' class='sapUiUx3ShellTool sapUiUx3ShellTool-search' tabindex='0' role='button' aria-pressed='false'></a>";if(d){d=false}else{o+=","}o+=" "+i.getText("SHELL_SEARCH")}if(a.getShowFeederTool()){n=true;p+="<a id='"+s+r.TOOL_PREFIX+s+"-feederTool' title='"+i.getText("SHELL_FEEDER")+"' class='sapUiUx3ShellTool sapUiUx3ShellTool-feeder' tabindex='0' role='button' aria-pressed='false'></a>";if(d){d=false}else{o+=","}o+=" "+i.getText("SHELL_FEEDER")}if(n){t.write("<div role='toolbar'aria-describedby='"+s+"-genericToolsDescr'>");t.write("<span id='"+s+"-genericToolsDescr' style='display:none;'>"+o+"</span>");t.write(p+"</div>")}var c=a.getToolPopups();if(n&&c.length>0){t.write("<hr id='"+s+"-tp-separator' class='sapUiUx3ShellToolSep'>")}if(c.length>0){t.write("<div role='toolbar' aria-describedby='"+s+"-appToolsDescr'>");t.write("<span id='"+s+"-appToolsDescr' style='display:none;'>"+i.getText("SHELL_TOOLPANE_APP")+"</span>");for(var g=0;g<c.length;g++){var U=c[g];if(U instanceof sap.ui.core.SeparatorItem){t.write("<hr class='sapUiUx3ShellToolSep'>")}else{t.write("<a id='"+s+"-tool-"+U.getId()+"' class='sapUiUx3ShellTool'");var u=U.getTooltip_AsString();if(!u){u=U.getTitle()}if(u){t.write(" title='");t.writeEscaped(u);t.write("' ")}t.write(" tabindex='0' role='button' aria-pressed='false'>");var w=U.getIcon();if(e.isIconURI(w)){t.writeIcon(w,["sapUiUx3ShellToolFontIcon"],{title:null,"aria-label":null})}else{t.write("<img src='");t.writeEscaped(w);t.write("' alt='' role='presentation'>")}t.write("</a>")}}t.write("</div>")}t.write("<span class='sapUiUx3ShellFocusDummy' id='"+a.getId()+"-focusDummyTPEnd'"+l+"></span>")};s.renderPaneBarItems=function(e,t){var a=t.getId();var i=t.getPaneBarItems();var r=i.length;for(var s=0;s<r;s++){var l=i[s];var o=l.getId();e.write("<li");e.writeElementData(l);e.write(" role='tab' aria-controls='"+a+"-paneContent' aria-setsize='"+r+"' aria-posinset='"+(s+1)+"' tabindex='-1' class='sapUiUx3ShellPaneEntry");if(t._sOpenPaneId===o){e.write(" sapUiUx3ShellPaneEntrySelected")}e.write("'");if(l.getTooltip_AsString()){e.writeAttributeEscaped("title",l.getTooltip_AsString())}e.write(">");e.writeEscaped(l.getText().toUpperCase());e.write("</li>")}};s.renderNotificationArea=function(e,t){e.write("<div class='sapUiUx3ShellNotifyBG'></div>");if(t.getNotificationBar()){e.renderControl(t.getNotificationBar())}};s.renderWorksetItems=function(e,t){var a=t.getWorksetItems();t._oWorksetBar.setAssociatedItems(a);if(!t._oWorksetBar.isSelectedItemValid()&&a.length>0){t.setAssociation("selectedWorksetItem",a[0],true);t._oWorksetBar.setSelectedItem(a[0])}if(e){e.renderControl(t._oWorksetBar)}};s.renderFacetBar=function(e,t){var a=sap.ui.getCore().byId(t.getSelectedWorksetItem());if(a){var i=a.getParent();if(i&&i instanceof sap.ui.ux3.NavigationItem){a=i}var r=a.getSubItems();t._oFacetBar.setAssociatedItems(r);if(!t._oFacetBar.isSelectedItemValid()&&r.length>0){t._oFacetBar.setSelectedItem(r[0])}}if(e){e.renderControl(t._oFacetBar)}};return s},true);