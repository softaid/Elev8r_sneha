/*!
* OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(["./BaseContent","./ObjectContentRenderer","sap/ui/integration/library","sap/m/library","sap/m/FlexItemData","sap/m/HBox","sap/m/VBox","sap/m/Text","sap/m/Avatar","sap/m/Link","sap/m/Label","sap/m/ObjectStatus","sap/m/ComboBox","sap/m/TextArea","sap/base/Log","sap/base/util/isEmptyObject","sap/base/util/isPlainObject","sap/base/util/merge","sap/base/util/deepExtend","sap/ui/core/ResizeHandler","sap/ui/layout/AlignedFlowLayout","sap/ui/dom/units/Rem","sap/ui/integration/util/BindingHelper","sap/ui/integration/util/BindingResolver","sap/ui/integration/util/Utils","sap/ui/integration/util/Forms","sap/f/AvatarGroup","sap/f/AvatarGroupItem","sap/f/cards/NumericIndicators","sap/f/cards/NumericSideIndicator","sap/f/library","sap/m/OverflowToolbar","sap/m/OverflowToolbarButton","sap/ui/core/ListItem"],function(e,t,a,i,r,n,o,s,l,p,u,d,c,f,h,m,g,v,b,y,C,I,_,w,S,x,A,F,B,G,E,O,P,L){"use strict";var j=i.AvatarSize;var T=i.AvatarColor;var V=i.ButtonType;var D=i.FlexRendertype;var R=i.FlexJustifyContent;var z=a.CardActionArea;var k=E.AvatarGroupType;var M=i.ToolbarStyle;var U=e.extend("sap.ui.integration.cards.ObjectContent",{metadata:{library:"sap.ui.integration"},renderer:t});U.prototype.exit=function(){e.prototype.exit.apply(this,arguments);delete this._aValidationControls;if(this._sResizeListenerId){y.deregister(this._sResizeListenerId);this._sResizeListenerId=""}};U.prototype.onDataChanged=function(){if(!this._hasData()){this.getParent()._handleError("No items available",true)}this._validateInputFields(false)};U.prototype.validateControls=function(){this._validateInputFields(true)};U.prototype._validationControlChanged=function(e){x.validateControl(e.getSource(),this.getCardInstance(),true)};U.prototype._validateInputFields=function(e){(this._aValidationControls||[]).forEach(function(t){x.validateControl(t,this.getCardInstance(),e)}.bind(this))};U.prototype._prepareValidationControl=function(e,t,a,i){var r=b({},t);e.attachEvent(a,this._validationControlChanged.bind(this));this._aValidationControls.push(e);if(r.validations){r.validations.forEach(function(e,t){if(e.pattern){e.pattern=this.getCardInstance().getManifestEntry(i+"/validations/"+t)["pattern"]}}.bind(this))}e._oItem=r};U.prototype._hasData=function(){var e=this.getConfiguration();if(!e.hasOwnProperty("hasData")){return true}var t=w.resolveValue(e.hasData,this,this.getBindingContext().getPath());if(Array.isArray(t)&&!t.length||g(t)&&m(t)){return false}return!!t};U.prototype.setConfiguration=function(t){e.prototype.setConfiguration.apply(this,arguments);t=this.getParsedConfiguration();if(!t){return this}this._aValidationControls=[];if(t.groups){this._addGroups(t)}return this};U.prototype.getStaticConfiguration=function(){var e=this.getParsedConfiguration(),t;if(!this.getBindingContext()){return e}else{t=this.getBindingContext().getPath()}if(e.groups){e.groups.forEach(function(e){var a=[];if(e.items){e.items.forEach(function(e){var i=t+e.path,r=this._resolveGroupItem(e,i);a.push(r)}.bind(this))}e.items=a}.bind(this))}return e};U.prototype._resolveGroupItem=function(e,t){var a={},i=[];if(e.type==="ButtonGroup"||e.type==="IconGroup"){var r=e.template,n=this.getModel().getProperty(t);n.forEach(function(e,a){var n=w.resolveValue(r,this,t+"/"+a+"/");i.push(n)}.bind(this));a=v({},e);a.items=i;delete a.path;delete a.template;return a}else{return e}};U.prototype._getRootContainer=function(){var e=this.getAggregation("_content");if(!e){e=new o({renderType:D.Bare});this.setAggregation("_content",e);this._sResizeListenerId=y.register(e,this._onResize.bind(this))}return e};U.prototype._addGroups=function(e){var t=this._getRootContainer(),a,i=true,n=e.groups||[];this._formElementsIds=new Set;n.forEach(function(e,o){var s=this._createGroup(e,"/sap.card/content/groups/"+o);if(e.alignment==="Stretch"){s.setLayoutData(new r({growFactor:1}));t.addItem(s);i=true}else{if(i){a=this._createAFLayout();t.addItem(a);i=false}a.addContent(s)}if(o===n.length-1){s.addStyleClass("sapFCardObjectGroupLastInColumn")}},this);this._oActions.attach({area:z.Content,actions:e.actions,control:this})};U.prototype._createGroup=function(e,t){var a;if(typeof e.visible=="string"){a=!S.hasFalsyValueAsString(e.visible)}else{a=e.visible}var i=new o({visible:a,renderType:D.Bare}).addStyleClass("sapFCardObjectGroup");if(e.title){i.addItem(new s({text:e.title,maxLines:e.titleMaxLines||1}).addStyleClass("sapFCardObjectItemTitle sapMTitle sapMTitleStyleAuto"));i.addStyleClass("sapFCardObjectGroupWithTitle")}e.items.forEach(function(a,r){a.labelWrapping=e.labelWrapping;this._createGroupItems(a,t+"/items/"+r).forEach(i.addItem,i)},this);return i};U.prototype._createGroupItems=function(e,t){var a=e.label,i,r,s;if(typeof e.visible=="string"){r=!S.hasFalsyValueAsString(e.visible)}else{r=e.visible}if(a){a=_.formattedProperty(a,function(e){return e&&(e[e.length-1]===":"?e:e+":")});i=new u({text:a,visible:r,wrapping:e.labelWrapping}).addStyleClass("sapFCardObjectItemLabel");i.addEventDelegate({onBeforeRendering:function(){i.setVisible(i.getVisible()&&!!i.getText())}})}s=this._createItem(e,r,i,t);if(s){s.addStyleClass("sapFCardObjectItemValue")}if(e.icon){var l=new o({renderType:D.Bare,justifyContent:R.Center,items:[i,s]}).addStyleClass("sapFCardObjectItemPairContainer");var p=new n({visible:r,renderType:D.Bare,items:[this._createGroupItemAvatar(e.icon),l]}).addStyleClass("sapFCardObjectItemLabel");return[p]}else{return[i,s]}};U.prototype._createGroupItemAvatar=function(e){var t=_.formattedProperty(e.src,function(e){return this._oIconFormatter.formatSrc(e)}.bind(this));var a=e.initials||e.text;var i=new l({displaySize:e.size||j.XS,src:t,initials:a,displayShape:e.shape,tooltip:e.alt,backgroundColor:e.backgroundColor||(a?undefined:T.Transparent),visible:e.visible}).addStyleClass("sapFCardObjectItemAvatar sapFCardIcon");return i};U.prototype._createItem=function(e,t,a,i){var r,n=e.value,o=e.tooltip,s;switch(e.type){case"NumericData":r=this._createNumericDataItem(e,t);break;case"Status":r=this._createStatusItem(e,t);break;case"IconGroup":r=this._createIconGroupItem(e,t);break;case"ButtonGroup":r=this._createButtonGroupItem(e,t);break;case"ComboBox":r=this._createComboBoxItem(e,t,a,i);break;case"TextArea":r=this._createTextAreaItem(e,t,a,i);break;case"link":h.warning("Usage of Object Group Item property 'type' with value 'link' is deprecated. Use Card Actions for navigation instead.",null,"sap.ui.integration.widgets.Card");r=new p({href:e.url||n,text:n,tooltip:o,target:e.target||"_blank",visible:_.reuse(t)});break;case"email":h.warning("Usage of Object Group Item property 'type' with value 'email' is deprecated. Use Card Actions for navigation instead.",null,"sap.ui.integration.widgets.Card");var l=[];if(e.value){l.push(e.value)}if(e.emailSubject){l.push(e.emailSubject)}s=_.formattedProperty(l,function(e,t){if(t){return"mailto:"+e+"?subject="+t}else{return"mailto:"+e}});r=new p({href:s,text:n,tooltip:o,visible:_.reuse(t)});break;case"phone":h.warning("Usage of Object Group Item property 'type' with value 'phone' is deprecated. Use Card Actions for navigation instead.",null,"sap.ui.integration.widgets.Card");s=_.formattedProperty(n,function(e){return"tel:"+e});r=new p({href:s,text:n,tooltip:o,visible:_.reuse(t)});break;default:r=this._createTextItem(e,t,a)}return r};U.prototype._createNumericDataItem=function(e,t){var a=new o({visible:_.reuse(t)});var i=new B({number:e.mainIndicator.number,numberSize:e.mainIndicator.size,scale:e.mainIndicator.unit,trend:e.mainIndicator.trend,state:e.mainIndicator.state}).addStyleClass("sapUiIntOCNumericIndicators");a.addItem(i);if(e.sideIndicators){e.sideIndicators.forEach(function(e){i.addSideIndicator(new G({title:e.title,number:e.number,unit:e.unit,state:e.state}))})}if(e.details){a.addItem(new s({text:e.details,maxLines:1}).addStyleClass("sapUiIntOCNumericIndicatorsDetails"))}return a};U.prototype._createStatusItem=function(e,t){var a=new d({text:e.value,visible:_.reuse(t),state:e.state});return a};U.prototype._createTextItem=function(e,t,a){var i=e.value,r=e.tooltip,o;if(i&&e.actions){o=new p({text:i,tooltip:r,visible:_.reuse(t)});if(a){o.addAriaLabelledBy(a)}else{h.warning("Missing label for Object group item with actions.",null,"sap.ui.integration.widgets.Card")}this._oActions.attach({area:z.ContentItemDetail,actions:e.actions,control:this,actionControl:o,enabledPropertyName:"enabled"});o=new n({renderType:D.Bare,items:o})}else if(i){o=new s({text:i,visible:_.reuse(t),maxLines:e.maxLines})}return o};U.prototype._createButtonGroupItem=function(e,t){var a=e.template;if(!a){return null}var i=new O({visible:_.reuse(t),style:M.Clear});i.addStyleClass("sapUiIntCardObjectButtonGroup");var r=new P({icon:_.formattedProperty(a.icon,function(e){return this._oIconFormatter.formatSrc(e)}.bind(this)),text:a.text||a.tooltip,tooltip:a.tooltip||a.text,type:V.Transparent,visible:a.visible});if(a.actions){r.attachPress(function(e){this._onButtonGroupPress(e,a.actions)}.bind(this))}i.bindAggregation("content",{path:e.path||"/",template:r,templateShareable:false});return i};U.prototype._onButtonGroupPress=function(e,t){var a=e.getSource();var i=w.resolveValue(t,a,a.getBindingContext().getPath());var r=i[0];this.getActions().fireAction(this,r.type,r.parameters)};U.prototype._createIconGroupItem=function(e,t){var a=e.template;if(!a){return null}var i=new A({avatarDisplaySize:e.size||j.XS,groupType:k.Individual,visible:_.reuse(t)});i._oShowMoreButton.setType(V.Transparent);i._oShowMoreButton.setEnabled(false);if(a.actions){i.attachPress(function(e){this._onIconGroupPress(e,a.actions)}.bind(this))}else{i._setInteractive(false)}var r=new F({src:_.formattedProperty(a.icon.src,function(e){return this._oIconFormatter.formatSrc(e)}.bind(this)),initials:a.icon.initials||a.icon.text,tooltip:a.icon.alt});i.bindAggregation("items",{path:e.path||"/",template:r,templateShareable:false});return i};U.prototype._onIconGroupPress=function(e,t){if(e.getParameter("overflowButtonPressed")){}else{var a=e.getParameter("eventSource");var i=w.resolveValue(t,a,a.getBindingContext().getPath());var r=i[0];this.getActions().fireAction(this,r.type,r.parameters)}};U.prototype._createComboBoxItem=function(e,t,a,i){var r=this.getCardInstance(),n=r.getModel("form"),o={visible:_.reuse(t),placeholder:e.placeholder,required:x.getRequiredValidationValue(e)},s,l,p;if(e.selectedKey){o.selectedKey=e.selectedKey}else if(e.value){o.value=e.value}s=new c(o);if(a){a.setLabelFor(s)}if(e.item){l=new L({key:e.item.template.key,text:e.item.template.title});s.bindItems({path:e.item.path||"/",template:l,templateShareable:false})}if(!e.id){h.error("Each input element must have an ID.","sap.ui.integration.widgets.Card");return s}else if(this._formElementsIds.has(e.id)){h.error("Duplicate form element ID - "+"'"+e.id+"'","sap.ui.integration.widgets.Card")}this._formElementsIds.add(e.id);p=function(){n.setProperty("/"+e.id,{key:s.getSelectedKey(),value:s.getValue()})};s.attachChange(p);s.addEventDelegate({onAfterRendering:p});this._prepareValidationControl(s,e,"change",i);return s};U.prototype._createTextAreaItem=function(e,t,a,i){var r=this.getCardInstance(),n=r.getModel("form"),o=new f({required:x.getRequiredValidationValue(e),value:e.value,visible:_.reuse(t),rows:e.rows,placeholder:e.placeholder}),s;if(a){a.setLabelFor(o)}if(!e.id){h.error("Each input element must have an ID.","sap.ui.integration.widgets.Card");return o}else if(this._formElementsIds.has(e.id)){h.error("Duplicate form element ID - "+"'"+e.id+"'","sap.ui.integration.widgets.Card")}this._formElementsIds.add(e.id);s=function(){n.setProperty("/"+e.id,o.getValue())};o.attachChange(s);o.addEventDelegate({onAfterRendering:s});this._prepareValidationControl(o,e,"liveChange",i);return o};U.prototype._createAFLayout=function(){var e=new C;e.addEventDelegate({onAfterRendering:function(){this.getContent().forEach(function(e){if(!e.getVisible()){document.getElementById("sap-ui-invisible-"+e.getId()).parentElement.classList.add("sapFCardInvisibleContent")}})}},e);return e};U.prototype._onResize=function(e){if(e.size.width===e.oldSize.width){return}var t=this._getRootContainer().getItems();t.forEach(function(a,i){if(a.isA("sap.ui.layout.AlignedFlowLayout")){this._onAlignedFlowLayoutResize(a,e,i===t.length-1)}}.bind(this))};U.prototype._onAlignedFlowLayoutResize=function(e,t,a){var i=e.getMinItemWidth(),r,n=e.getContent().filter(function(e){return e.getVisible()}).length;if(i.lastIndexOf("rem")!==-1){r=I.toPx(i)}else if(i.lastIndexOf("px")!==-1){r=parseFloat(i)}var o=Math.floor(t.size.width/r);if(o>n){o=n}var s=o-1,l=Math.ceil(n/o);e.getContent().forEach(function(e,t){e.addStyleClass("sapFCardObjectSpaceBetweenGroup");if(s===t&&s<n){e.removeStyleClass("sapFCardObjectSpaceBetweenGroup");s+=o}if(a&&t+1>(l-1)*o){e.addStyleClass("sapFCardObjectGroupLastInColumn")}else{e.removeStyleClass("sapFCardObjectGroupLastInColumn")}})};return U});