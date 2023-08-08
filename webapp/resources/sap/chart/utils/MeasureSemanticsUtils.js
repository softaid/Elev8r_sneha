/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/chart/coloring/ColoringUtils","sap/chart/coloring/ColorPalette","sap/chart/data/MeasureSemantics","sap/chart/coloring/CriticalityType","sap/chart/ChartLog","sap/chart/ColoringType","sap/chart/coloring/criticality/Criticality","sap/chart/utils/ChartUtils","sap/ui/thirdparty/jquery"],function(e,t,a,r,i,n,l,u,s){"use strict";var c=["sapUiChartPaletteQualitativeHue1","sapUiChartPaletteQualitativeHue2","sapUiChartPaletteQualitativeHue3","sapUiChartPaletteQualitativeHue4","sapUiChartPaletteQualitativeHue5","sapUiChartPaletteQualitativeHue6","sapUiChartPaletteQualitativeHue7","sapUiChartPaletteQualitativeHue8","sapUiChartPaletteQualitativeHue9","sapUiChartPaletteQualitativeHue10","sapUiChartPaletteQualitativeHue11","sapUiChartPaletteQualitativeHue12","sapUiChartPaletteQualitativeHue13","sapUiChartPaletteQualitativeHue14","sapUiChartPaletteQualitativeHue15","sapUiChartPaletteQualitativeHue16","sapUiChartPaletteQualitativeHue17","sapUiChartPaletteQualitativeHue18","sapUiChartPaletteQualitativeHue19","sapUiChartPaletteQualitativeHue20","sapUiChartPaletteQualitativeHue21","sapUiChartPaletteQualitativeHue22"],o=[["sapUiChartPaletteSequentialHue1","sapUiChartPaletteSequentialHue1Light2","sapUiChartPaletteSequentialHue1Dark1"],["sapUiChartPaletteSequentialHue2","sapUiChartPaletteSequentialHue2Light2","sapUiChartPaletteSequentialHue2Dark1"]],f="sapUiChartPaletteSequentialNeutralDark2",p="sapUiChartPaletteSemanticNeutral",d={actual:"solid",projected:"dash",reference:"dot"},h={projected:"diagonalLightStripe",reference:"noFill"};var v=[r.Positive,r.Neutral,r.Critical,r.Negative];function m(e){var t={};if(e.getSemanticallyRelatedMeasures){var a=e.getSemanticallyRelatedMeasures();if(a){if(a.projectedValueMeasure){t.projected=a.projectedValueMeasure}if(a.referenceValueMeasure){t.reference=a.referenceValueMeasure}return t}}return t}function g(e,t){var a=e.reduce(function(e,t){e[t.getName()]={msr:t,sem:t.getSemantics&&t.getSemantics()||"actual",rel:m(t)};return e},{});s.each(a,function(e,t){if(t.sem==="actual"){s.each(t.rel,function(e,r){if(a[r]&&a[r].sem!==e){delete t.rel[e];var n=new i("error","Semantic Pattern",r+" shouldn't be used as "+e+" in semantic relation. ");n.display()}})}});if(t){for(var r=0;r<t.length;r++){var n=t[r];var l=m(n);if(l.projected&&l.reference&&a[l.projected]&&a[l.reference]){a[l.projected]={msr:n,sem:"projected",rel:{reference:l.reference}}}}}return a}function C(e,t,r){var n=[],l=0,u;var c;if(!r){c=e.slice().sort(function(a,r){var i=t[a.getName()].sem,n=t[r.getName()].sem;if(i<n){return-1}else if(i>n){return 1}else{return e.indexOf(a)-e.indexOf(r)}})}else{c=s.extend(true,{},e)}s.each(c,function(e,c){var o=c.getName();if(!t[o]){return}var f=t[o];var p={};var d;p[r?"actual":f.sem]=o;if(c.getLabel){d=c.getLabel();if(d){p.labels={};p.labels[f.sem]=d}}p.index=l++;if(!r&&(f.sem==="actual"||f.sem==="projected")){if(f.rel.projected){if(t[f.rel.projected]){p.projected=f.rel.projected;if(t[f.rel.projected].msr.getLabel){d=t[f.rel.projected].msr.getLabel();if(d){p.labels=s.extend(true,p.labels,{projected:d})}}delete t[f.rel.projected]}else{u=new i("error","Semantic Pattern",f.msr.getName()+" has an invalid projected semantic relation.");u.display()}}if(f.rel.reference){if(t[f.rel.reference]){p.reference=f.rel.reference;if(t[f.rel.reference].msr.getLabel){d=t[f.rel.reference].msr.getLabel();if(d){p.labels=s.extend(true,p.labels,{reference:d})}}delete t[f.rel.reference]}else{u=new i("error","Semantic Pattern",f.msr.getName()+" has an invalid reference semantic relation.");u.display()}}delete t[o]}p.order=[a.Actual,a.Projected,a.Reference];n.push(p)});return n}var P=function(e,t){if(!e.dataPointStyle){e=s.extend(true,e,{dataPointStyle:{rules:[],others:null}})}e.dataPointStyle.rules.push(t)};var y=function(e,t,a){var r,i;if(e.indexOf("dual")===-1){i=c;r=c.length}else{var n=a==="valueAxis"?0:1;i=o[n];r=i.length}return{actual:i[t%r],projected:i[t%r],reference:i[t%r]}};var S=function(e,t,r){if(e.projectedValueStartTime&&e.timeAxis&&t!==a.Reference){r=r||function(){return true};var i=function(t){return t.hasOwnProperty(e.semanticMsrName)};if(t===a.Actual){return function(t){return r(t)&&i(t)&&new Date(t[e.timeAxis]).getTime()<e.projectedValueStartTime}}else if(t===a.Projected){return function(t){return r(t)&&i(t)&&new Date(t[e.timeAxis]).getTime()>=e.projectedValueStartTime}}}else{r=r||function(a){return a.hasOwnProperty(e[t])};return r}};var U=function(r,i,n,l){var u,s;if(i){if(r.iUnMentionedIndex==undefined){s=p}else{u=e.assignUnmentionedColor(t.CRITICALITY.Neutral,l.unMentionedTuplesNumber);s=u[r.iUnMentionedIndex]}}else{if(n===a.Reference&&l.hasSingleReference){s=f}else{u=y(l.chartType,r.index,r.valueAxisID);s=u[n]}}return s};var x=function(e,t,a){var r=false;if(e.chartType.indexOf("combination")>-1){if(e.chartType.indexOf("timeseries")>-1){if(t.index!==0||t.valueAxisID!=="valueAxis"){r=true}else{if(t.hasOwnProperty("actual")){if(!t.projectedValueStartTime&&a!=="actual"||a==="reference"){r=true}}}}else{if(a!=="actual"){r=true}}}return r};var b=function(r,i,n,l,s){var c,o,f={},p;var m=r[n];var g;(i||[]).forEach(function(e){if(e.parsed.msr&&e.parsed.msr.getName()===m){o=e.parsed;g=e.type}});var C=r.labels&&r.labels[n]?r.labels[n]:m;if(r.semanticMsrName&&(n===a.Actual||n===a.Projected)){f[r.semanticMsrName]=C}if(o){var y=v,b,j=0;if(i.Levels){y=i.Levels;b=t.GRADATION.SingleColorScheme[i.SingleColorScheme];j=y.length}y.forEach(function(a,v){var m=o.callbacks[a];if(m){var C=S(r,n,m[0]);var y=e.assignColor(b||t.CRITICALITY[a],j||m.length);if(i.Saturation==="DarkToLight"){y=y.reverse()}c=y[j===0?0:v];p={color:c,pattern:h[n]};if(u.CONFIG.lineChartType.indexOf(s.chartType)>-1){p.lineType=d[n];if(g==="Static"||g==="DelineatedMeasures"){p.lineColor=c}}if(x(s,r,n)){if(n==="projected"){p.pattern=""}p.lineType=d[n];if(g==="Static"){p.lineColor=c}}P(l,{callback:C,properties:p,displayName:o.legend[a],dataName:f})}})}else{if(!i||i.bShowUnmentionedMsr){var T=S(r,n);c=U(r,i,n,s);p={color:c,pattern:h[n]};if(u.CONFIG.lineChartType.indexOf(s.chartType)>-1){p.lineType=d[n];p.lineColor=c}if(x(s,r,n)){if(n==="projected"){p.pattern=""}p.lineType=d[n];p.lineColor=c}P(l,{callback:T,properties:p,displayName:C,dataName:f})}}};var j=function(e){return e.reference&&!(e.actual||e.projected)};var T=function(e,t,r,i){var n=e.filter(function(e){return e.reference}).length===1;var l=e.filter(function(e){return e.hasOwnProperty("iUnMentionedIndex")}).length;e.forEach(function(e){e.order.forEach(function(u){var s=true;if(i.indexOf("bullet")>-1){s=u!==a.Reference||j(e)}if(e.hasOwnProperty(u)&&s){var c={chartType:i,hasSingleReference:n,unMentionedTuplesNumber:l};b(e,t,u,r,c)}})})};var H=function(e,t,a,r,u,c){a=a||{};var o=a.type===n.Criticality&&a.subType==="MeasureValues"&&!(a.qualifiedSettings&&a.qualifiedSettings.bMBC);var f=a.type===n.Gradation&&a.subType==="DelineatedMeasures";var p={};if(!u){p.plotArea={dataPointStyle:null}}if(!c){p.legend={title:{text:null,visible:e.indexOf("waterfall")>-1?true:false}}}else{p.legend={}}var d,h=true;if(r&&N(t)||o||f){var v=o||f?a.qualifiedSettings:null;T(t,v,p.plotArea,e);s.extend(true,p.legend,l.getLegendProps(v))}else if(a.ruleGenerator){try{var m=a.ruleGenerator();s.extend(true,p,m.properties);d=m.colorScale}catch(e){if(e instanceof i){e.display()}else{throw e}}}if(d){h=false}return{properties:p,scales:d?[d]:[],replaceColorScales:h}};function N(e){if(e){return e.some(function(e){return e.hasOwnProperty(a.Projected)||e.hasOwnProperty(a.Reference)})}return false}function O(e,t){var a;var r;if(e){r=e.slice(0);r.sort(function(e,t){return e.index>t.index?1:-1})}if(t.indexOf("combination")>-1&&e){var i=true;for(var n=0;n<r.length;n++){if(r[n].hasOwnProperty("projected")||r[n].hasOwnProperty("reference")){i=false;break}}var l=[];var u=[];if(!i){r.forEach(function(e){e.order.forEach(function(t){if(e.hasOwnProperty(t)){if(e.valueAxisID==="valueAxis"){l.push(t==="actual"?"bar":"line")}else{u.push(t==="actual"?"bar":"line")}}})})}else{return}a={plotArea:{dataShape:{primaryAxis:l,secondaryAxis:u}}}}return a}return{getTuples:function(e,t,a){return C(e,g(e,t),a)},getSemanticVizSettings:H,hasSemanticRelation:N,getSemanticSettingsForCombination:O}});