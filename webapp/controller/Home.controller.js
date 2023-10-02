sap.ui.define([
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/Device',
	'sap/m/MessageToast',
	'sap/ui/elev8rerp/componentcontainer/formatter/Breeder/BreederPlacementSchedule.formatter',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/DashBoard/CommonDashBoard.service',
	'sap/ui/elev8rerp/componentcontainer/services/ProjectManagement/Project.service'
], function (BaseController, JSONModel, Device, MessageToast, formatter, commonService, commonFunction, commondashboardService, ProjectService) {
	"use strict";
	return BaseController.extend("sap.ui.demo.nav.controller.Home", {
		formatter: formatter,

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onAfterRendering: function () {
			// Initialize Gantt chart after rendering
			gantt.init("gantt_here");
			console.log("Initializing Gantt chart...");
			this.loadProjectData();
		},

		loadProjectData: function () {
			//debugger;
			var currentContext = this;
			ProjectService.getAllProjectsDetailForGanttChart(function (data1) {
				console.log("----getAllProjectsDetailForGanttChart----", data1);

				var data = {};
				let ganttChartArray = [];

				if (data1[0].length) {
					for (let i = 0; i < data1[0].length; i++) {
						ganttChartArray.push({
							id: data1[0][i].stageid == null ? data1[0][i].projectid : (data1[0][i].projectid) + "-" + (data1[0][i].stageid),
							text: data1[0][i].stagename == null ? data1[0][i].jobcode : data1[0][i].stagename,
							start_date: data1[0][i].type == null ? data1[0][i].proactualstartdate : data1[0][i].type == "Stage" ? data1[0][i].stagestartdate : data1[0][i].activitystartdate,
							duration: data1[0][i].duration,
							parent: data1[0][i].type == null ? null : data1[0][i].type == "Stage" ? data1[0][i].projectid : (data1[0][i].projectid) + "-" + (data1[0][i].parentid),
							projectid: data1[0][i].projectid
						})
					}
					data = { tasks: ganttChartArray };
					console.log("----------------ganttChartArray----------------------", data);
				}

				gantt.init("gantt_here");
				gantt.parse(data);

				var projectModel = new sap.ui.model.json.JSONModel();
				projectModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(projectModel, "projectModel");
				console.log("------------projectModel---------", projectModel);
			});
		},




		onButtonPress: function (oEvent) {
			var oButton = oEvent.getSource();
			this.byId("actionSheet").openBy(oButton);
		},

		addLead: function (oEvent) {
			let oThis = this;
			let sRouteName = "addlead";
			this.getRouter().navTo(sRouteName);
		},

		addLeadActivity: function (oEvent) {
			let oThis = this;
			let sRouteName = "leadactivities";
			oThis.getRouter().navTo(sRouteName);
		},

		addProject: function (oEvent) {
			let oThis = this;
			let sRouteName = "project";
			oThis.getRouter().navTo(sRouteName);
		},

		addQuotation: function (oEvent) {
			let oThis = this;
			let sRouteName = "quotations";
			oThis.getRouter().navTo(sRouteName);
		},

		onInit: function (evt) {
			var router = this.getOwnerComponent().getRouter();
			var target = router.getTarget("home");
			var oViewModel = new JSONModel({
				isPhone: Device.system.phone
			});

			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("commondashboard", "redirectToPage", this.redirectToPage, this);

			this.setModel(oViewModel, "view");
			Device.media.attachHandler(function (oDevice) {
				this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
			}.bind(this));

			this.oFlexibleColumnLayout = this.byId("fclCommonDashboard");
			this.getData();
		},

		getTotalLeadsDetail: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("leads", true);
		},

		getLeadActivitiesDetail: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("leadactivities", true);
		},

		getProjectDetail: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("project", true);
		},

		onBeforeRendering: function () {
			// this.gePandL();
		},

		drawBarColors: function () {
			// var model = {
			// 	to_date: commonFunction.getDate(commonFunction.getDateFromDB(new Date())),

			// }

			// var currentContext = this;
			// commondashboardService.get_Profitandloss_data(model, function (data) {
			// 	console.log("data", data);
			// 	var mapData = [];
			// 	var Header = ['Month', 'Income', 'Expenses'];
			// 	mapData.push(Header);
			// 	for (var i = 0; i < data[0].length; i++) {
			// 		var temp = [];
			// 		temp.push(data[0][i].Monthname, data[0][i].Income, data[0][i].Expenses);

			// 		mapData.push(temp);
			// 	}

			// 	var data = google.visualization.arrayToDataTable(mapData);
			// 	var options = {
			// 		title: 'Income And Expenses',
			// 		vAxis: { title: 'Amount' },
			// 		hAxis: { title: 'Month' },
			// 		seriesType: 'bars',
			// 		series: { 5: { type: 'point' } }
			// 	};
			// 	var chart = new google.visualization.ComboChart(document.getElementById('liechart_3d_1'));
			// 	chart.draw(data, options);

			// });
		},

		getData: function () {
			var currentContext = this;
			let to_date = commonFunction.getDateFromDB(new Date());
			to_date = commonFunction.getDate(to_date);
			commonService.getCommonDashBoard({ to_date: to_date }, function (data) {
				var dashBoard_oModel = new sap.ui.model.json.JSONModel();
				// If data is not get from database  then handle Empty data condition
				if (data.length === 0 && data.trim().length === 0) {
					let msg = "Data for dashboard is not available";
					MessageToast.show(msg);
				}
				else {
					if (data.success) {
						console.log(data);
						dashBoard_oModel.setData(data[0][0]);
					}
				}
				currentContext.getView().setModel(dashBoard_oModel, "dashBoard_oModel");
			})
			google.charts.load('current', { 'packages': ['corechart'] });
			google.charts.setOnLoadCallback(this.drawBarColors);

			// All Models for dashboard setiing data
			var modulearray = [];
			commonService.getModuleDatabyUser(function (moduleData) {
				var id = 1;
				var moduleAccessoModel = new sap.ui.model.json.JSONModel();
				if (moduleData) {
					moduleAccessoModel.setData(moduleData[0]);
				}
				currentContext.getView().setModel(moduleAccessoModel, "moduleAccessoModel");

				// If data is not get from database  then handle Empty data condition
				if (!moduleData.length) {
					console.log("ModuleData is not available");
				}
				else {
					console.log(moduleData);
					for (var i = 0; i < moduleData[0].length; i++) {
						modulearray.push({
							id: id++,
							entityname: moduleData[0][i].entityname
						});
					}
				}

				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: modulearray });
				currentContext.getView().setModel(oModel, "moduleModel");
			})

		},

		redirectToPage: function (sChannel, sEvent, oData) {
			console.log("redirection kry", oData)
			sap.m.MessageToast.show("Redirecting to transaction page....");

			// Redirect to transaction
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getTargets().display(oData.pagekey);
			oRouter.navTo(oData.pagekey, true);
		},
	});
});