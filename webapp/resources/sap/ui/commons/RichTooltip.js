/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./library","sap/ui/core/TooltipBase","./RichTooltipRenderer","./FormattedTextView","sap/ui/dom/jquery/control"],function(t,e,i,a,r){"use strict";var s=i.extend("sap.ui.commons.RichTooltip",{metadata:{library:"sap.ui.commons",deprecated:true,properties:{title:{type:"string",group:"Misc",defaultValue:null},imageSrc:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},valueStateText:{type:"string",group:"Misc",defaultValue:null},imageAltText:{type:"string",group:"Misc",defaultValue:null}},aggregations:{formattedText:{type:"sap.ui.commons.FormattedTextView",multiple:false,visibility:"hidden"},individualStateText:{type:"sap.ui.commons.FormattedTextView",multiple:false,visibility:"hidden"}}}});s.prototype.onAfterRendering=function(){var t=this.getAggregation("formattedText");if(t&&t.getDomRef()){t.$().attr("role","tooltip");if(this.getImageSrc()!==""){this.$().addClass("sapUiRttContentWide")}}};s.prototype.setValueStateText=function(t){var e=this.getAggregation("individualStateText");if(t){if(e){e.setHtmlText(t)}else{e=new r(this.getId()+"-valueStateText",{htmlText:t}).addStyleClass("sapUiRttValueStateText").addStyleClass("individual");this.setAggregation("individualStateText",e);this.setProperty("valueStateText",t,true)}}else{if(e){this.setAggregation("individualStateText",e)}}return this};s.prototype.getValueStateText=function(){var t=this.getAggregation("individualStateText");if(t){return t.getHtmlText()}return""};s.prototype.setText=function(t){if(t){t=t.replace(/(\r\n|\n|\r)/g,"<br>")}var e=this.getAggregation("formattedText");if(e){e.setHtmlText(t)}else{e=new r(this.getId()+"-txt");e.setHtmlText(t);e.addStyleClass("sapUiRttText");this.setAggregation("formattedText",e);this.setProperty("text",t,true)}return this};s.prototype.getText=function(){var t=this.getAggregation("formattedText");if(t){return t.getHtmlText()}return""};s.prototype.onfocusin=function(e){i.prototype.onfocusin.apply(this,arguments);var a=t(e.target).control(0);if(a!=null){var r=this.getId();var s="";if(this.getTitle()!==""){s+=r+"-title "}var o=this.$("valueStateText");if(o.length>0){s+=r+"-valueStateText "}if(this.getImageSrc()!==""){s+=r+"-image "}if(this.getText()!==""){s+=r+"-txt"}var l=a.getFocusDomRef();l.setAttribute("aria-describedby",s)}};return s});