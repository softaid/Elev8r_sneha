/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../i18n","sap/esh/search/ui/controls/SearchText","sap/esh/search/ui/controls/SearchLink","sap/esh/search/ui/SearchHelper","sap/esh/search/ui/controls/SearchRelatedObjectsToolbar","sap/m/Button","sap/m/library","sap/m/Label","sap/m/Text","sap/m/CheckBox","sap/ui/core/Icon","sap/ui/core/IconPool","sap/ui/core/InvisibleText","sap/ui/core/Control","../sinaNexTS/providers/abap_odata/UserEventLogger","../UIUtil"],function(e,t,i,s,a,r,l,n,o,d,u,h,c,p,g,m){function f(e){return e&&e.__esModule&&typeof e.default!=="undefined"?e.default:e}var b=f(e);var v=l["ButtonType"];var I=l["ListType"];var S=g["UserEventType"];var y=m["registerHandler"];var _=p.extend("sap.esh.search.ui.controls.SearchResultListItem",{renderer:{apiVersion:2,render:function e(t,i){i._renderer(t)}},metadata:{properties:{dataSource:"object",itemId:"string",title:"string",titleDescription:"string",titleNavigation:"object",titleIconUrl:"string",titleInfoIconUrl:"string",geoJson:"object",type:"string",imageUrl:"string",imageFormat:"string",imageNavigation:"object",attributes:{type:"object",multiple:true},navigationObjects:{type:"object",multiple:true},selected:"boolean",expanded:"boolean",parentListItem:"object",additionalParameters:"object",positionInList:"int",resultSetId:"string",layoutCache:"object",countBreadcrumbsHiddenElement:"object"},aggregations:{_titleLink:{type:"sap.esh.search.ui.controls.SearchLink",multiple:false,visibility:"hidden"},_titleLinkDescription:{type:"sap.esh.search.ui.controls.SearchText",multiple:false,visibility:"hidden"},_titleDelimiter:{type:"sap.m.Text",multiple:false,visibility:"hidden"},_typeText:{type:"sap.esh.search.ui.controls.SearchText",multiple:false,visibility:"hidden"},_typeLink:{type:"sap.esh.search.ui.controls.SearchLink",multiple:false,visibility:"hidden"},_typeLinkAriaDescription:{type:"sap.ui.core.InvisibleText",multiple:false,visibility:"hidden"},_multiLineDescriptionText:{type:"sap.esh.search.ui.controls.SearchText",multiple:false,visibility:"hidden"},_selectionCheckBox:{type:"sap.m.CheckBox",multiple:false,visibility:"hidden"},_expandButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_attributeLabels:{type:"sap.m.Label",multiple:true,visibility:"hidden"},_attributeValues:{type:"sap.ui.core.Control",multiple:true,visibility:"hidden"},_attributeValuesWithoutWhyfoundHiddenTexts:{type:"sap.ui.core.InvisibleText",multiple:true,visibility:"hidden"},_relatedObjectActionsToolbar:{type:"sap.esh.search.ui.controls.SearchRelatedObjectsToolbar",multiple:false,visibility:"hidden"},_titleLabeledByText:{type:"sap.ui.core.InvisibleText",multiple:false,visibility:"hidden"},_attributesLabeledByText:{type:"sap.ui.core.InvisibleText",multiple:false,visibility:"hidden"},_expandStateLabeledByText:{type:"sap.ui.core.InvisibleText",multiple:false,visibility:"hidden"}}},constructor:function e(s){var l=this;p.prototype.constructor.call(this,s);this._visibleAttributes=undefined;this._detailsArea=undefined;this._showExpandButton=false;this.setAggregation("_titleLink",(new i).addStyleClass("sapUshellSearchResultListItem-HeaderEntry").addStyleClass("sapUshellSearchResultListItem-Title").addStyleClass("sapUshellSearchResultListItem-MightOverflow").attachPress(function(e){var t=l._getPhoneSize();var i=$(window).width();if(i<=t){e.preventDefault();e.cancelBubble();l._performTitleNavigation()}else{l._performTitleNavigation({trackingOnly:true})}}));this.setAggregation("_titleLinkDescription",(new t).addStyleClass("sapUshellSearchResultListItem-HeaderEntry").addStyleClass("sapUshellSearchResultListItem-TitleDescription").addStyleClass("sapUshellSearchResultListItem-MightOverflow"));var n=new o({text:"|"});n.addEventDelegate({onAfterRendering:function e(){$(n.getDomRef()).attr("aria-hidden","true")}});this.setAggregation("_titleDelimiter",n.addStyleClass("sapUshellSearchResultListItem-HeaderEntry").addStyleClass("sapUshellSearchResultListItem-TitleDelimiter").addStyleClass("sapUshellSearchResultListItem-MightOverflow"));this.setAggregation("_typeText",(new t).addStyleClass("sapUshellSearchResultListItem-HeaderEntry").addStyleClass("sapUshellSearchResultListItem-TitleCategory").addStyleClass("sapUshellSearchResultListItem-MightOverflow"));this.setAggregation("_typeLinkAriaDescription",new c({text:b.getText("result_list_item_type_link_description")}));this.setAggregation("_typeLink",(new i).addStyleClass("sapUshellSearchResultListItem-HeaderEntry").addStyleClass("sapUshellSearchResultListItem-TitleCategoryLink").addStyleClass("sapUshellSearchResultListItem-MightOverflow").addAriaDescribedBy(this.getAggregation("_typeLinkAriaDescription")));this.setAggregation("_multiLineDescriptionText",new t("",{maxLines:5}).addStyleClass("sapUshellSearchResultListItem-MultiLineDescription").addStyleClass("sapUshellSearchResultListItem-MightOverflow").data("islongtext","true",true));this.setAggregation("_selectionCheckBox",new d({select:function e(t){l.setProperty("selected",t.getParameter("selected"),true);var i=l.getModel();i.updateMultiSelectionSelected();if(t.getParameter("selected")){l.addStyleClass("sapUshellSearchResultListItem-Selected")}else{l.removeStyleClass("sapUshellSearchResultListItem-Selected")}}}));this.setAggregation("_expandButton",new r({type:v.Transparent,press:function e(){l.toggleDetails()}}));this.setAggregation("_relatedObjectActionsToolbar",new a);this.setAggregation("_titleLabeledByText",new c);this.setAggregation("_attributesLabeledByText",new c);this.setAggregation("_expandStateLabeledByText",new c)},_renderer:function e(t){var i=$(this.getDomRef());var s=i.find(".sapUshellSearchResultListItem-RelatedObjectsToolbar");if(s.css("display")==="none"){var a=this.getModel();if(a.config.FF_optimizeForValueHelp){s.css("display","block")}}this._registerItemPressHandler();this._resetPrecalculatedValues();this._renderContainer(t);this._renderAccessibilityInformation(t)},_renderContainer:function e(t){var i;var s=this.getModel();t.openStart("div",this);t["class"]("sapUshellSearchResultListItem-Container");if(this.getProperty("imageUrl")){t["class"]("sapUshellSearchResultListItem-WithImage")}if(((i=this.getProperty("imageFormat"))===null||i===void 0?void 0:i.toLowerCase())==="documentthumbnail"){t["class"]("sapUshellSearchResultListItem-Document")}t.openEnd();this._renderContentContainer(t);if(!s.config.FF_optimizeForValueHelp){this._renderExpandButtonContainer(t)}t.close("div")},_renderContentContainer:function e(t){var i=this.getModel();t.openStart("div",this.getId()+"-content");t["class"]("sapUshellSearchResultListItem-Content");if(!i.config.FF_optimizeForValueHelp){t["class"]("sapUshellSearchResultListItem-ContentValueHelp")}t.openEnd();this._renderTitleContainer(t);this._renderAttributesContainer(t);t.close("div")},_renderExpandButtonContainer:function e(t){var i=this;t.openStart("div",this.getId()+"-expand-button-container");t["class"]("sapUshellSearchResultListItem-ExpandButtonContainer");t.openEnd();t.openStart("div",this.getId()+"-expand-button");t["class"]("sapUshellSearchResultListItem-ExpandButton");t.openEnd();var s,a;var r=this.getProperty("expanded");if(r){s=h.getIconURI("slim-arrow-up");a=b.getText("hideDetailBtn_tooltip")}else{s=h.getIconURI("slim-arrow-down");a=b.getText("showDetailBtn_tooltip")}var l=this.getAggregation("_expandButton");l.setIcon(s);l.setTooltip(a);l.addEventDelegate({onAfterRendering:function e(){i.setAriaExpandedState()}});t.renderControl(l);t.close("div");t.close("div")},_renderTitleContainer:function e(t){var i=this;var s=this.getModel();if(!s.config.FF_optimizeForValueHelp){t.openStart("div",this.getId()+"-title-and-image-container");t["class"]("sapUshellSearchResultListItem-TitleAndImageContainer");t.openEnd()}t.openStart("div",this.getId()+"-title-container");t["class"]("sapUshellSearchResultListItem-TitleContainer");if(s.config.FF_optimizeForValueHelp){t["class"]("sapUshellSearchResultListItem-TitleContainerValueHelp")}t.openEnd();this._renderCheckbox(t);var a="";var r;var l=this.getAggregation("_titleLink");var n=this.getProperty("title");if(!n||n.trim().length===0){n=_.noValue}else if(s.config.FF_optimizeForValueHelp){}else{var o=this.getProperty("titleNavigation");if(o){a=o.getHref();r=o.getTarget()}l.setHref(a);if(r){l.setTarget(r)}}l.setText(n);if(a.length===0){l.setEnabled(false)}l.addEventDelegate({onAfterRendering:function e(){i.forwardEllipsis($(l.getDomRef()))}});if(this.getProperty("titleIconUrl")&&this.getProperty("titleIconUrl")){var d=new u({src:this.getProperty("titleIconUrl")});l.setAggregation("icon",d)}t.renderControl(l);if(this.getProperty("titleInfoIconUrl")){var h=new u({src:this.getProperty("titleInfoIconUrl")});h.addStyleClass("sapUshellSearchResultListItem-TitleInfoIcon");if(s.config.FF_optimizeForValueHelp){h.addStyleClass("sapUshellSearchResultListItem-TitleInfoIconValueHelp")}t.renderControl(h)}if(!s.config.FF_optimizeForValueHelp){var c=this.getProperty("titleDescription");if(c&&c.trim().length>0){var p=this.getAggregation("_titleLinkDescription");p.setText(c);t.renderControl(p)}}if(s.config.FF_optimizeForValueHelp){this._renderRelatedObjectsToolbar(t)}else{var g=this.getAggregation("_titleDelimiter");t.renderControl(g);if(!s.config._eshClickableObjectType||s.getDataSource()===this.getProperty("dataSource")){var m=this.getAggregation("_typeText");m.setText(this.getProperty("type"));t.renderControl(m)}else{var f=this.getModel().getProperty("/uiFilter").clone();f.setDataSource(this.getProperty("dataSource"));var v=s.searchUrlParser.renderFromParameters(s.boTopDefault,f,true);var I=this.getAggregation("_typeLink");I.setText(this.getProperty("type"));I.setHref(v);I.setTooltip(b.getText("searchInDataSourceTooltip",[this.getProperty("dataSource").labelPlural]));t.renderControl(this.getAggregation("_typeLinkAriaDescription"));t.renderControl(I)}}t.close("div");if(!s.config.FF_optimizeForValueHelp){this._renderImageForPhone(t);t.close("div")}},_renderCheckbox:function e(t){t.openStart("div",this.getId()+"-checkbox-expand-container");t["class"]("sapUshellSearchResultListItem-CheckboxExpandContainer");t.openEnd();t.openStart("div",this.getId()+"-checkbox-container");t["class"]("sapUshellSearchResultListItem-CheckboxContainer");t.openEnd();t.openStart("div",this.getId()+"-checkbox-alignment-container");t["class"]("sapUshellSearchResultListItem-CheckboxAlignmentContainer");t.openEnd();var i=this.getAggregation("_selectionCheckBox");var s=this.getProperty("selected");i.setSelected(s);t.renderControl(i);t.close("div");t.close("div");t.close("div")},_renderImageForPhone:function e(t){if(this.getProperty("imageUrl")){t.openStart("div",this.getId()+"-title-image");t["class"]("sapUshellSearchResultListItem-TitleImage");if(this.getProperty("imageFormat")==="round"){t["class"]("sapUshellSearchResultListItem-ImageContainerRound")}t.openEnd();t.openStart("div",this.getId()+"-image-container-aligmnent-helper");t["class"]("sapUshellSearchResultListItem-ImageContainerAlignmentHelper");t.openEnd();t.close("div");t.openStart("img",this.getId()+"-image-1");t["class"]("sapUshellSearchResultListItem-Image");t.attr("src",this.getProperty("imageUrl"));t.openEnd();t.close("div");t.close("div")}},_renderImageForDocument:function e(t){if(this.getProperty("imageFormat")&&this.getProperty("imageFormat").toLowerCase()==="documentthumbnail"){var i=this.getProperty("imageNavigation");var s=i?i.getHref():"";var a=new u({src:h.getIconURI("search"),useIconTooltip:false});a.addStyleClass("sapUshellSearchResultListItem-DocumentThumbnailZoomIcon");var r=this.getProperty("imageUrl");t.openStart("div",this.getId()+"-document-thumbnail-container");t["class"]("sapUshellSearchResultListItem-DocumentThumbnailContainer");t.openEnd();if(s&&s.length>0){t.openStart("a",this.getId()+"-document-thumbnail-border-1");t.attr("href",s);t["class"]("sapUshellSearchResultListItem-DocumentThumbnailBorder");t.openEnd();t.openStart("div",this.getId()+"-document-thumbnail-dogear-1");t["class"]("sapUshellSearchResultListItem-DocumentThumbnail-DogEar");t.openEnd();t.close("div");t.renderControl(a);if(r&&r.length>0){t.openStart("img",this.getId()+"-document-thumbnail-1");t["class"]("sapUshellSearchResultListItem-DocumentThumbnail");t.attr("src",this.getProperty("imageUrl"));t.openEnd();t.close("img")}t.close("a")}else{t.openStart("div",this.getId()+"-document-thumbnail-border-2");t["class"]("sapUshellSearchResultListItem-DocumentThumbnailBorder");t.openEnd();t.openStart("div",this.getId()+"-document-thumbnail-dogear-2");t["class"]("sapUshellSearchResultListItem-DocumentThumbnail-DogEar");t.openEnd();t.close("div");t.renderControl(a);if(r&&r.length>0){t.openStart("img",this.getId()+"-document-thumbnail-2");t["class"]("sapUshellSearchResultListItem-DocumentThumbnail");t.attr("src",this.getProperty("imageUrl"));t.openEnd();t.close("img")}t.close("div")}t.close("div")}},_cutDescrAttributeOutOfAttributeList:function e(){var t=this.getProperty("attributes");for(var i=0;i<t.length;i++){var s=t[i];if(s.longtext){t.splice(i,1);this.setProperty("attributes",t);return s}}return undefined},_renderMultiLineDescription:function e(t){var i;if(((i=this.getProperty("imageFormat"))===null||i===void 0?void 0:i.toLowerCase())==="documentthumbnail"){var s;var a=this._cutDescrAttributeOutOfAttributeList();if((a===null||a===void 0?void 0:(s=a.value)===null||s===void 0?void 0:s.length)>0){var r=this.getAggregation("_multiLineDescriptionText");r.setText(a.value);if(a.whyfound){r.data("ishighlighted","true",true)}else{r.data("ishighlighted","false",true)}if(a.valueWithoutWhyfound){var l=new c({});l.setText(a.valueWithoutWhyfound);r.data("tooltippedBy",l.getId(),true);r.addEventDelegate({onAfterRendering:function e(){var t=$(r.getDomRef());t.attr("aria-describedby",t.attr("data-tooltippedby"))}});this.addAggregation("_attributeValuesWithoutWhyfoundHiddenTexts",l,true);t.renderControl(l)}t.renderControl(r)}else{t.openStart("div",this.getId()+"-multiline-description");t["class"]("sapUshellSearchResultListItem-MultiLineDescription");t.openEnd();t.close("div")}}},_renderAttributesContainer:function e(t){var i=this.getModel();t.openStart("div",this.getId()+"-attribute-expand-container");t["class"]("sapUshellSearchResultListItem-AttributesExpandContainer");if(i.config.FF_optimizeForValueHelp){t["class"]("sapUshellSearchResultListItem-AttributesExpandContainerValueHelp")}var s=this.getProperty("expanded");if(s){t["class"]("sapUshellSearchResultListItem-AttributesExpanded")}t.openEnd();t.openStart("div",this.getId()+"-attributes-and-actions");t["class"]("sapUshellSearchResultListItem-AttributesAndActions");t.openEnd();if(!i.config.FF_optimizeForValueHelp){this._renderImageForDocument(t);this._renderMultiLineDescription(t)}t.openStart("ul",this.getId()+"-attributes");t["class"]("sapUshellSearchResultListItem-Attributes");t.openEnd();var a=this.getProperty("attributes");if(!i.config.FF_optimizeForValueHelp){this._renderImageAttribute(t,a.length===0)}this._renderAllAttributes(t,a);if(!i.config.FF_optimizeForValueHelp){t.openStart("li",this.getId()+"-expand-spacer-attribute");t["class"]("sapUshellSearchResultListItem-ExpandSpacerAttribute");t.attr("aria-hidden","true");t.openEnd();t.close("li")}t.close("ul");if(!i.config.FF_optimizeForValueHelp){this._renderRelatedObjectsToolbar(t)}t.close("div");t.close("div")},_renderAllAttributes:function e(s,a){var r=this;var l=this.getModel();if(a.length===0){s.openStart("li",this.getId()+"-generic-attribute-1");s["class"]("sapUshellSearchResultListItem-GenericAttribute");if(l.config.FF_optimizeForValueHelp){s["class"]("sapUshellSearchResultListItem-GenericAttributeValueHelp")}s["class"]("sapUshellSearchResultListItem-MainAttribute");s["class"]("sapUshellSearchResultListItem-EmptyAttributePlaceholder");s.attr("aria-hidden","true");s.openEnd();s.close("li");return}var o;var d;var h;var p;var g,m,f;var b;var v;var I=this.getProperty("layoutCache")||{};this.setProperty("layoutCache",I,true);if(!I.attributes){I.attributes={}}var S=0,y=0;var L=4;var A=3;var x=[0,0,0];var R=[0,0,0,0];var T=2;var U=2;var C;var E=this.getProperty("imageFormat")&&this.getProperty("imageFormat").toLowerCase()==="documentthumbnail";var D=this.getProperty("imageUrl")&&!E&&!l.config.FF_optimizeForValueHelp;if(E&&!l.config.FF_optimizeForValueHelp){L=A=2;x=R=[0,0];T=U=4}var F=L*x.length;var P=A*R.length;if(D){F--;P--;x[0]++;R[0]++}this.destroyAggregation("_attributeLabels");this.destroyAggregation("_attributeValues");this.destroyAggregation("_attributeValuesWithoutWhyfoundHiddenTexts");var w=function e(t){return function(){var e=$(r.getDomRef());e.attr("aria-describedby",e.attr("data-tooltippedby"))}};for(;!(T<=0&&U<=0)&&S<a.length;S++){o=a[S];var O=this.getModel();if(O.config.FF_optimizeForValueHelp&&!o.whyfound){continue}if(E&&y>=4){break}if(o.isTitle){continue}if(F<=0&&P<=0&&!o.whyfound){continue}d=o.name;h=o.value;if(d===undefined||h===undefined){continue}if(!h||h.trim().length===0){h=_.noValue}if(o.longtext===undefined||o.longtext===null||o.longtext===""){f=false}else{f=true}p=o.valueWithoutWhyfound;var H=-1,k=-1,B={desktop:1,tablet:1};var V=I.attributes[o.key]||{};I.attributes[o.key]=V;s.openStart("li",this.getId()+"-generic-attribute-2-"+S);s["class"]("sapUshellSearchResultListItem-GenericAttribute");if(O.config.FF_optimizeForValueHelp){s["class"]("sapUshellSearchResultListItem-GenericAttributeValueHelp")}s["class"]("sapUshellSearchResultListItem-MainAttribute");if(f){C=V.longTextColumnNumber||this._howManyColumnsToUseForLongTextAttribute(p);V.longTextColumnNumber=C;B=C;s["class"]("sapUshellSearchResultListItem-LongtextAttribute")}if(F<=0){if(o.whyfound&&T>0){s["class"]("sapUshellSearchResultListItem-WhyFoundAttribute-Desktop");T--}else{s["class"]("sapUshellSearchResultListItem-DisplayNoneAttribute-Desktop")}}if(P<=0){if(o.whyfound&&U>0){s["class"]("sapUshellSearchResultListItem-WhyFoundAttribute-Tablet");U--}else{s["class"]("sapUshellSearchResultListItem-DisplayNoneAttribute-Tablet")}}if(f&&D&&x[0]===1){k=0;C=V.longTextColumnNumber.desktop<L?V.longTextColumnNumber.desktop:L-1;x[0]+=C;F-=C}else{for(var M=0;M<x.length;M++){if(x[M]+B.desktop<=L){x[M]+=B.desktop;F-=B.desktop;k=M;break}}}if(k<0){k=x.length}if(f&&D&&R[0]===1){H=0;C=V.longTextColumnNumber.tablet<A?V.longTextColumnNumber.tablet:A-1;R[0]+=C;P-=C}else{for(var j=0;j<R.length;j++){if(R[j]+B.tablet<=A){R[j]+=B.tablet;P-=B.tablet;H=j;break}}}if(H<0){H=R.length}s["class"]("sapUshellSearchResultListItem-OrderTablet-"+H);s["class"]("sapUshellSearchResultListItem-OrderDesktop-"+k);if(f){s.attr("data-sap-searchresultitem-attributeweight-desktop",B.desktop);s.attr("data-sap-searchresultitem-attributeweight-tablet",B.tablet)}s.openEnd();g=new n({displayOnly:true});g.setText(d);g.addStyleClass("sapUshellSearchResultListItem-AttributeKey");g.addStyleClass("sapUshellSearchResultListItem-MightOverflow");s.renderControl(g);s.openStart("span",this.getId()+"-attribute-value-container-"+S);s["class"]("sapUshellSearchResultListItem-AttributeValueContainer");if(O.config.FF_optimizeForValueHelp){s["class"]("sapUshellSearchResultListItem-AttributeValueContainerValueHelp")}s.openEnd();v=undefined;if(o.iconUrl){v=new u({src:o.iconUrl});v.addStyleClass("sapUshellSearchResultListItem-AttributeIcon")}if(o.defaultNavigationTarget){m=new i;m.setHref(o.defaultNavigationTarget.getHref());m.setTarget(o.defaultNavigationTarget.getTarget());m.addStyleClass("sapUshellSearchResultListItem-AttributeLink");if(v){m.setAggregation("icon",v)}}else{m=new t;if(v){m.setAggregation("icon",v)}}m.setText(h);m.addStyleClass("sapUshellSearchResultListItem-AttributeValue");m.addStyleClass("sapUshellSearchResultListItem-MightOverflow");if(o.whyfound){m.data("ishighlighted","true",true);m.addStyleClass("sapUshellSearchResultListItem-AttributeValueHighlighted")}if(f){m.data("islongtext","true",true)}if(p){b=new c({});b.addStyleClass("sapUshellSearchResultListItem-AttributeValueContainer-HiddenText");b.setText(p);m.data("tooltippedBy",b.getId(),true);m.addEventDelegate({onAfterRendering:w(m)});this.addAggregation("_attributeValuesWithoutWhyfoundHiddenTexts",b,true);s.renderControl(b)}s.renderControl(m);s.close("span");s.close("li");this.addAggregation("_attributeLabels",g,true);this.addAggregation("_attributeValues",m,true);y++}if(D){var z=L-x[0];var N=A-R[0];if(z>0||N>0){s.openStart("li",this.getId()+"-generic-attribute-3");s["class"]("sapUshellSearchResultListItem-GenericAttribute");if(l.config.FF_optimizeForValueHelp){s["class"]("sapUshellSearchResultListItem-GenericAttributeValueHelp")}s["class"]("sapUshellSearchResultListItem-MainAttribute");s["class"]("sapUshellSearchResultListItem-OrderTablet-0");s["class"]("sapUshellSearchResultListItem-OrderDesktop-0");s.attr("data-sap-searchresultitem-attributeweight-desktop",z);s.attr("data-sap-searchresultitem-attributeweight-tablet",N);s.openEnd();s.close("li")}}},_howManyColumnsToUseForLongTextAttribute:function e(t){if(t.length<50){return{tablet:1,desktop:1}}if(t.length<85){return{tablet:2,desktop:2}}if(t.length<135){return{tablet:3,desktop:3}}return{tablet:3,desktop:4}},_renderImageAttribute:function e(t,i){var s=this.getModel();if(!this.getProperty("imageUrl")||this.getProperty("imageFormat")&&this.getProperty("imageFormat").toLowerCase()==="documentthumbnail"){return}t.openStart("li",this.getId()+"-generic-attribute-4");t["class"]("sapUshellSearchResultListItem-GenericAttribute");if(s.config.FF_optimizeForValueHelp){t["class"]("sapUshellSearchResultListItem-GenericAttributeValueHelp")}t["class"]("sapUshellSearchResultListItem-ImageAttribute");if(i){t["class"]("sapUshellSearchResultListItem-LonelyImageAttribute")}t.openEnd();t.openStart("div",this.getId()+"-image-container");t["class"]("sapUshellSearchResultListItem-ImageContainer");if(this.getProperty("imageFormat")==="round"){t["class"]("sapUshellSearchResultListItem-ImageContainerRound")}t.openEnd();if(this.getProperty("imageUrl")){t.openStart("img",this.getId()+"-image-2");t["class"]("sapUshellSearchResultListItem-Image");if(this.getProperty("imageFormat")==="round"){}t.attr("src",this.getProperty("imageUrl"));t.openEnd();t.close("img")}if(this.getProperty("imageFormat")!=="round"){t.openStart("div",this.getId()+"-image-container-aligment-helper");t["class"]("sapUshellSearchResultListItem-ImageContainerAlignmentHelper");t.openEnd();t.close("div")}t.close("div");t.close("li")},_renderRelatedObjectsToolbar:function e(t){var i=this.getProperty("navigationObjects");if(!i||i.length===0){return}this._showExpandButton=true;var s=this.getAggregation("_relatedObjectActionsToolbar");s.setProperty("navigationObjects",i);s.setProperty("positionInList",this.getProperty("positionInList"));t.renderControl(s)},_renderAccessibilityInformation:function e(t){var i=this;var s=this.getProperty("parentListItem");if(s){this._renderAriaDescriptionElementForTitle(t,true,true);this._renderAriaDescriptionElementForAttributes(t,true);this._renderAriaDescriptionElementForCollapsedOrExpandedState(t,true);s.addEventDelegate({onAfterRendering:function e(){var a=$(s.getDomRef());i._addAriaDescriptionToParentListElement(s,true);y("acc-listitem-focusin",a,"focusin",function(e){var a=$(e.relatedTarget);if(a.hasClass("sapUshellSearchResultListItem")||a.closest(".sapUshellSearchResultListItemApps").length>0&&!a.hasClass("sapUshellResultListMoreFooter")){i._renderAriaDescriptionElementForTitle(t,false,false);i._renderAriaDescriptionElementForAttributes(t,false);i._renderAriaDescriptionElementForCollapsedOrExpandedState(t,false);i._addAriaDescriptionToParentListElement(s,false)}else{i._renderAriaDescriptionElementForTitle(t,true,false);i._renderAriaDescriptionElementForAttributes(t,false);i._renderAriaDescriptionElementForCollapsedOrExpandedState(t,false);i._addAriaDescriptionToParentListElement(s,true)}})},onsapspace:function e(t){if(t["target"]===t["currentTarget"]){i.toggleDetails()}},onsapenter:function e(t){if(t["target"]===t["currentTarget"]){var s=i.getProperty("titleNavigation");if(s){s.performNavigation()}}}})}},getAccessibilityInfo:function e(){var t={};if(sap.ui.core.Control.prototype.getAccessibilityInfo){for(var i=arguments.length,s=new Array(i),a=0;a<i;a++){s[a]=arguments[a]}t=sap.ui.core.Control.prototype.getAccessibilityInfo.apply(this,s)||t}t["description"]="";return t},_renderAriaDescriptionElementForTitle:function e(t,i,s){this._searchResultListPrefix=this._searchResultListPrefix||b.getText("result_list_announcement_screenreaders");var a=this.getProperty("title")+", "+this.getProperty("type")+".";if(i){a=this._searchResultListPrefix+" "+a}var r=this.getAggregation("_titleLabeledByText");if(r){r.setText(a)}if(s&&t){t.renderControl(r)}},_renderAriaDescriptionElementForAttributes:function e(t,i){var s=this.getAggregation("_attributesLabeledByText");var a=$(this.getDomRef()).find(".sapUshellSearchResultListItem-Attributes").find(".sapUshellSearchResultListItem-MainAttribute");var r;if(a.length===0){r=b.getText("result_list_item_aria_no_attributes")}else{r=b.getText("result_list_item_aria_has_attributes");a.each(function(){var e=$(this);if(e.is(":visible")&&e.attr("aria-hidden")!=="true"){var t=e.find(".sapUshellSearchResultListItem-AttributeKey").text();var i=e.find(".sapUshellSearchResultListItem-AttributeValueContainer");var s=i.find(".sapUshellSearchResultListItem-AttributeValueContainer-HiddenText");if(s.length===0){s=i.find(".sapUshellSearchResultListItem-AttributeValue")}var a=s.text();r+=b.getText("result_list_item_aria_attribute_and_value",[t,a])}})}if(s){s.setText(r)}if(i&&t){t.renderControl(s)}},_renderAriaDescriptionElementForCollapsedOrExpandedState:function e(t,i){var s=this.getAggregation("_expandStateLabeledByText");var a;var r=this.getAggregation("_expandButton");if(!r){return}var l=$(r.getDomRef());if(l.css("visibility")!=="hidden"){if(this.isShowingDetails()){a=b.getText("result_list_item_aria_expanded");var n=this.getProperty("navigationObjects");if(n&&n.length>0){a=b.getText("result_list_item_aria_has_links")+a}}else{a=b.getText("result_list_item_aria_collapsed")}}s.setText(a);if(i&&t){t.renderControl(s)}},_addAriaDescriptionToParentListElement:function e(t,i){var s=this.getAggregation("_titleLabeledByText");if(!s){return}var a=s.getId();if(i){var r=this.getProperty("countBreadcrumbsHiddenElement");if(r){a+=" "+r.getId()}}var l=this.getAggregation("_attributesLabeledByText");a+=" "+l.getId();var n=this.getAggregation("_expandStateLabeledByText");a+=" "+n.getId();var o=$(t.getDomRef());o.attr("aria-labelledby",a)},_getExpandAreaObjectInfo:function e(){var t=this.getModel();var i=$(this.getDomRef());i.addClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");var s=i.find(".sapUshellSearchResultListItem-AttributesExpandContainer");var a=i.find(".sapUshellSearchResultListItem-RelatedObjectsToolbar");var r=false;if(a.css("display")==="none"&&!t.config.FF_optimizeForValueHelp){a.css("display","block");r=true}var l=s.height();var n=i.find(".sapUshellSearchResultListItem-AttributesAndActions").height();i.removeClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");if(r){a.css("display","")}var o=this._getElementsInExpandArea();var d=200;var u=d/10;var h={resultListItem:i,attributesExpandContainer:s,currentHeight:l,expandedHeight:n,elementsToFadeInOrOut:o,expandAnimationDuration:d,fadeInOrOutAnimationDuration:u,relatedObjectsToolbar:a};return h},_getElementsInExpandArea:function e(){var t=$(this.getDomRef());var i=[];t.addClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");var s=t.find(".sapUshellSearchResultListItem-GenericAttribute:not(.sapUshellSearchResultListItem-ImageAttribute)");if(s.length>0){var a=s.position().top;s.each(function(){if($(this).position().top>a){i.push(this)}})}t.removeClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");return i},isShowingDetails:function e(){var t=this._getExpandAreaObjectInfo();if(t.currentHeight<t.expandedHeight){return false}return true},showDetails:function e(){var t=this;if(this.isShowingDetails()){return}var i=this._getExpandAreaObjectInfo();i.relatedObjectsToolbar["css"]("opacity",0);i.relatedObjectsToolbar["css"]("display","block");var s=this.getAggregation("_relatedObjectActionsToolbar");if(s){s.layoutToolbarElements()}this.forwardEllipsis($(t.getDomRef()).find(".sapUshellSearchResultListItem-Title, .sapUshellSearchResultListItem-AttributeKey, .sapUshellSearchResultListItem-AttributeValueHighlighted"));$(this.getDomRef()).addClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");var a,r=false;var l=i.attributesExpandContainer["animate"]({height:i.expandedHeight},{duration:i.expandAnimationDuration,progress:function e(s,n,o){if(!r&&n>.5){a=i.relatedObjectsToolbar["animate"]({opacity:1},o).promise();r=true;jQuery.when(l,a).done(function(){t.setProperty("expanded",true,true);$(this).addClass("sapUshellSearchResultListItem-AttributesExpanded");$(this).css("height","");$(i.elementsToFadeInOrOut).css("opacity","");$(t.getDomRef()).removeClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");var e=h.getIconURI("slim-arrow-up");var s=t.getAggregation("_expandButton");s.setTooltip(b.getText("hideDetailBtn_tooltip"));s.setIcon(e);s.rerender();i.relatedObjectsToolbar["css"]("display","");i.relatedObjectsToolbar["css"]("opacity","");t._renderAriaDescriptionElementForAttributes(undefined,false);t._renderAriaDescriptionElementForCollapsedOrExpandedState(undefined,false)}.bind(this))}}}).promise();$(i.elementsToFadeInOrOut).animate({opacity:1},i.fadeInOrOutAnimationDuration)},hideDetails:function e(){var t=this;var i=$(this.getDomRef());if(!this.isShowingDetails()){return}var s=this._getExpandAreaObjectInfo();s.relatedObjectsToolbar["css"]("opacity",1);s.relatedObjectsToolbar["animate"]({opacity:0},s.expandAnimationDuration/2);var a=i.find(".sapUshellSearchResultListItem-MainAttribute").outerHeight(true)+i.find(".sapUshellSearchResultListItem-ExpandSpacerAttribute").outerHeight(true);var r=false;var l=s.attributesExpandContainer["animate"]({height:a},{duration:s.expandAnimationDuration,progress:function e(i,a,n){if(!r&&n<=s.fadeInOrOutAnimationDuration){r=true;var o=$(s.elementsToFadeInOrOut).animate({opacity:0},s.fadeInOrOutAnimationDuration).promise();jQuery.when(l,o).done(function(){t.setProperty("expanded",false,true);s.attributesExpandContainer["removeClass"]("sapUshellSearchResultListItem-AttributesExpanded");$(s.elementsToFadeInOrOut).css("opacity","");s.relatedObjectsToolbar["css"]("opacity","");var e=h.getIconURI("slim-arrow-down");var i=t.getAggregation("_expandButton");i.setTooltip(b.getText("showDetailBtn_tooltip"));i.setIcon(e);i.rerender();t._renderAriaDescriptionElementForAttributes(undefined,false);t._renderAriaDescriptionElementForCollapsedOrExpandedState(undefined,false)})}}}).promise()},toggleDetails:function e(){var t;var i=this.getModel();if(this.isShowingDetails()){t=S.ITEM_HIDE_DETAILS;this.hideDetails()}else{t=S.ITEM_SHOW_DETAILS;this.showDetails()}i.eventLogger.logEvent({type:t,itemPosition:this.getProperty("positionInList"),executionId:this.getProperty("resultSetId")})},isSelectionModeEnabled:function e(){var t=false;var i=$(this.getDomRef()).find(".sapUshellSearchResultListItem-multiSelect-selectionBoxContainer");if(i){t=i.css("opacity")>0}return t},enableSelectionMode:function e(){var t=$(this.getDomRef()).find(".sapUshellSearchResultListItem-multiSelect-innerContainer");var i=t.find(".sapUshellSearchResultListItem-multiSelect-selectionBoxContainer");var s=200;var a=false;t.animate({width:"2rem"},{duration:s,progress:function e(t,r){if(!a&&r>.5){i.css("display","");i.animate({opacity:"1.0"},s/2);a=true}}})},disableSelectionMode:function e(){var t=$(this.getDomRef()).find(".sapUshellSearchResultListItem-multiSelect-innerContainer");var i=t.find(".sapUshellSearchResultListItem-multiSelect-selectionBoxContainer");var s=200;i.animate({opacity:"0.0"},s/2,function(){i.css("display","none")});t.animate({width:"0"},s)},toggleSelectionMode:function e(t){if(this.isSelectionModeEnabled()){this.disableSelectionMode()}else{this.enableSelectionMode()}},onAfterRendering:function e(){var t=$(this.getDomRef());this._showOrHideExpandButton();this._setListItemStatusBasedOnWindowSize();this._renderAriaDescriptionElementForTitle(undefined,false,false);this._renderAriaDescriptionElementForAttributes(undefined,false);this._renderAriaDescriptionElementForCollapsedOrExpandedState(undefined,false);this.forwardEllipsis(t.find(".sapUshellSearchResultListItem-Title, .sapUshellSearchResultListItem-AttributeKey, .sapUshellSearchResultListItem-AttributeValueHighlighted"));s.attachEventHandlersForTooltip(this.getDomRef())},resizeEventHappened:function e(){var t=$(this.getDomRef());this._showOrHideExpandButton();this._setListItemStatusBasedOnWindowSize();this.getAggregation("_titleLink").rerender();this.forwardEllipsis(t.find(".sapUshellSearchResultListItem-Title, .sapUshellSearchResultListItem-AttributeKey, .sapUshellSearchResultListItem-AttributeValueHighlighted"))},_getPhoneSize:function e(){return 767},_resetPrecalculatedValues:function e(){this._visibleAttributes=undefined;this._detailsArea=undefined;this._showExpandButton=false},_setListItemStatusBasedOnWindowSize:function e(){var t=window.innerWidth;var i=this.getProperty("parentListItem");if(this.getProperty("titleNavigation")&&t<=this._getPhoneSize()){i.setType(I.Active)}else{i.setType(I.Inactive)}},_showOrHideExpandButton:function e(){var t;var i=$(this.getDomRef());var s=i.find(".sapUshellSearchResultListItem-ExpandButtonContainer");var a=s.css("visibility")!=="hidden";var r=false;var l=((t=this.getProperty("imageFormat"))===null||t===void 0?void 0:t.toLowerCase())==="documentthumbnail";if(!l){var n=i.find(".sapUshellSearchResultListItem-RelatedObjectsToolbar");r=n.length>0}if(!l&&!r){var o=this._getElementsInExpandArea();if(o.length>0){r=true}}if(a&&!r){s.css("visibility","hidden");s.attr("aria-hidden","true");this.setAriaExpandedState()}else if(!a&&r){s.css("visibility","");s.removeAttr("aria-hidden");this.setAriaExpandedState()}},setAriaExpandedState:function e(){var t=this.getAggregation("_expandButton");if(!t){return}var i=$(t.getDomRef());var s=$(this.getDomRef());var a=this.getProperty("parentListItem")?$(this.getProperty("parentListItem").getDomRef()):s.closest("li");var r=s.find(".sapUshellSearchResultListItem-ExpandButtonContainer");if(r.css("visibility")==="hidden"){i.removeAttr("aria-expanded");a.removeAttr("aria-expanded")}else{var l=this.getProperty("expanded");if(l){i.attr("aria-expanded","true");a.attr("aria-expanded","true")}else{i.attr("aria-expanded","false");a.attr("aria-expanded","false")}}},_registerItemPressHandler:function e(){var t=this;var i=this.getProperty("parentListItem");if(i){i.attachPress(function(){t._performTitleNavigation()});this._registerItemPressHandler=function(){}}},_performTitleNavigation:function e(t){var i=t&&t.trackingOnly||false;var s=this.getProperty("titleNavigation");if(s){s.performNavigation({trackingOnly:i})}},forwardEllipsis:function e(t){var i=$(this.getDomRef());i.addClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");t.each(function(e,t){s.forwardEllipsis4Whyfound(t)});i.removeClass("sapUshellSearchResultListItem-AttributesPrepareExpansion")}});_.noValue="–";return _})})();