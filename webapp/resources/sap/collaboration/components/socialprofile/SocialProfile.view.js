/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/mvc/JSView","sap/m/VBox","sap/m/Label","sap/m/Text","sap/m/Link","sap/m/HBox","sap/m/Image","sap/m/ObjectStatus"],function(e,t,a,s,i,r,d,l){"use strict";sap.ui.jsview("sap.collaboration.components.socialprofile.SocialProfile",{getControllerName:function(){return"sap.collaboration.components.socialprofile.SocialProfile"},createContent:function(e){this._sPrefixId=this.getId();this._oVBox=new t(this._sPrefixId+"_VBox").addStyleClass("vbox");this._createVBoxContent();return this._oVBox},_createVBoxContent:function(){this._oVBox.addItem(this._createHBoxHeader());var e=new a(this._sPrefixId+"_ContactDetailsLabel",{text:this.getViewData().langBundle.getText("SP_CONTACT_DETAILS_LABEL")}).addStyleClass("heading");var t=new s(this._sPrefixId+"_MobileNumber",{text:"{/MemberProfile/MobilePhoneNumber}"});var r=new a(this._sPrefixId+"_MobileLabel",{text:this.getViewData().langBundle.getText("SP_MOBILE_LABEL"),labelFor:t.getId()}).addStyleClass("label");var d=new s(this._sPrefixId+"_WorkNumber",{text:"{/MemberProfile/WorkPhoneNumber}"});var l=new a(this._sPrefixId+"_WorkLabel",{text:this.getViewData().langBundle.getText("SP_WORK_LABEL"),labelFor:d.getId()}).addStyleClass("label");var o=new i(this._sPrefixId+"_Email",{text:"{/Email}",press:function(){this.setHref("mailto:"+this.getText())}});var n=new a(this._sPrefixId+"_EmailLabel",{text:this.getViewData().langBundle.getText("SP_EMAIL_LABEL"),labelFor:o.getId()}).addStyleClass("label");var _=new a(this._sPrefixId+"_CompanyDetailsLabel",{text:this.getViewData().langBundle.getText("SP_COMPANY_DETAILS_LABEL")}).addStyleClass("heading");var x=new s(this._sPrefixId+"_CompanyAddress",{text:"{/MemberProfile/Address}"});var I=new a(this._sPrefixId+"_CompanyAddressLabel",{text:this.getViewData().langBundle.getText("SP_COMPANY_ADDRESS_LABEL"),labelFor:x.getId()}).addStyleClass("label");this._oVBox.addItem(e).addItem(r).addItem(t).addItem(l).addItem(d).addItem(n).addItem(o).addItem(_).addItem(I).addItem(x)},_createHBoxHeader:function(){var e=new t(this._sPrefixId+"_HeaderVBox").addStyleClass("headervbox");var a=new s(this._sPrefixId+"_FullName",{text:"{/FullName}",width:"200px",maxLines:1}).addStyleClass("fullname");var i=new s(this._sPrefixId+"_Role",{text:"{/Title}",width:"200px",maxLines:1}).addStyleClass("role");e.addItem(a).addItem(i);var o=new r(this._sPrefixId+"_HeaderHBox",{height:"48px"});var n=new d(this._sPrefixId+"_HeaderUserImage",{src:"{/UserImage}",alt:"{/FullName}",width:"48px",height:"48px"}).addStyleClass("image");var _=new l(this._sPrefixId+"_NoUserHeader",{text:this.getViewData().langBundle.getText("SP_NO_USER"),state:"Warning",icon:"sap-icon://alert",visible:false});o.addItem(n).addItem(e).addItem(_);return o},resetHeader:function(){var e=sap.ui.getCore().byId(this._sPrefixId+"_NoUserHeader");if(e.getVisible()===true){e.setVisible(false);sap.ui.getCore().byId(this._sPrefixId+"_HeaderVBox").setVisible(true);sap.ui.getCore().byId(this._sPrefixId+"_HeaderUserImage").setVisible(true)}},setHeaderNoUser:function(){var e=sap.ui.getCore().byId(this._sPrefixId+"_HeaderUserImage");if(e.getVisible()===true){e.setVisible(false);sap.ui.getCore().byId(this._sPrefixId+"_HeaderVBox").setVisible(false);sap.ui.getCore().byId(this._sPrefixId+"_NoUserHeader").setVisible(true)}}})});