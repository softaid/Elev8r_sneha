/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["sap/esh/search/ui/controls/SearchFacetTabBar","./SearchFacet","./SearchFacetBarChart","./SearchFacetPieChart"],function(t,e,r,n){function a(t){return t&&t.__esModule&&typeof t.default!=="undefined"?t.default:t}function o(t,e){var r=typeof Symbol!=="undefined"&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=i(t))||e&&t&&typeof t.length==="number"){if(r)t=r;var n=0;var a=function(){};return{s:a,n:function(){if(n>=t.length)return{done:true};return{done:false,value:t[n++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o=true,c=false,u;return{s:function(){r=r.call(t)},n:function(){var t=r.next();o=t.done;return t},e:function(t){c=true;u=t},f:function(){try{if(!o&&r.return!=null)r.return()}finally{if(c)throw u}}}}function i(t,e){if(!t)return;if(typeof t==="string")return c(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);if(r==="Object"&&t.constructor)r=t.constructor.name;if(r==="Map"||r==="Set")return Array.from(t);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return c(t,e)}function c(t,e){if(e==null||e>t.length)e=t.length;for(var r=0,n=new Array(e);r<e;r++){n[r]=t[r]}return n}var u=a(e);var f=a(r);var s=a(n);var l=t.extend("sap.esh.search.ui.controls.SearchFacetTabBarRoles",{renderer:{apiVersion:2},constructor:function e(r,n){t.prototype.constructor.call(this,r,n)},setEshRole:function t(e){var r=this.getAggregation("items");var n=o(r),a;try{for(n.s();!(a=n.n()).done;){var i=a.value;var c=i.getContent()[0];if(c instanceof u||c instanceof s||c instanceof f){c.setEshRole(e)}}}catch(t){n.e(t)}finally{n.f()}},getEshRole:function t(){var e=this.getAggregation("items");var r=e[0];var n=r.getContent()[0];return n.getProperty("eshRole")},attachSelectionChange:function t(){}});return l})})();