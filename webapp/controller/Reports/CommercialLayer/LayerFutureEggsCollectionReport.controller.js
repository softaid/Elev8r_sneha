sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/CommercialLayerReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/ui/elev8rerp/componentcontainer/services/CommercialLayer/LayerBatchOpeningBalance.service'


], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, layerReportsService, commonService,layerBatchOpeningBalanceService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CommercialLayer.LayerFutureEggsCollectionReport", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;
            // set location model
            var moduleids = 725;
            this.getLocations(this, moduleids);

            // set empty model to view 
            var emptyModel = this.getModelDefault();
            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "layerleggsCollRepModel");
        },


        getModelDefault: function () {
            return {
                layerbatchid: null,
                shedid: null,
                collectiondate: commonFunction.getDateFromDB(new Date()),

            }
        },
        resourceBundle: function () {
			var currentContext = this;
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},

        getLocations: function (currentContext, moduleids) {
            commonService.getLocations({ moduleids: moduleids }, function (data) {
                var oLocationModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "locationname": "Select All" });
                    } else {
                        var locMsg = currentContext.resourceBundle().getText("lyerFeedDeviationtErrorMsgLocation");
                        MessageBox.error(locMsg)
                    }
                }

                oLocationModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oLocationModel, "locationList");
            });
        },


        handleSelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });

            }
            var location = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                location.push(selectedKeys[i].key);
            }

            var locationStr = "";

            for (var i = 0; i < location.length; i++) {
                if (i == 0)
                    locationStr = parseInt(location[i]);
                else
                    locationStr = locationStr + "," + parseInt(location[i]);
            }
            this.getLayerBatches(locationStr);
            this.getView().byId("locationtbl").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },

       getLayerBatches: function (location) {
            var currentContext = this;
            layerReportsService.gatAllLayerBatch({ locationid: location }, function (data) {
            
                var oBatchModel = new sap.ui.model.json.JSONModel();
                if (data[0].length > 0) {
                    oBatchModel.setData({ modelData: data[0] });
                    
                    currentContext.getView().setModel(oBatchModel, "batchModel");
                } else {
                    MessageBox.error("Layer batch not available !");
                }

            });
            // }
        },
        batchChange: function () {
            var layerbatchid = this.getView().byId("batchtb1").getSelectedKey();
            this.getLayerShedByBatchid(layerbatchid)
        },


        getLayerShedByBatchid: function (layerbatchid) {
            var currentContext = this;
            layerReportsService.getLayerShedByBatchid({ layerbatchid: layerbatchid }, function (data) {

                if (data[0].length > 0) {
                    var oBatchModel = new sap.ui.model.json.JSONModel();
                    oBatchModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oBatchModel, "shedModel");
                } else {
                    var ShedMsg = currentContext.resourceBundle().getText("lyerFeedDeviationtErrorMsgShed");
                    MessageBox.error(ShedMsg)
                }
            });

        },
       

        onSearchData: function () {

            if (this.validateForm()) {
                var currentContext = this;
                var batchid = this.getView().byId("batchtb1").getSelectedKey();
                var shedid = this.getView().byId("shedtb1").getSelectedKey();
                var fromdate =  this.getView().byId("txtFromdate").getValue();
                var todate =  this.getView().byId("txtTodate").getValue()

                var FModel = {
                    layerbatchid: batchid,
                    shedid: shedid,
                    fromdate:commonFunction.getDate(fromdate),
                    todate: commonFunction.getDate(todate),
                    companyid: commonFunction.session("companyId")
                }
                layerReportsService.getLayerFutureEggsCollection(FModel, function (data) {
                    
                    var FModel = new sap.ui.model.json.JSONModel();
                    FModel.setData({ modelData: data[0]});
                    currentContext.getView().setModel(FModel, "lyrFutureEggsCollectionReport");


                });

            }

        },

        ageInWeek: function (placementdate,batchplacementdate) {
            if (batchplacementdate != null) {
                var batchplacementdate = commonFunction.getDateFromDB(new Date(batchplacementdate))
                var parts = batchplacementdate.split('/');
                var batchplacementdate = Date.parse(new Date(parts[2], parts[1], parts[0]));

                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

                //today date calculation 

                // var date = commonFunction.getDateFromDB(new Date());
                var date = placementdate

                var parts = date.split('/');

                var todayDate = Date.parse(new Date(parts[2], parts[1], parts[0]));
                var timeDiff = batchplacementdate - todayDate;
                var diffDays = Math.floor(timeDiff / oneDay);


                var ageinweek = parseInt(((diffDays / 7))+1);
                return ageinweek
            }

        },

        calculateWeekAndDays: function (PlacementDate) {
            var currentContext = this;
            var toDate = this.getView().byId("txtTodate").getValue();
            var oModel = this.getView().getModel("currentEggscollectionModel").oData;
            var fromweek = null;
            var toweek = null;

			var oModel = this.getView().getModel("LayerDailyTransactionModel");

			var batchplacementdate = PlacementDate;
			var livebatchdate = oModel.oData.transactiondate;

			if (batchplacementdate != null) {
				var currentContext = this;
				layerBatchOpeningBalanceService.getAgeInDays({ batchplacementdate: commonFunction.getDate(batchplacementdate), livebatchdate: commonFunction.getDate(livebatchdate) }, function (data) {

					var oModel = currentContext.getView().getModel("LayerDailyTransactionModel");
					var daysDiff = data[0][0].ageindays + 1;
					var days = (daysDiff) % 7
					var week = (daysDiff) / 7;
					week = week >= 1 ? week : 0;
					oModel.oData.ageindays = days + " day(s)";
					oModel.oData.ageinweeks = parseInt(week) + " week(s)";
					oModel.oData.agerinDaysforfeed = days;
					oModel.oData.agerinWeekforfeed = week.toFixed(0);

					oModel.refresh();

					currentContext.getLayerPhase(parseInt(week));
				})
			}

		},
            

        onDateChange: function () {
            var isValid = true;
            var fDate = this.getView().byId("txtFromdate").getValue();
            var currentContext = this;
            var batchid = this.getView().byId("batchtb1").getSelectedKey();
            var shedid = this.getView().byId("shedtb1").getSelectedKey();
            
            var oModel = {
                layerbatchid: batchid,
                shedid: shedid,
                collectiondate: commonFunction.getDate(fDate),
                companyid: commonFunction.session("companyId")
            }
            layerReportsService.getLayerEggscollectiontilldate(oModel, function (data) {
                var oModel = new sap.ui.model.json.JSONModel();
                var placementdate = data[0][0].placementdate;
                var currentweek = data[0][0].weekno;
                oModel.setData(data[0][0]);
                currentContext.getView().setModel(oModel, "currentEggscollectionModel");
                currentContext.getView().byId("txtFromweek").setValue(data[0][0].weeknowithdays);

          });
        },

        onFromDateChange: function(){
            var currentContext = this;
            var toDate = this.getView().byId("txtTodate").getValue();
            var oModel = this.getView().getModel("currentEggscollectionModel").oData;
            var fromweek = null;
            var toweek = null;
            var toageinweek = null;
            var toageindays = null;
            if (oModel.days > 0) {
                fromweek = parseInt(oModel.weekno) + 1;
            }else{
                fromweek = parseInt(oModel.weekno);
            }
            
            layerBatchOpeningBalanceService.getAgeInDays({ batchplacementdate: commonFunction.getDate(oModel.placementdate), livebatchdate: commonFunction.getDate(toDate) }, function (data) {

                var daydiff = data[0][0].ageindays + 1;
                toageinweek = parseInt(daydiff / 7);
                toageindays = parseInt(daydiff % 7);
                if (toageindays > 0) {
                    toweek = toageinweek + 1;
                }else{
                    toweek = toageinweek;
                }
                var toweeknowithdays = toageinweek + "-Week" + toageindays + '-days';
                    if (toweek >= fromweek) {
                    currentContext.getView().byId("txtToWeek").setValue(toweeknowithdays);
                    currentContext.getView().byId("txtTodate").setValueState(sap.ui.core.ValueState.None);
                } else {
                    MessageBox.error("To week is always grater than from week.")
                }
            });
         
        },

        validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "locationtbl", "Location is required."))
                isValid = false;

            if (!commonFunction.isSelectRequired(this, "batchtb1", "Batch is required."))
                isValid = false;

            if (!commonFunction.isSelectRequired(this, "shedtb1", "Shed is required."))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtFromdate", "From date is required."))
                isValid = false;
            if (!commonFunction.isRequired(this, "txtTodate", "To date is required."))
                isValid = false;

            // if (!this.onFromDateChange())
            //     isValid = false;

            return isValid;
        },

        handleSelectionChange: function (oEvent) {
            var changedItem = oEvent.getParameter("changedItem");
            var isSelected = oEvent.getParameter("selected");
            var state = "Selected";

            if (!isSelected) {
                state = "Deselected"
            }

            //Check if "Selected All is selected
            if (changedItem.mProperties.key == "All") {
                var oName, res;

                //If it is Selected
                if (state == "Selected") {

                    var oItems = oEvent.oSource.mAggregations.items;
                    for (var i = 0; i < oItems.length; i++) {
                        if (i == 0) {
                            oName = oItems[i].mProperties.key;
                        } else {
                            oName = oName + ',' + oItems[i].mProperties.key;
                        } //If i == 0									
                    } //End of For Loop

                    res = oName.split(",");
                    oEvent.oSource.setSelectedKeys(res);

                } else {
                    res = null;
                    oEvent.oSource.setSelectedKeys(res);
                }
            }
        },

        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/


            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.currentContext.getView().getModel("lyrFutureEggsCollectionReport"),


                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content

                columns: [

                    {
                        name: "Week No",
                        template: { content: "{ageinweek}" }
                    },
                    {
                        name: "Expected Eggs Collection",
                        template: { content: "{expeggscollection}" }
                    }
                   
                ]
            });


            // download exported file
            oExport.saveFile()
                .catch(function (oError) {
                    MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
                })
                .then(function () {
                    oExport.destroy();
                });
        }


    });
}, true);
