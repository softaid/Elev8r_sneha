sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/ui/Device',
	'sap/ui/model/Filter',
	'sap/ui/model/Sorter',
	'sap/ui/elev8rerp/componentcontainer/services/LeadManagement/Lead.service',
	'sap/m/MessageToast',
	'sap/ui/core/Fragment',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',

], function (JSONModel, BaseController, Device, Filter, Sorter, Lead, MessageToast, Fragment,commonFunction) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.LeadManagement.Leads", {

		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();
			this.afiltersArr = [];
			this.bus.subscribe("commondashboard", "redirectToPage", this.redirectToPage, this);
			this.bus.subscribe("leadscreen", "handleLeadList", this.handleLeadList, this);
			this.bus.subscribe("leaddetail", "handleLeadDetails", this.handleLeadDetails, this);
			this.bus.subscribe("loaddata", "loadData", this.loadData, this);

			//Event Bus for Edit scnario
			this.bus.subscribe("loadLeadEditdata", "loadLeadEditdata", this.loadData, this);
			this.handleRouteMatched(null);

			// Fragment.load({
			// 	id: this.getView().getId(),
			// 	name: "sap.m.sample.TableViewSettingsDialog.ColumnMenu",
			// 	controller: this
			// }).then(function (oMenu) {
			// 	oView.addDependent(oMenu);
			// 	return oMenu;
			// });


			// Keeps reference to any of the created sap.m.ViewSettingsDialog-s in this sample
			this._mViewSettingsDialogs = {};
			var model = new JSONModel();
			var emptyModel = this.getModelDefault();
			model.setData(emptyModel);
			this.getView().setModel(model, "partyModel");

			var model = new JSONModel();
			model.setData(emptyModel);
			this.getView().setModel(model, "subledgerModel");
			jQuery.sap.delayedCall(1000, this, function () {
			});
			this.fnShortCut();

			// bind LeadType dropdown  
			commonFunction.getReferenceByTypeForFilter("LeadType", "leadTypeModel", this);

			// bind Lead dropdown  LeadType
			commonFunction.getReferenceByTypeForFilter("LeadCtgry", "leadCategoryModel", this);

			// bind Source dropdown
			commonFunction.getReferenceByTypeForFilter("LeadSrc", "leadSourceModel", this);

			// bind Stage dropdown
			commonFunction.getReferenceByTypeForFilter("Stage", "stageModel", this);

			// this.getView().byId("deleteicon").setVisible(false);

		},

		// resetFilter: function () {
		// 	this.filterReset = true;
		// },

		getModelDefault: function () {
			return {

			}
		},

		fnShortCut: function () {
			var currentContext = this;
			$(document).keydown(function (evt) {
				if (evt.keyCode == 79 && evt.ctrlKey) {
					jQuery(document).ready(function ($) {
						evt.preventDefault();
						currentContext.onAddNew()

					})
				}
			});
		},

		handleRouteMatched: function (evt) {
			// this.getView().byId("btnUploadData").setVisible(false);
			this.loadData();
		},

		handleLeadDetails: function (sChannel, sEvent, oData) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.bus = sap.ui.getCore().getEventBus();
			oRouter.getTargets().display(oData.pagekey, { viewModel: oData.viewModel });
			oRouter.navTo(oData.pagekey, true);
		},

		onListItemPress: function (oEvent) {
			var viewModel = oEvent.getSource().getBindingContext("LeadsMasterModel");
			var model = { "id": viewModel.getProperty("id") }
			this.bus = sap.ui.getCore().getEventBus();
			setTimeout(function () {
				this.bus = sap.ui.getCore().getEventBus();
				this.bus.publish("leaddetail", "handleLeadDetails", { pagekey: "leaddetail", viewModel: model });
			}, 1000);

			this.bus.publish("leaddetail", "handleLeadDetails", { pagekey: "leaddetail", viewModel: model });
		},

		onAddNew: function () {
			let count, nextid;
			if(this.getView().getModel("LeadsMasterModel").oData.modelData.length){
				count = (this.getView().getModel("LeadsMasterModel").oData.modelData.length)-1;
				nextid = parseInt(this.getView().getModel("LeadsMasterModel").oData.modelData[count].id) + 1;
			}else{
				nextid = 1;
			}
			let model = {
				leadid : nextid
			}

			this.bus = sap.ui.getCore().getEventBus();
			setTimeout(function () {
				this.bus = sap.ui.getCore().getEventBus();
				this.bus.publish("leadscreen", "handleLeadList", { pagekey: "addlead", viewModel: model });
			}, 1000);
			this.bus.publish("leadscreen", "handleLeadList", { pagekey: "addlead", viewModel: model });
		},

		/**
		* Function to navigate to specified route.
		* @param {*} sChannel 
		* @param {*} sEvent 
		* @param {*} oData 
		*/
		handleLeadList: function (sChannel, sEvent, oData) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.bus = sap.ui.getCore().getEventBus();
			oRouter.getTargets().display(oData.pagekey, { viewModel: oData.viewModel });
			oRouter.navTo(oData.pagekey, true);
		},

		//Search functionality for all columns for particular value
		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");
			var contains = sap.ui.model.FilterOperator.Contains;
			var columns = ['leadname', 'email', 'sourcename', 'leadtype', 'leadscategory', 'stagename'];
			var filters = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, contains, sQuery);
			}),
				false);
			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [filters];
			}
			this.getView().byId("tblPartyMaster").getBinding("items").filter(oTableSearchState, "Application");
		},

		// Function for display Qualified Leads
		onQulified: function (oEvent) {
			let filterText = oEvent.getSource().mProperties.text.split("(");
			var sQuery = filterText[0];
			var contains = sap.ui.model.FilterOperator.EQ;
			var columns = 'leadstatus';

			this.afiltersArr.push(new sap.ui.model.Filter(columns, contains, sQuery));
			if (sQuery == "All") {
				this.afiltersArr = [];
			}
			var list = this.getView().byId("tblPartyMaster");
			var binding = list.getBinding("items");
			binding.filter(new sap.ui.model.Filter({ filters: this.afiltersArr, and: true | false }));
		},

		// Function for display Type wise Leads
		onLeadType: function (oEvent) {
			let filterText = oEvent.getSource().mProperties.text.split("(");
			var sQuery = filterText[0];
			var contains = sap.ui.model.FilterOperator.EQ;
			var columns = 'leadtype';

			this.afiltersArr.push(new sap.ui.model.Filter(columns, contains, sQuery));
			if (sQuery == "All") {
				let i = this.afiltersArr.length;
				while (i--) {
					if (this.afiltersArr[i].sPath == "leadtype") {
						this.afiltersArr.splice(i, 1);
					}
				}
			}
			var list = this.getView().byId("tblPartyMaster");
			var binding = list.getBinding("items");

			binding.filter(new sap.ui.model.Filter({ filters: this.afiltersArr, and: true | false }));
		},

		// Function for display Type wise Leads
		onLeadCategory: function (oEvent) {
			let filterText = oEvent.getSource().mProperties.text.split("(");
			var sQuery = filterText[0];
			var contains = sap.ui.model.FilterOperator.EQ;
			var columns = 'leadscategory';

			this.afiltersArr.push(new sap.ui.model.Filter(columns, contains, sQuery));
			if (sQuery == "All") {
				let i = this.afiltersArr.length;
				while (i--) {
					if (this.afiltersArr[i].sPath == "leadscategory") {
						this.afiltersArr.splice(i, 1);
					}
				}
			}
			var list = this.getView().byId("tblPartyMaster");
			var binding = list.getBinding("items");

			binding.filter(new sap.ui.model.Filter({ filters: this.afiltersArr, and: true | false }));
		},

		// Function for display Type wise Leads
		onLeadSource: function (oEvent) {
			let filterText = oEvent.getSource().mProperties.text.split("(");
			var sQuery = filterText[0];
			var contains = sap.ui.model.FilterOperator.EQ;
			var columns = 'sourcename';

			this.afiltersArr.push(new sap.ui.model.Filter(columns, contains, sQuery));
			if (sQuery == "All") {
				let i = this.afiltersArr.length;
				while (i--) {
					if (this.afiltersArr[i].sPath == "sourcename") {
						this.afiltersArr.splice(i, 1);
					}
				}
			}
			var list = this.getView().byId("tblPartyMaster");
			var binding = list.getBinding("items");

			binding.filter(new sap.ui.model.Filter({ filters: this.afiltersArr, and: true | false }));
		},

		// Function for display Type wise Leads
		onLeadStage: function (oEvent) {
			let filterText = oEvent.getSource().mProperties.text.split("(");
			var sQuery = filterText[0];
			var contains = sap.ui.model.FilterOperator.EQ;
			var columns = 'stagename';

			this.afiltersArr.push(new sap.ui.model.Filter(columns, contains, sQuery));
			if (sQuery == "All") {
				let i = this.afiltersArr.length;
				while (i--) {
					if (this.afiltersArr[i].sPath == "stagename") {
						this.afiltersArr.splice(i, 1);
					}
				}
			}
			var list = this.getView().byId("tblPartyMaster");
			var binding = list.getBinding("items");

			binding.filter(new sap.ui.model.Filter({ filters: this.afiltersArr, and: true | false }));
		},

		resourceBundle: function () {
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},

		getSelectedItems: function () {
			var oTable = this.getView().byId("tblPartyMaster");
			var deleteSucc = this.resourceBundle().getText("leadDeleteSucc");
			var aSelectedItems = oTable.getSelectedItems();
			console.log(aSelectedItems.length);
			var aLeadIds = aSelectedItems.map(function (item) {
				return item.getBindingContext('LeadsMasterModel').getObject().id;
			});
			var leadFinalTds = aLeadIds.toString();
			for (var i = 0; i < aSelectedItems.length; i++) {
				oTable.removeItem(aSelectedItems[i])
				Lead.deleteLead({ id: leadFinalTds }, function (data) {
					if (data) {
						MessageToast.show(deleteSucc);
					}
				});
			}

		},

		onSort: function (oEvent) {
			this._bDescendingSort = !this._bDescendingSort;
			var oView = this.getView(),
				oTable = oView.byId("tblPartyMaster"),
				oBinding = oTable.getBinding("items"),
				oSorter = new Sorter("partyname", this._bDescendingSort);
			oBinding.sort(oSorter);
		},

		loadData: function () {
			var currentContext = this;
			Lead.getAllLeads(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(oModel, "LeadsMasterModel");
				console.log("LeadsMasterModel",oModel);

				var oQualifiedModel = new sap.ui.model.json.JSONModel();
				oQualifiedModel.setData(data[1][0]);
				currentContext.getView().setModel(oQualifiedModel, "LeadsQualifiedModel");
				console.log("LeadsQualifiedModel",oQualifiedModel);

				var oUnqualifiedModel = new sap.ui.model.json.JSONModel();
				oUnqualifiedModel.setData(data[2][0]);
				currentContext.getView().setModel(oUnqualifiedModel, "LeadsUnqualifiedModel");
				console.log("LeadsUnqualifiedModel",oUnqualifiedModel);

				var oTotalLeadModel = new sap.ui.model.json.JSONModel();
				oTotalLeadModel.setData(data[3][0]);
				currentContext.getView().setModel(oTotalLeadModel, "LeadsTotalCountModel");
				console.log("LeadsTotalCountModel",oTotalLeadModel);
			});
		},

		onSelectionChange : function(oEvent){
			var oTable = this.getView().byId("tblPartyMaster");
			let count = oTable.getSelectedItems();
			if(count.length)
				this.getView().byId("deleteicon").setVisible(true);
			else
				this.getView().byId("deleteicon").setVisible(false);
		},

		handleFilterButtonPressed: function () {
			this.getViewSettingsDialog("sap.ui.elev8rerp.componentcontainer.fragmentview.Common.FilterDialog")
				.then(function (oViewSettingsDialog) {
					oViewSettingsDialog.open();
				});
		},

		getViewSettingsDialog: function (sDialogFragmentName) {
			var pDialog = this._mViewSettingsDialogs[sDialogFragmentName];
			if (!pDialog) {
				pDialog = Fragment.load({
					id: this.getView().getId(),
					name: sDialogFragmentName,
					controller: this
				}).then(function (oDialog) {
					if (Device.system.desktop) {
						oDialog.addStyleClass("sapUiSizeCompact");
					}
					return oDialog;
				});
				this._mViewSettingsDialogs[sDialogFragmentName] = pDialog;
			}
			return pDialog;
		},

		handleFilterDialogConfirm: function (oEvent) {
			var oTable = this.byId("tblPartyMaster"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				aFilters = [];

			if (mParams.filterItems) {
				mParams.filterItems.forEach(function (oItem) {
					var aSplit = oItem.getKey().split("___"),
						sPath = aSplit[0],
						sOperator = aSplit[1],
						sValue1 = aSplit[2],
						sValue2 = aSplit[3],
						oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
					aFilters.push(oFilter);
				});

				// apply filter settings
				oBinding.filter(aFilters);

				// update filter bar
				this.byId("vsdFilterBar").setVisible(aFilters.length > 0);
				this.byId("vsdFilterLabel").setText(mParams.filterString);
			}
			else if (this.filterReset) {
				oBinding.sort();
				this.filterReset = false;
			}
		},

		onExit: function () {
			this.bus.unsubscribe("settermaster", "setDetailPage", this.setDetailPage, this);
		}
	});

}, true);
