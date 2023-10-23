sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/services/Masters/Location.service',
	'sap/ui/elev8rerp/componentcontainer/services/LeadManagement/Lead.service',
	'sap/ui/elev8rerp/componentcontainer/services/LeadManagement/Order.service',
	'sap/ui/elev8rerp/componentcontainer/services/LeadManagement/Quotation.service'
], function (JSONModel, BaseController, MessageToast, MessageBox, commonFunction, commonService, locationService, leadService, orderService, quotationService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.LeadManagement.AddOrder", {
		onInit: function () {
			var currentContext = this;

			// currentContext.reset();
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("orderscreen", "newOrder", this.orderDetail, this);
			this.bus.subscribe("orderdetail", "handleOrderDetails", this.handleOrderDetails, this);
			this.bus.subscribe("addOrder", "addOrderdetail", this.handleOrderDetails, this);// redirection from order detail screen  to 
			this.bus.subscribe("converttoorder", "orderConversion", this.orderConversion, this);

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

			// bind LiftType dropdown
			commonFunction.getReferenceByType("LftTyp", "liftTypeModel", this);

			// bind capacity dropdown
			commonFunction.getReferenceByType("LftCpcty", "leadCapacityModel", this);

			// bind Machine dropdown
			commonFunction.getReferenceByType("LftMchn", "MachineModel", this);

			// bind Model dropdown
			commonFunction.getReferenceByType("LftMdl", "leadmodelModel", this);

			// bind Drive dropdown
			commonFunction.getReferenceByType("LftDrv", "leadDriveModel", this);

			// bind Control dropdown
			commonFunction.getReferenceByType("LftCtrl", "leadControlModel", this);

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

			// bind Pipeline dropdown
			commonFunction.getReferenceByType("LeadStatus", "leadStatusModel", this);

			// bind standaredFloorHeightModel dropdown
			commonFunction.getReferenceByType("StdFlrHt", "standaredFloorHeightModel", this);

			// bind Stage dropdown
			commonFunction.getReferenceByType("Stage", "stageModel", this);

			// bind AllOpeningSameSide dropdown
			commonFunction.getReferenceByType("AllOpeningSameSide", "openingSameSideModel", this);

			// bind front Opening dropdown
			commonFunction.getReferenceByType("FrontOpening", "frontOpeningModel", this);

			// bind back opening dropdown
			commonFunction.getReferenceByType("BackOpening", "backOpeningModel", this);

			// bind left opening dropdown
			commonFunction.getReferenceByType("LeftOpening", "leftOpeningModel", this);

			// bind right opening dropdown
			commonFunction.getReferenceByType("RightOpening", "rightOpeningModel", this);

			// bind order status dropdown
			commonFunction.getReferenceByType("OrdSts", "statusModel", this);

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

			// bind Group control 
			commonFunction.getReferenceByType("LftGrpCtrl", "leadGroupControlModel", this);

			// Purchase Order - Placeholders
			commonFunction.getNotificationPlaceholders(this, 29);

			// get Sale Manager and Sale Executive
			commonFunction.getUser(this,'2,3');

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
				currentContext.getView().setModel(oModel, "partyCityModel");
				currentContext.setModelDefault();

			});

			var emptyModel = this.getModelDefault();
			var model = new JSONModel();
			model.setData({statusing:true});
			this.getView().setModel(model, "editOrderModel");

			var pdfModel = new JSONModel();
			pdfModel.setData([]);
			this.getView().setModel(pdfModel, "pdfModel");

			var previousModel = new JSONModel();
			previousModel.setData([]);
			this.getView().setModel(previousModel, "previousModel");

			this.imagepath = null;
			this.toDataURL('../images/snehaelev8r.png', function (dataUrl) {
				currentContext.imagepath = dataUrl;
			});

			// get all Company Details  
			this.companyname = commonFunction.session("companyname");
			this.companycontact = commonFunction.session("companycontact");
			this.companyemail = commonFunction.session("companyemail");
			this.address = commonFunction.session("address");
			this.city = commonFunction.session("city");
			this.pincode = commonFunction.session("pincode");

			this.getAllOrders();
		},

		setModelDefault: function () {

			let  lead= this.getView().getModel("editOrderModel").oData;

			lead["quotevalue"] = lead["quotevalue"] == null ? 0 :parseFloat(lead.quotevalue) ;
			lead["nooflifts"] =lead["nooflifts"] == null ? 0:parseInt(lead.nooflifts) ;
			lead["leadscore"]=lead["leadscore"] == null ? 0:parseFloat(lead.leadscore) ;
			lead["winprobability"]=lead["winprobability"] == null ? 0:(lead.winprobability) ;
			lead["stopsid"]=lead["stopsid"] == null ? 0:parseInt(lead.stopsid) ;
			lead["floormarking"]=lead["floormarking"] == null ? 0:parseFloat(lead.floormarking) ;
			lead["shaftwidth"] =lead["shaftwidth"] == null ? 0:parseFloat(lead.shaftwidth) ;
			lead["shaftdepth"]=lead["shaftdepth"] == null ?0: parseFloat(lead.shaftdepth) ;
			lead["cardepth"]=lead["cardepth"] == null ? 0:parseFloat(lead.cardepth) ;
			lead["carwidth"]=lead["carwidth"] == null ? 0:parseFloat(lead.carwidth) ;
			lead["carheight"]=lead["carheight"] == null ? 0:parseFloat(lead.carheight) ;
			lead["doorwidth"]=lead["doorwidth"] == null ? 0:parseFloat(lead.doorwidth) ;
			lead["doorheight"]=lead["doorheight"] == null ?0: parseFloat(lead.doorheight) ;
			lead["travel"]=lead["travel"] == null ?0: parseFloat(lead.travel) ;
			lead["pitdepth"]=lead["pitdepth"] == null ? 0:parseFloat(lead.pitdepth) ;
			lead["overhead"]=lead["overhead"] == null ? 0:parseFloat(lead.overhead) ;
			lead["mrwidth"]=lead["mrwidth"] == null ? 0:parseFloat(lead.mrwidth) ;
			lead["mrdepth"]=lead["mrdepth"] == null ? 0:parseFloat(lead.mrdepth) ;
			lead["mrheight"]=lead["mrheight"] == null ? 0:parseFloat(lead.mrheight) ;
			lead["quotescore"]=lead["quotescore"] == null ? 0:parseFloat(lead.quotescore) ;
			lead["completiondays"]=lead["completiondays"] == null ? 0:parseFloat(lead.completiondays) ;
			lead["oncustomerhandover"]=lead["oncustomerhandover"] == null ? 5:parseFloat(lead.oncustomerhandover) ;
			lead["advanceonorderreception"]=lead["advanceonorderreception"] == null ? 10:parseFloat(lead.advanceonorderreception) ;
			lead["forrequestofmechanicalmaterial"]=lead["forrequestofmechanicalmaterial"] == null ? 60:parseFloat(lead.forrequestofmechanicalmaterial) ;
			lead["forrequestofelectricalmaterial"]=lead["forrequestofelectricalmaterial"] == null ? 25:parseFloat(lead.forrequestofelectricalmaterial) ;
			lead["oncustomerhandover"]=lead["oncustomerhandover"] == null ? 5:parseFloat(lead.oncustomerhandover) ;



			this.getView().getModel("editOrderModel").refresh()
		},

		getModelDefault: function () {
			return {
				id: null,
				leadname: null,
				companyname: null,
				orderdate: commonFunction.getDateFromDB(new Date()),
				sourceid: null,
				leadscategory: null,
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
				pincode: null
			}
		},

		setModelDefault: function () {

			let  lead= this.getView().getModel("editOrderModel").oData;

			lead["quotevalue"] = lead["quotevalue"] == null ? 0 :parseFloat(lead.quotevalue) ;
			lead["nooflifts"] =lead["nooflifts"] == null ? 0:parseInt(lead.nooflifts) ;
			lead["leadscore"]=lead["leadscore"] == null ? 0:parseFloat(lead.leadscore) ;
			lead["winprobability"]=lead["winprobability"] == null ? 0:(lead.winprobability) ;
			lead["stopsid"]=lead["stopsid"] == null ? 0:parseInt(lead.stopsid) ;
			lead["floormarking"]=lead["floormarking"] == null ? 0:parseFloat(lead.floormarking) ;
			lead["shaftwidth"] =lead["shaftwidth"] == null ? 0:parseFloat(lead.shaftwidth) ;
			lead["shaftdepth"]=lead["shaftdepth"] == null ?0: parseFloat(lead.shaftdepth) ;
			lead["cardepth"]=lead["cardepth"] == null ? 0:parseFloat(lead.cardepth) ;
			lead["carwidth"]=lead["carwidth"] == null ? 0:parseFloat(lead.carwidth) ;
			lead["carheight"]=lead["carheight"] == null ? 0:parseFloat(lead.carheight) ;
			lead["doorwidth"]=lead["doorwidth"] == null ? 0:parseFloat(lead.doorwidth) ;
			lead["doorheight"]=lead["doorheight"] == null ?0: parseFloat(lead.doorheight) ;
			lead["travel"]=lead["travel"] == null ?0: parseFloat(lead.travel) ;
			lead["pitdepth"]=lead["pitdepth"] == null ? 0:parseFloat(lead.pitdepth) ;
			lead["overhead"]=lead["overhead"] == null ? 0:parseFloat(lead.overhead) ;
			lead["mrwidth"]=lead["mrwidth"] == null ? 0:parseFloat(lead.mrwidth) ;
			lead["mrdepth"]=lead["mrdepth"] == null ? 0:parseFloat(lead.mrdepth) ;
			lead["mrheight"]=lead["mrheight"] == null ? 0:parseFloat(lead.mrheight) ;
			lead["quotescore"]=lead["quotescore"] == null ? 0:parseFloat(lead.quotescore) ;
			lead["completiondays"]=lead["completiondays"] == null ? 0:parseFloat(lead.completiondays) ;
			lead["oncustomerhandover"]=lead["oncustomerhandover"] == null ? 5:parseFloat(lead.oncustomerhandover) ;
			lead["advanceonorderreception"]=lead["advanceonorderreception"] == null ? 10:parseFloat(lead.advanceonorderreception) ;
			lead["forrequestofmechanicalmaterial"]=lead["forrequestofmechanicalmaterial"] == null ? 60:parseFloat(lead.forrequestofmechanicalmaterial) ;
			lead["forrequestofelectricalmaterial"]=lead["forrequestofelectricalmaterial"] == null ? 25:parseFloat(lead.forrequestofelectricalmaterial) ;
			lead["oncustomerhandover"]=lead["oncustomerhandover"] == null ? 5:parseFloat(lead.oncustomerhandover) ;



			this.getView().getModel("editOrderModel").refresh()
		},


		onBeforeRendering: function () {
			var currentContext = this;
			this.model = currentContext.getView().getModel("viewModel");
			currentContext.getAllOrders();
		},

		toDataURL: function (url, callback) {
			var xhr = new XMLHttpRequest();
			xhr.onload = function () {
				var reader = new FileReader();
				reader.onloadend = function () {
					callback(reader.result);
				}
				reader.readAsDataURL(xhr.response);
			};
			xhr.open('GET', url);
			xhr.responseType = 'blob';
			xhr.send();
		},

		getAllOrders: function () {
			let editOrderModel = this.getView().getModel("editOrderModel");
			orderService.getAllOrders(function (data) {
				if (data.length && data[0].length) {
					let lastid = (data[0].length) - 1;
					let nextid = (data[0][lastid].id) + 1;
					editOrderModel.oData.orderid = nextid;
					editOrderModel.refresh();
				} else {
					editOrderModel.oData.orderid = 1;
					editOrderModel.refresh();
				}
			});
		},

		orderConversion: function (sChannel, sEvent, oData) {
			let selRow = oData.viewModel;
			let oThis = this;
			oThis.getAllOrders();
			console.log(selRow);

			if (selRow != null) {

				oThis.convertToOrder(selRow.quoteid);

			}

			else {
				var oModel = new JSONModel();
				this.getView().setModel(oModel, "editOrderModel");
			}
		},

		convertToOrder: function (id) {
			console.log(id);
			var oModel = new JSONModel();
			if (id != undefined) {

				quotationService.convertToOrder({ id: id }, function (data) {
					if (data.length && data[0].length) {
						data[0][0].orderid = parseInt(data[0][0].lastorderid) + 1;
						oModel.setData(data[0][0]);
					}
				});

			}

			this.getView().setModel(oModel, "editOrderModel");
			var oModel = this.getView().getModel("editOrderModel");
		},

		handleOrderDetails: function (sChannel, sEvent, oData) {
			let selRow = oData.viewModel;
			let oThis = this;

			if (selRow != null) {

				oThis.getView().byId("pdf").setVisible(true);

				if (selRow.action == "view") {
					oThis.getView().byId("btnSave").setEnabled(true);
				} else {
					oThis.getView().byId("btnSave").setEnabled(true);
				}

				oThis.bindOrderDetails(selRow.id);

				oThis.getPDFDetails(selRow.id);

			}

			else {
				var oModel = new JSONModel();
				oModel.setData({statusing : true});
				this.getView().setModel(oModel, "editOrderModel");
				oThis.setModelDefault()
				oThis.getView().byId("pdf").setVisible(false);
				oThis.setModelDefault();
			}

		},

		bindOrderDetails: function (id) {
			var currentContext = this;
			var oModel = new JSONModel();
			if (id != undefined) {

				orderService.getOrder({ id: id }, function (data) {
					data[0][0].statusing=data[0][0]["status"]=='Confirmed'? false : true;
					oModel.setData(data[0][0]);
				});
				this.getView().byId("btnSave").setText("Update");

			}
			else{
			}

			this.getView().setModel(oModel, "editOrderModel");
			var oModel = this.getView().getModel("editOrderModel");
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
			var model = this.getView().getModel("editOrderModel")
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
			// if (this.validateForm()) {
			var currentContext = this;
			var model = this.getView().getModel("editOrderModel").oData;
			console.log("editOrderModel", model);
			model["companyid"] = commonService.session("companyId");
			model["orderdate"] = commonFunction.getDate(model.orderdate);
			model["userid"] = commonService.session("userId");
			model["status"] = currentContext.getView().byId("statusid").getSelectedItem().mProperties.text; 
			let callService =model["revisions"]==null?"saveOrder":"saveOrderRevisions";


			if(model["status"]=="Confirmed"){
				model["revisions"]=model["revisions"]==null?model.quotevalue:model.revisions.concat(",",model.quotevalue);
			}
			else{
				model["revisions"]=null;
			}

			console.log("------------OrderModel-------------",model);

			orderService[callService](model, function (data) {
				console.log("----order save data---------",data);
				console.log("----model---------",model)

				if (data[3][0].id != null) {
					var message = model.id == null ? "Order created successfully!" : "Order edited successfully!";
					currentContext.onCancel();
					MessageToast.show(message);
					currentContext.bus = sap.ui.getCore().getEventBus();
					currentContext.bus.publish("loadorderdata", "loadOrderData");
				}

				if(model["status"]=="Confirmed"){
					debugger;
					var histroydata = {
						orderno: model.id,
						transactionid : model.id,
						orderdate:commonFunction.getDate(model.orderdate),
						username: commonService.session("userName"),
						quotename : model.quotename,
						leadname : model.leadname,
						orderamount:model.quotevalue,
						jobcode:data[4][0].jobid == null ? '-' : data[4][0].jobid
					}
					commonFunction.sendTransNotification(currentContext,29,histroydata);
				}
				
			});


		
			// }
			//this.reset();

		},

		validateForm: function () {
			var isValid = true;
			// var source = this.getView().byId("sourceid").getSelectedKey();
			// var pipeline = this.getView().byId("txtStageid").getSelectedKey();

			// var location = this.getView().byId("leadlocationid").getSelectedKey();
			// var status = this.getView().byId("leadstatusid").getSelectedKey();

			// var category = this.getView().byId("categoryid").getSelectedKey();

			// var typeoflift = this.getView().byId("typeofliftid").getSelectedKey();

			// var emailId = this.getView().byId("txtEmailId").getValue();
			// var phoneNo = this.getView().byId("txtPhoneNo").getValue();

			// if (!commonFunction.isRequired(this, "txtPartyName", "Please enter lead name."))
			// 	isValid = false;

			// if (!commonFunction.isRequired(this, "contactPerson", "Please enter contact person name."))
			// 	isValid = false;

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

			// if (pipeline.length == 0) {
			// 	this.getView().byId("txtStageid").setValueState(sap.ui.core.ValueState.Error)
			// 		.setValueStateText("Please select atleast one Stage.");

			// 	isValid = false;
			// }

			// if (source.length == 0) {
			// 	this.getView().byId("sourceid").setValueState(sap.ui.core.ValueState.Error)
			// 		.setValueStateText("Please select atleast one source.");

			// 	isValid = false;
			// }

			// if (typeoflift.length == 0) {
			// 	this.getView().byId("typeofliftid").setValueState(sap.ui.core.ValueState.Error)
			// 		.setValueStateText("Please select atleast one lift Type.");

			// 	isValid = false;
			// }

			// if (location.length == 0) {
			// 	this.getView().byId("leadlocationid").setValueState(sap.ui.core.ValueState.Error)
			// 		.setValueStateText("Please select atleast one location.");

			// 	isValid = false;
			// }
			// if (status.length == 0) {
			// 	this.getView().byId("leadstatusid").setValueState(sap.ui.core.ValueState.Error)
			// 		.setValueStateText("Please select atleast one status.");

			// 	isValid = false;
			// }
			// if (category.length == 0) {
			// 	this.getView().byId("categoryid").setValueState(sap.ui.core.ValueState.Error)
			// 		.setValueStateText("Please select atleast one category.");

			// 	isValid = false;
			// }


		
			if (!commonFunction.isNumbermessage(this, "txtnooflifts", "please enter valid no of lift!")) {  
				isValid = false;
			}
			if (!commonFunction.isNumbermessage(this, "txtstopid", "please enter valid stop!")) {
				isValid = false;
			}
			if (!commonFunction.isNumbermessage(this, "quotescore", "please enter valid quote score!")) {
				isValid = false;
			}
			if (!commonFunction.isNumbermessage(this, "txtfloormarking", "please enter valid floor marking!")) {
				isValid = false;
			}
			if (!commonFunction.isNumbermessage(this, "txtshaftwidth", "please enter valid shaft width!")) {
				isValid = false;
			}
			if (!commonFunction.isNumbermessage(this, "txtshaftdepth", "please enter valid shaft depth!")) {
				isValid = false;
			}
			if (!commonFunction.isNumbermessage(this, "txtmrwidth", "please enter valid mr width!")) {
				isValid = false;
			}
			if (!commonFunction.isNumbermessage(this, "txtmrdepth", "please enter valid mr depth!")) {
				isValid = false;
			}
			if (!commonFunction.isNumbermessage(this, "txtmrheight", "please enter valid mr height!")) {
				isValid = false;
			}
			if (!commonFunction.isNumbermessage(this, "txtcardepth", "please enter valid car depth!")) {
				isValid = false;
			}
			if (!commonFunction.isNumbermessage(this, "txtcarwidth", "please enter valid car width!")) {
				isValid = false;
			}
			if (!commonFunction.isNumbermessage(this, "txtcarheight", "please enter valid car height!")) {
				isValid = false;
			}
			if (!commonFunction.isNumbermessage(this, "txtdoorwidth", "please enter valid door width!")) {
				isValid = false;
			}
			if (!commonFunction.isNumbermessage(this, "txtdoorheight", "please enter valid door height!")) {
				isValid = false;
			}
			if (!commonFunction.isNumbermessage(this, "txttravel", "please enter valid travel !")) {
				isValid = false;
			}
			if (!commonFunction.isNumbermessage(this, "txtpitdepth", "please enter valid pit depth!")) {
				isValid = false;
			}
			if (!commonFunction.isNumbermessage(this, "txtoverhead", "please enter valid overhead value!")) {  
				isValid = false;
			}
			if (!commonFunction.isNumbermessage(this, "txtQutationValue", "please enter valid quote value!")) {
				isValid = false;
			}

			return isValid;
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
			var model = oThis.getView().getModel("editOrderModel");
			model.setData([]);
			oThis.getView().setModel(model, "editOrderModel");

			// let oQutationModel = oThis.getView().getModel("editOrderModel");
			// console.log("---------------After Save oLeadDetailnModel---------------",oQutationModel);

			//     oQutationModel.oData.leadname = "",
			// 	oQutationModel.oData.companyname = "",
			// 	oQutationModel.oData.quotedate = "",
			// 	oQutationModel.oData.sourceid = "4",
			// 	oQutationModel.oData.leadscategory = "49",
			// 	oQutationModel.oData.stageid = "14",
			// 	oQutationModel.oData.email = "",
			// 	oQutationModel.oData.phoneno = "",
			// 	oQutationModel.oData.mobileno = "",
			// 	oQutationModel.oData.contactperson = "",
			// 	oQutationModel.oData.salesrep = "",
			// 	oQutationModel.oData.leadvalue = "",
			// 	oQutationModel.oData.leadscore = "",
			// 	oQutationModel.oData.leadstatus = "46",
			// 	oQutationModel.oData.leaddescription = "",
			// 	oQutationModel.oData.locationid = "1",
			// 	oQutationModel.oData.typeoflift = "67",
			// 	oQutationModel.oData.capacityid = "68",
			// 	oQutationModel.oData.modelid = "71",
			// 	oQutationModel.oData.driveid = "72",
			// 	oQutationModel.oData.machineid = "83",
			// 	oQutationModel.oData.controlid = "73",
			// 	oQutationModel.oData.operationid = "74",
			// 	oQutationModel.oData.speedid = "75",
			// 	oQutationModel.oData.typeofdoorid = "76",
			// 	oQutationModel.oData.landingdoorid = "77",
			// 	oQutationModel.oData.cardoorid = "78",
			// 	oQutationModel.oData.lowestfloorid = "79",
			// 	oQutationModel.oData.cwtpositionid = "80",
			// 	oQutationModel.oData.floorheaightid = "82",
			// 	oQutationModel.oData.architectidid = "58",
			// 	oQutationModel.oData.leadconsaltantid = "51",
			// 	oQutationModel.oData.nooflifts = "",
			// 	oQutationModel.oData.cityid = "1",
			// 	oQutationModel.oData.stateid = "1",
			// 	oQutationModel.oData.countryid = "1",
			// 	oQutationModel.oData.pincode = "",
			// 	oQutationModel.oData.stopsid = "2",
			// 	oQutationModel.oData.floormarking = "",
			// 	oQutationModel.oData.allopeningsameside = "111",
			// 	oQutationModel.oData.frontopening = "113",
			// 	oQutationModel.oData.backopening = "116",
			// 	oQutationModel.oData.leftopening = "118",
			// 	oQutationModel.oData.rightopening = "120",
			// 	oQutationModel.oData.shaftwidth = "",
			// 	oQutationModel.oData.shaftdepth = "",
			// 	oQutationModel.oData.cardepth = "2",
			// 	oQutationModel.oData.carwidth = "82",
			// 	oQutationModel.oData.carheight = "58",
			// 	oQutationModel.oData.doorwidth = "51",
			// 	oQutationModel.oData.doorheight = "0",
			// 	oQutationModel.oData.travel = "",
			// 	oQutationModel.oData.pitdepth = "0",
			// 	oQutationModel.oData.overhead = "0",
			// 	oQutationModel.oData.mrwidth = "0",
			// 	oQutationModel.oData.mrdepth = "0",
			// 	oQutationModel.oData.mrheight = "0",
			// 	oQutationModel.oData.companyname = "",


			// oQutationModel.refresh();
		},

		getPDFDetails : function(id){
			let oThis = this;
			let pdfModel = oThis.getView().getModel("pdfModel");

			let previousModel = oThis.getView().getModel("previousModel");

			orderService.getOrderPDF({id : id}, function(data){
				if(data.length && data[0].length){
					pdfModel.setData(data[0][0]);
					oThis.getView().setModel(pdfModel,"pdfModel");
				}
				if(data.length && data[1].length){
					previousModel.setData(data[1][0]);
					oThis.getView().setModel(previousModel,"previousModel");
				}
			})
		},

		onPdfExport : function(){
			var fullHtml = "";
			var headertable1 = "";
			headertable1 += "<!DOCTYPE html> <html> <head> <title>" + "Order" + "</title>" +
				"<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js'></script>" +
				"<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.22/pdfmake.min.js'></script>" +
				"<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.62/vfs_fonts.js'></script>" +
				"<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js'></script>" +
				"<style type='text/css'>" +
				"table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%; } td, th {border: 1px solid #000;text-align: left;padding: 5px; } th, td {width: 100px;overflow: hidden; } img { width: 180px; height: 120px; text-align: center; } </style> </head>";

			headertable1 += "<body id='tblCustomers' class='amin-logo'>";
			headertable1 += "</body>";
			headertable1 += "<script>";

			var phone = (this.companycontact === null || this.companycontact == undefined) ? "-" : this.companycontact;
			var email = (this.companyemail === null || this.companyemail == undefined) ? "-" : this.companyemail;
			var address = (this.address === null || this.address == undefined) ? "-" : this.address;
			var city = (this.city === null || this.city == undefined) ? "-" : this.city;
			var pincode = (this.pincode === null || this.pincode == undefined) ? "-" : this.pincode;
			var companyname = this.companyname;
			
			let pdfModel = this.getView().getModel("pdfModel");
			let previousModel = this.getView().getModel("previousModel");

			var array = [];
			//Availabls vaules are dynamic and other values are static need to discuss about static values
			array.push({
				name: "TYPE",
				value: pdfModel.oData.model,
				previousvalue : previousModel.oData.model
			}, {
				name: "CAPACITY",
				value: pdfModel.oData.capacity,
				previousvalue : previousModel.oData.capacity
			}, {
				name: "SPEED",
				value: pdfModel.oData.speed,
				previousvalue : previousModel.oData.speed
			},
			{
				name: "RISE (M) (Approximately)",
				value: pdfModel.oData.travel,
				previousvalue : previousModel.oData.travel
			},
			{
				name: "STOPS",
				value: pdfModel.oData.stop+"Landings/"+pdfModel.oData.stop+"Openings (All Openings are same Side)",// "7 Landings / 7 Openings (All Openings are same Side)",
				previousvalue : previousModel.oData.stop+"Landings/"+previousModel.oData.stop+"Openings (All Openings are same Side)"
			},
			{
				name: "CONTROLLER",
				value: pdfModel.oData.control,
				previousvalue : previousModel.oData.control
			},
			{
				name: "DRIVE",
				value: pdfModel.oData.drive,
				previousvalue : previousModel.oData.drive
			},
			{
				name: "SHAFT SIZE",
				value: pdfModel.oData.shaftsize,
				previousvalue : previousModel.oData.shaftsize
			},
			{
				name: "CAR SIZE",
				value: pdfModel.oData.carsize,
				previousvalue : previousModel.oData.carsize
			},
			{
				name: "CLEAR OPENING",
				value: pdfModel.oData.clearopening,
				previousvalue : previousModel.oData.clearopening
			},
			{
				name: "PIT DEPTH",
				value: pdfModel.oData.pitdepth,
				previousvalue : previousModel.oData.pitdepth
			},
			{
				name: "OVER HEAD",
				value: pdfModel.oData.overhead,
				previousvalue : previousModel.oData.overhead
			},
			{
				name: "CAR PANEL",
				value: pdfModel.oData.carpanel,
				previousvalue : previousModel.oData.carpanel
			},
			{
				name: "CAR DOOR",
				value: pdfModel.oData.cardoor,
				previousvalue : previousModel.oData.cardoor
			},
			{
				name: "LANDING DOOR",
				value: pdfModel.oData.landingdoor,
				previousvalue : previousModel.oData.landingdoor
			},
			{
				name: "FALSE CEILING",
				value: pdfModel.oData.falseceiling,
				previousvalue : previousModel.oData.falseceiling
			},
			{
				name: "VENTILATION",
				value: pdfModel.oData.ventilation,
				previousvalue : previousModel.oData.ventilation
			},
			{
				name: "FLOORING",
				value: pdfModel.oData.flooring,
				previousvalue : previousModel.oData.flooring
			},
			{
				name: "C.O.P",
				value: "S.S Push Buttons",
				previousvalue : "S.S Push Buttons"
			},

			{
				name: "CAR POSITION INDICATOR",
				value: pdfModel.oData.carpositionindicator,
				previousvalue : previousModel.oData.carpositionindicator
			},
			{
				name: "MACHINE",
				value: pdfModel.oData.machine,
				previousvalue : previousModel.oData.machine
			},
			{
				name: "TRACTION MEDIA",
				value: pdfModel.oData.tractionmedia,
				previousvalue : previousModel.oData.tractionmedia
			},
			{
				name: "TYPE OF OPERATION",
				value: pdfModel.oData.operation,
				previousvalue : previousModel.oData.operation
			},
			{
				name: "MAIN POWER SYSTEM",
				value: pdfModel.oData.mainpowersystem,
				previousvalue : previousModel.oData.mainpowersystem
			},
			{
				name: "AUXILARY SUPPLY SYSTEM",
				value: pdfModel.oData.auxilarysupplysystem,
				previousvalue : previousModel.oData.auxilarysupplysystem
			},
		);

		console.log("Array : ",array);

			headertable1 += "html2canvas($('#tblCustomers')[0], {" +
				"onrendered: function (canvas) {" +
				"var data = canvas.toDataURL();" +
				"var width = canvas.width;" +
				"var height = canvas.height;" +
				"var docDefinition = {" +
				"pageMargins: [ 40, 20, 40, 60 ]," +
				"content: [";
			headertable1 += "{text: ' " + companyname + "', style: 'subheaderone'},";
			headertable1 += "{text: '" + address + "', style: 'subheaderone'},";
			headertable1 += "{text: '" + city + "-" + pincode + "', style: 'subheaderone'},";
			headertable1 += "{text: 'Email ID: " + email + "', style: 'subheaderone'},";
			headertable1 += "{text: '" + "www.elev8r.in" + "', style: 'subheaderone'},";

			headertable1 += "{columns: [{image:'" + this.imagepath + "', width:160, height:35,margin: [0, -30, 0, 0]}]},";
			headertable1 += "{columns: [{text:'" + " " + "', style: 'subheader'},{text:'" + " " + "', style: 'subheaderone'}]},";
			headertable1 += "{columns: [{text:'Rev. No. " + pdfModel.oData.revision + "', style: 'subheader'},{text:'Dt. " + pdfModel.oData.orderdate + "', style: 'subheaderone'}]},";
			headertable1 += "{text: '" + pdfModel.oData.quotename + "', style: 'subheader'},";
			headertable1 += "{text: '" + pdfModel.oData.siteaddress + "', style: 'subheader'},";
			headertable1 += "{text: '" + pdfModel.oData.city + "', style: 'subheader'},";
			headertable1 += "{text: '" + "Contact No" + "-" + pdfModel.oData.phoneno + "', style: 'subheader'},";
			headertable1 += "{columns: [{text:'" + " " + "', style: 'subheader'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
			headertable1 += "{canvas: [ { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 } ]},";
			headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
			headertable1 += "{text: 'Dear Sir/Madam', style: 'title'},";
			headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
			headertable1 += "{text: 'Thank you for giving us an opportunity to provide a proposal for supply & installation of Sneha Elevators at your prestigious project. We would like to give you a brief synopsis about our company, product & after sales service setup. ', style: 'title'},";
			headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
			headertable1 += "{text: 'SNEHA ELEVATORS:', style: 'titlewithbold'},";
			headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
			headertable1 += "{text: 'Sneha elevators LLP is a part of a diversified Sneha~ Group and is leading provider of vertical transport solutions and is active in the areas of Elevator production, installation, maintenance and modernization. ', style: 'title'},";
			headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
			headertable1 += "{text: [{text:'Sneha Elevator has been bagging major landmark projects like ', style: 'title'},{text:'Cyprus Palms, Rajapushpa Properties Ltd., Radhey, Muppa Indraprastha, My Home, Lumbini SLN Springs, Vamsiram Builders, Hallmark County, Vesella Meadows, Oorjitha Villas, SSVC ', style: 'subheaderwithbold'},{text:'etc', style: 'title'}]},";
			
			headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
			
			headertable1 += "{text: [{text:'Sneha Elevator Factory - ', style: 'subheaderwithbold'},{text:'Sneha Elevator Factory in Hyderabad, reaffirms a clear commitment to customer focus, sustainability & growth.This stage of art elevator manufacturing will enable Sneha Elevator to serve its customer with cost effective and sustainable products recreating the genuine quality. ', style: 'title'}]},";
			
			//headertable1 += "{text: 'Sneha Elevator Factory - Sneha Elevator Factory in Hyderabad, reaffirms a clear commitment tocustomer focus, sustainability & growth.This stage of art elevator manufacturing will enableSnehaElevator to serve its customer with cost effective and sustainable products recreating the genuinequality.', style: 'title'},";
			headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
			headertable1 += "{text: 'We are confident that you will find our proposal in line with your expectation. If you have any queries, please do not hesitate to contact us. The undersigned backed by the entire sneha Organization, will be responsible for all activities related to the project. Starting from submission of our offer to the satisfactory handing over of the elevator. The undersigned will be your single point of contact.', style: 'title'},";
			headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
			headertable1 += "{text: 'We thank you once again for your interest shown in Sneha Elevator and look forward to receive your valued order. For more information, kindly visit our website www.snehaelevator.com', style: 'title'},";
			headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
			headertable1 += "{text: 'Yours Sincerely,', style: 'title'},";
			headertable1 += "{columns: [{text:'" + " " + "', style: 'subheader'},{text:'" + " " + "', style: 'subheaderone'}]},";
			headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
			headertable1 += "{text: ' " + "For SNEHA ELEVATORS LLP" + "', style: 'subheader'},";
			headertable1 += "{text: '" + "T. Prashanth" + "', style: 'subheader'},";
			headertable1 += "{text: '" + "Assistant Manager - Sales" + "', style: 'subheader'},";
			headertable1 += "{text: '" + "Contact No. 7337331523" + "', style: 'subheader'},";
			headertable1 += "{columns: [{text:'" + " " + "', style: 'subheader'},{text:'" + " " + "', style: 'subheaderone'}]},";
			headertable1 += "{columns: [{text:'" + " " + "', style: 'subheader'},{text:'" + " " + "', style: 'subheaderone'}]},";
			headertable1 += "{columns: [{text:'" + " " + "', style: 'subheader'},{text:'" + " " + "', style: 'subheaderone'}]},";
			headertable1 += "{columns: [{text:'" + " " + "', style: 'subheader'},{text:'" + " " + "', style: 'subheaderone'}]},";
			headertable1 += "{text: '" + "Sneha Elevators LLP" + "', style: 'subheader'},";
			headertable1 += "{columns: [{text:'Authorized Signature" + " " + "', style: 'subheader'},{text:'Customer Signature" + " " + "', style: 'subheaderone'}]},";
		
			headertable1 += "{columns: [{text:'" + " " + "', style: 'subheader'},{text:'" + " " + "', style: 'subheaderone'}]},";

			// SECOND PAGE OF PDF
			headertable1 += "{text: ' " + companyname + "', style: 'subheaderone'},";
			headertable1 += "{text: '" + "D. No. 2-40/30/1, Road No. 5," + "', style: 'subheaderone'},";
			headertable1 += "{text: '" + address + "', style: 'subheaderone'},";
			headertable1 += "{text: '" + city + "-" + pincode + "', style: 'subheaderone'},";
			headertable1 += "{text: 'Email ID: " + email + "', style: 'subheaderone'},";
			headertable1 += "{text: '" + "www.elev8r.in" + "', style: 'subheaderone'},";

			headertable1 += "{columns: [{image:'" + this.imagepath + "', width:160, height:35,margin: [0, -30, 0, 0]}]},";
			headertable1 += "{columns: [{text:'" + " " + "', style: 'subheader'},{text:'" + " " + "', style: 'subheaderone'}]},";

			headertable1 += "{ style: 'specificationTableExample',";
			headertable1 += " table: {";
			headertable1 += "widths: ['*','auto','*'],";
			headertable1 += " body: [";
			headertable1 += "[ { columns: [ {text:'Lift Specifications" + " " + "', style: 'subheader'} ] },{ columns: [ {text:'Current Specifications" + " " + "', style: 'subheader'} ] },{ columns: [ {text:'Previous Specifications" + " " + "', style: 'subheader'} ] }],";
			for (var i = 0; i < array.length; i++) {
				headertable1 += "[ {text: '" + array[i].name + "'},{text: '" + array[i].value + "'},{text: '" + array[i].previousvalue + "'},],";
			}

			headertable1 += "]";
			headertable1 += "}";
			headertable1 += "},";
		
			headertable1 += "{columns: [{text:'" + " " + "', style: 'subheader'},{text:'" + " " + "', style: 'subheaderone'}]},";
			headertable1 += "{text: '" + "Sneha Elevators LLP" + "', style: 'subheader'},";
			headertable1 += "{columns: [{text:'Authorized Signature" + " " + "', style: 'subheader'},{text:'Customer Signature" + " " + "', style: 'subheaderone'}]},";

			//Define Style For PDF Content
			headertable1 += "]," +
				// "footer: function (currentPage, pageCount) {" +
				// "return {" +
				// "style: 'Footer'," +
				// "table: {" +
				// "widths: ['*', 5]," +
				// "body: [" +
				// "[" +
				// "{ text: 'Page ' + currentPage.toString() + ' of ' + pageCount, alignment: 'center', style: 'normalText' }" +
				// "]," +
				// "]" +
				// "}," +
				// // "layout: 'noBorders'" +
				// "};" +
				// "}," +
				"styles: {" +

				"todatecss: {" +
				"fontSize:9," +
				"bold: true," +
				"alignment:'right'" +
				"}," +

				"header: {" +
				"fontSize:8," +
				"bold: true," +
				"border: [false, true, false, false]," +
				"fillColor: '#eeeeee'," +
				"alignment: 'center'," +
				"margin: [0, 5, 0, 0]," +
				"}," +

				"title: {" +
				"fontSize:10," +
				"alignment: 'left'," +
				"}," +

				"titleboldheader: {" +
				"fontSize:11," +
				"decoration: 'underline',"+
				"bold: true," +
				"alignment: 'left'," +
				"}," +

				"titlebold: {" +
				"fontSize:10," +
				"bold: true," +
				"alignment: 'left'," +
				"}," +

				"titlewithbold: {" +
				"fontSize:10," +
				"bold: true," +
				"alignment: 'left'," +
				"}," +

				"titleincenter: {" +
				"fontSize:11," +
				"bold: true," +
				"alignment: 'center'," +
				"}," +

				"titleincenterwithunderline: {" +
				"fontSize:11," +
				"bold: true," +
				"decoration: 'underline',"+
				"alignment: 'center'," +
				"}," +

				"headertitleincenter: {" +
				"fontSize:12," +
				"bold: true," +
				"alignment: 'center'," +
				"}," +

				"titleheader: {" +
				"fontSize:16," +
				"bold: true," +
				"border: [false, true, false, false]," +
				"fillColor: '#eeeeee'," +
				"alignment: 'center'," +
				"margin: [0, 5, 0, 0]," +
				"}," +

				"Footer: {" +
				"fontSize: 7," +
				"margin: [19, 5, 5, 5]," +
				"}," +

				"subheader: {" +
				"fontSize:9," +
				"bold: true," +
				"margin: [0, 5, 0, 0]," +
				"}," +

				"subheaderformargine: {" +
				"fontSize:9," +
				"bold: true," +
				"margin: [0, 5, 0, 20]," +
				"}," +

				"subheaderspace: {" +
				"fontSize:1," +
				"bold: true," +
				"margin: [0, 5, 0, 0]," +
				"}," +

				"subheaderwithbold: {" +
				"fontSize:10," +
				"bold: true," +
				"margin: [0, 5, 0, 0]," +
				"}," +

				"subheaderwithbold13: {" +
				"fontSize:10," +
				"bold: true," +
				"margin: [0, 0, 0, 0]," +
				"}," +

				"tablecontent: {" +
				"fontSize:10," +
				"margin: [0, 5, 0, 0]," +
				"}," +

				"subheaderone: {" +
				"fontSize:9," +
				"bold: true," +
				"alignment:'right'," +
				"margin: [0, 05, 0, 4]," +
				"}," +

				"subheaderonespace: {" +
				"fontSize:1," +
				"bold: true," +
				"alignment:'right'," +
				"margin: [0, 05, 0, 4]," +
				"}," +

				"subheaderbold: {" +
				"fontSize:9," +
				"bold: true," +
				"alignment:'right'," +
				"margin: [0, 04, 0, 4]," +
				"}," +

				"subheaderleft: {" +
				"fontSize:9," +
				"bold: true," +
				"alignment:'left'," +
				"margin: [0, 05, 0, 4]," +
				"}," +

				"amtinwords: {" +
				"fontSize:12," +
				"bold: true," +
				"alignment:'left'," +
				"margin: [0,180, 0,0]," +
				"}," +

				"subheadercost: {" +
				"fontSize:12," +
				"bold: true," +
				"alignment:'right'," +
				"margin: [0,200, 0, 0]," +
				"}," +

				"subheaderremark4: {" +
				"fontSize:12," +
				"bold: true," +
				"alignment:'left'," +
				"margin: [0,200, 0, 0]," +
				"}," +

				"subheaderremark: {" +
				"fontSize:12," +
				"bold: true," +
				"alignment:'left'," +
				"margin: [0,200, 0, 0]," +
				"}," +

				"subheadercost1: {" +
				"fontSize:12," +
				"bold: true," +
				"alignment:'right'," +
				"margin: [0,15, 0, 0]," +
				"}," +

				"subheaderremark1: {" +
				"fontSize:12," +
				"bold: true," +
				"alignment:'left'," +
				"margin: [0,15, 0, 0]," +
				"}," +

				"tableExample: {" +
				"margin: [0, 50, 0, 0]," +
				"fontSize: 8," +
				"}," +

				"tableExample2: {" +
				"margin: [0, 15, 0, 0]," +
				"fontSize: 8," +
				"}," +

				"specificationHeader: {" +
				"margin: [0, 15, 0, 0]," +
				"alignment : 'center'," +
				"fontSize: 8," +
				"}," +

				"specificationTableExample: {" +
				"margin: [0, 0, 0, 0]," +
				"fontSize: 8," +
				"}," +

				"tableExample5: {" +
				"margin: [0, 0, 0, 0]," +
				"fontSize: 8," +
				"}," +

				"tableExample4: {" +
				"margin: [0, 15, 0, 0]," +
				"fontSize: 10," +
				"}," +

				"tableExample3: {" +
				"margin: [0, 15, 0, 340]," +
				"fontSize: 8," +
				"}," +


				"tableHeader: {" +
				"bold: true," +
				"fontSize: 8," +
				"color: 'black'," +
				"}," +
				"}," +

				"defaultStyle: {" +
				"fontSize: 8" +
				"}" +
				"};" +
				"pdfMake.createPdf(docDefinition).download('order.pdf');" +
				"} });";
			headertable1 += "</script></html>";
			fullHtml += headertable1;
			var wind = window.open();
			wind.document.write(fullHtml);
			console.log("fullHtml", fullHtml);

			setTimeout(function () {
				wind.close();
			}, 3000);
		},

		onCancel: function () {
			this.reset();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("orders");
		}
	});
}, true);
