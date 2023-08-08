sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/ui/model/Sorter',
	'sap/ui/elev8rerp/componentcontainer/services/LeadManagement/Lead.service'
], function (JSONModel, BaseController, Sorter, leadService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.LeadManagement.Details", {
        onInit: function () {

			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("leaddetail", "handleLeadDetails", this.handleLeadDetails, this);
            this.bus.subscribe("loaddata", "loadData", this.loadData, this);

			var model = new JSONModel();
			model.setData([]);
			this.getView().setModel(model, "leadModel");

            let stageModel = new JSONModel();
            stageModel.setData({modelData : []});
            this.getView().setModel(stageModel, "stageModel");

            let activityModel = new JSONModel();
            activityModel.setData({modelData : []});
            this.getView().setModel(activityModel, "activityModel");

            let liftModel = new JSONModel();
            liftModel.setData({modelData : []});
            this.getView().setModel(liftModel, "liftModel");

            let quotationModel = new JSONModel();
            quotationModel.setData({modelData : []});
            this.getView().setModel(quotationModel, "quotationModel");

            let attachmentModel = new JSONModel();
            attachmentModel.setData({modelData : []});
            this.getView().setModel(attachmentModel, "attachmentModel");
		},

        handleLeadDetails : function(sChannel, sEvent, oData) {

			let selRow = oData.viewModel;
			let oThis = this;
            console.log(selRow);
			if(selRow != null)  {

			}

		},

        loadData : function(){
            let oThis = this;

            leadService.getLeadwiseDetails(function(data){
                if(data.length){
                    if(data[0].length){
                        let leadModel = oThis.getView().getModel("leadModel");
                        leadModel.setData(data[0][0]);
                        oThis.getView.setModel(leadModel,"leadModel");
                    }

                    if(data[1].length){
                        let stageModel = oThis.getView().getModel("stageModel");
                        stageModel.setData({modelData : data[1]});
                        oThis.getView.setModel(stageModel,"stageModel");
                    }

                    if(data[2].length){
                        let activityModel = oThis.getView().getModel("activityModel");
                        activityModel.setData({modelData : data[2]});
                        oThis.getVi().setModel(activityModel, "activityModel")
                    }

                    if(data[3].length){
                        let liftModel = oThis.getView().getModel("liftModel");
                        liftModel.setData(data[3]);
                        oThis.getView.setModel(liftModel, "liftModel")
                    }
                }
            })
        },
	});

}, true);
