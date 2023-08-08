// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define([],function(){"use strict";var e={pendingEvents:{},subscribers:{},dispatchOperations:{},store:n(),dispatchTimeoutIds:new window.Set};function n(){return{nextKey:0,objectToKey:new window.WeakMap,keyToObject:{}}}function t(e,n,t){var r=sap.ui.require("sap/base/Log");if(r){r.error(e,n,"sap.ushell.EventHub");return}}function r(e){var n="An exception was raised while executing a registered callback on event '"+e.eventName+"'",r="Data passed to the event were: '"+e.eventData+"'";if(e.error.stack){r+=" Error details: "+e.error.stack}t(n,r,e.fnCausedBy)}function i(e,n,t){var i;try{i=n(t)}catch(i){r({eventName:e,eventData:t,fnCausedBy:n,error:i})}return i}function u(e){if(typeof arguments[2]==="function"){return P(e,arguments[2])}return arguments[2]}function o(e){if(typeof arguments[2]==="string"&&arguments[2].indexOf("<function")===0){return E(e,arguments[2])}return arguments[2]}function a(e,n,r){if(typeof n==="object"||typeof n==="function"){try{var i=[n,u.bind(null,e)];if(r){i.push(3)}return JSON.stringify.apply(JSON,i)}catch(e){t(""+e,e.stack,a)}}return n}function c(e,n){try{return JSON.parse(n,o.bind(null,e))}catch(e){return n}}function s(e,n,t){if(!e.subscribers[n]){e.subscribers[n]=[]}e.subscribers[n].push(t)}function f(e,n,t){e.subscribers[n]=(e.subscribers[n]||[]).map(function(e){return e.filter(function(e){return e.fn!==t})}).filter(function(e){return e.length>0})}function l(){var e,n=new Promise(function(n){e=n}),t={dispatching:n,cancelled:false,cancel:function(){t.cancelled=true},complete:function(){e()}};return t}function d(e,n){if(!e.subscribers.hasOwnProperty(n)){return null}var t=l(),r=e.subscribers[n],i=r.map(function(r){return p(e,n,r,t,0)});Promise.all(i).then(t.complete,t.complete);return t}function p(e,n,t,r,i){var u=t.length,o=t.slice(i);return o.reduce(function(i,u){return i.then(function(i){if(r.cancelled){if(i){f(e,n,u.fn)}return i}return h(e,n,u,t).then(function(e){if(e){r.cancelled=true}return e})})},Promise.resolve(false)).then(function(i){if(!i&&u<t.length){return p(e,n,t,r,u)}return i})}function h(e,n,t,r){return new Promise(function(u){var o=c(e,e.pendingEvents[n]);var a=setTimeout(function(){e.dispatchTimeoutIds.delete(a);if(t.called&&r.offed){u(false);return}t.called=true;var c=r.offed;i(n,t.fn,o);var s=r.offed;if(s){f(e,n,t.fn)}u(!c&&s)},0);e.dispatchTimeoutIds.add(a)})}function v(e,n,t){return function(){t.forEach(function(t){if(t.called){f(e,n,t.fn)}});t.offed=true;return{off:v(e,n,[])}}}function b(e,n,t){return function(r){var i={fn:r,called:false};t.push(i);if(e.pendingEvents.hasOwnProperty(n)){var u=e.dispatchOperations[n];if(!u){h(e,n,i,t)}else{u.dispatching.then(function(){if(!i.called){h(e,n,i,t)}})}}return{do:b(e,n,t),off:v(e,n,t)}}}function y(e,n){var t=[];s(e,n,t);return{do:b(e,n,t),off:v(e,n,t)}}function m(e,n){var t=y(e,n);t.off();return t}function w(e,n,t,r){var i=a(e,t);if(!r&&e.pendingEvents.hasOwnProperty(n)&&e.pendingEvents[n]===i){return this}e.pendingEvents[n]=i;var u=e.dispatchOperations[n];if(u){u.cancel()}var o=d(e,n);e.dispatchOperations[n]=o;return this}function g(e,n){return c(e,e.pendingEvents[n])}function O(){var e=Array.prototype.slice.call(arguments);e.shift();var n=0,t=new Array(e.length).join(",").split(",").map(function(){return 1}),r=[],i={do:function(u){e.forEach(function(i,o){i.do(function(i,o){r[i]=o;n+=t[i];t[i]=0;if(n===e.length){u.apply(null,r)}}.bind(null,o))});return{off:i.off}},off:function(){var n=e.reduce(function(e,n){return n.off()},function(){});return{off:n}}};return i}function j(e,n){var t=e.dispatchOperations[n];return t?t.dispatching:Promise.resolve()}function P(e,n){if(e.store.objectToKey.has(n)){return e.store.objectToKey.get(n)}e.store.nextKey++;var t="<"+typeof n+">#"+e.store.nextKey;e.store.keyToObject[t]=n;e.store.objectToKey.set(n,t);return t}function E(e,n){return e.store.keyToObject[n]}function k(e){var t={};t.emit=w.bind(t,e);t.on=y.bind(null,e);t.once=m.bind(null,e);t.last=g.bind(null,e);t.join=O.bind(null,e);t.wait=j.bind(null,e);t._reset=function(e){e.pendingEvents={};e.subscribers={};e.dispatchOperations={};e.store=n();e.dispatchTimeoutIds.forEach(clearTimeout);e.dispatchTimeoutIds=new window.Set}.bind(null,e);return t}function T(e){var t={pendingEvents:{},subscribers:{},dispatchOperations:{},store:n(),dispatchTimeoutIds:new window.Set},r=k(t),i=c(t,a(t,e));function u(e){var n=e.charAt(0);if(n.match(/[a-zA-Z0-9]/)){throw new Error("Invalid path separator '"+n+"'. Please ensure path starts with a non alphanumeric character")}var t=e.split(n);t.shift();return t}function o(e,n){var t=e,r="";if(arguments.length===2){t=n;r=e}return r+"/"+t.join("/")}function s(e){return Object.prototype.toString.apply(e)==="[object Array]"}function f(e){return Object(e)!==e}function l(e){return(s(e)?e.length:Object.keys(e).length)===0}function d(e,n,r,i){var u="",c=e,l=[];r.reduce(function(e,n,d){u=o(u,[n]);c=c[n];if(d===r.length-1){if(!f(i)&&!f(c)&&Object.keys(c).length>0){var p,h=Object.keys(c).reduce(function(e,n){e[n]=true;return e},{}),v=Object.keys(i).some(function(e){p=e;var n=h.hasOwnProperty(e);delete h[e];var t=!f(c[e])&&Object.keys(c[e]).length>0;return!n||t}),b=Object.keys(h).length>0,y=v||b;if(y){var m=v?"One or more values are not defined in the channel contract or are defined as a non-empty object/array, for example, check '"+p+"'.":"Some keys are missing in the event data: "+Object.keys(h).join(", ")+".";throw new Error("Cannot write value '"+a(t,i,true)+"' to path '"+u+"'. "+m+" All childrens in the value must appear in the channel contract and must have a simple value or should be defined as an empty complex value")}var w=Object.keys(i).map(function(e){return{serializedPath:o(u,[e]),value:i[e]}});Array.prototype.push.apply(l,w)}e[n]=i}else if(!e.hasOwnProperty(n)){e[n]=s(c)?[]:{}}l.push({serializedPath:u,value:e[n]});return e[n]},n);return l}function p(e,n){var r="",i=n.reduce(function(e,n){r+="/"+n;if(s(e)&&!n.match(/^[0-9]+$/)){throw new Error("Invalid array index '"+n+"' provided in path '"+r+"'")}if(!e.hasOwnProperty(n)){throw new Error("The item '"+n+"' from path "+r+" cannot be accessed in the object: "+a(t,e))}return e[n]},e);return i}function h(e,n,t){return n.reduce(function(e,r,i){var u=i===n.length-1;if(e.hasOwnProperty(r)){return e[r]}return u?t:{}},e)}function v(e,n){n.pop();var t=e,r=[];return n.reduce(function(e,n){t=t[n];r.push(n);e.push({serializedPath:o(r),value:t});return e},[])}function b(e){return e.map(function(e){var n=e.serializedPath;if(!t.subscribers.hasOwnProperty(n)||t.subscribers[n].length===0){return null}return{path:n,value:e.value}}).filter(function(e){return!!e})}function y(n,t){var o=u(n);p(e,o);var a=d(e,i,o,t);a.forEach(function(e){r.emit(e.serializedPath,e.value)})}function m(n){var t=u(n),r=p(e,t);return h(i,t,r)}function w(n){var i=u(n),s=o(i),d=r.last(s),h=t.pendingEvents.hasOwnProperty(s);if(h){return r.on(s)}d=p(e,i);if(typeof d!=="undefined"&&(f(d)||!l(c(r,a(r,d))))){r.emit(s,d)}return r.on(s)}function g(e){var n=w(e);n.off();return n}function j(e){var n=u(e),t=v(i,n),o=b(t).map(function(e){return r.wait(e.path,e.value)});return Promise.all(o.concat(r.wait(e)))}return{emit:y,on:w,once:g,last:m,wait:j,join:O.bind(null,r)}}var x=k(e);x.createChannel=T.bind(null);return x});