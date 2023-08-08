sap.ui.define([
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/m/MessageToast',

], function (BaseController, JSONModel, Filter, FilterOperator, Sorter, commonService, commonFunction, MessageToast) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.ApplicationSettings.PageShortcutKeysDetail", {
		onInit: function () {
			var currentContext = this;
			this.bus = sap.ui.getCore().getEventBus();

			// // Attaches validation handlers
			// sap.ui.getCore().attachValidationError(function (oEvent) {
			// 	oEvent.getParameter('element').setValueState(ValueState.Error);
			// });

			// sap.ui.getCore().attachValidationSuccess(function (oEvent) {
			// 	oEvent.getParameter('element').setValueState(ValueState.None);
			// });

		},

		onBeforeRendering: function () {
			var currentContext = this;
			this.model = this.getView().getModel("viewModel");

			var oModel = new JSONModel();
			if (this.model != undefined) {
				oModel.setData(this.model);
			}

			console.log(this.model);

			currentContext.getView().setModel(oModel, "edtPageShortcutKeyModel");

			currentContext.getRole();

			currentContext.getRolewiseEntity(null);
		},

		getAllEntities : function(){
			var currentContext = this;
			commonService.getAllEntities(function(data){
				console.log(data);
				var oModel = new sap.ui.model.json.JSONModel();
				if(data[0].length){
					oModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oModel, "pageModel");
				}
			})
		},

		getRole : function(){
            var currentContext = this;
            commonService.getRole(function(data){
                var oModel = new sap.ui.model.json.JSONModel();

                if (data[0].length) {
                    oModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oModel, "roleModel");
                }
            })
		},

		onRoleChange: function (oEvent) {
			debugger;
            this.roleid = null;
            this.roleid = oEvent.getParameter("selectedItem").getKey();;
            this.getRolewiseEntity(this.roleid);
		},
		
		getRolewiseEntity : function(roleid){
            var currentContext = this;
            commonService.getRolewiseEntity({roleid : roleid},function(data){
                var oModel = new sap.ui.model.json.JSONModel();
                console.log("entity : ",data);
                if (data[0].length) {
                    oModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oModel, "pageModel");
                }
            })
        },

		// get resource Model
		resourcebundle: function () {
			var oBundle = this.getModel("i18n").getResourceBundle();
			return oBundle
		},

		onSave: function () {
			var currentContext = this;
			
			var model = this.getView().getModel("edtPageShortcutKeyModel").oData;
			model["companyid"] = commonFunction.session("companyId");

			model["pagekey"] = currentContext.getView().byId("page").getSelectedItem().mProperties.key;
			model["pagename"] = currentContext.getView().byId("page").getSelectedItem().mProperties.text;

			console.log("model : ",model);

			commonService.saveUserShortcutKeys(model,function(data){
				if(data.id > 0){
					currentContext.onCancel();
					MessageToast.show("Shortcut key updated successfully!");
					currentContext.bus = sap.ui.getCore().getEventBus();
					currentContext.bus.publish("loaddata", "loadData");
				}
			})
		},

		onDelete: function () {
			var currentContext = this;
			if (this.model != undefined) {
				this.model["companyid"] = commonFunction.session("companyId");

				var deleteMsg = this.resourcebundle().getText("deleteMsg");
				var OKText = this.resourcebundle().getText("OKText")
				var HatchDelete = this.resourcebundle().getText("hatcherDetailDocumentSeriesDelete")

				MessageBox.confirm(
					deleteMsg, {
						styleClass: "sapUiSizeCompact",
						onClose: function (sAction) {
							if (sAction == OKText) {
								documentseriesService.deleteDocumentSeries(currentContext.model, function (data) {
									if (data) {
										currentContext.onCancel();
										MessageToast.show(HatchDelete);
										currentContext.bus = sap.ui.getCore().getEventBus();
										currentContext.bus.publish("loaddata", "loadData");
									}
								});
							}
						}
					}
				);

			}
		},

		onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---pageshortcutkey--fclPageShortCut");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}

	});

}, true);
