/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/comp/library","sap/ui/core/Element","sap/ui/core/Control","sap/ui/layout/form/FormElement","sap/m/Label","sap/ui/comp/smartfield/SmartLabel","sap/ui/comp/smartfield/SmartField","sap/base/Log"],function(e,t,i,a,l,s,r,o){"use strict";var n;var f;var u;var h;var p;var b=e.smartfield.ControlContextType;var d=a.extend("sap.ui.comp.smartform.GroupElement",{metadata:{library:"sap.ui.comp",interfaces:["sap.ui.comp.IFormGroupElement"],properties:{useHorizontalLayout:{type:"boolean",group:"Misc",defaultValue:null},horizontalLayoutGroupElementMinWidth:{type:"int",group:"Misc",defaultValue:null},elementForLabel:{type:"int",group:"Misc",defaultValue:0}},defaultAggregation:"elements",aggregations:{elements:{type:"sap.ui.core.Control",multiple:true,singularName:"element"}},events:{visibleChanged:{}},designtime:"sap/ui/comp/designtime/smartform/GroupElement.designtime"},_bVisibleElements:false,_bHorizontalLayoutUsed:false});d._myVBox=undefined;d.prototype.init=function(){a.prototype.init.apply(this,arguments);this._oObserver.observe(this,{properties:["useHorizontalLayout","horizontalLayoutGroupElementMinWidth","elementForLabel","_editable"]})};d.prototype._getFieldRelevantForLabel=function(){var e=this.getElements();var t=this.getElementForLabel();if(e.length>t&&e[t]instanceof r){return e[t]}return null};d.prototype._extractFields=function(e,t){var i=[];e.forEach(function(e){if(e instanceof n||e instanceof f){i=i.concat(e.getItems())}else{i.push(e)}});if(i.some(function(e){return e instanceof n||e instanceof f})){i=this._extractFields(i)}if(t){i=i.filter(function(e){return!(e instanceof l)})}return i};d.prototype.setTooltip=function(e){a.prototype.setTooltip.apply(this,[e]);var t=this._getFieldRelevantForLabel();var i=this._getLabel();m.call(this,i,t);return this};function m(e,t){if(e==this._oSetLabel){return}var a;if(this._oSetLabel&&this._oSetLabel instanceof i){a=k.call(this._oSetLabel)}if(!a){a=k.call(this)}if(a){if(e instanceof s){if(t&&t.setTooltipLabel){t.setTooltipLabel(a)}}else{e.setTooltip(a)}}}d.prototype.setLabel=function(e){if(!e&&this._bMoveLabelToVBox){return this.setAggregation("label",e)}if(this._oSetLabel&&typeof this._oSetLabel!=="string"){this._oSetLabel.detachEvent("_change",g,this)}var t;var i;var l;if(typeof e==="string"){t=this._getLabel();if(t){i=t.getText()}}else if(!e&&this._oSetLabel){i=this.getLabelText()}a.prototype.setLabel.apply(this,[e]);this._oSetLabel=e;L.call(this);if(typeof e==="string"){if(this._oLabel instanceof s&&e!=i&&(e.length>0||i.length>0)){l=this._getFieldRelevantForLabel();if(l&&e!=null){if(l.getComputedTextLabel){if(!l._oTextLabelSetByGroupElement){l._oTextLabelSetByGroupElement={oldText:l.getComputedTextLabel()}}l.setTextLabel(e)}}}if(!this._bHorizontalLayoutUsed){this.setAggregation("_label",this._oLabel,true)}this._oLabel.isRequired=c;this._oLabel.isDisplayOnly=y}else{if(e){if(e.isRequired){e.isRequired=c}if(e.isDisplayOnly){e.isDisplayOnly=y}e.attachEvent("_change",g,this)}else{l=this._getFieldRelevantForLabel();if(l){U.call(this,l,i)}}this.updateLabelOfFormElement()}return this};d.prototype.destroyLabel=function(){var e=this.getLabelText();a.prototype.destroyLabel.apply(this);delete this._oSetLabel;L.call(this);var t=this._getFieldRelevantForLabel();if(t){U.call(this,t,e)}this.updateLabelOfFormElement();return this};function g(e){if(e.getParameter("name")=="text"){var t=e.oSource;var i=t.getText();if(this._oLabel){this._oLabel.setText(i)}var a=this._getFieldRelevantForLabel();if(a&&a.getComputedTextLabel){if(!a._oTextLabelSetByGroupElement){a._oTextLabelSetByGroupElement={oldText:a.getComputedTextLabel()}}a.setTextLabel(i)}}}function L(){if(!this._bHorizontalLayoutUsed){return}var e=this.getFields();var t;if(e.length>0){var i=this.getFields()[0];if(i instanceof n){var a=i.getItems();var s=this._getLabel();if(a.length>0&&a[0]instanceof l){t=a[0]}this._bMoveLabelToVBox=true;if(t&&t!=s){i.removeItem(0);if(t._bCreatedByGroupElement){this.setAggregation("_label",t,true)}else{this.setAggregation("label",t)}}if(s&&t!=s){i.insertItem(s,0)}this._bMoveLabelToVBox=false;_.call(this)}}}function c(){if(this.getRequired&&this.getRequired()){return true}var e=this.getParent();if(e&&e.isA("sap.m.VBox")){e=e.getParent()}var t=e.getElements();for(var i=0;i<t.length;i++){var a=t[i];if(a.getRequired&&a.getRequired()===true&&(!a.getEditable||a.getEditable())&&(!a.getContextEditable||a.getContextEditable())){return true}}return false}function y(){if(this.getDisplayOnly){if(!this.isPropertyInitial("displayOnly")){return this.getDisplayOnly()}var e=this.getParent();if(e&&e.isA("sap.m.VBox")){e=e.getParent()}var t=e.getParent();if(t){var i=t.getParent();if(i){return!i.getEditable()}}}return false}function v(){var e=this.getParent();if(e&&e.isA("sap.m.VBox")){e=e.getParent()}if(e._oSetLabel&&!(typeof e._oSetLabel==="string")&&e._oSetLabel.getWrapping&&!e._oSetLabel.isPropertyInitial("wrapping")){return e._oSetLabel.getWrapping()}return true}function _(){var e=this._getFieldRelevantForLabel();if(e){if(this._oLabel){this._oLabel.setLabelFor(e)}return}var t=this.getFields();e=t.length>0?t[0]:null;if(e instanceof n){var a=e.getItems();if(a[1]instanceof f){e=a[1].getItems()[0]}else{e=a[1]}}var l=this._oLabel;if(l){l.setLabelFor(e)}else{l=this.getLabel();if(l instanceof i){l.setAlternativeLabelFor(e)}}}d.prototype.getLabel=function(){return this._oSetLabel};d.prototype._getLabel=function(){if(this._oLabel){return this._oLabel}else{return this._oSetLabel}};d.prototype.getLabelControl=function(){if(this._bHorizontalLayoutUsed){return null}else{return this._getLabel()}};d.prototype.getLabelText=function(){var e="";var t=this._getLabel();if(t){e=t.getText()}return e};d.prototype.getDataSourceLabel=function(){var e=this._getFieldRelevantForLabel();if(e&&e.isA("sap.ui.comp.smartfield.SmartField")){return e.getDataSourceLabel()}};d.prototype._createLabel=function(e){var t=null;var i=this._getFieldRelevantForLabel();if(i){if(i.getShowLabel&&i.getShowLabel()){t=new s(i.getId()+"-label");if(e){if(!i._oTextLabelSetByGroupElement){i._oTextLabelSetByGroupElement={oldText:i.getComputedTextLabel()}}i.setTextLabel(e);t.setText(e)}t.setLabelFor(i)}}else{t=new l(this.getId()+"-label",{text:e})}if(t){t._bCreatedByGroupElement=true;t.isRequired=c;t.isDisplayOnly=y;t.isWrapping=v;this._oLabel=t;if(!this._bHorizontalLayoutUsed){this.setAggregation("_label",t,true)}if(this._oSetLabel&&typeof this._oSetLabel!=="string"){this._oSetLabel.setAlternativeLabelFor(null)}}return t};d.prototype.updateLabelOfFormElement=function(){var e=false,t=null;var i=this.getElements();var l=this._getFieldRelevantForLabel();var r=this._getLabel();var o=false;if(r&&r._bCreatedByGroupElement){if(r instanceof s){if(!l||r._sSmartFieldId&&r._sSmartFieldId!=l.getId()){o=true}}else if(l){o=true}if(o){r.destroy();delete this._oLabel;r=null;if(this._oSetLabel&&!l){if(typeof this._oSetLabel==="string"){a.prototype.setLabel.apply(this,[this._oSetLabel]);r=this._oLabel;this._oLabel.isRequired=c;this._oLabel.isDisplayOnly=y}else{r=this._oSetLabel}L.call(this)}}}else if(r&&l){if(r==this._oLabel){r.destroy();delete this._oLabel}r=null}if(!r){if(this._oSetLabel){if(typeof this._oSetLabel==="string"){t=this._oSetLabel}else{t=this._oSetLabel.getText()}}else{t=""}}if(!r&&i.length>0){r=this._createLabel(t);e=true}if(r){if(r instanceof s){if(l&&l.setTextLabel&&l.getComputedTextLabel()){r.setText(l.getComputedTextLabel())}}m.call(this,r,l)}if(e){L.call(this);if(r&&r.setLabelFor&&!(r instanceof s)&&!l&&i.length>0){r.setLabelFor(i[0])}}};d.prototype.setEditMode=function(e){this._setEditable(e);return this};function F(e){var t=this.getElements();for(var i=0;i<t.length;i++){var a=t[i];E.call(this,a,e)}}function E(e,t){if(e instanceof r){if(!(e.data("editable")===false)){e.setContextEditable(t)}}}d.prototype.invalidateLabel=function(){var e=this._getLabel();if(e){e.invalidate()}};d.prototype._updateFormElementVisibility=function(){var e=this.getVisibleBasedOnElements();if(this._bVisibleElements!==e){this._bVisibleElements=e;if(this.isPropertyInitial("visible")){G.call(this);this.invalidate()}}};d.prototype._updateLayout=function(){var e=null;var t=null;var i=null;var a=this.getUseHorizontalLayout();var l;var s=0;var r;if(a==this._bHorizontalLayoutUsed){return}if(a&&!x.call(this)){return}var o=this.getElements();var u=this._getLabel();this._bNoObserverChange=true;if(a){if(o.length>0){if(o[0].getLayoutData()){i=o[0].getLayoutData()}this.removeAllFields();if(o.length>1){for(s=0;s<o.length;s++){r=o[s];if(s>0){S.call(this,r)}}t=T.call(this,o.slice(0))}if(t){l=[t]}else{l=o.slice(0)}e=D.call(this,l,u,i);this.addField(e);if(u){_.call(this)}}}else{var h=this.getFields();if(h[0]instanceof n){e=h[0];l=e.getItems();if(o.length>1&&l.length>0){if(u){if(l.length>1&&l[1]instanceof f){t=l[1]}}else if(l[0]instanceof f){t=l[0]}if(t){t.removeAllItems();t.destroy()}}e.removeAllItems();e.destroy()}this.removeAllFields();for(s=0;s<o.length;s++){r=o[s];I.call(this,r);this.addField(r)}if(u){if(u==this._oLabel){this.setAggregation("_label",u,true)}else{this.setAggregation("label",u)}}}this._bHorizontalLayoutUsed=a;this._bNoObserverChange=false};function x(){if((!n||!f||!u||!h||!p)&&!this._bVBoxRequested){n=sap.ui.require("sap/m/VBox");f=sap.ui.require("sap/m/HBox");u=sap.ui.require("sap/m/FlexItemData");h=sap.ui.require("sap/ui/core/VariantLayoutData");p=sap.ui.require("sap/ui/layout/GridData");if(!n||!f||!u||!h||!p){sap.ui.require(["sap/m/VBox","sap/m/HBox","sap/m/FlexItemData","sap/ui/core/VariantLayoutData","sap/ui/layout/GridData"],C.bind(this));this._bVBoxRequested=true}}if(n&&f&&u&&h&&p&&!this._bVBoxRequested){return true}else{return false}}function C(e,t,i,a,l){n=e;f=t;u=i;h=a;p=l;this._bVBoxRequested=false;if(!this._bIsBeingDestroyed){this._updateLayout()}}function S(e){var t=e.getLayoutData();if(t){if(t.getStyleClass&&!t.getStyleClass()){t.setStyleClass("sapUiCompGroupElementHBoxPadding")}}else{t=new u({styleClass:"sapUiCompGroupElementHBoxPadding"});t._bCreatedByGroupElement=true;e.setLayoutData(t)}}function I(e){var t=e.getLayoutData();if(t){if(t._bCreatedByGroupElement){t.destroy()}else if(t.getStyleClass&&t.getStyleClass()=="sapUiCompGroupElementHBoxPadding"){t.setStyleClass()}}}function D(e,t,i){if(!d._myVBox){d._myVBox=n.extend("SmartFormVBox",{metadata:{interfaces:["sap.ui.core.IFormContent"]},enhanceAccessibilityState:B,renderer:{apiVersion:2}})}this._bMoveLabelToVBox=true;var a=e.slice(0);if(t){a.splice(0,0,t)}var l=new d._myVBox(this.getId()+"--VBox",{items:a});this._bMoveLabelToVBox=false;l.addStyleClass("sapUiCompGroupElementVBox");l._oGroupElement=this;if(i&&(i instanceof p||i instanceof h||i.isA("sap.ui.layout.ResponsiveFlowLayoutData"))){l.setLayoutData(i.clone())}V.call(this,l);return l}function T(e){var t=new f(this.getId()+"--HBox",{items:e});t._oGroupElement=this;t.enhanceAccessibilityState=B;return t}function B(e,t){var i=this._oGroupElement._getLabel();if(i&&i!=e&&!(e instanceof f)){var a=t["labelledby"];if(!a){a=i.getId()}else{var l=a.split(" ");if((l?Array.prototype.indexOf.call(l,i.getId()):-1)<0){l.splice(0,0,i.getId());a=l.join(" ")}}t["labelledby"]=a}}d.prototype._updateGridDataSpan=function(){if(!this._bHorizontalLayoutUsed){return}var e=this.getFields();if(e.length>0){var t=e[0];if(t instanceof n){V.call(this,t)}}};function V(e){var t=this.getParent();if(!t||!t.addGroupElement){return}var i=t.getParent();while(i&&!i.addGroup&&i.getParent){i=i.getParent()}if(!i){return}var a="";var l=i.getLayout();if(l){a=l.getGridDataSpan()}var s=e.getLayoutData();var r;if(s){if(!(s instanceof p)&&!(s instanceof h)&&a){r=new p({span:a});r._bFromGroupElement=true;var o=new h({multipleLayoutData:[s,r]});o._bFromGroupElement=true;e.setLayoutData(o)}else if(s instanceof p){if(s._bFromGroupElement){if(!a){s.destroy()}else{s.setSpan(a)}}}else if(s instanceof h){var n=false;s.getMultipleLayoutData().forEach(function(e){if(e instanceof p){n=true;if(e._bFromGroupElement){if(!a){e.destroy()}else{e.setSpan(a)}}}});if(!n&&a){r=new p({span:a});r._bFromGroupElement=true;s.addMultipleLayoutData(r)}if(s._bFromGroupElement&&s.getMultipleLayoutData().length==1){r=s.getMultipleLayoutData()[0];e.setLayoutData(r);s.destroy()}}}else if(a){r=new p({span:a});r._bFromGroupElement=true;e.setLayoutData(r)}var f=this.getElements();for(var u=0;u<f.length;u++){var d=f[u];if(d&&d.setControlContext){if(a){d.setControlContext(b.SmartFormGrid)}else{d.setControlContext(b.Form)}}}}d.prototype._setLinebreak=function(e,t,i,a){if(!this._bHorizontalLayoutUsed){return}var l=this.getFields();if(l.length>0){var s=l[0];if(!(s instanceof n)){return}var r=s.getLayoutData();if(r){if(r instanceof h){var o=r.getMultipleLayoutData();for(var f=0;f<o.length;f++){r=o[f];if(r instanceof p){r.setLinebreakXL(e);r.setLinebreakL(t);r.setLinebreakM(i);r.setLinebreakS(a)}}}else if(r instanceof p){r.setLinebreakXL(e);r.setLinebreakL(t);r.setLinebreakM(i);r.setLinebreakS(a)}}}};d.prototype.setVisible=function(e){var t=this.isVisible();a.prototype.setVisible.apply(this,arguments);if(t!=e){G.call(this)}return this};d.prototype.isVisible=function(){if(this.isPropertyInitial("visible")){return this._bVisibleElements}else{return this.getVisible()}};function G(){this.fireVisibleChanged({visible:this.isVisible()});if(this.getParent()){this.getParent()._updateLineBreaks()}}d.prototype.getFormElement=function(){return this};d.prototype.addElement=function(e){if(!e){return this}e=this.validateAggregation("elements",e,true);O.call(this,e);var t;if(this._oLabel&&this._oLabel._bCreatedByGroupElement&&this._oLabel._sSmartFieldId){t=this._oLabel._sSmartFieldId}if(this._bHorizontalLayoutUsed){A.call(this,e,undefined,true)}else{this.addField(e)}if(t&&t!=this._oLabel._sSmartFieldId){this._oLabel.setLabelFor(t)}this.updateLabelOfFormElement();this._updateFormElementVisibility();return this};d.prototype.insertElement=function(e,t){if(!e){return this}e=this.validateAggregation("elements",e,true);O.call(this,e);var i;if(this._oLabel&&this._oLabel._bCreatedByGroupElement&&this._oLabel._sSmartFieldId){i=this._oLabel._sSmartFieldId}if(this._bHorizontalLayoutUsed){A.call(this,e,t,false)}else{this.insertField(e,t)}if(i&&i!=this._oLabel._sSmartFieldId){this._oLabel.setLabelFor(i)}this.updateLabelOfFormElement();this._updateFormElementVisibility();return this};d.prototype.getElements=function(){var e;var t;if(this._bHorizontalLayoutUsed){e=this.getFields();t=this._extractFields(e,true)}else{t=this.getFields()}return t};d.prototype.indexOfElement=function(e){var t=-1;if(this._bHorizontalLayoutUsed){var i=this.getElements();for(var a=0;a<i.length;a++){if(e==i[a]){t=a;break}}}else{t=this.indexOfField(e)}return t};d.prototype.removeElement=function(e){var t;var i;if(this._oLabel&&this._oLabel._bCreatedByGroupElement&&this._oLabel._sSmartFieldId){i=this._oLabel._sSmartFieldId}if(this._bHorizontalLayoutUsed){t=z.call(this,e,false)}else{t=this.removeField(e)}if(t){M.call(this,t)}if(i&&i!=this._oLabel._sSmartFieldId){this._oLabel.setLabelFor(i)}this.updateLabelOfFormElement();this._updateFormElementVisibility();return t};d.prototype.removeAllElements=function(){var e;if(this._bHorizontalLayoutUsed){e=z.call(this,undefined,true)}else{e=this.removeAllFields()}if(e&&Array.isArray(e)){for(var t=0;t<e.length;t++){M.call(this,e[t])}}this.updateLabelOfFormElement();this._updateFormElementVisibility();return e};d.prototype.destroyElements=function(){if(this._bHorizontalLayoutUsed){var e=this.getFields();if(e.length>0){var t=this._getLabel();if(t){e[0].removeItem(t);if(t==this._oLabel){this.setAggregation("_label",t,true)}else{this.setAggregation("label",t)}}this.destroyFields()}}else{this.destroyFields()}this.updateLabelOfFormElement();this._updateFormElementVisibility();return this};d.prototype._observeChanges=function(e){a.prototype._observeChanges.apply(this,arguments);if(e.object==this){switch(e.name){case"useHorizontalLayout":this._updateLayout();break;case"horizontalLayoutGroupElementMinWidth":o.error("HorizontalLayoutGroupElementMinWidth is deprecated",this);this._updateLayout();break;case"elementForLabel":this.updateLabelOfFormElement();break;case"_editable":F.call(this,e.current);break;default:break}}else{R.call(this,e)}};function A(e,t,i){var a=this._getLabel();var l=this.getFields();var s;var r;var o;if(l.length>0){s=l[0]}else{o=[e];var u=e.getLayoutData();s=D.call(this,o,a,u);this.addField(s);if(a){_.call(this)}return}if(!(s instanceof n)){return}o=s.getItems();if(a){if(o.length>1){r=o[1]}}else if(o.length>0){r=o[0]}if(r instanceof f){o=r.getItems();if((i||t>0)&&o.length>0){S.call(this,e)}if(i){r.addItem(e)}else{if(t==0&&o.length>0){S.call(this,o[0])}r.insertItem(e,t)}}else{var h=r;o=[];if(h){s.removeItem(h);if(i||t>0){o.push(h);o.push(e);S.call(this,e)}else{o.push(e);o.push(h);S.call(this,h)}r=T.call(this,o);s.addItem(r)}else{s.addItem(e)}if(a){_.call(this)}}}function O(e){if(e.getEditable){if(!e.getEditable()){e.data("editable",false)}}this._oObserver.observe(e,{properties:["visible"]});if(e.attachInnerControlsCreated){e.attachInnerControlsCreated(this._updateFormElementLabel,this)}if(e.setControlContext){e.setControlContext(b.Form)}if(e.getMetadata().getProperty("mandatory")){this._oObserver.observe(e,{properties:["mandatory"]})}E.call(this,e,this.getProperty("_editable"));H.call(this,e)}function H(e){if(e instanceof r){var t=this.getCustomData();for(var i=0;i<t.length;i++){P.call(this,e,t[i])}}}function P(t,i){if(t instanceof r&&e.smartform.inheritCostomDataToFields(i)&&!t.data(i.getKey())){var a=i.clone();a._bFromGroupElement=true;a._sOriginalId=i.getId();t.addCustomData(a)}}function R(e){if(e.name=="mandatory"){this.invalidateLabel()}else if(e.name=="visible"){this._updateFormElementVisibility()}}function z(e,t){var i=this._getLabel();var a=this.getFields();var l;var s;var r;var o;var u=false;var h;if(a.length>0){l=a[0]}if(!(l instanceof n)){return null}r=l.getItems();if(i){if(r.length>1){s=r[1]}}else if(r.length>0){s=r[0]}if(s instanceof f){if(t){o=s.removeAllItems();u=true}else{o=s.removeItem(e);r=s.getItems();if(r.length>0){I.call(this,r[0]);if(r.length==1){h=r[0];s.removeAllItems();l.removeItem(s);s.destroy();l.addItem(h)}}}}else{if(t){o=l.removeAllItems()}else{o=l.removeItem(e)}if(o){u=true}}if(u){if(i){l.removeItem(i);if(i==this._oLabel){this.setAggregation("_label",i,true)}else{this.setAggregation("label",i)}}this.removeField(l);l.destroy()}if(o){if(Array.isArray(o)){for(var p=0;p<o.length;p++){h=o[p];I.call(this,h)}}else{I.call(this,o)}}return o}function M(e){if(e.detachInnerControlsCreated){e.detachInnerControlsCreated(this._updateFormElementLabel,this)}if(e.setControlContext){e.setControlContext(b.None)}q.call(this,e);U.call(this,e,this.getLabelText())}function U(e,t){if(e._oTextLabelSetByGroupElement){if(e.getComputedTextLabel()==t){e.setTextLabel(e._oTextLabelSetByGroupElement.oldText)}delete e._oTextLabelSetByGroupElement}}function q(e,t){if(e instanceof r){var i=e.getCustomData();for(var a=0;a<i.length;a++){var l=i[a];if(l._bFromGroupElement&&(!t||t==l._sOriginalId)){e.removeCustomData(l);l.destroy()}}}}d.prototype._updateFormElementLabel=function(e){var t=this._getFieldRelevantForLabel();var i=this._getLabel();var a=e.oSource;var l=e.getParameters();if(i instanceof s&&a&&l&&a===t){i.updateLabelFor(l)}};d.prototype.addCustomData=function(e){if(!e){return this}a.prototype.addCustomData.apply(this,arguments);var t=this.getElements();for(var i=0;i<t.length;i++){P.call(this,t[i],e)}return this};d.prototype.insertCustomData=function(e,t){if(!e){return this}a.prototype.insertCustomData.apply(this,arguments);var i=this.getElements();for(var l=0;l<i.length;l++){P.call(this,i[l],e)}return this};d.prototype.removeCustomData=function(e){var t=a.prototype.removeCustomData.apply(this,arguments);if(t){var i=this.getElements();for(var l=0;l<i.length;l++){q.call(this,i[l],t.getId())}}return t};d.prototype.removeAllCustomData=function(){var e=a.prototype.removeAllCustomData.apply(this,arguments);if(e.length>0){var t=this.getElements();for(var i=0;i<t.length;i++){q.call(this,t[i])}}return e};d.prototype.destroyCustomData=function(){a.prototype.destroyCustomData.apply(this,arguments);var e=this.getElements();for(var t=0;t<e.length;t++){q.call(this,e[t])}return this};d.prototype.getVisibleBasedOnElements=function(){var e=false;var t=this.getElements();if(t&&t.length>0){e=t.some(function(e){return e.getVisible()})}return e};function k(){var e=this.getTooltip();if(!e||typeof e==="string"||e instanceof String){return e}else{return e.getText()}}d.prototype.clone=function(e,t){var i=this.removeAllElements();var l=a.prototype.clone.apply(this,arguments);for(var s=0;s<i.length;s++){var r=i[s];var o=r.clone(e,t);this.addElement(r);l.addElement(o)}return l};return d});