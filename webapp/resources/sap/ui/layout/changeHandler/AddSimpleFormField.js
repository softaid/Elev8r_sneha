/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/changeHandler/BaseAddViaDelegate","sap/ui/core/util/reflection/JsControlTreeModifier"],function(e,r){"use strict";var t="sap.ui.core.Title";var n="sap.m.Toolbar";var a="sap.m.Label";var o="sap.ui.comp.smartfield.SmartLabel";function i(e,r){var i=r.change;var l=r.modifier;var u=i.getContent();var v=u.newFieldIndex;var g=i.getDependentControl("targetContainerHeader",r);var d=e.indexOf(g);var c=0;var f=0;if(e.length===1||e.length===d+1){c=e.length}else{var s=0;for(s=d+1;s<e.length;s++){var p=l.getControlType(e[s]);if(p===a||p===o){if(f===v){c=s;break}f++}if(p===t||p===n){c=s;break}if(s===e.length-1){c=e.length}}}return c}function l(e,r,t){var n=e.slice();n.splice(r,0,t.label,t.control);return n}function u(e,r,t,n){return r.reduce(function(r,a,o){return r.then(function(){return t.insertAggregation(e,"content",a,o,n.view)})},Promise.resolve())}var v=e.createAddViaDelegateChangeHandler({addProperty:function(e){var r=e.control;var t=e.innerControls;var n=e.modifier;var a=e.appComponent;var o;var v;var g;var d=e.change;var c=d.getRevertData();c.labelSelector=n.getSelector(t.label,a);d.setRevertData(c);return Promise.resolve().then(n.getAggregation.bind(n,r,"content")).then(function(a){o=a;v=i(o,e);g=l(o,v,t);return n.removeAllAggregation(r,"content")}).then(function(){return u(r,g,n,e)}).then(function(){if(t.valueHelp){return n.insertAggregation(r,"dependents",t.valueHelp,0,e.view)}return undefined})},revertAdditionalControls:function(e){var r=e.control;var t=e.change;var n=e.modifier;var a=e.appComponent;var o=t.getRevertData().labelSelector;if(o){var i=n.bySelector(o,a);return Promise.resolve().then(n.removeAggregation.bind(n,r,"content",i)).then(n.destroy.bind(n,i))}return Promise.resolve()},aggregationName:"content",mapParentIdIntoChange:function(e,r,t){var n=t.appComponent;var a=t.view;var o=t.modifier.bySelector(r.parentId,n,a);var i=o.getTitle()||o.getToolbar();if(i){e.addDependentControl(i.getId(),"targetContainerHeader",t)}},parentAlias:"_",fieldSuffix:"",skipCreateLayout:true,supportsDefault:true});v.getChangeVisualizationInfo=function(e,t){var n=e.getRevertData();if(n&&n.labelSelector){return{affectedControls:[r.bySelector(n.labelSelector,t).getParent().getId()],updateRequired:true}}return{affectedControls:[e.getContent().newFieldSelector]}};v.getCondenserInfo=function(){return undefined};return v},true);