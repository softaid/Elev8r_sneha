/*
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/chart/coloring/emphasis/DimensionValues","sap/chart/coloring/ColorPalette","sap/chart/coloring/ColoringUtils","sap/chart/ChartLog","sap/chart/data/TimeDimension"],function(e,r,a,i,s){"use strict";var t=["DimensionValues","MeasureValues"];function n(e,a){var i=e[0];var s=i.parsed.callbacks.Highlight||[];var t=i.parsed.legend;var n=[];n.push({callback:s,properties:{color:r.EMPHASIS.Highlight},displayName:t.Highlight});var o={properties:{color:r.EMPHASIS.Others},displayName:t.Others};return{rules:n,others:o}}function o(e,r){return function(){var r={plotArea:{dataPointStyle:n(e)}};return{properties:r}}}return{getCandidateSetting:function(r,i,s,n,l,p,u){var c=r.Emphasis||{},h=i.parameters||{};var g=a.dimOrMsrUse(c,h,t,"Emphasis");var m;switch(g){case"DimensionValues":var d=h.dimension||Object.keys(c.DimensionValues);if(typeof d==="string"||d instanceof String){d=[d]}m=e.qualify(c.DimensionValues,d,n,p);if(m){m.parsed=e.parse(m,u);m.ruleGenerator=o([m])}break;default:return{}}if(m.length){m.subType=g}return m}}});