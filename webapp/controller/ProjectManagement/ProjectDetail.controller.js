sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/ui/model/Sorter',
	'sap/ui/elev8rerp/componentcontainer/services/ProjectManagement/Project.service',
	'sap/ui/elev8rerp/componentcontainer/services/ProjectManagement/AttributeList.service',
	'sap/ui/elev8rerp/componentcontainer/utility/xlsx',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/services/Company/ManageUser.service',
	'sap/m/MessageToast',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/controller/formatter/fragment.formatter',

], function (JSONModel, BaseController, Sorter, Projectservice, AttributeListservice, xlsx, commonService, ManageUserService, MessageToast, commonFunction, formatter) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.ProjectManagement.ProjectDetail", {
		formatter: formatter,

		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("billofmaterial", "setDetailPage", this.setDetailPage, this);
			this.bus.subscribe("activitystatus", "setDetailActivityPage", this.setDetailActivityPage, this);
			this.bus.subscribe("attributestatus", "setDetailAttributePage", this.setDetailAttributePage, this);
			this.bus.subscribe("projectdetail", "handleProjectDetails", this.handleProjectDetailsList, this);
			this.oFlexibleColumnLayout = this.byId("fclProjectActivity");
			var currentContext = this;

			var emptyModel = this.getModelDefault();
			var model = new JSONModel();
			model.setData(emptyModel);
			this.getView().setModel(model, "projectModel");

			// set empty model to view		
			var model = new JSONModel();
			model.setData({});
			this.getView().setModel(model, "tblModel");

			// set empty model to view		
			// var niModel = new JSONModel();
			// niModel.setData({});
			// this.getView().setModel(niModel, "nitblmodel");

			var activitiestblmodel = new JSONModel();
			activitiestblmodel.setData({});
			this.getView().setModel(activitiestblmodel, "activitymodel");

			var paymenttblmodel = new JSONModel();
			paymenttblmodel.setData({});
			this.getView().setModel(paymenttblmodel, "paymenttblmodel");

			var attachmenttblmodel = new JSONModel();
			attachmenttblmodel.setData({});
			this.getView().setModel(attachmenttblmodel, "attachmenttblmodel");

			var qctblmodel = new JSONModel();
			qctblmodel.setData([]);
			this.getView().setModel(qctblmodel, "attributeModel");

			var ganttcharttblmodel = new JSONModel();
			ganttcharttblmodel.setData({});
			this.getView().setModel(ganttcharttblmodel, "ganttcharttblmodel");

			var model = new JSONModel();
			model.setData({});
			this.getView().setModel(model, "projectList");

			var model = new JSONModel();
			model.setData({});
			this.getView().setModel(model, "DetailModel");

			var model = new JSONModel();
			model.setData({});
			this.getView().setModel(model, "engRoleModel");

			var model = new JSONModel();
			model.setData({});
			this.getView().setModel(model, "managerRoleModel");


			var model = new JSONModel();
			model.setData({});
			this.getView().setModel(model, "DepartmentModel");

			var stageModel = new JSONModel();
			stageModel.setData({});
			this.getView().setModel(model, "StageModel");

			commonFunction.getReferenceByType("ProjStgType", "stagetypeModel", this);


			this.flag = false;

			this.bomArr = [];
			this.bomDetailArr = [];
			// this.getAllProject();
			this.getRole();
			this.getAllDepartment();
			commonFunction.getUser(this,18);

			let subcontractorModel = new JSONModel();
			subcontractorModel.setData(commonFunction.getAllSubcontractors(this));
			this.getView().setModel(subcontractorModel, "subcontractorModel");

			// this function is used for grouping in Activity tab
			this.mGroupFunctions = {

				parentstage: function (oContext) {
					var name = oContext.getProperty("parentstage");
					return {
						key: name,
						text: name
					};
				},
				stagename: function (oContext) {
					var name = oContext.getProperty("stagename");
					return {
						key: name,
						text: name
					};
				},
			}

			// this function is used for grouping in Attribute tab
			this.mGroupFunctionsAttribute = {

				parentstagename: function (oContext) {
					var name = oContext.getProperty("parentstagename");
					return {
						key: name,
						text: name
					};
				},
				stagename: function (oContext) {
					var name = oContext.getProperty("stagename");
					return {
						key: name,
						text: name
					};
				},
				attributename: function (oContext) {
					var name = oContext.getProperty("attributename");
					return {
						key: name,
						text: name
					};
				},
			}
		},

        
		//Activity grouping confirm dialog
		handleGroupDialogConfirm: function (oEvent) {
			this.groupReset = false;
			var oTable = this.byId("tblActiviteStatus"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				vGroup,
				aGroups = [];

			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				vGroup = this.mGroupFunctions[sPath];
				aGroups.push(new Sorter(sPath, bDescending, vGroup));
				// apply the selected group settings
				oBinding.sort(aGroups);
			} else if (this.groupReset) {
				oBinding.sort();
				// apply the selected group settingss
				oBinding.sort(aGroups);
			} else if (this.groupReset== false) {
				oBinding.sort(aGroups);
				this.groupReset = false;
			}
		},

		//reset activity dialog
		resetGroupDialog: function (oEvent) {
			this.groupReset = true;
		},

		//Function to load grouping fragement
		handleGroupButtonPressed: function () {
			if (!this._oDialog1) {
				this._oDialog1 = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.Reports.GroupDialog", this);
			}
			this._oDialog1.open();
		},

		//Search functionality for all columns for particular value
		onSearchActivity: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");
			var contains = sap.ui.model.FilterOperator.Contains;
			var columns = ['parentstage', 'stagename'];
			var filters = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, contains, sQuery);
			}),
				false);
			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [filters];
			}
			this.getView().byId("tblActiviteStatus").getBinding("items").filter(oTableSearchState, "Application");
		},

		onAcivitySort: function (oEvent) {
			this._bDescendingSort = !this._bDescendingSort;
			var oView = this.getView(),
				oTable = oView.byId("tblActiviteStatus"),
				oBinding = oTable.getBinding("items"),
				oSorter = new Sorter("count", this._bDescendingSort);
			oBinding.sort(oSorter);
		},

		//Search functionality for all columns for particular value
		onSearchStages: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");
			var contains = sap.ui.model.FilterOperator.Contains;
			var columns = ['stagename'];
			var filters = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, contains, sQuery);
			}),
				false);
			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [filters];
			}
			this.getView().byId("tblProjectStages").getBinding("items").filter(oTableSearchState, "Application");
		},

		onStagesSort: function (oEvent) {
			this._bDescendingSort = !this._bDescendingSort;
			var oView = this.getView(),
				oTable = oView.byId("tblProjectStages"),
				oBinding = oTable.getBinding("items"),
				oSorter = new Sorter("count", this._bDescendingSort);
			oBinding.sort(oSorter);
		},

		 // Function to reset all filters applied to table
		 getAllStages: async function(){
			this.groupReset = false;
            var oTable = this.byId("tblProjectStages"),
                oBinding = oTable.getBinding("items"),
                aGroups = [];
                oBinding.sort(aGroups);
                this.groupReset = false;
		},

		handleAttributeGroupDialogConfirm: function (oEvent) {
			this.groupReset = false;
			var oTable = this.byId("tblAttributes"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				vGroup,
				aGroups = [];

			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				vGroup = this.mGroupFunctionsAttribute[sPath];
				aGroups.push(new Sorter(sPath, bDescending, vGroup));
				// apply the selected group settingss
				oBinding.sort(aGroups);
			} else if (this.groupReset== false) {
				oBinding.sort(aGroups);
				this.groupReset = false;
			}
		},

		//reset activity dialog
		resetAttributeGroupDialog: function (oEvent) {
			this.groupReset = true;
		},

		//Function to load grouping fragement
		handleAttributeGroupButtonPressed: function () {
			if (!this._oDialog2) {
				this._oDialog2 = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.Reports.AttributeGroupDialog", this);
			}
			this._oDialog2.open();
		},
		
			//Search functionality for all columns for particular value
			onSearchAttribute: function (oEvent) {
				var oTableSearchState = [],
					sQuery = oEvent.getParameter("query");
				var contains = sap.ui.model.FilterOperator.Contains;
				var columns = ['stagename','attributename','parentstagename'];
				var filters = new sap.ui.model.Filter(columns.map(function (colName) {
					return new sap.ui.model.Filter(colName, contains, sQuery);
				}),
					false);
				if (sQuery && sQuery.length > 0) {
					oTableSearchState = [filters];
				}
				this.getView().byId("tblAttributes").getBinding("items").filter(oTableSearchState, "Application");
			},
	
			onAttributeSort: function (oEvent) {
				this._bDescendingSort = !this._bDescendingSort;
				var oView = this.getView(),
					oTable = oView.byId("tblAttributes"),
					oBinding = oTable.getBinding("items"),
					oSorter = new Sorter("stagename", this._bDescendingSort);
				oBinding.sort(oSorter);
			},
	
			 // Function to reset all filters applied to table
			 getAllAttrubutes: async function(){
				this.groupReset = false;
				var oTable = this.byId("tblAttributes"),
					oBinding = oTable.getBinding("items"),
					aGroups = [];
					oBinding.sort(aGroups);
					this.groupReset = false;
			},


		getModelDefault: function () {
			return {
				id: null,
				itemid: null,
				itemname: null,
				itemunitname: null,
				unitcost: null,
				// bomdate: commonFunction.getDateFromDB(new Date()),
				quantity: null,
				createdby: null,
				isactive: true,
				note: null,
			}
		},

		handleProjectDetailsList: function (sChannel, sEvent, oData) {

			let selRow = oData.viewModel;
			let oThis = this;

			if (selRow != null) {

				if (selRow.action == "view") {
					oThis.getView().byId("btnSave").setEnabled(false);
					oThis.getView().byId("add").setEnabled(false);

				} else {
					oThis.getView().byId("btnSave").setEnabled(true);
				}

				oThis.getProjectDetails(selRow.id);

			}

		},

		onAfterRendering: function () {
			jQuery.sap.delayedCall(1000, this, function () {
				this.getView().byId("btnList").focus();
			});

		},


		onExit: function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},

		onAddNewRowStage: function () {
			this.bus = sap.ui.getCore().getEventBus();
			let projectModel = this.getView().getModel("projectModel").getData();

			this.bus.publish("billofmaterial", "setDetailPage", { viewName: "projectstagedetail", viewModel: { projectid: projectModel.id } });
		},

		onAddNewRowactivity: function () {
			this.bus = sap.ui.getCore().getEventBus();
			let projectModel = this.getView().getModel("projectModel").getData();


			this.bus.publish("activitystatus", "setDetailActivityPage", { viewName: "ProjectActivityDetail", viewModel: { projectid: projectModel.id } });
		},

		onAddNewRowAttribute: function () {
			this.bus = sap.ui.getCore().getEventBus();
			let projectModel = this.getView().getModel("projectModel").getData();

			this.bus.publish("attributestatus", "setDetailAttributePage", { viewName: "projectattributedetail", viewModel: { projectid: 60, attributetypeids: null } });

		},

		onListItemPressStage: function (oEvent) {
			console.log(oEvent);
			let oDayHistory = oEvent.getSource().getBindingContext("tblModel").getObject();
			let projectModel = this.getView().getModel("projectModel").getData();
			oDayHistory.projectid = projectModel.id;
			oDayHistory.isactive = oDayHistory.isactive === 1 ? true : false;
			oDayHistory.isstd = oDayHistory.isstd === 1 ? true : false;
			oDayHistory.isstarted = oDayHistory.actualstartdate != null ? true : false;


			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("billofmaterial", "setDetailPage", { viewName: "projectstagedetail", viewModel: oDayHistory });

		},


		onListItemPressActivity: function (oEvent) {
			let currentContext=this;
			let oDayHistory = oEvent.getSource().getBindingContext("activitymodel").getObject();
			let projectModel = this.getView().getModel("projectModel").getData();
			oDayHistory.projectid = projectModel.id;
			oDayHistory.isactive = oDayHistory.isactive === 1 ? true : false;
			oDayHistory.isstd = oDayHistory.isstd === 1 ? true : false;
			oDayHistory.isstarted = oDayHistory.actualstartdate != null ? true : false;

			Projectservice.getStageOrActivityDetail({ parentid: oDayHistory.parentid, projectid: oDayHistory.projectid }, function (data) {

				let dependency= data[0][0].dependency;
				// if dependencyStatus  is true means all dependency stage are completed  so we can proceed it  otherwise false mean  condition is not satisfied
				oDayHistory.dependencyStatus= dependency!=null?(dependency.split(",").every((ele) => {
					 return currentContext.projectCompletionObj[ele]==100;
				})):true;
				oDayHistory.WarningStatus= oDayHistory.dependencyStatus==false?"To start the Activity you need to first complete dependency stages":null;
				currentContext.bus = sap.ui.getCore().getEventBus();
				currentContext.bus.publish("activitystatus", "setDetailActivityPage", { viewName: "ProjectActivityDetail", viewModel: oDayHistory });


			})


		},


		onListItemPressAttribute: function (oEvent) {
			
			let oDayHistory = oEvent.getSource().getBindingContext("attributeModel").getObject();
			let projectModel = this.getView().getModel("projectModel").getData();
			oDayHistory.projectid = projectModel.id;
			// oDayHistory.isactive = oDayHistory.isactive === 1 ? true : false;
			// oDayHistory.isstd = oDayHistory.isstd === 1 ? true : false;
			// oDayHistory.isstarted = oDayHistory.actualstartdate != null ? true : false;

			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("attributestatus", "setDetailAttributePage", { viewName: "projectattributedetail", viewModel: { ...oDayHistory } });

		},


		// function call on list fragement click
		onListIconPress: function (oEvent) {
			this.getAllProject();
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.view.ProjectManagement.ProjectActivityAddDialog", this);
			}
			// Multi-select if required
			var bMultiSelect = !!oEvent.getSource().data("multi");
			this._oDialog.setMultiSelect(bMultiSelect);
			// Remember selections if required
			var bRemember = !!oEvent.getSource().data("remember");
			this._oDialog.setRememberSelections(bRemember);
			this.getView().addDependent(this._oDialog);
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
			// this.bindBillOfMaterial();
		},

		//stage detail
		setDetailPage: function (channel, event, data) {

			this.detailView = sap.ui.view({
				viewName: "sap.ui.elev8rerp.componentcontainer.view.ProjectManagement." + data.viewName,
				type: "XML"
			});

			let model = new JSONModel();
			model.setData({ ...data.viewModel });

			this.detailView.setModel(model, "StageDetailModel");

			this.oFlexibleColumnLayout.removeAllMidColumnPages();
			this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);

		},

		// Activity Detail
		setDetailActivityPage: function (channel, event, data) {

			this.detailView = sap.ui.view({
				viewName: "sap.ui.elev8rerp.componentcontainer.view.ProjectManagement." + data.viewName,
				type: "XML"
			});

			let model = new JSONModel();
			model.setData({ ...data.viewModel });


			this.detailView.setModel(model, "ActivityDetailModel");
			this.oFlexibleColumnLayout.removeAllMidColumnPages();
			this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);

		},

		setDetailNIPage: function (channel, event, data) {

			this.detailView = sap.ui.view({
				viewName: "sap.ui.elev8rerp.componentcontainer.view.ProjectManagement." + data.viewName,
				type: "XML"
			});

			let model = new JSONModel();
			model.setData({ ...data.viewModel, });

			// this.getView().setModel(model, "tblModel");

			this.detailView.setModel(model, "ProjectDetailModel");
			this.detailView.setModel(model, "DetailModel");

			this.oFlexibleColumnLayout.removeAllMidColumnPages();
			this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
			let DetailModeldata = this.getView().getModel("DetailModel").getData();

		},

		setDetailAttributePage: function (channel, event, data) {

			this.detailView = sap.ui.view({
				viewName: "sap.ui.elev8rerp.componentcontainer.view.ProjectManagement." + data.viewName,
				type: "XML"
			});

			let model = new JSONModel();
			model.setData(data.viewModel);

			// this.getView().setModel(model, "tblModel");

			this.detailView.setModel(model, "AttributeDetailModel");

			this.oFlexibleColumnLayout.removeAllMidColumnPages();
			this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);

		},


		// function call to get manager and engineer
		getRole: function () {
			let role = [{ "id": 1, "discription": "eng" }, { "id": 1, "discription": "manager" }];
			let currentContext = this;
			role.map(function (role, index) {
				ManageUserService.getUserByRole({ roleid: role.id }, function (data) {
					let field = role.discription;
					console.log(data);
					let oroleModel = currentContext.getView().getModel(`${field}RoleModel`);
					oroleModel.setData(data[0]);
				})
			})

		},

		// function call on close the project fragement 
		handleProjectFragementClose: function (oEvent, id) {
			let currentContext = this;

			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts != undefined) {
				var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
				currentContext.getProjectDetails(selRow[0].id);
				// Projectservice.getProject({ id: selRow[0].id }, function (data) {
				// 	console.log(data[0])
				// 	data[0][0].isactive = data[0][0].isactive == 1 ? true : false;
				// 	currentContext.getView().getModel("projectModel").setData(data[0][0]);
				// 	data[0][0].niengineer != null ? currentContext.getView().byId("eng").setSelectedKeys([...data[0][0].niengineer]) : "data not available";
				// 	data[0][0].nimanager != null ? currentContext.getView().byId("manager").setSelectedKeys([...data[0][0].nimanager]) : "data not available";
				// 	data[0][0].salesmanager != null ? currentContext.getView().byId("salesmanager").setSelectedKeys([...data[0][0].salesmanager]) : "data not available";
				// 	data[0][0].salesengineer != null ? currentContext.getView().byId("salesenginner").setSelectedKeys([...data[0][0].salesengineer]) : "data not available";
				// 	currentContext.getProjectdetail(data[0][0].id);
				// 	currentContext.getNIdetail(data[0][0].id);

				// });

			}

		},

		getProjectDetails: function (id) {
			let currentContext = this;
			Projectservice.getProject({ id: id }, function (data) {
				console.log(data[0])
				data[0][0].isactive = data[0][0].isactive == 1 ? true : false;
				currentContext.getView().getModel("projectModel").setData(data[0][0]);
				data[0][0].niengineer != null ? currentContext.getView().byId("eng").setSelectedKeys([...data[0][0].niengineer]) : "data not available";
				data[0][0].nimanager != null ? currentContext.getView().byId("manager").setSelectedKeys([...data[0][0].nimanager]) : "data not available";
				data[0][0].salesmanager != null ? currentContext.getView().byId("salesmanager").setSelectedKeys([...data[0][0].salesmanager]) : "data not available";
				data[0][0].salesengineer != null ? currentContext.getView().byId("salesenginner").setSelectedKeys([...data[0][0].salesengineer]) : "data not available";
				currentContext.getStageDetail(data[0][0].id);
				currentContext.getActivitesdetail(data[0][0].id);
				currentContext.getAttributeList(data[0][0].id);
				currentContext.getAttachmentList(data[0][0].id);
				currentContext.getPaymentStages('ProjStgType',data[0][0].id);

				//currentContext.getNIdetail(data[0][0].id);
			});



		},



		// function for navigate stage to Activity screen with the stage we select for that only those activity under that stage  are see in activity tab and other wise open detail screen of stage detail

		onStagePress: function (OEvent) {
			let oThis = this;
			let checkbox = OEvent.getSource();
			let data = checkbox.data("mySuperExtraData");
			let [id, field] = data.split("_");
			if (field == "Activity") {
				var oIconTabBar = oThis.getView().byId("projectDetail");
				let Arr = oThis.ActivityList.filter((ele) => {
					return ele.parentid == id;
				});
				let activitymodel = oThis.getView().getModel("activitymodel");
				activitymodel.setData(Arr);
				// Set the selected key to switch to the "Other Tab"
				oIconTabBar.setSelectedKey("Activity");

			}
			else {
				Projectservice.getStageOrActivityDetail({ id: id }, function (data) {
					let detail = data[0][0];
					detail.isactive = detail.isactive === 1 ? true : false;
					detail.isstd = detail.isstd === 1 ? true : false;
					detail.isstarted = detail.actualstartdate != null ? true : false;
					oThis.bus = sap.ui.getCore().getEventBus();
					oThis.bus.publish("billofmaterial", "setDetailPage", { viewName: "projectstagedetail", viewModel: detail });
				})
			}

			console.log(data)
		},


		// function for navigate Activity to attribute screen with the activity we select for that only those attribute under that activity  are see in attribute tab and other wise open detail screen of Activity detail
		onActivityPress: function (OEvent) {
			let oThis = this;
			let checkbox = OEvent.getSource();
			let data = checkbox.data("mySuperExtraData");
			let [id, field] = data.split("_");
			if (field == "Attribute") {
				var oIconTabBar = oThis.getView().byId("projectDetail");

				let Arr = oThis.AttributeList.filter((ele) => {
					return ele.activityid == id;
				});
				var attributeModel = oThis.getView().getModel("attributeModel");

				attributeModel.setData(Arr);

				// Set the selected key to switch to the "Other Tab"
				oIconTabBar.setSelectedKey("Attribute");

			}
			else {
				Projectservice.getStageOrActivityDetail({ id: id }, function (data) {
					let detail = data[0][0];
					detail.isactive = detail.isactive === 1 ? true : false;
					detail.isstd = detail.isstd === 1 ? true : false;
					detail.isstarted = detail.actualstartdate != null ? true : false;
					oThis.bus = sap.ui.getCore().getEventBus();
					oThis.bus.publish("billofmaterial", "setDetailPage", { viewName: "projectactivitydetail", viewModel: detail });
				})

			}

			console.log(data)
		},

		// get all project and bind to  list fragement
		getAllProject: function () {
			var currentContext = this;
			Projectservice.getAllProjects(function (data) {
				var oModel = currentContext.getView().getModel("projectList");
				oModel.setData(data[0]);
				oModel.refresh();
			});
		},

		// get all department
		getAllDepartment: function () {
			var currentContext = this;
			Projectservice.getAllDepartment(function (data) {
				var oModel = currentContext.getView().getModel("DepartmentModel");
				oModel.setData(data[0]);
				oModel.refresh();
			});
		},

		// get all department
		getAllStage: function () {
			var currentContext = this;
			Projectservice.getAllStage(function (data) {
				var oModel = currentContext.getView().getModel("StageModel");
				oModel.setData(data[0]);
				oModel.refresh();
			});
		},

		// get project stage and show in table
		getStageDetail: function (projectid) {
			var currentContext = this;
			currentContext.projectCompletionObj = {};
			Projectservice.getProjectdetail({ id: projectid, field: "stage" }, function (data) {
				console.log("data", data);
				data[0].forEach(function (value, index) {
					data[0][index].activestatus = value.isactive == 1 ? "Active" : "In Active";
					data[0][index].actualstartdate = data[0]?.[index]?.actualstartdate ?? null;
					data[0][index].actualenddate = data[0]?.[index]?.actualenddate ?? null;
					currentContext.projectCompletionObj[value.stageid] = value.stagecompletionpercentage;
				});
				//  delete currentContext.projectCompletionObj.null
				var tblModel = currentContext.getView().getModel("tblModel");
				currentContext.StageList = JSON.parse(JSON.stringify(data[0]));// Array consist of all Activity
				tblModel.setData(data[0]);
			});
		},

		// get NI stage and show in table
		getNIdetail: function (projectid) {
			var currentContext = this;
			Projectservice.getNIdetail({ projectid: projectid }, function (data) {
				console.log("data", data);
				data[0].map(function (value, index) {

					data[0][index].activestatus = value.isactive == 1 ? "Active" : "In Active";
					data[0][index].actualstartdate = data[0]?.[index]?.actualstartdate ?? null
					data[0][index].actualenddate = data[0]?.[index]?.actualenddate ?? null;

				});
				var nitblmodel = currentContext.getView().getModel("nitblmodel");
				nitblmodel.setData(data[0]);
				console.log("--------------nitblmodel------------", nitblmodel);
				nitblmodel.refresh();

			});
		},

		// get Activities details of project
		getActivitesdetail: function (projectid) {
			var currentContext = this;
			Projectservice.getProjectdetail({ id: projectid, field: "activity" }, function (data) {
				console.log("data", data);
				data[0].map(function (value, index) {

					data[0][index].activestatus = value.isactive == 1 ? "Active" : "In Active";
					data[0][index].actualstartdate = data[0]?.[index]?.actualstartdate ?? null
					data[0][index].actualenddate = data[0]?.[index]?.actualenddate ?? null;

				});
				var activitymodel = currentContext.getView().getModel("activitymodel");
				currentContext.ActivityList = JSON.parse(JSON.stringify(data[0]));// Array consist of all Activity
				activitymodel.setData(data[0]);
				console.log("--------------activitymodel------------", activitymodel);
				activitymodel.refresh();

			});
		},

		



		// get Payment details of project
		getPaymentdetail: function (projectid) {
			var currentContext = this;
			Projectservice.getNIdetail({ id: projectid }, function (data) {
				console.log("data", data);
				data[0].map(function (value, index) {
					data[0][index].activestatus = value.isactive == 1 ? "Active" : "In Active";
					data[0][index].actualstartdate = data[0]?.[index]?.actualstartdate ?? null
					data[0][index].actualenddate = data[0]?.[index]?.actualenddate ?? null;

				});
				var nitblmodel = currentContext.getView().getModel("nitblmodel");
				nitblmodel.setData(data[0]);
				console.log("--------------nitblmodel------------", nitblmodel);
				nitblmodel.refresh();

			});
		},

		// Get attachment details of projects
		getAttachmentdetail: function (projectid) {
			var currentContext = this;
			Projectservice.getNIdetail({ id: projectid }, function (data) {
				console.log("data", data);
				data[0].map(function (value, index) {

					data[0][index].activestatus = value.isactive == 1 ? "Active" : "In Active";
					data[0][index].actualstartdate = data[0]?.[index]?.actualstartdate ?? null
					data[0][index].actualenddate = data[0]?.[index]?.actualenddate ?? null;

				});
				var nitblmodel = currentContext.getView().getModel("nitblmodel");
				nitblmodel.setData(data[0]);
				console.log("--------------nitblmodel------------", nitblmodel);
				nitblmodel.refresh();

			});
		},


		// get attribute list details of project
		getAttributeList: function (projectid) {
			var currentContext = this;
			AttributeListservice.getAttributeList({ projectid: projectid }, function (data) {
				console.log("data", data);
				data[0].map(function (value, index) {

					data[0][index].activestatus = value.isactive == 1 ? "Active" : "In Active";
					data[0][index].actualstartdate = data[0]?.[index]?.actualstartdate ?? null
					data[0][index].actualenddate = data[0]?.[index]?.actualenddate ?? null;

				});
				var attributeModel = currentContext.getView().getModel("attributeModel");
				currentContext.AttributeList = JSON.parse(JSON.stringify(data[0]));// Array consist of all Activity

				attributeModel.setData(data[0]);
				console.log("--------------attributeModel------------", attributeModel);
				attributeModel.refresh();

			});
		},

		getAttachmentList : function(projectid){
			let oThis = this;
			Projectservice.getAttachmentList({projectid : projectid},function(data){
				if(data.length && data[0].length){
					var attachmenttblmodel = oThis.getView().getModel("attachmenttblmodel");

					attachmenttblmodel.setData(data[0]);
					console.log("--------------attachmenttblmodel------------", attachmenttblmodel);
					attachmenttblmodel.refresh();
				}
			})
		},

		getPaymentStages : function(typecode,projectid){
			let oThis = this;
			Projectservice.getReferenceRelatedPayment({typecode : typecode,projectid : projectid},function(data){
				if(data.length && data[0].length){
					var paymenttblmodel = oThis.getView().getModel("paymenttblmodel");

					paymenttblmodel.setData(data[0]);
					console.log("--------------paymenttblmodel------------", paymenttblmodel);
					paymenttblmodel.refresh();
				}
			})
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

		getAllStageArActivity: async function (oEvent) {

			let currentContext = this;


			if (oEvent.mParameters.id.match("btnallstage") != null) {

				var tblModel = currentContext.getView().getModel("tblModel");
				tblModel.setData(currentContext.StageList);

				
			}
			else if (oEvent.mParameters.id.match("btnallactivity") != null) {
				var activitymodel = currentContext.getView().getModel("activitymodel");
				activitymodel.setData(currentContext.ActivityList);
			

			}
			// else if (oEvent.mParameters.id.match("startDate") != null) {



		},


		resourceBundle: function () {
			var currentContext = this;
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},


		onSave: function () {
			//var isvalid = this.validateForm();
			//if(isvalid){
			var currentContext = this;
			let parentModel = this.getView().getModel("projectModel").oData;

			let tableModel = this.getView().getModel("tblModel").oData;
			let nitblmodel = this.getView().getModel("nitblmodel").oData;


			parentModel["companyid"] = commonService.session("companyId");
			parentModel["userid"] = commonService.session("userId");
			parentModel.startdate = commonFunction.getDate(parentModel.startdate);
			parentModel.enddate = commonFunction.getDate(parentModel.enddate);
			parentModel["subcontractorid1"] = currentContext.getView().byId("subcontractor1")?.getSelectedItem()?.mProperties.key ?? null;
			parentModel["subcontractorid2"] = currentContext.getView().byId("subcontractor2")?.getSelectedItem()?.mProperties.key ?? null;

			Projectservice.saveProject(parentModel, function (data) {

				MessageToast.show("Project  update sucessfully");

				tableModel.map(function (oModel, index) {
					oModel["companyid"] = commonService.session("companyId");
					oModel["userid"] = commonService.session("userId");

					oModel.startdate = (oModel.startdate != null) ? commonFunction.getDate(oModel.startdate) : oModel.startdate;
					oModel.enddate = (oModel.enddate != null) ? commonFunction.getDate(oModel.enddate) : oModel.enddate;
					oModel.actualstartdate = (oModel.actualstartdate != null) ? commonFunction.getDate(oModel.actualstartdate) : oModel.actualstartdate;
					oModel.actualenddate = (oModel.actualenddate != null) ? commonFunction.getDate(oModel.actualenddate) : oModel.actualenddate;
					// oModel.isactive = oModel.isactive===true?1:0;
					// oModel.isstd = oModel.isstd===true?1:0;

					Projectservice.saveProjectActivityDetail(oModel, function (data) {
						MessageToast.show("Project details update sucessfully");

					});

				})


				currentContext.resetModel();
				// this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
				// }
			})
			//}
		},


		onNISave: function () {
			var currentContext = this;
			let parentModel = this.getView().getModel("projectModel").oData;
			console.log("-----------parentModel-------------", parentModel);
			let tableModel = this.getView().getModel("tblModel").oData;
			let nitblmodel = this.getView().getModel("nitblmodel").oData;


			parentModel["companyid"] = commonService.session("companyId");
			parentModel["userid"] = commonService.session("userId");
			parentModel.startdate = commonFunction.getDate(parentModel.startdate);
			parentModel.enddate = commonFunction.getDate(parentModel.enddate);
			parentModel["subcontractorid1"] = currentContext.getView().byId("subcontractor1")?.getSelectedItem()?.mProperties?.key ?? null;
			parentModel["subcontractorid2"] = currentContext.getView().byId("subcontractor2")?.getSelectedItem()?.mProperties?.key ?? null;

			Projectservice.saveProject(parentModel, function (data) {
				MessageToast.show("Project  update sucessfully");
				nitblmodel.map(function (oModel, index) {
					oModel["companyid"] = commonService.session("companyId");
					oModel["userid"] = commonService.session("userId");

					oModel.startdate = (oModel.startdate != null) ? commonFunction.getDate(oModel.startdate) : oModel.startdate;
					oModel.enddate = (oModel.enddate != null) ? commonFunction.getDate(oModel.enddate) : oModel.enddate;
					oModel.actualstartdate = (oModel.actualstartdate != null) ? commonFunction.getDate(oModel.actualstartdate) : oModel.actualstartdate;
					oModel.actualenddate = (oModel.actualenddate != null) ? commonFunction.getDate(oModel.actualenddate) : oModel.actualenddate;
					Projectservice.saveNIActivityDetail(oModel, function (data) {
						MessageToast.show("NI details update sucessfully");

					});

				})
				currentContext.resetModel();
				// this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
				// }
			})
			//}
		},


		validateForm: function () {
			var isValid = true;
			if (!commonFunction.isRequired(this, "txtStartdate", "Start date is required."))
				isValid = false;
			if (!commonFunction.isRequired(this, "txtenddate", "End date is required."))

				return isValid;
		},


		loadData: function () {
			var currentContext = this;

			billofMaterialService.getAllBillOfMaterialResult(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(oModel, "billOfMaterialList");
				//
			});
		},


		resetModel: function () {

			var emptyModel = this.getModelDefault();
			var model = this.getView().getModel("projectModel");
			model.setData({});
			this.getView().byId("eng").setSelectedKeys([]);
			this.getView().byId("manager").setSelectedKeys([]);
			this.getView().byId("salesenginner").setSelectedKeys([]);
			this.getView().byId("salesmanager").setSelectedKeys([]);


			var tableModel = this.getView().getModel("tblModel");
			tableModel.setData({});
			this.getView().getModel("nitblmodel").setData({});

			// this.loadData();

		},

		// function for calculate end date or completion day
		dayCalculation: async function (oEvent) {
       
			let oThis = this;
			let DetailModel = oThis.getView().getModel("projectModel");
			let ItemConsumptiondata = DetailModel.oData;
			if (oEvent.mParameters.id == "componentcontainer---projectdetail--txtenddate") {
				var parts = ItemConsumptiondata.startdate.split('/');
				let startdate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

				parts = ItemConsumptiondata.enddate.split('/');

				const enddate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

				// let enddate = Date.parse(new Date(parts[2], parts[1], parts[0]));// get  difference in start date and end date in millseconds
				// Define two date objects


				// Calculate the time difference in milliseconds
				const timeDifference = Math.abs(enddate - startdate);

				// Calculate the number of milliseconds in a day
				const millisecondsInDay = 1000 * 60 * 60 * 24;

				// Calculate the day difference
				ItemConsumptiondata.completiondays = ((timeDifference / millisecondsInDay) + 1);

				// Output the result
				// console.log(`The difference between ${date1.toDateString()} and ${date2.toDateString()} is ${dayDifference} days.`);


				// ItemConsumptiondata.completiondays = Math.floor((enddate - startdate) / (86400 * 1000));// Days
			}
			else {

				var endDate = new Date(commonFunction.getDate(ItemConsumptiondata.startdate));
				endDate.setDate(endDate.getDate() + ((parseInt(ItemConsumptiondata.completiondays)) - 1));

				let originalDate = new Date(endDate);
				let dateFormatter = sap.ui.core.format.DateFormat.getInstance({ pattern: "dd/MM/yyyy" });
				let enddate = dateFormatter.format(originalDate);

				ItemConsumptiondata.enddate = enddate;
			}

			DetailModel.refresh();

		},
		// function for calculate end date or completion day
		onclick: async function (oEvent) {

			let oThis = this;
			let DetailModel = oThis.getView().getModel("tblModel");
			let completiondays = parseFloat(oThis.getView().getModel("projectModel").oData.completiondays);

			let ItemConsumptiondata = DetailModel.oData;
			let result = [];
			let sum = 0;
			let startdate = oThis.getView().getModel("projectModel").oData.startdate;
			{
				let endDate = new Date(commonFunction.getDate(startdate));
				endDate.setDate(endDate.getDate());

				let originalDate = new Date(endDate);
				let dateFormatter = sap.ui.core.format.DateFormat.getInstance({ pattern: "dd/MM/yyyy" });
				let enddate = dateFormatter.format(originalDate);
				startdate = enddate;
			}

			let stagedaycompletion = 0;

			let validate = ItemConsumptiondata.some(function (element, index) {
				// Condition to break the loop
				if (element.isactive == 1) {
					if (element.projectweightage != null) {
						result.push({
							stagesequence: index,
							projectweightage: element.projectweightage,
							stagedaycompletion: parseFloat((stagedaycompletion + ((completiondays / 100) * (parseFloat(element.projectweightage)))).toFixed(2)),
							completiondays: parseFloat((((completiondays / 100) * parseFloat(element.projectweightage)))),
							completiondaystable: (parseFloat((((completiondays / 100) * parseFloat(element.projectweightage))))).toFixed(2)
						});
						ItemConsumptiondata[index].completiondays = result[(result.length) - 1].completiondays;
						ItemConsumptiondata[index].completiondaystable = result[(result.length) - 1].completiondaystable;


						stagedaycompletion = parseFloat((stagedaycompletion + ((completiondays / 100) * (parseFloat(element.projectweightage)))));
					}
					else {
						MessageToast.show(`projectweightage of stage  ${element.stagename} is not defined`);
						return false;
					}
				}

			});
			let validate1 = result.some(function (element, index) {
				sum = sum + parseFloat(element.projectweightage);
			});

			if (sum != 100) {
				sum > 100 ? MessageToast.show(`projectweightage of stage is greater than 100%  and it is ${sum}`) : MessageToast.show(`projectweightage of stage is less than 100%  and it is  ${sum}`);
				return false;
			}


			let validate3 = result.some(function (element, index) {



				if (index != 0) {
					{
						let endDate = new Date(commonFunction.getDate(startdate));
						// endDate.setHours(0, 0, 0, 0);

						let input = (!Number.isInteger(parseInt(element.stagedaycompletion.toFixed(3)))) ? element.stagedaycompletion : (element.stagedaycompletion - 0.1);

						endDate.setDate(endDate.getDate() + input);

						let originalDate = new Date(endDate);
						let dateFormatter = sap.ui.core.format.DateFormat.getInstance({ pattern: "dd/MM/yyyy" });
						let enddate = dateFormatter.format(originalDate);

						ItemConsumptiondata[element.stagesequence].enddate = enddate;
						result[index].enddate = enddate;

					}


					if ((Number.isInteger(result[index - 1].stagedaycompletion))) {
						let StartDate = new Date(commonFunction.getDate(result[index - 1].enddate));
						StartDate.setDate(StartDate.getDate() + 1);
						let originalDate = new Date(StartDate);
						let dateFormatter = sap.ui.core.format.DateFormat.getInstance({ pattern: "dd/MM/yyyy" });
						StartDate = dateFormatter.format(originalDate);

						ItemConsumptiondata[element.stagesequence].startdate = StartDate;
						result[index].startdate = StartDate;
					}

					else {

						ItemConsumptiondata[element.stagesequence].startdate = (result[index - 1].enddate);
						result[index].startdate = (result[index - 1].enddate);


					}
				}

				else {
					if (element.completiondays > 1) {
						let endDate = new Date(commonFunction.getDate(startdate));
						let input = (!Number.isInteger(parseInt(element.stagedaycompletion.toFixed(3)))) ? element.stagedaycompletion : (element.stagedaycompletion - 0.1);

						endDate.setDate(endDate.getDate() + (input));



						let originalDate = new Date(endDate);
						let dateFormatter = sap.ui.core.format.DateFormat.getInstance({ pattern: "dd/MM/yyyy" });
						let enddate = dateFormatter.format(originalDate);

						ItemConsumptiondata[element.stagesequence].enddate = enddate;
						result[index].enddate = enddate;

					}
					else {
						ItemConsumptiondata[element.stagesequence].enddate = oThis.getView().getModel("projectModel").oData.startdate;
						result[index].enddate = oThis.getView().getModel("projectModel").oData.startdate;

					}


					ItemConsumptiondata[element.stagesequence].startdate = oThis.getView().getModel("projectModel").oData.startdate;
					result[index].startdate = oThis.getView().getModel("projectModel").oData.startdate;


				}
				DetailModel.refresh();

			})
		},
		
        // Function to reset all filters applied to table
		getAllActivities: async function(){
			this.groupReset = false;
            var oTable = this.byId("tblActiviteStatus"),
                oBinding = oTable.getBinding("items"),
                aGroups = [];
                oBinding.sort(aGroups);
                this.groupReset = false;
		},

		onniclick: async function (oEvent) {

			let oThis = this;
			let DetailModel = oThis.getView().getModel("nitblmodel");
			let completiondays = parseFloat(oThis.getView().getModel("projectModel").oData.completiondays);

			let ItemConsumptiondata = DetailModel.oData;
			let result = [];
			let sum = 0;
			let startdate = oThis.getView().getModel("projectModel").oData.startdate;
			{
				let endDate = new Date(commonFunction.getDate(startdate));
				endDate.setDate(endDate.getDate() - 1);

				let originalDate = new Date(endDate);
				let dateFormatter = sap.ui.core.format.DateFormat.getInstance({ pattern: "dd/MM/yyyy" });
				let enddate = dateFormatter.format(originalDate);
				startdate = enddate;
			}

			let stagedaycompletion = 0;

			let validate = ItemConsumptiondata.some(function (element, index) {
				// Condition to break the loop
				if (element.isactive == 1) {
					if (element.projectweightage != null) {
						result.push({
							stagesequence: index,
							projectweightage: element.projectweightage,
							stagedaycompletion: parseFloat((stagedaycompletion + ((completiondays / 100) * (parseFloat(element.projectweightage)))).toFixed(1)),
							completiondays: parseFloat((((completiondays / 100) * parseFloat(element.projectweightage))).toFixed(1))
						});
						ItemConsumptiondata[index].completiondays = result[(result.length) - 1].completiondays;

						stagedaycompletion = parseFloat((stagedaycompletion + ((completiondays / 100) * (parseFloat(element.projectweightage)))).toFixed(1));
					}
					else {
						MessageToast.show(`projectweightage of stage  ${element.stagename} is not defined`);
						return false;
					}
				}

			});
			let validate1 = result.some(function (element, index) {
				sum = sum + parseFloat(element.projectweightage);
			});

			if (sum != 100) {
				sum > 100 ? MessageToast.show(`projectweightage of stage is greater than 100%  and it is ${sum}`) : MessageToast.show(`projectweightage of stage is less than 100%  and it is  ${sum}`);
				return false;
			}


			let validate3 = result.some(function (element, index) {



				if (index != 0) {
					{
						let endDate = new Date(commonFunction.getDate(startdate));
						endDate.setDate(endDate.getDate() + Math.ceil(element.stagedaycompletion));

						let originalDate = new Date(endDate);
						let dateFormatter = sap.ui.core.format.DateFormat.getInstance({ pattern: "dd/MM/yyyy" });
						let enddate = dateFormatter.format(originalDate);

						ItemConsumptiondata[element.stagesequence].enddate = enddate;
						result[index].enddate = enddate;

					}


					if ((Number.isInteger(result[index - 1].stagedaycompletion))) {
						let StartDate = new Date(commonFunction.getDate(result[index - 1].enddate));
						StartDate.setDate(StartDate.getDate() + 1);
						let originalDate = new Date(StartDate);
						let dateFormatter = sap.ui.core.format.DateFormat.getInstance({ pattern: "dd/MM/yyyy" });
						StartDate = dateFormatter.format(originalDate);

						ItemConsumptiondata[element.stagesequence].startdate = StartDate;
						result[index].startdate = StartDate;
					}

					else {

						ItemConsumptiondata[element.stagesequence].startdate = (result[index - 1].enddate);
						result[index].startdate = (result[index - 1].enddate);


					}
				}

				else {
					if (element.completiondays > 1) {
						let endDate = new Date(commonFunction.getDate(startdate));
						endDate.setDate(endDate.getDate() + Math.ceil(element.stagedaycompletion));

						let originalDate = new Date(endDate);
						let dateFormatter = sap.ui.core.format.DateFormat.getInstance({ pattern: "dd/MM/yyyy" });
						let enddate = dateFormatter.format(originalDate);

						ItemConsumptiondata[element.stagesequence].enddate = enddate;
						result[index].enddate = enddate;

					}
					else {
						ItemConsumptiondata[element.stagesequence].enddate = oThis.getView().getModel("projectModel").oData.startdate;
						result[index].enddate = oThis.getView().getModel("projectModel").oData.startdate;

					}


					ItemConsumptiondata[element.stagesequence].startdate = oThis.getView().getModel("projectModel").oData.startdate;
					result[index].startdate = oThis.getView().getModel("projectModel").oData.startdate;


				}
				DetailModel.refresh();

			})
			// else {
			// 	ItemConsumptiondata[element.stagesequence].startdate = startdate;

			// }

			// });

			// DetailModel.refresh();

		},


		onDragStart: function (event) {
			// Get the dragged item
			var listItem = event.getParameter("target");

			// Set the dragged data
			event.getParameter("dragSession").setComplexData("draggedRow", {
				listItem: listItem,
				model: listItem.getBindingContext("tblModel").getObject()
			});
		},

		onDrop: function (event) {
			// Get the dragged item data
			var draggedData = event.getParameter("dragSession").getComplexData("draggedRow");

			// Get the drop target
			var dropPosition = event.getParameter("dropPosition");
			var dropIndex = event.getParameter("dropControl").indexOfItem(event.getParameter("droppedControl"));

			// Update the table model based on the drop position
			var tableModel = this.getView().getModel("tblModel");
			var tableData = tableModel.getProperty("/");
			tableData.splice(dropIndex, 0, draggedData.model);
			tableModel.setProperty("/", tableData);

			// Remove the dragged row from the source position
			var sourceIndex = event.getParameter("dragSession").getComplexData("draggedRow").listItem.getIndex();
			event.getParameter("dragSession").getComplexData("draggedRow").listItem.getParent().removeItem(sourceIndex);

			// Update the binding context for the dragged item
			draggedData.listItem.setBindingContext(tableModel.createBindingContext("/" + dropIndex));
		},

		onDownload: async function (oEvent) {
			let oConfig = sap.ui.getCore().getModel("configModel");

			let oDownloadData = oEvent.getSource();
			let [doc_url, document_name] = oDownloadData.data("mySuperExtraData").split('_');
			let image_url = oConfig.oData.webapi.docurl + doc_url;

			var oXHR = new XMLHttpRequest();
			oXHR.open("GET", image_url, true);
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

		handleSelectionFinish: function (oEvt) {

			let oprojectModel = this.getView().getModel("projectModel");
			let oprojectModeldata = oprojectModel.oData;
			let selectedItems = oEvt.getParameter("selectedItems");
			let roleids = [];

			for (var i = 0; i < selectedItems.length; i++) {
				roleids.push(selectedItems[i].getProperty("key"));
			}
			if (oEvt.mParameters.id == "componentcontainer---projectactivitiesAdd--eng") {
				oprojectModeldata.niengineer = roleids.join(",");
			}
			else if (oEvt.mParameters.id == "componentcontainer---projectactivitiesAdd--manager") {
				oprojectModeldata.nimanager = roleids.join(",");
			}
			else if (oEvt.mParameters.id == "componentcontainer---projectactivitiesAdd--salesenginner") {
				oprojectModeldata.salesengineer = roleids.join(",");
			}
			else {
				oprojectModeldata.salesmanager = roleids.join(",");
			}

		},
	});
}, true);
