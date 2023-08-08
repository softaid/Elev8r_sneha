/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["sap/esh/search/ui/eventlogging/EventLogger","sap/ui/base/Object","./sinaNexTS/providers/abap_odata/UserEventLogger"],function(e,t,n){function r(e,t){if(!(e instanceof t)){throw new TypeError("Cannot call a class as a function")}}function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||false;r.configurable=true;if("value"in r)r.writable=true;Object.defineProperty(e,r.key,r)}}function i(e,t,n){if(t)o(e.prototype,t);if(n)o(e,n);Object.defineProperty(e,"prototype",{writable:false});return e}function u(e,t){if(typeof t!=="function"&&t!==null){throw new TypeError("Super expression must either be null or a function")}e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:true,configurable:true}});Object.defineProperty(e,"prototype",{writable:false});if(t)f(e,t)}function f(e,t){f=Object.setPrototypeOf||function e(t,n){t.__proto__=n;return t};return f(e,t)}function s(e){var t=l();return function n(){var r=g(e),o;if(t){var i=g(this).constructor;o=Reflect.construct(r,arguments,i)}else{o=r.apply(this,arguments)}return a(this,o)}}function a(e,t){if(t&&(typeof t==="object"||typeof t==="function")){return t}else if(t!==void 0){throw new TypeError("Derived constructors may only return object or undefined")}return c(e)}function c(e){if(e===void 0){throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}return e}function l(){if(typeof Reflect==="undefined"||!Reflect.construct)return false;if(Reflect.construct.sham)return false;if(typeof Proxy==="function")return true;try{Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}));return true}catch(e){return false}}function g(e){g=Object.setPrototypeOf?Object.getPrototypeOf:function e(t){return t.__proto__||Object.getPrototypeOf(t)};return g(e)}var p=n["UserEventType"];var y=function(t){u(o,t);var n=s(o);function o(t,i){var u;r(this,o);u=n.call(this);u._model=i;if(t){u.setHref(t.href);u.setText(t.text);u.setTarget(t.target);u.setLoggingType(t.loggingType);u.setPositionInList(t.positionInList)}if(u._model.eventLogger===undefined){u._model.eventLogger=new e({sinaNext:u._model.sinaNext});Object.assign(u._model.eventLogger,p)}if(typeof u._loggingType==="undefined"){u.setLoggingType(p.RESULT_LIST_ITEM_NAVIGATE)}return u}i(o,[{key:"getPositionInList",value:function e(){return this._positionInList}},{key:"setPositionInList",value:function e(t){this._positionInList=t}},{key:"getHref",value:function e(){return this._href}},{key:"setHref",value:function e(t){this._href=t}},{key:"getText",value:function e(){return this._text}},{key:"setText",value:function e(t){this._text=t}},{key:"getTarget",value:function e(){return this._target}},{key:"setTarget",value:function e(t){this._target=t}},{key:"getLoggingType",value:function e(){return this._loggingType}},{key:"setLoggingType",value:function e(t){this._loggingType=t}},{key:"performNavigation",value:function e(t){this.trackNavigation(t);if(!this._target){window.open(this._href,"_blank","noopener,noreferrer")}else{window.open(this._href,this._target,"noopener,noreferrer")}}},{key:"trackNavigation",value:function e(t){this._model.eventLogger.logEvent({type:t&&t.loggingType||this.getLoggingType(),targetUrl:this.getHref(),positionInList:this.getPositionInList(),executionId:this.getResultSetId()})}},{key:"getResultSetId",value:function e(){return""}},{key:"isEqualTo",value:function e(t){if(!t){return false}return this.getHref()==t.getHref()}}]);return o}(t);return y})})();