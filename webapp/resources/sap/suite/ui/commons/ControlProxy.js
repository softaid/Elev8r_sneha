sap.ui.define(["./library","sap/ui/core/Control"],function(t,o){"use strict";var s=o.extend("sap.suite.ui.commons.ControlProxy",{metadata:{library:"sap.suite.ui.commons",association:{control:{type:"sap.ui.core.Control",multiple:false}}},renderer:function(t,o){var s=o.getAssociation("control"),a=sap.ui.getCore().byId(s);t.renderControl(a)}});s.prototype.setAssociation=function(t,s){o.prototype.setAssociation.apply(this,arguments);var a=this.getAssociation("control"),e=sap.ui.getCore().byId(a);if(e&&Array.isArray(this.aCustomStyleClasses)){this.aCustomStyleClasses.forEach(function(t){e.addStyleClass(t)})}};s.prototype.addStyleClass=function(t){o.prototype.addStyleClass.apply(this,arguments);var s=this.getAssociation("control"),a=sap.ui.getCore().byId(s);if(a){a.addStyleClass(t)}};return s});