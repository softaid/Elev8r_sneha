/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/DataType"],function(e){"use strict";var t=new window.WeakMap;var n={};var r={};var a={};var u=["function"];var i={};var s={Table:{BindRows:{arguments:[{type:"object"}]},RowsBound:{arguments:[{type:"class:sap.ui.model.Binding"}]},UnbindRows:{arguments:[{type:"object"}]},RowsUnbound:{arguments:[]},RefreshRows:{arguments:[{type:g}]},UpdateRows:{arguments:[{type:g}]},UpdateSizes:{arguments:[{type:g}]},OpenMenu:{arguments:[{type:h},{type:"class:sap.ui.unified.Menu"}]},TotalRowCountChanged:{arguments:[]}},Row:{UpdateState:{arguments:[{type:m}]},Expand:{arguments:[{type:"class:sap.ui.table.Row"}]},Collapse:{arguments:[{type:"class:sap.ui.table.Row"}]}},Column:{MenuItemNotification:{arguments:[{type:"class:sap.ui.table.Column"}],returnValue:"boolean"}},Signal:{arguments:[{type:"string"}]}};i.TableUtils=null;i.Keys=r;i.call=function(e,r){var a=t.get(e);if(!f(e)||!o(r)){return undefined}var u=p(r);if(a==null){if(u.returnValue){return[]}return undefined}var s=d(Array.prototype.slice.call(arguments,2));var l=y(u,s);if(!l){throw new Error("Hook with key "+r+" was not called. Invalid arguments passed\n"+e)}var g=a.map(function(e){if(e.key===n){var t={};var a=e.handlerContext==null?e.target:e.handlerContext;t[r]=s;return i.TableUtils.dynamicCall(e.target,t,a)}else if(e.key===r){return e.handler.apply(e.handlerContext,s)}});g=c(u,g);return g};i.install=function(e,r,a){if(!r||!f(e)){return}var u=t.get(e);if(u==null){u=[]}var i=u.some(function(e){return e.key===n&&e.target===r&&e.handlerContext===a});if(i){return}u.push({key:n,target:r,handlerContext:a});t.set(e,u)};i.uninstall=function(e,r,a){var u=t.get(e);if(u==null||!r){return}for(var i=0;i<u.length;i++){var s=u[i];if(s.key===n&&s.target===r&&s.handlerContext===a){u.splice(i,1);break}}if(u.length===0){t.delete(e)}else{t.set(e,u)}};i.register=function(e,n,r,a){if(typeof r!=="function"||!f(e)||!o(n)){return}var u=t.get(e);if(u==null){u=[]}u.push({key:n,handler:r,handlerContext:a});t.set(e,u)};i.deregister=function(e,n,r,a){var u=t.get(e);if(u==null){return}for(var i=0;i<u.length;i++){var s=u[i];if(s.key===n&&s.handler===r&&s.handlerContext===a){u.splice(i,1);break}}if(u.length===0){t.delete(e)}else{t.set(e,u)}};function l(e,t,n){Object.keys(t).forEach(function(r){var i=n?n+"."+r:r;if("arguments"in t[r]){u.forEach(function(e){if(t[r].arguments.indexOf(e)>-1||t[r].returnValue===e){throw new Error("Forbidden type found in metadata of hook "+n+": "+e)}});e[r]=i;a[i]=t[r]}else{e[r]={};l(e[r],t[r],i)}});return e}l(r,s);function o(e){return e in a}function f(e){return i.TableUtils.isA(e,"sap.ui.table.Table")&&!e.bIsDestroyed&&!e._bIsBeingDestroyed}function p(e){return a[e]}function d(e){while(e.length>0){var t=e.pop();if(t!=null){e.push(t);break}}e.map(function(e){if(e===null){return undefined}else{return e}});return e}function y(t,n){return t.arguments.length>=n.length&&n.every(function(n,r){var a=t.arguments[r];if(typeof a.type==="function"){return a.type(n)}if(a.type.startsWith("class:")){return i.TableUtils.isA(n,a.type.substring(6))}return a.optional===true&&n==null||e.getType(a.type).isValid(n)})}function c(t,n){if(!t.returnValue){return undefined}var r=t.returnValue;return n.filter(function(t){if(t==null){return false}else if(typeof r==="function"){return r(t)}else if(r==="Promise"){return t instanceof Promise}else if(r.startsWith("class:")){return i.TableUtils.isA(t,r.substring(6))}else{return e.getType(r).isValid(t)}})}function g(t){return t in i.TableUtils.RowsUpdateReason||e.getType("sap.ui.model.ChangeReason").isValid(t)}function h(e){return e?typeof e.isOfType==="function":false}function m(e){return e!=null&&e.hasOwnProperty("context")&&e.hasOwnProperty("Type")&&e.hasOwnProperty("type")&&e.type in e.Type}return i},true);