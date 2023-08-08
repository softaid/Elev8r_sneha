/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/AggregationBaseDelegate"],function(n){"use strict";var t=Object.assign({},n);t.zoomIn=function(n,t){};t.zoomOut=function(n,t){};t.getZoomState=function(n){};t.getFilterDelegate=function(){return{addItem:function(n,t){return Promise.resolve()},addCondition:function(n,t,e){return Promise.resolve()},removeCondition:function(n,t,e){return Promise.resolve()}}};t.addItem=function(n,t,e,o){};t.getInnerChartSelectionHandler=function(n){};t.setLegendVisible=function(n,t){};t.getSorterForItem=function(n,t){};t.insertItemToInnerChart=function(n,t,e){};t.removeItemFromInnerChart=function(n,t){};t.removeItem=function(n,t){return Promise.resolve(true)};t.initializeInnerChart=function(n){};t.createInitialChartContent=function(n){};t.getInnerChart=function(){};t.getChartTypeInfo=function(){};t.getChartTypeLayoutConfig=function(){};t.getAvailableChartTypes=function(n){};t.getDrillStack=function(n){};t.getSortedDimensions=function(n){};t.getDrillableItems=function(n){};t.setChartType=function(n){};t.changedNoDataStruct=function(n){};t.createInnerChartContent=function(n,t){};t.rebindChart=function(n,t){};t.rebind=function(n,t){};t.getInnerChartBound=function(n){};t.updateBindingInfo=function(n,t){};t.setChartTooltipVisibility=function(n,t){};t.getInternalChartNameFromPropertyNameAndKind=function(n,t,e){};t.getPropertyFromNameAndKind=function(n,t,e){};t.initPropertyHelper=function(n){return Promise.resolve(true)};t.setNoDataText=function(n,t){};t.fetchProperties=function(n){};t.showOverlay=function(n,t){};return t});