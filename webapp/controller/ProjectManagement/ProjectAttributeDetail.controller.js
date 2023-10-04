
sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/ui/model/Sorter',
	'sap/ui/elev8rerp/componentcontainer/services/ProjectManagement/Project.service',
	'sap/ui/elev8rerp/componentcontainer/utility/xlsx',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/controller/formatter/fragment.formatter',
	'sap/ui/elev8rerp/componentcontainer/services/ProjectManagement/AttributeList.service',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Masters/Masters.service',
	'sap/m/MessageToast',
], function (JSONModel, BaseController, Sorter, Projectservice, xlsx, commonService, formatter, AttributeListService, commonFunction, masterService, MessageToast) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.ProjectManagement.ProjectAttributeDetail", {
		formatter: formatter,
		onInit: async function () {

			//this.handleRouteMatched(null);
			var emptyModel = this.getModelDefault();
			var model = new JSONModel();
			model.setData({});
			this.getView().setModel(model, "attributetypeModel");
			var attributeSelectModel = new JSONModel();
			attributeSelectModel.setData({});
			this.getView().setModel(attributeSelectModel, "attributeSelectModel");

			var model = new JSONModel();
			model.setData({});
			this.getView().setModel(model, "activityModel");

			var model = new JSONModel();
			model.setData([{id :1 ,text :"yes"},{id :2,text :"No"},{id :3 ,text :"NA"}]);
			this.getView().setModel(model, "tristateModel");

			var editDocumentCollectionModel = new JSONModel();
			editDocumentCollectionModel.setData({});
			this.getView().setModel(model, "editDocumentCollectionModel");

			var currentContext = this;
			currentContext.resultArr = [];// image array
			currentContext.resultpdfArr = [];// pdf array
			currentContext.DeleteDocumentArr = [];//in this array we  push index of array we want to delete
			currentContext.getActivitydetail({ projectid: 60, field: "activity" })

		},

		getModelDefault: function () {
			return {
				image_url: null
			}
		},

		onBeforeRendering: async function () {

			let currentContext = this;

			let model = this.getView().getModel("attributetypeModel");
			let attributeSelectModel = this.getView().getModel("attributeSelectModel");
			let AttributeDetailModel = this.getView().getModel("AttributeDetailModel").getData();

			let attributeObj = {};
			currentContext.globalAttributeObj = {}

			masterService.getReferenceByTypeCode({ typecode: "InputAttribute" }, function (data) {
				data[0].forEach((ele) => {
					attributeObj[ele.description] = ele.id;
					currentContext.globalAttributeObj[ele.description] = null;
				});

				var selectModel = new sap.ui.model.json.JSONModel();

				model.setData(data[0]);

				if (AttributeDetailModel.attributetypeids == null) {
					attributeSelectModel.setData(attributeObj);
				}
				else {
					let obj = {}
					for (let ele of data[0]) {
						AttributeDetailModel.attributetypeids.split(",").indexOf(`${ele.id}`) != -1 ? obj[ele.description] = ele.id : "not push"
					}
					console.log(JSON.parse(AttributeDetailModel.attributevalue))
					currentContext.getView().getModel("AttributeDetailModel").setData({ ...JSON.parse(AttributeDetailModel.attributevalue), ...AttributeDetailModel })
					attributeSelectModel.setData(obj);
					currentContext.getDocumentCollectionDetails() // get document details
					currentContext.getView().byId("attributetype").setSelectedKeys(AttributeDetailModel.attributetypeids.split(","));
				}

				selectModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(selectModel, "attributetypeModel");

			});


		},


		getDocumentCollectionDetails: async function () {
			var oModel = new JSONModel();
			let currentContext=this;
			let AttributeDetailModel = this.getView().getModel("AttributeDetailModel").getData();

			// get document list
			// in this service document id is only pass but we don't use it in sp to filters the data so we only pass but never use
			if (AttributeDetailModel.Attachment == "true") {
				await Projectservice.getDocumentCollectionDetails({ projectid: AttributeDetailModel.projectid, stageid: AttributeDetailModel.id}, function (data) {
					var oConfig = sap.ui.getCore().getModel("configModel");
					data[0].forEach((document) => {
						if (document.document_id == 3) {
							document.image_url = oConfig.oData.webapi.docurl + document.document_url;
							currentContext.resultArr.push(document);

						}
						else {
							document.pdf_url = oConfig.oData.webapi.docurl + document.document_url;
							currentContext.resultpdfArr.push(document);
						}
					})
					console.log("data", data);
					if (data[0].length) {

						var oModel = new sap.ui.model.json.JSONModel();

						currentContext.getView().setModel(oModel, "editDocumentCollectionModel");

						var tblmodel = currentContext.getView().getModel("editDocumentCollectionModel");
						// tblmodel.oData.imgdata = currentContext.resultArr[0].imgdata;
						tblmodel.oData.image_url = currentContext.resultArr?.[0]?.image_url ?? null;
						tblmodel.oData.pdf_url = currentContext.resultpdfArr?.[0]?.pdf_url ?? null;
						tblmodel.oData.imageid = (currentContext.resultArr?.[0]?.image_url ?? null) == null ? null : 0;
						tblmodel.oData.pdfid = (currentContext.resultpdfArr?.[0]?.pdf_url ?? null) == null ? null : 0;
						tblmodel.oData.pdf_name = (currentContext.resultpdfArr?.[0]?.document_name ?? null) == null ? null : (currentContext.resultpdfArr?.[0]?.document_name);

						tblmodel.refresh();
					}
				})
			}


		},


		jsonObjectCreation: function () {
			let AttributeDetailModel = this.getView().getModel("AttributeDetailModel").getData();
			for (let ele in this.globalAttributeObj) {
				this.globalAttributeObj[ele] = (AttributeDetailModel[ele] == undefined || AttributeDetailModel[ele].trim() == "") ? null : AttributeDetailModel[ele];
			}
			AttributeDetailModel.attributevalue = JSON.stringify(this.globalAttributeObj);
		},
		// get project Activity and show in table
		getActivitydetail: function (obj) {
			var currentContext = this;
			Projectservice.getProjectdetail({ id: obj.projectid, field: 'activity' }, function (data) {
				console.log("data", data);
				data[0].map(function (value, index) {
					data[0][index].activestatus = value.isactive == 1 ? "Active" : "In Active";
					data[0][index].actualstartdate = data[0]?.[index]?.actualstartdate ?? null;
					data[0][index].actualenddate = data[0]?.[index]?.actualenddate ?? null;
				});
				var tblModel = currentContext.getView().getModel("activityModel");
				tblModel.setData(data[0]);
				tblModel.refresh();
			});
		},

		handleSelectionFinish: function (oEvt) {
			let AttributeDetailModel = this.getView().getModel("AttributeDetailModel");
			let attributeSelectModel = this.getView().getModel("attributeSelectModel");
			let selectedItems = oEvt.getParameter("selectedItems");
			let attributeids = [];
			let attributeObj = {};


			selectedItems.forEach((ele) => {
				attributeids.push(ele.getProperty("key"));
				attributeObj[ele.getProperty("text")] = ele.getProperty("key");
			})

			AttributeDetailModel.oData.attributetypeids = (attributeids.join(","));
			attributeSelectModel.setData(attributeObj);

		},

		functiondownload: async function (OEvent) {
			// let checkbox = OEvent.getSource();
			// let data = checkbox.data("mySuperExtraData");
			let currentContext = this;
			let document_name = "";
			let sUrl;

			var tblmodel = currentContext.getView().getModel("editDocumentCollectionModel");
			if (OEvent.mParameters.id.indexOf("image") != -1) {
				document_name = currentContext.resultArr[tblmodel.oData.imageid].document_name;
				sUrl = tblmodel.oData.image_url;
			}
			else {
				document_name = currentContext.resultpdfArr[tblmodel.oData.pdfid].document_name;
				sUrl = tblmodel.oData.pdf_url;
			}

			var oXHR = new XMLHttpRequest();
			oXHR.open("GET", sUrl, true);
			oXHR.responseType = "blob";

			oXHR.onload = function (event) {
				var blob = oXHR.response;

				// Create a temporary anchor element to initiate the download
				var link = document.createElement("a");
				link.href = URL.createObjectURL(blob);


				// Set the download attribute to specify the filename for the downloaded file
				link.setAttribute("download", document_name);

				// Trigger the click event on the anchor element
				link.click();

				// Clean up - revoke the object URL and remove the anchor element after the click event has been triggered
				URL.revokeObjectURL(link.href);
			};

			oXHR.send();


		},

		handleValueChange: async function (oEvent) {

			var oFileUploader = oEvent.getSource();
			var aFiles = oEvent.getParameter("files");
			var currentContext = this;
			var tblmodel = currentContext.getView().getModel("editDocumentCollectionModel");

			var oFileUploader = this.byId("fileUploader");
			let returnArr = await currentContext.createImageFormate(oFileUploader, aFiles);
			tblmodel.refresh();
		},


		createImageFormate: function (oFileUploader, aFiles) {
			var currentContext = this;
			var tblmodel = currentContext.getView().getModel("editDocumentCollectionModel");
			let AttributeDetailModel = this.getView().getModel("AttributeDetailModel").getData();

			let imageNameArr = [];
			let imageNameIndex = 0;


			for (let i = 0; i < aFiles.length; i++) {
				var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[i];
				var BASE64_MARKER = 'data:' + file.type + ';base64,';

				imageNameArr.push(file.name);

				var reader = new FileReader();
				reader.onload = (
					function (theFile) {
						return function (evt) {

							var base64Index = evt.target.result.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
							var base64 = evt.target.result.substring(base64Index);
							var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
							if (oStorage.get("myLocalData")) {
								var oData = oStorage.get("myLocalData");
								userId = oData.Collection[0].userId;
							}
							let ramdomstring = currentContext.generateRandomString(3);
							var imgdata = {
								// "Banfn" : var_banfn,
								"Filename": imageNameArr[imageNameIndex],
								"Filetype": BASE64_MARKER,
								"Attachment": base64,
							};

							currentContext.resultArr.push({
								imgdata: imgdata,
								image_url: BASE64_MARKER + base64,
								imageid: i,
								document_Unique: ramdomstring,
								document_id: 3,
								document_name: imgdata.Filename
							})

							imageNameIndex++;
							AttributeDetailModel.Attachment = "true";   // we need to true as string because trim function which is use in jsoncreation 
							tblmodel.oData.imgdata = currentContext.resultArr[0].imgdata;
							tblmodel.oData.image_url = currentContext.resultArr[0].image_url;
							tblmodel.oData.imageid = 0;
							tblmodel.refresh();


						};
					})(file);
				reader.readAsDataURL(file);

			}
		},
		createPdfFormate: function (oFileUploader, aFiles) {
			var currentContext = this;
			var tblmodel = currentContext.getView().getModel("editDocumentCollectionModel");
			let AttributeDetailModel = this.getView().getModel("AttributeDetailModel").getData();

			let pdfNameArr = [];
			let pdfNameIndex = 0;


			for (let i = 0; i < aFiles.length; i++) {
				var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[i];
				var BASE64_MARKER = 'data:' + file.type + ';base64,';

				pdfNameArr.push(file.name);

				var reader = new FileReader();
				reader.onload = (
					function (theFile) {
						return function (evt) {

							var base64Index = evt.target.result.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
							var base64 = evt.target.result.substring(base64Index);
							var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
							if (oStorage.get("myLocalData")) {
								var oData = oStorage.get("myLocalData");
								userId = oData.Collection[0].userId;
							}
							let ramdomstring = currentContext.generateRandomString(3);
							var imgdata = {
								// "Banfn" : var_banfn,
								"Filename": pdfNameArr[pdfNameIndex],
								"Filetype": BASE64_MARKER,
								"Attachment": base64,
							};

							currentContext.resultpdfArr.push({
								imgdata: imgdata,
								pdf_url: BASE64_MARKER + base64,
								imageid: i,
								document_Unique: ramdomstring,
								document_id: 5,
								document_name: imgdata.Filename
							})

							pdfNameIndex++;
							AttributeDetailModel.Attachment = "true";   // we need to true as string because trim function which is use in jsoncreation 
							tblmodel.oData.pdfdata = currentContext.resultpdfArr[0].imgdata;
							tblmodel.oData.pdf_url = currentContext.resultpdfArr[0].pdf_url;
							tblmodel.oData.pdfid = 0;
							tblmodel.oData.pdf_name = currentContext.resultpdfArr[0].document_name;
							tblmodel.refresh();


						};
					})(file);
				reader.readAsDataURL(file);
			}
		},

		generateRandomString: function (length) {
			const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			let result = '';

			for (let i = 0; i < length; i++) {
				const randomIndex = Math.floor(Math.random() * characters.length);
				result += characters.charAt(randomIndex);
			}

			const timestamp = Date.now().toString();
			const uniqueString = result + timestamp;

			return uniqueString;
		},

		// Usage example:

		forwardPress: function (OEvent) {
			let currentContext = this;
			var tblmodel = currentContext.getView().getModel("editDocumentCollectionModel");
			let count;
			let message = "pdf";
			let noOfdocumet;
			if (OEvent.mParameters.id.indexOf("btnForpdf") == -1) {
				message = "image";
				count = tblmodel.oData.imageid;
				noOfdocumet = (currentContext.resultArr.length - 1);
			}
			else {
				count = tblmodel.oData.pdfid;
				noOfdocumet = (currentContext.resultpdfArr.length - 1);

			}
			if (count == null) {
				MessageToast.show(`No ${message} to preview`);
				return true;
			}

			if (count >= noOfdocumet) {
				MessageToast.show(`it is last ${message}`);
				return true;
			}
			else {
				count++;
			}
			if (message == "image") {

				tblmodel.oData.imgdata = currentContext.resultArr[count].imgdata;
				tblmodel.oData.image_url = currentContext.resultArr[count].image_url;
				tblmodel.oData.imageid = count;
			}

			else {
				tblmodel.oData.imgdata = currentContext.resultpdfArr[count].imgdata;
				tblmodel.oData.pdf_url = currentContext.resultpdfArr[count].pdf_url;
				tblmodel.oData.pdfid = count;
				tblmodel.oData.pdf_name = currentContext.resultpdfArr[count].document_name;

			}

			tblmodel.refresh();
		},

		backwardPress: function (OEvent) {

			let currentContext = this;
			var tblmodel = currentContext.getView().getModel("editDocumentCollectionModel");
			let count;
			let message = "pdf";
			let noOfdocumet;
			if (OEvent.mParameters.id.indexOf("btnBackpdf") == -1) {
				message = "image";
				count = tblmodel.oData.imageid;
				noOfdocumet = (currentContext.resultArr.length - 1);
			}
			else {
				count = tblmodel.oData.pdfid;
				noOfdocumet = (currentContext.resultpdfArr.length - 1);

			}
			if (count == null) {
				MessageToast.show(`No ${message} to preview`);
				return true;
			}

			if (count == 0) {
				MessageToast.show(`it is last ${message}`);
				return true;
			}
			else {
				count--;
			}
			if (message == "image") {

				tblmodel.oData.imgdata = currentContext?.resultArr[count]?.imgdata ?? null;
				tblmodel.oData.image_url = currentContext.resultArr[count].image_url;
				tblmodel.oData.imageid = count;
			}

			else {
				tblmodel.oData.imgdata = currentContext?.resultpdfArr[count]?.imgdata ?? null;
				tblmodel.oData.pdf_url = currentContext.resultpdfArr[count].pdf_url;
				tblmodel.oData.pdfid = count;
				tblmodel.oData.pdf_name = currentContext.resultpdfArr[count].document_name;

			}

			tblmodel.refresh();
		},

		onDeleteDocument: function (OEvent) {


			let currentContext = this;
			var tblmodel = currentContext.getView().getModel("editDocumentCollectionModel");
			let count;
			let message = "pdf";
			let resultArr;
			if (OEvent.mParameters.id.indexOf("btndeletepdf") == -1) {
				message = "image";
				count = tblmodel.oData.imageid;
				resultArr = currentContext.resultArr;
			}
			else {
				count = tblmodel.oData.pdfid;
				resultArr = (currentContext.resultpdfArr);
			}
			if (count == null) {
				MessageToast.show(`No ${message}  available to delete `);
				return true;
			}

			if (resultArr[count].id != undefined) {
				currentContext.DeleteDocumentArr.push(resultArr[count].id)
				resultArr.splice(count, 1);

			}
			else {
				resultArr.splice(count, 1);
			}


			if (resultArr.length == 0) {
				tblmodel.oData.imgdata = null;
				tblmodel.oData[`${message}_url`] = null;
				tblmodel.oData[`${message}id`] = null;

			}
			else {
				tblmodel.oData.imgdata = resultArr[0].imgdata;
				tblmodel.oData[`${message}_url`] = resultArr[0][`${message}_url`];
				tblmodel.oData[`${message}id`] = 0;
				message == "pdf" ? (tblmodel.oData[`${message}_name`] = resultArr[0].document_name) : "not change";

			}


			tblmodel.refresh();
		},


		onDeleteDocumentSave: function () {
			let currentContext = this;

			currentContext.DeleteDocumentArr.forEach((deleteImageDetail) => {
				Projectservice.deleteDocumentCollectionDetails({ "id": deleteImageDetail }, function (obj) {

				})
			});
			MessageToast.show("Document delete sucessfully");

		},


		handleValueChangePDF: function (oEvent) {
			var oFileUploader = this.byId("fileUploaderpdf");
			var aFiles = oEvent.getParameter("files");

			this.createPdfFormate(oFileUploader, aFiles)

		},


		handleUploadCompletePDF: function (oEvent) {
			var oFileUploader = this.byId("fileUploaderpdf");
			var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
			console.log("---------file---------", file);

			//oFileUploader.getFocusDomRef().files[0];
			var filename = 'product-' + window.parentid + '.pdf';


			var reader = new FileReader();
			reader.onload = function (evt) {
				var pdfUrl = evt.target.result;
				// Update the pdf_url property of the model with the uploaded PDF URL
				var oModel = this.getView().getModel("editDocumentCollectionModel");
				oModel.setProperty("/pdf_url", pdfUrl);

				console.log("------------editDocumentCollectionModel------------", oModel);
			}.bind(this);
			reader.readAsDataURL(file);
		},



		onSave: function () {
			// if (this.validateForm()) {
			let currentContext = this;
			let oModel = this.getView().getModel("AttributeDetailModel").oData;

			var parentModel = currentContext.getView().getModel("editDocumentCollectionModel").oData;
			let objPush = {
				id: null,
				stageid: oModel.stageid,
				stageid: oModel.activityid,
				projectid: oModel.projectid,
				companyid: commonService.session("companyId"),
				userid: commonService.session("userId"),
				parentstageid: null
			}


			oModel["companyid"] = commonService.session("companyId");
			//oModel["userid"] = commonService.session("userId");

			// create json object  and  pass it  for save json in service
			currentContext.jsonObjectCreation()


			AttributeListService.saveAttributeList(oModel, function (savedata) {

				objPush.id = savedata.id  // attribute id in project_attributes

				// get   updated attribute list
				AttributeListService.getAttributeList({ projectid: oModel.projectid }, function (data) {
					console.log("data", data);
					var attributeModel = currentContext.getView().getModel("attributeModel");
					attributeModel.setData(data[0]);
					console.log("--------------nitblmodel------------", attributeModel);
					attributeModel.refresh();
				});


				let documentSaveObj = {
					stageid: savedata.id,// attribute id in project_attributes  table
					parentstageid: oModel.activityid,  //activity id
					projectid: oModel.projectid,
					type: "attribute",
					companyid: commonService.session("companyId"),
					userid: commonService.session("userId"),

				}

				currentContext.resultArr.concat(currentContext.resultpdfArr).forEach((document) => {
					if (document.id == undefined) {
						Projectservice.saveDocumentCollectionDetails({ ...documentSaveObj, ...document }, function (obj) {
							var saveMsg = "Data Saved Successfully.";
							var editMsg = "Data Updated Successfully";
							var ErrorMsg = "Data not Saved Successfully";
							var message = parentModel.id == null ? saveMsg : editMsg
							if (message == null) {
								MessageToast.show(ErrorMsg);
							}
							else {
								MessageToast.show(message);
							}
						})
					}
				});

				currentContext.DeleteDocumentArr.length > 0 ? currentContext.onDeleteDocumentSave() : "No image is available to delete";

			});





			currentContext.onCancel();


		},


		validateForm: function () {
			var isValid = true;
			var ItemNameMsg = this.resourcebundle().getText("feedMillBOMvalidMsgItem");
			var qtyMsg = this.resourcebundle().getText("feedMillBOMvalidMsgQty");
			var unitcostMsg = this.resourcebundle().getText("feedMillBOMvalidMsgUnitCost");
			var matTypeMsg = "Material type is required"

			if (!commonFunction.isRequired(this, "txtitemname", ItemNameMsg))
				isValid = false;


			if (!commonFunction.isRequired(this, "textqty", qtyMsg))
				isValid = false;

			if (!commonFunction.isRequired(this, "textunitcost", unitcostMsg))
				isValid = false;

			if (!commonFunction.isSelectRequired(this, "txtMaterialType", matTypeMsg))
				isValid = false;
			if (!commonFunction.isDecimal(this, "textqty"))
				isValid = false;


			return isValid;
		},
		resourcebundle: function () {
			var currentContext = this;
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},


		onDelete: function () {
			var currentContext = this;
			var oModel = this.getView().getModel("DetailModel").oData;
			oModel["companyid"] = commonService.session("companyId");
			oModel["userid"] = commonService.session("userId");
			Projectservice.deleteProjectActivityDetail(params, function (data) {
				var oModel = currentContext.getView().getModel("projectList");
				oModel.setData(data[0]);
				oModel.refresh();
			});

		},

		// function call select stage starting toggle yes
		isstartchange: function () {
			let DetailModeldata = this.getView().getModel("DetailModel");
			console.log(DetailModeldata.oData.isstarted);
			this.getView().byId("inpWarningLevel").setEnabled(DetailModeldata.oData.isstarted == true);
			console.log(DetailModeldata);

			DetailModeldata.oData.isstarted == true ? DetailModeldata.oData.completionper = 0 : "null";
			console.log(DetailModeldata);


			DetailModeldata.oData.actualstartdate = this.dateFormatter(null);
			DetailModeldata.refresh();

			console.log(DetailModeldata);

		},

		dateFormatter: function (date) {


			const inputDateTime = date == null ? new Date() : new Date(date);
			const options = {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: false,
				timeZone: 'Asia/Kolkata'
			};
			const indianTime = inputDateTime.toLocaleString('en-IN', options).replace(/\//g, '-').replace(',', '');

			const [datePart, timePart] = indianTime.split(' ');

			// Split the date and time parts
			const [day, month, year] = datePart.split('-');
			const [hour, minute, second] = timePart.split(':');

			// Reformat the date
			const formattedDate = `${year}-${month}-${day}`;

			// Reformat the time
			const formattedTime = `${hour}:${minute}:${second}`;

			// Combine the date and time
			const formattedDateTime = `${formattedDate}`;

			return formattedDateTime;


		},

		// function call on stage percentage change
		onsliderchange: function () {
			let currentContext = this;
			let oModel = this.getView().getModel("DetailModel").oData;
			oModel.actualenddate = null;
			oModel.Actualcompletiondays = null;

			if (oModel.completionper == 100) {

				oModel.actualenddate = this.dateFormatter(null);

				const date1 = new Date(oModel.actualenddate);
				const date2 = new Date('2023-06-10 23:23:38');

				const diffTime = Math.abs(date2 - date1);

				// Convert the time difference to days
				oModel.actualcompletiondays = (diffTime / (1000 * 60 * 60 * 24)).toFixed(1);

			}

			this.getView().getModel("DetailModel").refresh();

		},

		// function for calculate end date or completion day
		dayCalculation: async function (oEvent) {

			let oThis = this;
			let DetailModel = oThis.getView().getModel("DetailModel");
			let ItemConsumptiondata = DetailModel.oData;
			if (oEvent.mParameters.id.match("endDate") != null) {
				var parts = ItemConsumptiondata.startdate.split('/');
				let startdate = Date.parse(new Date(parts[2], parts[1], parts[0]));

				parts = ItemConsumptiondata.enddate.split('/');
				let enddate = Date.parse(new Date(parts[2], parts[1], parts[0]));// get  difference in start date and end date in millseconds

				ItemConsumptiondata.completiondays = parseInt((enddate - startdate) / (86400 * 1000));// Days
			}
			else {
				var endDate = new Date(commonFunction.getDate(ItemConsumptiondata.startdate));
				endDate.setDate(endDate.getDate() + parseInt(ItemConsumptiondata.completiondays));

				let originalDate = new Date(endDate);
				let dateFormatter = sap.ui.core.format.DateFormat.getInstance({ pattern: "dd/MM/yyyy" });
				let enddate = dateFormatter.format(originalDate);

				ItemConsumptiondata.enddate = enddate;

			}

			DetailModel.refresh();

		},

		// function call on activity select
		ActivitySelect: function (oEvent) {
			// var aContexts = oEvent.getParameter("selectedContexts");
			// var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			// currentContext.getProjectDetails(selRow[0].id);
			let oModel = this.getView().getModel("AttributeDetailModel").oData;
			let activityModel = this.getView().getModel("activityModel").oData;

			//  inthis we stage id  under which our activity is present and we add attribute agains that activity
			activityModel.forEach((ele) => {
				if (ele.stageid == oModel.activityid) {
					oModel.stageid = ele.parentid
				}
			})
			console.log(oModel);
		},



		onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---projectdetail--fclProjectActivity");
			//("it  is fixed"---" name of  main control in manifest.json file in pattern"---"id of view in that particular view code")

          // (  it_is_Fixed---ViewId_in_manifest.Json--it_is_fixed)
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		}




	});
}, true);
