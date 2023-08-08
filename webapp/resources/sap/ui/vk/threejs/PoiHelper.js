/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["../NodeContentType","../TransformationMatrix","sap/base/util/uid"],function(e,t,r){"use strict";var n=function(){this._currentSceneId=null};n.prototype.createPOI=function(n,a,o,i,s,c){o=o._implementation||o;s=s||{x:1,y:1};c=c||{};c.sid=c.sid||r();if(!c.transform){var d=o.getDomRef().getBoundingClientRect();var u=i.x-d.left;var m=i.y-d.top;var f=o.hitTest(u,m,{ignoreOverlay:true});if(!f){return Promise.reject()}var v=(new THREE.Matrix4).compose(f.point,o._getNativeCamera().quaternion,new THREE.Vector3(Number(s.x),Number(s.y),1));c.transform=t.convertTo4x3(v.elements);var l={picked:f.object?[f.object]:[]};o.fireNodesPicked(l);if(l.picked&&l.picked.length>0){var p=l.picked[0];if(p&&p.userData){c.referenceNode=l.picked[0].userData.nodeId}}else{c.referenceNode=f.object.userData.nodeId}}else if(c.transform.length===16){c.transform=t.convertTo4x3(c.transform)}c.transformType=c.transformType||"BILLBOARD_VIEW";if(this._currentSceneId){n.getSceneBuilder()._resetCurrentScene(this._currentSceneId)}var g=o._cdsLoader;if(g){var y=g.getSkipLowLODRendering();g.setSkipLowLODRendering(true);var x=n.getDefaultNodeHierarchy();var E=x.createNode(null,"Sample POI",null,e.Symbol,c);var w=o.getCurrentView()||n.getViews()[0];w.updateNodeInfos([{target:E,visible:true}]);return g.loadTransientScene(a,E).then(function(e){g.setSkipLowLODRendering(y);o.setShouldRenderFrame();var r=e.nodeRef;r.traverse(function(e){e.userData.skipIt=true});this._currentSceneId=r.userData.currentSceneId;Object.assign(r.userData.treeNode,c);var n={transform:t.convertTo4x4(c.transform),veid:c.sid,entityId:r.userData.entityId,name:c.name||"Sample POI",transformType:"view",contentType:"symbol",referenceNode:c.referenceNode};return n}.bind(this))}return Promise.reject()};n.prototype.removePOI=function(e,t){var r=e.getDefaultNodeHierarchy();var n=e.getViewStateManager();n.setVisibilityState(t,false,true);r.removeNode(t)};n.prototype.getPOIList=function(e){var t=e.getViewStateManager();return t?t.getSymbolNodes():[]};var a={spherical:"360Image",planar:"2DImage"};n.prototype.getBackgroundImageType=function(e){return a[e.getBackgroundProjection()]};n.prototype.getPoiRect=function(e,t){var r=e._getNativeCamera();var n=new THREE.Box3;n.setFromObject(t);var a=[new THREE.Vector3(n.min.x,n.min.y,n.min.z),new THREE.Vector3(n.max.x,n.max.y,n.max.z),new THREE.Vector3(n.min.x,n.min.y,n.max.z),new THREE.Vector3(n.min.x,n.max.y,n.max.z),new THREE.Vector3(n.max.x,n.min.y,n.max.z),new THREE.Vector3(n.max.x,n.max.y,n.min.z),new THREE.Vector3(n.min.x,n.max.y,n.min.z),new THREE.Vector3(n.max.x,n.min.y,n.min.z)];var o=new THREE.Frustum;o.setFromProjectionMatrix((new THREE.Matrix4).multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse));if(!o.intersectsBox(n)){return false}var i=new THREE.Vector3(1,1,1);var s=new THREE.Vector3(-1,-1,-1);var c=new THREE.Vector3;for(var d=0;d<a.length;++d){if(!o.containsPoint(a[d])){return false}var u=c.copy(a[d]);var m=u.project(r);i.min(m);s.max(m)}var f=new THREE.Box2(i,s);var v=e.getDomRef().getBoundingClientRect();var l=new THREE.Vector2(v.width/2,v.height/2);var p=f.min.clone().multiply(l);var g=f.max.clone().multiply(l);var y=g.x-p.x;var x=g.y-p.y;return{width:y,height:x}};n.prototype.adjustPoi=function(e,r){if(e.getBackgroundProjection()!=="planar"){var n=r.getWorldPosition(new THREE.Vector3).project(e._getNativeCamera());var a=e.hitTest((n.x*.5+.5)*e._width,(n.y*-.5+.5)*e._height,{ignoreOverlay:true});if(a){r.position.copy(a.point)}r.quaternion.copy(e._getNativeCamera().quaternion);r.updateMatrix();r.updateMatrixWorld();r.userData.direction=(new THREE.Vector3).setFromMatrixColumn(r.matrixWorld,2).normalize()}r.userData.transform=t.convertTo4x3(r.matrixWorld.elements)};n.prototype.updateNodeId=function(e,t,r){var n=e.getViewStateManager();var a=n?n.getSymbolNodes(t)[0]:null;if(a){a.userData.nodeId=r;a.userData.treeNode.sid=r;e.setNodePersistentId(a,r)}return a};n.prototype.updatePOI=function(e,r,n,a,o){var i=e.getScene();var s=e._viewStateManager.getSymbolNodes(r)[0];o=o||{};var c=e._cdsLoader;if(s&&c){s.name=o.name||s.name;if(a){s.baseScale.set(a.x,a.y)}var d=c.getSkipLowLODRendering();c.setSkipLowLODRendering(true);if(o.transform){if(o.transform.length===16){o.transform=t.convertTo4x3(o.transform)}s.position.set(o.transform[9],o.transform[10],o.transform[11])}if(n){var u=e._viewStateManager.getNodeHierarchy();s.children.forEach(function(e){u.removeNode(e)});return c.loadTransientScene(n,s).then(function(t){c.setSkipLowLODRendering(d);var r=t.nodeRef;r.traverse(function(e){e.userData.skipIt=true});i.getSceneBuilder()._resetCurrentScene(r.userData.currentSceneId);r.userData.treeNode.sid=s.userData.treeNode.sid;s.userData._symbolCenterFixed=false;e.setShouldRenderFrame();return{target:r,entityId:r.userData.entityId}})}else{e.setShouldRenderFrame();var m=s.children[0];return Promise.resolve({target:m,entityId:s.userData.treeNode.entityId||m.userData.entityId})}}};return n});