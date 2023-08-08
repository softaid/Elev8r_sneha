/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/changeHandler/AddIFrame","sap/ui/fl/changeHandler/common/getTargetAggregationIndex","sap/ui/fl/changeHandler/common/createIFrame"],function(e,t,n){"use strict";var r=Object.assign({},e);r.applyChange=function(r,a,o){var i=o.modifier;var g=r.getContent();var s=g.targetAggregation;if(s!=="sections"){return Promise.resolve().then(e.applyChange.bind(e,r,a,o))}var c=o.view;var u=o.appComponent;var f=g.selector;var l=sap.ui.getCore().getLibraryResourceBundle("sap.uxap").getText("SECTION_TITLE_FOR_IFRAME");var d;var p;return Promise.resolve().then(i.createControl.bind(i,"sap.uxap.ObjectPageSection",u,c,f,{title:l},false)).then(function(e){d=e;var t=Object.create(f);t.id+="-subSection";return i.createControl("sap.uxap.ObjectPageSubSection",u,c,t,{title:l},false)}).then(function(e){p=e;return i.insertAggregation(d,"subSections",p,0,c)}).then(function(){var e=Object.create(f);e.id+="-iframe";return n(r,o,e)}).then(function(e){return i.insertAggregation(p,"blocks",e,0,c)}).then(t.bind(null,r,a,o)).then(function(e){return i.insertAggregation(a,"sections",d,e,c)}).then(function(){r.setRevertData([i.getId(d)])})};r.getCondenserInfo=function(t){var n=Object.assign({},e.getCondenserInfo(t));var r=t.getContent();var a=r.targetAggregation;if(a==="sections"){n.updateControl=Object.assign({},n.affectedControl);n.updateControl.id=n.affectedControl.id+"-iframe"}return n};return r},true);