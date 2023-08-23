sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/services/Masters/Location.service',
	'sap/ui/elev8rerp/componentcontainer/services/LeadManagement/Lead.service',
	'sap/ui/elev8rerp/componentcontainer/services/Masters/Contact.service',
	"sap/ui/elev8rerp/componentcontainer/services/LeadManagement/Quotation.service",

], function (JSONModel, BaseController, MessageToast, MessageBox, commonFunction, commonService, locationService, Leadservice, contactService,quotationService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.LeadManagement.AddLead", {
		onInit: function () {
			var currentContext = this;

			// currentContext.reset();
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("leaddetails", "newLead", this.leaddetails, this);
			this.bus.subscribe("leadscreen", "handleLeadList", this.handleLeadList, this);
			this.bus.subscribe("converttolead", "leadConversion", this.leadConversion, this);


			// bind Source dropdown
			commonFunction.getReferenceByType("LeadSrc", "leadSourceModel", this);

			// bind Pipeline dropdown
			commonFunction.getReferenceByType("Pipeline", "pipeLineModel", this);

			// bind Pipeline dropdown
			commonFunction.getReferenceByType("LeadStatus", "leadStatusModel", this);

			// bind Lead dropdown  LeadType
			commonFunction.getReferenceByType("LeadCtgry", "leadCategoryModel", this);

			// bind Lead subcategory dropdown
			commonFunction.getReferenceByType("LeadSubCtgry", "leadSubCategoryModel", this);

			// bind LeadType dropdown  
			commonFunction.getReferenceByType("LeadType", "leadTypeModel", this);

			// bind CntCtgry dropdown
			commonFunction.getReferenceByType("CntCtgry", "leadCntCategoryModel", this);

			// bind CntType dropdown
			commonFunction.getReferenceByType("CntType", "leadCntTypeModel", this);

			// bind LiftType dropdown
			commonFunction.getReferenceByType("LftTyp", "liftTypeModel", this);

			// bind capacity dropdown
			commonFunction.getReferenceByType("LftCpcty", "leadCapacityModel", this);

			// bind Machine dropdown
			commonFunction.getReferenceByType("LftMchn", "MachineModel", this);

			// bind Model dropdown
			commonFunction.getReferenceByTypemodel("LftMdl", "leadmodelModel", this);

			// bind Drive dropdown
			commonFunction.getReferenceByType("LftDrv", "leadDriveModel", this);

			// bind Control dropdown
			commonFunction.getReferenceByType("LftCtrl", "leadControlModel", this);

			// bind group Control dropdown
			commonFunction.getReferenceByType("LftGrpCtrl", "leadGroupControlModel", this);

			// bind Operation dropdown
			commonFunction.getReferenceByType("LftOprn", "leadOperationModel", this);

			// bind Speed dropdown
			commonFunction.getReferenceByType("LftSpd", "leadSpeedModel", this);

			// bind Door dropdown
			commonFunction.getReferenceByType("DrTyp", "leadDoorTypeModel", this);

			// bind landingDoorModel dropdown
			commonFunction.getReferenceByType("LdnDr", "landingDoorModel", this);

			// bind CarDoorModel dropdown
			commonFunction.getReferenceByType("CarDr", "CarDoorModel", this);

			// bind LowestFloorModel dropdown
			commonFunction.getReferenceByType("LwstFlrMking", "LowestFloorModel", this);

			// bind CWTPositionModel dropdown
			commonFunction.getReferenceByType("CWTPstn", "CWTPositionModel", this);

			// bind standaredFloorHeightModel dropdown
			commonFunction.getReferenceByType("StdFlrHt", "standaredFloorHeightModel", this);

			// bind Stage dropdown
			commonFunction.getReferenceByType("Stage", "stageModel", this);

			// bind AllOpeningSameSide dropdown
			commonFunction.getReferenceByType("AllOpeningSameSide", "openingSameSideModel", this);

			// bind frontopening dropdown
			commonFunction.getReferenceByType("FrontOpening", "frontOpeningModel", this);

			// bind backopening dropdown
			commonFunction.getReferenceByType("BackOpening", "backOpeningModel", this);

			// bind leftopening dropdown
			commonFunction.getReferenceByType("LeftOpening", "leftOpeningModel", this);

			// bind rightopening dropdown
			commonFunction.getReferenceByType("RightOpening", "rightOpeningModel", this);

			// bind car panel dropdown
			commonFunction.getReferenceByType("CarPanel", "carPanelModel", this);

			// bind false ceiling dropdown
			commonFunction.getReferenceByType("FlsCel", "falseCeilingModel", this);

			// bind ventilation dropdown
			commonFunction.getReferenceByType("Ventilation", "ventilationModel", this);

			// bind Floring dropdown
			commonFunction.getReferenceByType("Floring", "flooringModel", this);

			// bind car position indicator dropdown
			commonFunction.getReferenceByType("CrPsnIndcr", "carPositionIndicatorModel", this);

			// bind traction media dropdown
			commonFunction.getReferenceByType("TrcMedia", "tractionMediaModel", this);

			// bind main power system dropdown
			commonFunction.getReferenceByType("MnPwrSys", "mainPowerSystemModel", this);

			// bind auxilary supply system dropdown
			commonFunction.getReferenceByType("AuxSupSys", "auxilarySupplySystemModel", this);

			// bind unit dropdown
			commonFunction.getReferenceByType("Unit", "unitModel", this);

			// cind shaft condition model
			commonFunction.getReferenceByType("ShftCndtn", "shaftModel", this);

			// get all employees list 
			commonFunction.getEmployeeList(this);
			
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
				currentContext.getView().setModel(oModel, "partyCityModel");
				let Model = new sap.ui.model.json.JSONModel();
				currentContext.getView().setModel(Model, "cityModel");
				currentContext.getView().getModel("cityModel").oData=data[0];
			});

			var emptyModel = this.getModelDefault();
			var model = new JSONModel();
			model.setData(emptyModel);
			this.getView().setModel(model, "editPartyModel");

			this.getAllLeads();
		},

		getModelDefault: function () {
			return {
				id: null,
				leadname: null,
				companyname: null,
				leaddate: commonFunction.getDateFromDB(new Date()),
				sourceid: null,
				leadscategory: null,
				leadtype: null,
				stageid: null,
				email: null,
				phoneno: null,
				mobileno: null,
				contactperson: null,
				salesrep: null,
				leadvalue: null,
				leadscore: null,
				leadstatus: null,
				leaddescription: null,
				locationid: null,
				typeoflift: null,
				capacityid: null,
				modelid: null,
				driveid: null,
				machineid: null,
				controlid: null,
				operationid: null,
				speedid: null,
				typeofdoorid: null,
				landingdoorid: null,
				cardoorid: null,
				cwtpositionid: null,
				floorheaightid: null,
				architectidid: null,
				leadconsaltantid: null,
				nooflifts: null,
				cityid: null,
				stateid: null,
				countryid: null,
				pincode: null,
				isdeleted: 0
			}
		},

		getAllLeads : function(){
			let editPartyModel = this.getView().getModel("editPartyModel");
			Leadservice.getAllLeads(function (data) {
				if(data.length && data[0].length){
					let lastid = (data[0].length) - 1;
					let nextid = (data[0][lastid].id) + 1;
					editPartyModel.oData.leadid = nextid;
					editPartyModel.refresh();
				}else{
					editPartyModel.oData.leadid = 1;
					editPartyModel.refresh();
				}
			});
		},

		handleLeadList: function (sChannel, sEvent, oData) {
			let selRow = oData.viewModel;
			let editPartyModel = this.getView().getModel("editPartyModel");
			editPartyModel.oData.leadid = selRow.nextid;
			editPartyModel.refresh();

			if(selRow.id != undefined){
				this.getView().byId("btnSave").setText("Update");
			}else{
				this.getView().byId("btnSave").setText("Save");
			}
		},

		leaddetails: function (sChannel, sEvent, oData) {

			let selRow = oData.viewModel;
			let oThis = this;

			if (selRow != null) {

				if (selRow.action == "view") {
					oThis.getView().byId("btnSave").setEnabled(false);
				} else {
					oThis.getView().byId("btnSave").setEnabled(true);
				}

				oThis.bindLeadDetails(selRow.id);

			}else {
				// var oModel = new JSONModel();
				// this.getView().setModel(oModel, "editPartyModel");

				oThis.getAllLeads();
			}

		},

		onBeforeRendering: function () {
			var currentContext = this;
			this.model = currentContext.getView().getModel("viewModel");
		},

		leadConversion: function (sChannel, sEvent, oData) {
			let selRow = oData.viewModel;
			let oThis = this;
			oThis.getAllLeads();
			if (selRow != null) {
				oThis.convertToLead(selRow.id);
			}

			else {
				var oModel = new JSONModel();
				this.getView().setModel(oModel, "editPartyModel");
			}
		},

		convertToLead: function (id) {
			let oThis = this;
			var oModel = new JSONModel();
			if (id != undefined) {
				contactService.convertToLead({ id: id }, function (data) {
					if(data.length && data[0].length){
						oModel.setData(data[0][0]);
						oThis.getView().setModel(oModel, "editPartyModel");
					}
				});
			}
		},

		onclickstop: function(oEvent){
			let oThis = this;
			let stops=oEvent.mParameters.value;
			if(parseInt(stops)==stops){
			let travel= ((stops-1)*3)+1;
			var model = oThis.getView().getModel("editPartyModel");
			model.oData.travel=travel;
			model.refresh();
			}
			else{
				MessageToast.show("Please enter  valide Number of stop");
			}

		},

		bindLeadDetails: function (id) {
			var currentContext = this;
			var oModel = new JSONModel();
			if (id != undefined) {

				Leadservice.getLeads({ id: id }, function (data) {
					console.log(data[0][0]);
					data[0][0].preferedlead = data[0][0].preferedlead == 1 ? true : false;
					oModel.setData(data[0][0]);
					var addresses = data[1];

					if (addresses.length > 0) {

						currentContext.counter = addresses.length;

						for (var i = 0; i < addresses.length; i++) {
							var cnt = i + 1;
							currentContext.getView().byId("txtAddress" + cnt).setValue(addresses[i].address);
							currentContext.getView().byId("ddlCity" + cnt).setSelectedKey(addresses[i].cityid);
							currentContext.getView().byId("ddlState" + cnt).setSelectedKey(addresses[i].stateid);
							currentContext.getView().byId("ddlCountry" + cnt).setSelectedKey(addresses[i].countryid);
							currentContext.getView().byId("txtPinCode" + cnt).setValue(addresses[i].pincode);

							if (cnt > 1) {
								currentContext.getView().byId("containerCity" + cnt).setVisible(true);
								currentContext.getView().byId("containerState" + cnt).setVisible(true);
							}
						}
					}

				});
				this.getView().byId("btnSave").setText("Update");

			} else {
				// this.getView().byId("btnDelete").setVisible(false);
			}

			this.getView().setModel(oModel, "editPartyModel");
			var oModel = this.getView().getModel("editPartyModel");
		},

		onModelSelection: function (oEvent,id) {
			let oThis = this;
			var model = oThis.getView().getModel("editPartyModel").oData;
			model.modelid = id==undefined? model.modelid:id??null;
			quotationService.getReferenceBymodel({modelid:model.modelid}, function (data) {
			           	model.carheight=data[1][0].carheight;
						model.pitdepth=data[1][0].pitdepth;
						model.overhead=data[1][0].overhead;
				data[0].forEach(element => {
					if (element.typecode == "LftSpd") {
						 model.speedid=element.id;
					}
					else if (element.typecode == "LftMchn") {
						model.machineid=element.id ;
					}
				
					else if (element.typecode == "LftDrv") {
						model.driveid=element.id;
					}
					else if (element.typecode == "LftCtrl") {
						model.controlid=element.id;
					}
					else if (element.typecode == "LftOprn") {
						model.operationid=element.id;
					}
					else if (element.typecode == "DrTyp") {
						model.typeofdoorid=element.id;
					}
					else if (element.typecode == "LdnDr") {
						model.landingdoorid=element.id;
					}
					else if (element.typecode == "CarDr") {
						model.cardoorid=element.id;
					}
					else if (element.typecode == "LwstFlrMking") {
						model.lowestfloorid=element.id;
					}
					else if (element.typecode == "CWTPstn") {
						model.cwtpositionid=element.id;
					}
					else if (element.typecode == "ShftCndtn") {
						model.shaftconditionid=element.id;
					}
					else if (element.typecode == "Unit") {
						model.unitid=element.id;
					}
					else if (element.typecode == "AuxSupSys") {
						model.auxilarysupplysystemid=element.id;
					}
					else if (element.typecode == "MnPwrSys") {
						model.mainpowersystemid=element.id;

					}
					 else if (element.typecode == "TrcMedia") {
						model.tractionmediaid=element.id;
					} 
					else if (element.typecode == "CrPsnIndcr") {
						model.modelid=element.id;

					}
					 else if (element.typecode == "Floring") {
						model.modelid=element.id;
					}
					else if (element.typecode == "Ventilation") {
						model.modelid=element.id;

					}
					else if (element.typecode == "FlsCel") {
						model.modelid=element.id;

					}
					 else if (element.typecode == "CarPanel") {
						model.modelid=element.id;
					} 
					else if (element.typecode == "StdFlrHt") {
						model.modelid=element.id;

					}
					 else if (element.typecode == "null") {
						model.modelid=element.id;

					} 
					else if (element.typecode == "null") {
						model.modelid=element.id;

					}
					else if (element.typecode == "null") {
						model.modelid=element.id;

					}
					else if (element.typecode == "null") {
						model.modelid=element.id;

					}
					 else if (element.typecode == "null") {
						model.modelid=element.id;
					}
					else{
						model.modelid=element.id;

					}

				});
				oThis.getView().getModel("editPartyModel").refresh();

			});
			oThis.getView().getModel("editPartyModel").refresh();
		},
		handleSelectionFinish: function (oEvent) {
			var inputId = oEvent.mParameters.id;
			var id = inputId.substring(inputId.lastIndexOf('-') + 1);

			var selectedItems = oEvent.getParameter("selectedItems");
			var moduleids = "";

			for (var i = 0; i < selectedItems.length; i++) {

				moduleids += selectedItems[i].getKey();

				if (i != selectedItems.length - 1) {
					moduleids += ",";
				}
			}
			var model = this.getView().getModel("editPartyModel")
			model.oData.moduleid = moduleids;
		},

		handleSelectionChange: function () {
			this.getView().byId("ddlMtxtModuleNameodule").setValueState(sap.ui.core.ValueState.None);
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


		//Dialog for item
		handleItemValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			// if (!this._valueHelpDialog) {
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Common.ItemDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);
			// }
			this._valueHelpDialog.open(sInputValue);
		},

		_handleItemSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['itemcode', 'itemname'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		onSave: function () {
			//if (this.validateForm()) {
			var currentContext = this;
			var model = this.getView().getModel("editPartyModel").oData;
			console.log("model", model);


			model["companyid"] = commonService.session("companyId");
			model["leaddate"] = commonFunction.getDate(model.leaddate);
			model["userid"] = commonService.session("userId");

			Leadservice.saveLead(model, function (data) {

				if (data.id > 0) {
					var message = model.id == null ? "Lead created successfully!" : "Lead edited successfully!";
					currentContext.onCancel();
					MessageToast.show(message);
					currentContext.bus = sap.ui.getCore().getEventBus();
					currentContext.bus.publish("loadLeadEditdata", "loadLeadEditdata");
				}

			});
			//}
			this.reset();

		},

		validateForm: function () {
			var isValid = true;
			var source = this.getView().byId("sourceid").getSelectedKey();
			var pipeline = this.getView().byId("txtStageid").getSelectedKey();

			// var location = this.getView().byId("leadlocationid").getSelectedKey();
			var status = this.getView().byId("leadstatusid").getSelectedKey();

			var category = this.getView().byId("categoryid").getSelectedKey();

			var typeoflift = this.getView().byId("typeofliftid").getSelectedKey();

			// var emailId = this.getView().byId("txtEmailId").getValue();
			// var phoneNo = this.getView().byId("txtPhoneNo").getValue();

			if (!commonFunction.isRequired(this, "txtPartyName", "Please enter lead name."))
				isValid = false;

			if (!commonFunction.isRequired(this, "contactPerson", "Please enter contact person name."))
				isValid = false;

			// if (emailId != "") {
			// 	if (!commonFunction.isEmail(this, "txtEmailId"))
			// 		isValid = false;
			// } else if (!commonFunction.isRequired(this, "txtEmailId", "Please enter email ID."))
			// 	isValid = false;

			// else {
			// 	this.getView().byId("txtEmailId").setValueState(sap.ui.core.ValueState.None);
			// }


			// if (phoneNo != "") {
			// 	if (!commonFunction.isNumber(this, "txtPhoneNo"))
			// 		isValid = false;
			// }
			// else if (!commonFunction.isRequired(this, "txtPhoneNo", "Please enter phone no."))
			// 	isValid = false;

			// else {
			// 	this.getView().byId("txtPhoneNo").setValueState(sap.ui.core.ValueState.None);
			// }


			// check atleast one source is selected

			if (pipeline.length == 0) {
				this.getView().byId("txtStageid").setValueState(sap.ui.core.ValueState.Error)
					.setValueStateText("Please select atleast one Stage.");

				isValid = false;
			}

			if (source.length == 0) {
				this.getView().byId("sourceid").setValueState(sap.ui.core.ValueState.Error)
					.setValueStateText("Please select atleast one source.");

				isValid = false;
			}

			if (typeoflift.length == 0) {
				this.getView().byId("typeofliftid").setValueState(sap.ui.core.ValueState.Error)
					.setValueStateText("Please select atleast one lift Type.");

				isValid = false;
			}

			// if (location.length == 0) {
			// 	this.getView().byId("leadlocationid").setValueState(sap.ui.core.ValueState.Error)
			// 		.setValueStateText("Please select atleast one location.");

			// 	isValid = false;
			// }
			if (status.length == 0) {
				this.getView().byId("leadstatusid").setValueState(sap.ui.core.ValueState.Error)
					.setValueStateText("Please select atleast one status.");

				isValid = false;
			}
			if (category.length == 0) {
				this.getView().byId("categoryid").setValueState(sap.ui.core.ValueState.Error)
					.setValueStateText("Please select atleast one category.");

				isValid = false;
			}

			return isValid;
		},

		onSiteStateChange: function () {
			var currentContext = this;
			let stateId = this.getView().getModel("editPartyModel").oData.stateid;

			let model = this.getView().getModel("partyCityModel").oData.modelData;

			let cityModel=this.getView().getModel("cityModel").oData;


			let cityarray = [];
			cityModel.map((a) => {
				if (a.stateid == stateId) {
					cityarray.push(a);
				}
			});
			this.getView().getModel("partyCityModel").oData.modelData = cityarray;
			this.getView().getModel("partyCityModel").refresh();

		},

		onPartyNameChange: function (oEvent) {
			var inputValue = oEvent.mParameters.value;
			if (inputValue != "")
				this.getView().byId("txtPartyName").setValueState(sap.ui.core.ValueState.None);

		},

		onEmailChange: function (oEvent) {

			var emailId = oEvent.mParameters.value

			if (emailId != "") {
				commonFunction.isEmail(this, "txtEmailId")
			}
			else {
				this.getView().byId("txtEmailId").setValueState(sap.ui.core.ValueState.None)
			}
		},

		onNumberInputChange: function (oEvent) {

			var inputId = oEvent.mParameters.id;
			var inputValue = oEvent.mParameters.value;

			inputId = inputId.substring(inputId.lastIndexOf('-') + 1);

			if (inputId == "txtMobileNo") {

				if (inputValue != "")
					commonFunction.isNumber(this, "txtMobileNo")
				else
					this.getView().byId("txtMobileNo").setValueState(sap.ui.core.ValueState.None);

			}
			else if (inputId == "txtPinCode") {

				if (inputValue != "")
					commonFunction.isNumber(this, "txtPinCode")
				else
					this.getView().byId("txtPinCode").setValueState(sap.ui.core.ValueState.None);
			}
			else if (inputId == "txtCreditPeriod") {

				if (inputValue != "")
					commonFunction.isNumber(this, "txtCreditPeriod")
				else
					this.getView().byId("txtCreditPeriod").setValueState(sap.ui.core.ValueState.None);
			}
		},

		resourcebundle: function () {
			var currentContext = this;
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},

		onDecimalInputChange: function (oEvent) {
			var inputValue = oEvent.mParameters.value;

			if (inputValue != "")
				commonFunction.isDecimal(this, "txtCreditLimit")
			else
				this.getView().byId("txtCreditLimit").setValueState(sap.ui.core.ValueState.None);
		},

		resourcebundle: function () {
			var currentContext = this;
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},

		selectModel : function(oEvent){
			console.log("oEvent : ",oEvent);

			let modelid = this.getView().byId("modelid").getSelectedItem()
			.mProperties.key;

			console.log("modelid : ",modelid);
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
			var model = oThis.getView().getModel("editPartyModel");
			model.setData([]);
			oThis.getView().setModel(model, "editPartyModel");
		},

		onCancel: function () {
			this.reset();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("leads");
		}
	});
}, true);
