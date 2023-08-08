/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/security/encodeXML"],function(e){"use strict";var a={};a.render=function(e,t){var r=t.getId();e.addClass("sapUiUx3NavBar").addClass("sapUiUx3NavBarUpperCaseText");if(t.getToplevelVariant()){e.addClass("sapUiUx3NavBarToplevel")}e.write("<nav");e.writeControlData(t);e.writeClasses();e.write("role='navigation'>");e.write("<ul id='"+r+"-list' role='menubar' class='sapUiUx3NavBarList'");e.addStyle("white-space","nowrap");e.writeStyles();e.write(">");a.renderItems(e,t);e.write("</ul>");e.write("<a id='"+r+"-ofb' role='presentation' class='sapUiUx3NavBarBack' href='#'></a>");e.write("<a id='"+r+"-off' role='presentation' class='sapUiUx3NavBarForward' href='#'></a>");e.write("<a id='"+r+"-ofl' role='presentation' class='sapUiUx3NavBarOverflowBtn' href='#'>");e.writeIcon("sap-icon://overflow",[],{id:r+"-oflt"});e.write("</a>");e.write("</nav>")};a.renderItems=function(a,t){var r=t.getItems();var i=false;if(!r||r.length==0){r=t.getAssociatedItems();i=true}var s=r.length;a.write("<li");a.addStyle("display","inline-block");a.writeStyles();a.write(">");a.write("<a id='"+t.getId()+"-dummyItem' class='sapUiUx3NavBarDummyItem sapUiUx3NavBarItem'>&nbsp;</a></li>");var l=t.getSelectedItem();for(var o=0;o<s;o++){var n=i?sap.ui.getCore().byId(r[o]):r[o];if(n.getVisible()){var w=n.getId();var d=w==l;a.write("<li");a.addStyle("display","inline-block");a.writeStyles();if(d){a.write(" class='sapUiUx3NavBarItemSel'")}a.write("><a ");a.writeElementData(n);a.writeAttributeEscaped("href",n.getHref()||"#");a.write(" aria-setsize='"+s+"' aria-posinset='"+(o+1)+"' role='menuitemradio' class='sapUiUx3NavBarItem'");if(d){a.write(" tabindex='0'")}a.write(" aria-checked='"+(d?"true":"false")+"'");var p=n.getTooltip_AsString();if(p){a.write(" title='"+e(p)+"'")}a.write(">");a.write(e(n.getText()));a.write("</a></li>")}}var v;if(t._bRtl){v="right:"+t._iLastArrowPos}else{v="left:"+t._iLastArrowPos}a.write("<span id='"+t.getId()+"-arrow' style='"+v+"px;");a.write("' class='sapUiUx3NavBarArrow'></span>")};return a},true);