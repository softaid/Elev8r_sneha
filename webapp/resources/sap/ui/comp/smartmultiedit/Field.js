/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
sap.ui.define(["../library","sap/ui/core/library","sap/ui/core/Control","sap/ui/core/Item","sap/m/Select","sap/ui/comp/smartfield/SmartField","sap/ui/comp/smartfield/SmartLabel","sap/ui/comp/smartfield/ODataControlFactory","sap/ui/model/BindingMode","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/HBox","sap/ui/core/format/NumberFormat","sap/ui/core/format/DateFormat","sap/m/CheckBox","sap/m/Label","sap/m/Input","sap/base/Log","sap/ui/comp/odata/MetadataAnalyser","sap/ui/comp/smartfield/ComboBox","sap/ui/comp/smartfield/type/Decimal"],function(t,e,i,o,s,a,r,n,l,u,p,h,d,m,c,_,f,g,y,S,C){"use strict";var I=e.ValueState;var F=n.extend("sap.ui.comp.smartmultiedit.HackedControlFactory");F.prototype.createAttributes=function(t,e,i,o){var s=n.prototype.createAttributes.apply(this,arguments);if(t&&s[t]){s[t].mode=l.OneWay}return s};F.prototype._createEdmUOMAttributes=function(){var t=n.prototype._createEdmUOMAttributes.apply(this,arguments);if(t.value){t.value.mode=l.OneWay}return t};F.prototype._createEdmDateTime=function(){var t=n.prototype._createEdmDateTime.apply(this);t.params.getValue=function(){if(t.control.getDateValue()){return t.params.type.type.parseValue(t.control.getValue(),"string")}else{return null}};return t};F.prototype._createEdmDateTimeOffset=function(){var t=n.prototype._createEdmDateTimeOffset.apply(this);t.params.getValue=function(){if(t.control.getDateValue()){return t.params.type.type.parseValue(t.control.getValue(),"string")}else{return null}};return t};F.prototype._onCreate=function(t,e){var i;if(e&&typeof e.getValue==="function"){i=e.getValue;e.getValue=null}if(n.prototype._onCreate){n.prototype._onCreate.call(this,t,e)}if(i){e.getValue=i}};F.createFromFactory=function(t){if(!t){return null}return new F(t._oModel,t._oParent,t._oMeta)};var T=10;var E=i.extend("sap.ui.comp.smartmultiedit.Field",{metadata:{library:"sap.ui.comp",designtime:"sap/ui/comp/designtime/smartmultiedit/Field.designtime",properties:{propertyName:{type:"string",defaultValue:null},useApplyToEmptyOnly:{type:"boolean",defaultValue:false},applyToEmptyOnly:{type:"boolean",defaultValue:false},description:{type:"string",defaultValue:null},validateTokenExistence:{type:"boolean",defaultValue:true}},aggregations:{configuration:{type:"sap.ui.comp.smartfield.Configuration",multiple:false}},associations:{},events:{change:{parameters:{selectedItem:{type:"sap.ui.core.Item"}}}}},renderer:{apiVersion:2,render:function(t,e){t.openStart("div",e);t.class("sapUiCompSmartMultiEditField");t.openEnd();t.renderControl(e._oSelect);t.openStart("div");t.class("sapUiCompSmartMultiEditFieldSFWrapper");t.openEnd();if(e._oSmartField&&e._oSmartField.aCustomStyleClasses.indexOf("sapUiCompSmartMultiEditSmartField")>=0){t.renderControl(e._oSmartField)}t.close("div");if(e.getDescription()){t.openStart("div");t.class("sapUiCompSmartMultiEditSmartFieldDescription");t.openEnd();e._oDescription.setText(e.getDescription());t.renderControl(e._oDescription);t.close("div")}if(e.getUseApplyToEmptyOnly()){t.renderControl(e._oApplyToEmptyOnlyCheckBox)}t.close("div")}}});E.ACTION_ITEM_KEY={KEEP:"keep",BLANK:"blank",NEW:"new",TRUE:"true",FALSE:"false"};E.prototype.init=function(){this._createSelect();this._createSpecialSelectItems();this._createDescription();this._createApplyToEmptyOnlyCheckBox();this._oContainer=null;this._bNullable=true;this._bShowValueHelp=true;this._bClientError=null;this._oAnnotations=null;this._aDistinctValues=[];this._mRecordKeyTextMap={}};E.prototype.onBeforeRendering=function(){this._updateSpecialSelectItems()};E.prototype.getNullable=function(){return this._bNullable};E.prototype.getShowValueHelp=function(){return this._bShowValueHelp};E.prototype.getLabel=function(){if(this.getParent()&&this.getParent().getLabel){return this.getParent().getLabel()}else{return null}};E.prototype.getSmartField=function(){return this._oSmartField};E.prototype.getValue=function(){return this._oSmartField?this._oSmartField.getValue():null};E.prototype.getDataType=function(){if(!this._oSmartField){return null}try{return this._oSmartField.getDataType()}catch(t){return null}};E.prototype.isComposite=function(){return!!this._oAnnotations.uom};E.prototype.isString=function(){return this.getDataType()==="Edm.String"};E.prototype.isInteger=function(){return this.getDataType()==="Edm.Byte"||this.getDataType()==="Edm.Int16"||this.getDataType()==="Edm.Int32"||this.getDataType()==="Edm.Int64"||this.getDataType()==="Edm.SByte"};E.prototype.isFloat=function(){return this.getDataType()==="Edm.Decimal"||this.getDataType()==="Edm.Double"||this.getDataType()==="Edm.Float"||this.getDataType()==="Edm.Single"};E.prototype.isDate=function(){return this.getDataType()==="Edm.DateTime"};E.prototype.isDateTime=function(){return this.getDataType()==="Edm.DateTimeOffset"};E.prototype.isTime=function(){return this.getDataType()==="Edm.Time"};E.prototype.isBoolean=function(){return this.getDataType()==="Edm.Boolean"};E.prototype.isComboBox=function(){var t=this._getCurrentValueControl();return t&&t.isA("sap.m.ComboBox")||false};E.prototype.getRecordTextPath=function(){if(this._oAnnotations&&this._oAnnotations.text){return this._oAnnotations.text.path}else{return null}};E.prototype.getUnitOfMeasure=function(){return this._oSmartField?this._oSmartField.getUnitOfMeasure():null};E.prototype.getUnitOfMeasurePropertyName=function(){return this._oAnnotations&&this._oAnnotations.uom?this._oAnnotations.uom.path:null};E.prototype.setParent=function(t,e,o){i.prototype.setParent.call(this,t,e,o);if(t&&t.getLabel&&!t.getLabel()){this._oLabel=new r(this.getId()+"-SmartLabel");this._oLabel.onFieldVisibilityChange=function(){};this._oLabel.setLabelFor(this._oSmartField.getId());t.setLabel(this._oLabel);this._oSelect.addAriaLabelledBy(this._oLabel);if(this.getDescription()){this._oSelect.addAriaLabelledBy(this._oDescription)}}return this};E.prototype.addCustomData=function(t){var e;if(!t){return this}i.prototype.addCustomData.apply(this,arguments);e=t.clone();this._oSmartField.addCustomData(e);return this};E.prototype.insertCustomData=function(t,e){var o;if(!t){return this}i.prototype.insertCustomData.apply(this,arguments);o=t.clone();this._oSmartField.addCustomData(o);return this};E.prototype.removeCustomData=function(t){var e=i.prototype.removeCustomData.apply(this,arguments);if(e){this._oSmartField.removeCustomData(e)}return e};E.prototype.removeAllCustomData=function(){var t=i.prototype.removeAllCustomData.apply(this,arguments);if(t.length>0){t.forEach(function(t){this._oSmartField.removeCustomData(t)}.bind(this))}return t};E.prototype.destroyCustomData=function(){i.prototype.destroyCustomData.apply(this,arguments);this._oSmartField.destroyCustomData();return this};E.prototype.setPropertyName=function(t){this.setProperty("propertyName",t,true);this._createSmartField();return this};E.prototype.setConfiguration=function(t){var e;this.setAggregation("configuration",t,true);if(this._oSmartField){e=t?t.clone():null;this._oSmartField.setConfiguration(e)}return this};E.prototype.getSelectedItem=function(){return this._oSelect.getSelectedItem()};E.prototype.setSelectedItem=function(t,e){this._handleSelectionChange(t,e);return this};E.prototype.setSelectedIndex=function(t){this.setSelectedItem(this._oSelect.getItems()[t]);return this};E.prototype.exit=function(){this._getKeep().destroy();this._getBlank().destroy();this._getValueHelp().destroy();this._getBoolTrueItem().destroy();this._getBoolFalseItem().destroy()};E.prototype.isBlankSelected=function(){return this._oSelect.getSelectedItem()===this._getBlank()};E.prototype.isKeepExistingSelected=function(){return this._oSelect.getSelectedItem()===this._getKeep()};E.prototype.isValueHelpSelected=function(){return this._oSelect.getSelectedItem()===this._getValueHelp()};E.prototype.getRawValue=function(){var t={},e,i,o,s=this.getSelectedItem(),a=this.getPropertyName();if(s===this._getBoolTrueItem()){e=true}else if(s===this._getBoolFalseItem()){e=false}else if(this.isBlankSelected()){e=null}else if(s===this._getValueHelp()){if(this.isComposite()){i=this.getValue();if(i==null||typeof i==="string"&&!i.trim()){e={value:null}}else{e={value:d.getFloatInstance().parse(i).toString()}}o=this.getUnitOfMeasure();if(o==null||typeof o==="string"&&!o.trim()){e.unit=null}else{e.unit=o}}else if(this.isInteger()&&this.getDataType()!=="Edm.Int64"){e=d.getIntegerInstance().parse(this.getValue())}else if(this.getDataType()==="Edm.Decimal"){e=C.prototype.parseValue(this.getValue(),"string")}else{e=this.getValue()}}else if(s){e=this._mContextItemsData[s.getKey()]}if(!this.isKeepExistingSelected()&&typeof e!=="undefined"){if(this.isComposite()){if(e!=null){t[a]=e.value;t[this.getUnitOfMeasurePropertyName()]=e.unit}else{t[a]=null;t[this.getUnitOfMeasurePropertyName()]=null}}else{t[a]=e;if(this.isComboBox()&&this.getRecordTextPath()){if(e!=null){t[this.getRecordTextPath()]=this._mRecordKeyTextMap[e]}else{t[this.getRecordTextPath()]=null}}}}return t};E.prototype.hasClientError=function(){return this._bClientError};E.prototype._setNullable=function(t){if(t!==this._bNullable){this._bNullable=t;this._updateSpecialSelectItems();this.getLabel().setRequired(true);this._oSelect.setRequired(!t)}return this};E.prototype._setShowValueHelp=function(t){if(t!==this._bShowValueHelp){this._bShowValueHelp=t;this._updateSpecialSelectItems()}return this};E.prototype._isSpecialValueItem=function(t){return t===this._getKeep()||t===this._getBlank()||t===this._getValueHelp()};E.prototype._handleSelectionChangeEvent=function(t){var e=t.getParameter("selectedItem");this._handleSelectionChange(e)};E.prototype._handleSelectionChange=function(t,e){this._oSelect.setSelectedItem(t);if(this.isKeepExistingSelected()||this.isBlankSelected()){this.getSmartField().removeStyleClass("sapUiCompSmartMultiEditSmartField");this.getSmartField().addStyleClass("sapUiCompSmartMultiEditSmartFieldHidden")}else{this.getSmartField().addStyleClass("sapUiCompSmartMultiEditSmartField");this.getSmartField().removeStyleClass("sapUiCompSmartMultiEditSmartFieldHidden")}if(e){return}var i=this.isValueHelpSelected();this._oSmartField.setContextEditable(i);this._oSmartField._updateInnerControlsIfRequired();this._oApplyToEmptyOnlyCheckBox.setVisible(i);this._bClientError=null;if(this._isSpecialValueItem(t)){this._setSmartFieldDisplayText(null,null)}else{this._oApplyToEmptyOnlyCheckBox.setVisible(true);if(!this.isBoolean()){this._oSmartField.setContextEditable(true);this._oSmartField._updateInnerControlsIfRequired()}var o=this._mContextItemsData[t.getKey()];if(this.isComposite()){if(this._isCurrencyValue()){this._setSmartFieldDisplayText(this._formatCurrencyValue(d.getFloatInstance().format(o.value),o.unit,true),o.unit)}else{this._setSmartFieldDisplayText(d.getFloatInstance().format(o.value),o.unit)}}else if(this.isBoolean()){this._setSmartFieldDisplayText(t.getText())}else if(this.isDate()){this._setSmartFieldDisplayText(m.getDateInstance().format(o))}else if(this.isDateTime()){this._setSmartFieldDisplayText(m.getDateTimeInstance().format(o))}else if(this.isInteger()){this._setSmartFieldDisplayText(d.getIntegerInstance().format(o))}else if(this.isFloat()){this._setSmartFieldDisplayText(d.getFloatInstance().format(o))}else{this._setSmartFieldDisplayText(o.toString())}if(!this.isBoolean()){this.setSelectedItem(this._getValueHelp(),true)}this._performValidation()}this.fireChange({selectedItem:t});this.invalidate()};E.prototype._extractValueDisplayText=function(t){var e;if(t==null||t==undefined){return null}if(this.isComposite()){if(this._isCurrencyValue()){e=this._formatCurrencyValue(d.getFloatInstance().format(t.value),t.unit)}else{e=d.getFloatInstance().format(t.value)+" "+t.unit}}else if(this.isBoolean()){e=t?this._getBoolTrueItem().getText():this._getBoolFalseItem().getText()}else if(this.isDate()){e=m.getDateInstance().format(t)}else if(this.isDateTime()){e=m.getDateTimeInstance().format(t)}else if(this.isInteger()){e=d.getIntegerInstance().format(t)}else if(this.isFloat()){e=d.getFloatInstance().format(t)}else{e=String(t)}return e};E.prototype._createSelect=function(){this._oSelect=new s(this.getId()+"-select");this._oSelect.setWidth("100%");this._oSelect.attachChange(this._handleSelectionChangeEvent,this);this.addDependent(this._oSelect)};E.prototype._getResourceBundle=function(){if(this._oRb==null){this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp")}return this._oRb};E.prototype._createSpecialSelectItems=function(){var t=new o({key:E.ACTION_ITEM_KEY.KEEP,text:"< "+this._getResourceBundle().getText("MULTI_EDIT_KEEP_TEXT")+" >"});this._getKeep=function(){return t};var e=new o({key:E.ACTION_ITEM_KEY.BLANK,text:"< "+this._getResourceBundle().getText("MULTI_EDIT_BLANK_TEXT")+" >"});this._getBlank=function(){return e};var i=new o({key:E.ACTION_ITEM_KEY.NEW,text:"< "+this._getResourceBundle().getText("MULTI_EDIT_NEW_TEXT")+" >"});this._getValueHelp=function(){return i};var s=new o({key:E.ACTION_ITEM_KEY.TRUE,text:this._getResourceBundle().getText("SMARTFIELD_CB_YES")});this._getBoolTrueItem=function(){return s};var a=new o({key:E.ACTION_ITEM_KEY.FALSE,text:this._getResourceBundle().getText("SMARTFIELD_CB_NO")});this._getBoolFalseItem=function(){return a}};E.prototype._createDescription=function(){if(!this._oDescription){this._oDescription=new _;this.addDependent(this._oDescription)}};E.prototype._createApplyToEmptyOnlyCheckBox=function(){this._oApplyToEmptyOnlyCheckBox=new c(this.getId()+"-ApplyToEmptyOnly");this._oApplyToEmptyOnlyCheckBox.setText(this._getResourceBundle().getText("MULTI_EDIT_APPLY_TO_EMPTY_ONLY"));this._oApplyToEmptyOnlyCheckBox.attachSelect(function(t){this.setApplyToEmptyOnly(t.getSource().getSelected())}.bind(this));this.addDependent(this._oApplyToEmptyOnlyCheckBox)};E.prototype._createSmartField=function(){this._bIsSmartFieldInitialized=false;this._oSmartField=new a({id:this.getId()+"-SmartField",value:{path:this.getPropertyName(),mode:"OneWay"},textInEditModeSource:"ValueList"});this._oSmartField.addStyleClass("sapUiCompSmartMultiEditSmartFieldHidden");this._oSmartField._createFactory=function(){var t=a.prototype._createFactory.apply(this,arguments);return F.createFromFactory(t)};this.addDependent(this._oSmartField);this._oSmartField.setValue=this._handleSmartFieldSetValue;this._pInitialised=new Promise(function(t,e){this._oSmartField.attachInitialise({resolve:t,reject:e},this._handleSmartFieldInitialized,this)}.bind(this));this._oSmartField.attachInnerControlsCreated(this._handleInnerControlsCreation.bind(this),this);if(this.getConfiguration()){this._oSmartField.setConfiguration(this.getConfiguration().clone())}this._oSmartFieldValue=null};E.prototype._getCurrentValueControl=function(){return this._oSmartField?this._oSmartField._oControl[this._oSmartField._oControl.current]:null};E.prototype._setSmartFieldDisplayText=function(t,e){var i,o;this._oSmartFieldValue=t;this._oSmartField.setValue(t);var s=this._getCurrentValueControl();if(s){if(this.isComboBox()){s.setSelectedKey(t)}else if(this.isComposite()&&s.getItems){i=s.getItems()[0];if(i.setValue){i.setValue(t)}else if(i.setText){i.setText(t)}else if(i.setSelectedKey){i.setSelectedKey(t)}i=s.getItems()[1];if(i._oControl.current==="display"){o=i._oControl.display;if(o.setText){o.setText(e)}}else if(i._oControl.current==="edit"){o=i._oControl.edit;if(o.setEnteredValue){o.setEnteredValue(e)}else if(o.setValue){o.setValue(e)}}}else if(s.setText){s.setText(t)}else if(s.setValue){s.setValue(t)}}};E.prototype._getSmartFieldDisplayText=function(){var t=this._oSmartField._oControl.display,e="";if(t){if(this.isComposite()&&t.getItems){if(t.getItems()[0].getText){e+=t.getItems()[0].getText()}var i=t.getItems()[1]._oControl.display;if(i&&i.getText){e+=t.getItems()[1]._oControl.display.getText()}return e}else if(t.isA("sap.m.ComboBox")){return this._mRecordKeyTextMap[t.getSelectedKey()]||""}else if(t.getText){return t.getText()}else{return null}}else{return null}};E.prototype._handleSmartFieldSetValue=function(t){if(t===this.getParent()._oSmartFieldValue){a.prototype.setValue.call(this.getParent()._oSmartField,t)}};E.prototype._setSFUserInteraction=function(){if(this._oSmartField._oControl.edit&&this._oSmartField._oControl.edit._setPreferUserInteraction){this._oSmartField._oControl.edit._setPreferUserInteraction(false)}};E.prototype._handleSmartFieldInitialized=function(t,e){if(this.isTime()){g.error("Field._handleSmartFieldInitialized","Edm.Time data type is not supported, field: '"+this.getPropertyName()+"'","sap.ui.comp.smartmultiedit.Field");return}this._oAnnotations=this._oSmartField._oFactory._oMetaData.annotations;this._bIsSmartFieldInitialized=true;this._oSmartField.setContextEditable(false);this._oSmartField._updateInnerControlsIfRequired();this._updateContextItems();this._setSFUserInteraction();this._oApplyToEmptyOnlyCheckBox.setVisible(false);e.resolve()};E.prototype._handleInnerControlsCreation=function(t){var e;t.mParameters.forEach(function(t){if(t.getParent()&&t.getParent()._oControl){if(t.getParent()._oControl.display===t){if(t.mBindingInfos.text){t.mBindingInfos.text.skipModelUpdate=true}}else if(t.getParent()._oControl.edit===t){if(t.mBindingInfos.value){t.mBindingInfos.value.skipModelUpdate=true;t.setValue(null)}else if(t.mBindingInfos.selected){t.mBindingInfos.selected.skipModelUpdate=true;t.setSelected(false)}}}if(t===this._oSmartField._oControl.display){return}if(t.attachChange){t.attachChange(this._performValidation,this)}if(t.getParent()&&t.getParent().getParent()instanceof a&&t.getParent().getParent()._oControl.edit instanceof h&&this._oAnnotations&&this.isComposite()){var e=t.getParent().getParent()._oControl.edit;var i=e.getItems();i[0].attachChange(this._handleCompositeInputChange,this);if(i[1]&&i[1]._oControl&&i[1]._oControl.edit){i[1]._oControl.edit.attachChange(this._handleCompositeInputChange,this)}}else if(t.getParent()instanceof a&&!(t.getParent().getParent()instanceof h)&&t.getParent()._oControl.edit instanceof f){t.getParent()._oControl.edit.attachChange(this._handleInputChange,this)}}.bind(this));e=this._oSmartField.getMandatory();this._setNullable(!e)};E.prototype._getInnerEdit=function(){return this._oSmartField._oControl.edit};E.prototype._getFirstInnerEdit=function(){return this._oSmartField._oControl.edit?this._oSmartField._oControl.edit.getItems()[0]:null};E.prototype._getSecondInnerEdit=function(){return this._oSmartField._oControl.edit?this._oSmartField._oControl.edit.getItems()[1]._oControl.edit:null};E.prototype._getSecondInnerDisplay=function(){return this._oSmartField._oControl.edit?this._oSmartField._oControl.edit.getItems()[1]._oControl.display:null};E.prototype._performTokenValidation=function(t,e,i){return new Promise(function(o,s){var a=new y(i.getModel());a.getValueListAnnotationLazy(e).then(function(e){var a=e.primaryValueListAnnotation;if(!a){o();return}i.getModel().read("/"+a.valueListEntitySetName,{success:function(e){if(e.results&&e.results.length===0&&t._oControl.edit){var s=i.getNullable()&&i.getValue()==="";t._oControl.edit.setValueState(s?I.None:I.Error);i._bClientError=!s}else if(!i._bClientError){t._oControl.edit.setValueState(I.None);i._bClientError=null}o()},filters:[new u({path:a.keyField,operator:p.EQ,value1:t.getValue()})],error:function(t){s(t)}})})})};E.prototype._fnGetInnerValuesHelper=function(){var t=[this._getFirstInnerEdit().getValue()];var e=this._getSecondInnerEdit();if(e instanceof S){t.push(e.getSelectedKey())}else{if(e){t.push(e.getValue())}else{var i=this._getSecondInnerDisplay();if(i){t.push(i.getText())}}}return t};E.prototype._performValidation=function(){var t=this._oSmartField._oError;t.bComplex=false;t.bFirst=false;t.bSecond=false;var e=this._oSmartField.getInnerControls();if(this.isComposite()&&e.length===2&&e[0].getBinding("value")){var i=e[0].getBinding("value");var o=i.getValue;i.getValue=this._fnGetInnerValuesHelper.bind(this);this._oSmartField.checkValuesValidity({handleSuccess:true}).then(function(){this._bClientError=false}.bind(this)).catch(function(){this._bClientError=true}.bind(this));i.getValue=o}else{this._oSmartField.checkValuesValidity({handleSuccess:true}).then(function(){this._bClientError=false}.bind(this)).catch(function(){this._bClientError=true}.bind(this))}if(this.isKeepExistingSelected()||this.isBlankSelected()){return}if(this.getValidateTokenExistence()){var s=[];if("valuelist"in this._oAnnotations){s.push(this._performTokenValidation(this.getSmartField(),this._oAnnotations.valuelist,this))}if(this.isComposite()&&"valuelistuom"in this._oAnnotations&&this.getSmartField()._oControl.edit){s.push(this._performTokenValidation(this.getSmartField()._oControl.edit.getItems()[1],this._oAnnotations.valuelistuom,this))}return Promise.all(s)}else{return Promise.resolve()}};E.prototype._handleCompositeInputChange=function(t){var e=this._fnGetInnerValuesHelper(),i=e[0],o=e[1]||"",s;if(this._isCurrencyValue()){s=this._formatCurrencyValue(i,o,true)}else{var a=d.getFloatInstance({parseAsString:true}).parse(i);s=d.getFloatInstance().format(a)}if(!this._oSmartField._oError.bFirst&&!this._oSmartField._oError.bSecond){this._setSmartFieldDisplayText(s,o)}};E.prototype._handleInputChange=function(){var t=this._getInnerEdit().getValue();if(!this.isString()){var e=d.getFloatInstance({parseAsString:true}).parse(t);t=d.getFloatInstance().format(e)}if(!this._oSmartField._oError.bFirst){this._setSmartFieldDisplayText(t,this._getInnerEdit().getValue())}};E.prototype._formatCurrencyValue=function(t,e,i){var o=d.getFloatInstance().parse(t),s=d.getCurrencyInstance().format(o,e);if(i){s=s.replace(e,"").trim()}return s};E.prototype._updateSpecialSelectItems=function(){this._oSelect.removeAggregation("items",this._getKeep(),true);this._oSelect.removeAggregation("items",this._getBlank(),true);this._oSelect.removeAggregation("items",this._getValueHelp(),true);this._oSelect.insertAggregation("items",this._getKeep(),0,true);if(this.getShowValueHelp()){this._oSelect.insertAggregation("items",this._getValueHelp(),1,true)}if(this.getNullable()){this._oSelect.insertAggregation("items",this._getBlank(),this.getShowValueHelp()?2:1,true)}this.invalidate()};E.prototype._removeContextItems=function(){this._oSelect.removeAllItems();this._updateSpecialSelectItems()};E.prototype._updateContextItems=function(){var t,e,i,o;if(!this._oContainer||!this.getDataType()||!this._bIsSmartFieldInitialized){return}this._removeContextItems();if(this.isBoolean()){this._oSelect.addAggregation("items",this._getBoolTrueItem(),true);this._oSelect.addAggregation("items",this._getBoolFalseItem(),true);this._setShowValueHelp(false)}this._aDistinctValues=[];this._mContextItemsData={};this._mValueOccurences={};this._oContainer.getContexts().forEach(function(o){t=this.getModel().getObject(o.getPath())[this.getPropertyName()];if(typeof t==="undefined"||t==null||typeof t==="string"&&!t.trim()){return}if(this.isComposite()){e=this.getModel().getObject(o.getPath())[this.getUnitOfMeasurePropertyName()]||"";i={value:t,unit:e};if(this._aDistinctValues.map(JSON.stringify).indexOf(JSON.stringify(i))===-1){this._aDistinctValues.push(i);this._mValueOccurences[i.unit+i.value]={count:1,value:i,context:o}}else{this._mValueOccurences[i.unit+i.value].count++}}else if(this.isDate()||this.isDateTime()){if(this._aDistinctValues.map(Number).indexOf(+t)===-1){this._aDistinctValues.push(t);this._mValueOccurences[t]={count:1,value:t,context:o}}else{this._mValueOccurences[t].count++}}else if(this._aDistinctValues.indexOf(t)===-1){this._aDistinctValues.push(t);this._mValueOccurences[t]={count:1,value:t,context:o}}else{this._mValueOccurences[t].count++}}.bind(this));o=Object.keys(this._mValueOccurences).map(function(t){return[t,this._mValueOccurences[t]]}.bind(this));o.sort(function(t,e){if(e[1].count!==t[1].count){return e[1].count-t[1].count}else if(this.isComposite()){return e[1].value.value-t[1].value.value}else if(this.isInteger()||this.isFloat()){return e[1].value-t[1].value}else if(this.isDate()||this.isDateTime()){return e[1].value.getTime()-t[1].value.getTime()}else if(t[1].value.localeCompare&&e[1].value.localeCompare){return t[1].value.localeCompare(e[1].value)}else{return 0}}.bind(this));o=o.slice(0,T);this._aDistinctValues=[];o.forEach(function(t){this._addInnerSelectItem(t[1].value,t[1].context);this._aDistinctValues.push(t[1].value)}.bind(this));this._setSmartFieldDisplayText(null,null)};E.prototype._calculateTextAbsolutePath=function(t){if(this._oAnnotations.valueListData&&this._oSmartField._oFactory._oMetaData&&this._oSmartField._oFactory._oMetaData.property){var e=this._oAnnotations.valueListData.valueListEntitySetName;return this._oSmartField._oFactory._oHelper.getAbsolutePropertyPathToValueListEntity({entityID:t,entitySet:{name:e},property:this._oSmartField._oFactory._oMetaData.property.valueListKeyProperty})}return""};E.prototype._addInnerSelectItem=function(t,e){var i,s;if(typeof t==="undefined"||t==null||this.isBoolean()){return}if(this.isComposite()){i=JSON.stringify([t.value,t.unit])}else if(this.isDate()){i=m.getDateInstance().format(t)}else if(this.isDateTime()){i=m.getDateTimeInstance().format(t)}else{i=String(t)}if(this.isComboBox()){var a=this.getRecordTextPath();if(a){s=e.getObject(a)}else{var r=this._calculateTextAbsolutePath(t);s=r?this.getModel().getProperty(r):t}this._mRecordKeyTextMap[i]=s}else{s=this._extractValueDisplayText(t)}this._oSelect.addItem(new o({key:i,text:s}),true);this._mContextItemsData[i]=t};E.prototype._setContainer=function(t){this._oContainer=t;this._oSmartField.setEntitySet(t.getEntitySet());this._oSmartField._forceInitialise();this._updateContextItems()};E.prototype._isCurrencyValue=function(){return this._oAnnotations&&this._oAnnotations.uom&&this._oAnnotations.uom.property.property["sap:semantics"]=="currency-code"};E.prototype.resetField=function(){this._oSelect.setSelectedItem(this._getKeep());this.getSmartField().setValue("");this.getSmartField().setValueStateText("");this.getSmartField().setValueState(I.None);this.getSmartField().removeStyleClass("sapUiCompSmartMultiEditSmartField");this.getSmartField().addStyleClass("sapUiCompSmartMultiEditSmartFieldHidden")};return E});