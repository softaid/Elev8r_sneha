/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/base/util/isEmptyObject","sap/base/Log"],function(e,t){"use strict";var n={};n.applyChange=function(n,r,i){var o=n.getContent();if(e(o)){t.error("Change does not contain sufficient information to be applied");return false}var a=r.getAvailableActions().filter(function(e){return e.getKey()===o.key});if(a.length!==1){t.error("Item with key "+o.key+" not found in the availableAction aggregation");return false}i.modifier.setProperty(a[0],"visibleChangedByUser",n.getLayer()==="USER");i.modifier.setProperty(a[0],"visible",o.visible);n.setRevertData({name:o.name,value:!o.visible});return true};n.completeChangeContent=function(t,n,r){if(e(n.content)){throw new Error("oSpecificChangeInfo.content should be filled")}if(!n.content.key){throw new Error("In oSpecificChangeInfo.content.key attribute is required")}if(n.content.visible!==false){throw new Error("In oSpecificChangeInfo.content.select attribute should be 'false'")}t.setContent(n.content)};n.revertChange=function(n,r,i){var o=n.getContent();if(e(o)){t.error("Change does not contain sufficient information to be applied");return false}var a=r.getAvailableActions().filter(function(e){return e.getKey()===o.key});if(a.length!==1){t.error("Item with key "+o.key+" not found in the availableAction aggregation");return false}i.modifier.setProperty(a[0],"visibleChangedByUser",n.getLayer()==="USER");i.modifier.setProperty(a[0],"visible",n.getRevertData().value);return true};return n},true);