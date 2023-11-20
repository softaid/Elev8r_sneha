sap.ui.define(
    [
        "sap/ui/model/json/JSONModel",
        "sap/ui/elev8rerp/componentcontainer/controller/BaseController",
        'sap/ui/elev8rerp/componentcontainer/services/ProjectManagement/Project.service',
        'sap/ui/elev8rerp/componentcontainer/services/Common.service'
    ],
    function (JSONModel, BaseController, projectService, commonService) {
        return BaseController.extend(
            "sap.ui.elev8rerp.componentcontainer.controller.ProjectManagement.ProjectDashboard",
            {
                onInit: function () {
					this.bus = sap.ui.getCore().getEventBus();
                    this.bus.subscribe("projectdetailassign", "handleAssignList", this.handleAssignList, this);
                    this.bus.subscribe("projectdetailapprove", "handleApproveList", this.handleApproveList, this);
                    this.getProjectDashboardData();
                },

                getProjectDashboardData: function () {
                    let oThis = this;
                    let arr = [];

                    projectService.getProjectDashboard({ userid: commonService.session("userId") }, function (dashboardData) {
                        if (dashboardData.length) {
                            var oDashboardTileModel = new sap.ui.model.json.JSONModel();
                            arr.push({
                                totalprojects: dashboardData[0][0].totalprojects,
                                overdueprojects: dashboardData[1][0].overdueprojects
                            })

                            oDashboardTileModel.setData(arr[0]);
                            oThis.getView().setModel(oDashboardTileModel, "oDashboardTileModel");

                            var mapData = [];
                            var Header = ['Jobcode', 'Order Value', 'Outstandings'];
                            mapData.push(Header);
                            for (var i = 0; i < dashboardData[2].length; i++) {
                                var temp = [];
                                temp.push(dashboardData[2][i].jobcode, dashboardData[2][i].ordervalue, dashboardData[2][i].outstanding);

                                mapData.push(temp);
                            }

                            var data = google.visualization.arrayToDataTable(mapData);
                            var options = {
                                title: 'Jobs with order value and their outstandings',
                                vAxis: { title: 'Amount' },
                                hAxis: { title: 'Jobcode' },
                                seriesType: 'bars',
                                series: { 5: { type: 'point' } }
                            };
                            var chart = new google.visualization.ComboChart(document.getElementById('liechart_3d_1'));
                            chart.draw(data, options);

                            let oAssigneeModel = new JSONModel();
                            oAssigneeModel.setData(dashboardData[3]);
                            oThis.getView().setModel(oAssigneeModel, "oAssigneeModel");

                            let oApproverModel = new JSONModel();
                            oApproverModel.setData(dashboardData[4]);
                            oThis.getView().setModel(oApproverModel, "oApproverModel");



                        }
                    })
                },

                handleApproveList: function (sChannel, sEvent, oData) {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    this.bus = sap.ui.getCore().getEventBus();
                    oRouter.getTargets().display(oData.pagekey, { viewModel: oData.viewModel });
                    oRouter.navTo(oData.pagekey, true);
                },

                handleAssignList: function (sChannel, sEvent, oData) {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    this.bus = sap.ui.getCore().getEventBus();
                    oRouter.getTargets().display(oData.pagekey, { viewModel: oData.viewModel });
                    oRouter.navTo(oData.pagekey, true);
                },

                onListItemPressAssign: function (oEvent) {
                    var viewModel = oEvent.getSource().getBindingContext("oAssigneeModel").getObject();
                    this.bus = sap.ui.getCore().getEventBus();
                    setTimeout(function () {
                        this.bus = sap.ui.getCore().getEventBus();
                        this.bus.publish("projectdetailassign", "handleAssignList", {
                            pagekey: "projectdetail",
                            viewModel: viewModel,
                        });
                    }, 1000);

                    this.bus.publish("projectdetailassign", "handleAssignList", {
                        pagekey: "projectdetail",
                        viewModel: viewModel,
                    });
                },
                onListItemPressApprove: function (oEvent) {
                    var viewModel = oEvent.getSource().getBindingContext("oApproverModel").getObject();

                    this.bus = sap.ui.getCore().getEventBus();
                    setTimeout(function () {
                        this.bus = sap.ui.getCore().getEventBus();
                        this.bus.publish("projectdetailapprove", "handleApproveList", {
                            pagekey: "projectdetail",
                            viewModel: viewModel,
                        });
                    }, 1000);

                    this.bus.publish("projectdetailapprove", "handleApproveList", {
                        pagekey: "projectdetail",
                        viewModel: viewModel,
                    });
                },

            });
    }, true);