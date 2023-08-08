sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/services/Masters/Location.service',
	'sap/ui/elev8rerp/componentcontainer/services/LeadManagement/Lead.service',
	'sap/ui/elev8rerp/componentcontainer/services/Masters/Contact.service'
], function (JSONModel, BaseController, MessageToast, MessageBox, commonFunction, commonService, locationService, leadService, contactService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.LeadManagement.AddContact", {
		onInit: function () {
			var currentContext = this;

			// currentContext.reset();
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("contactdetails", "newContact", this.contactdetail, this);
			this.bus.subscribe("converttolead", "leadConversion", this.leadConversion, this);
			this.bus.subscribe("contactscreen", "handleContactList", this.handleContactList, this);

			// bind Source dropdown
			commonFunction.getReferenceByType("LeadSrc", "leadSourceModel", this);

			// bind Lead dropdown
			commonFunction.getReferenceByType("LeadCtgry", "leadCategoryModel", this);

			// bind Source dropdown
			commonFunction.getReferenceByType("QuoteType", "quoteTypeModel", this);

			// bind Pipeline dropdown
			commonFunction.getReferenceByType("QuoteStatus", "QuoteStatusModel", this);

			// bind Pipeline dropdown
			commonFunction.getReferenceByType("QuoteCategory", "QuoteCategoryModel", this);

			// bind Lead dropdown
			commonFunction.getReferenceByType("QuoteSubCategory", "QuoteSubCategoryModel", this);

			// bind CntCtgry dropdown
			commonFunction.getReferenceByType("CntCtgry", "leadCntCategoryModel", this);

			// bind CntType dropdown
			commonFunction.getReferenceByType("CntType", "leadCntTypeModel", this);

			// bind Pipeline dropdown
			commonFunction.getReferenceByType("LeadStatus", "leadStatusModel", this);

			// bind standaredFloorHeightModel dropdown
			commonFunction.getReferenceByType("StdFlrHt", "standaredFloorHeightModel", this);

			// bind Stage dropdown
			commonFunction.getReferenceByType("Stage", "stageModel", this);

			//bind all Leads
			leadService.getAllLeads(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(oModel, "LeadsMasterModel");
				console.log("LeadsMasterModel", oModel);
			});

			//bind all locations
			locationService.getAllLocations(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(oModel, "locationModel");
			});


			//bind country dropdown
			commonService.getAllCountries(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });

				currentContext.getView().setModel(oModel, "partyCountryModel");
			});

			//bind state dropdown
			commonService.getAllStates(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(oModel, "partyStateModel");
			});

			//bind city dropdown
			commonService.getAllCities(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });

				oModel.setSizeLimit(data[0].length);

				let rCityModel = new sap.ui.model.json.JSONModel();
				rCityModel.setData({ modelData: data[0] });

				let wCityModel = new sap.ui.model.json.JSONModel();
				wCityModel.setData({ modelData: data[0] });

				currentContext.getView().setModel(rCityModel, "rCityModel");
				currentContext.getView().setModel(wCityModel, "wCityModel");
				currentContext.getView().setModel(oModel, "partyCityModel");

			});

			var emptyModel = this.getModelDefault();
			var model = new JSONModel();
			model.setData(emptyModel);
			this.getView().setModel(model, "editContactModel");

			this.getAllContacts();
		},

		getModelDefault: function () {
			return {
				id: null,
				contacttypeid: null,
				date: commonFunction.getDateFromDB(new Date()),
				contactcompanyid: null,
				companyname: null,
				buisnesscardone: null,
				buisnesscardtwo: null,
				buisnesscardthree: null,
				contactcategoryid: null,
				contactsubcategoryid: null,
				waddress: null,
				wcityid: null,
				wstateid: null,
				wcountryid: null,
				wpincode: null,
				residentialaddress: null,
				rcityid: null,
				rstateid: null,
				rcountryid: null,
				rpincode: null,
				phoneno: null,
				email: null,
				contactperson: null,
				linkedtocompany: null,
				buscard: null,
				branch: null,
				gstno: null,
				panno: null,
				linkfacebook: null,
				limkinstagram: null,
				linkyoutube: null,
				linklinkedin: null,
				remark: null,
				contactsourceone: null,
				contactsourcetwo: null,
				salecontact: null,
				nicontact: null,
				eicontact: null,
				contact: null,
				mobilep: null,
				mobilew: null,
				designation: null,
				emailp: null,
				emailw: null,
				DOB: commonFunction.getDateFromDB(new Date()),
				DOM: commonFunction.getDateFromDB(new Date()),
				sociallink1: null,
				sociallink2: null,
				sociallink3: null,
				contactreference: null,
				companyid: null,
				contactname: null
			}
		},

		onBeforeRendering: function () {
			var currentContext = this;
			this.model = currentContext.getView().getModel("viewModel");
		},

		getAllContacts: function () {
			let editContactModel = this.getView().getModel("editContactModel");
			contactService.getAllContacts(function (data) {
				if (data.length && data[0].length) {
					let lastid = (data[0].length) - 1;
					let nextid = (data[0][lastid].id) + 1;
					editContactModel.oData.contactid = nextid;
					editContactModel.refresh();
				} else {
					editContactModel.oData.contactid = 1;
					editContactModel.refresh();
				}
			});
		},

		handleContactList: function (sChannel, sEvent, oData) {

			this.model = oData.viewModel;

			if (this.model.id != undefined) {
				this.getView().byId("btnSave").setText("Update");
				this.getView().byId("convertBtn").setVisible(true);

				this.bindContactDetails(this.model.id);
			} else {
				this.getView().byId("btnSave").setText("Save");
				this.getView().byId("convertBtn").setVisible(false);
				let selRow = oData.viewModel;
				let editPartyModel = this.getView().getModel("editContactModel");
				editPartyModel.oData.contactid = selRow.nextid;
				editPartyModel.refresh();
			}

			// if (this.model.id != undefined) {
			// }else{
			// 	var oModel = new JSONModel();
			// 	oModel.setData(this.model);
			// 	this.getView().setModel(oModel, "editContactModel");
			// }

			this.id = this.model.id;
		},

		leadConversion: function (sChannel, sEvent, oData) {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.bus = sap.ui.getCore().getEventBus();
			oRouter.getTargets().display(oData.pagekey, { viewModel: oData.viewModel });
			oRouter.navTo(oData.pagekey, true);
		},

		convertToLead: function () {
			var viewModel = this.getView().getModel("editContactModel");
			var model = { "id": viewModel.oData.id }
			this.bus = sap.ui.getCore().getEventBus();

			console.log(model);
			setTimeout(function () {
				this.bus = sap.ui.getCore().getEventBus();
				this.bus.publish("converttolead", "leadConversion", { pagekey: "addlead", viewModel: model });
			}, 1000);

			this.bus.publish("converttolead", "leadConversion", { pagekey: "addlead", viewModel: model });
		},

		contactdetail: function (sChannel, sEvent, oData) {
			let selRow = oData.viewModel;
			let oThis = this;

			if (selRow.id != null) {

				if (selRow.action == "view") {
					oThis.getView().byId("btnSave").setEnabled(false);
				} else {
					oThis.getView().byId("btnSave").setEnabled(true);
				}

				oThis.bindContactDetails(selRow.id);

			}

			else {
				var oModel = new JSONModel();
				this.getView().setModel(oModel, "editContactModel");
			}

		},

		bindContactDetails: function (id) {
			var currentContext = this;
			var oModel = new JSONModel();
			if (id != undefined) {

				contactService.getContact({ id: id }, function (data) {
					oModel.setData(data[0][0]);
				});
				this.getView().byId("btnSave").setText("Update");

			}

			this.getView().setModel(oModel, "editContactModel");
			var oModel = this.getView().getModel("editContactModel");
		},

		fnShortCut: function () {
			var currentContext = this;
			$(document).keydown(function (event) {
				if (event.keyCode == 83 && (event.altKey)) {
					event.preventDefault();
					jQuery(document).ready(function ($) {
						currentContext.onSave()
					})
				}

				if (event.keyCode == 69 && (event.altKey)) {
					event.preventDefault();
					jQuery(document).ready(function ($) {
						currentContext.onCancel()
					})
				}

			});
		},

		onSave: function () {
			if (this.validateForm() == true) {
				var currentContext = this;
				var model = this.getView().getModel("editContactModel").oData;
				console.log("editContactModel", model);
				model["companyid"] = commonService.session("companyId");
				model["date"] = commonFunction.getDate(model.date);
				model["DOB"] = commonFunction.getDate(model.DOB);
				model["DOM"] = commonFunction.getDate(model.DOM);
				model["userid"] = commonService.session("userId");

				contactService.saveContact(model, function (data) {

					if (data.id > 0) {
						var message = model.id == null ? "Contact created successfully!" : "Contact edited successfully!";
						currentContext.onCancel();
						// currentContext.reset();
						MessageToast.show(message);
						currentContext.bus = sap.ui.getCore().getEventBus();
						currentContext.bus.publish("loaddata", "loadData");
					}

				});
			}
		},

		validateForm: function () {
			var email1 = this.getView().byId("email1").getValue();
			var emailp = this.getView().byId("emailp").getValue();
			var emailw = this.getView().byId("emailw").getValue();
			var isValid = true;
			let array=[];
			if (!commonFunction.isNumberWithMessage(this, "txtPinCode1", "correct pin is required!", 6)) {
				array.push(false);
			}
			 if (!commonFunction.isNumberWithMessage(this, "PinCodeR", "correct pin is required!", 6)) {
				array.push(false);
			}
			 if (email1 != "" && commonFunction.isEmail(this, "email1")) {
				array.push(false);
			}	
			 if (emailp != "" && commonFunction.isEmail(this, "emailp")) {
				array.push(false);
			}
			 if (emailw != "" && commonFunction.isEmail(this, "emailw")) {
				array.push(false);
			}
			 if (!commonFunction.isNumberWithMessage(this, "mobile1", "correct mobile no. is required!", 10)) {
				array.push(false);
			}
	         if (!commonFunction.isNumberWithMessage(this, "salescontact", "correct mobile no. is required!", 10)) {
				array.push(false);
			}
			 if (!commonFunction.isNumberWithMessage(this, "nicontact",  "correct mobile no. is required!", 10)) {
				array.push(false);
			}
			 if (!commonFunction.isNumberWithMessage(this, "eicontact", "correct mobile no. is required!", 10)) {
				array.push(false);
			}
			 if (!commonFunction.isNumberWithMessage(this, "mobilep", "correct mobile no. is required!", 10)) {
				array.push(false);
			}
			 if (!commonFunction.isNumberWithMessage(this, "mobilew", "correct mobile no. is required!", 10)) {
				array.push(false);
			}
			if (this.getView().byId("source1").getValue().length==0) {
				this.getView().byId("source1").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Contact Source required");
				array.push(false);
			} 
			else{
				this.getView().byId("source1").setValueState(sap.ui.core.ValueState.None);
			}
			if (this.getView().byId("source2").getValue().length==0) {
				this.getView().byId("source2").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Contact Source required");
				array.push(false);
			} 
			else{
				this.getView().byId("source2").setValueState(sap.ui.core.ValueState.None)
			}

			isValid=(array.length>0)?false:true;

			return isValid;
		},

		onNumberInputChange: function (oEvent) {

			var inputId = oEvent.mParameters.id;
			var inputValue = oEvent.mParameters.value;

			inputId = inputId.substring(inputId.lastIndexOf('-') + 1);

			if (inputId == "txtMobileNo") {

				if (inputValue != "")
					commonFunction.isNumber(this, inputId)
				else
					this.getView().byId("txtMobileNo").setValueState(sap.ui.core.ValueState.None);

			}
			else if (inputId == "txtPinCode") {

				if (inputValue != "")
					commonFunction.isNumber(this, inputId)
				else
					this.getView().byId("txtPinCode").setValueState(sap.ui.core.ValueState.None);
			}
			else if (inputId == "txtCreditPeriod") {

				if (inputValue != "")
					commonFunction.isNumber(this, inputId)
				else
					this.getView().byId("txtCreditPeriod").setValueState(sap.ui.core.ValueState.None);
			}
		},

		resourcebundle: function () {
			var currentContext = this;
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},

		onSiteStateChange: function () {
			var currentContext = this;
			let stateId = this.getView().getModel("editContactModel").oData.wstateid;
			let model = this.getView().getModel("partyCityModel").oData.modelData;

			let cityarray = [];
			model.map((a) => {
				if (a.stateid == stateId) {
					cityarray.push(a);
				}
			});
			this.getView().getModel("wCityModel").oData.modelData = cityarray;
			this.getView().getModel("wCityModel").refresh();

		},
		
		onResidentialStateChange: function () {
			var currentContext = this;
			let stateId = this.getView().getModel("editContactModel").oData.rstateid;
			let model = this.getView().getModel("partyCityModel").oData.modelData;

			let cityarray = [];
			model.map((a) => {
				if (a.stateid == stateId) {
					cityarray.push(a);
				}
			});
			this.getView().getModel("rCityModel").oData.modelData = cityarray;
			this.getView().getModel("rCityModel").refresh();


		},

		onDelete: function () {

			var currentContext = this;

			if (this.model.id != undefined) {

				var model = {
					id: this.model.id,
					companyid: commonFunction.session("companyId"),
					userid: commonFunction.session("userId")
				};

				MessageBox.confirm(
					"Are you sure you want to delete?", {

					styleClass: "sapUiSizeCompact",
					onClose: function (sAction) {
						if (sAction == "OK") {
						}
					}
				}
				);
			}
		},

		reset: function () {
			let oThis = this;
			var model = oThis.getView().getModel("editContactModel");
			model.setData([]);
			oThis.getView().setModel(model, "editContactModel");
		},

		onCancel: function () {
			this.reset();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("contactmaster");
		}
	});
}, true);
