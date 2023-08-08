sap.ui.define(
	[
		"sap/ui/model/json/JSONModel",
		"sap/ui/elev8rerp/componentcontainer/controller/BaseController",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function",
		"sap/ui/elev8rerp/componentcontainer/services/Common.service",
		"sap/ui/elev8rerp/componentcontainer/services/Masters/Location.service",
		"sap/ui/elev8rerp/componentcontainer/services/LeadManagement/Lead.service",
		"sap/ui/elev8rerp/componentcontainer/services/LeadManagement/Quotation.service",
		"sap/ui/elev8rerp/componentcontainer/services/login.service",
	],
	function (
		JSONModel,
		BaseController,
		MessageToast,
		MessageBox,
		commonFunction,
		commonService,
		locationService,
		leadService,
		quotationService,
		loginService
	) {
		"use strict";

		return BaseController.extend(
			"sap.ui.elev8rerp.componentcontainer.controller.LeadManagement.AddQutation",
			{
				onInit: function () {
					var currentContext = this;

					// currentContext.reset();
					this.bus = sap.ui.getCore().getEventBus();
					this.bus.subscribe(
						"qutationdetails",
						"newQutation",
						this.qutationdetail,
						this
					);
					this.bus.subscribe(
						"converttoquote",
						"quoteConversion",
						this.quoteConversion,
						this
					);

					// bind Source dropdown
					commonFunction.getReferenceByType("LeadSrc", "leadSourceModel", this);

					// bind Lead dropdown
					commonFunction.getReferenceByType(
						"LeadCtgry",
						"leadCategoryModel",
						this
					);

					// bind Source dropdown
					commonFunction.getReferenceByType(
						"QuoteType",
						"quoteTypeModel",
						this
					);

					// bind Pipeline dropdown
					commonFunction.getReferenceByType(
						"QuoteStatus",
						"QuoteStatusModel",
						this
					);

					// bind Pipeline dropdown
					commonFunction.getReferenceByType(
						"QuoteCategory",
						"QuoteCategoryModel",
						this
					);

					// bind Lead dropdown
					commonFunction.getReferenceByType(
						"QuoteSubCategory",
						"QuoteSubCategoryModel",
						this
					);

					// bind CntCtgry dropdown
					commonFunction.getReferenceByType(
						"CntCtgry",
						"leadCntCategoryModel",
						this
					);

					// bind CntType dropdown
					commonFunction.getReferenceByType(
						"CntType",
						"leadCntTypeModel",
						this
					);

					// bind LiftType dropdown
					commonFunction.getReferenceByType("LftTyp", "liftTypeModel", this);

					// bind capacity dropdown
					commonFunction.getReferenceByType(
						"LftCpcty",
						"leadCapacityModel",
						this
					);

					// bind Machine dropdown
					commonFunction.getReferenceByType("LftMchn", "MachineModel", this);

					// bind Model dropdown
					commonFunction.getReferenceByType("LftMdl", "leadmodelModel", this);

					// bind Drive dropdown
					commonFunction.getReferenceByType("LftDrv", "leadDriveModel", this);

					// bind Control dropdown
					commonFunction.getReferenceByType(
						"LftCtrl",
						"leadControlModel",
						this
					);

					// bind Operation dropdown
					commonFunction.getReferenceByType(
						"LftOprn",
						"leadOperationModel",
						this
					);

					// bind Speed dropdown
					commonFunction.getReferenceByType("LftSpd", "leadSpeedModel", this);

					// bind Door dropdown
					commonFunction.getReferenceByType("DrTyp", "leadDoorTypeModel", this);

					// bind landingDoorModel dropdown
					commonFunction.getReferenceByType("LdnDr", "landingDoorModel", this);

					// bind CarDoorModel dropdown
					commonFunction.getReferenceByType("CarDr", "CarDoorModel", this);

					// bind LowestFloorModel dropdown
					commonFunction.getReferenceByType(
						"LwstFlrMking",
						"LowestFloorModel",
						this
					);

					// bind CWTPositionModel dropdown
					commonFunction.getReferenceByType(
						"CWTPstn",
						"CWTPositionModel",
						this
					);

					// bind Pipeline dropdown
					commonFunction.getReferenceByType(
						"LeadStatus",
						"leadStatusModel",
						this
					);

					// bind standaredFloorHeightModel dropdown
					commonFunction.getReferenceByType(
						"StdFlrHt",
						"standaredFloorHeightModel",
						this
					);

					// bind Stage dropdown
					commonFunction.getReferenceByType("Stage", "stageModel", this);

					// bind AllOpeningSameSide dropdown
					commonFunction.getReferenceByType(
						"AllOpeningSameSide",
						"openingSameSideModel",
						this
					);

					// bind frontopening dropdown
					commonFunction.getReferenceByType(
						"FrontOpening",
						"frontOpeningModel",
						this
					);

					// bind backopening dropdown
					commonFunction.getReferenceByType(
						"BackOpening",
						"backOpeningModel",
						this
					);

					// bind leftopening dropdown
					commonFunction.getReferenceByType(
						"LeftOpening",
						"leftOpeningModel",
						this
					);

					// bind rightopening dropdown
					commonFunction.getReferenceByType(
						"RightOpening",
						"rightOpeningModel",
						this
					);

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

					// bind shaft condition dropdown
					commonFunction.getReferenceByType("ShftCndtn", "shaftConditionModel", this);

					// bind unit dropdown
					commonFunction.getReferenceByType("Unit", "unitModel", this);

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
					});

					var emptyModel = this.getModelDefault();
					var model = new JSONModel();
					model.setData(emptyModel);
					this.getView().setModel(model, "editQutationModel");

					this.getAllQuotations();
				},

				getModelDefault: function () {
					return {
						id: null,
						leadname: null,
						companyname: null,
						quotedate: commonFunction.getDateFromDB(new Date()),
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
						pincode: null,
					};
				},

				onBeforeRendering: function () {
					var currentContext = this;
					this.model = currentContext.getView().getModel("viewModel");
				},

				getAllQuotations: function () {
					let editQutationModel = this.getView().getModel("editQutationModel");
					quotationService.getAllQuotations(function (data) {
						if (data.length && data[0].length) {
							let lastid = data[0].length - 1;
							let nextid = data[0][lastid].id + 1;
							editQutationModel.oData.quotationid = nextid;
							editQutationModel.refresh();
						} else {
							editQutationModel.oData.quotationid = 1;
							editQutationModel.refresh();
						}
					});
				},

				quoteConversion: function (sChannel, sEvent, oData) {
					let selRow = oData.viewModel;
					let oThis = this;
					oThis.getAllQuotations();
					if (selRow != null) {
						oThis.convertToQuote(selRow.id);
					} else {
						var oModel = new JSONModel();
						this.getView().setModel(oModel, "editQutationModel");
					}
				},

				convertToQuote: function (id) {
					console.log("convert");
					let quotationid = 0;
					var oModel = new JSONModel();
					if (id != undefined) {
						leadService.convertToQuote({ id: id }, function (data) {
							if (data.length && data[0].length) {
								data[0][0].quotationid = parseInt(data[0][0].lastquoteid) + 1;
								oModel.setData(data[0][0]);
							}
						});
					}

					this.getView().setModel(oModel, "editQutationModel");
					var oModel = this.getView().getModel("editQutationModel");
				},

				qutationdetail: function (sChannel, sEvent, oData) {
					let selRow = oData.viewModel;
					let oThis = this;

					if (selRow != null) {
						if (selRow.action == "view") {
							oThis.getView().byId("btnSave").setEnabled(false);
						} else {
							oThis.getView().byId("btnSave").setEnabled(true);
						}

						oThis.bindQutationDetails(selRow.id);
					} else {
						oThis.getAllQuotations();
					}
				},

				LeadChange: function () {
					var leadid = this.getView().byId("txtLead").getSelectedItem()
						.mProperties.key;
					var currentContext = this;
					currentContext.leadname = this.getView()
						.byId("txtLead")
						.getSelectedItem();
					var oQutationModel = this.getView().getModel("editQutationModel");
					console.log(
						"------------oLeadDetailnModel--------------",
						oQutationModel
					);

					// let oLeadDetailnModel = this.getView().getModel("editQutationModel").oData;
					// console.log("oLeadDetailnModel",oLeadDetailnModel);
					// let oQutationModel.oData = oLeadDetailnModel.getData();
					// console.log("oQutationModel.oData",oQutationModel.oData);

					leadService.getLeads({ id: leadid }, function (data) {
						var oLeadModel = new sap.ui.model.json.JSONModel();
						if (data.length > 0) {
							if (data[0].length > 0) {
								//data[0].unshift({ "id": "All", "linename": "Select All" });
							} else {
								MessageBox.error("Lead  not availabel.");
							}
						}

						currentContext.getView().setModel(oLeadModel, "leadModel");
						oLeadModel.setData({ modelData: data[0] });
						console.log(
							"--------------leadModel--------------------",
							oLeadModel
						);

						(oQutationModel.oData.leadname =
							oLeadModel.oData.modelData[0].leadname),
							(oQutationModel.oData.companyname =
								oLeadModel.oData.modelData[0].companyname),
							(oQutationModel.oData.leaddate =
								oLeadModel.oData.modelData[0].leaddate),
							(oQutationModel.oData.salesrep =
								oLeadModel.oData.modelData[0].salesrep),
							(oQutationModel.oData.sourceid =
								oLeadModel.oData.modelData[0].sourceid),
							(oQutationModel.oData.leadscategory =
								oLeadModel.oData.modelData[0].leadscategory),
							(oQutationModel.oData.stageid =
								oLeadModel.oData.modelData[0].stageid),
							(oQutationModel.oData.email =
								oLeadModel.oData.modelData[0].email),
							(oQutationModel.oData.phoneno =
								oLeadModel.oData.modelData[0].phoneno),
							(oQutationModel.oData.mobileno =
								oLeadModel.oData.modelData[0].mobileno),
							(oQutationModel.oData.contactperson =
								oLeadModel.oData.modelData[0].contactperson),
							(oQutationModel.oData.leadvalue =
								oLeadModel.oData.modelData[0].leadvalue),
							(oQutationModel.oData.leadscore =
								oLeadModel.oData.modelData[0].leadscore),
							(oQutationModel.oData.leadstatus =
								oLeadModel.oData.modelData[0].leadstatus),
							(oQutationModel.oData.leaddescription =
								oLeadModel.oData.modelData[0].leaddescription),
							(oQutationModel.oData.locationid =
								oLeadModel.oData.modelData[0].locationid),
							(oQutationModel.oData.typeoflift =
								oLeadModel.oData.modelData[0].typeoflift),
							(oQutationModel.oData.capacityid =
								oLeadModel.oData.modelData[0].capacityid),
							(oQutationModel.oData.modelid =
								oLeadModel.oData.modelData[0].modelid),
							(oQutationModel.oData.driveid =
								oLeadModel.oData.modelData[0].driveid),
							(oQutationModel.oData.machineid =
								oLeadModel.oData.modelData[0].machineid),
							(oQutationModel.oData.controlid =
								oLeadModel.oData.modelData[0].controlid),
							(oQutationModel.oData.operationid =
								oLeadModel.oData.modelData[0].operationid),
							(oQutationModel.oData.speedid =
								oLeadModel.oData.modelData[0].speedid),
							(oQutationModel.oData.typeofdoorid =
								oLeadModel.oData.modelData[0].typeofdoorid),
							(oQutationModel.oData.landingdoorid =
								oLeadModel.oData.modelData[0].landingdoorid),
							(oQutationModel.oData.cardoorid =
								oLeadModel.oData.modelData[0].cardoorid),
							(oQutationModel.oData.lowestfloorid =
								oLeadModel.oData.modelData[0].lowestfloorid),
							(oQutationModel.oData.cwtpositionid =
								oLeadModel.oData.modelData[0].cwtpositionid),
							(oQutationModel.oData.floorheaightid =
								oLeadModel.oData.modelData[0].floorheaightid),
							(oQutationModel.oData.architectidid =
								oLeadModel.oData.modelData[0].architectidid),
							(oQutationModel.oData.leadconsaltantid =
								oLeadModel.oData.modelData[0].leadconsaltantid),
							(oQutationModel.oData.nooflifts =
								oLeadModel.oData.modelData[0].nooflifts),
							(oQutationModel.oData.cityid =
								oLeadModel.oData.modelData[0].cityid),
							(oQutationModel.oData.stateid =
								oLeadModel.oData.modelData[0].stateid),
							(oQutationModel.oData.countryid =
								oLeadModel.oData.modelData[0].countryid),
							(oQutationModel.oData.pincode =
								oLeadModel.oData.modelData[0].pincode),
							(oQutationModel.oData.stopsid =
								oLeadModel.oData.modelData[0].stopsid),
							(oQutationModel.oData.floormarking =
								oLeadModel.oData.modelData[0].floormarking),
							(oQutationModel.oData.allopeningsameside =
								oLeadModel.oData.modelData[0].allopeningsameside),
							(oQutationModel.oData.frontopening =
								oLeadModel.oData.modelData[0].frontopening),
							(oQutationModel.oData.backopening =
								oLeadModel.oData.modelData[0].backopening),
							(oQutationModel.oData.leftopening =
								oLeadModel.oData.modelData[0].leftopening),
							(oQutationModel.oData.rightopening =
								oLeadModel.oData.modelData[0].rightopening),
							(oQutationModel.oData.shaftwidth =
								oLeadModel.oData.modelData[0].shaftwidth),
							(oQutationModel.oData.shaftdepth =
								oLeadModel.oData.modelData[0].shaftdepth),
							(oQutationModel.oData.cardepth =
								oLeadModel.oData.modelData[0].cardepth),
							(oQutationModel.oData.carwidth =
								oLeadModel.oData.modelData[0].carwidth),
							(oQutationModel.oData.carheight =
								oLeadModel.oData.modelData[0].carheight),
							(oQutationModel.oData.doorwidth =
								oLeadModel.oData.modelData[0].doorwidth),
							(oQutationModel.oData.doorheight =
								oLeadModel.oData.modelData[0].doorheight),
							(oQutationModel.oData.travel =
								oLeadModel.oData.modelData[0].travel),
							(oQutationModel.oData.pitdepth =
								oLeadModel.oData.modelData[0].pitdepth),
							(oQutationModel.oData.overhead =
								oLeadModel.oData.modelData[0].overhead),
							(oQutationModel.oData.mrwidth =
								oLeadModel.oData.modelData[0].mrwidth),
							(oQutationModel.oData.mrdepth =
								oLeadModel.oData.modelData[0].mrdepth),
							(oQutationModel.oData.mrheight =
								oLeadModel.oData.modelData[0].mrheight),
							(oQutationModel.oData.companyname =
								oLeadModel.oData.modelData[0].companyname),
							console.log(
								"-------------oQutationModel After lead set detail-------------",
								oQutationModel
							);
						oQutationModel.refresh();
					});
					console.log(
						"-------------oQutationModel After lead set detail outside-------------",
						oQutationModel
					);
					oQutationModel.refresh();

					this.getView()
						.byId("txtLead")
						.setValueState(sap.ui.core.ValueState.None);
				},

				bindQutationDetails: function (id) {
					var currentContext = this;
					var oModel = new JSONModel();
					if (id != undefined) {
						quotationService.getQuotation({ id: id }, function (data) {
							data[0][0].withgst = data[0][0].withgst == 1 ? true : false;
							oModel.setData(data[0][0]);
						});
						this.getView().byId("btnSave").setText("Update");
					}

					this.getView().setModel(oModel, "editQutationModel");
					var oModel = this.getView().getModel("editQutationModel");
				},

				handleSelectionFinish: function (oEvent) {
					var inputId = oEvent.mParameters.id;
					var id = inputId.substring(inputId.lastIndexOf("-") + 1);

					var selectedItems = oEvent.getParameter("selectedItems");
					var moduleids = "";

					for (var i = 0; i < selectedItems.length; i++) {
						moduleids += selectedItems[i].getKey();

						if (i != selectedItems.length - 1) {
							moduleids += ",";
						}
					}
					var model = this.getView().getModel("editQutationModel");
					model.oData.moduleid = moduleids;
				},

				handleSelectionChange: function () {
					this.getView()
						.byId("ddlMtxtModuleNameodule")
						.setValueState(sap.ui.core.ValueState.None);
				},

				fnShortCut: function () {
					var currentContext = this;
					$(document).keydown(function (event) {
						if (event.keyCode == 83 && event.altKey) {
							event.preventDefault();
							jQuery(document).ready(function ($) {
								currentContext.onSave();
							});
						}

						if (event.keyCode == 69 && event.altKey) {
							event.preventDefault();
							jQuery(document).ready(function ($) {
								currentContext.onCancel();
							});
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
					var columns = ["itemcode", "itemname"];
					var oFilter = new sap.ui.model.Filter(
						columns.map(function (colName) {
							return new sap.ui.model.Filter(
								colName,
								sap.ui.model.FilterOperator.Contains,
								sValue
							);
						}),
						false
					); // false for OR condition
					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter([oFilter]);
				},

				onSave: function () {
					if (this.validateForm()) {
					var currentContext = this;
					var model = this.getView().getModel("editQutationModel").oData;
					let emaildate = model.quotedate;
					console.log("editQutationModel", model);
					model["companyid"] = commonService.session("companyId");
					model["quotedate"] = commonFunction.getDate(model.quotedate);
					model["userid"] = commonService.session("userId");

					quotationService.saveQuotation(model, function (data) {
						if (data.id > 0) {
							var message =
								model.id == null
									? "Qutation created successfully!"
									: "Qutation edited successfully!";
							currentContext.onCancel();
							MessageToast.show(message);
							currentContext.sendEmail(data.id, emaildate);
							currentContext.bus = sap.ui.getCore().getEventBus();
							currentContext.bus.publish(
								"loadquotationdata",
								"loadQuotationData"
							);
						}
					});
					this.reset();

					}
				},

				validateForm: function () {
					var isValid = true;
					var source = this.getView().byId("sourceid").getSelectedKey();
					var pipeline = this.getView().byId("txtStageid").getSelectedKey();

					var location = this.getView().byId("leadlocationid").getValue();
					var leadStatus = this.getView().byId("leadstatusid").getSelectedKey();

					var category = this.getView().byId("categoryid").getSelectedKey();

					var typeoflift = this.getView().byId("typeofliftid").getSelectedKey();

					// var emailId = this.getView().byId("txtEmailId").getValue();
					// var phoneNo = this.getView().byId("txtPhoneNo").getValue();

					let quotevalue = this.getView().byId("txtQutationValue").getValue();



        if(quotevalue!=null){
		if (!commonFunction.isNumbermessage(this, "txtQutationValue", "please enter correct quotation value!")){
				isValid = false;
			}
		}


					if (
						!commonFunction.isRequired(
							this,
							"contactPerson",
							"Please enter contact person name."
						)
					)
						isValid = false;

					// if (emailId != "") {
					// 	if (!commonFunction.isEmail(this, "txtEmailId")) isValid = false;
					// } else if (
					// 	!commonFunction.isRequired(
					// 		this,
					// 		"txtEmailId",
					// 		"Please enter email ID."
					// 	)
					// )
					// 	isValid = false;
					// else {
					// 	this.getView()
					// 		.byId("txtEmailId")
					// 		.setValueState(sap.ui.core.ValueState.None);
					// }

					// if (phoneNo != "") {
					// 	if (!commonFunction.isNumber(this, "txtPhoneNo")) isValid = false;
					// } else if (
					// 	!commonFunction.isRequired(
					// 		this,
					// 		"txtPhoneNo",
					// 		"Please enter phone no."
					// 	)
					// )
					// 	isValid = false;
					// else {
					// 	this.getView()
					// 		.byId("txtPhoneNo")
					// 		.setValueState(sap.ui.core.ValueState.None);
					// }

					// check atleast one source is selected

					if (pipeline.length == 0) {
						this.getView()
							.byId("txtStageid")
							.setValueState(sap.ui.core.ValueState.Error)
							.setValueStateText("Please select atleast one Stage.");

						isValid = false;
					}

					if (source.length == 0) {
						this.getView()
							.byId("sourceid")
							.setValueState(sap.ui.core.ValueState.Error)
							.setValueStateText("Please select atleast one source.");

						isValid = false;
					}

					if (typeoflift.length == 0) {
						this.getView()
							.byId("typeofliftid")
							.setValueState(sap.ui.core.ValueState.Error)
							.setValueStateText("Please select atleast one lift Type.");

						isValid = false;
					}

					if (location.length == 0) {
						this.getView()
							.byId("leadlocationid")
							.setValueState(sap.ui.core.ValueState.Error)
							.setValueStateText("Please  enter side address.");

						isValid = false;
					}
					if (leadStatus.length == 0) {
						this.getView()
							.byId("leadstatusid")
							.setValueState(sap.ui.core.ValueState.Error)
							.setValueStateText("Please select atleast one status.");

						isValid = false;
					}
					if (category.length == 0) {
						this.getView()
							.byId("categoryid")
							.setValueState(sap.ui.core.ValueState.Error)
							.setValueStateText("Please select atleast one category.");

						isValid = false;
					}

					return isValid;
				},

				sendEmail : function(DocEntry, DocDate){
					let oThis = this;
					let sUserName = (typeof sessionStorage.CustomerCardName !== "undefined" && sessionStorage.CustomerCardName !== null) ? sessionStorage.CustomerCardName : "Customer";
					let params = {
						from: "support@poultryos.com",
						to: 'savita.g@logicaldna.com',
						subject: "Thanks You, Your Order with Sakas PartnerConnect is complete – Order No " + DocEntry,
						text: "Dear " + sUserName + "!\n\n" +
		
							"Thanks for placing order with us on " + DocDate + ", your order no is " + DocEntry + "."+ 
							"\n\n" + 
							"For any queries, please contact Sakas Administrator at sakasmilk@gmail.com"
					};
					console.log(params);
					loginService.sendEmail(params, function (data1) {
						if (data1 === 'SENT'){
							MessageToast.show("Sales order booked successfully!");
							oThis.reset();
						}
					});
				},		

				onEmailChange: function (oEvent) {
					var emailId = oEvent.mParameters.value;

					if (emailId != "") {
						commonFunction.isEmail(this, "txtEmailId");
					} else {
						this.getView()
							.byId("txtEmailId")
							.setValueState(sap.ui.core.ValueState.None);
					}
				},

				onNumberInputChange: function (oEvent) {
					var inputId = oEvent.mParameters.id;
					var inputValue = oEvent.mParameters.value;

					inputId = inputId.substring(inputId.lastIndexOf("-") + 1);

					if (inputId == "txtMobileNo") {
						if (inputValue != "") commonFunction.isNumber(this, "txtMobileNo");
						else
							this.getView()
								.byId("txtMobileNo")
								.setValueState(sap.ui.core.ValueState.None);
					} else if (inputId == "txtPinCode") {
						if (inputValue != "") commonFunction.isNumber(this, "txtPinCode");
						else
							this.getView()
								.byId("txtPinCode")
								.setValueState(sap.ui.core.ValueState.None);
					} else if (inputId == "txtCreditPeriod") {
						if (inputValue != "")
							commonFunction.isNumber(this, "txtCreditPeriod");
						else
							this.getView()
								.byId("txtCreditPeriod")
								.setValueState(sap.ui.core.ValueState.None);
					}
				},

				resourcebundle: function () {
					var currentContext = this;
					var oBundle = this.getModel("i18n").getResourceBundle();
					return oBundle;
				},

				onDelete: function () {
					var currentContext = this;

					if (this.model.id != undefined) {
						var model = {
							id: this.model.id,
							companyid: commonFunction.session("companyId"),
							userid: commonFunction.session("userId"),
						};

						MessageBox.confirm("Are you sure you want to delete?", {
							styleClass: "sapUiSizeCompact",
							onClose: function (sAction) {
								if (sAction == "OK") {
								}
							},
						});
					}
				},

				reset: function () {
					let oThis = this;
					var model = oThis.getView().getModel("editQutationModel");
					model.setData([]);
					oThis.getView().setModel(model, "editQutationModel");

					// let oQutationModel = oThis.getView().getModel("editQutationModel");
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
				onCancel: function () {
					this.reset();
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("quotations");
				},
			}
		);
	},
	true
);
