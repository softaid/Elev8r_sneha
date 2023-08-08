sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/CBFReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/FeedMillReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',

], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, cBFReportsService, feedMillReportsService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.FeedMill.QualitycheckReport", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;
            var currentContext = this;
            this.imagepath = null;
            // this.toDataURL('../images/logical.png', function (dataUrl) {
            //     currentContext.imagepath = dataUrl;
            // });
            
            var model = new JSONModel();
            model.setData([]);
            this.getView().setModel(model, "reportModel");
            this.getAllCommonBranch(this);

            var emptyModel = this.getModelDefault();
            model.setData(emptyModel)
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblModel");
            this.getView().byId("txtdownload").setVisible(false);
        },

        getModelDefault: function () {
            return {
                itemgroupid: null,
                itemid: null

            }
        },

        resetModel: function () {
            var tbleModel = this.getView().getModel("tblModel");
            tbleModel.setData({ modelData: [] });

            var pModel = this.getView().getModel("reportModel");
            pModel.setData([]);

        },

        // Function for pdf start

        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        replaceTemplateData: function (template) {
            // Item table Data --------------
            var tblModel = this.getView().getModel("tblModel").oData.modelData;

            var htmTable = "";
            for (var indx in tblModel) {
                var model = tblModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["purchaseorderno"] + "</td>"
                htmTable += "<td>" + model["partyname"] + "</td>"
                htmTable += "<td align='right'>" + model["ackno"] + "</td>"
                htmTable += "<td align='right'>" + model["refno"] + "</td>"
                htmTable += "<td>" + model["qualitycheckdate"] + "</td>"
                htmTable += "<td>" + model["labname"] + "</td>"
                htmTable += "<td>" + model["labtype"] + "</td>"
                htmTable += "<td>" + model["vehicleno"] + "</td>"

                htmTable += "<td align='right'>" + model["labintime"] + "</td>"
                htmTable += "<td align='right'>" + model["labouttime"] + "</td>"
                htmTable += "<td>" + model["itemname"] + "</td>"
                htmTable += "<td>" + model["nutrientname"] + "</td>"
                htmTable += "<td>" + model["fromrange"] + "</td>"
                htmTable += "<td>" + model["torange"] + "</td>"

                htmTable += "<td align='right'>" + model["testedvalue"] + "</td>"
                htmTable += "<td align='right'>" + model["labstatus"] + "</td>"
                htmTable += "<td>" + model["approval"] + "</td>"
                htmTable += "</tr>";
            }

            var line_id = tblModel.line_id;
            var todayDate = new Date();
            var curDate = commonFunction.getDateFromDB(todayDate);
            var curTime = todayDate.getHours() + ":" + todayDate.getMinutes() + ":" + todayDate.getSeconds();
            template = this.replaceStr(template, "##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportDate##", curDate);
            template = this.replaceStr(template, "##ReporTime##", curTime);
            template = this.replaceStr(template, "##CompanyName##", commonFunction.session("companyname"));
            template = this.replaceStr(template, "##lineid##", line_id);
            return template;
        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("CBF", "ChickPlacementReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Chick Placement Register report");
            });
        },

        // Function for pdf finish

        onSearchQualityCheckReport: function () {
            debugger;
            var currentContext = this;
            //if (this.validateForm()) {
               var fromdate= commonFunction.getDate(this.getView().byId("txtfromdate").getValue());
               var todate= commonFunction.getDate(this.getView().byId("txttodate").getValue());

                feedMillReportsService.getQualityCheckReport({fromdate: fromdate, todate: todate}, function async(data) {
                    console.log("data",data);
                    var oBatchModel = currentContext.getView().getModel("tblModel");
                    oBatchModel.setData({ modelData: data[0] });
                    console.log("tblModel",oBatchModel);



                })
                this.getView().byId("txtdownload").setVisible(true);
           // }
        },

        getAllCommonBranch: function (currentContext) {
            commonService.getAllCommonBranch(function (data) {
                var oBranchModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "branchname": "Select All" });
                    } else {
                        MessageBox.error("branch not availabel.")
                    }
                }
                oBranchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBranchModel, "branchModel");
            });
        },
        branchSelectionFinish: function (oEvt) {
            var currentContext = this;
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });

            }
            var branch = [];
            // var batchs = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                branch.push(selectedKeys[i].key);
            }

            this.branchname = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                this.branchname.push(selectedKeys[i].text);
            }

            feedMillReportsService.getWarehouseByBranchnameReport({ branchid: branch }, function (data) {

                var oBatchModel = new sap.ui.model.json.JSONModel();

                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "warehousename": "Select All" });
                    } else {
                        MessageBox.error("warehouse  not availabel.")
                    }
                }

                var batchesStr = "";
                for (var i = 0; i < branch.length; i++) {
                    if (i == 0)
                        batchesStr = parseInt(branch[i]);
                    else
                        batchesStr = batchesStr + "," + parseInt(branch[i]);
                }


                currentContext.getView().setModel(oBatchModel, "WarehouseModel");

                oBatchModel.setData({ modelData: data[0] });


            });

            // this.getLinewisebatches(batchesStr);
            this.getView().byId("branchList").setValueState(sap.ui.core.ValueState.None);

            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });

        },

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

        
        // Validation Fun

        validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "itemgroupList", "Branch is required is required"))
                isValid = false;

            //    if (!commonFunction.ismultiComRequired(this, "warehouseList", "warehouse is required is required"))
            //         isValid = false;


            return isValid;
        },

        // toDataURL: function (url, callback) {
        //     var xhr = new XMLHttpRequest();
        //     xhr.onload = function () {
        //         var reader = new FileReader();
        //         reader.onloadend = function () {
        //             callback(reader.result);
        //         }
        //         reader.readAsDataURL(xhr.response);
        //     };
        //     xhr.open('GET', url);
        //     xhr.responseType = 'blob';
        //     xhr.send();
        //     //}
        // },

       



        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var fromdate= commonFunction.getDate(this.getView().byId("txtfromdate").getValue());
            var todate= commonFunction.getDate(this.getView().byId("txttodate").getValue());
            
            var filename =fromdate+'_'+todate;

            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/

            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ","
                }),

                // Pass in the model created above
                models: this.currentContext.getView().getModel("tblModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content


                columns: [
                    {
                        name: "Purchase Order Number",
                        template: { content: "{purchaseorderno}" }
                    },
                    {
                        name: "Party Name",
                        template: { content: "{partyname}" }
                    },
                    {
                        name: "Acknowledgement No.",
                        template: { content: "{ackno}" }
                    },
                    {
                        name: "Reference No.",
                        template: { content: "{refno}" }
                    },
                    {
                        name: "Quality Test Date",
                        template: { content: "{qualitycheckdate}" }
                    },
                    {
                        name: "Lab Name",
                        template: { content: "{labname}" }
                    },
                    {
                        name: "Lab Type",
                        template: { content: "{labtype}" }
                    },
                    {
                        name: "Vehicle No.",
                        template: { content: "{vehicleno}" }
                    },

                    {
                        name: "Lab In Time",
                        template: { content: "{labintime}" }
                    },
                    {
                        name: "Lab Out Time",
                        template: { content: "{labouttime}" }
                    },
                    {
                        name: "Item Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Nutrient Name",
                        template: { content: "{nutrientname}" }
                    },

                    {
                        name: "From Range",
                        template: { content: "{fromrange}" }
                    },
                    {
                        name: "To Range",
                        template: { content: "{torange}" }
                    },
                    {
                        name: "Tested Value",
                        template: { content: "{testedvalue}" }
                    },
		     {
                        name:   "Result",
                        template: { content: "{refname}" }
                    },

                    {
                        name: "Lab Status",
                        template: { content: "{labstatus}" }
                    },
                    {
                        name: "Special Approval",
                        template: { content: "{approval}" }
                    }
                ]
            });

            // download exported file
            oExport.saveFile(filename)
                .catch(function (oError) {
                    MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
                })
                .then(function () {

                    oExport.destroy();
                });
        }




    });
}, true);
