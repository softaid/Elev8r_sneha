sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/ui/model/Sorter',
	'sap/ui/elev8rerp/componentcontainer/services/LeadManagement/Lead.service',
	'sap/ui/elev8rerp/componentcontainer/services/ProjectManagement/ProjectTracking.service',
	'sap/ui/elev8rerp/componentcontainer/utility/xlsx',
	'sap/ui/elev8rerp/componentcontainer/services/projectManagement/Project.service',
	'sap/m/MessageToast'
], function (JSONModel, BaseController, Sorter, leadService, ProjectTracking, xlsx, projectService, MessageToast) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.ProjectManagement.ProjectManagementFile", {

		onInit: function () {

			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("activitymaster", "setDetailPage", this.setDetailPage, this);
			this.bus.subscribe("loaddata", "loadData", this.loadData, this);
			this.oFlexibleColumnLayout = this.byId("fclProjecttracking");

			this.handleRouteMatched(null);

			var model = new JSONModel();
			var emptyModel = this.getModelDefault();
			model.setData(emptyModel);
			this.getView().setModel(model, "partyModel");

			let rowcount_model = new JSONModel();
			rowcount_model.setData([]);
			this.getView().setModel(rowcount_model, "rowcount_model");
			var quotationModel = new JSONModel();
			quotationModel.setData({ modelData: [] });
			this.getView().setModel(quotationModel, "quotationModel");

			let rowModel = new JSONModel();
			rowModel.setData({modelData : []});
			this.getView().setModel(rowModel, "rowModel");

            var projectMgntModel = new JSONModel();
			projectMgntModel.setData({ modelData: [] });
			this.getView().setModel(projectMgntModel, "projectMgntModel");

			this.getProjectCount();
			this.getAllProjectsDetail();

			var model = new JSONModel();
			model.setData(emptyModel);
			this.fnShortCut();
		},

		getProjectCount : async function(){

			this.bindTable();


			// leadService.getLeadDetails({ id: 51 }, function (data) {
			// 	if (data.length) {
			// 		if (data[4].length) {
			// 			let aRowsCount = [];
			// 			let quotationModelOne = this.getView().getModel("quotationModel");
			// 			quotationModelOne.setData({ modelData: data[4] });
			// 			this.getView().setModel(quotationModelOne, "quotationModel")
			// 			console.log("quotationModel",quotationModelOne);

			// 			aRowsCount.push({
			// 				rowsCount: data[4].length
			// 			});

			// 			let oRowsCount = new JSONModel();
			// 			oRowsCount.setData(aRowsCount[0]);
			// 			console.log("oRowsCount", oRowsCount);
			// 			oThis.getView().setModel(oRowsCount, "rowcount_model");
			// 		}

			// 		console.group(oThis.getView().getModel("liftModel"));
			// 	}
			// })
		},

		loadDataOne: async function () {
			let oThis = this;
			// let rowModel = oThis.getView().getModel("rowModel");
			let oRowsCount = oThis.getView().getModel("rowcount_model");
			await projectService.getAllProjects(function (data) {
				if (data.length) {
					if (data[0].length) {

						console.log(data[0].length);
						let aRowsCount = [];
						let quotationModel = oThis.getView().getModel("quotationModel");
						quotationModel.setData({ modelData: data[4] });
						oThis.getView().setModel(quotationModel, "quotationModel")
						console.log("quotationModel", quotationModel);

						aRowsCount.push({
							rowsCount: data[0].length
						});
	

						let oRowsCount = new JSONModel();
						oRowsCount.setData(aRowsCount[0]);
						oThis.getView().setModel(oRowsCount, "rowcount_model");

						// rowModel.setData({modelData : data[0]});
						// oThis.getView().setModel(rowModel, "rowModel");
					}
				}
			});
		},

        getAllProjectsDetail: async function () {
			
			let oThis = this;
			// var pnlPrjMgnttable = oThis.getView().byId("pnlPrjMgnttable");
            // pnlPrjMgnttable.destroyContent();

			let rowcount_model = this.getView().getModel("rowcount_model");

			await projectService.getAllProjectsDetail(function (data) {
				if (data.length) {
					if (data[0].length) {
						console.log(data[0]);
						// let projectMgntModel = oThis.getView().getModel("projectMgntModel");
						// projectMgntModel.setData({ modelData: data[0] });
						// oThis.getView().setModel(projectMgntModel, "projectMgntModel")
						// console.log("projectMgntModel",projectMgntModel);

						// oThis.setTable();

						var keys = [];

						Object.keys(data[0][0]).forEach(function (key) {
							keys.push(key);
						});

						var arr = [];
						for (var i = 0; i < keys.length; i++) {
							arr.push({ columnId: keys[i] })
						}

						var oModel = new JSONModel();

						oModel.setData({
							columns: arr,
							rows: data[0]
						});

						var oTable = new sap.ui.table.Table({
							showNoData: true,
							columnHeaderHeight: 10,
							visibleRowCount: data[0].length,
							selectionMode: sap.ui.table.SelectionMode.None

						});
						oTable.setModel(oModel);
						oTable.bindColumns("/columns", function (index, context) {
							console.log("context : ",context);
							var sColumnId = context.getObject().columnId;
							
							return new sap.ui.table.Column({
								id: sColumnId,
								label: sColumnId,
								template: sColumnId,
							});
						});
						oTable.bindRows("/rows");

						var pnlPrjMgnttable = oThis.getView().byId("pnlPrjMgnttable");
						// pnlPrjMgnttable.addContent(oTable);

					}
				}
			})
		},

		setTable : function(){

			var pnlPrjMgnttable = this.getView().byId("pnlPrjMgnttable");
            pnlPrjMgnttable.destroyContent();

			let columnModel = this.getView().getModel("projectMgntModel");
			let rowModel = this.getView().getModel("rowModel");
			let rowcount_model = this.getView().getModel("rowcount_model");

			let columnData = [];
			let rowData = [];

			// columnData.push({
			// 	// "Department" : "No. of Jobs",
			// 	Stage : "No. of Jobs"
			// })

			for(let i = 0; i < columnModel.oData.modelData.length; i++){
				columnData.push({
					// "Department" : "Finance",
					Stage : columnModel.oData.modelData[i].stagename
				});
			}


			// for(let j = 0; j < rowModel.oData.modelData.length; j++){
			// 	rowData.push({
			// 		OrderNo : rowModel.oData.modelData[j].id,
			// 		OrderName : rowModel.oData.modelData[j].quotename,
			// 		Model : rowModel.oData.modelData[j].model
			// 	})
			// }

			let tblModel = new JSONModel();
			console.log("columnModel : ",columnModel);
			tblModel.setData({
				columns : columnData,
				rows : columnModel
			});

			let oTable = new sap.ui.table.Table({
				showNoData: true,
				columnHeaderHeight: 10,
				visibleRowCount: rowcount_model.oData.rowsCount,
				selectionMode: sap.ui.table.SelectionMode.None
			})

			oTable.setModel(tblModel);

			oTable.bindColumns("/columns", function(sId, oContext){
				let columnName = oContext.getObject().Stage;
				return new sap.ui.table.Column({
					label : columnName,
					template : columnName
				});
			});

			oTable.bindRows("/rows");

			console.log("oTable : ", oTable);

			var pnlPrjMgnttable = this.getView().byId("pnlPrjMgnttable");
            pnlPrjMgnttable.addContent(oTable);
			
		},

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

		bindTable: async function () {
			let oThis = this;
			await projectService.getAllProjectsDetail(function (data) {
				if (data.length) {
					let oTableColumns = [];
					if (data[0].length) {
						console.log(data[0], "ProjectDetail");
						var keys = [];

						Object.keys(data[0][0]).forEach(function (key) {
							keys.push(key);
						});

						var arr = [];
						for (var i = 0; i < keys.length; i++) {
							arr.push({ columnId: keys[i] })
						}

						var oModel = new JSONModel();
						let oDataRows = data[0];
					//	let oTableColumns = [];

						for (let rowData of oDataRows) {
							let oTableRows = {};

							for (let aColumns of arr) {
								//let oTableRows = {};
								let rowDataColumn = rowData[aColumns['columnId']] == "undefined" ? 1 : rowData[aColumns['columnId']];
								console.log("rowDataColumn", rowDataColumn);
								if (aColumns['columnId'] !== "project" && aColumns['columnId'] !== "enddate" && aColumns['columnId'] !== "projectcount" && aColumns['columnId'] !== "stageid" && aColumns['columnId'] !== "stagename") {

								}

								let abc = JSON.parse(rowData[aColumns['columnId']]);
								let oColControls = [
									new sap.m.Text({
										text: "Stage Per: " + abc['stage_per']
									}),
									new sap.m.Text({
										text: "Start Date: " + abc['start_date']
									}),
									new sap.m.Text({
										text: "End Date: " + abc['end_date']
									})
								];

								if (aColumns['columnId'] === "project") {
									let abc = JSON.parse(rowData[aColumns['columnId']]);
									console.log("abc", abc);
									oColControls = [
										new sap.m.Text({
											text: "Project No: " + abc['project_no']
										}),
										new sap.m.Text({
											text: "Project  Name: " + abc['project_name']
										}),
										new sap.m.Text({
											text: "Model: " + abc['model']
										})
									];
								}

								if (aColumns['columnId'] === "NI_SALE_ENGINEER") {
									let abc = JSON.parse(rowData[aColumns['columnId']]);
									oColControls = [
										new sap.m.Text({
											text: "No Of Jobs: " + abc['no_of_project']
										}),
										new sap.m.Text({
											text: "NI ENG: " + abc['ni_engineer']
										}),
										new sap.m.Text({
											text: "SALE ENG: " + abc['ni_manager']
										})
									];
								}

								if (aColumns['columnId'] === "Complete") {
									let abc = JSON.parse(rowData[aColumns['columnId']]);
									oColControls = [
										new sap.m.Text({
											text: "Project_Per: " + abc['project_comper']
										}),
										new sap.m.Text({
											text: "Completed Stages: " + abc['completed_stags']
										})
									];
								}

								if (aColumns['columnId'] === "PlanDays_ComDays") {
									let abc = JSON.parse(rowData[aColumns['columnId']]);
									oColControls = [
										new sap.m.Text({
											text: "PLAN DAYS : " + abc['planned_days']
										}),
										new sap.m.Text({
											text: "COMP DAYS: " + abc['actual_days']
										})
									];
								}

								if (aColumns['columnId'] === "Order_PlanCom_Actual_DATE") {
									let abc = JSON.parse(rowData[aColumns['columnId']]);
									oColControls = [
										new sap.m.Text({
											text: "Order Date: " + abc['order_date']
										}),
										new sap.m.Text({
											text: "Plan Comp Date: " + abc['plan_com_date']
										}),
										new sap.m.Text({
											text: "Actual Comp Date: " + abc['act_com_date']
										})
									];
								}
								oTableRows[aColumns['columnId']] = new sap.m.VBox({
									items: oColControls
								});
							}
							oTableColumns.push(oTableRows);
						}

						
						var oTable = new sap.ui.table.Table({
							showNoData: true,
							columnHeaderHeight: 10,
							visibleRowCount: data[0].length,
							selectionMode: sap.ui.table.SelectionMode.None
						});

						let oColumns = [];
						
						for (let oTableColumn of arr) {
							oColumns = new sap.ui.table.Column({
								label: oTableColumn.columnId
							});

							for (let oRow of oTableColumns) {
								oColumns.setTemplate(oRow[oTableColumn.columnId]);
							}
							// Create a JSON model and set the data
							var oModel = new sap.ui.model.json.JSONModel();
							oModel.setData(oTableColumn);

							console.log("--------------oModel-------------", oModel);


							// Set the model on the template
							oColumns.getTemplate().setModel(oModel);
							oTable.addColumn(oColumns);
						}

						console.log("oColumns", oColumns);
						console.log("oTableColumns", oTableColumns);

						

						oModel.setData({
							cols: oColumns,
							rows: oTableColumns
						});

						oTable.setModel(oModel);
					
						oTable.bindRows("/rows");
						var pnlPrjMgnttable = oThis.getView().byId("pnlPrjMgnttable");
						// pnlPrjMgnttable.addContent(oTable);
						console.log("-----------------oTable----------------------",oTable);
					}
				}
			})
		},

		handleRouteMatched: function (evt) {
			this.loadData();
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
			var columns = ['projectname', 'milestone', 'status', 'startdate'];
			var filters = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, contains, sQuery);
			}),
				false);

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [filters];
			}

			this.getView().byId("tblProjectMaster").getBinding("items").filter(oTableSearchState, "Application");
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

		onExit: function () {
			this.bus.unsubscribe("settermaster", "setDetailPage", this.setDetailPage, this);
		}
	});

}, true);
