/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
sap.ui.define(["./sapvbi"],function(){"use strict";VBI.Parser=function(){var e={};e.formulas=[];e.fPos=0;e.fCode="";e.fAttributes=[];e.clear=function(){var r;while((r=e.formulas.shift())!=undefined){e.clearExpression(r.dTree)}};e.evaluate=function(r,t,a){e.vo=r;e.voi=t;e.ctx=a;e.pos=undefined;var n=e.formulas.length;for(var o=0;o<n;++o){var s=e.formulas[o];if(e.evalF(s.dTree)){return s.index}}return-1};e.evalF=function(r){if(r.operator==false||r.operator==true){return r.operator}var t;if(r.operator==600){t=e.evalF(r.operand1);return t?e.evalF(r.operand2):false}if(r.operator==700){t=e.evalF(r.operand1);return t?true:e.evalF(r.operand2)}var a;var n=e.vo;switch(r.operand1){case"text":a=n.m_Text.GetValueString(e.ctx);break;case"itext":a=parseInt(n.m_Text.GetValueString(e.ctx),10);break;case"id":a=n.m_ID;break;case"image":a=n.m_Image.GetValueString(e.ctx);break;case"x":if(!e.pos){e.pos=e.vo.m_Pos.GetValueVector(e.ctx)}a=e.pos[0];break;case"y":if(!e.pos){e.pos=e.vo.m_Pos.GetValueVector(e.ctx)}a=e.pos[1];break;case"tooltip":a=n.m_Tooltip.GetValueString(e.ctx);break;default:var o=e.fAttributes[e.voi];a="";for(var s=0;s<o.length;++s){if(o[s].name==r.operand1){var u=n.m_DataSource.m_CurElement.m_dataattributes[o[s].index];if(u!=undefined){a=u.m_Value}}}}switch(r.operator){case 50:return a==r.operand2;case 51:return a>=r.operand2;case 52:return a>r.operand2;case 55:return a!=r.operand2;case 56:return a<=r.operand2;case 57:return a<r.operand2;default:break}};e.verifyAttribute=function(r,t,a){if(jQuery.type(r.operand2)=="object"){e.verifyAttribute(r.operand2,t,a)}if(jQuery.type(r.operand1)=="object"){e.verifyAttribute(r.operand1,t,a)}else{var n=r.operand1;if(n!="id"&&n!="image"&&n!="x"&&n!="y"&&n!="tooltip"){if(!e.fAttributes){e.buildAttributeTable(t)}for(var o=0;o<a.m_datatypenodes.length;++o){var s=a.m_datatypenodes[o];var u=s.m_Name;var f=s.m_datatypeattributes;for(var i=0;i<f.length;++i){var d=f[i];if(d.m_Name==n){for(var p=0;p<e.fAttributes.length;++p){var c=e.fAttributes[p];if(c.m_Name==u){var l=false;for(var v=0;v<c.length;++v){if(c[v].name==n){l=true}}if(!l){c.push({name:n,index:i})}}}}}}}}};e.buildAttributeTable=function(r){e.fAttributes=[];for(var t=0;t<r.length;++t){var a=[];var n=r[t].m_DataSource;if(n!=undefined){a.m_Name=n.m_NPath[0];e.fAttributes.push(a)}}};e.verifyAttributes=function(r,t){e.fAttributes=undefined;var a=t.m_DataTypeProvider;for(var n=0;n<e.formulas.length;++n){e.verifyAttribute(e.formulas[n].dTree,r,a)}};e.clearExpression=function(r){if(jQuery.type(r)!="object"){return}e.clearExpression(r.operand1);e.clearExpression(r.operand2);r.operand1=r.operand2=undefined};e.addFormula=function(r,t){e.formulas.push({index:r,formula:t,dTree:e.buildDecisionTree(t)});return e.formulas.length-1};e.buildDecisionTree=function(r){e.fPos=0;e.fCode=r;var t={};if(!e.parseExpression(t)){VBI.Trace("Error: "+r+" could not be interpreted");t.operator=false}return t};e.parseExpression=function(r){var t=e.scan();if(t==-1){r.operator=true;return r.operator}if(t==10){r.operand1={};if(!e.parseExpression(r.operand1)){return false}if(e.scan()!=20){return false}r.operator=e.scan();if(e.ttype!=2){return false}if(e.scan()!=10){return false}r.operand2={};if(!e.parseExpression(r.operand2)){return false}if(e.scan()!=20){return false}return true}if(t==500){r.operand1=e.token;r.operator=e.scan();if(e.ttype!=1){return false}e.scan();if(e.ttype!=10){return false}r.operand2=e.token;return true}return false};e.scan=function(){var r;var t=0;if(e.fPos>=e.fCode.length){return-1}var a=e.fCode.substr(e.fPos,1);switch(true){case a=="(":return e.getToken(a,10,0);case a==")":return e.getToken(a,20,0);case a=="=":return e.getToken(a,50,1);case a=="!":return e.fCode.substr(e.fPos+1,1)=="="?e.getToken("!=",55,1):false;case a=="<":case a==">":t=5*(a=="<");r=e.fCode.substr(e.fPos+1,1);if(r=="="){return e.getToken(a+r,51+t,1)}if(a=="<"&&r==">"){return e.getToken("!=",55,1)}return e.getToken(a,52+t,1);case a=="|":case a=="&":t=100*(a=="|");r=e.fCode.substr(e.fPos+1,1);if(a!=r){r=""}return e.getToken(a+r,600+t,2);case a>="0"&&a<="9":return e.readNumber(a);case a>="a"&&a<="z"||a>="A"&&a<="Z":return e.readString(a);default:return-2}};e.readNumber=function(r){var t=r;var a=1;var n=e.fCode.substr(e.fPos+a,1);while(n>="0"&&n<="9"){t+=n;a++;n=e.fCode.substr(e.fPos+a,1)}return e.getToken(t,600,10)};e.readString=function(r){var t=r;var a=1;var n=e.fCode.substr(e.fPos+a,1);while(n>="a"&&n<="z"||n>="A"&&n<="Z"||n>="0"&&n<="9"||n=="_"||n=="."||n=="/"||n=="\\"){t+=n;a++;n=e.fCode.substr(e.fPos+a,1)}return e.getToken(t,500,10)};e.getToken=function(r,t,a){e.fPos+=r.length;e.token=r;e.ttype=a;return t};return e}});