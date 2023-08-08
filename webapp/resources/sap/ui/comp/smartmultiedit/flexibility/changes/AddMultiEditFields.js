/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/comp/smartmultiedit/Container","sap/ui/comp/smartform/flexibility/changes/AddFields"],function(e,t,n){"use strict";var r={};r.applyChange=function(e,t,r){var i=e.getContent();var o=r.modifier;var a=r.appComponent;var d=i.field.selector;var l=r.view;var f=i.field.id;var p=i.field.index;var s=i.field.propertyName;var u=e.getDependentControl("form",r);var c=u&&o.getFlexDelegate(u);if(!c){if(this._checkChangeContent(i)){var g=i.field.jsType;var v=i.field.entitySet;var m;var h;return Promise.resolve().then(o.createControl.bind(o,"sap.ui.comp.smartform.GroupElement",r.appComponent,r.view,d||f)).then(function(e){m=e;return this._createGroupElementField(o,r.view,m,g,s,v,r.appComponent)}.bind(this)).then(function(e){h=e;return o.insertAggregation(t,"groupElements",m,p,r.view)}).then(function(){var n=this._getContainerFromGroup(t);if(n){n.indexField(h)}e.setRevertData({newFieldSelector:o.getSelector(m,r.appComponent)})}.bind(this))}}return n._addFieldFromDelegate(u,t,d,f,p,s,e,o,l,a)};r.revertChange=function(e,t,n){var r=e.getRevertData(),i=r.newFieldSelector,o=n.modifier;if(i){var a=o.bySelector(i,n.appComponent,n.view);return Promise.resolve().then(o.removeAggregation.bind(o,t,"groupElements",a)).then(function(){o.destroy(a);var i=this._getContainerFromGroup(t);if(i){i._refreshFields()}var d=r.valueHelpSelector;if(d){var l=n.appComponent;var f=n.view;var p=o.bySelector(d,l,f);var s=e.getDependentControl("form",n);return Promise.resolve().then(o.removeAggregation.bind(o,s,"dependents",p)).then(o.destroy.bind(o,p))}}.bind(this)).then(function(){e.resetRevertData()})}else{return Promise.resolve()}};r.completeChangeContent=function(t,n,r){var i=r.appComponent;var o={field:{}};if(n.bindingPath){o.field.propertyName=n.bindingPath}else{throw new Error("oSpecificChangeInfo.bindingPath or bindingPath attribute required")}if(n.newControlId){o.field.selector=e.getSelector(n.newControlId,i)}else{throw new Error("oSpecificChangeInfo.newControlId attribute required")}if(n.jsTypes){o.field.jsType=n.jsType}else if(n.bindingPath){o.field.jsType="sap.ui.comp.smartmultiedit.Field"}else{throw new Error("oSpecificChangeInfo.jsTypes or bindingPath attribute required")}if(n.index===undefined){throw new Error("oSpecificChangeInfo.index attribute required")}else{o.field.index=n.index}if(n.entitySet){o.field.entitySet=n.entitySet}if(n.relevantContainerId){t.addDependentControl(n.relevantContainerId,"form",r)}t.setContent(o)};r._checkChangeContent=function(e){var t=e,n=false;if(t){n=e.field&&(e.field.selector||e.field.id)&&e.field.jsType&&e.field.propertyName}return t&&n};r._createGroupElementField=function(e,t,n,r,i,o,a){return Promise.resolve().then(e.createControl.bind(e,r,a,t)).then(function(r){e.setProperty(r,"propertyName",i);if(o){e.setProperty(r,"entitySet",o)}return Promise.resolve().then(e.insertAggregation.bind(e,n,"elements",r,0,t,true)).then(function(){return r})})};r._getContainerFromGroup=function(e){if(e&&typeof e.getParent==="function"&&typeof e.getParent().getParent==="function"&&typeof e.getParent().getParent().getParent==="function"){var n=e.getParent().getParent().getParent();if(n instanceof t){return n}}};return r},true);