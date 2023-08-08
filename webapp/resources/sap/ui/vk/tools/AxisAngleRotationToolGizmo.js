/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/base/Log","../thirdparty/three","./Gizmo","./AxisAngleRotationToolGizmoRenderer","./AxisColours","../AnimationTrackType","sap/base/assert"],function(e,t,i,a,o,r,n){"use strict";var s=i.extend("sap.ui.vk.tools.AxisAngleRotationToolGizmo",{metadata:{library:"sap.ui.vk"}});var l=[16711808,o.y,o.z];var h=Math.PI*2,u=Math.PI/2,d=13;var p=THREE.Math.degToRad,c=THREE.Math.radToDeg;s.prototype.init=function(){if(i.prototype.init){i.prototype.init.apply(this)}this._createEditingForm(String.fromCharCode(176),84);this._gizmoIndex=-1;this._handleIndex=-1;this._value=new THREE.Vector3;this._rotationDelta=new THREE.Vector3;this._viewport=null;this._tool=null;this._sceneGizmo=new THREE.Scene;var e=new THREE.DirectionalLight(16777215,.5);e.position.set(1,3,2);this._sceneGizmo.add(e);this._sceneGizmo.add(new THREE.AmbientLight(16777215,.5));this._gizmo=new THREE.Group;this._sceneGizmo.add(this._gizmo);this._touchAreas=new THREE.Group;this._nodes=[];this._matViewProj=new THREE.Matrix4;this._gizmoSize=96;function t(e,t,i){var a=new THREE.TorusBufferGeometry(t,16/96,4,i,e===2?Math.PI:h);if(e===0){a.rotateY(u)}else if(e===1){a.rotateX(u)}else{a.rotateZ(-u)}return new THREE.Mesh(a,new THREE.MeshBasicMaterial({opacity:.2,transparent:true}))}var a;for(a=0;a<3;a++){this._touchAreas.add(t(a,1,24))}for(a=0;a<3;a++){var o=new THREE.Mesh(new THREE.IcosahedronBufferGeometry(.25,0),new THREE.MeshBasicMaterial({opacity:.2,transparent:true}));o.position.setComponent(a,1.6);this._touchAreas.add(o)}};s.prototype._createGizmoObject=function(){var e=new THREE.Group;var t=e.userData;function i(e,t,i,a){var o=new THREE.TorusBufferGeometry(i,1/96,4,a,e===2?Math.PI:h);if(e===0){o.rotateY(u)}else if(e===1){o.rotateX(u)}else{o.rotateZ(-u)}var r=new THREE.Mesh(o,new THREE.MeshBasicMaterial({color:t,transparent:true}));r.matrixAutoUpdate=false;r.userData.color=t;return r}function a(e,t){var i=96*3,a=2,o=12*3,r=2*3;e.multiplyScalar(1/i);var n=new THREE.MeshLambertMaterial({color:t});var s=new THREE.CylinderBufferGeometry(a,a,i-o,4);var l=(new THREE.Matrix4).makeBasis(new THREE.Vector3(e.y,e.z,e.x),e,new THREE.Vector3(e.z,e.x,e.y));l.setPosition(e.clone().multiplyScalar((i-o)*.5));s.applyMatrix4(l);var h=new THREE.Mesh(s,n);h.matrixAutoUpdate=false;h.userData.color=t;var u=new THREE.CylinderBufferGeometry(0,r,o,12,1);l.setPosition(e.clone().multiplyScalar(i-o*.5));u.applyMatrix4(l);var d=new THREE.Mesh(u,n);d.matrixAutoUpdate=false;h.add(d);return h}var o;for(o=0;o<3;o++){e.add(i(o,l[o],1,128))}t.axisArrow=a(new THREE.Vector3(3,0,0),l[0]);e.add(t.axisArrow);var r=new THREE.BufferGeometry;r.setAttribute("position",new THREE.Float32BufferAttribute(new Float32Array([0,0,0,3,0,0]),3));t.arrowProjection=new THREE.Line(r,new THREE.LineDashedMaterial({color:l[0],transparent:true,scale:10,dashSize:1,gapSize:1}));t.arrowProjection.computeLineDistances();e.add(t.arrowProjection);e.add(new THREE.AxesHelper(1.5));t.arcMeshes=[];for(o=0;o<3;o++){var n=new THREE.Mesh(new THREE.Geometry,new THREE.MeshBasicMaterial({vertexColors:THREE.VertexColors,opacity:.5,transparent:true,side:THREE.DoubleSide,depthWrite:false}));n.visible=false;t.arcMeshes.push(n);e.add(n)}t.valueLabels=[];for(o=0;o<3;o++){var s=this._createTextMesh("",64,32,d,16777215,false);s.renderOrder=10;s.material.depthTest=false;s.visible=false;t.valueLabels.push(s);e.add(s)}var p=t.axisTitles=this._createAxisTitles();p.scale.setScalar(1/this._gizmoSize);var c=this._gizmoSize*1.6;p.children[0].position.x=c;p.children[1].position.y=c;p.children[2].position.z=c;e.add(p);return e};s.prototype.hasDomElement=function(){return true};s.prototype.resetValues=function(){this._value.setScalar(0)};s.prototype.show=function(e,t){this._viewport=e;this._tool=t;this.handleSelectionChanged();this._tool.fireEvent("rotating",{x:0,y:0,z:0,nodesProperties:this._getNodesProperties()},true)};s.prototype.hide=function(){this._cleanTempData();this._viewport=null;this._tool=null;this._gizmoIndex=this._handleIndex=-1;this._updateEditingForm(false)};s.prototype.getGizmoCount=function(){return this._nodes.length};s.prototype.getTouchObject=function(e){if(this._nodes.length===0){return null}var t=this._gizmo.children[e];m(this._touchAreas.children[2],t.children[2]);m(this._touchAreas.children[0],t.children[0]);this._updateGizmoObjectTransformation(this._touchAreas,e);return this._touchAreas};s.prototype.highlightHandle=function(e,t,i){for(var a=0,o=this._gizmo.children.length;a<o;a++){var r=this._gizmo.children[a];var n=r.userData;for(var s=0;s<3;s++){var l=r.children[s];var h=s===e&&a===t?16776960:l.userData.color;l.material.color.setHex(h);l.material.opacity=e===-1||s===e?1:.35;l.material.visible=i||s===e;var u=n.axisTitles.children[s];u.material.color.setHex(a===t&&s===e-3?16776960:l.userData.color);u.material.opacity=i?1:.35;n.arcMeshes[s].material.visible=i||s===e||s===2&&e===1}}};s.prototype._snapToAxis=function(e){var t=-this._value.y,i=-this._value.z;switch(e){case 0:t+=90;break;case 1:i+=90;break;default:break}this.beginGesture();this._rotate(new THREE.Euler(0,p(t),p(i)));this.endGesture()};s.prototype.selectHandle=function(e,t){this._gizmoIndex=t;this._handleIndex=e;if(e>=3&&e<6){this._snapToAxis(e-3)}this._updateEditValue();this._viewport.setShouldRenderFrame()};function m(e,t){e.quaternion.copy(t.quaternion);e.position.copy(t.position);e.updateMatrix();e.updateMatrixWorld(true)}function f(e){return c(Math.atan2(e[0],e[2]))}function v(e){return c(Math.atan2(e[1],Math.sqrt(e[0]*e[0]+e[2]*e[2])))}function _(e,t){e=p(e);t=p(t);var i=Math.sin(e),a=Math.cos(e);var o=Math.sin(t),r=Math.cos(t);return[i*r,o,a*r]}function g(e,t,i,a){if(e.userData.angle1===i&&e.userData.angle2===a){return}e.userData.angle1=i;e.userData.angle2=a;var o=(new THREE.Color).setHex(l[t]);var r=[0,0,0];var n=[o.r,o.g,o.b];var s=new THREE.Vector3;var u=(t+1)%3,d=(t+2)%3;var p=a-i;var c,m=Math.min(Math.max(Math.ceil(Math.abs(p)*64/Math.PI),1),1e4);var f=Math.min(h/Math.abs(p),1);var v=THREE.Math.lerp;for(c=0;c<=m;c++){var _=1-c/m;var g=i+p*_;var E=v(f,1,_);s.set(0,0,0).setComponent(u,Math.cos(g)*E).setComponent(d,Math.sin(g)*E);r.push(s.x,s.y,s.z);var x=v(1,.5,_);n.push(o.r*x,o.g*x,o.b*x)}var y=[];for(c=0;c<m;c++){y.push(0,c+1,c+2)}var z=new THREE.BufferGeometry;z.setIndex(y);z.setAttribute("position",new THREE.Float32BufferAttribute(r,3));e.geometry=z;e.geometry.setAttribute("color",new THREE.Float32BufferAttribute(n,3));e.visible=p!==0}s.prototype._updateGizmoObject=function(e,t,i,a){var o=this._gizmo.children[e];var r=new THREE.Euler(0,p(i-90),0,"YZX");var n=o.children[2];n.quaternion.setFromEuler(r);n.updateMatrix();r.z=p(a);var s=o.children[0];s.quaternion.setFromEuler(r);s.updateMatrix();s.position.setFromMatrixColumn(s.matrix,0).multiplyScalar(2);s.updateMatrix();var l=o.userData;var h=l.axisArrow;h.quaternion.copy(s.quaternion);h.updateMatrix();var u=l.arrowProjection;var d=Math.cos(r.z);u.quaternion.copy(n.quaternion);u.scale.setScalar(d);u.updateMatrix();u.material.scale=d*10;var c=l.arcMeshes;g(c[0],0,0,p(t));m(c[0],o.children[0]);g(c[1],1,0,p(i));m(c[1],o.children[1]);g(c[2],2,0,p(a));m(c[2],o.children[2]);var f=l.valueLabels;x(f[0],t);x(f[1],i);x(f[2],a)};s.prototype.beginGesture=function(){this._rotationDelta.setScalar(0);this._nodes.forEach(function(e){e.beginAngle=e.angle;e.beginAzimuth=e.azimuth;e.beginElevation=e.elevation})};s.prototype._getNodesProperties=function(){return this.getValues()};s.prototype.endGesture=function(){this._nodes.forEach(function(e){delete e.beginAngle;delete e.beginAzimuth;delete e.beginElevation});var e=this._getNodesProperties();this._tool.fireRotated({x:this._rotationDelta.x,y:this._rotationDelta.y,z:this._rotationDelta.z,nodesProperties:e})};function E(e,t){var i=window.devicePixelRatio;var a=e.width;var o=e.height;var r=a*.5;var n=o*.5;var s=Math.min(d*.85*i,r-1);var l=e.getContext("2d");l.font="Bold "+d*i+"px Arial";var h=l.measureText(t);var p=Math.min(h.width*.5-s*.5,r-s-1);l.clearRect(0,0,a,o);l.beginPath();l.arc(r-p,n,s,u,u*3,false);l.lineTo(r+p,n-s);l.arc(r+p,n,s,-u,u,false);l.lineTo(r-p,n+s);l.closePath();l.globalAlpha=.75;l.fillStyle="#fff";l.fill();l.globalAlpha=1;l.lineWidth=i;l.strokeStyle="#000";l.stroke();l.fillStyle="#000";l.textAlign="center";if(sap.ui.Device.browser.chrome||sap.ui.Device.browser.firefox){l.textBaseline="top";l.fillText(t,r,n-h.actualBoundingBoxDescent*.5)}else{l.textBaseline="middle";l.fillText(t,r,n)}}function x(e,t){e.visible=t!==0;if(e.visible&&e.userData.value!==t){e.userData.value=t;var i=t.toLocaleString("fullwide",{useGrouping:false,minimumFractionDigits:1,maximumFractionDigits:1})+"°";var a=e.material.map;E(a.image,i);a.needsUpdate=true}}s.prototype._updateEditValue=function(){var e=this._nodes[this._gizmoIndex];if(e){this._value.set(e.angle,e.azimuth,e.elevation)}};var y=new THREE.Vector3;var z=new THREE.Quaternion;s.prototype._updateNodeRotation=function(e){y.fromArray(_(e.azimuth,e.elevation));z.setFromAxisAngle(y,p(e.angle));e.node.quaternion.multiplyQuaternions(z,e.quaternion);e.node.updateMatrix();if(e.node.userData){delete e.node.userData.skipUpdateJointNode}this._viewport._viewStateManager._setJointNodeOffsets(e.node,r.Rotate)};s.prototype._rotate=function(e){this._rotationDelta.set(c(e.x),c(e.y),c(e.z));this._nodes.forEach(function(e){e.angle=e.beginAngle+this._rotationDelta.x;e.azimuth=(e.beginAzimuth+this._rotationDelta.y)%360;e.elevation=THREE.Math.clamp(e.beginElevation+this._rotationDelta.z,-90,90);if(e.azimuth>180){e.azimuth-=360}if(e.azimuth<-180){e.azimuth+=360}this._updateNodeRotation(e)},this);this._updateEditValue();this._viewport.setShouldRenderFrame()};s.prototype._setRotationAxisAngle=function(e,t,i){var a=i-t;if(e!==0){a%=h}var o=new THREE.Euler;o[["x","y","z"][e]]=a;var r=this._getNodesProperties();if(this._tool.fireEvent("rotating",{x:c(o.x),y:c(o.y),z:c(o.z),nodesProperties:r},true)){this._rotate(o)}};s.prototype.rotate=function(e,t,i){this.beginGesture();this._rotate(new THREE.Euler(p(e||0),p(t||0),p(i||0)))};s.prototype._getValueLocaleOptions=function(){return{useGrouping:false,minimumFractionDigits:1,maximumFractionDigits:2}};s.prototype.getValue=function(){return this._gizmoIndex>=0&&this._handleIndex>=0&&this._handleIndex<3?this._value.getComponent(this._handleIndex):0};s.prototype.setValue=function(e){if(this._gizmoIndex>=0&&this._handleIndex>=0&&this._handleIndex<3){var t=new THREE.Euler;t[["x","y","z"][this._handleIndex]]=p(e-this._value.getComponent(this._handleIndex));this.beginGesture();this._rotate(t);this.endGesture()}};s.prototype.rotateBy=function(e){this.beginGesture();this._rotate(new THREE.Euler(p(e),0,0));this.endGesture()};s.prototype.setAxis=function(e){this.beginGesture();var t=0;var i=0;if(Array.isArray(e)){t=f(e);i=v(e)}else{if("azimuth"in e){t=e.azimuth}if("elevation"in e){i=e.elevation}}this._nodes.forEach(function(e){e.azimuth=t;e.elevation=i;this._updateNodeRotation(e)},this);this._updateEditValue();this._viewport.setShouldRenderFrame();this.endGesture()};s.prototype.getValues=function(){var e=[];this._nodes.forEach(function(t){e.push({node:t.node,angle:t.angle,azimuth:t.azimuth,elevation:t.elevation,axis:_(t.azimuth,t.elevation)})});return e};s.prototype._getNodeInfoByNode=function(e){var t=this._nodes;for(var i=0,a=t.length;i<a;i++){if(t[i].node===e){return t[i]}}return null};s.prototype.setValues=function(e){e.forEach(function(e){var t=this._getNodeInfoByNode(e.node);if(t){t.angle=e.angle;if(e.axis){t.azimuth=f(e.axis);t.elevation=v(e.axis)}else{t.azimuth=e.azimuth;t.elevation=e.elevation}t.quaternion=t.node.quaternion.clone();y.fromArray(_(t.azimuth,t.elevation));z.setFromAxisAngle(y,-p(t.angle));t.quaternion.premultiply(z);this._updateNodeRotation(t)}},this);this._updateEditValue();this._viewport.setShouldRenderFrame()};s.prototype.expandBoundingBox=function(e){if(this._viewport){this._expandBoundingBox(e,this._viewport.getCamera().getCameraRef(),true)}};s.prototype._updateSelection=function(e){i.prototype._updateSelection.call(this,e);if(this._tool.getEnableSnapping()){this._tool.getDetector().setSource(e)}};s.prototype.handleSelectionChanged=function(e){this._nodes.length=0;this._gizmoIndex=this._handleIndex=-1;if(this._viewport){this._updateSelection(this._viewport._viewStateManager);this._tool.fireEvent("rotating",{x:0,y:0,z:0,nodesProperties:this._getNodesProperties()},true);this._nodes.forEach(function(e){e.quaternion=e.node.quaternion.clone();e.angle=0;e.azimuth=0;e.elevation=0});var t=this._nodes.length;var i=this._gizmo;while(i.children.length>t){i.remove(i.children[i.children.length-1])}while(i.children.length<t){i.add(this._createGizmoObject())}}};s.prototype._getObjectSize=function(e){var t=new THREE.Box3;this._nodes[e].node._expandBoundingBox(t,true,false);if(t.isEmpty()){return 0}var i=new THREE.Vector3;t.getSize(i);return i.length()};s.prototype._updateGizmoObjectTransformation=function(e,t){var i=this._nodes[t].node;var a=this._getEffectiveParent(i);e.position.setFromMatrixPosition(i.matrixWorld);if(a){e.quaternion.setFromRotationMatrix(a.matrixWorld)}else{e.quaternion.set(0,0,0,1)}var o=this._getGizmoScale(e.position);e.scale.setScalar(this._gizmoSize*o);e.updateMatrix();e.updateMatrixWorld(true);return o};s.prototype._getValuePosition=function(e,t,i,a){i=p(i);a=p(a);var o=new THREE.Euler(0,0,0,"YZX");if(t===0){o.set(0,i,a)}else if(t===1){o.set(0,i*.5,0)}else{o.set(0,i,a*.5)}o.y-=u;e.set(t===0?3.25:1.25,0,0).applyEuler(o)};var w=new THREE.Vector3;s.prototype._updateGizmoTransformation=function(e,t){var i=this._gizmo.children[e];var a=this._nodes[e];var o=this._updateGizmoObjectTransformation(i,e);i.userData.axisTitles.children.forEach(function(e){e.quaternion.copy(i.quaternion).inverse().multiply(t.quaternion)});for(var r=0;r<3;r++){var n=i.userData.valueLabels[r];this._getValuePosition(n.position,r,a.azimuth,a.elevation);n.quaternion.copy(i.quaternion).inverse().multiply(t.quaternion);w.copy(n.position).applyMatrix4(i.matrixWorld);n.scale.setScalar(this._getGizmoScale(w)/(o*this._gizmoSize))}};s.prototype._getEditingFormPosition=function(){var e=this._gizmo.children[this._gizmoIndex];var t=this._nodes[this._gizmoIndex];this._updateGizmoObjectTransformation(e,this._gizmoIndex);this._getValuePosition(w,this._handleIndex,t.azimuth,t.elevation);return w.applyMatrix4(e.matrixWorld).applyMatrix4(this._matViewProj)};s.prototype.render=function(){n(this._viewport&&this._viewport.getMetadata().getName()==="sap.ui.vk.threejs.Viewport","Can't render gizmo without sap.ui.vk.threejs.Viewport");if(this._nodes.length>0){var e=this._viewport.getRenderer(),t=this._viewport.getCamera().getCameraRef();this._matViewProj.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse);e.clearDepth();for(var i=0,a=this.getGizmoCount();i<a;i++){var o=this._nodes[i];this._updateGizmoObject(i,o.angle,o.azimuth,o.elevation);this._updateGizmoTransformation(i,t)}e.render(this._sceneGizmo,t);this._updateEditValue()}this._updateEditingForm(this._nodes.length>0&&this._gizmoIndex>=0&&this._handleIndex>=0&&this._handleIndex<3,this._handleIndex,["δ","γ","α"][this._handleIndex])};s.prototype._getOffsetForRestTransformation=function(e){};return s});