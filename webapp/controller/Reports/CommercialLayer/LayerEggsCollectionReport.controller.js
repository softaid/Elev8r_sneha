sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/CommercialLayerReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service'

], function (JSONModel, BaseController, MessageToast, MessageBox, Export, ExportTypeCSV, commonFunction, commercialLayerReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CommercialLayer.LayerEggsCollectionReport", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;
            // set location model
            var moduleids = 725;
			this.getLocations(this,moduleids);
            // set empty model to view 
            var emptyModel = this.getModelDefault();
            var model = new JSONModel();
            model.setData(emptyModel);
            this.getView().setModel(model, "layereggsCollRepModel");

            var cmblocation = this.getView().byId("locationtbl");
            cmblocation.onAfterRenderingPicker = function () {
                if (sap.m.MultiComboBox.prototype.onAfterRenderingPicker) {
                    sap.m.MultiComboBox.prototype.onAfterRenderingPicker.apply(this);
                }
            }
            var frequencymodel = [{ key: "day", value: "Daily" },
            { key: "week", value: "Weekly" },
            { key: "month", value: "Monthly" }]
        
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({ modelData: frequencymodel });
            this.getView().setModel(oModel, "frequemodel");

        },

        getLocations: function (currentContext, moduleids) {
            commonService.getLocations({ moduleids: moduleids }, function (data) {
             
                var oLocationModel = new sap.ui.model.json.JSONModel();
                if(data.length>0){
                if (data[0].length > 0) {
                    data[0].unshift({ "id": "All", "locationname": "Select All" });
                }else{
                 MessageBox.error("location not availabel.")
                }
            }
            
                oLocationModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oLocationModel, "locationList");
            });
        },


        getModelDefault: function () {
            return {
                layerbatchid: null,
                shedid: null,
                collectiondate: commonFunction.getDateFromDB(new Date()),
                showdate: true,
                showweek: false,
                showmonth: false,
            }
        },

        handleSelectionFinish: function (oEvt) {

            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });

            }
           
            if (selectedKeys[0].key == "ALL") {

                selectedKeys = selectedKeys.slice(0, -1);
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
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function() {
                if(jQuery(this).find('.sapMTokenText').html() == "Select All"){
                    jQuery(this).remove();
                }
              });
        },

        getLayerBatches: function (location) {
            var currentContext = this;
            commercialLayerReportsService.gatAllLayerBatch({ locationid: location }, function (data) {
            
                var oBatchModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                    data[0].unshift({ "layerbatchid": "All", "batchname": "Select All" });

                    oBatchModel.setData({ modelData: data[0] });
                    
                    currentContext.getView().setModel(oBatchModel, "batchModel");
                } else {
                    MessageBox.error("Layer batch not available !");
                }
            }

            });
            // }
        },
        batchSelectionFinish: function (oEvt) {

            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedbatches = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedbatches.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }

            if (selectedbatches[0].key == "ALL") {

                selectedbatches = selectedbatches.slice(0, -1);
            }
            var batchs = [];
            for (var i = 0; i < selectedbatches.length; i++) {
                batchs.push(selectedbatches[i].key);
            }

            var batchesStr = "";

            for (var i = 0; i < batchs.length; i++) {
                if (i == 0)
                    batchesStr = parseInt(batchs[i]);
                else
                    batchesStr = batchesStr + "," + parseInt(batchs[i]);
            }
            this.getLayerShedByBatchid(batchesStr);
            this.getView().byId("batchtb1").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function() {
                if(jQuery(this).find('.sapMTokenText').html() == "Select All"){
                    jQuery(this).remove();
                }
              });
        },

        getLayerShedByBatchid: function (layerbatchid) {
            var currentContext = this;
            commercialLayerReportsService.getLayerShedByBatchid({ layerbatchid: layerbatchid }, function (data) {
                if (data.length > 0) {
                    data[0].unshift({ "Shedid": "All", "shedname": "Select All" });
                    var oBatchModel = new sap.ui.model.json.JSONModel();
                    oBatchModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oBatchModel, "shedModel");
                } else {
                    MessageBox.error("Shed not available !");
                }
            });
            // }
        },
        shedSelectionFinish: function (oEvt) {

            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedsheds = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedsheds.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            this.getView().byId("shedtb1").setValueState(sap.ui.core.ValueState.None);
            
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function() {
                if(jQuery(this).find('.sapMTokenText').html() == "Select All"){
                    jQuery(this).remove();
                }
              });

        },
        frequChange: function () {
            var oModel = this.getView().getModel("layereggsCollRepModel").oData
 
            if (oModel.frequency == "day") {
                oModel.showweek = false;
                oModel.showdate = true;
                oModel.showmonth = false;
            }
            else if (oModel.frequency == "week") {
                oModel.showweek = true;
                oModel.showdate = false;
                oModel.showmonth = false;

            } else if (oModel.frequency == "month") {
                oModel.showweek = false;
                oModel.showdate = false;
                oModel.showmonth = true;
            }
        },

        onSearchData: function () {
            if (this.validateForm()) {
                var pnlEggColtable = this.getView().byId("pnlEggColtable");
                pnlEggColtable.destroyContent();
                var currentContext = this;
                var oModel = this.getView().getModel("layereggsCollRepModel").oData


                var batchids = this.getView().byId("batchtb1").getSelectedKeys();
                var shedids = this.getView().byId("shedtb1").getSelectedKeys();
                var batchesStr = "";

                for (var i = 0; i < batchids.length; i++) {
                    if (i == 0)
                        batchesStr = parseInt(batchids[i]);
                    else
                        batchesStr = batchesStr + "," + parseInt(batchids[i]);
                }

                var i = batchesStr.length - 1;
                if (batchesStr == "All") {
                    batchesStr = batchesStr.slice(0, -1);
                }

                var i = shedids.length - 1;
            
                if (shedids == "All") {
                    shedids = shedids.slice(0, -1);
                }

                var shedString = "";

                for (var i = 0; i < shedids.length; i++) {
                    if (i == 0)
                        shedString = (shedids[i]);
                    else
                        shedString = shedString + "," + (shedids[i]);
                }


                var oModel = {
                    layerbatchid: batchesStr,
                    shedid: shedString,
                    frequency: oModel.frequency,

                    fromdate: commonFunction.getDate(this.getView().byId("txtFromdate").getValue()),
                    todate: commonFunction.getDate(this.getView().byId("txtTodate").getValue()),
                    companyid: commonFunction.session("companyId")
                }

                commercialLayerReportsService.getLayerEggscollectionReport(oModel, function (data) {
                        console.log("eggs",data);
                    if (data.length > 0) {
                        if (data[0].length > 0) {
                            for (var i = 0; i < data[0].length; i++) {
                                for (var j = 0; j < data[2].length; j++) {
                                    if (data[0][i].collectiondate != undefined) {
                                        if (data[1][j].Collectiondate == data[0][i].collectiondate) {
                                            data[1][j]["Collection-Quantity"] = data[0][i].collectionqty;
                                            break;
                                        }

                                    } else if (data[0][i].week_start != undefined) {
                                        if (data[1][j].week_start == data[0][i].week_start) {
                                            data[1][j]["Collection-Quantity"] = data[0][i].collectionqty;
                                            break;
                                        }
                                    }
                                    else if (data[0][i].month != undefined) {
                                        if (data[1][j].Month == data[0][i].month) {
                                            data[1][j]["Collection-Quantity"] = data[0][i].collectionqty;
                                            break;
                                        }
                                    }

                                }
                            }

                              

                            var keys = [];

                            Object.keys(data[1][0]).forEach(function (key) {
                                keys.push(key);
                            });


                            var arr = [];
                            for (var i = 0; i < keys.length; i++) {
                                arr.push({ columnId: keys[i] })
                            }

                            var oModel = new sap.ui.model.json.JSONModel();

                            oModel.setData({
                                columns: arr,
                                rows: data[1]
                            });

                            var oTable = new sap.ui.table.Table({
                                showNoData: true,
                                columnHeaderHeight: 10,
                                visibleRowCount: 5,
                                selectionMode: sap.ui.table.SelectionMode.None

                            });
                            oTable.setModel(oModel);
                            oTable.bindColumns("/columns", function (index, context) {
                                var sColumnId = context.getObject().columnId;

                                return new sap.ui.table.Column({
                                    id: sColumnId,
                                    label: sColumnId,
                                    template: sColumnId,
                                });
                            });
                            oTable.bindRows("/rows");

                            var pnlEggColtable = currentContext.getView().byId("pnlEggColtable");
                            pnlEggColtable.addContent(oTable);

                             // set empty model to view		
                             var tblModel = new JSONModel();
                             tblModel.setData({ modelData:data[1] });
                             currentContext.getView().setModel(tblModel, "tblModel");
                        }
                    }
                });
            }  
            
        },
        onDateChange: function () {
            var isValid = true
            var tDate = this.getView().byId("txtTodate").getValue();
            if(tDate){
                this.getView().byId("txtTodate").setValueState(sap.ui.core.ValueState.None);
            }
            var fDate = this.getView().byId("txtFromdate").getValue();
            if(fDate){
                this.getView().byId("txtFromdate").setValueState(sap.ui.core.ValueState.None);
            }
            var pModel = this.getView().getModel("eggsCollRepModel");
            if (fDate > tDate) {
                isValid = false
                MessageBox.error("To date should be greater than from date.");
              
            }
            return isValid
        },


       
        validateForm: function () {
            var isValid = true;

            if (!commonFunction.isSelectRequired(this, "statustype", "Frequesncy is required"))
            isValid = false;

        if (!commonFunction.ismultiComRequired(this, "locationtbl", "Location is required"))
            isValid = false;

        if (!commonFunction.ismultiComRequired(this, "batchtb1", "Batch is required"))
            isValid = false;

        if (!commonFunction.ismultiComRequired(this, "shedtb1", "Shed is required"))
            isValid = false;
        if (!commonFunction.isRequired(this, "txtFromdate", "From Date is required"))
            isValid = false;
        if (!commonFunction.isRequired(this, "txtTodate", "To Date is required"))
            isValid = false;

            
        if (!this.onDateChange())
            isValid = false;

            return isValid;
        },

        //           //Trigger on Selecting each record
        batchSelectionChange: function (oEvent) {
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

        shedSelectionChange: function (oEvent) {
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

        handleSelectionChange : function (oEvent) {
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


        onDataExport: function(){
            var JSONData = this.getView().getModel("tblModel").oData.modelData;
            var CSV = ''; 
            var ReportTitle ="eggscollection" ;
            var ShowLabel = true;
    
            //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
            var CSV = '';    
            //This condition will generate the Label/Header
            if (ShowLabel) {
                var row = "";
    
                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {
                    //Now convert each value to string and comma-seprated
                    row += index + ',';
                }
                row = row.slice(0, -1);
                //append Label row with line break
                CSV += row + '\r\n';
            }
    
            //1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                var row = "";
                //2nd loop will extract each column and convert it in string comma-seprated
                for (var index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }
                row.slice(0, row.length - 1);
                //add a line break after each row
                CSV += row + '\r\n';
            }
    
            if (CSV == '') {        
                alert("Invalid data");
                return;
            }   
    
            //this trick will generate a temp "a" tag
            var link = document.createElement("a");    
            link.id="lnkDwnldLnk";
    
            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
    
            var csv = CSV;  
           var blob = new Blob([csv], { type: 'text/csv' }); 
            var csvUrl = window.webkitURL.createObjectURL(blob);

            
            var filename = 'EggscollectionReport.csv';
            $("#lnkDwnldLnk")
            .attr({
                'download': filename,
                'href': csvUrl
            }); 
    
            $('#lnkDwnldLnk')[0].click();    
            document.body.removeChild(link);
    
        }
    });
}, true);
