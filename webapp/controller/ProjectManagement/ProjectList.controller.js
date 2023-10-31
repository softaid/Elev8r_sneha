sap.ui.define(
  [
    "sap/ui/model/json/JSONModel",
    "sap/ui/elev8rerp/componentcontainer/controller/BaseController",
    "sap/ui/model/Sorter",
    "sap/ui/elev8rerp/componentcontainer/services/ProjectManagement/Project.service",
    "sap/ui/elev8rerp/componentcontainer/formatter/ProjectHealthFragment.formatter",
  ],
  function (JSONModel, BaseController, Sorter, Projectservice, formatter) {
    return BaseController.extend(
      "sap.ui.elev8rerp.componentcontainer.controller.LeadManagement.ProjectList",
      {
        formatter: formatter,
        onInit: function () {
          this.bus = sap.ui.getCore().getEventBus();

          this.afilters = [];

          this.bus.subscribe(
            "qutationcreen",
            "handleQutationList",
            this.handleQutationList,
            this
          );
          this.bus.subscribe(
            "projectdetail",
            "handleProjectDetails",
            this.handleProjectDetails,
            this
          );
          this.bus.subscribe("loaddata", "loadData", this.loadData, this);

          var model = new JSONModel();
          model.setData([]);
          this.getView().setModel(model, "projectListModel");
          //this.oFlexibleColumnLayout = this.byId("fclQuotation");

          this.handleRouteMatched(null);

          jQuery.sap.delayedCall(1000, this, function () {
            // this.getView().byId("onSearchId").focus();
          });

          // this function is used for grouping in ProjectList
          this.mGroupFunctions = {
            quotename: function (oContext) {
              var name = oContext.getProperty("quotename");
              return {
                key: name,
                text: name,
              };
            },
            pstatus: function (oContext) {
              var name = oContext.getProperty("pstatus");
              return {
                key: name,
                text: name,
              };
            },
            model: function (oContext) {
              var name = oContext.getProperty("model");
              return {
                key: name,
                text: name,
              };
            },
          };
        },

        //Search functionality for all columns for particular value
        onSearch: function (oEvent) {
          var oTableSearchState = [],
            sQuery = oEvent.getParameter("query");
          var contains = sap.ui.model.FilterOperator.Contains;
          var columns = ["JobNo", "quotename", "pstatus", "model"];
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
            .byId("tblProjectList")
            .getBinding("items")
            .filter(oTableSearchState, "Application");
        },

        onProjectSort: function (oEvent) {
          this._bDescendingSort = !this._bDescendingSort;
          var oView = this.getView(),
            oTable = oView.byId("tblProjectList"),
            oBinding = oTable.getBinding("items"),
            oSorter = new Sorter("id", this._bDescendingSort);
          oBinding.sort(oSorter);
        },

        // Function to reset all filters applied to table
        getAllProjects: async function () {
          this.groupReset = false;
          var oTable = this.byId("tblProjectList"),
            oBinding = oTable.getBinding("items"),
            aGroups = [];
          oBinding.sort(aGroups);
          this.groupReset = false;
        },

        //Activity grouping confirm dialog
        handleProjectGroupDialogConfirm: function (oEvent) {
          this.groupReset = false;
          var oTable = this.byId("tblProjectList"),
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
        resetProjectGroupDialog: function (oEvent) {
          this.groupReset = true;
        },

        //Function to load grouping fragement
        handleProjectGroupButtonPressed: function () {
          if (!this._oDialog1) {
            this._oDialog1 = sap.ui.xmlfragment(
              "sap.ui.elev8rerp.componentcontainer.fragmentview.Reports.ProjectListGroupDialog",
              this
            );
          }
          this._oDialog1.open();
        },

        getModelDefault: function () {
          return {};
        },

        handleRouteMatched: function (evt) {
          this.loadProjectlistData();
        },

        handleProjectDetails: function (sChannel, sEvent, oData) {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          this.bus = sap.ui.getCore().getEventBus();
          oRouter
            .getTargets()
            .display(oData.pagekey, { viewModel: oData.viewModel });
          oRouter.navTo(oData.pagekey, true);
        },

        onListItemPress: function (oEvent) {
          var viewModel = oEvent
            .getSource()
            .getBindingContext("projectListModel")
            .getObject();

          var model = { id: viewModel.id };
          this.bus = sap.ui.getCore().getEventBus();
          setTimeout(function () {
            this.bus = sap.ui.getCore().getEventBus();
            this.bus.publish("projectdetail", "handleProjectDetails", {
              pagekey: "projectdetail",
              viewModel: model,
            });
          }, 1000);

          this.bus.publish("projectdetail", "handleProjectDetails", {
            pagekey: "projectdetail",
            viewModel: model,
          });
        },

        /**
         * Function to navigate to specified route.
         * @param {*} sChannel
         * @param {*} sEvent
         * @param {*} oData
         */
        handleQutationList: function (sChannel, sEvent, oData) {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          this.bus = sap.ui.getCore().getEventBus();
          oRouter
            .getTargets()
            .display(oData.pagekey, { viewModel: oData.viewModel });
          oRouter.navTo(oData.pagekey, true);
        },

        onSort: function (oEvent) {
          this._bDescendingSort = !this._bDescendingSort;
          var oView = this.getView(),
            oTable = oView.byId("tblQuotationMaster"),
            oBinding = oTable.getBinding("items"),
            oSorter = new Sorter("leadname", this._bDescendingSort);
          oBinding.sort(oSorter);
        },

        loadProjectlistData: function () {
          var currentContext = this;
          let prjArr = [];
          Projectservice.getAllProjects(function (data) {
            if(data.length){
              for(let i = 0; i < data[0].length; i++){
                prjArr.push({
                  srno : data[0][i].srno,
                  JobNo : data[0][i].JobNo,
                  id:data[0][i].id,
                  quotename:data[0][i].quotename,
                  startdate:data[0][i].startdate,
                  enddate:data[0][i].enddate,
                  pstatus:data[0][i].pstatus,
                  completionper:data[0][i].completionper,
                  model : data[0][i].model,
                  totalstagecount : data[1][i].totalstagecount,
                  delayedstagecount : data[2][i].delayedstagecount,
                  delayedstagecountper : (data[1][i].totalstagecount > 0) ? ((data[2][i].delayedstagecount/data[1][i].totalstagecount) * 100) : null
                })
              }
            }

            console.log(prjArr);
            var oModel = currentContext.getView().getModel("projectListModel");
            oModel.setData(prjArr);
            oModel.refresh();
          });
        },

        onExit: function () {
          this.bus.unsubscribe(
            "quotationmaster",
            "setDetailPage",
            this.setDetailPage,
            this
          );
        },
      }
    );
  },
  true
);
