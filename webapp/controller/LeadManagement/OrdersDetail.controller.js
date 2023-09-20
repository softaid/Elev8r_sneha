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

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.LeadManagement.QuotationsDetail", {
		onInit: function () {
			var currentContext = this;
			// Display Quote value in Words
			this.nettotalinwords = "";
			// Display Elev8r image 
			this.imagepath = null;
			this.toDataURL('../images/snehaelev8r.png', function (dataUrl) {
				currentContext.imagepath = dataUrl;
			});

			// get all Company Details  
			this.companyname = commonFunction.session("companyname");
			this.companycontact = commonFunction.session("companycontact");
			this.companyemail = commonFunction.session("companyemail");
			this.address = commonFunction.session("address");
			this.detailaddress = commonFunction.session("detailaddress");
			this.city = commonFunction.session("city");
			this.pincode = commonFunction.session("pincode");

			//All EventBus
			this.bus = sap.ui.getCore().getEventBus();
			// EventBus for detail page of qutation
			this.bus.subscribe("orderdetail", "handleOrderDetails", this.handleOrderDetails, this);
			// EventBus for New qutation
			this.bus.subscribe("addOrder", "addOrderdetail", this.addOrderdetail, this);
			this.bus.subscribe("loaddata", "loadData", this.loadData, this);
			this.bus.subscribe("converttoorder", "orderConversion", this.orderConversion, this);

			this.handleRouteMatched(null);

			// Define all Required Models

			//Define Model for Leads
			var model = new JSONModel();
			model.setData([]);
			this.getView().setModel(model, "leadModel");

			//Define Model for Stages
			let stageModel = new JSONModel();
			stageModel.setData({ modelData: [] });
			this.getView().setModel(stageModel, "stageModel");

			let revisionModel = new JSONModel();
			stageModel.setData({ modelData: [] });
			this.getView().setModel(stageModel, "revisionModel");

			//Define Model for LeadsActivities
			let activityModel = new JSONModel();
			activityModel.setData({ modelData: [] });
			this.getView().setModel(activityModel, "activityModel");

			//Define Model for LiftDetails
			let liftModel = new JSONModel();
			liftModel.setData({ modelData: [] });
			this.getView().setModel(liftModel, "liftModel");

			//Define Model for Qutation
			let orderModel = new JSONModel();
			orderModel.setData({});
			this.getView().setModel(orderModel, "orderModel");

			//Define Model for PDF QuoteData
			var quotePDFModel = new JSONModel();
			quotePDFModel.setData([]);
			this.getView().setModel(quotePDFModel, "quotePDFModel");

			//Define Model for PDF LiftData
			var leadLiftPDFModel = new JSONModel();
			leadLiftPDFModel.setData([]);
			this.getView().setModel(leadLiftPDFModel, "leadLiftPDFModel");

			//Define Model for PDF SaleData
			var saleManagrPDFModel = new JSONModel();
			saleManagrPDFModel.setData([]);
			this.getView().setModel(saleManagrPDFModel, "saleManagrPDFModel");

			//Define Model for Attachement
			let attachmentModel = new JSONModel();
			attachmentModel.setData({ modelData: [] });
			this.getView().setModel(attachmentModel, "attachmentModel");
		},

		//Genrate 64bit image
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

		handleRouteMatched: function (evt) {
			//this.loadPDFData();

		},

		// Get particular order Details  
		handleOrderDetails: function (sChannel, sEvent, oData) {
			let selRow = oData.viewModel;
			let oThis = this;
			// this.loadPDFData();
			console.log(selRow);
			if (selRow != null) {
				// Get all Data
				oThis.loadData(selRow.id);
				// Get PDF Data
				// this.loadPDFData(selRow.quotid);

			}
			oThis.id = selRow.id;
		},

		// Get Qutation with its revision
		loadData: function (id) {
			let oThis = this;
			orderService.getorderDetail({ id: id }, function (data) {
				if (data.length) {
					// Get all revisions for qutation
					let aRowsCount = [];
					let orderModel = oThis.getView().getModel("orderModel");
					data[0][0].orderdate=commonFunction.getDate(data[0][0].orderdate);
					orderModel.setData(data[0][0]);
					oThis.getView().setModel(orderModel, "orderModel")
					console.log("orderModel", orderModel);


					let revisionModel = oThis.getView().getModel("revisionModel");
                    if( data[0][0].Revisions!=null){
					let revisions = data[0][0].Revisions.split(",");
					let Arr=revisions.map((ele,index)=>{
						return {...data[0][0],srno:index+1,Revision:ele};
					})

					revisionModel.setData({modelData: Arr});

                    revisionModel.refresh();
				}
					// aRowsCount.push({
					// 	rowsCount: data[4].length
					// });
					// // Generate Dynamic Qutation Revisions
					// let oRowsCount = new JSONModel();
					// oRowsCount.setData(aRowsCount[0]);
					// console.log("oRowsCount", oRowsCount);
					// oThis.getView().setModel(oRowsCount, "rowcount_model");


					// Get Qutation master data
					// if (data[5].length) {
					// 	let orderModel = oThis.getView().getModel("orderModel");
					// 	orderModel.setData(data[5][0]);
					// 	oThis.getView().setModel(orderModel, "orderModel");
					// }
				}
			})
		},

		orderConversion: function (sChannel, sEvent, oData) {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.bus = sap.ui.getCore().getEventBus();
			oRouter.getTargets().display(oData.pagekey, { viewModel: oData.viewModel });
			oRouter.navTo(oData.pagekey, true);
		},

		// Get all data related to PDF Model
		loadPDFData: async function (quotid) {
			let oThis = this;

			await quotationService.getQuotationPDF({ id: quotid }, function (data) {
				if (data.length) {
					// Get Quote details for PDF
					if (data[0].length) {
						let quotePDFModel = oThis.getView().getModel("quotePDFModel");
						quotePDFModel.setData(data[0][0]);
						oThis.getView().setModel(quotePDFModel, "quotePDFModel");
					}
					// Get Lead and Lift Details for PDF
					if (data[1].length) {
						let leadLiftPDFModel = oThis.getView().getModel("leadLiftPDFModel");
						leadLiftPDFModel.setData(data[1][0]);
						oThis.getView().setModel(leadLiftPDFModel, "leadLiftPDFModel");
						oThis.notowordChange();

						oThis.notowordChange();

					}
					// Get Sales Details for PDF
					if (data[2].length) {
						let saleManagrPDFModel = oThis.getView().getModel("saleManagrPDFModel");
						saleManagrPDFModel.setData(data[2][0]);
						oThis.getView().setModel(saleManagrPDFModel, "saleManagrPDFModel");
					}
				}
			})

		},

		//Navigate Add qutation screen
		addNewOrder: function () {
			this.bus = sap.ui.getCore().getEventBus();
			setTimeout(function () {
				this.bus = sap.ui.getCore().getEventBus();
				this.bus.publish("addOrder", "addOrderdetail", { pagekey: "addorder", viewModel: null });
			}, 1000);

			this.bus.publish("addOrder", "addOrderdetail", { pagekey: "addorder", viewModel: null });
		},


		//Function for New order
		addOrderdetail: function (sChannel, sEvent, oData) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.bus = sap.ui.getCore().getEventBus();
			oRouter.getTargets().display(oData.pagekey, { viewModel: oData.viewModel });
			oRouter.navTo(oData.pagekey, true);
		},

		//Edit Existing order
		editorder: function (oEvent) {
			var viewModel = this.getView().getModel("orderModel");
			var model = { "id": viewModel.oData.id }
			this.bus = sap.ui.getCore().getEventBus();
			setTimeout(function () {
				this.bus = sap.ui.getCore().getEventBus();
				this.bus.publish("addOrder", "addOrderdetail", { pagekey: "addorder", viewModel: model });
			}, 1000);

			this.bus.publish("addOrder", "addOrderdetail", { pagekey: "addorder", viewModel: model });
		},

		resourceBundle: function () {
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},

		// Delete Selcted qutations form list
		deleteQutation: function () {
			var currentContext = this;
			var confirmMsg = currentContext.resourceBundle().getText("deleteMsg");
			var deleteSucc = currentContext.resourceBundle().getText("quoteDeleteSucc");
			var model = this.getView().getModel("orderModel").oData;
			if (model.id != undefined) {
				MessageBox.confirm(
					confirmMsg, {
					styleClass: "sapUiSizeCompact",
					onClose: function (sAction) {
						if (sAction == "OK") {
							quotationService.deleteQuotation({ id: model.id }, function (data) {
								if (data) {
									currentContext.onCancel();
									MessageToast.show(deleteSucc);
									currentContext.bus = sap.ui.getCore().getEventBus();
									currentContext.bus.publish("loadquotationData", "loadQuotationData");
								}
							});
						}
					}
				});
			}
		},

		reset: function () {
			let oThis = this;
			var model = oThis.getView().getModel("orderModel");
			model.setData([]);
			oThis.getView().setModel(model, "orderModel");

			let orderModel = oThis.getView().getModel("orderModel");
			orderModel.setData({ modelData: [] });
			oThis.getView.setModel(orderModel, "orderModel");
		},

		onCancel: function () {
			// this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---leads--fclLead");
			this.reset();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("quotations");
		},

		//Function for conversion of no to words
		createno: function (num) {
			var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
			var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

			if ((num = num.toString()).length > 9)
				return 'overflow';

			var n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
			if (!n) return;

			var str = '';
			str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
			str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
			str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
			str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
			str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + '' : '';
			return str;

		},

		// Get value in no and convert it into words
		notowordChange: function () {
			let leadLiftPDFModel = this.getView().getModel("leadLiftPDFModel");
			var grandtotal = leadLiftPDFModel.oData.quotevalue;
			// console.log("grandtotal",grandtotal);
			// var taxvalue=0;
			// var total = 0;

			// var taxvalue = leadLiftPDFModel.oData.isgst === "inclusive" ? leadLiftPDFModel.oData.quotevalue * 0.18 : 0;
			// var total = grandtotal - taxvalue;

			// console.log("taxvalue",taxvalue);
			// console.log("total",total);
			// console.log("grandtotal",grandtotal);

			console.log("grandtotal : ", grandtotal);
			var grandtotalfloor = Math.floor(grandtotal);
			var text = this.createno(grandtotalfloor);
			this.nettotalinwords = text;
		},

		/**
	   * Generate PDF for Purchase request Scrren
	   */


		generate: function () {
			const doc = new docx.Document({
				sections: [
					{
						properties: {},
						children: [
							new docx.Paragraph({
								children: [
									new docx.TextRun("Hello World"),
									new docx.TextRun({
										text: "Foo Bar",
										bold: true
									}),
									new docx.TextRun({
										text: "\tGithub is the best",
										bold: true
									})
								]
							})
						]
					}
				]
			});

			docx.Packer.toBlob(doc).then((blob) => {
				console.log(blob);
				saveAs(blob, "example.docx");
				console.log("Document created successfully");
			});
		}



	});

}, true);
