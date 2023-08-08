/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/m/CheckBox","sap/m/DatePicker","sap/m/TimePicker","sap/m/HBox","sap/m/Input","sap/m/Text","sap/m/ObjectIdentifier","sap/m/ObjectStatus","sap/m/Image","sap/m/Link","sap/m/VBox","sap/m/FlexItemData","sap/m/library","sap/ui/comp/navpopover/SmartLink","sap/ui/comp/odata/MetadataAnalyser","sap/ui/comp/smartfield/ODataHelper","sap/ui/comp/smartfield/SmartField","sap/ui/comp/odata/ODataType","sap/ui/comp/odata/FiscalMetadata","sap/ui/comp/odata/CalendarMetadata","sap/ui/comp/odata/CriticalityMetadata","sap/ui/comp/util/FormatUtil","sap/ui/comp/util/MultiUnitUtil","sap/ui/core/Control","sap/ui/comp/navpopover/SemanticObjectController","sap/ui/comp/navpopover/NavigationPopoverHandler","./ValueHelpProvider","./ValueListProvider","sap/ui/comp/library"],function(e,t,i,a,n,r,s,o,l,p,c,u,d,m,y,h,f,g,_,b,T,S,v,D,C,F,O,A,M){"use strict";var I;var L=function(e){if(e){this._oParentODataModel=e.model;this._oMetadataAnalyser=e.metadataAnalyser;this._aODataFieldMetadata=e.fieldsMetadata;this._oLineItemAnnotation=e.lineItemAnnotation;this._oSemanticKeyAnnotation=e.semanticKeyAnnotation;this._smartTableId=e.smartTableId;this._bProcessDataFieldDefault=e.processDataFieldDefault;this._isAnalyticalTable=e.isAnalyticalTable;this._isMobileTable=e.isMobileTable;this._oDateFormatSettings=e.dateFormatSettings;this._useUTCDateTime=e.useUTCDateTime;this._bEnableDescriptions=e.enableDescriptions;this._oCurrencyFormatSettings=e.currencyFormatSettings;this._oDefaultDropDownDisplayBehaviour=e.defaultDropDownDisplayBehaviour||"descriptionAndId";this.useSmartField=e.useSmartField==="true";this.useSmartToggle=e.useSmartToggle==="true";this._sEntitySet=e.entitySet;this._oSemanticKeyAdditionalControl=e._semanticKeyAdditionalControl;this._oSemanticObjectController=e.semanticObjectController;this._bPreserveDecimals=e.preserveDecimals;this._oCustomizeConfigTextInEditModeSource=e.textInEditModeSource;this._oCustomizeConfigIgnoreInsertRestrictions=e.ignoreInsertRestrictions}if(!this._oMetadataAnalyser&&this._oParentODataModel){this._oMetadataAnalyser=new y(this._oParentODataModel);this._intialiseMetadata()}this._mSmartField={};this._oHelper=new h(this._oMetadataAnalyser.oModel);this._aValueListProvider=[];this._aValueHelpProvider=[];this._aLinkHandlers=[]};L.prototype._intialiseMetadata=function(){if(!this._aODataFieldMetadata){this._aODataFieldMetadata=this._oMetadataAnalyser.getFieldsByEntitySetName(this.sEntity)}};L.prototype.getFieldViewMetadata=function(e,t){var i=this._createFieldMetadata(e);this._createFieldTemplate(i,t);return i};L.prototype._getTextInEditModeSource=function(e){if(!this._oCustomizeConfigTextInEditModeSource){return M.smartfield.TextInEditModeSource.None}return this._oCustomizeConfigTextInEditModeSource[e.name]||this._oCustomizeConfigTextInEditModeSource["*"]||M.smartfield.TextInEditModeSource.None};L.prototype._getIgnoreInsertRestrictions=function(e){if(!this._oCustomizeConfigIgnoreInsertRestrictions){return false}if(this._oCustomizeConfigIgnoreInsertRestrictions.hasOwnProperty(e.name)){return this._oCustomizeConfigIgnoreInsertRestrictions[e.name]}return this._oCustomizeConfigIgnoreInsertRestrictions["*"]||false};L.prototype._createFieldTemplate=function(e,t){if(this.useSmartField){e.template=new f({textInEditModeSource:this._getTextInEditModeSource(e),value:{path:e.name},entitySet:this._sEntitySet,contextEditable:{path:"sm4rtM0d3l>/editable",mode:"OneWay"},controlContext:this._isMobileTable?"responsiveTable":"table",wrapping:this._isMobileTable});if(g.isNumeric(e.type)||g.isDateOrTime(e.type)||b.isCalendarValue(e)||_.isFiscalValue(e)){e.template.setTextAlign("Right");e.template.setWidth("100%")}this._completeSmartField(e);e.template._setPendingEditState(t)}if(this.useSmartToggle){e.template=new I({editable:{path:"sm4rtM0d3l>/editable",mode:"OneWay"},edit:this.useSmartField?e.template:this._createEditableTemplate(e),display:this._createDisplayOnlyTemplate(e)})}else if(!this.useSmartField){e.template=t?this._createEditableTemplate(e):this._createDisplayOnlyTemplate(e)}};L.prototype._completeSmartField=function(e){var t={annotations:{},path:e.name,ignoreInsertRestrictions:this._getIgnoreInsertRestrictions(e)},i,a;if(!this._mSmartField.entitySetObject){this._mSmartField.entitySetObject=this._oHelper.oMeta.getODataEntitySet(this._sEntitySet);this._mSmartField.entityType=this._oHelper.oMeta.getODataEntityType(this._mSmartField.entitySetObject.entityType)}t.modelObject=this._oParentODataModel;t.entitySetObject=this._mSmartField.entitySetObject;t.entitySet=this._mSmartField.entitySetObject;t.entityType=this._mSmartField.entityType;this._oHelper.getProperty(t);e.fieldControlProperty=this._oHelper.oAnnotation.getFieldControlPath(t.property.property);if(e.fieldControlProperty&&e.parentPropertyName){e.fieldControlProperty=e.parentPropertyName+"/"+e.fieldControlProperty}t.annotations.uom=this._oHelper.getUnitOfMeasure2(t);t.annotations.text=this._oHelper.getTextProperty2(t);t.annotations.lineitem=this._oLineItemAnnotation;t.annotations.semantic=y.getSemanticObjectsFromProperty(t.property.property);this._oHelper.getUOMTextAnnotation(t);if(t.property.property["sap:value-list"]||t.property.property["com.sap.vocabularies.Common.v1.ValueList"]){t.annotations.valuelist=this._oHelper.getValueListAnnotationPath(t);if(t.property.property["sap:value-list"]){t.annotations.valuelistType=t.property.property["sap:value-list"]}else{t.annotations.valuelistType=this._oMetadataAnalyser.getValueListSemantics(t.property.property["com.sap.vocabularies.Common.v1.ValueList"])}}this._oHelper.getUOMValueListAnnotationPath(t);delete t.entitySet;if(typeof t.annotations.valuelist==="string"){a=this._oHelper.getAnalyzer().getValueListAnnotation(t.annotations.valuelist);i=a.primaryValueListAnnotation;if(i){t.property.valueListAnnotation=i;t.property.valueListKeyProperty=this._oHelper.getODataValueListKeyProperty(i);t.property.valueListEntitySet=this._oHelper.oMeta.getODataEntitySet(i.valueListEntitySetName);t.property.valueListEntityType=this._oHelper.oMeta.getODataEntityType(this._oHelper.oMeta.getODataEntitySet(i.valueListEntitySetName).entityType);t.annotations.valueListData=i}}e.template.data("configdata",{configdata:t});e.template.data("dateFormatSettings",this._oDateFormatSettings);e.template.data("currencyFormatSettings",this._oCurrencyFormatSettings);e.template.data("defaultDropDownDisplayBehaviour",this._oDefaultDropDownDisplayBehaviour);e.template.data("defaultInputFieldDisplayBehaviour",e.displayBehaviour);if(t.annotations.uom||g.isNumeric(e.type)||g.isDateOrTime(e.type)||b.isCalendarValue(e)||_.isFiscalValue(e)){var n=e.template.getTextAlign();if(n==="Initial"){n="Right"}if(g.isNumeric(e.type)&&!e.unit&&e.description&&e.displayBehaviour!=="idOnly"){n=undefined}e.align=n}L._createModelTypeInstance(e,this._oDateFormatSettings,this._useUTCDateTime,this._bPreserveDecimals)};L.prototype._createEditableTemplate=function(a,r){var s=null,o=L._createModelTypeInstance(a,this._oDateFormatSettings,this._useUTCDateTime,this._bPreserveDecimals);var l=a.type==="Edm.DateTime"&&a.displayFormat==="Date";if(l||a.isCalendarDate){s=new t({value:{path:a.name,type:o}})}else if(a.type==="Edm.Boolean"){s=new e({selected:{path:a.name}})}if(a.semanticObjects&&!r){s=this._createSmartLinkFieldTemplate(a,o,function(){return this._createEditableTemplate(a,true)}.bind(this))}if(!s){if(a.type==="Edm.Time"){s=new i({value:{path:a.name,type:o}})}else{s=new n({value:{path:a.name,type:o}});if(a.unit){s.bindProperty("description",{path:a.unit});s.setTextAlign("Right");s.setTextDirection("LTR");s.setFieldWidth("80%")}else if(this._bEnableDescriptions&&a.description){s.bindProperty("description",{path:a.description})}else if(g.isNumeric(a.type)||g.isDateOrTime(a.type)||b.isCalendarValue(a)||_.isFiscalValue(a)){a.align="Right";s.setTextAlign("Right");s.setTextDirection("LTR")}if(a.hasValueListAnnotation){this._associateValueHelpAndSuggest(s,a)}}}return s};L.prototype._associateValueHelpAndSuggest=function(e,t){e.setShowValueHelp(true);this._aValueHelpProvider.push(new O({fieldName:t.fieldName,control:e,model:this._oParentODataModel,dateFormatSettings:this._oDateFormatSettings,displayFormat:t.displayFormat,displayBehaviour:t.displayBehaviour,loadAnnotation:true,fullyQualifiedFieldName:t.fullName,metadataAnalyser:this._oMetadataAnalyser,title:t.label,preventInitialDataFetchInValueHelpDialog:true,takeOverInputValue:false,type:t.type,maxLength:t.maxLength}));e.setShowSuggestion(true);e.setFilterSuggests(false);this._aValueListProvider.push(new A({fieldName:t.fieldName,control:e,model:this._oParentODataModel,displayFormat:t.displayFormat,dateFormatSettings:this._oDateFormatSettings,displayBehaviour:t.displayBehaviour,loadAnnotation:true,fullyQualifiedFieldName:t.fullName,metadataAnalyser:this._oMetadataAnalyser,aggregation:"suggestionRows",typeAheadEnabled:true}))};L.prototype._createDisplayOnlyTemplate=function(e,t){var i=null,a=null,n,s,o;a=L._createModelTypeInstance(e,this._oDateFormatSettings,this._useUTCDateTime,this._bPreserveDecimals);if(g.isNumeric(e.type)||g.isDateOrTime(e.type)||b.isCalendarValue(e)||_.isFiscalValue(e)){n="Right";if(g.isNumeric(e.type)&&!e.unit&&e.description&&e.displayBehaviour!=="idOnly"){n=undefined}}if(e.urlInfo){i=this._createLink(e,a,e.urlInfo)}else if(e.criticalityInfo){i=this._createObjectStatusTemplate(e,a,e.criticalityInfo)}if(this._isMobileTable&&!i){if(e.isImageURL){i=new l({src:{path:e.name},width:"3em",height:"3em"})}else{o=L._getSemanticKeyIndex(e,this._oSemanticKeyAnnotation);if(o>-1){i=this._createObjectIdentifierTemplate(e,a,o===0)}}}if(!i){if(e.semanticObjects&&!t){i=this._createSmartLinkFieldTemplate(e,a,function(){return this._createDisplayOnlyTemplate(e,true)}.bind(this))}else if(e.unit){i=this._createMeasureFieldTemplate(e,a)}else if(e.isEmailAddress||e.isPhoneNumber){i=this._createEmailOrPhoneLink(e,a)}else{s=this._getDefaultBindingInfo(e,a,true);i=new r({wrapping:this._isMobileTable,textAlign:n,text:s})}}e.align=n;return i};L._getSemanticKeyIndex=function(e,t){var i=-1,a;if(t&&t.semanticKeyFields){i=t.semanticKeyFields.indexOf(e.name);if(i<0){a=y.resolveEditableFieldFor(e);i=a?t.semanticKeyFields.indexOf(a):-1}}return i};L._createModelTypeInstance=function(e,t,i,a){var n,r,s={};var o=e.type==="Edm.DateTime"&&e.displayFormat==="Date";if(o||e.isCalendarDate){n=t;r={displayFormat:"Date"}}else if(e.type==="Edm.DateTime"&&i){n={UTC:true}}else if(e.type==="Edm.Decimal"){r={precision:e.precision,scale:e.scale};n={preserveDecimals:a}}else if(e.type==="Edm.String"){r={isDigitSequence:e.isDigitSequence}}if(e.isCalendarDate){s.isCalendarDate=true}if(e.isFiscalDate){s.isFiscalDate=true;s.fiscalType=_.getFiscalAnotationType(e)}r=Object.assign({},r,{maxLength:e.maxLength});if(e.type=="Edm.DateTime"){e.modelType=g.getType(e.type,n,r,s);e.modelType.formatValue(new Date,"string");e.modelType.oFormat.oFormatOptions.UTC=false;return g.getType(e.type,n,r,s)}e.modelType=g.getType(e.type,n,r,s);return e.modelType};L.prototype.createModelTypeInstance=function(e){return L._createModelTypeInstance(e,this._oDateFormatSettings,this._useUTCDateTime,this._bPreserveDecimals)};L.prototype._createEmailOrPhoneLink=function(e,t){var i=new p({text:this._getDefaultBindingInfo(e,t,true),wrapping:this._isMobileTable,press:function(t){var i=t.getSource().getText();if(e.isEmailAddress){d.URLHelper.triggerEmail(i)}else if(e.isPhoneNumber){d.URLHelper.triggerTel(i)}}});return i};L.prototype._getDefaultBindingInfo=function(e,t,i){var a={path:e.name,type:t,formatter:S.getWhitespaceReplacer(i)};if(e.type==="Edm.DateTimeOffset"&&e.timezone){a={parts:[{path:e.name,type:t},{path:e.timezone}],formatter:S.getDateTimeWithTimezoneFormatter(),useRawValues:true}}else if(this._bEnableDescriptions&&e.description){a={parts:[{path:e.name,type:t},{path:e.description}],formatter:S.getFormatterFunctionFromDisplayBehaviour(e.displayBehaviour,i)};if(t&&t.getName()==="sap.ui.comp.odata.type.NumericText"&&this._bEnableDescriptions&&e.description){var n=a.formatter;a.formatter=function(e,t,i){if(e===null&&t){e=""}return n(e,t,i)}}}return a};L.prototype._createLink=function(e,t,i){var a=null;e.linkProperties=i.parameters||i.urlPath;if(i.urlPath){a={path:i.urlPath}}else if(i.urlTarget){a=i.urlTarget}return new p({text:this._getDefaultBindingInfo(e,t,true),wrapping:this._isMobileTable,href:a})};L.prototype._createObjectIdentifierTemplate=function(e,t,i){var a,n,r,o,l,p;var u=this;var d=function(t){if(u._oSemanticObjectController&&u._oSemanticObjectController.getForceLinkRendering()&&u._oSemanticObjectController.getForceLinkRendering()[e.name]){return true}var i=e.semanticObjects.additionalSemanticObjects.concat(e.semanticObjects.defaultSemanticObject);return C.hasDistinctSemanticObject(i,t)};if(e.semanticObjects){C.getDistinctSemanticObjects().then(function(t){if(d(t)){p=new F({semanticObject:e.semanticObjects.defaultSemanticObject,additionalSemanticObjects:e.semanticObjects.additionalSemanticObjects,semanticObjectLabel:e.label,fieldName:e.name,semanticObjectController:u._oSemanticObjectController,navigationTargetsObtained:function(e){var t=sap.ui.getCore().byId(e.getSource().getControl());var i=e.getParameters().mainNavigation;if(i){i.setDescription(t.getText())}e.getParameters().show(t.getTitle(),i,undefined,undefined)}});u._aLinkHandlers.push(p)}})}if(e.description){switch(e.displayBehaviour){case"descriptionAndId":e.vertical=true;n=e.description;r=e.name;o=t;break;case"idAndDescription":e.vertical=true;n=e.name;r=e.description;l=t;break;case"idOnly":n=e.name;o=t;break;default:n=e.description;break}}else{n=e.name;l=t}a=new s({title:n?{path:n,type:l,formatter:S.getWhitespaceReplacer(true)}:undefined,text:r?{path:r,type:o,formatter:S.getWhitespaceReplacer(true)}:undefined,titleActive:e.semanticObjects?{path:"$sapuicompcontrolprovider_distinctSO>/distinctSemanticObjects",formatter:function(e){return d(e)}}:false,titlePress:function(e){if(p){p.setControl(e.getSource());p.setBindingContext(e.getSource().getBindingContext());p.openPopover(e.getParameter("domRef"))}}});a.attachEvent("ObjectIdentifier.designtime",function(e){if(p){p.setControl(e.getSource());e.getParameters().registerNavigationPopoverHandler(p)}});a.setModel(C.getJSONModel(),"$sapuicompcontrolprovider_distinctSO");if(this._oSemanticKeyAdditionalControl&&i){this._bSemanticKeyAdditionalControlUsed=true;return new c({renderType:"Bare",items:[a,this._oSemanticKeyAdditionalControl]}).addStyleClass("sapUiTinyMarginTopBottom")}return a};L.prototype._createObjectStatusTemplate=function(e,t,i){var a,n,r,s;r=T.getShowCriticalityIcon(i.criticalityRepresentationType);if(i.path){e.criticality=i.path;a={path:i.path,formatter:T.getCriticalityState};if(i.criticalityRepresentationPath){e.criticalityRepresentation=i.criticalityRepresentationPath;n={parts:[{path:i.path},{path:i.criticalityRepresentationPath}],formatter:function(e,t){return T.getShowCriticalityIcon(t)?T.getCriticalityIcon(e):undefined}}}else if(r){n={path:i.path,formatter:T.getCriticalityIcon}}}else{a=T.getCriticalityState(i.criticalityType);if(i.criticalityRepresentationPath){e.criticalityRepresentation=i.criticalityRepresentationPath;n={path:i.criticalityRepresentationPath,formatter:function(e){return T.getShowCriticalityIcon(e)?T.getCriticalityIcon(i.criticalityType):undefined}}}else if(r){n=T.getCriticalityIcon(i.criticalityType)}}if(e.unit){s={parts:[{path:e.name,type:t},{path:e.unit},{mode:"OneTime",path:e.isCurrencyField?"/##@@requestCurrencyCodes":"/##@@requestUnitsOfMeasure",targetType:"any"}],formatter:e.isCurrencyField?S.getInlineAmountFormatter(this._bPreserveDecimals):S.getInlineMeasureUnitFormatter(this._bPreserveDecimals),useRawValues:true}}else{s=this._getDefaultBindingInfo(e,t,true)}return new o({text:s,state:a,icon:n})};L.prototype._createSmartLinkFieldTemplate=function(e,t,i){var a=e.unit?{parts:[{path:e.name,type:t},{path:e.unit},{mode:"OneTime",path:e.isCurrencyField?"/##@@requestCurrencyCodes":"/##@@requestUnitsOfMeasure",targetType:"any"}],formatter:e.isCurrencyField?S.getAmountCurrencyFormatter(this._bPreserveDecimals):S.getMeasureUnitFormatter(this._bPreserveDecimals),useRawValues:true}:this._getDefaultBindingInfo(e,t,true);var n=new m({semanticObject:e.semanticObjects.defaultSemanticObject,additionalSemanticObjects:e.semanticObjects.additionalSemanticObjects,semanticObjectLabel:e.label,fieldName:e.name,text:a,uom:e.unit?{path:e.unit}:undefined,wrapping:this._isMobileTable,beforeNavigationCallback:this._oSemanticObjectController?this._oSemanticObjectController.getBeforeNavigationCallback():undefined,navigationTargetsObtained:function(t){var i=this.getBinding("text");if(!i||!Array.isArray(i.getValue())||e.unit){t.getParameters().show();return}var a=i.getValue();var n=S.getTextsFromDisplayBehaviour(e.displayBehaviour,a[0],a[1]);var r=t.getParameters().mainNavigation;if(r){r.setDescription(n.secondText)}t.getParameters().show(n.firstText,r,undefined,undefined)}});n.setSemanticObjectController(this._oSemanticObjectController);n.setCreateControlCallback(i);return n};L.prototype._createMeasureFieldTemplate=function(e,t){var i,n,s,o,l,d=false;d=!!(e.isCurrencyField&&this._oCurrencyFormatSettings&&this._oCurrencyFormatSettings.showCurrencySymbol);o=new r({layoutData:this._isMobileTable?undefined:new u({growFactor:1,baseSize:"0%"}),textDirection:"LTR",wrapping:false,textAlign:"End",text:{parts:[{path:e.name,type:t},{path:e.unit},{mode:"OneTime",path:e.isCurrencyField?"/##@@requestCurrencyCodes":"/##@@requestUnitsOfMeasure",targetType:"any"}],formatter:e.isCurrencyField?S.getAmountCurrencyFormatter(this._bPreserveDecimals):S.getMeasureUnitFormatter(this._bPreserveDecimals),useRawValues:true}}).addStyleClass("sapUiCompCurrency").addStyleClass("sapUiCompCurrencyTabNums");l=new r({layoutData:new u({shrinkFactor:0}),textDirection:"LTR",wrapping:false,textAlign:"End",width:"3em",text:{path:e.unit,formatter:d?S.getCurrencySymbolFormatter():undefined}}).addStyleClass("sapUiCompUoMPart").addStyleClass("sapUiCompCurrencyMonoFont");i=new a({renderType:"Bare",justifyContent:"End",wrap:this._isMobileTable?"Wrap":undefined,items:[o,l]});i.addStyleClass("sapUiCompDirectionLTR");if(this._isAnalyticalTable){s=i;s.bindProperty("visible",{path:e.unit,formatter:v.isNotMultiUnit});n=new p({text:sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_MULTI_LINK_TEXT")||"Show Details",visible:{path:e.unit,formatter:v.isMultiUnit},press:[{value:e.name,unit:e.unit,additionalParent:this.useSmartToggle,smartTableId:this._smartTableId,template:s},v.openMultiUnitPopover]});i=new c({renderType:"Bare",items:[n,s]})}return i};L.prototype._createFieldMetadata=function(e){var t=Object.assign({},e);t.label=e.fieldLabel||e.name;t.quickInfo=e.quickInfo;t.displayBehaviour=t.displayBehaviour||this._oDefaultDropDownDisplayBehaviour;t.filterType=this._getFilterType(e);this._updateValueListMetadata(t);this._setAnnotationMetadata(t);if(this._oLineItemAnnotation&&this._oLineItemAnnotation.fields&&this._oLineItemAnnotation.fields.indexOf(e.name)>-1){t.urlInfo=this._oLineItemAnnotation.urlInfo&&this._oLineItemAnnotation.urlInfo[e.name];t.criticalityInfo=this._oLineItemAnnotation.criticality&&this._oLineItemAnnotation.criticality[e.name]}else if(this._bProcessDataFieldDefault){this._oMetadataAnalyser.updateDataFieldDefault(t)}return t};L.prototype._updateValueListMetadata=function(e){e.hasValueListAnnotation=e["sap:value-list"]!==undefined;if(e.hasValueListAnnotation){e.hasFixedValues=e["sap:value-list"]==="fixed-values"}else if(e["com.sap.vocabularies.Common.v1.ValueList"]){e.hasValueListAnnotation=true;e.hasFixedValues=this._oMetadataAnalyser.getValueListSemantics(e["com.sap.vocabularies.Common.v1.ValueList"])==="fixed-values";if(!e.hasFixedValues){e.hasFixedValues=y.isValueListWithFixedValues(e)}}};L.prototype._setAnnotationMetadata=function(e){if(e&&e.fullName){e.semanticObjects=this._oMetadataAnalyser.getSemanticObjectsFromAnnotation(e.fullName)}};L.prototype._getFilterType=function(e){return S._getFilterType(e)};L.prototype.destroy=function(){var e=function(e){var t;if(e){t=e.length;while(t--){e[t].destroy()}}};if(this._oMetadataAnalyser&&this._oMetadataAnalyser.destroy){this._oMetadataAnalyser.destroy()}this._oMetadataAnalyser=null;if(!this._bSemanticKeyAdditionalControlUsed&&this._oSemanticKeyAdditionalControl&&this._oSemanticKeyAdditionalControl.destroy){this._oSemanticKeyAdditionalControl.destroy()}e(this._aValueHelpProvider);this._aValueHelpProvider=null;e(this._aValueListProvider);this._aValueListProvider=null;e(this._aLinkHandlers);this._aLinkHandlers=null;if(this._oHelper){this._oHelper.destroy()}this._oHelper=null;this._mSmartField=null;this._aODataFieldMetadata=null;this._oDateFormatSettings=null;this._oCurrencyFormatSettings=null;this._oDefaultDropDownDisplayBehaviour=null;this._oLineItemAnnotation=null;this._oSemanticKeyAnnotation=null;this._oParentODataModel=null;this.bIsDestroyed=true};I=D.extend("sap.ui.comp.SmartToggle",{metadata:{library:"sap.ui.comp",properties:{editable:{type:"boolean",defaultValue:false}},aggregations:{edit:{type:"sap.ui.core.Control",multiple:false},display:{type:"sap.ui.core.Control",multiple:false}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}}},renderer:{apiVersion:2,render:function(e,t){e.openStart("span",t).class("sapUiCompSmartToggle").openEnd();e.renderControl(t.getEditable()?t.getEdit():t.getDisplay());e.close("span")}}});I.prototype.getFocusDomRef=function(){var e=this.getEditable()?this.getEdit():this.getDisplay();if(e){return e.getFocusDomRef()}return D.prototype.getFocusDomRef.call(this)};I.prototype.getAccessibilityInfo=function(){var e=this.getEditable()?this.getEdit():this.getDisplay();if(e&&e.getAccessibilityInfo){return e.getAccessibilityInfo()}return null};I.prototype.addAssociation=function(e,t,i){if(e==="ariaLabelledBy"){var a=this.getEdit(),n=this.getDisplay();a&&a.addAssociation(e,t,i);n&&n.addAssociation(e,t,i)}return D.prototype.addAssociation.apply(this,arguments)};I.prototype.removeAssociation=function(e,t,i){if(e==="ariaLabelledBy"){var a=this.getEdit(),n=this.getDisplay();a&&a.removeAssociation(e,t,i);n&&n.removeAssociation(e,t,i)}return D.prototype.removeAssociation.apply(this,arguments)};I.prototype.removeAllAssociation=function(e,t){if(e==="ariaLabelledBy"){var i=this.getEdit(),a=this.getDisplay();i&&i.removeAllAssociation(e,t);a&&a.removeAllAssociation(e,t)}return D.prototype.removeAllAssociation.apply(this,arguments)};return L},true);