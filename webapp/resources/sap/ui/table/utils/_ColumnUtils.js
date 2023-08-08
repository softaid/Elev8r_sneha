/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device","../library","sap/base/Log"],function(e,n,r){"use strict";var t={TableUtils:null,initColumnUtils:function(e){if(!e._oColumnInfo){t.updateColumnInfo(e,t.collectColumnInfo(e))}},invalidateColumnUtils:function(e){e._oColumnInfo=null},updateColumnInfo:function(e,n){e._oColumnInfo=n},collectColumnInfo:function(e){return{columnCount:e.getColumns().length,visibleColumnCount:t.TableUtils.getVisibleColumnCount(e),columnMap:t.getColumnMap(e)}},getColumnMap:function(e){var n;var r;var a={};var l={};var u=e.getColumns();var o=t.TableUtils.getHeaderRowCount(e);var i={};for(var f=0;f<u.length;f++){r=u[f];a={};a.id=r.getId();a.column=r;a.levelInfo=[];a.parents=[];for(var s=0;s<o;s++){a.levelInfo[s]={};a.levelInfo[s].spannedColumns=[];var d=t.getHeaderSpan(r,s);for(n=1;n<d;n++){var v=u[f+n];if(v){var g=v.getId();a.levelInfo[s].spannedColumns.push(u[f+n]);if(!i[g]){i[g]=[]}i[g].push({column:r,level:s})}}}l[a.id]=a}var m=Object.keys(i);for(n=0;n<m.length;n++){var C=m[n];l[C].parents=i[C]}return l},getColumnMapItem:function(e,n){t.initColumnUtils(e);var a=e._oColumnInfo.columnMap[n];if(!a){r.error("Column with ID '"+n+"' not found",e)}else{return a}},getParentSpannedColumns:function(e,n,r){var a=t.getColumnMapItem(e,n);if(!a){return undefined}var l=[];for(var u=0;u<a.parents.length;u++){var o=a.parents[u];if(r===undefined||o.level===r){l.push(o)}}return l},getChildrenSpannedColumns:function(e,n,r){var a=t.getColumnMapItem(e,n);if(!a){return undefined}var l=[];var u;if(r===undefined){u=a.levelInfo.length}else{u=r+1}for(var o=r||0;o<u;o++){var i=a.levelInfo[o];for(var f=0;f<i.spannedColumns.length;f++){l.push({column:i.spannedColumns[f],level:o})}}return l},getHeaderSpan:function(e,n){var r=e.getHeaderSpan();var t;if(!r){return 1}if(!Array.isArray(r)){r=(r+"").split(",")}function a(e){var n=parseInt(e);return isNaN(n)?1:n}if(isNaN(n)){t=Math.max.apply(null,r.map(a))}else{t=a(r[n])}return Math.max(t,1)},getMaxHeaderSpan:function(e){return t.getHeaderSpan(e)},hasHeaderSpan:function(e){return t.getHeaderSpan(e)>1},getColumnBoundaries:function(e,n){var r=t.getColumnMapItem(e,n);if(!r){return undefined}var a={};if(n){a[n]=r.column}var l=function(n,r){var a;var u;var o=[];r=r||[];for(u=0;u<r.length;u++){a=n[r[u]];o=o.concat(t.getParentSpannedColumns(e,a.getId()));o=o.concat(t.getChildrenSpannedColumns(e,a.getId()))}r=[];for(u=0;u<o.length;u++){a=o[u].column;var i=a.getId();if(!n[i]){r.push(i);n[i]=a}}if(r.length>0){return l(n,r)}else{return n}};a=l(a,[n]);var u=e.indexOfColumn(r.column);var o={startColumn:r.column,startIndex:u,endColumn:r.column,endIndex:-1};var i=e.getColumns();var f=Object.getOwnPropertyNames(a);for(var s=0;s<f.length;s++){var d=a[f[s]];u=e.indexOfColumn(d);var v=t.getMaxHeaderSpan(d);if(u<o.startIndex){o.startIndex=u;o.startColumn=d}var g=u+v-1;if(g>o.endIndex){o.endIndex=g;o.endColumn=i[g]}}return o},isColumnMovable:function(e){var n=e.getParent();if(!n||!n.getEnableColumnReordering()){return false}var r=n.indexOfColumn(e);if(r<n.getComputedFixedColumnCount()||r<n._iFirstReorderableIndex){return false}if(t.hasHeaderSpan(e)||t.getParentSpannedColumns(n,e.getId()).length!=0){return false}return true},normalizeColumnMoveTargetIndex:function(e,n){var r=e.getParent(),t=r.indexOfColumn(e),a=r.getColumns();if(n>t){n--}if(n<0){n=0}else if(n>a.length){n=a.length}return n},isColumnMovableTo:function(e,n){var r=e.getParent();if(!r||n===undefined||!t.isColumnMovable(e)){return false}n=t.normalizeColumnMoveTargetIndex(e,n);if(n<r.getComputedFixedColumnCount()||n<r._iFirstReorderableIndex){return false}var a=r.indexOfColumn(e),l=r.getColumns();if(n>a){var u=l[n>=l.length?l.length-1:n];var o=t.getColumnBoundaries(r,u.getId());if(t.hasHeaderSpan(u)||o.endIndex>n){return false}}else{var i=l[n];if(t.getParentSpannedColumns(r,i.getId()).length!=0){return false}}return true},moveColumnTo:function(e,n){if(!t.isColumnMovableTo(e,n)){return false}var r=e.getParent(),a=r.indexOfColumn(e);if(n===a){return false}n=t.normalizeColumnMoveTargetIndex(e,n);var l=r.fireColumnMove({column:e,newPos:n});if(!l){return false}r._bReorderInProcess=true;r.removeColumn(e,true);r.insertColumn(e,n);r._bReorderInProcess=false;return true},getMinColumnWidth:function(){return e.system.desktop?48:88},resizeColumn:function(e,n,r,a,l){if(!e||n==null||n<0||r==null||r<=0){return false}if(l==null||l<=0){l=1}if(a==null){a=true}var u=e.getColumns();if(n>=u.length||!u[n].getVisible()){return false}var o=[];for(var i=n;i<u.length;i++){var f=u[i];if(f.getVisible()){o.push(f);if(o.length===l){break}}}var s=[];for(var i=0;i<o.length;i++){var d=o[i];if(d.getResizable()){s.push(d)}}if(s.length===0){return false}var v=0;for(var i=0;i<o.length;i++){var d=o[i];v+=t.getColumnWidth(e,d.getIndex())}var g=r-v;var m=Math.round(g/s.length);var C=false;var h=e.getDomRef();if(!t.TableUtils.isFixedColumn(e,n)){e._getVisibleColumns().forEach(function(e){var n=e.getWidth(),r;if(h&&s.indexOf(e)<0&&t.TableUtils.isVariableWidth(n)){r=h.querySelector('th[data-sap-ui-colid="'+e.getId()+'"]');if(r){e._minWidth=Math.max(r.offsetWidth,t.getMinColumnWidth())}}})}for(var i=0;i<s.length;i++){var c=s[i];var p=t.getColumnWidth(e,c.getIndex());var I=p+m;var b=t.getMinColumnWidth();if(I<b){I=b}var x=I-p;if(Math.abs(x)<Math.abs(m)){var M=s.length-(i+1);g-=x;m=Math.round(g/M)}if(x!==0){var S=true;var T=I+"px";if(a){S=e.fireColumnResize({column:c,width:T})}if(S){c.setWidth(T);C=true}}}return C},getColumnWidth:function(e,n){if(!e||n==null||n<0){return null}var r=e.getColumns();if(n>=r.length){return null}var a=r[n];var l=a.getWidth();if(l===""||l==="auto"||l.match(/%$/)){if(a.getVisible()){var u=a.getDomRef();return u?u.offsetWidth:0}else{return 0}}else{return t.TableUtils.convertCSSSizeToPixel(l)}},getHeaderText:function(e){if(!e){return null}function n(e){return e&&e.getText&&e.getText()||""}var r=e.getName();if(!r){var a=e.getMultiLabels();for(var l=a.length-1;l>=0;l--){var u=n(a[l]);if(t.getHeaderSpan(e,l)===1&&u){r=u;break}}}if(!r){r=n(e.getLabel())}return r},getHeaderLabel:function(e){if(!e){return null}var n;var r=e.getMultiLabels();for(var a=r.length-1;a>=0;a--){if(t.getHeaderSpan(e,a)===1){n=r[a];break}}if(!n){n=e.getLabel()}return n}};return t},true);