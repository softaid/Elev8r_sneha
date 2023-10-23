sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/ui/model/Sorter',
	'sap/ui/elev8rerp/componentcontainer/services/LeadManagement/Lead.service',
	'sap/ui/elev8rerp/componentcontainer/services/ProjectManagement/ProjectTracking.service',
	'sap/ui/elev8rerp/componentcontainer/utility/xlsx',
	'sap/ui/elev8rerp/componentcontainer/services/ProjectManagement/Project.service',
	'sap/m/MessageToast',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/controller/formatter/fragment.formatter',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",



], function (JSONModel, BaseController, Sorter, leadService, ProjectTracking, xlsx, projectService, MessageToast, ocommonfunction, formatter, commonService,Filter, FilterOperator) {


	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.ProjectManagement.ProjectManagementAsPerStages", {

		formatter: formatter,

		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("activitymaster", "setDetailPage", this.setDetailPage, this);
			this.bus.subscribe("loaddata", "loadData", this.loadData, this);
			this.oFlexibleColumnLayout = this.byId("fclProjecttracking");
			ocommonfunction.getUserByRole(1, this);
			this.getStagesSequencwise();
			var model = new JSONModel();
			var emptyModel = new JSONModel();
			model.setData(emptyModel);
			this.getView().setModel(model, "partyModel");

			// this is DepartmentModel for Header
			var model = new JSONModel();
			model.setData([]);
			this.getView().setModel(model, "DepartmentModel");

			// this is stagePerModel for Header
			var stagestdPermodel = new JSONModel();
			stagestdPermodel.setData([]);
			this.getView().setModel(stagestdPermodel, "stagePerModel");

			let stageModel = new JSONModel();
			stageModel.setData({});
			this.getView().setModel(stageModel, "stageModel");

			// this is proWeaightagePerModel for Header
			var weightagestdPermodel = new JSONModel();
			weightagestdPermodel.setData([]);
			this.getView().setModel(weightagestdPermodel, "proWeaightagePerModel");

			// this is proStageModel for Header
			var stagestdPermodel = new JSONModel();
			stagestdPermodel.setData([]);
			this.getView().setModel(stagestdPermodel, "proStageModel");

			// this is dateModel for Header
			var datemodel = new JSONModel();
			datemodel.setData([]);
			this.getView().setModel(datemodel, "dateModel");

			// this is jobModel for Header
			let jobmodel = new JSONModel();
			jobmodel.setData({ count: 0 });
			this.getView().setModel(jobmodel, "jobModel");

			// this is projectModel for table
			this.count = 0;
			var projectModel = new JSONModel();
			projectModel.setData({ modelData: [] });
			this.getView().setModel(projectModel, "projectModel");

			var model = new JSONModel();
			model.setData(emptyModel);
			this.fnShortCut();

			this.projectStageObjectSave = {}// this array is use for saving

			this.projectDetailSave = []// this array is use for saving completion per , enddate sale engineer

			//In this function we get all data required for ProjectManagement Scrren
			this.bindTable();
		},


		getStagesSequencwise: function () {
			// let editPartyModel = this.getView().getModel("editPartyModel");
			let oThis = this;
			oThis.stageidObj = {};
			oThis.Sequenceweightage = {};
			projectService.getAllstagesSequencewise(function (data) {
				data[0].map((result, index) => {
					let stagename = `Sequence${index + 1}`;
					let stageweightage = `Sequence${index + 1}weightage`;
					oThis.stageidObj[stagename] = result.stageid;
					oThis.Sequenceweightage[stageweightage] = result.projectper
				})

				var proWeaightagePerModel = new JSONModel();
				proWeaightagePerModel.setData(oThis.Sequenceweightage);
				oThis.getView().setModel(proWeaightagePerModel, "proWeaightagePerModel");
			});



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

		//get all data Stages, Departments, Stagepercentage, StartDate,EndDate, SI manager, NI manager, project Dates for all projects 
		bindTable: async function () {

			let oThis = this;
			oThis.orderArray = [];
			oThis.projectWeightagearray = [];
			oThis.ProjectDepartment = [];
			oThis.datePickerArr = [];
			let count=false;



			let projectModelArray = [];

			// it set startdate, enddate , weightage of stages in projectModel
			await projectService.getAllProjectsDetailFinal(async function (data) {


				await projectService.getAllProjectEndDateDetailFinal(async function (projectEndDateData) {

					await projectService.getAllProjectsProjWeightageDetailFinal(async function (projectWeightagedata) {
						oThis.resultProjectWeight_Department = []
						if (data[0].length) {
							let aRowsCount = [];
							aRowsCount.push({
								rowsCount: data[0].length
							});
							// Generate Dynamic Qutation Revisions
							let oRowsCount = new JSONModel();
							oRowsCount.setData(aRowsCount[0]);
							console.log("oRowsCountProjects", oRowsCount);
							oThis.getView().setModel(oRowsCount, "projectrowcount_model");


							for (let main = 0; main < data[0].length; main++) {
								let obj = {};
								let objectFordatepicker = {}
								let projectWeightObj = {};
								let projectid = data[0][main].projectid;


								// loop for project detail data
								for (let i = 0; i < ((data.length - 1)); i++) {
									data[i].some((projectdetail) => {
										if (projectdetail.projectid == projectid) {
											obj = { ...(obj), ...(projectdetail) };
											return true;
										}
									})
								};


								// loop for project end data
								for (let i = 0; i < ((projectEndDateData.length) - 1); i++) {
									projectEndDateData[i].some((projectenddate) => {
										if (projectenddate.projectid == projectid) {
											obj = { ...(obj), ...(projectenddate) }
										}
									})
								};

								objectFordatepicker = JSON.parse(JSON.stringify(obj));  //Array for datepicker

								// loop for project weightage
								for (let i = 0; i < ((projectWeightagedata.length - 1)); i++) {
									projectWeightagedata[i].some((projectWeight) => {
										if (projectWeight.projectid == projectid) {
											obj = { ...(obj), ...(projectWeight),count}
											projectWeightObj = { ...projectWeightObj, ...projectWeight }
											return true;
										}
									})
								}

								oThis.projectWeightagearray.push(projectWeightObj);
								oThis.datePickerArr.push(objectFordatepicker);

								projectModelArray.push(obj);


							}
						}


						let projectModelOne = oThis.getView().getModel("projectModel");
						projectModelOne.setData({ modelData: projectModelArray });
						oThis.getView().setModel(projectModelOne, "projectModel")
						console.log("------------------projectModel------------------", projectModelOne);
						oThis.noOfActualStageInProject(oThis);
						oThis.noOfJobCalculation();
						let projectDetailArr = [];

						for (let projectdetail of projectModelArray) {
							oThis.orderArray.push(projectdetail.orderno);
							projectDetailArr.push({});

						}

						let dateModel = oThis.getView().getModel("dateModel");
						dateModel.setData({ projectDetailArr: projectDetailArr })

					})
				})

			})

			// it is set  stage wise  department  in DepartmentModel
			await projectService.getAllProjectDepartmentDetailFinal(async function (projectDepartmentdata) {

				let obj = {};
				// loop for project end data
				for (let i = 0; i < ((projectDepartmentdata.length) - 1); i++) {

					obj = { ...(obj), ...(projectDepartmentdata[i][0]) }
				}


				let departmentModel = oThis.getView().getModel("DepartmentModel");
				departmentModel.setData(obj);
				oThis.getView().setModel(departmentModel, "DepartmentModel");
				console.log("------------------DepartmentModel------------------", departmentModel);
			})

			//get stage name and set in stageModel
			await projectService.getAllProjectstageDetail(function (projectStagedata) {
				let obj = {};
				// loop for project end data
				for (let i = 0; i < ((projectStagedata.length) - 1); i++) {

					obj = { ...(obj), ...(projectStagedata[i][0]) }
				}

				let stageModel = oThis.getView().getModel("stageModel");
				stageModel.setData(obj);
				oThis.getView().setModel(stageModel, "stageModel");
				console.log("------------------stageModel------------------", stageModel);

				let model = oThis.getView().getModel("RoleModel");
				console.log(model)
			})

		},

		noOfActualStageInProject: function (oThis) {
			oThis.projectWeightObject = {};

			// [{projectid:23,sequence1weightage:23,sequence2weightage:1,....},{},{}]
			oThis.projectWeightagearray.map((projectWeight) => {
				let projectWeightArrayWithKey = [];
				let projectid = `${projectWeight.projectid}`;
				Object.entries(projectWeight).map((projectWeightEle) => {
					// It is condition for only  sequence1 only push not  peojectid field is push
					if ((projectWeightEle[0].indexOf("weightage") != -1) && projectWeightEle[1] != null) {
						let pushingField = projectWeightEle[0].replace("weightage", "");
						projectWeightArrayWithKey.push(pushingField);
					}
					return 1;
				})
				oThis.projectWeightObject[projectid] = projectWeightArrayWithKey.sort(function (a, b) {
					const numA = parseInt(a.match(/\d+/)[0]);
					const numB = parseInt(b.match(/\d+/)[0]);

					return numA - numB;
				});
			});
		},

		setDetailPage: function (channel, event, data) {
			this.detailView = sap.ui.view({
				viewName: "sap.ui.elev8rerp.componentcontainer.view.ProjectManagement." + data.viewName,
				type: "XML"
			});

			this.detailView.setModel(data.viewModel, "viewModel");
			this.oFlexibleColumnLayout.removeAllMidColumnPages();
			this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
		},

		onListItemPress: function (oEvent) {
			var viewModel = oEvent.getSource().getBindingContext("PActivityMasterModel");
			var model = { "id": viewModel.getProperty("id") }
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("activitymaster", "setDetailPage", { viewName: "ProjectDetail", viewModel: model });
		},

		onAddNew: function (oEvent) {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("activitymaster", "setDetailPage", { viewName: "ProjectDetail" });
		},

		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");
			var contains = sap.ui.model.FilterOperator.Contains;
			var columns = ['projectname', 'milestone', 'status'];
			var filters = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, contains, sQuery);
			}),
				false);

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [filters];
			}

			this.getView().byId("MyTableId").getBinding("items").filter(oTableSearchState, "Application");
		},


		_filter: function () {
			var oFilter = null;

			if (this._oGlobalFilter) {
				oFilter = new Filter([this._oGlobalFilter], true);
			} else if (this._oGlobalFilter) {
				oFilter = this._oGlobalFilter;
			}

			this.byId("MyTableId").getBinding().filter(oFilter, "Application");
		},

		filterGlobally: function (oEvent) {
			var sQuery = oEvent.getParameter("query");
			console.log("-----------------sQuery---------------", sQuery);
			this._oGlobalFilter = null;

			if (sQuery) {
				this._oGlobalFilter = new Filter([
					new Filter("orderno", FilterOperator.EQ, sQuery),
					new Filter("projectname", FilterOperator.EQ, sQuery),
					new Filter("modelname", FilterOperator.EQ, sQuery),
					new Filter("niengineer", FilterOperator.EQ, sQuery),
					new Filter("salesengineer", FilterOperator.EQ, sQuery)
				], false);
			}

			this._filter();
		},

		onSort: function (oEvent) {
			this._bDescendingSort = !this._bDescendingSort;
			var oView = this.getView(),
				oTable = oView.byId("tblProjectMaster"),
				oBinding = oTable.getBinding("items"),
				oSorter = new Sorter("partyname", this._bDescendingSort);
			oBinding.sort(oSorter);
		},

		loadData: function () {
			var currentContext = this;
			ProjectTracking.getAllProjectTracking(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(oModel, "PActivityMasterModel");
				console.log("PActivityMasterModel", oModel);
			});
		},


		onCheckBoxSelect: async function (OEvent) {
			// this.count=0;
			let oThis = this;
			let checkbox = OEvent.getSource();
			let data = checkbox.data("mySuperExtraData");
			this.count = 1;


			let jobModel = this.getView().getModel('jobModel').oData;
			let model = this.getView().getModel("projectModel").oData;

			// name of the stage start date in the project model  in sequence in array 


			let resultarr = data.split("_");

			let resultColumn = parseInt(resultarr[0]);  //  column

			let resultingRow = parseInt(resultarr[1]);

			let resultDateSelction = (resultarr[2]);

			let resultRow = (oThis.orderArray.indexOf(resultingRow)); // Row

			// it is use  find next stage of our current stage
			let projectindex = oThis.projectWeightObject[model.modelData[resultRow].projectid].indexOf(`Sequence${resultColumn}`)

			let endStage = oThis.projectWeightObject[model.modelData[resultRow].projectid][(projectindex + 1)];

			let result_column_field_End = `Sequence${resultColumn}enddate`;//end date of current stage field name in view
			let result_column_field_Start = `${endStage}startdate`; // Start date of stage next to current  stage field name in view
			// current date logic start
			let currentDate = new Date();
			var resultDate = ocommonfunction.setTodaysDate(currentDate);
			// current date logic ends Sequence1weightage

			//functionality of inserting property in projectStageObjectSave
			let projectid = `${model.modelData[resultRow].projectid}`;

			oThis.projectStageObjectSave[projectid] = oThis.projectStageObjectSave?.[projectid] ?? [];


			let stageweightname = `Sequence${resultColumn}weightage`;// name of current stage project weight 

			// the project weight add  for stage completion
			let projectWeightAdd = 0;
			oThis.projectWeightagearray.some((projectWeight) => {
				if (projectWeight.projectid == model.modelData[resultRow].projectid) {
					projectWeightAdd = (projectWeight[stageweightname])
					return true;
				}

			})

			if (resultDateSelction == "start") {
				let result_column_field_start = `Sequence${resultColumn}startdate`;//start date of current stage field name in view
				if (projectindex != 0) {
					let endStage = oThis.projectWeightObject[model.modelData[resultRow].projectid][(projectindex - 1)];
					let result_column_field_end = `${endStage}enddate`; // end date of previous stage  of the current  stage field name in view
					let startdate = model.modelData[resultRow][result_column_field_start];
					let enddate = model?.modelData[resultRow]?.[result_column_field_end] ?? null; // end date of previous stage
					let dayDiff = oThis.dayCalculation(enddate, startdate);

					if (dayDiff < 0) {
						MessageToast.show("start date of current stage  must be greater than or equal to end date of previous stage ");
						//save the pevious date if condition is not match
						model.modelData[resultRow][result_column_field_start] = oThis.datePickerArr[resultRow][result_column_field_start];
						return true;
					}
				}

				// it is condition when we select  start date of stage and end date of stage is present
				if (model.modelData[resultRow][result_column_field_End] != null) {
					let dayDiff = oThis.dayCalculation(model.modelData[resultRow][result_column_field_start], model.modelData[resultRow][result_column_field_End]);
					if (dayDiff < 0) {
						MessageToast.show("start date of current stage  must be less than or equal to end date of current stage ");
						model.modelData[resultRow][`Sequence${resultColumn}startdate`] = oThis.datePickerArr[resultRow][`Sequence${resultColumn}startdate`];
						return true;
					}
				}


				 {// it for save update field in datepicker Array
					oThis.datePickerArr[resultRow][result_column_field_start] = model.modelData[resultRow][result_column_field_start];
				}
			}

			// if we select the checkbox  or end Date manually
			else if (OEvent.mParameters.selected == true || resultDateSelction == "end") {
				let result_column_field_start = `Sequence${resultColumn}startdate`;//start date of current stage field name in view

				// it is condition for to  add  end date manually or by selecting checkbox when  start date of  that stage is  not present

				if ((model.modelData[resultRow][result_column_field_start]) == null) {
					model.modelData[resultRow][result_column_field_End] = oThis.datePickerArr[resultRow][result_column_field_End];
					MessageToast.show("before selecting end date you need to selected  start date");
					resultDateSelction == undefined ? OEvent.getSource().setSelected(false) : "Check box is not actually select";
					return true;
				}
				else {
					let dayDiff = oThis.dayCalculation(model.modelData[resultRow][result_column_field_start], (model?.modelData[resultRow]?.[result_column_field_End] ?? resultDate));

					// calculate day difference between start date and end date of current stage
					if (dayDiff < 0) {
						model.modelData[resultRow][result_column_field_End] = oThis.datePickerArr[resultRow][result_column_field_End];
						MessageToast.show("End Date of Current Stage must be greater than start Date of current Stage");
						// select or deselect checkbox 
						resultDateSelction == undefined ? OEvent.getSource().setSelected(false) : "Check box is not actually select";
						return true;
					}

					// calculate day difference between start date and end date of Nextstage
					dayDiff =model.modelData[resultRow][`${endStage}enddate`]!=null?oThis.dayCalculation(model.modelData[resultRow][`Sequence${resultColumn}enddate`],(model?.modelData[resultRow]?.[`${endStage}enddate`])):2;
					if (dayDiff < 0) {
						model.modelData[resultRow][result_column_field_End] = oThis.datePickerArr[resultRow][result_column_field_End];
						MessageToast.show("start Date of Next Stage must be greater than end Date of Next Stage");
						// select or deselect checkbox 
						resultDateSelction == undefined ? OEvent.getSource().setSelected(false) : "Check box is not actually select";
						return true;
					}

				}


				let validation = oThis.CheckBoxSelectionValidation(resultColumn, resultRow);

				if (validation == false) {
					MessageToast.show("before completing stage  you need to complete the previous stage");

					model.modelData[resultRow][`Sequence${resultColumn}enddate`] = oThis.datePickerArr[resultRow][`Sequence${resultColumn}enddate`];
					model.modelData[resultRow][result_column_field_Start] = oThis.datePickerArr[resultRow][result_column_field_Start];


					OEvent.getSource().setSelected(false);
					return true;
				}


				// let validationDepartment = oThis.checkboxDepartmentValidation(resultColumn);

				// if (validationDepartment == false) {
				// 	MessageToast.show("You don't have access of  stage because it is not under your department");
				// 	OEvent.getSource().setSelected(false);
				// 	return true;
				// }


				// if we  select same date picker one or more times then to add project weightage only ones we check  that particular  stage is present in projectStageObjectSave object  or not if present means project weightage  add all ready  and otherwise we need to add it.
				if (oThis.projectStageObjectSave[projectid].indexOf(`Sequence${resultColumn}`) == (-1)) {
					// functionality for save 
					oThis.projectStageObjectSave[projectid].push(`Sequence${resultColumn}`);
					model.modelData[resultRow].completionper = parseFloat(model?.modelData[resultRow]?.completionper ?? 0) + parseFloat(projectWeightAdd);

					// No of jobs done under particular  stage
					let resultString = `Sequence${resultColumn}jobs`; // jobs field
					jobModel[resultString] = jobModel[resultString] + 1;

				}

				// it is condition for if selected stage is  not last stage
				if (oThis.projectWeightObject[model.modelData[resultRow].projectid][(projectindex + 1)] != undefined) {
					// condition for if we selected end date  by manual not using checkbox
					model.modelData[resultRow][result_column_field_Start] = model?.modelData?.[resultRow]?.[result_column_field_End] ?? resultDate;// start date of next stage
					// oThis.projectStageObjectSave[projectid].indexOf(endStage) == (-1) ? oThis.projectStageObjectSave[projectid].push(endStage) : "stage is allready present";
				}
				// push project id to save project details like ni engineer ,sales engineer, completion %
				oThis.projectDetailSave.indexOf(model.modelData[resultRow].projectid) == -1 ? oThis.projectDetailSave.push(model.modelData[resultRow].projectid) : "it actually present";


				model.modelData[resultRow][result_column_field_End] = model?.modelData?.[resultRow]?.[result_column_field_End] ?? resultDate;// end date  of  current  stage


				{    // it is use to save in datepicker Arr

					oThis.datePickerArr[resultRow][`Sequence${resultColumn}enddate`] = model.modelData[resultRow][`Sequence${resultColumn}enddate`];
					oThis.datePickerArr[resultRow][result_column_field_Start] = model.modelData[resultRow][result_column_field_Start];

				}

				if (model.modelData[resultRow].completionper == 100) {
					model.modelData[resultRow].actualenddate = model?.modelData?.[resultRow]?.[result_column_field_End] ?? resultDate;

					model.modelData[resultRow].actualcompletiondays = this.dayCalculation(
						model.modelData[resultRow].Sequence1startdate,
						model?.modelData?.[resultRow]?.[result_column_field_End] ?? resultDate);
				}
			}

			// checkbox  selection remove 
			else {

				// end date of stage of which we select checkbox
				let removeStageend = oThis.projectStageObjectSave[projectid].indexOf(`Sequence${resultColumn}`)
				oThis.projectStageObjectSave[projectid].splice(removeStageend, 1);

				// it is condition for if selected stage is  not last stage
				if (oThis.projectWeightObject[model.modelData[resultRow].projectid][(projectindex + 1)] != undefined) {
					if ((model.modelData[resultRow][`${endStage}enddate`]) != null) {
						MessageToast.show("before deselecting stage you need to deselected next stage");
						OEvent.getSource().setSelected(true);
						return true;
					}

					model.modelData[resultRow][result_column_field_Start] = null;
					// let removeStagestart = oThis.projectStageObjectSave[projectid].indexOf(endStage);
					// oThis.projectStageObjectSave[projectid].splice(removeStagestart, 1);
				}
				else {
					model.modelData[resultRow].actualenddate = null;
					model.modelData[resultRow].actualcompletiondays = null;
				}

				// remove project completion date  
				if (model.modelData[resultRow].completionper == 100) {
					model.modelData[resultRow].actualenddate = null;
					model.modelData[resultRow].actualcompletiondays = null;
				}

				// no. of jobs updates
				let resultString = `Sequence${resultColumn}jobs`;

				jobModel[resultString] = jobModel[resultString] - 1;

				model.modelData[resultRow][result_column_field_End] = null; // set intial value as checkbox selection false

				oThis.datePickerArr[resultRow][`Sequence${resultColumn}enddate`] = null;
				oThis.datePickerArr[resultRow][result_column_field_Start] = null;

				//  substract completion % of stage 
				model.modelData[resultRow].completionper = parseFloat(model?.modelData[resultRow]?.completionper ?? 0) - parseFloat(projectWeightAdd);
				OEvent.getSource().setSelected(false);
			}
			this.getView().getModel("jobModel").refresh();
			this.getView().getModel("projectModel").refresh();
		},

		noOfJobCalculation: function () {
			let oThis = this;
			let model = this.getView().getModel("projectModel").oData.modelData;
			let resultobj = {};
			let arrEnd = [];//end

			for (let i = 1; i < 50; i++) {
				let count = 0;
				let enddate = `Sequence${i}enddate`;
				model.map((projectdetail) => {
					if (projectdetail[enddate] && projectdetail[enddate].trim() !== "") {
						count++;
					}
				});
				let result_field = `Sequence${i}jobs`
				resultobj[result_field] = count;
			};

			oThis.getView().getModel('jobModel').setData(resultobj);
			console.log(resultobj)
		},

		// function for validation on checkbox selection  previous stage must be completed
		CheckBoxSelectionValidation: function (resultColumn, resultRow) {
			let model = this.getView().getModel("projectModel").oData;

			let resultStagestartdate = `Sequence${resultColumn}startdate`;
			let stagestartDate = model.modelData[resultRow][resultStagestartdate];

			if (stagestartDate && stagestartDate.trim() !== "" && stagestartDate != undefined) {
				// means previous stage is complete 
				return true;

			}
			else {
				MessageToast.show("Before completing current stage you need to complete previous  stage ");
				return false;
			}

		},



		checkboxDepartmentValidation: function (resultColumn) {
			let DepartmentModelData = this.getView().getModel("DepartmentModel").oData;

			var sessionDataString = sessionStorage.getItem('currentSession');

			// Parse the JSON string to an object
			var sessionData = JSON.parse(sessionDataString);

			// Access the "department" property
			var department = sessionData.department;

			let resultDepartment = `Sequence${resultColumn}department`;

			if (DepartmentModelData[resultDepartment] == department) {
				// means previous stage is complete 
				return true;
			}
			else {
				return false;
			}

		},

		// it is  called on engineer change
		handleEnginnerChange: function (OEvent) {
			let oThis = this;
			let select = OEvent.getSource();
			let data = select.data("mySuperExtraData");
			oThis.projectDetailSave.indexOf(data) == -1 ? oThis.projectDetailSave.push(data) : "it actually present";
		},


		// calculate actual completion day
		dayCalculation: function (intialDate, finalDate) {
			let oThis = this;
			if (intialDate != null && finalDate != null) {
				var parts = intialDate.split('/');
				let startdate = Date.parse(new Date(parts[2], parts[1], parts[0]));

				parts = finalDate.split('/');
				let enddate = Date.parse(new Date(parts[2], parts[1], parts[0]));// get  difference in start date and end date in millseconds

				let completiondays = parseInt((enddate - startdate) / (86400 * 1000));// Days

				return completiondays;
			}
			return -1;
		},


		onSave: function () {
			// Storing reference to the current context (this) in oThis
			let oThis = this;

			// Getting projectModel data from the view
			let projectModel = oThis.getView().getModel("projectModel").oData.modelData;
			let saveArray = Object.entries(oThis.projectStageObjectSave);
			let companyid = commonService.session("companyId");

			// Looping through projectDetailSave array and updating project details for each project
			oThis.projectDetailSave.map((projectid) => {
				projectModel.some((projectdetail) => {
					if (projectid == projectdetail.projectid) {
						projectdetail.count= false;
						// Preparing the data object to be saved for each project detail
						let actualenddate = projectdetail.actualenddate != undefined ? ocommonfunction.getDate(projectdetail.actualenddate) : null;
						let saveObject = {
							niengineer: projectdetail?.niengineer ?? null,
							salesengineer: projectdetail?.salesengineer ?? null,
							actualcompletiondays: projectdetail?.actualcompletiondays ?? null,
							completionper: projectdetail?.completionper ?? null,
							field: "project",
							actualenddate: actualenddate,
							id: projectdetail.projectid,
							companyid: commonService.session("companyId"),
							userid: commonService.session("userId")
						};

						// Calling the projectService to update project management data
						projectService.updateProjectManagement(saveObject, function (data) {
							console.log("---------------modeldetaildata---------------", data);
							MessageToast.show("Project detail Data saved successfully.");
						});
					}
				});
			});

			// Sorting and updating the saveArray with relevant data
			saveArray.map((ele) => {
				projectid = ele[0];
				ele[1] = ele[1].sort(function (a, b) {
					const numA = parseInt(a.match(/\d+/)[0]);
					const numB = parseInt(b.match(/\d+/)[0]);
					return numA - numB;
				});

				let index = oThis.projectWeightObject[ele[0]].indexOf(ele[1][((ele[1].length) - 1)]);

				// Checking and pushing additional stage to ele[1] array if required
				index != ((oThis.projectWeightObject[ele[0]].length) - 1) ? ele[1].push(oThis.projectWeightObject[ele[0]][index + 1]) : "no need to push";
			});

			// Looping through saveArray and updating project activity details
			saveArray.map((saveArr) => {
				projectModel.some((projectdetail) => {
					if (saveArr[0] == projectdetail.projectid) {
						saveArr[1].map((sequence) => {
							let startdate = `${sequence}startdate`;
							let enddate = `${sequence}enddate`;

							let startActualDate = null;
							if (projectdetail[startdate] != undefined && projectdetail[startdate] != null && projectdetail[startdate].trim() != "") {
								startActualDate = ocommonfunction.getDate(projectdetail[startdate]);
							}
							let endActualDate = null;
							if (projectdetail[enddate] != undefined && projectdetail[enddate] != null && projectdetail[enddate].trim() != "") {
								endActualDate = projectdetail[enddate] != undefined ? ocommonfunction.getDate(projectdetail[enddate]) : null;
							}

							// Preparing the data object to be saved for each project activity detail
							let saveObject = {
								startdate: startActualDate,
								enddate: endActualDate,
								stageid: oThis.stageidObj[sequence],
								projectid: projectdetail.projectid,
								companyid: commonService.session("companyId"),
								userid: commonService.session("userId")
							};

							// Calling the projectService to update project activity detail data
							projectService.updateProjectActivityDetail(saveObject, function (data) {
								console.log("---------------modeldetaildata---------------", data);
								MessageToast.show("Project detail Data saved successfully.");
							});

							console.log(saveObject);

							return true;
						});
					}
				});
			});

			// Refreshing the projectModel after saving the data
			this.count = 0;
			oThis.getView().getModel("projectModel").refresh(true);
			this.count = 1;
		},

		onExit: function () {
			this.bus.unsubscribe("settermaster", "setDetailPage", this.setDetailPage, this);
		}
	});
}, true);
