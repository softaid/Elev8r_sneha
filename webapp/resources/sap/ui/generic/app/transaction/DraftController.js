/*
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./BaseController","./DraftContext","sap/base/Log","sap/ui/model/Context","sap/ui/generic/app/util/ActionUtil"],function(t,e,r,n,i,o){"use strict";var a=e.extend("sap.ui.generic.app.transaction.DraftController",{metadata:{publicMethods:["getDraftContext","getDraftForActiveEntity","createNewDraftEntity","createEditDraftEntity","validateDraftEntity","validateDraft","prepareDraft","prepareDraftEntity","saveAndPrepareDraftEntity","activateDraftEntity","isActiveEntity","hasActiveEntity","destroy","discardDraft"]},constructor:function(t,r){e.apply(this,[t,r]);this.sName="sap.ui.generic.app.transaction.DraftController";this._oContext=null}});a.prototype.getDraftContext=function(){if(!this._oContext){this._oContext=new r(this._oModel)}return this._oContext};a.prototype.createDraft=function(t,e,r){var n=this;if(!t){throw new Error("No entity set")}r=r||{};return new Promise(function(t,i){var o=function(e,r){t({responseData:e,httpResponse:r})};var a;var c=function(t){n._oModel.deleteCreatedEntry(a);i(t)};a=n._oModel.createEntry(e,{properties:r.predefinedValues,success:o,error:c,batchGroupId:r.batchGroupId,changeSetId:r.changeSetId,canonicalRequest:!!r.canonicalRequest,expand:r.expand})})};a.prototype.validateDraft=function(t,e){if(!t.getModel().getObject(t.getPath()).IsActiveEntity){var r=this.getDraftContext().getODataDraftFunctionImportName(t,"ValidationFunction");return this._callAction(r,t,e)}else{return Promise.resolve()}};a.prototype.prepareDraft=function(t,e){if(!t.getModel().getObject(t.getPath()).IsActiveEntity){var r;e=e||{};e.urlParameters=e.urlParameters||{};r=this.getDraftContext().getODataDraftFunctionImportName(t,"PreparationAction");return this._callAction(r,t,e)}else{return Promise.resolve()}};a.prototype.activateDraft=function(t,e,r){var n=this.prepareDraft(t,e);var i=this.getDraftContext().getODataDraftFunctionImportName(t,"ActivationAction");var o=this._callAction(i,t,r);return Promise.all([n,o])};a.prototype.editDraft=function(t,e){var r=this.getDraftContext().getODataDraftFunctionImportName(t,"EditAction");if(r){return this._callAction(r,t,e)}throw new Error(t?"No Edit action defined for the given context":"No context provided for the Edit action")};a.prototype.discardDraft=function(e,r){if(!e){throw new Error("No context")}var n={};t.extend(true,n,r);var i=this.getDraftContext().getODataDraftFunctionImportName(e,"DiscardAction");if(i){return this._callAction(i,e,n)}return this._remove(e.getPath(),n)};a.prototype.getDraftForActive=function(t,e){var r=this;if(!t){throw new Error("No context")}e=e||{};e.urlParameters={$expand:"SiblingEntity"};return this._read(t.getPath(),e).then(function(t){if(t.responseData&&t.responseData.hasOwnProperty("SiblingEntity")){t.context=r._oModel.getContext("/"+r._oModel.getKey(t.responseData.SiblingEntity));return t}throw new Error("No draft entity could be found")})};a.prototype.getDraftForActiveEntity=function(t){var e,r,n=this,i={batchGroupId:"Changes",changeSetId:"Changes",noShowSuccessToast:true,forceSubmit:true};e=this.getDraftForActive(t,i).then(function(t){return t},function(t){throw n._normalizeError(t)});r=this.triggerSubmitChanges(i);return this._returnPromiseAll([e,r])};a.prototype.createNewDraftEntity=function(t,e,r,a,c){var s=this;c=c||{};c.fnSetBusy=c.fnSetBusy||Function.prototype;var u="Changes";var f={predefinedValues:r,batchGroupId:u,changeSetId:u,canonicalRequest:a,expand:c.sRootExpand};var h=new i(s._oModel,e);var d=s.getDraftContext().getODataDraftFunctionImportName(h,"NewAction");var l=d&&s._oMeta.getODataFunctionImport(d);var p,v;if(c.bUseNewActionForCreate&&l){v=function(){var e=s._oMeta.getODataEntityType(s._oMeta.getODataEntitySet(t).entityType)["com.sap.vocabularies.UI.v1.LineItem"];var r=e.find(function(t){return t.RecordType==="com.sap.vocabularies.UI.v1.DataFieldForAction"&&t.Action.String===d});var n=r?r.Label.String:"";return n};var g=sap.ui.getCore().getLibraryResourceBundle("sap.ui.generic.app");var y=v()||l["com.sap.vocabularies.Common.v1.Label"]&&l["com.sap.vocabularies.Common.v1.Label"].String||(c.oFunctionImportDialogInfo?c.oFunctionImportDialogInfo.getTitleText():g.getText("DIALOG_TITLE_NEW_ACTION_FOR_CREATE"));var m=c.oFunctionImportDialogInfo?c.oFunctionImportDialogInfo.getActionButtonText():g.getText("DIALOG_ACTION_BUTTON_NEW_ACTION_FOR_CREATE");var D={ResultIsActiveEntity:true};var E=s.getDraftContext().isDraftEnabled(t);var A=new o({controller:c.oController,contexts:[h],applicationController:c.oApplicationController,operationGrouping:undefined});var _={expand:c.sRootExpand};p=A.call(d,y,E,D,true,_,m).then(function(t){c.fnSetBusy(t.executionPromise);return t.executionPromise})}else{p=this.createDraft(t,e,f);c.fnSetBusy(p)}var C=p.then(function(t){var e=Array.isArray(t)?t[0]:t;return s._normalizeResponse(e.response||e,true)},function(t){var e=t?s._normalizeError(t):null;throw e});function x(t){var e,r,i,o=s._normalizeResponse(t,true);if(o.context){i=o.context.getObject()}if(!i){n.error("Activate function returned no entity");return Promise.reject(new Error("Activate function returned no entity"))}e=s._oDraftUtil.isActiveEntity(i);if(e){n.error("New draft entity is not marked as draft - isActiveEntity = "+e);return Promise.reject("New draft entity is not marked as draft - isActiveEntity = "+e)}r=s._oDraftUtil.hasDraftEntity(i);if(r){n.error("Wrong value for HasTwin of new draft entity - HasDraftEntity = "+r);return Promise.reject(new Error("Wrong value for HasTwin of new draft entity - HasDraftEntity = "+r))}return o}var I;if(c.bUseNewActionForCreate&&l){I=C.then(x)}else{var w={batchGroupId:u,changeSetId:u,noShowSuccessToast:true,forceSubmit:true,failedMsg:"New draft document could not be created"};I=this.triggerSubmitChanges(w).then(function(){return C.then(x)})}return this._returnPromiseAll([C,I])};a.prototype.createEditDraftEntity=function(t,e,r){var i,o,a=this,c={batchGroupId:"Changes",changeSetId:"Changes",successMsg:"Draft for document was created",failedMsg:"Could not create draft for document",forceSubmit:true,context:t,expand:r};if(e){c.urlParameters={PreserveChanges:true}}i=this.editDraft(t,c).then(function(t){var e,r,i;i=a._normalizeResponse(t,true);if(i.context){r=i.context.getObject()}if(!r){n.error("Activate function returned no entity");return Promise.reject(new Error("Activate function returned no entity"))}e=a._oDraftUtil.isActiveEntity(r);if(e){n.error("Edit function returned an entity which is not a draft instance - IsActiveEntity = "+e);return Promise.reject(new Error("Returned entity ist not a draft instance - IsActiveEntity = "+e))}return i},function(t){var e=a._normalizeError(t);throw e});o=this.triggerSubmitChanges(c);return this._returnPromiseAll([i,o])};a.prototype.validateDraftEntity=function(t){var e,r,n=this,i={batchGroupId:"Changes",changeSetId:"Changes",context:t,forceSubmit:true};e=this.validateDraft(t,i).then(function(t){return n._normalizeResponse(t,true)},function(t){var e=n._normalizeError(t);throw e});r=this.triggerSubmitChanges(i);return this._returnPromiseAll([e,r])};a.prototype.saveAndPrepareDraftEntity=function(t,e){var r,i,o=this;e=e||{};e.batchGroupId="Changes";e.changeSetId="Changes";e.successMsg="Saved";e.failedMsg="Save failed";e.context=t;e.forceSubmit=true;r=this.prepareDraft(t,e).then(function(t){var e,r,i;i=o._normalizeResponse(t,true);if(i.context){r=i.context.getObject()}if(!r){n.error("Activate function returned no entity");return Promise.reject(new Error("Activate function returned no entity"))}e=o._oDraftUtil.isActiveEntity(r);if(e){n.error("Prepare function returned an entity which is not a draft instance - IsActiveEntity = "+e);return Promise.reject(new Error("Returned entity ist not a draft instance - IsActiveEntity = "+e))}return i},function(t){var e=o._normalizeError(t);throw e});if(e.binding){e.binding.refresh(true,"Changes")}i=this.triggerSubmitChanges(e);return this._returnPromiseAll([r,i])};a.prototype.prepareDraftEntity=function(t){var e=this;return this.prepareDraft(t).then(function(t){var r,i;r=e._normalizeResponse(t,true);i=r.context.getObject();if(e._oDraftUtil.isActiveEntity(i)){n.error("Prepare function returned an entity which is not a draft instance - IsActiveEntity = "+true);return Promise.reject(new Error("Returned entity ist not a draft instance - IsActiveEntity = "+true))}return r},function(t){var r=e._normalizeError(t);throw r})};a.prototype.activateDraftEntity=function(e,r,i){var o,a;var c=this,s={batchGroupId:"Changes",successMsg:"Document activated",failedMsg:"Activation of document failed",forceSubmit:true,context:e};var u=t.extend({},s);s.changeSetId="Preparation";u.changeSetId="Activation";u.expand=i;var f=r?"lenient":"strict";u.headers={Prefer:"handling="+f};var h=this._oModel.getETag(e.getPath());if(h){s.headers={"If-Match":"*"};u.headers["If-Match"]="*"}var d=new Promise(function(t,r){var i=function(){c.detachOnQueueCompleted(i);o=c.activateDraft(e,s,u).then(function(t){var e,r,i;var o=t[1];i=c._normalizeResponse(o,true);if(i.context){r=i.context.getObject()}if(!r){n.error("Activate function returned no entity");return Promise.reject(new Error("Activate function returned no entity"))}e=c._oDraftUtil.isActiveEntity(r);if(!e){n.error("Activate function returned an entity which is still a draft instance - IsActiveEntity = "+e);return Promise.reject(new Error("Returned entity is still a draft instance - IsActiveEntity = "+e))}return i},function(t){var e=c._normalizeError(t);throw e});a=c.triggerSubmitChanges(s);t(c._returnPromiseAll([o,a]))};if(c._oQueue._aQueue.length){c.attachOnQueueCompleted(i)}else{i(this)}});return d};a.prototype.isActiveEntity=function(t){if(this.getDraftContext().hasDraft(t)){return this._oDraftUtil.isActiveEntity(t.getObject())}return true};a.prototype.hasActiveEntity=function(t){return this._oDraftUtil.hasActiveEntity(t.getObject())};a.prototype.destroy=function(){if(this._oContext){this._oContext.destroy()}this._oContext=null;this._oModel=null;e.prototype.destroy.apply(this,[])};return a},true);