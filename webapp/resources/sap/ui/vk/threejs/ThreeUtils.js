/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["../thirdparty/three","sap/base/Log","../ObjectType"],function(e,i,a){"use strict";var t={};t._disposeMaterial=function(e){if(e.map){e.map.dispose()}if(e.lightMap){e.lightMap.dispose()}if(e.bumpMap){e.bumpMap.dispose()}if(e.normalMap){e.normalMap.dispose()}if(e.specularMap){e.specularMap.dispose()}if(e.envMap){e.envMap.dispose()}if(e.alphaMap){e.alphaMap.dispose()}if(e.emissiveMap){e.emissiveMap.dispose()}if(e.aoMap){e.aoMap.dispose()}e.dispose()};t.disposeMaterial=function(i){if(i){if(i instanceof e.MeshFaceMaterial){i.materials.forEach(function(e){t._disposeMaterial(e)})}else{t._disposeMaterial(i)}}};t.disposeObject=function(i){if(i instanceof e.Mesh||i instanceof e.Line||i instanceof e.Box3Helper){if(i.geometry){i.geometry.dispose()}if(i.material){t._disposeMaterial(i.material)}}};t.disposeGeometry=function(i){if(i instanceof e.Mesh||i instanceof e.Line||i instanceof e.Box3Helper){if(i.geometry){i.geometry.dispose()}}};t.getAllTHREENodes=function(a,r,o){if(!a){return}if(!r||!o){i.error("getAllTHREENodes input parameters - all3DNodes and/or allGroupNodes are undefined.");return}a.forEach(function(i){if(i instanceof e.Mesh){r.push(i)}else if(i instanceof e.Light){r.push(i)}else if(i instanceof e.Camera){r.push(i)}else if(i instanceof e.Box3Helper){r.push(i)}else if(i instanceof e.Group){o.push(i)}if(i.children&&i.children.length>0){t.getAllTHREENodes(i.children,r,o)}})};var r=new e.Vector3;var o=function(e,i){i.makeEmpty();e.updateMatrixWorld(true);e.traverse(function(e){if(e.userData.objectType===a.Hotspot||e.userData.objectType===a.PMI){return}var t;var o;var s=e.geometry;if(s!=null){if(s.isGeometry){var n=s.vertices;for(t=0,o=n.length;t<o;t++){r.copy(n[t]);r.applyMatrix4(e.matrixWorld);i.expandByPoint(r)}}else if(s.isBufferGeometry){var p=s.attributes.position;if(p!=null){for(t=0,o=p.count;t<o;t++){r.fromBufferAttribute(p,t).applyMatrix4(e.matrixWorld);i.expandByPoint(r)}}}}});return i};t.computeObjectOrientedBoundingBox=function(e,i){var a=e.parent;var t=e.matrix.clone();var r=e.matrixAutoUpdate;e.parent=null;e.matrix.identity();e.matrixAutoUpdate=false;o(e,i);e.matrixAutoUpdate=r;e.matrix.copy(t);e.parent=a;e.updateMatrixWorld(true);return i};return t});