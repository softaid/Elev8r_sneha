sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/ProcessingReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/ui/model/Sorter',


], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, ProcessingReport, commonService, Sorter) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Processing.ProcessingProductionRegisterReport", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            this.setCurrentFinancialYear(this);
            this.getAllInputItems(this);
            this.getAllOutputitems();
            this.getProcessingRegisterReport();

            var model = new JSONModel();
            model.setData([]);
            this.getView().setModel(model, "reportModel");

            var emptyModel = this.getModelDefault();
            model.setData(emptyModel)
            var model = new JSONModel();
            model.setData({ modelData: [] });

            this.getView().setModel(model, "tblModel");
            this.getView().byId("txtdownload").setVisible(false);



            this.mGroupFunctions = {
                bomname: function (oContext) {
                    var name = oContext.getProperty("bomname");
                    return {
                        key: name,
                        text: name
                    };
                },
                pocode: function (oContext) {
                    var name = oContext.getProperty("pocode");
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
                outputitemname: function (oContext) {
                    var name = oContext.getProperty("outputitemname");
                    return {
                        key: name,
                        text: name
                    };
                },
                inputitemname: function (oContext) {
                    var name = oContext.getProperty("inputitemname");
                    return {
                        key: name,
                        text: name
                    };
                },
            }
        },

        getModelDefault: function () {
            return {
                branch_id: null,
                line_id: null
            }
        },

        resetModel: function () {
            let tbleModel = this.getView().getModel("tblModel");
            tbleModel.setData({ modelData: [] });

            let pModel = this.getView().getModel("reportModel");
            pModel.setData([]);

        },

        getProcessingRegisterReport: function () {
            debugger;
            if (this.validateForm()) {
		this.getAllInputItems(this);
                let currentContext = this;
                let fromdate = this.getView().byId("txtFromDate").getValue();
                let todate = this.getView().byId("txtToDate").getValue();
                fromdate = commonFunction.getDate(fromdate);
                todate = commonFunction.getDate(todate);
                let inputitemstring = this.getView().byId("inputitems").getSelectedKeys();
                let inputitembatchString = this.getView().byId("inputitembatches").getSelectedKeys();
                let outputitemString = this.getView().byId("outputitemid").getSelectedKeys();
                let inputItemStr = "";
                let inputBatchStr = "";
                let outputItemStr = "";

                for (let i = 0; i < inputitemstring.length; i++) {
                    if (i == 0)
                        inputItemStr = parseInt(inputitemstring[i]);
                    else
                        inputItemStr = inputItemStr + "," + parseInt(inputitemstring[i]);
                }

                for (let i = 0; i < inputitembatchString.length; i++) {
                    if (i == 0)
                        inputBatchStr = parseInt(inputitembatchString[i]);
                    else
                        inputBatchStr = inputBatchStr + "," + parseInt(inputitembatchString[i]);
                }

                for (let i = 0; i < outputitemString.length; i++) {
                    if (i == 0)
                        outputItemStr = parseInt(outputitemString[i]);
                    else
                        outputItemStr = outputItemStr + "," + parseInt(outputitemString[i]);
                }

                inputItemStr = inputItemStr != "" ? inputItemStr : null;
                inputBatchStr = inputBatchStr != "" ? inputBatchStr : null;
                outputItemStr = outputItemStr != "" ? outputItemStr : null;

                ProcessingReport.getProcessingRegisterReport({ fromdate: fromdate, todate: todate, inputitems: inputItemStr, inputitembatches: inputBatchStr, outputitems: outputItemStr }, function async(data) {
                    console.log("data", data);
                    let oTblModel = currentContext.getView().getModel("tblModel");
                    oTblModel.setData({ modelData: data[0] });

                })
            }
            this.getView().byId("txtdownload").setVisible(true);
        },

        handleGroupButtonPressed: function () {
            this.getViewSettingsDialog("sap.m.sample.TableViewSettingsDialog.GroupDialog")
                .then(function (oViewSettingsDialog) {
                    oViewSettingsDialog.open();
                });
        },


        handleGroupButtonPressed: function () {
            if (!this._oDialog1) {
                this._oDialog1 = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.Reports.GroupDialog", this);
            }
            this._oDialog1.open();
        },

        //Dialog for tax
        handleTaxValueHelp: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue();

            this.inputId = oEvent.getSource().getId();
            // create value help dialog
            // if (!this._valueHelpDialog) {
            this._valueHelpDialog = sap.ui.xmlfragment(
                "sap.ui.elev8rerp.componentcontainer.fragmentview.Common.TaxDialog",
                this
            );
            this.getView().addDependent(this._valueHelpDialog);
            // }
            this._valueHelpDialog.open(sInputValue);
        },


        handleGroupDialogConfirm: function (oEvent) {
            var oTable = this.byId("tblModel"),
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
                this.groupReset = false;
            }
        },

        resetGroupDialog: function (oEvent) {
            this.groupReset = true;
        },

        onSearch: function (oEvent) {
            var oTableSearchState = [],
            sQuery = oEvent.getParameter("query");
            var contains = sap.ui.model.FilterOperator.Contains;
            var columns = ['pocode', 'bomcode', 'bomname', 'stagename', 'outputitemname', 'inputitemname'];
            var filters = new sap.ui.model.Filter(columns.map(function (colName) {
                return new sap.ui.model.Filter(colName, contains, sQuery);
            }),
                false);

            if (sQuery && sQuery.length > 0) {
                oTableSearchState = [filters];
            }

            this.getView().byId("tblModel").getBinding("items").filter(oTableSearchState, "Application");
        },

        setCurrentFinancialYear: function () {
            let date = new Date();
            if ((date.getMonth() + 1) <= 3) {
                var firstDay = new Date(date.getFullYear() - 1, 3, 1);
                var lastDay = new Date(date.getFullYear(), 3, 0);
            } else {
                var firstDay = new Date(date.getFullYear(), 3, 1);
                var lastDay = new Date(date.getFullYear() + 1, 3, 0);
            }

            let firstDayDD = firstDay.getDate();
            let firstDayMM = firstDay.getMonth() + 1;
            let firstDayYYYY = firstDay.getFullYear();

            if (firstDayDD < 10) {
                firstDayDD = '0' + firstDayDD;
            }

            if (firstDayMM < 10) {
                firstDayMM = '0' + firstDayMM;
            }

            let lastDayDD = lastDay.getDate();
            let lastDayMM = lastDay.getMonth() + 1;
            let lastDayYYYY = lastDay.getFullYear();

            if (lastDayDD < 10) {
                lastDayDD = '0' + lastDayDD;
            }

            if (lastDayMM < 10) {
                lastDayMM = '0' + lastDayMM;
            }

            this.getView().byId("txtFromDate").setValue(firstDayYYYY + '-' + firstDayMM + '-' + firstDayDD);
            this.getView().byId("txtToDate").setValue(lastDayYYYY + '-' + lastDayMM + '-' + lastDayDD);
            this.getAllInputItems(this);

        },

        getAllInputItems: function (currentContext) {
            let fromdate = this.getView().byId("txtFromDate").getValue();
            let todate = this.getView().byId("txtToDate").getValue();
            ProcessingReport.getAllInputItems({ fromdate: fromdate, todate: todate }, function (data) {
                let oInputItemModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "inputitemid": "All", "inputitemname": "Select All" });
                    } else {
                        MessageBox.error("Inputitems are not availabel.")
                    }
                }

                oInputItemModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oInputItemModel, "InputItemModel");
            });
        },

        getAllOutputitems: function () {
            let currentContext = this;
            ProcessingReport.getAllOutputitems(function (data) {
                var oOutputItemModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "outputitemid": "All", "outputitemname": "Select All" });
                    } else {
                        MessageBox.error("Outputitem are not availabel.")
                    }
                }

                oOutputItemModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oOutputItemModel, "OutputItemModel");
            });
        },

        inputitemSelectionFinish: function (oEvt) {
            let currentContext = this;
            let selectedItems = oEvt.getParameter("selectedItems");
            let selectedKeys = [];
            for (let i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }

            var inputitem = [];
            for (let i = 0; i < selectedKeys.length; i++) {
                inputitem.push(selectedKeys[i].key);
            }

            this.inputitemname = [];
            for (let i = 0; i < selectedKeys.length; i++) {
                this.inputitemname.push(selectedKeys[i].text);
            }

            let inputitemids = inputitem.join();
            let fromdate = this.getView().byId("txtFromDate").getValue();
            let todate = this.getView().byId("txtToDate").getValue();

            ProcessingReport.getAllInputBatches({ fromdate: fromdate, todate: todate, inputitems: inputitemids }, function (data) {
                let oInputItemBatchesModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "inputitemid": "All", "inputitembatch": "Select All" });
                    } else {
                        MessageBox.error("Inputitems are not availabel.")
                    }
                }

                oInputItemBatchesModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oInputItemBatchesModel, "InputItemBatchesModel");
            });
            this.getView().byId("inputitems").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            })
        },

        inputitemBatchSelectionFinish: function (oEvt) {
            let selectedItems = oEvt.getParameter("selectedItems");
            let selectedKeys = [];
            for (let i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            this.inputitemBatchesname = [];
            for (let i = 0; i < selectedKeys.length; i++) {
                this.inputitemBatchesname.push(selectedKeys[i].text);
            }
            this.getView().byId("inputitembatches").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            })
        },

        outputitemSelectionFinish: function (oEvt) {
            let selectedItems = oEvt.getParameter("selectedItems");
            let selectedKeys = [];
            for (let i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            this.outputitemname = [];
            for (let i = 0; i < selectedKeys.length; i++) {
                this.outputitemname.push(selectedKeys[i].text);
            }
            this.getView().byId("outputitemid").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            })
        },

        inputItemSelectionChange: function (oEvent) {
            let changedItem = oEvent.getParameter("changedItem");
            let isSelected = oEvent.getParameter("selected");
            let state = "Selected";

            if (!isSelected) {
                state = "Deselected"
            }

            //Check if "Selected All is selected
            if (changedItem.mProperties.key == "All") {
                let oName, res;

                //If it is Selected
                if (state == "Selected") {

                    let oItems = oEvent.oSource.mAggregations.items;
                    for (let i = 0; i < oItems.length; i++) {
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


        // Report Validation

        validateForm: function () {
            let isValid = true;
            if (!commonFunction.isRequired(this, "txtFromDate", "Please Select Fromdate"))
                isValid = false;
            if (!commonFunction.isRequired(this, "txtToDate", "Please Select Todate"))
                isValid = false;
            return isValid;
        },

        // Change Done By Pooja For PDF Functionality
        onPdfExport: function () {
            var fullHtml = "";
            var headertable1 = "";
            headertable1 += "<!DOCTYPE html> <html> <head> <title>" + "Production Register Report" + "</title>" +
                "<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.22/pdfmake.min.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.62/vfs_fonts.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js'></script>" +
                "<style type='text/css'>" +
                "table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%; } td, th {border: 1px solid #000;text-align: left;padding: 5px; } th, td {width: 100px;overflow: hidden; } img { width: 180px; height: 120px; text-align: center; } </style> </head>";

            headertable1 += "<body id='tblCustomers' class='amin-logo'>";
            headertable1 += "</body>";
            headertable1 += "<script>";

            var fromdate = this.getView().byId("txtFromDate").getValue();
            var todate = this.getView().byId("txtToDate").getValue();
            let inputitemname = this.inputitemname;
            let inputitemBatchesname = this.inputitemBatchesname;
            let outputitemname = this.outputitemname;

            var companyname = this.companyname;
            var phone = (this.companycontact === null || this.companycontact == undefined) ? "-" : this.companycontact;
            var email = (this.companyemail === null || this.companyemail == undefined) ? "-" : this.companyemail;
            var address = (this.address === null || this.address == undefined) ? "-" : this.address;
            var pincode = (this.pincode === null || this.pincode == undefined) ? "-" : this.pincode;

            var tbleModel = this.getView().getModel("tblModel").oData.modelData;
            headertable1 += "html2canvas($('#tblCustomers')[0], {" +
                "onrendered: function (canvas) {" +
                "var data = canvas.toDataURL();" +
                "var width = canvas.width;" +
                "var height = canvas.height;" +
                "var docDefinition = {" +
                "pageMargins: [ 40, 60, 40, 60 ]," +
                "content: [";
            headertable1 += "{text: 'Company:-" + companyname + "', style: 'header'},";
            headertable1 += "{text: 'Email:-" + email + "', style: 'header'},";
            headertable1 += "{text: 'Phone:-" + phone + "', style: 'header'},";
            headertable1 += "{text: 'Address:-" + address + "', style: 'header'},";
            headertable1 += "{text: 'Production Register Report', style: 'title'},";
            headertable1 += "{columns: [{text:'From Date:-" + fromdate + "', style: 'subheader'},{text:'To Date:-" + todate + "', style: 'todatecss'}]},";
            headertable1 += "{columns: [{text:'Input Item:-" + inputitemname + "', style: 'subheader'},{text:'Input Item Batch:-" + inputitemBatchesname + "', style: 'todatecss'}]},";
            headertable1 += "{text: 'Output Item:-" + outputitemname + "', style: 'subheader'},";
            headertable1 += "{ style: 'tableExample',";
            headertable1 += " table: {";
            headertable1 += " body: [";
            headertable1 += "[ {text: 'Production Order No.', style: 'tableHeader'}, {text: 'Production Date', style: 'tableHeader'},{text: 'BOM NO.', style: 'tableHeader'},{text: 'BOM Name', style: 'tableHeader'}, {text: 'Stage', style: 'tableHeader'},{text: 'Output Item', style: 'tableHeader'},{text: 'Output Item Batch', style: 'tableHeader'},{text: 'Planned Weight', style: 'tableHeader'},{text: 'Production Weight ', style: 'tableHeader'},{text: 'Weight Deviation', style: 'tableHeader'},{text: 'Production %', style: 'tableHeader'},{text: 'Production Quantity', style: 'tableHeader'},{text: 'Planned Quantity', style: 'tableHeader'},{text: 'Production Cost', style: 'tableHeader'},{text: 'Input Item', style: 'tableHeader'},{text: 'Input Batch', style: 'tableHeader'},{text: 'Input Item Weight', style: 'tableHeader'},{text: 'Input Item Quantity', style: 'tableHeader'}],";

            for (var i = 0; i < tbleModel.length; i++) {
                if (tbleModel[i].pocode == null) {
                    tbleModel[i].pocode = "-";
                }
                if (tbleModel[i].podate == null) {
                    tbleModel[i].podate = "-";
                }
                if (tbleModel[i].bomcode == null) {
                    tbleModel[i].bomcode = "-";
                }
                if (tbleModel[i].bomname == null) {
                    tbleModel[i].bomname = "-";
                }
                if (tbleModel[i].stagename == null) {
                    tbleModel[i].stagename = "-";
                }
                if (tbleModel[i].outputitemname == null) {
                    tbleModel[i].outputitemname = "-";
                }
                if (tbleModel[i].outputitembatchid == null) {
                    tbleModel[i].outputitembatchid = "-";
                }
                if (tbleModel[i].planweight == null) {
                    tbleModel[i].planweight = "-";
                }
                if (tbleModel[i].productionweight == null) {
                    tbleModel[i].productionweight = "-";
                }
                
                if (tbleModel[i].daviation == null) {
                    tbleModel[i].daviation = "-";
                }
                if (tbleModel[i].productionper == null) {
                    tbleModel[i].productionper = "-";
                }
                if (tbleModel[i].productionqty == null) {
                    tbleModel[i].productionqty = "-";
                }
                if (tbleModel[i].planqty == null) {
                    tbleModel[i].planqty = "-";
                }
               
                if (tbleModel[i].productioncost == null) {
                    tbleModel[i].productioncost = "-";
                }
                if (tbleModel[i].inputitemname == null) {
                    tbleModel[i].inputitemname = "-";
                }
                if (tbleModel[i].inputitembatch == null) {
                    tbleModel[i].inputitembatch = "-";
                }

                if (tbleModel[i].inputitemweight == null) {
                    tbleModel[i].inputitemweight = "-";
                }
                if (tbleModel[i].inputitemqty == null) {
                    tbleModel[i].inputitemqty = "-";
                }

                headertable1 += "['" + tbleModel[i].pocode + "','" + tbleModel[i].podate + "','" + tbleModel[i].bomcode + "','" + tbleModel[i].bomname + "','" + tbleModel[i].stagename + "','" + tbleModel[i].outputitemname + "','" + tbleModel[i].outputitembatchid + "','" + tbleModel[i].planweight + "','" + tbleModel[i].productionweight + "','" + tbleModel[i]. daviation + "','" + tbleModel[i].productionper + "','" + tbleModel[i].productionqty + "','" + tbleModel[i].planqty + "','" + tbleModel[i].productioncost + "','" + tbleModel[i].inputitemname + "','" + tbleModel[i].inputitembatch + "','" + tbleModel[i].inputitemweight + "','" + tbleModel[i].inputitemqty + "'],"
            }
            headertable1 += "]";
            headertable1 += "}";
            headertable1 += "}";
            headertable1 += "]," +
                "footer: function (currentPage, pageCount) {" +
                "return {" +
                "style: 'Footer'," +
                "table: {" +
                "widths: ['*', 100]," +
                "body: [" +
                "[" +
                "{ text: 'Page ' + currentPage.toString() + ' of ' + pageCount, alignment: 'center', style: 'normalText' }" +
                "]," +
                "]" +
                "}," +
                "layout: 'noBorders'" +
                "};" +
                "}," +
                "styles: {" +
                "header: {" +
                "fontSize:10," +
                "bold: true," +
                "margin: [0, 0, 0, 8]" +
                "}," +
                "title: {" +
                "fontSize:12," +
                "bold: true," +
                "alignment: 'center'" +
                "}," +
                "Footer: {" +
                "fontSize: 7," +
                "margin: [5, 5, 5, 5]," +
                "}," +
                "subheader: {" +
                "fontSize:9," +
                "bold: true," +
                "margin: [0, 10, 0, 4]" +
                "}," +
                "todatecss: {" +
                "fontSize:9," +
                "bold: true," +
                "alignment:'right'" +
                "}," +
                "tableExample: {" +
                "margin: [0, 15, 0, 0]," +
                "fontSize: 8" +
                "}," +
                "tableHeader: {" +
                "bold: true," +
                "fontSize: 8," +
                "color: 'black'" +
                "}" +
                "}," +
                "defaultStyle: {" +
                "fontSize: 8" +
                "}" +
                "};" +
                "pdfMake.createPdf(docDefinition).download('Production_Register_report.pdf');" +
                "} });";
            headertable1 += "</script></html>";
            fullHtml += headertable1;
            var wind = window.open();
            wind.document.write(fullHtml);
            setTimeout(function () {
                wind.close();
            }, 3000);

        },


        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            let fromdate = this.getView().byId("txtFromDate").getValue();
            let todate = this.getView().byId("txtToDate").getValue();
            let inputitemname = this.inputitemname;
            let inputitemBatchesname = this.inputitemBatchesname;
            let outputitemname = this.outputitemname;
            let filename = fromdate + '_' + todate + '_' + inputitemname + '_' + inputitemBatchesname + '_' + outputitemname;



            //https://openui5.hana.ondemand.com/1.36.5/docs/guide/f1ee7a8b2102415bb0d34268046cd3ea.html
            //http://www.saplearners.com/download-data-in-excel-in-sapui5-application/

            let oExport = new Export({

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
                        name: "Production Order No.",
                        template: { content: "{pocode}" }
                    },
                    {
                        name: "Production Date",
                        template: { content: "{podate}" }
                    },
                    {
                        name: "BOM NO.",
                        template: { content: "{bomcode}" }
                    },
                    {
                        name: "BOM Name",
                        template: { content: "{bomname}" }
                    },
                    {
                        name: "Stage",
                        template: { content: "{stagename}" }
                    },
                    {
                        name: "Output Item",
                        template: { content: "{outputitemname}" }
                    },
                    {
                        name: "Output Item Batch",
                        template: { content: "{outputitembatchid}" }
                    },
                    {
                        name: "Planned Weight",
                        template: { content: "{planweight}" }
                    },
                    {
                        name: "Production Weight",
                        template: { content: "{productionweight}" }
                    },
                    {
                        name: "Weight Deviation",
                        template: { content: "{daviation}" }
                    },
                    {
                        name: "Production %",
                        template: { content: "{productionper}" }
                    },

                    {
                        name: "Production Quantity",
                        template: { content: "{productionqty}" }
                    },
                    {
                        name: "Planned Quantity",
                        template: { content: "{planqty}" }
                    },
                    {
                        name: "Production Cost",
                        template: { content: "{productioncost}" }
                    },
                    {
                        name: "Input Item",
                        template: { content: "{inputitemname}" }
                    },
                    {
                        name: "Input Batch",
                        template: { content: "{inputitembatch}" }
                    },
                    {
                        name: "Input Item Weight",
                        template: { content: "{inputitemweight}" }
                    },
                    {
                        name: "Input Item Quantity",
                        template: { content: "{inputitemqty}" }
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
