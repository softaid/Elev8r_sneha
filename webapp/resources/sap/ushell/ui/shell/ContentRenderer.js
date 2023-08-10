// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/base/Object"],function(e){"use strict";var t=e.extend("sap.ushell.ui.shell.ContentRenderer",{constructor:function(t,r,i,n){e.apply(this);this._id=r;this._cntnt=i;this._ctrl=t;this._rm=sap.ui.getCore().createRenderManager();this._cb=n||function(){}},destroy:function(){this._rm.destroy();delete this._rm;delete this._id;delete this._cntnt;delete this._cb;delete this._ctrl;if(this._rerenderTimer){clearTimeout(this._rerenderTimer);delete this._rerenderTimer}e.prototype.destroy.apply(this,arguments)},render:function(){if(!this._rm){return}if(this._rerenderTimer){clearTimeout(this._rerenderTimer)}this._rerenderTimer=setTimeout(function(){var e=document.getElementById(this._id);var t=e!=null;if(t){if(typeof this._cntnt==="string"){var r=this._ctrl.getAggregation(this._cntnt,[]);for(var i=0;i<r.length;i++){this._rm.renderControl(r[i])}}else{this._cntnt(this._rm)}this._rm.flush(e)}this._cb(t)}.bind(this),0)}});return t});