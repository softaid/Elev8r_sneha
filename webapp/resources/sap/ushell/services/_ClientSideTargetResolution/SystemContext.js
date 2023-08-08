// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/util/ObjectPath","sap/ui/thirdparty/URI"],function(t,r){"use strict";var e={};e._getProtocol=function(){return new r(window.location.toString()).protocol()};e.createSystemContextFromSystemAlias=function(e){return{id:e.id,label:e.label||e.id,getFullyQualifiedXhrUrl:function(i){var n=new r(i).protocol();if(n==="http"||n==="https"){return i}var o=this._getProtocol();var a="";if(o==="https"){a=t.get("https.xhr.pathPrefix",e)||""}else if(o==="http"){a=t.get("http.xhr.pathPrefix",e)||""}if(a){if(i.indexOf("dynamic_dest")>-1){return i}return r.joinPaths(a,i).path()}return i}.bind(this),getProperty:function(r){var i=t.get("properties",e)||{};return i[r]}}};return e});