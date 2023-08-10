/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["../thirdparty/three"],function(t){"use strict";function e(){THREE.InstancedBufferGeometry.call(this);this.type="PolylineGeometry";var t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0];var e=[2,-1,2,1,1,-1,1,1,-1,-1,-1,1,-2,-1,-2,1];var n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n);this.setAttribute("position",new THREE.Float32BufferAttribute(t,3));this.setAttribute("uv",new THREE.Float32BufferAttribute(e,2))}e.prototype=Object.assign(Object.create(THREE.InstancedBufferGeometry.prototype),{constructor:e,isPolylineGeometry:true,setVertices:function(t){this.vertices=t;var e=t.length-1;var n=new Float32Array(6*e);for(var r=0,i=0;r<e;r++){var s=t[r],o=t[r+1];n[i++]=s.x;n[i++]=s.y;n[i++]=s.z;n[i++]=o.x;n[i++]=o.y;n[i++]=o.z}var u=new THREE.InstancedInterleavedBuffer(n,6,1);this.setAttribute("instanceStart",new THREE.InterleavedBufferAttribute(u,3,0));this.setAttribute("instanceEnd",new THREE.InterleavedBufferAttribute(u,3,3));var a=new THREE.InstancedInterleavedBuffer(new Float32Array(2*e),2,1);this.setAttribute("instanceDistance",new THREE.InterleavedBufferAttribute(a,2,0));this.computeBoundingBox();this.computeBoundingSphere();return this},computeBoundingBox:function(){if(this.boundingBox===null){this.boundingBox=new THREE.Box3}this.boundingBox.setFromPoints(this.vertices)},computeBoundingSphere:function(){if(this.boundingSphere===null){this.boundingSphere=new THREE.Sphere}this.boundingSphere.setFromPoints(this.vertices)},_updateVertices:function(t){var e=this.vertices;var n=this.attributes.instanceStart.data;var r=n.array;t.forEach(function(t){var n=e[t];var i=t*6-3;if(i>=0){r[i+0]=n.x;r[i+1]=n.y;r[i+2]=n.z}if(i+5<r.length){r[i+3]=n.x;r[i+4]=n.y;r[i+5]=n.z}});n.needsUpdate=true;this.computeBoundingBox();this.computeBoundingSphere()}});return e});