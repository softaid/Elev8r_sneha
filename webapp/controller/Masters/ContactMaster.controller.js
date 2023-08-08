sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/ui/elev8rerp/componentcontainer/services/Masters/Contact.service',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',

], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, contactService,commonFunction) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Masters.ContactMaster", {

		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();
			this.afilters = [];
			this.bus.subscribe("contactmaster", "setDetailPage", this.setDetailPage, this);
			this.bus.subscribe("contactscreen", "handleContactList", this.handleContactList, this);
			this.bus.subscribe("contactdetail", "handleContactDetails", this.handleContactDetails, this);
			
			this.oFlexibleColumnLayout = this.byId("fclContactMaster");

			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("loaddata", "loadData", this.loadData, this);

			// bind CntType dropdown
			commonFunction.getReferenceByTypeForFilter("CntType", "contactTypeModel", this);

			// bind CntCtgry dropdown
			commonFunction.getReferenceByTypeForFilter("CntCtgry", "cntCategoryModel", this);

			let contactModel = new JSONModel();
			contactModel.setData({modelData : []});
			this.getView().setModel(contactModel,"contactModel");

			this.loadData();
			this.fnShortCut();
		},

		onAfterRendering: function () {
			jQuery.sap.delayedCall(1000, this, function () {
				this.getView().byId("search").focus();
			});

		},

		// Function for display Type wise Leads
		onContactType: function (oEvent) {
			let filterText = oEvent.getSource().mProperties.text.split("(");
			var sQuery = filterText[0];
			var contains = sap.ui.model.FilterOperator.EQ;
			var columns = 'contacttype';

			this.afilters.push(new sap.ui.model.Filter(columns, contains, sQuery));
			if (sQuery == "All") {
				this.afilters = [];
			}
			// if (sQuery == "All") {
			// 	let i = this.afilters.length;
			// 	while (i--) {
			// 		if (this.afilters[i].sPath == "contacttype") {
			// 			this.afilters.splice(i, 1);
			// 		}
			// 	}
			// }
			var list = this.getView().byId("tblContact");
			var binding = list.getBinding("items");

			binding.filter(new sap.ui.model.Filter({ filters: this.afilters, and: true | false }));
		},

		// Function for display categorywise contacts
		onContactCategory: function (oEvent) {
			let filterText = oEvent.getSource().mProperties.text.split("(");
			var sQuery = filterText[0];
			var contains = sap.ui.model.FilterOperator.EQ;
			var columns = 'contactcategory';

			this.afilters.push(new sap.ui.model.Filter(columns, contains, sQuery));
			if (sQuery == "All") {
				let i = this.afilters.length;
				while (i--) {
					if (this.afilters[i].sPath == "contactcategory") {
						this.afilters.splice(i, 1);
					}
				}
			}
			var list = this.getView().byId("tblContact");
			var binding = list.getBinding("items");

			binding.filter(new sap.ui.model.Filter({ filters: this.afilters, and: true | false }));
		},


		onListItemPress: function (oEvent) {
			var viewModel = oEvent.getSource().getBindingContext("contactModel");
			var model = { "id": viewModel.getProperty("id"),}
			// var model = { "contactModel": viewModel.modelData };
			this.bus = sap.ui.getCore().getEventBus();
			// this.bus.publish("contactmaster", "setDetailPage", { viewName: "ContactMasterDetail", viewModel: model });

			setTimeout(function () {
				this.bus = sap.ui.getCore().getEventBus();
				this.bus.publish("contactscreen", "handleContactList", { pagekey: "addcontact", viewModel: model });
			}, 1000);
			this.bus.publish("contactscreen", "handleContactList", { pagekey: "addcontact", viewModel: model });
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

		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");
			var contains = sap.ui.model.FilterOperator.Contains;
			var columns = ['contactname','contacttype','companyname','contactreference','designation'];
			var filters = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, contains, sQuery);
			}),
				false);  // false for OR condition

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [filters];
			}

			this.getView().byId("tblContact").getBinding("items").filter(oTableSearchState, "Application");
		},

		onAddNew: function () {

			var viewModel = this.getView().getModel("contactModel").oData;

			let count, nextid;
			if(this.getView().getModel("contactModel").oData.modelData.length){
				count = (this.getView().getModel("contactModel").oData.modelData.length)-1;
				nextid = parseInt(this.getView().getModel("contactModel").oData.modelData[count].id) + 1;
			}else{
				nextid = 1;
			}
			let model = {
				leadid : nextid
			}
			// var model = { "contactModel": viewModel.modelData };
			this.bus = sap.ui.getCore().getEventBus();
			// this.bus.publish("contactmaster", "setDetailPage", { viewName: "ContactMasterDetail", viewModel: model });

			setTimeout(function () {
				this.bus = sap.ui.getCore().getEventBus();
				this.bus.publish("contactscreen", "handleContactList", { pagekey: "addcontact", viewModel: model });
			}, 1000);
			this.bus.publish("contactscreen", "handleContactList", { pagekey: "addcontact", viewModel: model });
		},

		handleContactList: function (sChannel, sEvent, oData) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.bus = sap.ui.getCore().getEventBus();
			oRouter.getTargets().display(oData.pagekey, { viewModel: oData.viewModel });
			oRouter.navTo(oData.pagekey, true);
		},


		onSort: function (oEvent) {
			this._bDescendingSort = !this._bDescendingSort;
			var oView = this.getView(),
				oTable = oView.byId("tblContact"),
				oBinding = oTable.getBinding("items"),
				oSorter = new Sorter("contactname", this._bDescendingSort);
			oBinding.sort(oSorter);
		},

		loadData: function () {
			var currentContext = this;

			contactService.getAllContacts(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(oModel, "contactModel");
			});
		}

	});
}, true);
