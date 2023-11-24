sap.ui.define(
  [
    "sap/ui/model/json/JSONModel",
    "sap/ui/elev8rerp/componentcontainer/controller/BaseController",
    "sap/ui/model/Sorter",
    "sap/ui/elev8rerp/componentcontainer/services/ProjectManagement/Project.service",
    "sap/ui/elev8rerp/componentcontainer/services/ProjectManagement/AttributeList.service",
    "sap/ui/elev8rerp/componentcontainer/utility/xlsx",
    "sap/ui/elev8rerp/componentcontainer/services/Common.service",
    "sap/ui/elev8rerp/componentcontainer/services/Company/ManageUser.service",
    "sap/m/MessageToast",
    "sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function",
    "sap/ui/elev8rerp/componentcontainer/controller/formatter/fragment.formatter",
  ],
  function (
    JSONModel,
    BaseController,
    Sorter,
    Projectservice,
    AttributeListservice,
    xlsx,
    commonService,
    ManageUserService,
    MessageToast,
    commonFunction,
    formatter
  ) {
    "use strict";
    return BaseController.extend(
      "sap.ui.elev8rerp.componentcontainer.controller.ProjectManagement.ProjectDetail",
      {
        formatter: formatter,
        onInit: function () {
          this.bus = sap.ui.getCore().getEventBus();
          this.bus.subscribe(
            "billofmaterial",
            "setDetailPage",
            this.setDetailPage,
            this
          );
          this.bus.subscribe(
            "activitystatus",
            "setDetailActivityPage",
            this.setDetailActivityPage,
            this
          );
          this.bus.subscribe(
            "attributestatus",
            "setDetailAttributePage",
            this.setDetailAttributePage,
            this
          );
          this.bus.subscribe(
            "projectdetail",
            "handleProjectDetails",
            this.handleProjectDetailsList,
            this
          );

          this.bus.subscribe("projectdetailassign", "handleAssignList", this.handleAssignList, this);
          this.bus.subscribe("projectdetailapprove", "handleApproveList", this.handleApproveList, this);

          this.oFlexibleColumnLayout = this.byId("fclProjectActivity");
          var emptyModel = this.getModelDefault();
          var model = new JSONModel();
          model.setData(emptyModel);
          this.getView().setModel(model, "projectModel");
          // set empty model to view
          var model = new JSONModel();
          model.setData({});
          this.getView().setModel(model, "tblModel");

          var stageModel = new JSONModel();
          stageModel.setData({});
          this.getView().setModel(stageModel, "stageModel");

          var stageModel = new JSONModel();
          stageModel.setData({});
          this.getView().setModel(stageModel, "stageModel");

          var activitiestblmodel = new JSONModel();
          activitiestblmodel.setData({});
          this.getView().setModel(activitiestblmodel, "activitymodel");

          var activityListModel = new JSONModel();
          activityListModel.setData({});
          this.getView().setModel(activityListModel, "activityListModel");

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

          this.imagepath = null;
          this.toDataURL('../images/snehaelev8r.png', function (dataUrl) {
            currentContext.imagepath = dataUrl;
          });

          // get all Company Details  
          this.companyname = commonFunction.session("companyname");
          this.companycontact = commonFunction.session("companycontact");
          this.companyemail = commonFunction.session("companyemail");
          this.address = commonFunction.session("address");
          this.city = commonFunction.session("city");
          this.pincode = commonFunction.session("pincode");


          this.flag = false;
          this.bomArr = [];
          this.bomDetailArr = [];
          this.getRole();
          this.getAllDepartment();
          let subcontractorModel = new JSONModel();
          subcontractorModel.setData(commonFunction.getAllSubcontractors(this));
          this.getView().setModel(subcontractorModel, "subcontractorModel");

          commonFunction.getReferenceByType(
            "ProjStgType",
            "stagetypeModel",
            this
          );

          // this function is used for grouping in Activity tab
          let oThis = this;
          this.mGroupFunctions = {
            parentstage: function (oContext) {
              var name = oContext.getProperty("parentstage");
              return {
                key: name,
                text: name,
              };
            },
            stagename: function (oContext) {
              var name = oContext.getProperty("stagename");
              return {
                key: name,
                text: name,
              };
            },
          };
          // this function is used for grouping in Attribute tab
          this.mGroupFunctionsAttribute = {
            parentstagename: function (oContext) {
              var name = oContext.getProperty("parentstagename");
              return {
                key: name,
                text: name,
              };
            },
            stagename: function (oContext) {
              var name = oContext.getProperty("stagename");
              return {
                key: name,
                text: name,
              };
            },
            attributename: function (oContext) {
              var name = oContext.getProperty("attributename");
              return {
                key: name,
                text: name,
              };
            },
          };
          // this function is used for grouping in Attachement tab
          this.mGroupFunctionsAttachement = {
            stagename: function (oContext) {
              if (
                oContext.getProperty("stagename") !== "-" &&
                oContext.getProperty("stagename") !== undefined
              ) {
                var name = oContext.getProperty("stagename");
                return {
                  key: name,
                  text: name,
                };
              }
            },
            activityname: function (oContext) {
              var name = oContext.getProperty("activityname");
              return {
                key: name,
                text: name,
              };
            },
            attributename: function (oContext) {
              var name = oContext.getProperty("attributename");
              return {
                key: name,
                text: name,
              };
            },
            description: function (oContext) {
              var name = oContext.getProperty("description");
              return {
                key: name,
                text: name,
              };
            },
            type: function (oContext) {
              var name = oContext.getProperty("type");
              return {
                key: name,
                text: name,
              };
            },
          };
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
            // apply the selected group settingss
            oBinding.sort(aGroups);
          } else if (this.groupReset == false) {
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
            this._oDialog1 = sap.ui.xmlfragment(
              "sap.ui.elev8rerp.componentcontainer.fragmentview.Reports.GroupDialog",
              this
            );
          }
          this._oDialog1.open();
        },
        //Search functionality for all columns for particular value
        onSearchActivity: function (oEvent) {
          var oTableSearchState = [],
            sQuery = oEvent.getParameter("query");
          var contains = sap.ui.model.FilterOperator.Contains;
          var columns = ["parentstage", "stagename", "status"];
          var filters = new sap.ui.model.Filter(
            columns.map(function (colName) {
              return new sap.ui.model.Filter(colName, contains, sQuery);
            }),
            false
          );
          if (sQuery && sQuery.length > 0) {
            oTableSearchState = [filters];
          }
          this.getView()
            .byId("tblActiviteStatus")
            .getBinding("items")
            .filter(oTableSearchState, "Application");
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
          var columns = ['stagename', 'status'];
          var filters = new sap.ui.model.Filter(
            columns.map(function (colName) {
              return new sap.ui.model.Filter(colName, contains, sQuery);
            }),
            false
          );
          if (sQuery && sQuery.length > 0) {
            oTableSearchState = [filters];
          }
          this.getView()
            .byId("tblProjectStages")
            .getBinding("items")
            .filter(oTableSearchState, "Application");
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
        getAllStages: async function () {
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
          } else if (this.groupReset == false) {
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
            this._oDialog2 = sap.ui.xmlfragment(
              "sap.ui.elev8rerp.componentcontainer.fragmentview.Reports.AttributeGroupDialog",
              this
            );
          }
          this._oDialog2.open();
        },
        //Search functionality for all columns for particular value
        onSearchAttribute: function (oEvent) {
          var oTableSearchState = [],
            sQuery = oEvent.getParameter("query");
          var contains = sap.ui.model.FilterOperator.Contains;
          var columns = ["stagename", "attributename", "parentstagename"];
          var filters = new sap.ui.model.Filter(
            columns.map(function (colName) {
              return new sap.ui.model.Filter(colName, contains, sQuery);
            }),
            false
          );
          if (sQuery && sQuery.length > 0) {
            oTableSearchState = [filters];
          }
          this.getView()
            .byId("tblAttributes")
            .getBinding("items")
            .filter(oTableSearchState, "Application");
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
        getAllAttrubutes: async function () {
          this.groupReset = false;
          var oTable = this.byId("tblAttributes"),
            oBinding = oTable.getBinding("items"),
            aGroups = [];
          oBinding.sort(aGroups);
          this.groupReset = false;
        },
        handleAttachementGroupDialogConfirm: function (oEvent) {
          this.groupReset = false;
          var oTable = this.byId("tblAttachmentStatus"),
            mParams = oEvent.getParameters(),
            oBinding = oTable.getBinding("items"),
            sPath,
            bDescending,
            vGroup,
            aGroups = [];
          if (mParams.groupItem) {
            sPath = mParams.groupItem.getKey();
            bDescending = mParams.groupDescending;
            vGroup = this.mGroupFunctionsAttachement[sPath];
            aGroups.push(new Sorter(sPath, bDescending, vGroup));
            // apply the selected group settingss
            oBinding.sort(aGroups);
          } else if (this.groupReset == false) {
            oBinding.sort(aGroups);
            this.groupReset = false;
          }
        },
        //reset activity dialog
        resetAttachementGroupDialog: function (oEvent) {
          this.groupReset = true;
        },
        //Function to load grouping fragement
        handleAttachementGroupButtonPressed: function () {
          if (!this._oDialog2) {
            this._oDialog2 = sap.ui.xmlfragment(
              "sap.ui.elev8rerp.componentcontainer.fragmentview.Reports.AttachementGroupDialog",
              this
            );
          }
          this._oDialog2.open();
        },
        //Search functionality for all columns for particular value
        onSearchAttachment: function (oEvent) {
          var oTableSearchState = [],
            sQuery = oEvent.getParameter("query");
          var contains = sap.ui.model.FilterOperator.Contains;
          var columns = [
            "stagename",
            "activityname",
            "attributename",
            "description",
            "type",
          ];
          var filters = new sap.ui.model.Filter(
            columns.map(function (colName) {
              return new sap.ui.model.Filter(colName, contains, sQuery);
            }),
            false
          );
          if (sQuery && sQuery.length > 0) {
            oTableSearchState = [filters];
          }
          this.getView()
            .byId("tblAttachmentStatus")
            .getBinding("items")
            .filter(oTableSearchState, "Application");
        },
        onAttachementSort: function (oEvent) {
          this._bDescendingSort = !this._bDescendingSort;
          var oView = this.getView(),
            oTable = oView.byId("tblAttachmentStatus"),
            oBinding = oTable.getBinding("items"),
            oSorter = new Sorter("stagename", this._bDescendingSort);
          oBinding.sort(oSorter);
        },
        // Function to reset all filters applied to table
        getAllAttachments: async function () {
          this.groupReset = false;
          var oTable = this.byId("tblAttachmentStatus"),
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
            quantity: null,
            createdby: null,
            isactive: true,
            isall: true,
            isallactivities: true,
            note: null,
          };
        },


        handleApproveList: function (sChannel, sEvent, oData) {
          let selRow = oData.viewModel;
          let currentContext = this;
          console.log(selRow)
          currentContext.getProjectDetails(selRow.projectid);
          if (selRow.type == "Stage") {
            currentContext.onListItemPressStage(undefined, selRow);
          }
          else {
            var oIconTabBar = currentContext.getView().byId("projectDetail");
            // Set the selected key to switch to the "Other Tab"
            oIconTabBar.setSelectedKey("Activity");
            currentContext.onListItemPressActivity(undefined, selRow);
          }

        },

        handleAssignList: function (sChannel, sEvent, oData) {

          let selRow = oData.viewModel;
          console.log(selRow)
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
          this.bus.publish("billofmaterial", "setDetailPage", {
            viewName: "projectstagedetail",
            viewModel: { projectid: projectModel.id },
          });
        },
        onAddNewRowactivity: function () {
          this.bus = sap.ui.getCore().getEventBus();
          let projectModel = this.getView().getModel("projectModel").getData();
          this.bus.publish("activitystatus", "setDetailActivityPage", {
            viewName: "ProjectActivityDetail",
            viewModel: { projectid: projectModel.id, dependencyStatus: true },
          });
        },
        onAddNewRowAttribute: function () {
          this.bus = sap.ui.getCore().getEventBus();
          let projectModel = this.getView().getModel("projectModel").getData();
          this.bus.publish("attributestatus", "setDetailAttributePage", {
            viewName: "projectattributedetail",
            viewModel: { projectid: projectModel.id, attributetypeids: null },
          });
        },

        onListItemPressStage: function (oEvent, obj) {
          const currentContext = this;
          let oDayHistory = oEvent?.getSource()?.getBindingContext("tblModel")?.getObject() ?? obj;
          let projectModel = this.getView().getModel("projectModel").getData();
          oDayHistory.projectid = projectModel?.id ?? oDayHistory.projectid;
          oDayHistory.isactive = oDayHistory.isactive === 1 || oDayHistory.isactive === true ? true : false;
          oDayHistory.iscompleted = oDayHistory.iscompleted === 1 || oDayHistory.iscompleted === true ? true : false;

          oDayHistory.isstd = oDayHistory.isstd === 1 ? true : false;
          oDayHistory.isstarted =
            oDayHistory.actualstartdate != null ? true : false;
          oDayHistory.projectDetail = projectModel;

          let dependency = oDayHistory.dependency;
          // if dependencyStatus  is true means all dependency stage are completed  so we can proceed it  otherwise false mean  condition is not satisfied
          oDayHistory.dependencyStatus =
            dependency != null
              ? dependency.split(",").every((ele) => {
                return currentContext.projectCompletionObj[ele] == 100;
              })
              : true;
          oDayHistory.WarningStatus =
            oDayHistory.dependencyStatus == false
              ? "To start the Stage you need to first complete prerequisite stages"
              : null;

          this.bus = sap.ui.getCore().getEventBus();
          this.bus.publish("billofmaterial", "setDetailPage", {
            viewName: "projectstagedetail",
            viewModel: oDayHistory,
          });
        },
        onListItemPressActivity: function (oEvent, obj) {
          let currentContext = this;
          let oDayHistory = oEvent?.getSource()?.getBindingContext("activitymodel")?.getObject() ?? obj;
          let projectModel = this.getView().getModel("projectModel").getData();
          oDayHistory.projectid = projectModel.id;
          oDayHistory.isactive = oDayHistory.isactive == 1 || oDayHistory.isactive == true ? true : false;
          oDayHistory.iscompleted = oDayHistory.iscompleted === 1 || oDayHistory.iscompleted === true ? true : false;

          oDayHistory.isstd = oDayHistory.isstd === 1 ? true : false;
          oDayHistory.isstarted =
            oDayHistory.actualstartdate != null ? true : false;

          Projectservice.getStageOrActivityDetail(
            {
              parentid: oDayHistory.parentid,
              projectid: oDayHistory.projectid,
            },
            function (data) {
              let dependency = data[0][0].dependency;
              // if dependencyStatus  is true means all dependency stage are completed  so we can proceed it  otherwise false mean  condition is not satisfied
              oDayHistory.dependencyStatus =
                dependency != null
                  ? dependency.split(",").every((ele) => {
                    return currentContext.projectCompletionObj[ele] == 100;
                  })
                  : true;
              oDayHistory.stageDetail = data[0][0];
              oDayHistory.stagecompletionpercentageRef =
                data[0][0].stagecompletionpercentage;

              oDayHistory.WarningStatus =
                oDayHistory.dependencyStatus == false
                  ? "To start the Activity you need to first complete prerequisite stages"
                  : null;
              oDayHistory.departmentid = data[0][0].departmentid;
              currentContext.bus = sap.ui.getCore().getEventBus();
              currentContext.bus.publish(
                "activitystatus",
                "setDetailActivityPage",
                { viewName: "ProjectActivityDetail", viewModel: oDayHistory }
              );
            }
          );
        },

        getAllStageArActivity: async function (oEvent) {
          let currentContext = this;
          if (oEvent.mParameters.id.match("btnallstage") != null) {
            var tblModel = currentContext.getView().getModel("tblModel");
            tblModel.setData(currentContext.StageList);
          } else if (oEvent.mParameters.id.match("btnallactivity") != null) {
            var activitymodel = currentContext
              .getView()
              .getModel("activitymodel");
            activitymodel.setData(currentContext.ActivityList);
          } else {
            var activitymodel = currentContext
              .getView()
              .getModel("attributeModel");
            activitymodel.setData(currentContext.AttributeList);
          }
        },

        onListItemPressAttribute: function (oEvent) {
          let oDayHistory = oEvent
            .getSource()
            .getBindingContext("attributeModel")
            .getObject();
          let projectModel = this.getView().getModel("projectModel").getData();
          oDayHistory.projectid = projectModel.id;
          this.bus = sap.ui.getCore().getEventBus();
          this.bus.publish("attributestatus", "setDetailAttributePage", {
            viewName: "ProjectAttributeDetail",
            viewModel: { ...oDayHistory },
          });
        },
        // function call on list fragement click
        onListIconPress: function (oEvent) {
          this.getAllProject();
          if (!this._oDialog) {
            this._oDialog = sap.ui.xmlfragment(
              "sap.ui.elev8rerp.componentcontainer.view.ProjectManagement.ProjectActivityAddDialog",
              this
            );
          }
          // Multi-select if required
          var bMultiSelect = !!oEvent.getSource().data("multi");
          this._oDialog.setMultiSelect(bMultiSelect);
          // Remember selections if required
          var bRemember = !!oEvent.getSource().data("remember");
          this._oDialog.setRememberSelections(bRemember);
          this.getView().addDependent(this._oDialog);
          // toggle compact style
          jQuery.sap.syncStyleClass(
            "sapUiSizeCompact",
            this.getView(),
            this._oDialog
          );
          this._oDialog.open();
          // this.bindBillOfMaterial();
        },
        //stage detail
        setDetailPage: function (channel, event, data) {
          this.detailView = sap.ui.view({
            viewName:
              "sap.ui.elev8rerp.componentcontainer.view.ProjectManagement." +
              data.viewName,
            type: "XML",
          });
          let model = new JSONModel();
          model.setData({ ...data.viewModel });
          this.detailView.setModel(model, "StageDetailModel");
          this.oFlexibleColumnLayout.removeAllMidColumnPages();
          this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
          this.oFlexibleColumnLayout.setLayout(
            sap.f.LayoutType.TwoColumnsBeginExpanded
          );
        },
        // Activity Detail
        setDetailActivityPage: function (channel, event, data) {
          this.detailView = sap.ui.view({
            viewName:
              "sap.ui.elev8rerp.componentcontainer.view.ProjectManagement." +
              data.viewName,
            type: "XML",
          });
          let model = new JSONModel();
          model.setData({ ...data.viewModel });
          this.detailView.setModel(model, "ActivityDetailModel");
          this.oFlexibleColumnLayout.removeAllMidColumnPages();
          this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
          this.oFlexibleColumnLayout.setLayout(
            sap.f.LayoutType.TwoColumnsBeginExpanded
          );
        },
        setDetailNIPage: function (channel, event, data) {
          this.detailView = sap.ui.view({
            viewName:
              "sap.ui.elev8rerp.componentcontainer.view.ProjectManagement." +
              data.viewName,
            type: "XML",
          });
          let model = new JSONModel();
          model.setData({ ...data.viewModel });
          this.detailView.setModel(model, "ProjectDetailModel");
          this.detailView.setModel(model, "DetailModel");
          this.oFlexibleColumnLayout.removeAllMidColumnPages();
          this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
          this.oFlexibleColumnLayout.setLayout(
            sap.f.LayoutType.TwoColumnsBeginExpanded
          );
          let DetailModeldata = this.getView()
            .getModel("DetailModel")
            .getData();
        },
        setDetailAttributePage: function (channel, event, data) {
          this.detailView = sap.ui.view({
            viewName:
              "sap.ui.elev8rerp.componentcontainer.view.ProjectManagement." +
              data.viewName,
            type: "XML",
          });
          let model = new JSONModel();
          model.setData(data.viewModel);
          // this.getView().setModel(model, "tblModel");
          this.detailView.setModel(model, "AttributeDetailModel");
          this.oFlexibleColumnLayout.removeAllMidColumnPages();
          this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
          this.oFlexibleColumnLayout.setLayout(
            sap.f.LayoutType.TwoColumnsBeginExpanded
          );
        },
        // function call to get manager and engineer
        getRole: function () {
          let role = [
            { id: 1, discription: "eng" },
            { id: 1, discription: "manager" },
          ];
          let currentContext = this;
          role.map(function (role, index) {
            ManageUserService.getUserByRole(
              { roleid: role.id },
              function (data) {
                let field = role.discription;
                let oroleModel = currentContext
                  .getView()
                  .getModel(`${field}RoleModel`);
                oroleModel.setData(data[0]);
              }
            );
          });
        },
        // function call on close the project fragement
        handleProjectFragementClose: function (oEvent, id) {
          let currentContext = this;
          var aContexts = oEvent.getParameter("selectedContexts");
          if (aContexts != undefined) {
            var selRow = aContexts.map(function (oContext) {
              return oContext.getObject();
            });
            currentContext.getProjectDetails(selRow[0].id);
          }
        },
        getProjectDetails: function (id) {
          debugger;
          let currentContext = this;
          Projectservice.getProject({ id: id }, function (data) {
            data[0][0].isactive = data[0][0].isactive == 1 ? true : false;
            data[0][0].isall = false;
            data[0][0].isallactivities = false;
            currentContext
              .getView()
              .getModel("projectModel")
              .setData(data[0][0]);
            data[0][0].niengineer != null
              ? currentContext
                .getView()
                .byId("eng")
                .setSelectedKeys([...data[0][0].niengineer])
              : "data not available";
            data[0][0].nimanager != null
              ? currentContext
                .getView()
                .byId("manager")
                .setSelectedKeys([...data[0][0].nimanager])
              : "data not available";
            data[0][0].salesmanager != null
              ? currentContext
                .getView()
                .byId("salesmanager")
                .setSelectedKeys([...data[0][0].salesmanager])
              : "data not available";
            data[0][0].subcontractorid1 != null
              ? currentContext
                  .getView()
                  .byId("subcontractor1")
                  .setSelectedKeys([...`${data[0][0].subcontractorid1}`])
              : "data not available";  
            data[0][0].salesengineer != null
              ? currentContext
                .getView()
                .byId("salesenginner")
                .setSelectedKeys([...data[0][0].salesengineer])
              : "data not available";
            commonFunction.getStageDetail(data[0][0].id, currentContext);
            currentContext.getActivitesdetail(data[0][0].id);
            currentContext.getAttributeList(data[0][0].id);
            currentContext.getAttachmentList(data[0][0].id);
            currentContext.getPaymentdetail(data[0][0].id);
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
          } else {
            Projectservice.getStageOrActivityDetail(
              { id: id },
              function (data) {
                let detail = data[0][0];
                detail.isactive = detail.isactive === 1 ? true : false;
                detail.isstd = detail.isstd === 1 ? true : false;
                detail.isstarted =
                  detail.actualstartdate != null ? true : false;
                oThis.bus = sap.ui.getCore().getEventBus();
                oThis.bus.publish("billofmaterial", "setDetailPage", {
                  viewName: "ProjectStageDetail",
                  viewModel: detail,
                });
              }
            );
          }
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
          } else {
            Projectservice.getStageOrActivityDetail(
              { id: id },
              function (data) {
                let detail = data[0][0];
                detail.isactive = detail.isactive === 1 ? true : false;
                detail.isstd = detail.isstd === 1 ? true : false;
                detail.isstarted =
                  detail.actualstartdate != null ? true : false;
                oThis.bus = sap.ui.getCore().getEventBus();
                oThis.bus.publish("billofmaterial", "setDetailPage", {
                  viewName: "ProjectActivityDetail",
                  viewModel: detail,
                });
              }
            );
          }
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
        // getAllStage: function () {
        // 	var currentContext = this;
        // 	Projectservice.getAllStage(function (data) {
        // 		var oModel = currentContext.getView().getModel("StageModel");
        // 		oModel.setData(data[0]);
        // 		oModel.refresh();
        // 	});
        // },

        // get project stage and show in table
        getStageDetail: function (projectid) {
          var currentContext = this;
          currentContext.projectCompletionObj = {};
          var projectModel = currentContext.getView().getModel("projectModel");
          Projectservice.getProjectdetail(
            { id: projectid, field: "stage" },
            function (data) {
              data[0].forEach(function (value, index) {
                data[0][index].activestatus =
                  value.isactive == 1 ? "Active" : "In Active";
                data[0][index].actualstartdate =
                  data[0]?.[index]?.actualstartdate ?? null;
                data[0][index].actualenddate =
                  data[0]?.[index]?.actualenddate ?? null;
                currentContext.projectCompletionObj[value.stageid] =
                  value.stagecompletionpercentage;
              });

              var tblModel = currentContext.getView().getModel("tblModel");
              currentContext.StageList = JSON.parse(JSON.stringify(data[0])); // Array consist of all Activity

              if (data[0]) {
                let filteredData = data[0].filter(function (ele) {
                  return ele.isactive === 1;
                });

                if (projectModel.oData.isall == false) {
                  tblModel.setData(filteredData);
                } else {
                  tblModel.setData(data[0]);
                }
              }
            }
          );
        },
        getAll: function (oEvent) {
          let currentContext = this;
          let tblModel = currentContext.getView().getModel("tblModel");
          let context = oEvent.getSource().getState();
          if (currentContext.StageList.length) {
            let filteredDatafinal = currentContext.StageList.filter(function (
              ele
            ) {
              return ele.isactive === 1;
            });
            if (context == false) {
              tblModel.setData(filteredDatafinal);
            } else {
              tblModel.setData(currentContext.StageList);
            }
          }
        },
        // get NI stage and show in table
        getNIdetail: function (projectid) {
          var currentContext = this;
          Projectservice.getNIdetail({ projectid: projectid }, function (data) {
            data[0].map(function (value, index) {
              data[0][index].activestatus =
                value.isactive == 1 ? "Active" : "In Active";
              data[0][index].actualstartdate =
                data[0]?.[index]?.actualstartdate ?? null;
              data[0][index].actualenddate =
                data[0]?.[index]?.actualenddate ?? null;
            });
            var nitblmodel = currentContext.getView().getModel("nitblmodel");
            nitblmodel.setData(data[0]);
            nitblmodel.refresh();
          });
        },
        // get Activities details of project
        getActivitesdetail: function (projectid) {
          var currentContext = this;
          var projectModel = currentContext.getView().getModel("projectModel");
          var activityListModel = currentContext
            .getView()
            .getModel("activityListModel");
          Projectservice.getProjectdetail(
            { id: projectid, field: "activity" },
            function (data) {
              data[0].map(function (value, index) {
                data[0][index].activestatus =
                  value.isactive == 1 ? "Active" : "In Active";
                data[0][index].actualstartdate =
                  data[0]?.[index]?.actualstartdate ?? null;
                data[0][index].actualenddate =
                  data[0]?.[index]?.actualenddate ?? null;
              });
              var activitymodel = currentContext
                .getView()
                .getModel("activitymodel");
              currentContext.ActivityList = JSON.parse(JSON.stringify(data[0])); // Array consist of all Activity
              if (data[0]) {
                let filteredData = data[0].filter(function (ele) {
                  return ele.isactive === 1;
                });
                activityListModel.setData(filteredData);

                if (projectModel.oData.isallactivities == false) {
                  activitymodel.setData(filteredData);
                } else {
                  activitymodel.setData(data[0]);
                }
              }
              activitymodel.refresh();
            }
          );
        },

        getAllActivitiesForToggle: function (oEvent) {
          let currentContext = this;
          let activitymodel = currentContext
            .getView()
            .getModel("activitymodel");
          let context = oEvent.getSource().getState();
          if (currentContext.ActivityList.length) {
            let filteredDatafinal = currentContext.ActivityList.filter(
              function (ele) {
                return ele.isactive === 1;
              }
            );
            if (context == false) {
              activitymodel.setData(filteredDatafinal);
            } else {
              activitymodel.setData(currentContext.ActivityList);
            }
          }
        },

        // get Payment details of project
        getPaymentdetail: function (projectid) {
          var currentContext = this;
          Projectservice.getReferenceRelatedPayment(
            { typecode: "ProMilestone", projectid: projectid },
            function (data) {
              var paymenttblmodel = currentContext
                .getView()
                .getModel("paymenttblmodel");
              paymenttblmodel.setData(data[0]);
              paymenttblmodel.refresh();
            }
          );
        },
        // Get attachment details of projects
        getAttachmentdetail: function (projectid) {
          var currentContext = this;
          Projectservice.getAttachmentList(
            { projectid: projectid },
            function (data) {
              var attachmenttblmodel = currentContext
                .getView()
                .getModel("attachmenttblmodel");
              attachmenttblmodel.setData(data[0]);
              attachmenttblmodel.refresh();
            }
          );
        },
        // get attribute list details of project
        getAttributeList: function (projectid) {
          var currentContext = this;
          AttributeListservice.getAttributeList(
            { projectid: projectid },
            function (data) {
              data[0].map(function (value, index) {
                data[0][index].activestatus =
                  value.isactive == 1 ? "Active" : "In Active";
                data[0][index].actualstartdate =
                  data[0]?.[index]?.actualstartdate ?? null;
                data[0][index].actualenddate =
                  data[0]?.[index]?.actualenddate ?? null;
              });
              var attributeModel = currentContext
                .getView()
                .getModel("attributeModel");
              currentContext.AttributeList = JSON.parse(
                JSON.stringify(data[0])
              ); // Array consist of all Activity
              attributeModel.setData(data[0]);
              attributeModel.refresh();
            }
          );
        },
        getAttachmentList: function (projectid) {
          let oThis = this;
          Projectservice.getAttachmentList({ projectid: projectid }, (data) => {
            // Use an arrow function here
            if (data.length && data[0].length) {
              var attachmenttblmodel = oThis
                .getView()
                .getModel("attachmenttblmodel");
              attachmenttblmodel.setData(data[0]);
              oThis.gobalarray = []; // Initialize gobalarray using oThis to reference the correct object
              for (let i = 0; i < data[0].length; i++) {
                oThis.gobalarray.push({
                  id: data[0][i].id,
                  stageid: data[0][i].stageid,
                  document_id: data[0][i].document_id,
                  document_url: data[0][i].document_url,
                  document_name: data[0][i].document_name,
                  description: data[0][i].description,
                  type: data[0][i].type,
                  stagename: data[0][i].stagename,
                  activityname: data[0][i].activityname,
                  attributename: data[0][i].attributename,
                });
              }
              attachmenttblmodel.refresh();
            }
          });
        },
        dateFormatter: function (date) {
          const inputDateTime = date == null ? new Date() : new Date(date);
          const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            timeZone: "Asia/Kolkata",
          };
          const indianTime = inputDateTime
            .toLocaleString("en-IN", options)
            .replace(/\//g, "-")
            .replace(",", "");
          const [datePart, timePart] = indianTime.split(" ");
          // Split the date and time parts
          const [day, month, year] = datePart.split("-");
          const [hour, minute, second] = timePart.split(":");
          // Reformat the date
          const formattedDate = `${year}-${month}-${day}`;
          // Reformat the time
          const formattedTime = `${hour}:${minute}:${second}`;
          // Combine the date and time
          const formattedDateTime = `${formattedDate}`;
          return formattedDateTime;
        },
        resourceBundle: function () {
          var currentContext = this;
          var oBundle = this.getModel("i18n").getResourceBundle();
          return oBundle;
        },
        onSave: function () {
          //var isvalid = this.validateForm();
          //if(isvalid){
          var currentContext = this;
          let parentModel = this.getView().getModel("projectModel").oData;
          let tableModel = this.getView().getModel("tblModel").oData;
          var subcontractorstring =
            currentContext
              .getView()
              .byId("subcontractor1")
              ?.getSelectedKeys() ?? null;
          var subcontractorStr = "";
          for (var i = 0; i < subcontractorstring.length; i++) {
            if (i == 0) subcontractorStr = parseInt(subcontractorstring[i]);
            else
              subcontractorStr =
                subcontractorStr + "," + parseInt(subcontractorstring[i]);
          }
          //   let nitblmodel = this.getView().getModel("nitblmodel").oData;
          parentModel["companyid"] = commonService.session("companyId");
          parentModel["userid"] = commonService.session("userId");
          parentModel.startdate = commonFunction.getDate(parentModel.startdate);
          parentModel.enddate = commonFunction.getDate(parentModel.enddate);
          parentModel["subcontractorid1"] = subcontractorStr;
          console.log("----------parentModel-----------", parentModel);
          Projectservice.saveProject(parentModel, function (data) {
            MessageToast.show("Project  update sucessfully");
            tableModel.map(function (oModel, index) {
              oModel["companyid"] = commonService.session("companyId");
              oModel["userid"] = commonService.session("userId");
              oModel.startdate =
                oModel.startdate != null
                  ? commonFunction.getDate(oModel.startdate)
                  : oModel.startdate;
              oModel.enddate =
                oModel.enddate != null
                  ? commonFunction.getDate(oModel.enddate)
                  : oModel.enddate;
              oModel.actualstartdate =
                oModel.actualstartdate != null
                  ? commonFunction.getDate(oModel.actualstartdate)
                  : oModel.actualstartdate;
              oModel.actualenddate =
                oModel.actualenddate != null
                  ? commonFunction.getDate(oModel.actualenddate)
                  : oModel.actualenddate;
              // oModel.isactive = oModel.isactive===true?1:0;
              // oModel.isstd = oModel.isstd===true?1:0;
              Projectservice.saveProjectActivityDetail(oModel, function (data) {
                MessageToast.show("Project details update sucessfully");
              });
            });
            currentContext.resetModel();
            // this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
            // }
          });
          //}
        },
        onNISave: function () {
          var currentContext = this;
          let parentModel = this.getView().getModel("projectModel").oData;
          let tableModel = this.getView().getModel("tblModel").oData;
          let nitblmodel = this.getView().getModel("nitblmodel").oData;
          parentModel["companyid"] = commonService.session("companyId");
          parentModel["userid"] = commonService.session("userId");
          parentModel.startdate = commonFunction.getDate(parentModel.startdate);
          parentModel.enddate = commonFunction.getDate(parentModel.enddate);
          parentModel["subcontractorid1"] =
            currentContext.getView().byId("subcontractor1")?.getSelectedItem()
              ?.mProperties?.key ?? null;
          // parentModel["subcontractorid2"] =
          //   currentContext.getView().byId("subcontractor2")?.getSelectedItem()
          //     ?.mProperties?.key ?? null;
          Projectservice.saveProject(parentModel, function (data) {
            MessageToast.show("Project  update sucessfully");
            nitblmodel.map(function (oModel, index) {
              oModel["companyid"] = commonService.session("companyId");
              oModel["userid"] = commonService.session("userId");
              oModel.startdate =
                oModel.startdate != null
                  ? commonFunction.getDate(oModel.startdate)
                  : oModel.startdate;
              oModel.enddate =
                oModel.enddate != null
                  ? commonFunction.getDate(oModel.enddate)
                  : oModel.enddate;
              oModel.actualstartdate =
                oModel.actualstartdate != null
                  ? commonFunction.getDate(oModel.actualstartdate)
                  : oModel.actualstartdate;
              oModel.actualenddate =
                oModel.actualenddate != null
                  ? commonFunction.getDate(oModel.actualenddate)
                  : oModel.actualenddate;
              Projectservice.saveNIActivityDetail(oModel, function (data) {
                MessageToast.show("NI details update sucessfully");
              });
            });
            currentContext.resetModel();
            // this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
            // }
          });
          //}
        },
        validateForm: function () {
          var isValid = true;
          if (
            !commonFunction.isRequired(
              this,
              "txtStartdate",
              "Start date is required."
            )
          )
            isValid = false;
          if (
            !commonFunction.isRequired(
              this,
              "txtenddate",
              "End date is required."
            )
          )
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
          //this.getView().getModel("nitblmodel").setData({});
          // this.loadData();
        },
        // function for calculate end date or completion day
        dayCalculation: async function (oEvent) {
          let oThis = this;
          let DetailModel = oThis.getView().getModel("projectModel");
          let ItemConsumptiondata = DetailModel.oData;
          if (
            oEvent.mParameters.id ==
            "componentcontainer---projectactivitiesAdd--txtenddate"
          ) {
            var parts = ItemConsumptiondata.startdate.split("/");
            let startdate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            parts = ItemConsumptiondata.enddate.split("/");
            const enddate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            // let enddate = Date.parse(new Date(parts[2], parts[1], parts[0]));// get  difference in start date and end date in millseconds
            // Define two date objects
            // Calculate the time difference in milliseconds
            const timeDifference = Math.abs(enddate - startdate);
            // Calculate the number of milliseconds in a day
            const millisecondsInDay = 1000 * 60 * 60 * 24;
            // Calculate the day difference
            ItemConsumptiondata.completiondays =
              timeDifference / millisecondsInDay + 1;
          } else {
            var endDate = new Date(
              commonFunction.getDate(ItemConsumptiondata.startdate)
            );
            endDate.setDate(
              endDate.getDate() +
              (parseInt(ItemConsumptiondata.completiondays) - 1)
            );
            let originalDate = new Date(endDate);
            let dateFormatter = sap.ui.core.format.DateFormat.getInstance({
              pattern: "dd/MM/yyyy",
            });
            let enddate = dateFormatter.format(originalDate);
            ItemConsumptiondata.enddate = enddate;
          }
          DetailModel.refresh();
        },
        // function for calculate end date or completion day
        onclick: async function (oEvent) {
          let oThis = this;
          let DetailModel = oThis.getView().getModel("tblModel");
          let completiondays = parseFloat(
            oThis.getView().getModel("projectModel").oData.completiondays
          );
          let ItemConsumptiondata = DetailModel.oData;
          let result = [];
          let sum = 0;
          let startdate = oThis.getView().getModel("projectModel")
            .oData.startdate;
          {
            let endDate = new Date(commonFunction.getDate(startdate));
            endDate.setDate(endDate.getDate());
            let originalDate = new Date(endDate);
            let dateFormatter = sap.ui.core.format.DateFormat.getInstance({
              pattern: "dd/MM/yyyy",
            });
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
                  stagedaycompletion: parseFloat(
                    (
                      stagedaycompletion +
                      (completiondays / 100) *
                      parseFloat(element.projectweightage)
                    ).toFixed(2)
                  ),
                  completiondays: parseFloat(
                    (completiondays / 100) *
                    parseFloat(element.projectweightage)
                  ),
                  completiondaystable: parseFloat(
                    (completiondays / 100) *
                    parseFloat(element.projectweightage)
                  ).toFixed(2),
                });
                ItemConsumptiondata[index].completiondays =
                  result[result.length - 1].completiondays;
                ItemConsumptiondata[index].completiondaystable =
                  result[result.length - 1].completiondaystable;
                stagedaycompletion = parseFloat(
                  stagedaycompletion +
                  (completiondays / 100) *
                  parseFloat(element.projectweightage)
                );
              } else {
                MessageToast.show(
                  `projectweightage of stage  ${element.stagename} is not defined`
                );
                return false;
              }
            }
          });
          let validate1 = result.some(function (element, index) {
            sum = sum + parseFloat(element.projectweightage);
          });
          if (sum != 100) {
            sum > 100
              ? MessageToast.show(
                `projectweightage of stage is greater than 100%  and it is ${sum}`
              )
              : MessageToast.show(
                `projectweightage of stage is less than 100%  and it is  ${sum}`
              );
            return false;
          }
          let validate3 = result.some(function (element, index) {
            if (index != 0) {
              {
                let endDate = new Date(commonFunction.getDate(startdate));
                // endDate.setHours(0, 0, 0, 0);
                let input = !Number.isInteger(
                  parseInt(element.stagedaycompletion.toFixed(3))
                )
                  ? element.stagedaycompletion
                  : element.stagedaycompletion - 0.1;
                endDate.setDate(endDate.getDate() + input);
                let originalDate = new Date(endDate);
                let dateFormatter = sap.ui.core.format.DateFormat.getInstance({
                  pattern: "dd/MM/yyyy",
                });
                let enddate = dateFormatter.format(originalDate);
                ItemConsumptiondata[element.stagesequence].enddate = enddate;
                result[index].enddate = enddate;
              }
              if (Number.isInteger(result[index - 1].stagedaycompletion)) {
                let StartDate = new Date(
                  commonFunction.getDate(result[index - 1].enddate)
                );
                StartDate.setDate(StartDate.getDate() + 1);
                let originalDate = new Date(StartDate);
                let dateFormatter = sap.ui.core.format.DateFormat.getInstance({
                  pattern: "dd/MM/yyyy",
                });
                StartDate = dateFormatter.format(originalDate);
                ItemConsumptiondata[element.stagesequence].startdate =
                  StartDate;
                result[index].startdate = StartDate;
              } else {
                ItemConsumptiondata[element.stagesequence].startdate =
                  result[index - 1].enddate;
                result[index].startdate = result[index - 1].enddate;
              }
            } else {
              if (element.completiondays > 1) {
                let endDate = new Date(commonFunction.getDate(startdate));
                let input = !Number.isInteger(
                  parseInt(element.stagedaycompletion.toFixed(3))
                )
                  ? element.stagedaycompletion
                  : element.stagedaycompletion - 0.1;
                endDate.setDate(endDate.getDate() + input);
                let originalDate = new Date(endDate);
                let dateFormatter = sap.ui.core.format.DateFormat.getInstance({
                  pattern: "dd/MM/yyyy",
                });
                let enddate = dateFormatter.format(originalDate);
                ItemConsumptiondata[element.stagesequence].enddate = enddate;
                result[index].enddate = enddate;
              } else {
                ItemConsumptiondata[element.stagesequence].enddate = oThis
                  .getView()
                  .getModel("projectModel").oData.startdate;
                result[index].enddate = oThis
                  .getView()
                  .getModel("projectModel").oData.startdate;
              }
              ItemConsumptiondata[element.stagesequence].startdate = oThis
                .getView()
                .getModel("projectModel").oData.startdate;
              result[index].startdate = oThis
                .getView()
                .getModel("projectModel").oData.startdate;
            }
            DetailModel.refresh();
          });
        },
        // Function to reset all filters applied to table
        getAllActivities: async function () {
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
          let completiondays = parseFloat(
            oThis.getView().getModel("projectModel").oData.completiondays
          );
          let ItemConsumptiondata = DetailModel.oData;
          let result = [];
          let sum = 0;
          let startdate = oThis.getView().getModel("projectModel")
            .oData.startdate;
          {
            let endDate = new Date(commonFunction.getDate(startdate));
            endDate.setDate(endDate.getDate() - 1);
            let originalDate = new Date(endDate);
            let dateFormatter = sap.ui.core.format.DateFormat.getInstance({
              pattern: "dd/MM/yyyy",
            });
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
                  stagedaycompletion: parseFloat(
                    (
                      stagedaycompletion +
                      (completiondays / 100) *
                      parseFloat(element.projectweightage)
                    ).toFixed(1)
                  ),
                  completiondays: parseFloat(
                    (
                      (completiondays / 100) *
                      parseFloat(element.projectweightage)
                    ).toFixed(1)
                  ),
                });
                ItemConsumptiondata[index].completiondays =
                  result[result.length - 1].completiondays;
                stagedaycompletion = parseFloat(
                  (
                    stagedaycompletion +
                    (completiondays / 100) *
                    parseFloat(element.projectweightage)
                  ).toFixed(1)
                );
              } else {
                MessageToast.show(
                  `projectweightage of stage  ${element.stagename} is not defined`
                );
                return false;
              }
            }
          });
          let validate1 = result.some(function (element, index) {
            sum = sum + parseFloat(element.projectweightage);
          });
          if (sum != 100) {
            sum > 100
              ? MessageToast.show(
                `projectweightage of stage is greater than 100%  and it is ${sum}`
              )
              : MessageToast.show(
                `projectweightage of stage is less than 100%  and it is  ${sum}`
              );
            return false;
          }
          let validate3 = result.some(function (element, index) {
            if (index != 0) {
              {
                let endDate = new Date(commonFunction.getDate(startdate));
                endDate.setDate(
                  endDate.getDate() + Math.ceil(element.stagedaycompletion)
                );
                let originalDate = new Date(endDate);
                let dateFormatter = sap.ui.core.format.DateFormat.getInstance({
                  pattern: "dd/MM/yyyy",
                });
                let enddate = dateFormatter.format(originalDate);
                ItemConsumptiondata[element.stagesequence].enddate = enddate;
                result[index].enddate = enddate;
              }
              if (Number.isInteger(result[index - 1].stagedaycompletion)) {
                let StartDate = new Date(
                  commonFunction.getDate(result[index - 1].enddate)
                );
                StartDate.setDate(StartDate.getDate() + 1);
                let originalDate = new Date(StartDate);
                let dateFormatter = sap.ui.core.format.DateFormat.getInstance({
                  pattern: "dd/MM/yyyy",
                });
                StartDate = dateFormatter.format(originalDate);
                ItemConsumptiondata[element.stagesequence].startdate =
                  StartDate;
                result[index].startdate = StartDate;
              } else {
                ItemConsumptiondata[element.stagesequence].startdate =
                  result[index - 1].enddate;
                result[index].startdate = result[index - 1].enddate;
              }
            } else {
              if (element.completiondays > 1) {
                let endDate = new Date(commonFunction.getDate(startdate));
                endDate.setDate(
                  endDate.getDate() + Math.ceil(element.stagedaycompletion)
                );
                let originalDate = new Date(endDate);
                let dateFormatter = sap.ui.core.format.DateFormat.getInstance({
                  pattern: "dd/MM/yyyy",
                });
                let enddate = dateFormatter.format(originalDate);
                ItemConsumptiondata[element.stagesequence].enddate = enddate;
                result[index].enddate = enddate;
              } else {
                ItemConsumptiondata[element.stagesequence].enddate = oThis
                  .getView()
                  .getModel("projectModel").oData.startdate;
                result[index].enddate = oThis
                  .getView()
                  .getModel("projectModel").oData.startdate;
              }
              ItemConsumptiondata[element.stagesequence].startdate = oThis
                .getView()
                .getModel("projectModel").oData.startdate;
              result[index].startdate = oThis
                .getView()
                .getModel("projectModel").oData.startdate;
            }
            DetailModel.refresh();
          });
          // else {
          // 	ItemConsumptiondata[element.stagesequence].startdate = startdate;
          // }
          // });
          // DetailModel.refresh();
        },

        onDownload: async function (OEvent) {
          let oThis = this;
          let checkbox = OEvent.getSource();
          let data = checkbox.data("mySuperExtraData");
          oThis.count = 1;

          let [document_url, document_name] = data.split("_");  // 

          let oConfig = sap.ui.getCore().getModel("configModel");
          let url = oConfig.oData.webapi.docurl + document_url;

          var oXHR = new XMLHttpRequest();
          oXHR.open("GET", url, true);
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



        onDragStart: function (event) {
          // Get the dragged item
          var listItem = event.getParameter("target");
          // Set the dragged data
          event.getParameter("dragSession").setComplexData("draggedRow", {
            listItem: listItem,
            model: listItem.getBindingContext("tblModel").getObject(),
          });
        },
        onDrop: function (event) {
          // Get the dragged item data
          var draggedData = event
            .getParameter("dragSession")
            .getComplexData("draggedRow");
          // Get the drop target
          var dropPosition = event.getParameter("dropPosition");
          var dropIndex = event
            .getParameter("dropControl")
            .indexOfItem(event.getParameter("droppedControl"));
          // Update the table model based on the drop position
          var tableModel = this.getView().getModel("tblModel");
          var tableData = tableModel.getProperty("/");
          tableData.splice(dropIndex, 0, draggedData.model);
          tableModel.setProperty("/", tableData);
          // Remove the dragged row from the source position
          var sourceIndex = event
            .getParameter("dragSession")
            .getComplexData("draggedRow")
            .listItem.getIndex();
          event
            .getParameter("dragSession")
            .getComplexData("draggedRow")
            .listItem.getParent()
            .removeItem(sourceIndex);
          // Update the binding context for the dragged item
          draggedData.listItem.setBindingContext(
            tableModel.createBindingContext("/" + dropIndex)
          );
        },

        handleSelectionFinish: function (oEvt) {
          debugger;
          let oprojectModel = this.getView().getModel("projectModel");
          let oprojectModeldata = oprojectModel.oData;
          let selectedItems = oEvt.getParameter("selectedItems");
          let roleids = [];
          for (var i = 0; i < selectedItems.length; i++) {
            roleids.push(selectedItems[i].getProperty("key"));
          }
          if (
            oEvt.mParameters.id == "componentcontainer---projectdetail--eng"
          ) {
            oprojectModeldata.niengineer = roleids.join(",");
          } else if (
            oEvt.mParameters.id == "componentcontainer---projectdetail--manager"
          ) {
            oprojectModeldata.nimanager = roleids.join(",");
          } else if (
            oEvt.mParameters.id ==
            "componentcontainer---projectdetail--salesenginner"
          ) {
            oprojectModeldata.salesengineer = roleids.join(",");
          } else if (
            oEvt.mParameters.id ==
            "componentcontainer---projectdetail--subcontractor1"
          ) {
            oprojectModeldata.subcontractorid1 = roleids.join(",");
          } else {
            oprojectModeldata.salesmanager = roleids.join(",");
          }
        },

        /* generate CSV for  Stage Tab */
        onDataExport:
          sap.m.Table.prototype.exportData ||
          function (oEvent) {
            var currentContext = this;
            var oModel = currentContext.getView().getModel("tblModel");
            var aData = oModel.oData;
            var tbloModel = new sap.ui.model.json.JSONModel();
            tbloModel.setData({ modelData: aData });
            currentContext.getView().setModel(tbloModel, "CSVtblModel");

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/

            var oExport = new Export({
              // Type that will be used to generate the content. Own ExportType's can be created to support other formats
              exportType: new ExportTypeCSV({
                separatorChar: ",",
              }),

              // Pass in the model created above
              models: this.currentContext.getView().getModel("CSVtblModel"),
              // binding information for the rows aggregation
              rows: {
                path: "/modelData",
              },

              // column definitions with column name and binding info for the content

              columns: [
                {
                  name: "ID",
                  template: { content: "{count}" },
                },
                {
                  name: "Stage Name",
                  template: { content: "{stagename}" },
                },
                {
                  name: "Actual Start Date",
                  template: { content: "{actualstartdate}" },
                },
                {
                  name: "Actual End Date",
                  template: { content: "{actualenddate}" },
                },
                {
                  name: "Stage(%)",
                  template: { content: "{stagecompletionpercentage}" },
                },
                {
                  name: "OverDueDays",
                  template: { content: "{overduedays}" },
                },
                {
                  name: "Status",
                  template: { content: "{status}" },
                },
              ],
            });

            // download exported file
            oExport
              .saveFile("StageList")
              .catch(function (oError) {
                MessageBox.error(
                  "Error when downloading data. Browser might not be supported!\n\n" +
                  oError
                );
              })
              .then(function () {
                oExport.destroy();
              });
          },

        /* generate CSV for Activity Tab */
        onDataActivityExport:
          sap.m.Table.prototype.exportData ||
          function (oEvent) {
            var currentContext = this;
            var oActivityModel = currentContext
              .getView()
              .getModel("activitymodel");
            var activityData = oActivityModel.oData;
            var activityoModel = new sap.ui.model.json.JSONModel();
            activityoModel.setData({ modelData: activityData });
            currentContext
              .getView()
              .setModel(activityoModel, "CSVActivityModel");

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/

            var oExport = new Export({
              // Type that will be used to generate the content. Own ExportType's can be created to support other formats
              exportType: new ExportTypeCSV({
                separatorChar: ",",
              }),

              // Pass in the model created above
              models: this.currentContext
                .getView()
                .getModel("CSVActivityModel"),
              // binding information for the rows aggregation
              rows: {
                path: "/modelData",
              },

              // column definitions with column name and binding info for the content

              columns: [
                {
                  name: "ID",
                  template: { content: "{count}" },
                },
                {
                  name: "Stage Name",
                  template: { content: "{parentstage}" },
                },
                {
                  name: "Activity Name",
                  template: { content: "{stagename}" },
                },
                {
                  name: "Actual Start",
                  template: { content: "{actualstartdate}" },
                },
                {
                  name: "Actual End",
                  template: { content: "{actualenddate}" },
                },
                {
                  name: "Stage(%)",
                  template: { content: "{stagecompletionpercentage}" },
                },
                {
                  name: "OverDueDay",
                  template: { content: "{overduedays}" },
                },
                {
                  name: "Status",
                  template: { content: "{status}" },
                },
              ],
            });

            // download exported file
            oExport
              .saveFile("ActivityList")
              .catch(function (oError) {
                MessageBox.error(
                  "Error when downloading data. Browser might not be supported!\n\n" +
                  oError
                );
              })
              .then(function () {
                oExport.destroy();
              });
          },

        /* generate CSV for  Payment Tab */
        onDataPaymentExport:
          sap.m.Table.prototype.exportData ||
          function (oEvent) {
            var currentContext = this;
            var oPaymentModel = currentContext
              .getView()
              .getModel("paymenttblmodel");
            var paymentData = oPaymentModel.oData;
            var paymentoModel = new sap.ui.model.json.JSONModel();
            paymentoModel.setData({ modelData: paymentData });
            currentContext.getView().setModel(paymentoModel, "CSVPaymentModel");

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/

            var oExport = new Export({
              // Type that will be used to generate the content. Own ExportType's can be created to support other formats
              exportType: new ExportTypeCSV({
                separatorChar: ",",
              }),

              // Pass in the model created above
              models: this.currentContext.getView().getModel("CSVPaymentModel"),
              // binding information for the rows aggregation
              rows: {
                path: "/modelData",
              },

              // column definitions with column name and binding info for the content

              columns: [
                {
                  name: "Type",
                  template: { content: "{type}" },
                },
                {
                  name: "Stage",
                  template: { content: "{stagename}" },
                },
                {
                  name: "Activity",
                  template: { content: "{activityname}" },
                },
                {
                  name: "Stage Amount",
                  template: { content: "{stageamount}" },
                },
                {
                  name: "Activity Amount",
                  template: { content: "{activityamount}" },
                },
              ],
            });

            // download exported file
            oExport
              .saveFile("PaymentList")
              .catch(function (oError) {
                MessageBox.error(
                  "Error when downloading data. Browser might not be supported!\n\n" +
                  oError
                );
              })
              .then(function () {
                oExport.destroy();
              });
          },
        /* generate CSV for  Attribute Tab */
        onDataAttributeExport:
          sap.m.Table.prototype.exportData ||
          function (oEvent) {
            var currentContext = this;
            var oAttributeModel = currentContext
              .getView()
              .getModel("attributeModel");
            var attributeData = oAttributeModel.oData;
            var attributeoModel = new sap.ui.model.json.JSONModel();
            attributeoModel.setData({ modelData: attributeData });
            currentContext
              .getView()
              .setModel(attributeoModel, "CSVAttributeModel");

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/

            var oExport = new Export({
              // Type that will be used to generate the content. Own ExportType's can be created to support other formats
              exportType: new ExportTypeCSV({
                separatorChar: ",",
              }),

              // Pass in the model created above
              models: this.currentContext
                .getView()
                .getModel("CSVAttributeModel"),
              // binding information for the rows aggregation
              rows: {
                path: "/modelData",
              },

              // column definitions with column name and binding info for the content

              columns: [
                {
                  name: "Stage",
                  template: { content: "{parentstagename}" },
                },
                {
                  name: "Activity",
                  template: { content: "{stagename}" },
                },
                {
                  name: "Attribute",
                  template: { content: "{attributename}" },
                },
                {
                  name: "Remark",
                  template: { content: "{remark}" },
                },
              ],
            });

            // download exported file
            oExport
              .saveFile("AttributeList")
              .catch(function (oError) {
                MessageBox.error(
                  "Error when downloading data. Browser might not be supported!\n\n" +
                  oError
                );
              })
              .then(function () {
                oExport.destroy();
              });
          },

          onPdf : function(){
            var fullHtml = "";
            var headertable1 = "";
            headertable1 += "<!DOCTYPE html> <html> <head> <title>" + "Order" + "</title>" +
              "<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js'></script>" +
              "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.22/pdfmake.min.js'></script>" +
              "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.62/vfs_fonts.js'></script>" +
              "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js'></script>" +
              "<style type='text/css'>" +
              "table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%; } td, th {border: 1px solid #000;text-align: left;padding: 5px; } th, td {width: 100px;overflow: hidden; } img { width: 180px; height: 120px; text-align: center; } </style> </head>";
      
            headertable1 += "<body id='tblCustomers' class='amin-logo'>";
            headertable1 += "</body>";
            headertable1 += "<script>";
      
            var phone = (this.companycontact === null || this.companycontact == undefined) ? "-" : this.companycontact;
            var email = (this.companyemail === null || this.companyemail == undefined) ? "-" : this.companyemail;
            var address = (this.address === null || this.address == undefined) ? "-" : this.address;
            var city = (this.city === null || this.city == undefined) ? "-" : this.city;
            var pincode = (this.pincode === null || this.pincode == undefined) ? "-" : this.pincode;
            var companyname = this.companyname;
            
          //  let pdfModel = this.getView().getModel("pdfModel");
           // let previousModel = this.getView().getModel("previousModel");
      
          
      
        //  console.log("Array : ",array);
      
            headertable1 += "html2canvas($('#tblCustomers')[0], {" +
              "onrendered: function (canvas) {" +
              "var data = canvas.toDataURL();" +
              "var width = canvas.width;" +
              "var height = canvas.height;" +
              "var docDefinition = {" +
              "pageMargins: [ 40, 20, 40, 60 ]," +
              "content: [";
      
              headertable1 += "{columns: [{text:'" + " " + "', style: 'subheader'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
              headertable1 += "{columns: [{text:'" + " " + "', style: 'subheader'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
              headertable1 += "{columns: [{text:'" + " " + "', style: 'subheader'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
            // headertable1 += "{columns: [{image:'" + this.imagepath + "', width:160, height:35,margin: [0, -30, 0, 0]}]},";
            headertable1 += "{columns: [{text:'HANDOVER CERTIFICATE" + " " + "', style: 'subheaderwithbold'},{text:'" + " " + "', style: 'subheaderone'}]},";
            headertable1 += "{columns: [{text:'" + " " + "', style: 'subheader'},{text:'" + " " + "', style: 'subheaderonespace'}]},";

            headertable1 += "{columns: [{text:'M/s.____________________________," + " " + "', style: 'subheaderhoc'}]},";
            headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderhoc'},{text:'" + " " + "', style: 'subheaderonespacehoc'}]},";
            headertable1 += "{text: '" + "Address_________________," + "', style: 'subheaderhoc'},";
            headertable1 += "{text: '" + "_________________________," + "', style: 'subheader'},";
            headertable1 += "{text: '" + "_________________________." + " " + "', style: 'subheader'},";
            headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
            headertable1 += "{text: 'Sub: Hand Over of Elevator installed at__________________________________________For Free Maintenance.', style: 'title'},";
            headertable1 += "{text: 'Job No.___________________.', style: 'title'},";
            headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
            headertable1 += "{text: 'Dear Sir/Madam,', style: 'title'},";
            headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
            headertable1 += "{text: 'We are pleased to inform you that we have successfully completed the installation of 1 (one) elevator installed at above mentioned site.', style: 'title'},";
            headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
            headertable1 += "{text: 'Our team of experts have carried out all required functional and safety tests on the equipment and found it to be satisfactory in line with highest standards set by Sneha Elevators LLP.', style: 'title'},";
            headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
            headertable1 += "{text: 'We are offering Warranty/Free Maintenance for a period of one year.  Our service department would be maintaining the elevator as per enclosed terms and conditions of maintenance.', style: 'title'},";
            headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";

           // headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
            headertable1 += "{text: 'Details of Equipment: JOB NO_____________________,CAPACITY:________,PASS/________,KGS,STOPS:_______.', style: 'subheaderboldwithoutunderline'},";
            headertable1 += "{text: 'Free Maintenance Period Start From_________/______/________to________/_____/__________.', style: 'subheaderboldwithoutunderline'},";
            headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
            headertable1 += "{text: [{text:'Before completion of the Free Maintenance period we urge you to enter into Annual Maintenance Contract (AMC) with us to ensure that the elevator is uninterruptedly serviced.  Well maintained for trouble free operations and passenger safety.', style: 'title'}]},";
           
            headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
            headertable1 += "{text: 'In order to prolong the life of the equipment, minimize breakdowns and further improve the services being rendered to you, we seek your kind cooperation in attending to the items of work circled in the list “Recommendations to the Owner” printed on the elevator inside the cabin area.', style: 'title'},";
            headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
            headertable1 += "{text: 'For any technical assistance or help, please call the Sneha Elevator LLP.', style: 'title'},";
            headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
         
            headertable1 += "{text: 'ELEV8R Toll Free No. +91 77318 77318.', style: 'subheaderboldwithoutunderlinespace'},";
            headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
           // headertable1 += "{text: 'We have handed over the', style: 'title'},{text: '1 (one) no. Emergency Door Open Key to Mr._______________', style: 'subheaderboldwithoutunderline'},";
            
            headertable1 += "{text: [{text:'We have handed over the', style: 'title'},{text:'1 (one) no. Emergency Door Open Key ', style: 'subheaderboldwithoutunderline'},{text:'to Mr.______________________', style: 'title'}]},";
            headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
            headertable1 += "{text: 'Thanking you and assure you of the best services at all times.', style: 'title'},";
            headertable1 += "{columns: [{text:'" + " " + "', style: 'subheaderspace'},{text:'" + " " + "', style: 'subheaderonespace'}]},";
            headertable1 += "{text: 'Yours faithfully,', style: 'title'},";
            headertable1 += "{columns: [{text:'" + " " + "', style: 'subheader'},{text:'" + " " + "', style: 'subheaderone'}]},";
          

            headertable1 += "{ style: 'tableExample4',";
            headertable1 += " table: {";
            headertable1 += "widths: ['50%','50%'],";
            headertable1 += " body: [";
            headertable1 += "[ { columns: [{text:'For and on behalf of Sneha Elevators LLP " + " " + "', style: 'subheaderformarginenobold'}] },{ columns: [ {text:'" + "For and on behalf of Customer" + "', style: 'subheaderformarginenobold'}] }],";
            headertable1 += "[ { columns: [ {text:'Name :" + " " + "', style: 'subheaderformarginenobold'}] },{ columns: [ {text:'" + "Name :" + "', style: 'subheaderformarginenobold'} ] }],";
            headertable1 += "[ { columns: [ {text:'Signature :" + " " + "', style: 'subheaderformarginenobold'}] },{ columns: [ {text:'" + "Signature :" + "', style: 'subheaderformarginenobold'} ] }],";
            headertable1 += "[ { columns: [ {text:'Designation :" + " " + "', style: 'subheaderformarginenobold'}] },{ columns: [ {text:'" + "Designation :" + "', style: 'subheaderformarginenobold'} ] }],";
            
            headertable1 += "]";
            headertable1 += "},";
      
            headertable1 += "  layout: {";
            headertable1 += "    hLineWidth: function (i, node) {";
            headertable1 += "    return (i === 0 || i === 1) ? 0.5 : 0.5;";
            headertable1 += "    },";
            headertable1 += "    vLineWidth: function (i, node) {";
            headertable1 += "    return (i === 0 || i === 1) ? 0.5 : 0.5;";
            headertable1 += "    }";
            headertable1 += "},";
            headertable1 += "},";




            headertable1 += "{columns: [{text:'TERMS AND CONDITIONS" + " " + "', style: 'subheaderwithbold'},{text:'" + " " + "', style: 'subheaderone'}]},";
           // headertable1 += "{columns: [{text:'" + " " + "', style: 'subheader'},{text:'" + " " + "', style: 'subheaderone'}]},";
           // headertable1 += "{columns: [{text:'" + " " + "', style: 'subheader'},{text:'" + " " + "', style: 'subheaderone'}]},";
          
            headertable1 += "{ style: 'tableExample4',";
            headertable1 += " table: {";
            headertable1 += "widths: ['50%','50%'],";
            headertable1 += " body: [";
          //  headertable1 += "[ { columns: [ {text:'  SECTION 1– SNEHA RESPONSIBILITIES " + "    " + "1.1 SNEHA " + "will use trained and appropriately skilled personnel which it directly employs and/or supervises. They will be qualified to keep THE EQUIPMENT properly adjusted and they will use all reasonable care to maintain THE EQUIPMENT in efficient, reliable and safe operating condition. " + "', style: 'subheaderformarginenobold'}] },{ columns: [ {text:'" + "Designation :" + "', style: 'subheaderformarginenobold'} ] }],";
           
            headertable1 += "[ { columns: [ {text:'  SECTION 1–SNEHA RESPONSIBILITIES " + "    " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'" + "to use, access, examine, copy, disclose or disassemble the " + "', style: 'subheaderformarginenoboldfortable'} ] }],";
            headertable1 += "[ { columns: [ {text:'  1.1 SNEHA  " + " will use trained and appropriately skilled personnel which it directly employs and/or supervises. They will be qualified to keep THE EQUIPMENT properly adjusted and they will use all reasonable care to maintain THE EQUIPMENT in efficient, reliable and safe operating condition." +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'" + "service equipment or the software resident in the service equipment for any purpose whatsoever. If the service is terminated for any reason, we will be given access to your premises to remove the service equipment, including the resident software, at our expense. " + "', style: 'subheaderformarginenoboldfortable'} ] }],";
            headertable1 += "[ { columns: [ {text:'  1.2	PLANNED MAINTAENANCE: " + "    " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'" + "Failure to comply with any of above requirements may result in" + "', style: 'subheaderformarginenoboldfortable'} ] }],";
            headertable1 += "[ { columns: [ {text:' " + " SNEHA will in accordance with their terms hereof, regularly examine, lubricate and adjust THE EQUIPMENT and generally carry out planned maintenance in a systematic and controlled manner using SNEHA developed techniques and expertise. The frequency of examination will depend on the type of equipment and its location." +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'" + "SNEHA suspending the services until the needful is done in consideration of the potential safety hazard." + "', style: 'subheaderformarginenoboldfortable'} ] }],";
            headertable1 += "[ { columns: [ {text:' " + "    " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:' SECTION 4–EXCLUSIONS :" + "  " + "', style: 'subheaderformarginenoboldfortable'} ] }],";
            headertable1 += "[ { columns: [ {text:'  1.3	REPAIR OR REPLACE PARTS:  " + "    " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:' 4. 1 EXCLUSIONS :" + "  " + "', style: 'subheaderformarginenoboldfortable'} ] }],";
            headertable1 += "[ { columns: [ {text:' " + "SNEHA will at its option, repair or replace any parts detailed in the following section which, in its option are defective. Parts will be furnished by SNEHA on an exchange basis under which the replaced parts become the property of SNEHA. However, SNEHA will not make any replacements or repairs necessitated (except ordinary wear and  tear) including, but not limited to, fire, explosion, theft, floods, water, weather, earthquake, vandalism,  misuse, abuse, mischief, or repairs by others." +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'" + "SNEHA assumes no responsibility for the following items of elevator equipment, not included in this contract.Car enclosures, door panels, hung ceilings, car gates,light diffusers, light bulbs, fluorescent tubes, handrails, starters, chokes, mirrors, floor coverings, carpets, other architectural features, hoist way enclosure, hoist way gates, door frames, doors, sills, batteries, security system, external wiring to elevator and hoist way/machine room. Imported components like ELD, Plasma Display & EVAIS etc." + "', style: 'subheaderformarginenoboldfortable'} ] }],";
            headertable1 += "[ { columns: [ {text:'  NON – SNEHA ELEVATORS – SPARE PARTS:  " + "    " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'4.2 NEGLIGENCE OR MISUSE OF EQUIPMENT:" + "  " + "', style: 'subheaderformarginenoboldfortable'} ] }],";
           
            headertable1 += "[ { columns: [ {text:'  " + "THE CUSTOMER has a right to keep the elevator in usable/working condition, which gives him a right for the replacement of worn out/damaged parts/components. The components/parts requiring replacement/repair would be procured by SNEHA on behalf of THE CUSTOMER from the available sources. SNEHA will check the quality and reliability of the components/parts. You retain your rights to any software not provided by SNEHA contained in the Units and agree to allow SNEHA to make one backup or archival copy for you and only for the limited purpose of maintenance    " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'  " + "SNEHA will not incur expenses and is not required, under the terms of this Agreement repairs  necessitated by reason of negligence or misuse or any other cause beyond SNEHA control except ordinary wear and tear. Cost of such repairs necessitated by reason of negligence or cause will be charged to THE CUSTOMER.  " + "', style: 'subheaderformarginenoboldfortable'} ] }],";
            
            headertable1 += "[ { columns: [ {text:'SERVICE TOOLS:" + "    " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'4.3 OTHER SAFETY TESTS, etc." + "  " + "', style: 'subheaderformarginenoboldfortable'} ] }],";
            headertable1 += "[ { columns: [ {text:'  " + "You are responsible to secure our right to use any special service tools required to maintain your non-SNEHA equipment. These tools must be provided prior to our beginning maintenance on such equipment.    " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'  " + "SNEHA will not require to make safety tests other than as set out in section 2.4 (d) hereof nor to install new attachments, nor carry out structural or other alternations on THE EQUIPMENT whether or not recommended  or directed by insurance companies or by governmental authorities, nor to make any replacement with parts of a different design.  " + "', style: 'subheaderformarginenoboldfortable'} ] }],";
            headertable1 += "[ { columns: [ {text:'" + "    " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'SECTION 5 – WORN ITEMS" + "  " + "', style: 'subheaderformarginenoboldfortable'} ] }],";
            headertable1 += "[ { columns: [ {text:'2.10	WORK SCHEDULE:" + "    " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'5.1 WORN – OUT ITEMS" + "  " + "', style: 'subheaderformarginenoboldfortable'} ] }],";
            headertable1 += "[ { columns: [ {text:'" + "All work and services provided for in this Agreement are to be performed during normal working hours on normal working days. Additional costs incurred in carrying out work outside such times will be charged as extra for the overtime premium hours." +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'" + "All worn out items are SNEHA property.  " + "', style: 'subheaderformarginenoboldfortable'} ] }],";
            headertable1 += "[ { columns: [ {text:'SECTION 2 – CALL BACK SERVICE" + "    " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'SECTION 6 – SNEHA LIABILITY" + "  " + "', style: 'subheaderformarginenoboldfortable'} ] }],";
            headertable1 += "[ { columns: [ {text:'2.1 EMERGENCY MINOR ADJUSTMENT CALL BACK SERVICE" + "    " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'6.1 NOT AN INSURANCE CONTRACT:" + "  " + "', style: 'subheaderformarginenoboldfortable'} ] }],";

            headertable1 += "[ { columns: [ {text:'" + "SNEHA will provide emergency minor adjustment CALL-BACK service under this Agreement. This  Call-Back service will be extended 24 hours on all working days as well as holidays for elevators located in cities/towns where SNEHA has a Service Centre                                                            .                                       SECTION 3 – CUSTOMER’S OBLIGATIONS                                   .3.1ACCESS :  THE CUSTOMER will allow SNEHA employees free and unhindered access to THE EQUIPMENT, and the landings, lobbies and machine room associated therewith and all areas mentioned herein.  These areas should be free of danger of falling objects; of ungrounded electrical wires and of tripping hazards, etc. which would pose a danger to those working on THE EQUIPMENT.With due concern for safety of its employees, SNEHA reserves the right to suspend services when in their option SNEHA personnel are subjected to hazardous working environment at site.      " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'" + "SNEHA will not be liable for any loss, damage or delay due to any cause beyond its reasonable control including, but not limited to, lack of shipping space, embargoes, acts of government, strikes, lockouts, fire, explosion, theft, heavy rains, floods riots, civil commotion, war, malicious mischief or acts of God. Should damage occur to SNEHA material, tools or work on the premises from any cause beyond its reasonable control, THE CUSTOMER shall compensate SNEHA thereof. Water seepage in pit/overhead areas/shaft, high/low voltage (standard power supply of 3 phase 380V – 440V, single phase 220V -240V, Hence failed and proven customer shall compensate there off. SNEHA will also not be liable for indirect/consequential losses, under this contract, under any circumstances." + "', style: 'subheaderformarginenoboldfortable'} ] }],";
            
            headertable1 += "[ { columns: [ {text:'3.2	ONLY SNEHA TO MAKE REPAIRS:" + "    " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'6.2 NO POSSESSION:" + "  " + "', style: 'subheaderformarginenoboldfortable'} ] }],";
            headertable1 += "[ { columns: [ {text:'  " + "In the interest of safety of THE EQUIPMENT and its users THE CUSTOMER shall not direct or permit the repair, alternation, replacement or any interference with any of THE EQUIPMENT or ant part thereof, of any items specified herein, by any person or organisation other than SNEHA, its employees or contractors, without SNEHA prior consent.  Such consent will not be unreasonably withheld by SNEHA    " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'  " + "SNEHA does not assume or accept possession or management of any part of THE EQUIPMENT, but such remains THE CUSTOMER’S, exclusively, as the owner or lessee thereof." + "', style: 'subheaderformarginenoboldfortable'} ] }],";
           
            headertable1 += "[ { columns: [ {text:'" + "    " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'SECTION 7 – TERMINATION" + "  " + "', style: 'subheaderformarginenoboldfortable'} ] }],";
            headertable1 += "[ { columns: [ {text:'3.3 LIGHTING/VENTILATION:" + "    " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'7.1 SNEHA RIGHT OF TERMINATION:" + "  " + "', style: 'subheaderformarginenoboldfortable'} ] }],";
           
             headertable1 += "[ { columns: [ {text:'" + "THE CUSTOMER will provide the machine room with adequate lighting, cooling, moisture control and/or ventilation as may be required in the judgment of SNEHA to assist its men in providing the work  set out hereunder and in enhancing the effective operation of THE EQUIPMENT" +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'" + "SNEHA shall be entitled to terminate this agreement forthwith in any of the following events and SNEHA liability hereunder shall, therefore, cease: Where the legal and beneficial ownership of the building has changed Where, in SNEHA opinion, THE EQUIPMENT is or has been subjected to unreasonable use Where SNEHA is prevented from performing any obligation under this agreement by any cause outside its control. Where, in SNEHA opinion, there is a material change in the original intent of the usage of THE  EQUIP-MENT or in the function or character of the building.Where, without SNEHA consent, any work upon THE EQUIPMENT within the scope of this Agreement is undertaken by anyone other than SNEHA employees or its authorised representatives." + "', style: 'subheaderformarginenoboldfortable'} ] }],";
             headertable1 += "[ { columns: [ {text:'" + "    " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'SECTION 9 – MISCELLANEOUS" + "  " + "', style: 'subheaderformarginenoboldfortable'} ] }],";
             headertable1 += "[ { columns: [ {text:'3.4 RESTRICTED AREAS :" + "    " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'9.1  CUSTOMER SERVICE :" + "  " + "', style: 'subheaderformarginenoboldfortable'} ] }],";
             headertable1 += "[ { columns: [ {text:'" + "THE CUSTOMER will keep away from any areas enclosing mechanical or electrical equipment, persons other than SNEHA authorized employees and those expressly authorized by SNEHA. These areas will be used solely for their proper purposes.THE CUSTOMER will provide SNEHA unrestricted ready access to all areas of the building in which any parts of the units are located and to keep all machine rooms and pit areas free from water, stored materials and rubbish/debris. If any unit is malfunctioning or is in a dangerous condition, THE CUSTOMER should immediately notify SNEHA and until SNEHA rectifies the problem, THE CUSTOMER should agree to remove the unit from service and take all possible precautions to prevent its access or use. THE CUSTOMER should agree to display any publicity material relating to safety/use of equipment and warnings to passengers in connection with the use of the elevators." +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'" + "SNEHA will assign a representative to your account who will periodically visit your building and will be available for consultation in any matter relating to the maintenance of the elevators, SNEHA Service Representative will be available to discuss with THE CUSTOMER, THE CUSTOMER’S elevator needs in the areas of modernisation and proper use and care of the elevators. It is agreed between THE CUSTOMER and SNEHA that all disputes, differences and  claims whatsoever which shall at any time arise between the parties hereto or their respective representatives concerning this Contract and all other documents in pursuance hereof as to the rights, duties, obligations or liabilities of the parties hereto respectively by virtue of this contract shall be referred to Arbitration in accordance with the provisions of the Arbitration and Conciliation Act, 1996 as amended from time to time.THE CUSTOMER agrees and accepts that SNEHA will be relieved from all legal provisions/claims,immediately in case of un – authorised repair/access/modification to the elevator done by any other person than SNEHA representative.The contract shall deem to be concluded at Hyderabad and only the courts in Hyderabad shall have jurisdiction in the event of any dispute whatsoever.  This agreement shall be governed by and construed in accordance with India." + "', style: 'subheaderformarginenoboldfortable'} ] }],";
             headertable1 += "[ { columns: [ {text:'3.5 MAINLINE DISCONNECTS :" + "    " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'SECTION 10 – INTELLECTUAL PROPERTY RIGHTS" + "  " + "', style: 'subheaderformarginenoboldfortable'} ] }],";
             headertable1 += "[ { columns: [ {text:'" + "You agree to engage a qualified electrician to service at least once annually the elevator mainline disconnects located in the elevator equipment room. Any counters, meters, tools, remote monitoring devices, or communication devices which we may use or install under this Contract remain our property, solely for the use of SNEHA employees. Such service equipment is not considered a part of the Units. You grant us the right to store or install such service equipment in your building and to authorized SNEHA personnel  You agree to keep the software resident in the service equipment in confidence as a trade secret for SNEHA You will not permit others" +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'" + "10.1 SNEHA may install additional equipment and/or software to enhance the functionality of the control software installed in  the Equipment if appropriate to connect with SNEHA’s service equipment, which additional equipment and/or software shall at all times belong to SNEHA and SNEHA may remove on termination of this contract.  The Customer grants SNEHA the right to connect electronically it service equipment to the equipment and also grants SNEHA full access to read, use and update the data produced by the Control Software." + "', style: 'subheaderformarginenoboldfortable'} ] }],";
            
            
             //headertable1 += "[ { columns: [ {text:'" + "THE CUSTOMER will provide the machine room with adequate lighting, cooling, moisture control and/or ventilation as may be required in the judgment of SNEHA to assist its men in providing the work  set out hereunder and in enhancing the effective operation of THE EQUIPMENT                                .       3.4 RESTRICTED AREAS  :  THE CUSTOMER will keep away from any areas enclosing mechanical or electrical equipment,persons other than SNEHA authorized employees and those expressly authorized by SNEHA. These areas will be used solely for their proper purposes. THE CUSTOMER will provide SNEHA unrestricted ready access to all areas of the building in which any parts of the units are located and to keep all machine rooms and pit areas free from water, stored  materials and rubbish/debris.If any unit is malfunctioning or is in a dangerous condition, THE CUSTOMER should immediately notify SNEHA and until SNEHA rectifies the problem, THE CUSTOMER should agree to remove the unit from service and take all possible precautions to prevent its access or use.THE CUSTOMER should agree to display any publicity material relating to safety/use of equipment and warnings to passengers in connection with the use of the elevators.  " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'" + "SNEHA shall be entitled to terminate this agreement forthwith in any of the following events and SNEHA liability hereunder shall, therefore, cease: Where the legal and beneficial ownership of the building has changed Where, in SNEHA opinion, THE EQUIPMENT is or has been subjected to unreasonable use Where SNEHA is prevented from performing any obligation under this agreement by any cause outside its control. Where, in SNEHA opinion, there is a material change in the original intent of the usage of THE  EQUIP-MENT or in the function or character of the building.Where, without SNEHA consent, any work upon THE EQUIPMENT within the scope of this Agreement is undertaken by anyone other than SNEHA employees or its authorised representatives                          .                         SECTION 9 – MISCELLANEOUS :                              .                        9.1  CUSTOMER SERVICE :  SNEHA will assign a representative to your account who will periodically visit your building and will be  " + "', style: 'subheaderformarginenoboldfortable'} ] }],";
            //headertable1 += "[ { columns: [ {text:' " + " " +  " " + "', style: 'subheaderformarginenoboldfortable'}] },{ columns: [ {text:'4.1 EXCLUSIONS :" + "SNEHA assumes no responsibility for the following items of elevator equipment, not included in this contract." + "', style: 'subheaderformarginenoboldfortable'} ] }],";
           




            headertable1 += "]";
            headertable1 += "},";
      
            headertable1 += "  layout: {";
            headertable1 += "    hLineWidth: function (i, node) {";
            headertable1 += "    return (i === 0 || i === 1) ? 0.0 : 0.0;";
            headertable1 += "    },";
            headertable1 += "    vLineWidth: function (i, node) {";
            headertable1 += "    return (i === 1) ? 0.5 : 0.0;";
            headertable1 += "    }";
            headertable1 += "},";
            headertable1 += "},";
            
            headertable1 += "{columns: [{text:'" + " " + "', style: 'subheader'},{text:'" + " " + "', style: 'subheaderone'}]},";
            headertable1 += "{columns: [{text:'Authorized Signature" + " " + "', style: 'subheader'},{text:'Customer Signature" + " " + "', style: 'subheaderone'}]},";
          
            //headertable1 += "{columns: [{text:'" + " " + "', style: 'subheader'},{text:'" + " " + "', style: 'subheaderone'}]},";
      
            //Define Style For PDF Content
            headertable1 += "]," +
            
              "styles: {" +
              "todatecss: {" +
              "fontSize:9," +
              "bold: true," +
              "alignment:'right'" +
              "}," +
      
              "header: {" +
              "fontSize:8," +
              "bold: true," +
              "border: [false, true, false, false]," +
              "fillColor: '#eeeeee'," +
              "alignment: 'center'," +
              "margin: [0, 5, 0, 0]," +
              "}," +
      
              "title: {" +
              "fontSize:10," +
              "alignment: 'left'," +
              "}," +
      
              "titleboldheader: {" +
              "fontSize:11," +
              "decoration: 'underline',"+
              "bold: true," +
              "alignment: 'left'," +
              "}," +
      
              "titlebold: {" +
              "fontSize:10," +
              "bold: true," +
              "alignment: 'left'," +
              "}," +
      
              "titlewithbold: {" +
              "fontSize:10," +
              "bold: true," +
              "alignment: 'left'," +
              "}," +
      
              "titleincenter: {" +
              "fontSize:11," +
              "bold: true," +
              "alignment: 'center'," +
              "}," +
      
              "titleincenterwithunderline: {" +
              "fontSize:11," +
              "bold: true," +
              "decoration: 'underline',"+
              "alignment: 'center'," +
              "}," +
      
              "headertitleincenter: {" +
              "fontSize:12," +
              "bold: true," +
              "alignment: 'center'," +
              "}," +
      
              "titleheader: {" +
              "fontSize:16," +
              "bold: true," +
              "border: [false, true, false, false]," +
              "fillColor: '#eeeeee'," +
              "alignment: 'center'," +
              "margin: [0, 5, 0, 0]," +
              "}," +
      
              "Footer: {" +
              "fontSize: 7," +
              "margin: [19, 5, 5, 5]," +
              "}," +
      
              "subheader: {" +
              "fontSize:9," +
              "bold: true," +
              "margin: [0, 5, 0, 0]," +
              "}," +

              "subheaderhoc: {" +
              "fontSize:9," +
              "margin: [0, 5, 0, 0]," +
              "}," +
      
              "subheaderformargine: {" +
              "fontSize:11," +
              "margin: [0, 5, 0, 20]," +
              "}," +

              "subheaderformarginenobold: {" +
              "fontSize:11," +
              "margin: [0, 12, 0, 12]," +
              "}," +

              "subheaderformarginenoboldfortable: {" +
              "fontSize:9," +
              "alignment: 'justify'," +
              "margin: [0, 0, 0, 0]," +
              "}," +
      
              "subheaderspace: {" +
              "fontSize:1," +
              "bold: true," +
              "margin: [0, 5, 0, 0]," +
              "}," +
      
              "subheaderwithbold: {" +
              "fontSize:12," +
              "bold: true," +
              "decoration: 'underline',"+
              "margin: [0, 5, 0, 0]," +
              "}," +

              "subheaderboldwithoutunderline: {" +
              "fontSize:10," +
              "bold: true," +
              "margin: [0, 5, 0, 0]," +
              "}," +

              "subheaderboldwithoutunderlinespace: {" +
              "fontSize:16," +
              "bold: true," +
              "margin: [100, 5, 0, 0]," +
              "}," +
      
              "subheaderwithbold13: {" +
              "fontSize:10," +
              "bold: true," +
              "margin: [0, 0, 0, 0]," +
              "}," +
      
              "tablecontent: {" +
              "fontSize:10," +
              "margin: [0, 5, 0, 0]," +
              "}," +
      
              "subheaderone: {" +
              "fontSize:9," +
              "bold: true," +
              "alignment:'right'," +
              "margin: [0, 05, 0, 4]," +
              "}," +
      
              "subheaderonespace: {" +
              "fontSize:1," +
              "bold: true," +
              "alignment:'right'," +
              "margin: [0, 05, 0, 4]," +
              "}," +

              "subheaderonespacehoc: {" +
              "fontSize:1," +
              "bold: true," +
              "alignment:'right'," +
              "margin: [0, 05, 0, 0]," +
              "}," +
      
              "subheaderbold: {" +
              "fontSize:9," +
              "bold: true," +
              "alignment:'right'," +
              "margin: [0, 04, 0, 4]," +
              "}," +
      
              "subheaderleft: {" +
              "fontSize:9," +
              "bold: true," +
              "alignment:'left'," +
              "margin: [0, 05, 0, 4]," +
              "}," +
      
              "amtinwords: {" +
              "fontSize:12," +
              "bold: true," +
              "alignment:'left'," +
              "margin: [0,180, 0,0]," +
              "}," +
      
              "subheadercost: {" +
              "fontSize:12," +
              "bold: true," +
              "alignment:'right'," +
              "margin: [0,200, 0, 0]," +
              "}," +
      
              "subheaderremark4: {" +
              "fontSize:12," +
              "bold: true," +
              "alignment:'left'," +
              "margin: [0,200, 0, 0]," +
              "}," +
      
              "subheaderremark: {" +
              "fontSize:12," +
              "bold: true," +
              "alignment:'left'," +
              "margin: [0,200, 0, 0]," +
              "}," +
      
              "subheadercost1: {" +
              "fontSize:12," +
              "bold: true," +
              "alignment:'right'," +
              "margin: [0,15, 0, 0]," +
              "}," +
      
              "subheaderremark1: {" +
              "fontSize:12," +
              "bold: true," +
              "alignment:'left'," +
              "margin: [0,15, 0, 0]," +
              "}," +
      
              "tableExample: {" +
              "margin: [0, 50, 0, 0]," +
              "fontSize: 8," +
              "}," +
      
              "tableExample2: {" +
              "margin: [0, 15, 0, 0]," +
              "fontSize: 8," +
              "}," +
      
              "specificationHeader: {" +
              "margin: [0, 15, 0, 0]," +
              "alignment : 'center'," +
              "fontSize: 8," +
              "}," +
      
              "specificationTableExample: {" +
              "margin: [0, 0, 0, 0]," +
              "fontSize: 8," +
              "}," +
      
              "tableExample5: {" +
              "margin: [0, 0, 0, 0]," +
              "fontSize: 8," +
              "}," +
      
              "tableExample4: {" +
              "margin: [0, 10, 0, 0]," +
              "fontSize: 9," +
              "}," +
      
              "tableExample3: {" +
              "margin: [0, 15, 0, 340]," +
              "fontSize: 8," +
              "}," +
      
      
              "tableHeader: {" +
              "bold: true," +
              "fontSize: 8," +
              "color: 'black'," +
              "}," +
              "}," +
      
              "defaultStyle: {" +
              "fontSize: 8" +
              "}" +
              "};" +
              "pdfMake.createPdf(docDefinition).download('order.pdf');" +
              "} });";
            headertable1 += "</script></html>";
            fullHtml += headertable1;
            var wind = window.open();
            wind.document.write(fullHtml);
            console.log("fullHtml", fullHtml);
      
            setTimeout(function () {
              wind.close();
            }, 3000);
          },




            }
    );
  },
  true
);
