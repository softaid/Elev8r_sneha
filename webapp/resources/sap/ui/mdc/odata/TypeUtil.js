/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/util/TypeUtil","sap/ui/mdc/enum/BaseType","sap/base/util/ObjectPath"],function(e,a,t){"use strict";var i=Object.assign({},e,{getPrimitiveType:function(e){var a={"Edm.Binary":"boolean","Edm.Boolean":"boolean","Edm.Byte":"boolean","Edm.Date":"date","Edm.DateTimeOffset":"dateTime","Edm.Decimal":"int","Edm.Double":"boolean","Edm.Duration":"float","Edm.Guid":"string","Edm.Int16":"int","Edm.Int32":"int","Edm.Int64":"int","Edm.SByte":"boolean","Edm.Single":"float","Edm.String":"string","Edm.TimeOfDay":"time"};return a[e]||"object"},getDataTypeClassName:function(a){var t={"Edm.Boolean":"sap.ui.model.odata.type.Boolean","Edm.Byte":"sap.ui.model.odata.type.Byte","Edm.DateTime":"sap.ui.model.odata.type.DateTime","Edm.DateTimeOffset":"sap.ui.model.odata.type.DateTimeOffset","Edm.Decimal":"sap.ui.model.odata.type.Decimal","Edm.Double":"sap.ui.model.odata.type.Double","Edm.Float":"sap.ui.model.odata.type.Single","Edm.Guid":"sap.ui.model.odata.type.Guid","Edm.Int16":"sap.ui.model.odata.type.Int16","Edm.Int32":"sap.ui.model.odata.type.Int32","Edm.Int64":"sap.ui.model.odata.type.Int64","Edm.SByte":"sap.ui.model.odata.type.SByte","Edm.Single":"sap.ui.model.odata.type.Single","Edm.String":"sap.ui.model.odata.type.String","Edm.Time":"sap.ui.model.odata.type.Time"};if(t[a]){a=t[a]}else if(a&&a.startsWith("Edm.")){throw new Error("Invalid data type "+a)}else{a=e.getDataTypeClassName.call(this,a)}return a},getBaseType:function(t,i,d){switch(t){case"sap.ui.model.odata.type.DateTime":if(d&&d.displayFormat==="Date"){return a.Date}else{return a.DateTime}case"sap.ui.model.odata.type.DateTimeOffset":case"sap.ui.model.odata.type.DateTimeWithTimezone":return a.DateTime;case"sap.ui.model.odata.type.Time":return a.Time;case"sap.ui.model.odata.type.Boolean":return a.Boolean;case"sap.ui.model.odata.type.Byte":case"sap.ui.model.odata.type.SByte":case"sap.ui.model.odata.type.Decimal":case"sap.ui.model.odata.type.Int16":case"sap.ui.model.odata.type.Int32":case"sap.ui.model.odata.type.Int64":case"sap.ui.model.odata.type.Single":case"sap.ui.model.odata.type.Double":return a.Numeric;default:return e.getBaseType.call(this,t,i,d)}},internalizeValue:function(t,i,d,o){var m=this._normalizeType(i,d,o);if(this.getBaseType(m)===a.Numeric){if(typeof t!=="string"&&(m.getMetadata().getName()==="sap.ui.model.odata.type.Int64"||m.getMetadata().getName()==="sap.ui.model.odata.type.Decimal")){return t.toString()}}return e.internalizeValue.call(this,t,i,d,o)},externalizeValue:function(t,i,d,o){var m=this._normalizeType(i,d,o);if(this.getBaseType(m)===a.Numeric){if(typeof t!=="string"&&(m.getMetadata().getName()==="sap.ui.model.odata.type.Int64"||m.getMetadata().getName()==="sap.ui.model.odata.type.Decimal")){return t.toString()}}return e.externalizeValue.call(this,t,i,d,o)}});return i});