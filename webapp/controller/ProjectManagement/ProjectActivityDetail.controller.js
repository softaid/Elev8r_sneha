
sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/ui/model/Sorter',
	'sap/ui/elev8rerp/componentcontainer/services/ProjectManagement/Project.service',
	'sap/ui/elev8rerp/componentcontainer/utility/xlsx',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/controller/formatter/fragment.formatter',
	'sap/ui/elev8rerp/componentcontainer/services/Company/ManageUser.service',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/m/MessageToast',
], function (JSONModel, BaseController, Sorter, Projectservice, xlsx, commonService, formatter, ManageUserService, commonFunction, MessageToast) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.ProjectManagement.ProjectActivityDetail", {
		formatter: formatter,
		onInit: function () {
			//this.handleRouteMatched(null);
			var emptyModel = this.getModelDefault();
			var model = new JSONModel();
			model.setData(emptyModel);
			this.getView().setModel(model, "editDocumentCollectionModel");

			let roleModel = new JSONModel();
			roleModel.setData({});
			this.getView().setModel(roleModel, "roleModel");

			this.actualEndDateRef = null;

			var currentContext = this;
			currentContext.resultArr = [];// image array
			currentContext.resultpdfArr = [];// pdf array
			currentContext.DeleteDocumentArr = [];//in this array we  push index of array we want to delete

		},

		getModelDefault: function () {
			return {
				image_url: null
			}
		},

		onBeforeRendering: async function () {

			let ActivityDetailModel = this.getView().getModel("ActivityDetailModel").oData;
			this.getView().getModel("stageModel").oData;
			var currentContext = this;


			if (ActivityDetailModel.id != undefined) {
				currentContext.actualEndDateRef = ActivityDetailModel?.actualenddate ?? null;


				// get document list
				await Projectservice.getDocumentCollectionDetails({ projectid: ActivityDetailModel.projectid, stageid: ActivityDetailModel.stageid }, function (data) {
					var oConfig = sap.ui.getCore().getModel("configModel");
					if (data[0].length > 0) {
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

						var tblmodel = currentContext.getView().getModel("editDocumentCollectionModel");
						tblmodel.oData.image_url = currentContext.resultArr?.[0]?.image_url ?? null;
						tblmodel.oData.pdf_url = currentContext.resultpdfArr?.[0]?.pdf_url ?? null;
						tblmodel.oData.imageid = (currentContext.resultArr?.[0]?.image_url ?? null) == null ? null : 0;
						tblmodel.oData.pdfid = (currentContext.resultpdfArr?.[0]?.pdf_url ?? null) == null ? null : 0;
						tblmodel.oData.pdf_name = (currentContext.resultpdfArr?.[0]?.document_name ?? null) == null ? null : (currentContext.resultpdfArr?.[0]?.document_name);

						tblmodel.refresh();
					}
				})
			}
			currentContext.getUserByDepartment(ActivityDetailModel?.departmentid ?? "notSelect");

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

		getUserByDepartment: function (departmentid) {
			let currentContext = this;
			if (departmentid != "notSelect") {
				ManageUserService.getUserByDepartment({ departmentid: departmentid }, function (data) {
					console.log(data);
					let roleModel = currentContext.getView().getModel("roleModel");
					roleModel.setData(data[0]);
				})
			}
			else {
				MessageToast.show("Please Select Stage to set assign to and approve by");
			}

		},

		onStageChange: function (OEvent) {
			let currentContext = this;
			let ActivityDetailModel = currentContext.getView().getModel("ActivityDetailModel").oData;
			Projectservice.getStageOrActivityDetail({ parentid: ActivityDetailModel.parentid, projectid: ActivityDetailModel.projectid }, function (data) {
				currentContext.getUserByDepartment(data?.[0][0]?.departmentid ?? "notSelect");
			})

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

			this.createPdfFormate(oFileUploader, aFiles);

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

		handleStageCompPer: function () {
			let currentContext = this;
			let oModel = currentContext.getView().getModel("ActivityDetailModel").oData;

			// if intially actual end date is null but if actual end date during save is null means we  we don't need to update  total stage completion percentage  and if final date is not null means add stagecompletionpercentage to total stage completion percentage
			if (currentContext.actualEndDateRef == null) {
				oModel.stageDetail.stagecompletionpercentage = oModel.actualenddate == null ? oModel.stageDetail.stagecompletionpercentage : Math.abs(+oModel.stageDetail.stagecompletionpercentage + (+oModel.stagecompletionpercentage))
			}
			else {
				// if intially actual end date is not null but if actual end date during save is not null means we  we don't need to update  total stage completion percentage  and if final date is  null means subtract stagecompletionpercentage to total stage completion percentage
				oModel.stageDetail.stagecompletionpercentage = oModel.actualenddate == null ? (+oModel.stageDetail.stagecompletionpercentage - (+oModel.stagecompletionpercentage)) : oModel.stageDetail.stagecompletionpercentage;

			}
			if (oModel.stageDetail.stagecompletionpercentage != oModel.stagecompletionpercentageRef) {
				const obj = {
					...oModel.stageDetail,
					startdate: (oModel.stageDetail.startdate != null) ? commonFunction.getDate(oModel.stageDetail.startdate) : oModel.stageDetail.startdate,
					enddate: (oModel.stageDetail.enddate != null) ? commonFunction.getDate(oModel.stageDetail.enddate) : oModel.stageDetail.enddate,
					actualstartdate: (oModel.stageDetail.actualstartdate != null) ? commonFunction.getDate(oModel.stageDetail.actualstartdate) : oModel.stageDetail.actualstartdate,
					actualenddate:  oModel.stageDetail.stagecompletionpercentage==100? commonFunction.getDate(oModel.actualenddate): (oModel.stageDetail.actualenddate != null)? commonFunction.getDate(oModel.stageDetail.actualenddate) : oModel?.stageDetail?.actualenddate??null,
					isactive: oModel.stageDetail.isactive === true ? 1 : 0,
					isstd: oModel.stageDetail.isstd === true ? 1 : 0,
					userid: commonService.session("userId"),
					stagecompletionpercentage: oModel.stageDetail.stagecompletionpercentage,
					fromreference: 0,
				}

				Projectservice.saveProjectActivityDetail(obj, function (savedata) {
					commonFunction.getStageDetail( oModel.projectid,currentContext);

				})



			}

		},

		onSave: function () {
			// if (this.validateForm()) {
			let currentContext = this;
			let oModel = this.getView().getModel("ActivityDetailModel").oData;

			var parentModel = currentContext.getView().getModel("editDocumentCollectionModel").oData;
			let objPush = {
				id: null,
				stageid: oModel?.stageid ?? null,
				projectid: oModel.projectid,
				companyid: commonService.session("companyId"),
				userid: commonService.session("userId"),
				parentstageid: oModel.parentid,
				type: "Activity"
			}

			currentContext.handleStageCompPer();
			{
				parentModel["id"] = null;
				parentModel["projectid"] = oModel.projectid;
				parentModel["companyid"] = commonService.session("companyId");
				parentModel["userid"] = commonService.session("userId");
				oModel.type = "Activity";
				oModel["companyid"] = commonService.session("companyId");
				oModel["userid"] = commonService.session("userId");
				oModel.type = "Activity";


				oModel.startdate = (oModel.startdate != null) ? commonFunction.getDate(oModel.startdate) : oModel.startdate;
				oModel.enddate = (oModel.enddate != null) ? commonFunction.getDate(oModel.enddate) : oModel.enddate;
				oModel.actualstartdate = (oModel.actualstartdate != null) ? commonFunction.getDate(oModel.actualstartdate) : oModel.actualstartdate;
				oModel.actualenddate = (oModel.actualenddate != null) ? commonFunction.getDate(oModel.actualenddate) : oModel.actualenddate;
				oModel.isactive = oModel.isactive === true ? 1 : 0;
				oModel.isstd = oModel.isstd === true ? 1 : 0;

				// when we add any stage or activity from project detail screen we only add those stage in reference and only for that particular project  the fromreference=0 this condition we check in project detail and reference also ...
				oModel.fromreference = 0;

				Projectservice.saveProjectActivityDetail(oModel, function (savedata) {
					objPush.stageid = savedata.id  //  get id of  new save activity  for document save
					currentContext.resultArr.concat(currentContext.resultpdfArr).forEach((document) => {
						if (document.id == undefined) {
							Projectservice.saveDocumentCollectionDetails({ ...objPush, ...document }, function (obj) {
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

					Projectservice.getProjectdetail({ id: oModel.projectid, field: "Activity" }, function (data) {
						console.log("data", data);
						data[0].map(function (value, index) {
							data[0][index].activestatus = value.isactive == 1 ? "Active" : "InActive";
						});
						let tblModel = currentContext.getView().getModel("activitymodel");
						tblModel.setData(data[0]);
						tblModel.refresh();
					})
				});

				currentContext.DeleteDocumentArr.length > 0 ? currentContext.onDeleteDocumentSave() : "No image is available to delete";
			}

			currentContext.onCancel();

			if (oModel.dependencyStatus == false) {

				MessageToast.show("Please need to first complete the prerequisite  stage for  starting the current stage");
			}


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
			var oModel = this.getView().getModel("ActivityDetailModel").oData;
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
			let ActivityDetailModeldata = this.getView().getModel("ActivityDetailModel");
			console.log(ActivityDetailModeldata.oData.isstarted);
			this.getView().byId("inpWarningLevel").setEnabled(ActivityDetailModeldata.oData.isstarted == true);
			console.log(ActivityDetailModeldata);

			ActivityDetailModeldata.oData.isstarted == true ? ActivityDetailModeldata.oData.completionper = 0 : "null";
			console.log(ActivityDetailModeldata);


			ActivityDetailModeldata.oData.actualstartdate = this.dateFormatter(null);
			ActivityDetailModeldata.refresh();

			console.log(ActivityDetailModeldata);

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
			let oModel = this.getView().getModel("ActivityDetailModel").oData;
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

			this.getView().getModel("ActivityDetailModel").refresh();

		},

		// function for calculate end date or completion day
		// dayCalculation: async function (oEvent) {

		// 	let oThis = this;
		// 	let ActivityDetailModel = oThis.getView().getModel("ActivityDetailModel");
		// 	let ItemConsumptiondata = ActivityDetailModel.oData;
		// 	if (oEvent.mParameters.id.match("endDate") != null) {
		// 		var parts = ItemConsumptiondata.startdate.split('/');
		// 		let startdate = Date.parse(new Date(parts[2], parts[1], parts[0]));

		// 		parts = ItemConsumptiondata.enddate.split('/');
		// 		let enddate = Date.parse(new Date(parts[2], parts[1], parts[0]));// get  difference in start date and end date in millseconds

		// 		ItemConsumptiondata.completiondays = parseInt((enddate - startdate) / (86400 * 1000));// Days
		// 	}
		// 	else {
		// 		var endDate = new Date(commonFunction.getDate(ItemConsumptiondata.startdate));
		// 		endDate.setDate(endDate.getDate() + parseInt(ItemConsumptiondata.completiondays));

		// 		let originalDate = new Date(endDate);
		// 		let dateFormatter = sap.ui.core.format.DateFormat.getInstance({ pattern: "dd/MM/yyyy" });
		// 		let enddate = dateFormatter.format(originalDate);

		// 		ItemConsumptiondata.enddate = enddate;

		// 	}

		// 	ActivityDetailModel.refresh();

		// },

		// function for calculate end date or completion day
		dayCalculation: async function (oEvent) {

			let oThis = this;
			let StageDetailModel = oThis.getView().getModel("ActivityDetailModel");
			let ItemConsumptiondata = StageDetailModel.getData();
			ItemConsumptiondata.startdate = (ItemConsumptiondata?.startdate ?? null) == null ? null : ItemConsumptiondata.startdate.trim() == "" ? null : ItemConsumptiondata.startdate;
			ItemConsumptiondata.enddate = (ItemConsumptiondata?.enddate ?? null) == null ? null : ItemConsumptiondata.enddate.trim() == "" ? null : ItemConsumptiondata.enddate;
			ItemConsumptiondata.completiondays = (ItemConsumptiondata?.completiondays ?? null) == null ? null : `${ItemConsumptiondata.completiondays}`.trim() == "" ? null : ItemConsumptiondata.completiondays;
			if ((ItemConsumptiondata.startdate == null || ItemConsumptiondata.enddate == null || ItemConsumptiondata.completiondays == null) && oEvent.mParameters.id.match("completionDay") == null) {
				ItemConsumptiondata.completiondays = null
			}

			if (ItemConsumptiondata.enddate != null && ItemConsumptiondata.startdate != null && oEvent.mParameters.id.match("endDate") != null) {

				var parts = ItemConsumptiondata.startdate.split('/');
				let startdate = Date.parse(new Date(parts[2], parts[1], parts[0]));

				parts = ItemConsumptiondata.enddate.split('/');
				let enddate = Date.parse(new Date(parts[2], parts[1], parts[0]));// get  difference in start date and end date in millseconds
				if ((enddate - startdate) >= 0) {
					ItemConsumptiondata.completiondays = `${Math.round((enddate - startdate) / (86400 * 1000))}`;// Days
				}
				else {
					MessageToast.show(`please select valide date`);
					ItemConsumptiondata.enddate = null;
					ItemConsumptiondata.completiondays = null;


				}
			}
			else if (ItemConsumptiondata.completiondays != null && ItemConsumptiondata.startdate != null && oEvent.mParameters.id.match("completionDay") != null) {
				var endDate = new Date(commonFunction.getDate(ItemConsumptiondata.startdate));
				endDate.setDate(endDate.getDate() + parseInt(ItemConsumptiondata.completiondays));

				let originalDate = new Date(endDate);
				let dateFormatter = sap.ui.core.format.DateFormat.getInstance({ pattern: "dd/MM/yyyy" });
				let enddate = dateFormatter.format(originalDate);

				ItemConsumptiondata.enddate = enddate;


			}
			else if (ItemConsumptiondata.enddate != null && ItemConsumptiondata.startdate != null && oEvent.mParameters.id.match("startDate") != null) {

				var parts = ItemConsumptiondata.startdate.split('/');
				let startdate = Date.parse(new Date(parts[2], parts[1], parts[0]));

				parts = ItemConsumptiondata.enddate.split('/');
				let enddate = Date.parse(new Date(parts[2], parts[1], parts[0]));// get  difference in start date and end date in millseconds
				if ((enddate - startdate) >= 0) {
					ItemConsumptiondata.completiondays = `${Math.round((enddate - startdate) / (86400 * 1000))}`;// Days
				}
				else {
					MessageToast.show(`please select valide date`);
					ItemConsumptiondata.startdate = null;
					ItemConsumptiondata.completiondays = null;


				}
			}


			oThis.getView().getModel("ActivityDetailModel").setData(ItemConsumptiondata);
			StageDetailModel.refresh();

		},

		dayCalculationActual: async function (oEvent) {
			let oThis = this;
			let StageDetailModel = oThis.getView().getModel("ActivityDetailModel");
			let ItemConsumptiondata = StageDetailModel.getData();
			ItemConsumptiondata.actualstartdate = (ItemConsumptiondata?.actualstartdate ?? null) == null ? null : ItemConsumptiondata.actualstartdate.trim() == "" ? null : ItemConsumptiondata.actualstartdate;
			ItemConsumptiondata.actualenddate = (ItemConsumptiondata?.actualenddate ?? null) == null ? null : ItemConsumptiondata.actualenddate.trim() == "" ? null : ItemConsumptiondata.actualenddate;
			ItemConsumptiondata.actualcompletiondays = (ItemConsumptiondata?.actualcompletiondays ?? null) == null ? null : `${ItemConsumptiondata.actualcompletiondays}`.trim() == "" ? null : ItemConsumptiondata.actualcompletiondays;

			if ((ItemConsumptiondata.actualstartdate == null || ItemConsumptiondata.actualenddate == null || ItemConsumptiondata.actualcompletiondays == null) && oEvent.mParameters.id.match("actualCompletionDay") == null) {
				ItemConsumptiondata.actualcompletiondays = null;
			}

			if (ItemConsumptiondata.actualenddate != null && ItemConsumptiondata.actualstartdate != null && oEvent.mParameters.id.match("actualendDate") != null) {
				var parts = ItemConsumptiondata.actualstartdate.split('/');
				let startdate = Date.parse(new Date(parts[2], parts[1], parts[0]));

				parts = ItemConsumptiondata.actualenddate.split('/');
				let enddate = Date.parse(new Date(parts[2], parts[1], parts[0]));// get  difference in start date and end date in millseconds
				if ((enddate - startdate) >= 0) {
					ItemConsumptiondata.actualcompletiondays = `${Math.round((enddate - startdate) / (86400 * 1000))}`;// Days
				}
				else {
					MessageToast.show(`please select valide date`);
					ItemConsumptiondata.actualenddate = null
					ItemConsumptiondata.actualcompletiondays = null
				}

			}
			else if (ItemConsumptiondata.actualenddate != null && ItemConsumptiondata.actualstartdate != null && oEvent.mParameters.id.match("ActualstartDate") != null) {
				var parts = ItemConsumptiondata.actualstartdate.split('/');
				let startdate = Date.parse(new Date(parts[2], parts[1], parts[0]));

				parts = ItemConsumptiondata.actualenddate.split('/');
				let enddate = Date.parse(new Date(parts[2], parts[1], parts[0]));// get  difference in start date and end date in millseconds
				if ((enddate - startdate) >= 0) {
					ItemConsumptiondata.actualcompletiondays = `${Math.round((enddate - startdate) / (86400 * 1000))}`;// Days
				}
				else {
					MessageToast.show(`please select valide date`);
					ItemConsumptiondata.actualstartdate = null
					ItemConsumptiondata.actualcompletiondays = null
				}

			}


			else if (ItemConsumptiondata.actualcompletiondays != null && ItemConsumptiondata.actualstartdate != null && oEvent.mParameters.id.match("actualcompletionDay") != null) {
				var endDate = new Date(commonFunction.getDate(ItemConsumptiondata.actualstartdate));
				endDate.setDate(endDate.getDate() + parseInt(ItemConsumptiondata.actualcompletiondays));

				let originalDate = new Date(endDate);
				let dateFormatter = sap.ui.core.format.DateFormat.getInstance({ pattern: "dd/MM/yyyy" });
				let enddate = dateFormatter.format(originalDate);

				ItemConsumptiondata.actualenddate = enddate;

			}

			oThis.getView().getModel("ActivityDetailModel").setData(ItemConsumptiondata);
			StageDetailModel.refresh();
		},



		onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---projectdetail--fclProjectActivity");
			//("it  is fixed"---" name of  main control in manifest.json file in pattern"---"id of view in that particular view code")
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		},



	});
}, true);
