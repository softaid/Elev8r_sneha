/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
sap.ui.define(["sap/ui/core/Element","sap/ui/base/ManagedObjectObserver","sap/ui/unified/Menu","sap/ui/unified/MenuItem","sap/m/ResponsivePopover","sap/ui/vbm/Viewport","./adapter3d/ObjectFactory","./adapter3d/VBIJSONParser","./adapter3d/SceneBuilder","./adapter3d/Utilities","./adapter3d/DragDropHandler","sap/m/HBox","sap/m/VBox","sap/m/Link","sap/m/Button","sap/m/Text","sap/m/Image","./adapter3d/thirdparty/three","sap/base/Log","jquery.sap.global","./library"],function(e,t,i,o,n,r,s,a,c,l,p,h,u,d,v,f,_,m,y,w,g){"use strict";var x=m.Vector2;var b=m.Vector3;var C=l.toBoolean;var A="sap.ui.vbm.Adapter3D";var D;var B=e.extend("sap.ui.vbm.Adapter3D",{metadata:{library:"sap.ui.vbm",associations:{viewport:{type:"sap.ui.vbm.Viewport"}},events:{submit:{parameters:{data:{type:"string"}}}}}});var I=B.getMetadata().getParent().getClass().prototype;B.prototype.init=function(){if(I.init){I.init.call(this)}this._viewport=null;this._context={resources:new Map,config:new Map,dataTypes:[],data:{},windows:[],scenes:[],actions:[],voQueues:{toAdd:new Map,toUpdate:new Map,toRemove:new Map,clear:function(){this.toAdd.clear();this.toUpdate.clear();this.toRemove.clear()}},sceneQueues:{toAdd:[],toUpdate:[],toRemove:[],clear:function(){this.toAdd.length=0;this.toUpdate.length=0;this.toRemove.length=0}},windowQueues:{toAdd:[],toUpdate:[],toRemove:[],clear:function(){this.toAdd.length=0;this.toUpdate.length=0;this.toRemove.length=0}},setupView:undefined};this._update=Promise.resolve();this._parser=null;this._sceneBuilder=null;this._hoverInstance=null;this._hoverTimeOutId=null;this._clickTimerId=null;this._mouseDown=false;this._lastXY={x:0,y:0};this._viewportObserver=new t(this._observeChanges.bind(this));this._detail={popover:undefined,anchor:undefined,pending:undefined};this._raycaster=new m.Raycaster;this._dragDropHandler=null};B.prototype.exit=function(){if(this._clickTimerId){clearTimeout(this._clickTimerId);this._clickTimerId=null}if(this._hoverTimeOutId){clearTimeout(this._hoverTimeOutId);this._hoverTimeOutId=null}this._disconnectViewport();this._viewportObserver.disconnect();this._viewportObserver=null;if(this._dragDropHandler){this._dragDropHandler.destroy();this._dragDropHandler=null}if(this._sceneBuilder){this._sceneBuilder.destroy();this._sceneBuilder=null}if(this._parser){this._parser.destroy();this._parser=null}this._detail=null;this._context=null;this._raycaster=null;this._hoverInstance=null;if(I.exit){I.exit.call(this)}};B.prototype.setViewport=function(e){this.setAssociation("viewport",e,true);this._configureViewport()};B.prototype._configureViewport=function(){var e=sap.ui.getCore().byId(this.getViewport())||null;if(e!==this._viewport){this._disconnectViewport();this._viewport=e;this._connectViewport();var t=this._viewport.getOrbitControl();t.setConfig(this._context.config);t.setUtilities(l)}};B.prototype._connectViewport=function(){if(this._viewport){this._viewportObserver.observe(this._viewport,{destroy:true});this._viewport.addEventDelegate(D,this);this._dragDropHandler=new p(this)}};B.prototype._disconnectViewport=function(){if(this._viewport){this._dragDropHandler.destroy();this._dragDropHandler=null;this._viewport.removeEventDelegate(D);D.onBeforeRendering.call(this);this._viewportObserver.unobserve(this._viewport,{destroy:true});this._viewport=null}};B.prototype._observeChanges=function(e){if(e.type==="destroy"&&e.object===this._viewport){this._disconnectViewport()}};B.prototype.load=function(e){var t=this;t._configureViewport();if(!t._viewport){return Promise.reject()}var i=null;if(!t._parser){t._parser=new a(t._context)}if(!t._sceneBuilder){t._sceneBuilder=new c(t._context,t._viewport)}if(typeof e==="string"){try{i=JSON.parse(e)}catch(e){y.error("attempt to load invalid JSON string","",A);return Promise.resolve()}}else if(typeof e==="object"){i=e}if(!(i&&i.SAPVB)){y.error("attempt to load null","",A);return Promise.resolve()}t._viewport.setBusy(true);t._update=t._update.then(function(){t._parser.loadVBIJSON(i);return t._sceneBuilder.synchronize()}).then(function(){t._processAutomation(i);t._processDetailWindow();t._context.voQueues.toRemove.forEach(function(e){e.forEach(function(e){if(t._hoverInstance===e){t._hoverInstance=null}},t)},t);if(t._dragDropHandler){t._dragDropHandler.update()}t._viewport._resetBBox();t._viewport._updateCamera();t._context.voQueues.clear();t._context.sceneQueues.clear();t._context.windowQueues.clear();t._viewport.setBusy(false)});return t._update};B.prototype._processDetailWindow=function(e){var t=sap.ui.vbm.findInArray(this._context.windowQueues.toAdd,function(e){return e.type==="callout"});var i=t&&sap.ui.vbm.findInArray(this._context.scenes,function(e){return e.id===t.refScene});if(t&&i){this._closeDetailWindow();var o=this._createDetailWindow(t);this._fillDetailWindow(o,i);this._openDetailWindow(o,t)}};B.prototype._closeDetailWindow=function(){if(this._detail.popover){this._detail.popover.close();this._detail.popover.destroy();this._detail.popover=undefined}if(this._detail.anchor){this._detail.anchor.style.visibility="hidden"}};B.prototype._createDetailWindow=function(e){var t;if(e.caption!==""){var i=new sap.m.Text({width:"100%",textAlign:sap.ui.core.TextAlign.Center,text:e.caption,tooltip:e.caption});t=new sap.m.Bar({contentLeft:[i]})}var o=new sap.m.ResponsivePopover({placement:sap.m.PlacementType.Auto,showCloseButton:true,verticalScrolling:true,contentWidth:e.width+"px"});o.addStyleClass("sapUiVbmDetailWindow");if(t){o.setCustomHeader(t)}return o};B.prototype._getAnchor=function(e,t){if(!this._detail.anchor){var i=document.createElement("div");i.setAttribute("role",sap.ui.core.AccessibleRole.Note);i.classList.add("sapUiVbmDetailWindowAnchor");this._viewport.getDomRef().appendChild(i);this._detail.anchor=i}this._detail.anchor.style.left=e+"px";this._detail.anchor.style.top=t+"px";return this._detail.anchor};B.prototype._openDetailWindow=function(e,t){var i=t.pos.split(";");var o=new b(parseFloat(i[0]),parseFloat(i[1]),parseFloat(i[2]));if(!this._viewport.getDomRef()){if(this._detail.pending){this._detail.pending.popover.destroy()}this._detail.pending={world:o,popover:e}}else{var n=this._viewport.getDomRef().getBoundingClientRect();var r=this._viewport.worldToScreen(l.vbToThreeJs(o));r.x=l.clamp(r.x,5,n.width-5);r.y=l.clamp(r.y,5,n.height-5);e.openBy(this._getAnchor(r.x,r.y));e.attachAfterClose(function(){this._closeDetailWindow()}.bind(this));this._detail.popover=e}};B.prototype._openDetailPending=function(){if(this._detail.pending&&this._viewport.getDomRef()){var e=this._viewport.worldToScreen(l.vbToThreeJs(this._detail.pending.world));this._detail.pending.popover.openBy(this._getAnchor(e.x,e.y));this._detail.popover=this._detail.pending.popover;this._detail.pending=undefined}};B.prototype._fillDetailWindow=function(e,t){var i=function(e){var t;switch(e){case"1":t=sap.m.FlexJustifyContent.Start;break;case"2":t=sap.m.FlexJustifyContent.Center;break;case"4":t=sap.m.FlexJustifyContent.End;break;default:t=sap.m.FlexJustifyContent.Inherit;break}return t};var o=function(e){var t;switch(e.type){case"{00100000-2013-1000-1100-50059A6A47FA}":t=new f({text:e.vo.text,tooltip:e.vo.tooltip});t.addStyleClass("sapUiVbmDetailWindowBase sapUiVbmDetailWindowCaption");if(e.vo.level==="3"){t.addStyleClass("sapUiVbmDetailWindowCaption3")}break;case"{00100000-2013-1000-3700-AD84DDBBB31B}":t=new f({text:e.vo.text,tooltip:e.vo.tooltip});t.addStyleClass("sapUiVbmDetailwindowBase");break;case"{00100000-2013-1000-2400-D305F7942B98}":t=new d({text:e.vo.text,tooltip:e.vo.tooltip,href:e.vo.autoexecute?e.vo.reference:""});t.addStyleClass("sapUiVbmDetailWindowBase");break;case"{00100000-2013-1000-1200-855B919BB0E9}":t=new v({text:e.vo.text,tooltip:e.vo.tooltip});break;case"{00100000-2013-1000-2200-6B060A330B2C}":if(e.vo.image&&e.vo.image!==""){t=new _({src:l.makeDataUri(this._context.resources.get(e.vo.image)),tooltip:e.vo.tooltip})}break;default:y.error("attempt to create unknown element of detail window",e.type,A)}return t};var n=t.voGroups.map(function(e){return e.vos.map(function(t){return{type:e.type,vo:t}})}).reduce(function(e,t){return e.concat(t)}).sort(function(e,t){return parseInt(e.vo.top,10)-parseInt(t.vo.top,10)}).reduce(function(e,t){var i=t.vo.top?t.vo.top:"0";e[i]=e[i]||[];e[i].push(t);return e},{});var r=new u;for(var s in n){if(n.hasOwnProperty(s)){var a=new h({width:Math.max.apply(null,n[s].map(function(e){return parseInt(e.vo.right,10)}))+"px"});var c=0;n[s].sort(function(e,t){return parseInt(e.vo.left,10)-parseInt(t.vo.left,10)}).map(function(e){var t=[];if(parseInt(e.vo.left,10)-c>1){t.push(new h({width:parseInt(e.vo.left,10)-c+"px"}))}var n=new h({width:parseInt(e.vo.right,10)-parseInt(e.vo.left,10)+"px",justifyContent:i(e.vo.align)});c=parseInt(e.vo.right,10);n.addItem(o.bind(this)(e));t.push(n);return t},this).reduce(function(e,t){return e.concat(t)}).forEach(a.addItem,a);r.addItem(a)}}e.addContent(r)};B.prototype._processAutomation=function(e){var t=this;var n=function(e,r,s,a,c){var l=new o({text:r.text,enabled:r.disabled==="X"?false:true,startsSection:c,select:t._menuItemSelectionHandler.bind(t,r.id,s.instance,a,s.object)});if(r.MenuItem){var p=new i;c=false;[].concat(r.MenuItem).forEach(function(e){if(e.hasOwnProperty("Separator")){c=true}else{n(p,e,s,a,c);c=false}});l.setSubmenu(p)}e.addItem(l)};if(e&&e.SAPVB&&e.SAPVB.Automation&&e.SAPVB.Automation.Call&&e.SAPVB.Automation.Call){if(e.SAPVB.Automation.Call.handler&&e.SAPVB.Automation.Call.handler==="CONTEXTMENUHANDLER"){var r=[].concat(e.SAPVB.Automation.Call.Param).filter(function(e){return e.name==="x"});var s=[].concat(e.SAPVB.Automation.Call.Param).filter(function(e){return e.name==="y"});var a;if(r.length>0&&s.length>0){a=r[0]["#"]+" "+s[0]["#"]}if(e.SAPVB&&e.SAPVB.Menus&&e.SAPVB.Menus.Set){var c=[].concat(e.SAPVB.Menus.Set).filter(function(t){return t.Menu.id===e.SAPVB.Automation.Call.refID});if(c.length>0){var l=new i;var p=false;[].concat(c[0].Menu.MenuItem).forEach(function(t){if(t.hasOwnProperty("Separator")){p=true}else{n(l,t,e.SAPVB.Automation.Call,c[0].Menu.action,p);p=false}});var h=sap.ui.core.Popup.Dock;l.open(false,this._viewport,h.BeginTop,h.BeginTop,this._viewport,a,"fit fit")}}}}};B.prototype._menuItemSelectionHandler=function(e,t,i,o){var n={version:"2.0","xmlns:VB":"VB",Action:{id:e,instance:t,name:i,object:o}};this.fireSubmit({data:JSON.stringify(n)})};B.prototype._genericEventHandler=function(e,t){var i=l.parseKeyboardShortcut(this._context.config.has("HOME_VIEW")?this._context.config.get("HOME_VIEW"):"72");if(l.matchKeyboardShortcut(t,i)){this._viewport.applyCameraHome(false);return}var o=t.instance;var n=o?o.voGroup.id:t.voGroupId;var r=sap.ui.vbm.findInArray(this._context.actions,function(t){return t.refVO===n&&t.refEvent===e});if(r){var s=[];var a={version:"2.0","xmlns:VB":"VB",Action:{id:r.id,name:r.name,object:r.refVO,instance:o&&o.id?o.voGroup.datasource+"."+o.id:"",Params:{Param:s}}};if(r.name==="KEY_PRESS"){if(["Shift","Control","Alt","Meta"].indexOf(t.key)!==-1||[16,17,18,91].indexOf(t.code)!==-1){return}else{s.push({name:"code","#":t.keyCode},{name:"shift","#":t.shiftKey},{name:"ctrl","#":t.ctrlKey},{name:"alt","#":t.altKey},{name:"meta","#":t.metaKey})}}else if(t&&t.cursor){s.push({name:"x","#":t.cursor.x},{name:"y","#":t.cursor.y})}if(r.AddActionProperty){var c=[];[].concat(r.AddActionProperty).forEach(function(e){switch(e.name){case"pos":if(t.hitPoint){var i=l.threeJsToVb(t.hitPoint);c.push({name:e.name,"#":i.x.toFixed(5)+";"+i.y.toFixed(5)+";"+i.z.toFixed(5)})}break;case"zoom":var o=this._viewport._getCameraState();var n=this._sceneBuilder._getZoomFactor(o.position,o.target);c.push({name:e.name,"#":n.toFixed(5)});break;default:break}},this);if(c.length>0){a.Action.AddActionProperties={AddActionProperty:c}}}if(o&&e==="Click"&&t.selectionChanges){var p=o.voGroup.datasource,h;var u=l.getAttributeAlias(this._context,p,o.voGroup.keyAttributeName);a.Data={Merge:{N:[{name:o.voGroup.datasource,E:t.selectionChanges.selected.map(function(e){h={};h[u]=e.id||"";h["VB:s"]="true";return h}).concat(t.selectionChanges.deselected.map(function(e){h={};h[u]=e.id||"";h["VB:s"]="false";return h}))}]}}}this.fireSubmit({data:JSON.stringify(a)})}};B.prototype._propagateClick=function(e){this._genericEventHandler("Click",e)};B.prototype._propagateDoubleClick=function(e){this._genericEventHandler("DoubleClick",e)};B.prototype._propagateContextMenu=function(e){this._genericEventHandler("ContextMenu",e)};B.prototype._propagateKeyPress=function(e){this._genericEventHandler("KeyPress",e)};B.prototype._propogateHoverChange=function(e){this._genericEventHandler("HoverChange",e)};B.prototype._handleClick=function(e){var t=e.instance;y.trace("click","x: "+e.cursor.x+", y: "+e.cursor.y+", instance: "+(t?t.id:"")+", tooltip: "+(t?t.tooltip:""),A);this._extendEventWithSelection(e);if(e.selectionChanges){this._sceneBuilder.updateSelection(e.selectionChanges.selected,e.selectionChanges.deselected)}this._propagateClick(e)};B.prototype._handleDoubleClick=function(e){var t=e.instance;y.trace("double click","x: "+e.cursor.x+", y: "+e.cursor.y+", instance: "+(t?t.id:"")+", tooltip: "+(t?t.tooltip:""),A);this._propagateDoubleClick(e)};B.prototype._handleContextMenu=function(e){var t=e.instance;if(!t){e.voGroupId="Scene"}y.trace("context menu","x: "+e.cursor.x+", y: "+e.cursor.y+", instance: "+(t?t.id:"")+", tooltip: "+(t?t.tooltip:""),A);this._propagateContextMenu(e)};B.prototype._handleHover=function(e){var t;var i=e.instance||null;y.trace("hover","x: "+e.cursor.x+", y: "+e.cursor.y+", instance: "+(i?i.id:"")+", tooltip: "+(i?i.tooltip:""),A);if(i){t=i.tooltip;if(!t){t=i.text}}var o=this._viewport.getDomRef();if(o){if(t){o.setAttribute("title",t)}else{o.removeAttribute("title")}}if(i!==this._hoverInstance){clearTimeout(this._hoverTimeOutId);this._hoverTimeOutId=setTimeout(function(){this._propogateHoverChange(e);this._hoverTimeOutId=undefined}.bind(this),500);this._hoverInstance=i;this._sceneBuilder.updateHotInstance(this._hoverInstance)}};B.prototype._handleKeyPress=function(e){y.trace("keypress",e.key,A);this._propagateKeyPress(e)};B.prototype._getXY=function(e){var t=this._viewport.getDomRef().getBoundingClientRect();return{x:(e.pageX||e.originalEvent.pageX)-window.pageXOffset-t.left,y:(e.pageY||e.originalEvent.pageY)-window.pageYOffset-t.top}};B.prototype._hitTest=function(e){var t=this._viewport.getScene();var i=this._viewport.getCamera();var o=e.cursor||this._getXY(e);var n=this._viewport.getDomRef().getBoundingClientRect();var r=new x(o.x/n.width*2-1,-o.y/n.height*2+1);this._raycaster.layers.set(0);this._raycaster.setFromCamera(r,i);var s=this._raycaster.intersectObjects(t.children,true);if(s&&s.length>0){var a=s[0],c=a.object,l=null;if(c){if(c._instanceHitTest instanceof Function){l=c._instanceHitTest(a)}else{l=a.object._sapInstance}return{info:a,point:a.point,instance:l}}}else if(this._context.scene){s=this._viewport._intersectMapPlane(this._raycaster);if(s&&s.length>0){return{instance:null,info:s[0],point:s[0].point}}}return undefined};B.prototype._extendEventWithCursor=function(e){e.cursor=e.cursor||this._getXY(e)};B.prototype._extendEventWithInstance=function(e){this._extendEventWithCursor(e);var t=this._hitTest(e);if(t){e.instance=t.instance;e.hitPoint=t.point}else{e.instance=null}};var P=3;D={onkeydown:function(e){if(!e.originalEvent.repeat){this._handleKeyPress(e)}},oncontextmenu:function(e){this._extendEventWithInstance(e);if(this._skipClick){this._skipClick=false;this._handleHover(e)}else{this._handleContextMenu(e)}},onmousedown:function(e){if(this._hoverTimeOutId){clearTimeout(this._hoverTimeOutId);this._hoverTimeOutId=null}this._mouseDown=true;this._extendEventWithCursor(e);y.trace("mousedown","x: "+e.cursor.x+", y: "+e.cursor.y,A);this._lastXY.x=e.cursor.x;this._lastXY.y=e.cursor.y},onmouseup:function(e){this._mouseDown=false},onhover:function(e){if(this._mouseDown){this._extendEventWithCursor(e);y.trace("hover","x: "+e.cursor.x+", y: "+e.cursor.y,A);if(Math.abs(this._lastXY.x-e.cursor.x)>P||Math.abs(this._lastXY.y-e.cursor.y)>P){this._skipClick=true}}else{this._extendEventWithInstance(e);this._handleHover(e)}},onmouseout:function(e){this._extendEventWithInstance(e);delete e.instance;this._handleHover(e)},onBeforeRendering:function(e){if(this._onhoverProxy){this._viewport.$().off("wheel",this._onhoverProxy);this._viewport.$().off(sap.ui.Device.browser.msie||sap.ui.Device.browser.edge?"pointermove":"mousemove",this._onhoverProxy)}if(this._onpointerdownProxy){this._viewport.$().off("pointerdown",this._onpointerdownProxy)}if(this._onpointerupProxy){this._viewport.$().off("pointerup",this._onpointerupProxy)}},onAfterRendering:function(e){if(!this._onhoverProxy){this._onhoverProxy=D.onhover.bind(this)}this._viewport.$().on("wheel",this._onhoverProxy);this._viewport.$().on(sap.ui.Device.browser.msie||sap.ui.Device.browser.edge?"pointermove":"mousemove",this._onhoverProxy);if(sap.ui.Device.browser.msie||sap.ui.Device.browser.edge){if(!this._onpointerdownProxy){this._onpointerdownProxy=D.onmousedown.bind(this)}this._viewport.$().on("pointerdown",this._onpointerdownProxy);if(!this._onpointerupProxy){this._onpointerupProxy=D.onmouseup.bind(this)}this._viewport.$().on("pointerup",this._onpointerupProxy)}if(this._detail.anchor){this._viewport.getDomRef().appendChild(this._detail.anchor)}this._openDetailPending()}};D[sap.ui.Device.browser.msie||sap.ui.Device.browser.edge?"onclick":"ontap"]=function(e){y.trace("onclick","",A);this._extendEventWithInstance(e);if(this._skipClick){this._skipClick=false;this._handleHover(e)}else if(this._clickTimerId){clearTimeout(this._clickTimerId);this._clickTimerId=null;this._handleDoubleClick(e)}else{this._clickTimerId=setTimeout(function(){this._clickTimerId=null;this._handleClick(e)}.bind(this),200)}};var S=sap.ui.Device.os.macintosh?"metaKey":"ctrlKey";B.prototype._extendEventWithSelection=function(e){var t=e.instance;if(t){if(e.originalEvent.type==="click"){if(!(e[S]&&e.shiftKey)){var i;var o;if(e[S]){i="toggle";o=false}else if(e.shiftKey){i="select";o=false}else{i="select";o=true}e.selectionChanges=this._changeSelection(t,i,o)}}else{e.selectionChanges=this._changeSelection(t,"toggle",false)}}};B.prototype._changeSelection=function(e,t,i){var o=[];var n=[];var r=e.voGroup;var s=C(e["VB:s"]);var a;if(t==="select"){if(r.maxSel!=="0"){if(s){if(i){a=r.selected.indexOf(e);n=r.selected.splice(a+1).concat(r.selected.splice(0,a))}}else{if(i||r.maxSel==="1"){n=r.selected.splice(0)}r.selected.push(e);o=[e]}}}else if(t==="toggle"){if(s){if(r.minSel==="0"||r.selected.length>1){a=r.selected.indexOf(e);n=r.selected.splice(a,1)}}else if(r.maxSel!=="0"){if(r.maxSel==="1"){n=r.selected.splice(0)}r.selected.push(e);o=[e]}}o.forEach(function(e){e["VB:s"]="true"});n.forEach(function(e){e["VB:s"]="false"});return{selected:o,deselected:n}};return B});