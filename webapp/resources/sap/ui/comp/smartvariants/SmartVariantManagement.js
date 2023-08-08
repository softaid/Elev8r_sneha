/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/comp/library","sap/ui/comp/variants/VariantItem","sap/ui/comp/odata/ODataModelUtil","sap/ui/comp/odata/MetadataAnalyser","./SmartVariantManagementAdapter","./SmartVariantManagementBase","sap/base/Log","sap/base/util/merge","sap/ui/base/SyncPromise"],function(t,e,i,a,n,r,o,s,l,h){"use strict";var p;var f;var d;var c=o.extend("sap.ui.comp.smartvariants.SmartVariantManagement",{metadata:{library:"sap.ui.comp",designtime:"sap/ui/comp/designtime/smartvariants/SmartVariantManagement.designtime",interfaces:["sap.ui.core.IShrinkable"],properties:{persistencyKey:{type:"string",group:"Misc",defaultValue:null},entitySet:{type:"string",group:"Misc",defaultValue:null}},aggregations:{personalizableControls:{type:"sap.ui.comp.smartvariants.PersonalizableInfo",multiple:true,singularName:"personalizableControl"}},events:{initialise:{},save:{parameters:{tile:{type:"boolean"},name:{type:"string"}}},afterSave:{}}},renderer:{apiVersion:2}});c.prototype.init=function(){o.prototype.init.apply(this);this._bIsInitialized=false;this._bIsVariantAdaptationEnabled=false;this._oStandardVariant=null;this._fRegisteredApplyAutomaticallyOnStandardVariant=null;this._oControlPromise=null;this._oPersoControl=null;this._sAppStandardVariantKey=null;this._oSelectionVariantHandler={};this._oAppStdContent=null;this._aPersonalizableControls=[];this._oAdapter=null;this._bApplyingUIState=false;this._mVariants={};this._loadFlex()};c.prototype.setEntitySet=function(t){this.setProperty("entitySet",t,true);this.attachModelContextChange(this._initializeMetadata,this);this._createMetadataPromise();this._initializeMetadata();return this};c.prototype._createMetadataPromise=function(){this._oMetadataPromise=new Promise(function(t,e){this._fResolveMetadataPromise=t}.bind(this))};c.prototype._resolveMetadataPromise=function(){if(this._fResolveMetadataPromise){this._fResolveMetadataPromise()}};c.prototype._initializeMetadata=function(){if(!this.bIsInitialised){a.handleModelInit(this,this._onMetadataInitialised)}};c.prototype._onMetadataInitialised=function(){this._bMetaModelLoadAttached=false;if(!this.bIsInitialised){var t=new n(this.getModel());if(t){this._oAdapter=new r({selectionPresentationVariants:t.getSelectionPresentationVariantAnnotationList(this.getEntitySet())});this.detachModelContextChange(this._initializeMetadata,this);this.bIsInitialised=true;this._resolveMetadataPromise()}}};c.prototype.applySettings=function(t){if(!t||!t.hasOwnProperty("useFavorites")){this.setUseFavorites(true)}o.prototype.applySettings.apply(this,arguments)};c.prototype._createControlWrapper=function(e){var i=null;var a=sap.ui.getCore().byId(e.getControl());if(a){i={control:a,type:e.getType(),dataSource:e.getDataSource(),keyName:e.getKeyName(),loaded:t.Deferred()}}return i};c.prototype._getControlWrapper=function(t){var e=this._getAllPersonalizableControls();if(e&&e.length){for(var i=0;i<e.length;i++){if(e[i].control===t){return e[i]}}}return null};c.prototype.addPersonalizableControl=function(t){var e,i=t.getControl();var a=sap.ui.getCore().byId(i);if(!a){s.error("couldn't obtain the control with the id="+i);return this}this.addAggregation("personalizableControls",t,true);e=this._createControlWrapper(t);if(e){this._aPersonalizableControls.push(e)}if(this.isPageVariant()){return this}this.setPersControler(a);return this};c.prototype._loadFlex=function(){var t=function(){return new Promise(function(t){sap.ui.require(["sap/ui/fl/apply/api/SmartVariantManagementApplyAPI","sap/ui/fl/write/api/SmartVariantManagementWriteAPI","sap/ui/fl/apply/api/FlexRuntimeInfoAPI"],function(e,i,a){p=e;f=i;d=a;t()})})};if(!this._oFlLibrary){if(!this._oPersistencyPromise){this._oPersistencyPromise=new Promise(function(t,e){this._fResolvePersistencyPromise=t;this._fRejectPersistencyPromise=e}.bind(this))}this._oFlLibrary=new Promise(function(e){sap.ui.getCore().loadLibrary("sap.ui.fl",{async:true}).then(function(){t().then(e)})})}return this._oFlLibrary};c.prototype.setPersControler=function(t){if(p&&f&&d){this._setPersControler(t)}else{this._loadFlex().then(function(){this._setPersControler(t)}.bind(this))}};c.prototype._setPersControler=function(t){if(!this._oPersoControl){if(this._isFlexSupported(t)){this._oPersoControl=t;this._handleGetChanges(t)}}};c.prototype._isFlexSupported=function(t){return d.isFlexSupported({element:t})};c.prototype.setPersistencyKey=function(t){this.setProperty("persistencyKey",t);this.setPersControler(this);return this};c.prototype.isPageVariant=function(){if(this.getPersistencyKey()){return true}return false};c.prototype._getAdapter=function(){return this._oAdapter};c.prototype._getFilterBarAdapter=function(){return this._oSelectionVariantHandler["#"]};c.prototype._handleGetChanges=function(t){if(t&&p){this._oControlPromise=new Promise(function(t,e){Promise.all([this._oMetadataPromise]).then(function(){if(this._bIsBeingDestroyed){return}var i={control:this._oPersoControl,standardVariant:{id:this.STANDARDVARIANTKEY,name:this._determineStandardVariantName(),executeOnSelection:this.bExecuteOnSelectForStandardViaXML}};if(this._getAdapter()){i.variants=this._getAdapter().getODataVariants()}else if(this._getFilterBarAdapter()){i.variants=this._getFilterBarAdapter().variants}p.loadVariants(i).then(function(e){this._fResolvePersistencyPromise();t(e)}.bind(this),function(t){this._fRejectPersistencyPromise(t);e(t)}.bind(this))}.bind(this))}.bind(this))}};c.prototype._getVariantById=function(t){if(this._mVariants&&this._mVariants[t]){return this._mVariants[t]}return null};c.prototype.getVariantContent=function(t,e){var i,a=this._getVariantContent(e);if(a&&this.isPageVariant()&&t){i=this._getControlPersKey(t);if(i){a=this._retrieveContent(a,i)}}return a};c.prototype._getContent=function(t){return t.getContent()};c.prototype._getVariantContent=function(t){var e=this._getVariantById(t);if(e){var i=this._getContent(e);if(i){if(t===this.STANDARDVARIANTKEY&&Object.keys(i).length<1){i=this.getStandardVariant()}return l({},i)}}return null};c.prototype._getAllPersonalizableControls=function(){return this._aPersonalizableControls};c.prototype.removeAllPersonalizableControls=function(){this.removeAllAggregation("personalizableControls");this._aPersonalizableControls=[]};c.prototype.removePersonalizableControl=function(t){var e=this.removeAggregation("personalizableControls",t);if(e){this._aPersonalizableControls.some(function(t,i){if(t.control.getId()===e.getControl()){this._aPersonalizableControls.splice(i,1);return true}return false}.bind(this))}return e};c.prototype.removePersonalizableControlById=function(t){var e=this.getAggregation("personalizableControls");if(e){e.some(function(e,i){if(e.getControl()===t.getId()){this.removePersonalizableControl(e);return true}return false}.bind(this))}};c.prototype._variantItemChange=function(t){var e,i,a;if(t&&t.oSource&&t.oSource.isA("sap.ui.comp.variants.VariantItem")){a=t.oSource;if(a.getKey()!==this.STANDARDVARIANTKEY){i=t.getParameter("propertyName");if(i==="text"){this.removeVariantItem(a);e=this._getIdxSorted(a.getText());this.insertVariantItem(a,e)}}}};c.prototype._createVariantItem=function(t){var e=0;this._mVariants[t.getVariantId()]=t;var a=new i({key:t.getVariantId(),global:!t.isUserDependent(),lifecycleTransportId:t.getRequest(),lifecyclePackage:t.getPackage(),namespace:t.getNamespace(),readOnly:!t.isEditEnabled(),labelReadOnly:!t.isRenameEnabled(),executeOnSelection:t.getExecuteOnSelection(),text:t.getName(),title:t.getName(),originalTitle:t.getName(),author:t.getOwnerId(),sharing:t.isUserDependent()?"private":"public",remove:t.isDeleteEnabled(),favorite:t.getFavorite(),originalFavorite:t.getFavorite(),executeOnSelect:t.getExecuteOnSelection(),originalExecuteOnSelect:t.getExecuteOnSelection(),rename:t.isRenameEnabled(),contexts:t.getContexts(),originalContexts:t.getContexts(),changeable:t.isEditEnabled(),visible:true});a.attachChange(this._variantItemChange.bind(this));if(t.getVariantId()===this.STANDARDVARIANTKEY){a.setAuthor(this.getStandardItemAuthor())}else{e=this._getIdxSorted(t.getName())}this.insertVariantItem(a,e)};c.prototype._createVariantEntries=function(t){this.removeAllVariantItems();if(t){if(t.standardVariant){this._createVariantItem(t.standardVariant);var e=this._getVariantContent(t.standardVariant.getVariantId());if(Object.keys(e).length>0){this._sAppStandardVariantKey=t.standardVariant.getVariantId();if(this._sAppStandardVariantKey!==this.STANDARDVARIANTKEY){this.setStandardVariantKey(this._sAppStandardVariantKey)}}}if(t.variants){t.variants.forEach(function(t){this._createVariantItem(t)}.bind(this))}this._checkUpdate()}if(this._oPersoControl){if(p&&p.isVariantDownport()){this._enableManualVariantKey(true)}}};c.prototype._addFavorites=function(t){t.forEach(function(t){if(t.key!==this.STANDARDVARIANTKEY){var e=this._getVariantById(t.key);if(e){this._flUpdateVariant(e,{favorite:t.visible})}}}.bind(this))};c.prototype._flUpdateVariant=function(t,e){var i;var a={control:this._oPersoControl,id:t.getVariantId()};if(e.hasOwnProperty("content")||e.hasOwnProperty("name")){var n=l({},a);n.layer=t.getLayer();if(e.hasOwnProperty("content")){n.content=e.content}if(e.hasOwnProperty("name")){n.name=e.name}if(e.hasOwnProperty("packageName")){n.packageName=e.packageName}if(e.hasOwnProperty("transportId")){n.transportId=e.transportId}i=this._flWriteUpdateVariant(n);if(i){this._mVariants[i.getVariantId()]=i}}a={control:this._oPersoControl,id:t.getVariantId()};if(e.hasOwnProperty("favorite")||e.hasOwnProperty("executeOnSelection")){a.isUserDependent=true;if(e.hasOwnProperty("favorite")){a.favorite=e.favorite}if(e.hasOwnProperty("executeOnSelection")){a.executeOnSelection=e.executeOnSelection}i=this._flWriteUpdateVariant(a);if(i){this._mVariants[i.getVariantId()]=i}}};c.prototype._flRemoveVariant=function(t){var e={control:this._oPersoControl,id:t.getVariantId(),layer:t.getLayer()};var i=this._flWriteRemoveVariant(e);if(i){delete this._mVariants[i.getVariantId()]}};c.prototype._flWriteUpdateVariant=function(t){if(f){return f.updateVariant(t)}return null};c.prototype._flWriteRemoveVariant=function(t){if(f){return f.removeVariant(t)}return null};c.prototype._flWriteAddVariant=function(t){if(f){return f.addVariant(t)}return null};c.prototype.flWriteOverrideStandardVariant=function(t){if(f){f.overrideStandardVariant({control:this._oPersoControl,executeOnSelection:t})}};c.prototype.getCurrentVariantId=function(){if(this._bDuringVariantCreation){return"SV1656651501366"}var t=this.getCurrentVariantKey();if(t===this.STANDARDVARIANTKEY){t=""}return t};c.prototype.clearVariantSelection=function(){this.setSelectionKey(this.getStandardVariantKey())};c.prototype.setCurrentVariantId=function(t,e){var i;if(this._oPersoControl){i=this._determineVariantId(t);this.setCurrentVariantKey(i);if(this._oStandardVariant){this.setModified(false);if(!e){this._triggerSelectVariant(i,"SET_VM_ID")}}}};c.prototype._determineVariantId=function(t){var e=t;if(!e||!this.getItemByKey(e)){e=this.getStandardVariantKey()}return e};c.prototype.initialise=function(t,e){var i,a;try{if(e&&t){i=this._getControlWrapper(e);if(!i){s.error("initialise on an unknown control.");return}if(i.bInitialized){s.error("initialise on "+e.getId()+" already executed");return}i.fInitCallback=t}else if(!this.isPageVariant()){i=this._getControlWrapper(this._oPersoControl)}if(this._oPersistencyPromise){this._oPersistencyPromise.then(function(){if(this._oControlPromise&&this._oPersoControl&&i){Promise.all([this._oMetadataPromise,this._oControlPromise,f.isVariantSharingEnabled(),f.isVariantPersonalizationEnabled(),f.isVariantAdaptationEnabled()]).then(function(t){this._dataReceived(t[1],t[2],t[3],t[4],i)}.bind(this),function(i){a="'loadVariants' failed:";if(i&&i.message){a+=" "+i.messages}this._errorHandling(a,t,e)}.bind(this),function(i){if(i&&i.message){a=i.message}else{a="accessing either flexibility functionality or odata metadata."}this._errorHandling("'initialise' failed: "+a,t,e)}.bind(this))}else{this._errorHandling("'initialise' no personalizable component available",t,e)}}.bind(this),function(i){if(i&&i.message){a=i.message}else{a="accessing the flexibility functionality."}this._errorHandling("'initialise' failed: "+a,t,e)}.bind(this))}else{this._errorHandling("'initialise' no '_oPersistencyPromise'  available",t,e)}}catch(i){this._errorHandling("exception occurs during 'initialise' processing",t,e)}};c.prototype._errorHandling=function(t,e,i){var a={variantKeys:[]};this._setErrorValueState(this.oResourceBundle.getText("VARIANT_MANAGEMENT_READ_FAILED"),t);if(e&&i){e.call(i)}else{this.fireEvent("initialise",a)}if(i.variantsInitialized){i.variantsInitialized()}};c.prototype.isVariantAdaptationEnabled=function(){return this._bIsVariantAdaptationEnabled};c.prototype._dataReceived=function(t,e,i,a,n){var r,o,s={variantKeys:[]};if(this._bIsBeingDestroyed){return}if(!this._bIsInitialized){this._bIsVariantAdaptationEnabled=a;this.setVariantCreationByUserAllowed(i);this.setShowShare(e);this._bIsInitialized=true;this._createVariantEntries(t);o=this._getDefaultVariantKey();if(!o||!this._getVariantById(o)&&o.substring(0,1)!=="#"){o=this.getStandardVariantKey()}r=this._getVariantById(o);if(r){this.setDefaultVariantKey(o);this.setSelectionKey(o)}if(this._sAppStandardVariantKey){this._oAppStdContent=this._getVariantContent(this._sAppStandardVariantKey)}}this._initialize(s,n)};c.prototype._initialize=function(t,e){var i,a=null,n=this.isPageVariant();var r,o=false;if(this._oAppStdContent){if(e.type==="table"||e.type==="chart"){if(n){this._applyControlVariant(e.control,this._oAppStdContent,"STANDARD",true)}else{this._applyVariant(e.control,this._oAppStdContent,"STANDARD",true)}}}if(e.fInitCallback){e.fInitCallback.call(e.control);delete e.fInitCallback;e.bInitialized=true}else{t.variantKeys=Object.keys(this._mVariants);this.fireEvent("initialise",t)}i=this.getCurrentVariantKey();if(i&&i!==this.getStandardVariantKey()){a=this._getVariantContent(i);r=this._getVariantById(i);if(r){o=r.getExecuteOnSelection()}}else if(this._oAppStdContent){a=this._oAppStdContent;if(e.type==="table"||e.type==="chart"){a=null}}var l;if(this._sAppStandardVariantKey){l=this._updateStandardVariant(e,this._oAppStdContent)}else{l=this._setStandardVariant(e)}h.resolve(l).then(function(t){e.loaded.resolve();if(a){if(this._getAdapter()&&i.substring(0,1)==="#"&&Object.entries(a).length===0){this._applyUiState(i,"INIT",o)}else{if(n){this._applyControlVariant(e.control,a,"INIT",true,o)}else{this._applyVariant(e.control,a,"INIT",true,o)}}}if(this.bConsiderXml!==undefined){this._executeOnSelectForStandardVariantByXML(this.bConsiderXml)}if(e.control.variantsInitialized){e.control.variantsInitialized()}if(this.getCurrentVariantKey()===this.getStandardVariantKey()){if(this._getApplyAutomaticallyOnStandardVariant()&&e.control.search){e.control.search()}if(this.getExecuteOnSelectForStandardVariant()&&this._oAppStdContent){var r=this.getItemByKey(this.getCurrentVariantKey());if(r){r.setExecuteOnSelection(true)}}}if(!this.getEnabled()){this.setEnabled(true)}}.bind(this)).catch(function(t){s.error("'_initialize' throws an exception:"+t.message)}).unwrap()};c.prototype._updateVariant=function(t){return h.resolve(this._fetchContentAsync()).then(function(e){if(t.key!==this.getStandardVariantKey()){var i=this._getVariantById(t.key);if(i){if(e){var a=this.getItemByKey(t.key);var n={content:e};if(i.getPackage()){n.transportId=i.getPackage()}if(i.getRequest()){n.packageName=i.getRequest()}if(a){n.executeOnSelection=a.getExecuteOnSelection()}this._flUpdateVariant(i,n);if(t.def===true){this._setDefaultVariantKey(t.key)}}this._afterSave(t,false)}}}.bind(this)).catch(function(t){s.error("'_updateVariant' throws an exception:"+t.message)}).unwrap()};c.prototype._createChangeHeader=function(){if(this.isPageVariant()){return{type:"page",dataService:"n/a"}}var t=this._getAllPersonalizableControls();if(t&&t.length>0){return{type:t[0].type,dataService:t[0].dataSource}}};c.prototype._newVariant=function(t){this._bDuringVariantCreation=true;return h.resolve(this._fetchContentAsync()).then(function(e){var i=this._createChangeHeader();var a={type:i.type,ODataService:i.dataSource,texts:{variantName:t.name},content:e,isVariant:true,isUserDependent:!t.public,executeOnSelection:t.execute};var n=this._flWriteAddVariant({control:this._oPersoControl,changeSpecificData:a});if(n){var r=n.getVariantId();this._mVariants[r]=n;this._flUpdateVariant(n,{favorite:true});this._destroyManageDialog();this._createVariantItem(n);this.setSelectionKey(r);this._bDuringVariantCreation=false;if(t.def===true){this._setDefaultVariantKey(r);this.setDefaultVariantKey(r)}this._afterSave(t,true)}}.bind(this)).catch(function(t){this._bDuringVariantCreation=false;s.error("'_newVariant' throws an exception:"+t.message)}.bind(this)).unwrap()};c.prototype._fetchContent=function(){var t,e,i,a={};var n=this._getAllPersonalizableControls();for(var r=0;r<n.length;r++){t=n[r];if(t&&t.control&&t.control.fetchVariant){i=t.control.fetchVariant();if(i){i=l({},i);if(this.isPageVariant()){e=this._getControlPersKey(t);if(e){a=this._assignContent(a,i,e)}else{s.error("no persistancy key retrieved")}}else{a=i;break}}}}return a};c.prototype._fetchContentAsync=function(){var t,e,i,a={},n=[],r=[];var o=this._getAllPersonalizableControls();for(var h=0;h<o.length;h++){t=o[h];if(t&&t.control&&t.control.fetchVariant){i=t.control.fetchVariant();if(i){if(i&&i instanceof Promise){this.setEnabled(false);n.push(i);r.push(t);continue}i=l({},i);if(this.isPageVariant()){e=this._getControlPersKey(t);if(e){a=this._assignContent(a,i,e)}else{s.error("no persistancy key retrieved")}}else{a=i;break}}}}if(n.length>0){var p=null;var f=new Promise(function(t,e){p=t});Promise.all(n).then(function(t){for(var n=0;n<t.length;n++){i=l({},t[n]);if(this.isPageVariant()){e=this._getControlPersKey(r[n]);if(e){a=this._assignContent(a,i,e)}else{s.error("no persistancy key retrieved")}}else{a=i;break}}p(a)}.bind(this));return f}else{return a}};c.prototype._getControlInfoPersKey=function(t){var e=null;if(t.keyName==="id"){e=t.control.getId()}else{e=t.control.getProperty(t.keyName)}return e};c.prototype._getControlPersKey=function(t){var e=t;if(!t.keyName){e=this._getControlWrapper(t)}return this._getControlInfoPersKey(e)};c.prototype._appendLifecycleInformation=function(t,e){var i;var a=this.getItemByKey(e);if(a){i=a.getLifecycleTransportId();if(i===null||i===undefined){i=""}}return i};c.prototype._renameVariant=function(t){if(t.key!==this.getStandardVariantKey()){if(t){var e=this._getVariantById(t.key);if(e){var i={name:t.name};var a=this._appendLifecycleInformation(e,t.key);if(a!=undefined){i.transportId=a}this._flUpdateVariant(e,i);this._reorderList(t.key)}}}};c.prototype._deleteVariants=function(t){var e;var i=this._getDefaultVariantKey();if(t&&t.length){for(var a=0;a<t.length;a++){var n=t[a];var r=this._getVariantById(n);if(r){e=this._appendLifecycleInformation(r,n);r.setRequest(e);this._flRemoveVariant(r);var o=this.getItemByKey(n);if(o){this.removeVariantItem(o)}if(i&&i===n){this._setDefaultVariantKey("")}}}}};c.prototype._getDefaultVariantKey=function(){var t="";if(p){t=p.getDefaultVariantId({control:this._oPersoControl})}return t};c.prototype._executeOnSelectForStandardVariantByXML=function(t){o.prototype._executeOnSelectForStandardVariantByXML.apply(this,arguments);this._reapplyExecuteOnSelectForStandardVariant(t)};c.prototype._reapplyExecuteOnSelectForStandardVariant=function(t){if(Object.keys(this._mVariants).length>0){this.bConsiderXml=undefined;this.flWriteOverrideStandardVariant(t);var e=this.getStandardVariantKey();var i=this._getVariantById(e);if(i){var a=this.getItemByKey(e);if(a){a.setExecuteOnSelection(i.getExecuteOnSelection());this._reapplyExecuteOnSelectForStandardVariantItem(i.getExecuteOnSelection())}}}else{this.bConsiderXml=t}};c.prototype.setExecuteOnStandard=function(t){this._reapplyExecuteOnSelectForStandardVariant(t)};c.prototype.getExecuteOnStandard=function(){var t=this.getStandardVariantKey();var e=this.getItemByKey(t);if(e){return e.getExecuteOnSelection()}return undefined};c.prototype.registerApplyAutomaticallyOnStandardVariant=function(t){this._fRegisteredApplyAutomaticallyOnStandardVariant=t;return this};c.prototype._getApplyAutomaticallyOnStandardVariant=function(){var t=this.getExecuteOnSelectForStandardVariant();if(this._fRegisteredApplyAutomaticallyOnStandardVariant&&this.getDisplayTextForExecuteOnSelectionForStandardVariant()){try{t=this._fRegisteredApplyAutomaticallyOnStandardVariant()}catch(t){s.error("callback for determination of apply automatically on standard variant failed")}}return t};c.prototype._setDefaultVariantKey=function(t){if(f){f.setDefaultVariantId({control:this._oPersoControl,defaultVariantId:t})}};c.prototype._isVariantDownport=function(){var t=false;if(p){t=p.isVariantDownport()}return t};c.prototype._setExecuteOnSelections=function(t){if(t&&t.length){for(var e=0;e<t.length;e++){var i=this._getVariantById(t[e].key);if(i){this._flUpdateVariant(i,{executeOnSelection:t[e].exe})}}}};c.prototype._save=function(t,e){if(f){try{f.save({control:this._oPersoControl}).then(function(){if(!e){if(t){this._updateUser()}this.fireEvent("afterSave")}}.bind(this),function(t){var e="'_save' failed:";if(t&&t.message){e+=" "+t.message}this._setErrorValueState(this.oResourceBundle.getText("VARIANT_MANAGEMENT_SAVE_FAILED"),e)}.bind(this))}catch(t){this._setErrorValueState(this.oResourceBundle.getText("VARIANT_MANAGEMENT_SAVE_FAILED"),"'_save' throws an exception")}}};c.prototype._updateUser=function(){var t=this.getInitialSelectionKey();var e,i=this._getVariantById(t);if(i){e=i.getOwnerId();if(e){this._assignUser(t,e)}}};c.prototype.fireSave=function(t){if(t){if(t.overwrite){if(t.key!==this.getStandardVariantKey()){if(t.key===this.STANDARDVARIANTKEY){this._newVariant(t)}else{this._updateVariant(t)}}}else{this._newVariant(t)}}};c.prototype._afterSave=function(t,e){var i={};if(t.hasOwnProperty("tile")){i.tile=t.tile}i.name=t.name;this.fireEvent("save",i);this.setEnabled(true);this.setModified(false);this._save(e)};c.prototype.fireManage=function(t){var e,i=false;if(t){if(t.renamed){for(e=0;e<t.renamed.length;e++){this._renameVariant(t.renamed[e])}}if(t.deleted){this._deleteVariants(t.deleted)}if(t.exe){this._setExecuteOnSelections(t.exe)}if(t.def){var a=this._getDefaultVariantKey();if(a!==t.def){if(!(a===""&&t.def===this.STANDARDVARIANTKEY)){this._setDefaultVariantKey(t.def);i=true}}}if(t.fav&&t.fav.length>0){this._addFavorites(t.fav)}if(t.deleted&&t.deleted.length>0||t.renamed&&t.renamed.length>0||t.exe&&t.exe.length>0||i){this._save()}else if(t.fav&&t.fav.length>0){this._save(false,true)}this.fireEvent("manage",t)}};c.prototype.fireSelect=function(t,e){if(this._oPersoControl&&t&&t.key){this._triggerSelectVariant(t.key,e);this.fireEvent("select",t)}};c.prototype._selectVariant=function(t,e){this.fireSelect({key:t},e)};c.prototype._checkForSelectionHandler=function(t){var e=null,i=Object.keys(this._oSelectionVariantHandler);if(i.length>-1){i.some(function(i){if(t.indexOf(i)===0){e=this._oSelectionVariantHandler[i];return true}return false}.bind(this))}return e};c.prototype._triggerSelectVariant=function(t,e){var i,a,n=false,r=this._checkForSelectionHandler(t);var o=this._getVariantById(t);if(o){i=o.getExecuteOnSelection();if(t===this.getStandardVariantKey()){i=this._getApplyAutomaticallyOnStandardVariant()}n=Object.entries(this._getContent(o)).length===0?false:true}if(n){a=this._getGeneralSelectVariantContent(t,e)}else if(this._getAdapter()&&t.substring(0,1)==="#"){this._applyUiState(t,e,i);return}else if(r){a=this._getSpecialSelectVariantContent(t,e,r)}else{a=this._getGeneralSelectVariantContent(t,e)}if(a){if(this.isPageVariant()){this._applyVariants(a,e,i)}else{this._applyVariant(this._oPersoControl,a,e,false,i)}}};c.prototype._getSpecialSelectVariantContent=function(t,e,i){return i.callback.call(i.handler,t,e)};c.prototype._getGeneralSelectVariantContent=function(t,e){var i=this._getVariantContent(t);if(i){i=l({},i)}return i};c.prototype.currentVariantSetModified=function(t){if(!this._bApplyingUIState){o.prototype.currentVariantSetModified.apply(this,arguments)}};c.prototype._applyControlUiState=function(t,e){if(t&&e){t.loaded.then(function(){if(t.control.setUiStateAsVariant){t.control.setUiStateAsVariant(e)}})}};c.prototype._applyUiState=function(t,e,i){var a,n=this._getAdapter(),r=null,o=this._getAllPersonalizableControls();var s=null;if(n){r=n.getUiState(t);this._bApplyingUIState=true;for(a=0;a<o.length;a++){if(o[a]&&o[a].control&&o[a].loaded){this._applyControlUiState(o[a],r,e);if(o[a].control.search){s=o[a].control}}}this._bApplyingUIState=false;if(i&&s){s.search()}}};c.prototype._applyControlWrapperVariants=function(t,e,i,a){if(t){t.loaded.then(function(){this._applyControlVariant(t.control,e,i,false,a)}.bind(this))}};c.prototype._applyVariants=function(t,e,i){var a,n=this._getAllPersonalizableControls();for(a=0;a<n.length;a++){if(n[a]&&n[a].control&&n[a].loaded){this._applyControlWrapperVariants(n[a],t,e,i)}}};c.prototype._setStandardVariant=function(t){var i=t.control;if(i){if(i.fireBeforeVariantSave){i.fireBeforeVariantSave(e.STANDARD_VARIANT_NAME)}return this._assignStandardVariantAsync(t)}};c.prototype._retrieveContent=function(t,e){var i=t;if(this.isPageVariant()&&t){i=t[e];if(!i&&e===this.getPersistencyKey()&&this._aPersonalizableControls&&this._aPersonalizableControls.length===1){i=t}}return i};c.prototype._assignContent=function(t,e,i){if(this.isPageVariant()){t[i]=e}else{t=e}return t};c.prototype._updateStandardVariant=function(t,e){if(t.control){var i=e;if(this.isPageVariant()){var a=this._getControlPersKey(t);if(a){i=this._retrieveContent(e,a)}}return this._assignStandardVariantForControl(t,i)}return e};c.prototype._assignStandardVariantAsync=function(t){var e=null;if(t.control){if(t.control.fetchVariant){e=t.control.fetchVariant()}if(e instanceof Promise){this.setEnabled(false)}return h.resolve(e).then(function(e){return this._assignStandardVariantForControl(t,e)}.bind(this)).catch(function(t){s.error("'_assignStandardVariant' throws an exception: "+t.message)}).unwrap()}return null};c.prototype._assignStandardVariantForControl=function(t,e){var i=e;if(t){if(this.isPageVariant()){var a=this._getControlPersKey(t.control);if(a){if(!this._oStandardVariant){this._oStandardVariant={}}this._oStandardVariant=this._assignContent(this._oStandardVariant,i,a)}}else{this._oStandardVariant=i}}return this._oStandardVariant};c.prototype.getStandardVariant=function(t){var e,i,a=null;if(this._oStandardVariant){if(!t){a=this._oStandardVariant}else{if(this.isPageVariant()){i=this._getControlWrapper(t);if(i){e=this._getControlPersKey(t);if(e){a=this._retrieveContent(this._oStandardVariant,e)}}}else{if(t===this._oPersoControl){a=this._oStandardVariant}}}}return a};c.prototype._applyVariant=function(t,e,i,a,n){if(t&&t.applyVariant){if(n!=undefined){e.executeOnSelection=n}t.applyVariant(e,i,a)}};c.prototype._applyVariantByPersistencyKey=function(t,e,i){var a=null;this.getAggregation("personalizableControls",[]).some(function(e){var i=sap.ui.getCore().byId(e.getControl());if(i){var n=e.getKeyName();if(i.getProperty(n)===t){a=i}return a!=null}});if(a){var n=this._retrieveContent(e,t);this._applyVariant(a,n,i)}};c.prototype._applyControlVariant=function(t,e,i,a,n){var r,o;o=this._getControlPersKey(t);if(o){r=this._retrieveContent(e,o);if(r){this._applyVariant(t,r,i,a,n)}}};c.prototype.registerSelectionVariantHandler=function(t,e){this._oSelectionVariantHandler[e]=t};c.prototype.unregisterSelectionVariantHandler=function(t){var e=null;if(!this._oSelectionVariantHandler){return}if(typeof t==="string"){e=t}else{Object.keys(this._oSelectionVariantHandler).some(function(i){if(this._oSelectionVariantHandler[i].handler===t){e=i;return true}return false}.bind(this))}if(e){delete this._oSelectionVariantHandler[e]}};c.prototype._setErrorValueState=function(t,e){this.setInErrorState(true);if(e){s.error(e)}};c.prototype.exit=function(){o.prototype.exit.apply(this,arguments);this._aPersonalizableControls=null;this._fRegisteredApplyAutomaticallyOnStandardVariant=null;this._fResolvePersistencyPromise=null;this._fRejectPersistencyPromise=null;this._fResolveMetadataPromise=null;this._oMetadataPromise=null;this._fResolveMetadataPromise=null;this._oControlPromise=null;this._oFlLibrary=null;this._oPersistencyPromise=null;this._oPersoControl=null;this._oAppStdContent=null;this._sAppStandardVariantKey=null;this._oSelectionVariantHandler=null;if(this._oAdapter){this._oAdapter.destroy();this._oAdapter=null}this._mVariants=null};return c});