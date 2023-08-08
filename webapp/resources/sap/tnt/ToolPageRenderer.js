/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device"],function(e){"use strict";var n={apiVersion:2};n.render=function(e,n){e.openStart("div",n).class("sapTntToolPage").openEnd();this.renderHeaderWrapper(e,n);this.renderContentWrapper(e,n);e.close("div")};n.renderHeaderWrapper=function(e,n){var t=n.getHeader(),a=n.getSubHeader();if(t||a){e.openStart("div").class("sapTntToolPageHeaderWrapper").openEnd()}if(t){e.openStart("header").openEnd();e.openStart("div",n.getId()+"-header").class("sapTntToolPageHeader").openEnd();e.renderControl(t);e.close("div");e.close("header")}if(a&&a.getVisible()){e.openStart("header").openEnd();e.openStart("div",n.getId()+"-subHeader").class("sapTntToolPageHeader").openEnd();e.renderControl(a);e.close("div");e.close("header")}if(t||a){e.close("div")}};n.renderContentWrapper=function(n,t){n.openStart("div").class("sapTntToolPageContentWrapper");if(!e.system.desktop||!t.getSideExpanded()){n.class("sapTntToolPageAsideCollapsed")}n.openEnd();this.renderAsideContent(n,t);this.renderMainContent(n,t);n.close("div")};n.renderAsideContent=function(n,t){var a=t.getSideContent();if(!a||!a.getVisible()){return}n.openStart("aside",t.getId()+"-aside").class("sapTntToolPageAside").openEnd();n.openStart("div").class("sapTntToolPageAsideContent").openEnd();var o=t.getSideExpanded();if(a&&a.getExpanded()!==o){a.setExpanded(o)}if(!e.system.desktop){t.setSideExpanded(false)}n.renderControl(a);n.close("div");n.close("aside")};n.renderMainContent=function(e,n){var t=n.getMainContents();if(!t){return}e.openStart("div",n.getId()+"-main").class("sapTntToolPageMain").openEnd();e.openStart("div").class("sapTntToolPageMainContent").openEnd();e.openStart("div").class("sapTntToolPageMainContentWrapper").openEnd();t.forEach(e.renderControl,e);e.close("div");e.close("div");e.close("div")};return n},true);