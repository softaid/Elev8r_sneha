/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ObjectPageHeaderRenderer","./ObjectImageHelper"],function(e,t){"use strict";var a={apiVersion:2};a.render=function(e,t){var a=t.getParent(),n=a&&a.isA("sap.uxap.ObjectPageLayout"),s=a&&n?a.getHeaderTitle():undefined,r=a&&n?a.isA("sap.uxap.ObjectPageLayout")&&a.getShowTitleInHeaderContent():false,o=n&&a.getShowEditHeaderButton()&&t.getContent()&&t.getContent().length>0;if(o){e.openStart("div",t).class("sapUxAPObjectPageHeaderContentFlexBox").class("sapUxAPObjectPageHeaderContentDesign-"+t.getContentDesign());if(s){e.class("sapUxAPObjectPageContentObjectImage-"+s.getObjectImageShape())}e.openEnd()}e.openStart("div",o?undefined:t);if(o){e.class("sapUxAPObjectPageHeaderContentCellLeft")}else{e.class("sapUxAPObjectPageHeaderContentDesign-"+t.getContentDesign());if(s){e.class("sapUxAPObjectPageContentObjectImage-"+s.getObjectImageShape())}}e.class("sapContrastPlus").class("ui-helper-clearfix").class("sapUxAPObjectPageHeaderContent");if(!t.getVisible()){e.class("sapUxAPObjectPageHeaderContentHidden")}e.openEnd();if(n&&a.getIsChildPage()){e.openStart("div").class("sapUxAPObjectChildPage").openEnd().close("div")}if(r){this._renderTitleImage(e,t,s);if(t.getContent().length==0){e.openStart("span").class("sapUxAPObjectPageHeaderContentItem").openEnd();this._renderTitle(e,s);e.close("span")}}t.getContent().forEach(function(a,n){this._renderHeaderContentItem(a,n,e,r,s,t)},this);e.close("div");if(o){this._renderEditButton(e,t);e.close("div")}};a._renderHeaderContentItem=function(e,t,a,n,s,r){var o=false,i=false,d=r._getLayoutDataForControl(e),l=t===0;if(d){o=d.getShowSeparatorBefore();i=d.getShowSeparatorAfter();a.openStart("span").class("sapUxAPObjectPageHeaderWidthContainer").class("sapUxAPObjectPageHeaderContentItem").style("width",d.getWidth());if(i||o){a.class("sapUxAPObjectPageHeaderSeparatorContainer")}if(!d.getVisibleL()){a.class("sapUxAPObjectPageHeaderLayoutHiddenL")}if(!d.getVisibleM()){a.class("sapUxAPObjectPageHeaderLayoutHiddenM")}if(!d.getVisibleS()){a.class("sapUxAPObjectPageHeaderLayoutHiddenS")}a.openEnd();if(o){a.openStart("span").class("sapUxAPObjectPageHeaderSeparatorBefore").openEnd().close("span")}if(l&&n){this._renderTitle(a,s)}}else{if(l&&n){a.openStart("span").class("sapUxAPObjectPageHeaderContentItem").openEnd();this._renderTitle(a,s)}else{e.addStyleClass("sapUxAPObjectPageHeaderContentItem")}}a.renderControl(e);if(i){a.openStart("span").class("sapUxAPObjectPageHeaderSeparatorAfter").openEnd().close("span")}if(d||l&&n){a.close("span")}};a._renderTitleImage=function(e,a,n){t._renderImageAndPlaceholder(e,{oHeader:n,oObjectImage:a._getObjectImage(),oPlaceholder:a._getPlaceholder(),bIsObjectIconAlwaysVisible:false,bAddSubContainer:false,sBaseClass:"sapUxAPObjectPageHeaderContentImageContainer"})};a._renderTitle=function(t,a){e._renderObjectPageTitle(t,a,true)};a._renderEditButton=function(e,t){e.openStart("div").class("sapUxAPObjectPageHeaderContentCellRight").openEnd();e.renderControl(t.getAggregation("_editHeaderButton"));e.close("div")};return a},true);