// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/util/ObjectPath","sap/base/Log"],function(e,n){"use strict";function t(){return this.index.all}function i(e){if(e==="*"||e===undefined){return this.index.all}return(this.index.segment[e]||[]).concat(this.index.always)}function a(e){return e.map(function(e){return this.index.tag[e]||[]},this).reduce(function(e,n){Array.prototype.push.apply(e,n.filter(function(e){return e.isAlreadyInUnion?false:e.isAlreadyInUnion=true}));return e},[]).map(function(e){delete e.isAlreadyInUnion;return e})}var r={getSegment:i,getAllInbounds:t,getSegmentByTags:a};function u(n,t){var i=e.get("signature.parameters.sap-tag.defaultValue.value",n);if(!i){return}if(!t.tag[i]){t.tag[i]=[]}t.tag[i].push(n)}function s(e,n){var t=e.semanticObject;if(t==="*"){n.always.push(e)}else{if(!n.segment[t]){n.segment[t]=[]}n.segment[t].push(e)}}function o(e){var t={all:e,segment:{},always:[],tag:{}};e.forEach(function(e,i){if(!e){n.warning("Void inbound provided to indexer","the inbound will be skipped");return}u(e,t);s(e,t)});r.index=t;return r}return{createIndex:o,private:{tagInbound:u,createIndex:o,segmentInbound:s}}});