/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/fl/support/apps/contentbrowser/lrepConnector/LRepConnector","sap/ui/fl/support/apps/contentbrowser/utils/DataUtils","sap/ui/fl/Layer","sap/m/Dialog","sap/m/Text","sap/m/Button","sap/m/Input","sap/m/library","sap/ui/model/json/JSONModel","sap/ui/core/UIComponent"],function(e,t,n,a,i,o,s,r,l,c,p){"use strict";var u=l.ButtonType;return e.extend("sap.ui.fl.support.apps.contentbrowser.controller.ContentDetailsEdit",{oSelectedContentModel:undefined,oDataUtils:n,onInit:function(){this._initAndBindSelectedContentModel();var e=p.getRouterFor(this);e.getRoute("ContentDetailsEdit").attachMatched(this._onRouteMatched,this)},_initAndBindSelectedContentModel:function(){this.oSelectedContentModel=new c;this.getView().setModel(this.oSelectedContentModel,"selectedContent")},_onRouteMatched:function(e){var n=this;var a=e.getParameter("arguments");var i={};i.layer=a.layer;i.namespace=decodeURIComponent(a.namespace);i.fileName=a.fileName;i.fileType=a.fileType;if(i.namespace[i.namespace.length-1]!=="/"){i.namespace+="/"}var o=i.namespace+i.fileName+"."+i.fileType;var s=n.getView().getContent()[0];s.setBusy(true);return t.getContent(i.layer,o,null,null,true).then(n._onContentReceived.bind(n,i,s,o),function(){s.setBusy(false)})},_onContentReceived:function(e,a,i,o){return t.getContent(e.layer,i,true).then(function(t){e.data=n.formatData(o,e.fileType);e.metadata=t;this.oSelectedContentModel.setData(e);e.metadata.some(function(e){if(e.name==="layer"){if(e.value==="CUSTOMER"){this.getView().byId("activeVersionCheckBox").setVisible(true)}else{this.getView().byId("activeVersionCheckBox").setVisible(true)}return true}}.bind(this));a.setBusy(false)}.bind(this),function(){a.setBusy(false)})},onSave:function(){var e=this;var t=this.getView().getModel("selectedContent");var n=this.getView().byId("activeVersionCheckBox").getSelected();var l=t.getData();var c;var p;var d;var f;var m;l.metadata.some(function(e){if(e.name==="layer"){c=e.value;return true}});l.metadata.some(function(e){if(e.name==="transportId"){p=e.value;return true}});try{d=JSON.parse(l.data).packageName}catch(e){}if(c===a.USER||c==="LOAD"||c==="VENDOR_LOAD"||!p&&(!d||d==="$TMP")){f=undefined;this._saveFile(c,l.namespace,l.fileName,l.fileType,l.data,f,m,n)}else if(p==="ATO_NOTIFICATION"){f=p;this._saveFile(c,l.namespace,l.fileName,l.fileType,l.data,f,m,n)}else{var v=!!(c===a.VENDOR||c===a.CUSTOMER_BASE);var h=new r({visible:v,placeholder:"Package name (Only necessary for cross client content)"});var y=new r({placeholder:"Transport ID or ATO_NOTIFICATION"});var C=new i({title:"{i18n>transportInput}",type:"Message",content:[new o({text:"{i18n>transportInputDescription}"}),h,y],beginButton:new s({text:"{i18n>confirm}",type:u.Reject,press:function(){m=h.getValue();f=y.getValue();C.close();e._saveFile(c,l.namespace,l.fileName,l.fileType,l.data,f,m)}}),endButton:new s({text:"{i18n>cancel}",press:function(){C.close()}}),afterClose:function(){C.destroy()}});this.getView().addDependent(C);C.open()}},_saveFile:function(e,n,a,i,o,s,r,l){return t.saveFile(e,n,a,i,o,s,r,l).then(this._navToDisplayMode.bind(this))},onCancel:function(){this._navToDisplayMode()},_navToDisplayMode:function(){var e=this.getView().getModel("selectedContent");var t=e.getData();var n=p.getRouterFor(this);n.navTo("ContentDetailsFlip",{layer:t.layer,namespace:encodeURIComponent(t.namespace),fileName:t.fileName,fileType:t.fileType})}})});