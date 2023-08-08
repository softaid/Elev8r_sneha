/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/comp/library","sap/suite/ui/microchart/ComparisonMicroChart","sap/suite/ui/microchart/ComparisonMicroChartData","sap/ui/core/Control","sap/ui/model/odata/CountMode","sap/ui/core/format/DateFormat","sap/m/library","sap/base/Log","sap/ui/comp/smartmicrochart/SmartMicroChartBase","./SmartMicroChartRenderer"],function(t,a,i,o,n,e,r,s,h,p){"use strict";var c=h.extend("sap.ui.comp.smartmicrochart.SmartComparisonMicroChart",{metadata:{library:"sap.ui.comp",designtime:"sap/ui/comp/designtime/smartmicrochart/SmartComparisonMicroChart.designtime"},renderer:p});c.prototype._CHART_TYPE=["Comparison"];c.prototype.init=function(){this._bIsInitialized=false;this._bMetaModelLoadAttached=false;this.setProperty("chartType","Comparison",true);this.setAggregation("_chart",new a,true)};c.prototype.onBeforeRendering=function(){var t=this.getAggregation("_chart");t.setSize(this.getSize(),true);t.setWidth(this.getWidth(),true);t.setHeight(this.getHeight(),true)};c.prototype._createAndBindInnerChart=function(){if(!(this._oDataPointAnnotations.Value&&this._oDataPointAnnotations.Value.Path)){s.error("Value DataPoint annotation missing! Cannot create the SmartComparisonMicroChart");return}var t=this.getAggregation("_chart"),a=new i({value:{path:this._oDataPointAnnotations.Value.Path,type:"sap.ui.model.odata.type.Decimal"}});if(this._oDataPointAnnotations.Criticality&&this._oDataPointAnnotations.Criticality.Path){a.bindProperty("color",{path:this._oDataPointAnnotations.Criticality.Path,formatter:this._mapCriticalityTypeWithColor.bind(this)})}if(this._oDataPointAnnotations.Title&&this._oDataPointAnnotations.Title.Path){a.bindProperty("title",this._oDataPointAnnotations.Title.Path)}var o=this._getPropertyAnnotation.call(this,this._oDataPointAnnotations.Value.Path);var n=o["com.sap.vocabularies.Common.v1.Text"];if(n&&n.Path){a.bindProperty("displayValue",n.Path)}t.bindAggregation("data",{path:this._getBindingPath(),template:a,events:{change:this._onBindingDataChange.bind(this)}})};c.prototype._onBindingDataChange=function(){var t=this.getAggregation("_chart").getBinding("data");this._updateAssociations(t)};return c});