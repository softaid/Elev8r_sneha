/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/comp/variants/VariantManagement"],function(e){"use strict";return{actions:{compVariant:function(t){return{validators:["noEmptyText",{validatorFunction:function(e){return!t.isNameDuplicate(e)},errorMessage:t.oResourceBundle.getText("VARIANT_MANAGEMENT_ERROR_DUPLICATE")},{validatorFunction:function(e){return!t.isNameTooLong(e)},errorMessage:t.oResourceBundle.getText("VARIANT_MANAGEMENT_MAX_LEN",[e.MAX_NAME_LEN])}]}}},aggregations:{personalizableControls:{propagateMetadata:function(){return{actions:"not-adaptable"}}}},annotations:{},properties:{persistencyKey:{ignore:true},entitySet:{ignore:true},displayTextForExecuteOnSelectionForStandardVariant:{ignore:false}},variantRenameDomRef:function(e){return e.getTitle().getDomRef("inner")},tool:{start:function(e){e.setDesignTimeMode(true)},stop:function(e){e.setDesignTimeMode(false)}},customData:{}}});