sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/formatter/common.formatter',
	'sap/ui/elev8rerp/componentcontainer/services/ProjectManagement/ProjectTracking.service',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',

], function (JSONModel, BaseController, MessageToast, MessageBox, commonFormatter, ProjectTracking, commonService, commonFunction) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.ProjectManagement.ProjectDetail", {

		commonFormatter: commonFormatter,

		onInit: function () {
			this.counter = 1;
			this.counter1 = 1;

			// bind Project dropdown
			commonFunction.getReferenceByType("ProjType", "projectModel", this);

			// bind Milestone dropdown
			commonFunction.getReferenceByType("ProMilestones", "milestoneModel", this);

			// bind projectActivity dropdown
			commonFunction.getReferenceByType("ProStatus", "projectStatusModel", this);

			this.fnShortCut();
		},

		fnShortCut: function () {
			var currentContext = this;
			$(document).keydown(function (evt) {
				// 	if (evt.keyCode == 83 && (evt.altKey)) {
				// 		evt.preventDefault();
				// 		jQuery(document).ready(function ($) {
				// 			currentContext.onSave();
				// 		})
				// 	}
				if (evt.keyCode == 69 && (evt.altKey)) {
					evt.preventDefault();
					jQuery(document).ready(function ($) {
						currentContext.onCancel();
					})
				}
			});
		},

		onBeforeRendering: function () {
			this.model = this.getView().getModel("viewModel");
			console.log("this.model", this.model);
			var oModel = new JSONModel();

			if (this.model != undefined) {

				ProjectTracking.getProjectTracking({ id: this.model.id }, function (data) {
					console.log("data",data);
					oModel.setData(data[0][0]);
				});
				this.getView().byId("btnSave").setText("Update");

			} else {
				this.getView().byId("btnDelete").setVisible(false);
			}

			this.getView().setModel(oModel, "editProActivityModel");
			var oModel = this.getView().getModel("editProActivityModel");
			oModel.refresh();
		},

		onSave: function () {
			//if (this.validateForm()) {
			var currentContext = this;
			var model = this.getView().getModel("editProActivityModel").oData;
			model["startdate"] = commonFunction.getDate(model.startdate);
			model["enddate"] = commonFunction.getDate(model.enddate);
			model["duedate"] = commonFunction.getDate(model.duedate);
			model["companyid"] = commonService.session("companyId");
			model["userid"] = commonService.session("userId");

			ProjectTracking.saveProjectTracking(model, function (data) {

				if (data.id > 0) {
					var message = model.id == null ? "Project created successfully!" : "Project edited successfully!";
					currentContext.onCancel();
					MessageToast.show(message);
					currentContext.bus = sap.ui.getCore().getEventBus();
					currentContext.bus.publish("loaddata", "loadData");
				}

			});
			//}
		},

		validateForm: function () {
			var isValid = true;
			var Project = this.getView().byId("projectid").getSelectedKey();
			var milestone = this.getView().byId("milestoneid").getSelectedKey();
			var projectactivity = this.getView().byId("projectactivityid").getSelectedKey();
			var status = this.getView().byId("statusid").getSelectedKey();


			if (!commonFunction.isRequired(this, "txtActivityName", "Please enter activity name."))
				isValid = false;

			// check atleast one source is selected
			if (Project.length == 0) {
				this.getView().byId("projectid").setValueState(sap.ui.core.ValueState.Error)
					.setValueStateText("Please select atleast one Project.");

				isValid = false;
			}
			else if (milestone.length == 0) {
				this.getView().byId("milestoneid").setValueState(sap.ui.core.ValueState.Error)
					.setValueStateText("Please select atleast one milestone.");

				isValid = false;
			}

			else if (projectactivity.length == 0) {
				this.getView().byId("projectactivityid").setValueState(sap.ui.core.ValueState.Error)
					.setValueStateText("Please select atleast one projectactivity.");

				isValid = false;
			}

			else if (status.length == 0) {
				this.getView().byId("statusid").setValueState(sap.ui.core.ValueState.Error)
					.setValueStateText("Please select atleast one status.");

				isValid = false;
			}

			return isValid;
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
							ProjectTracking.deleteProjectTracking(model, function (data) {
								if (data) {
									currentContext.onCancel();
									MessageToast.show("Project deleted successfully!");
									currentContext.bus = sap.ui.getCore().getEventBus();
									currentContext.bus.publish("loaddata", "loadData");
								}
							});
						}
					}
				}
				);

			}
		},


		onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---project--fclProjecttracking");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		},
	});
}, true);
