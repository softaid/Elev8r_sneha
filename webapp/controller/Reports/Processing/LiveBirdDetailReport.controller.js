sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/ProcessingReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Processing/ProcessingSettings.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/ui/model/Sorter',


], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, ProcessingReport,processingSettingService, commonService, Sorter) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Processing.LiveBirdDetailReport", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");

            // get module list
			commonFunction.getReferenceFilter("ModName", ['721', '723', '725', '727'], "moduleList", this);

            var model = new JSONModel();
            model.setData([]);
            this.getView().setModel(model, "reportModel");

            var emptyModel = this.getModelDefault();
            model.setData(emptyModel)
            var model = new JSONModel();
            model.setData({ modelData: [] });

            this.getView().setModel(model, "tblModel");
            this.getView().byId("txtdownload").setVisible(false);

            //get itemgroup from settings
			this.getProcessingSettings();



            
        },

        getModelDefault: function () {
            return {
                branch_id: null,
                line_id: null
            }
        },

        getProcessingSettings : function(){
			var currentContext = this;
			processingSettingService.getProcessingSettings(function (data) {

                if (data[0] != undefined && data[0].length > 0) {
					currentContext.livebirdwarehouseids = data[0][0].livebirdwarehouseids;
					currentContext.inputtypeitemgroupids = data[0][0].inputtypeitemgroupids;

					//get items by item group
			        commonFunction.getItemsByItemGroups(currentContext.inputtypeitemgroupids , currentContext, "ItemList");
                }
                else {
                    MessageBox.error("Please fill processing settings.")
                }

            });

            
		},


        resetModel: function () {
            let tbleModel = this.getView().getModel("tblModel");
            tbleModel.setData({ modelData: [] });

            let pModel = this.getView().getModel("reportModel");
            pModel.setData([]);

        },

        getProcessingLiveBirdDetailReport: function () {
            debugger;
            if (this.validateForm()) {
                let currentContext = this;
                let moduleidtring = this.getView().byId("moduleid").getSelectedKeys();
                let inputitemString = this.getView().byId("inputitem").getSelectedKeys();
                let moduleidStr = "";
                let inputItemStr = "";

                for (let i = 0; i < moduleidtring.length; i++) {
                    if (i == 0)
                    moduleidStr = parseInt(moduleidtring[i]);
                    else
                    moduleidStr = moduleidStr + "," + parseInt(moduleidtring[i]);
                }

                for (let i = 0; i < inputitemString.length; i++) {
                    if (i == 0)
                    inputItemStr = parseInt(inputitemString[i]);
                    else
                    inputItemStr = inputItemStr + "," + parseInt(inputitemString[i]);
                }

               

                moduleidStr = moduleidStr != "" ? moduleidStr : null;
                inputItemStr = inputItemStr != "" ? inputItemStr : null;

                ProcessingReport.getProcessingLiveBirdDetailReport({ moduleid: moduleidStr, itemid: inputItemStr}, function async(data) {
                    console.log("data", data);
                    let oTblModel = currentContext.getView().getModel("tblModel");
                    oTblModel.setData({ modelData: data[0] });

                })
            }
            this.getView().byId("txtdownload").setVisible(true);
        },

        moduleSelectionFinish: function (oEvt) {
            let selectedItems = oEvt.getParameter("selectedItems");
            let selectedKeys = [];
            for (let i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            this.inputitemBatchesname = [];
            for (let i = 0; i < selectedKeys.length; i++) {
                this.inputitemBatchesname.push(selectedKeys[i].text);
            }
            //this.getView().byId("inputitembatches").setValueState(sap.ui.core.ValueState.None);
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
            this.outputitemname = [];
            for (let i = 0; i < selectedKeys.length; i++) {
                this.outputitemname.push(selectedKeys[i].text);
            }
            //this.getView().byId("outputitemid").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            })
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
            // if (!commonFunction.isRequired(this, "txtFromDate", "Please Select Fromdate"))
            //     isValid = false;
            // if (!commonFunction.isRequired(this, "txtToDate", "Please Select Todate"))
            //     isValid = false;
            return isValid;
        },

        // Change Done By Pooja For PDF Functionality
        onPdfExport: function () {
            var fullHtml = "";
            var headertable1 = "";
            headertable1 += "<!DOCTYPE html> <html> <head> <title>" + "Processing Live Bird Detail Report" + "</title>" +
                "<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.22/pdfmake.min.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.62/vfs_fonts.js'></script>" +
                "<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js'></script>" +
                "<style type='text/css'>" +
                "table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%; } td, th {border: 1px solid #000;text-align: left;padding: 5px; } th, td {width: 100px;overflow: hidden; } img { width: 180px; height: 120px; text-align: center; } </style> </head>";

            headertable1 += "<body id='tblCustomers' class='amin-logo'>";
            headertable1 += "</body>";
            headertable1 += "<script>";

            
           
            let modukname = this.inputitemBatchesname;
            let item = this.outputitemname;

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
                "pageMargins: [ 20, 60, 20, 60 ]," +
                "pageOrientation: 'landscape'," +
                "pageSize: 'A4'," +
                "content: [";
            headertable1 += "{text: 'Company:-" + companyname + "', style: 'header'},";
            headertable1 += "{text: 'Email:-" + email + "', style: 'header'},";
            headertable1 += "{text: 'Phone:-" + phone + "', style: 'header'},";
            headertable1 += "{text: 'Address:-" + address + "', style: 'header'},";
            headertable1 += "{text: 'Processing Live Bird Detail Report', style: 'title'},";
            headertable1 += "{columns: [{text:'Module:-" + modukname + "', style: 'subheader'},{text:'Item:-" + item + "', style: 'todatecss'}]},";
            headertable1 += "{ style: 'tableExample',";
            headertable1 += " table: {";
           // headertable1 += "widths: ['*','*','*','*','*'],";
            headertable1 += " body: [";
            headertable1 += "[ {text: 'Invoice Date', style: 'tableHeader'}, {text: 'Invoice No.', style: 'tableHeader'},{text: 'Reference No.', style: 'tableHeader'},{text: 'DC Date', style: 'tableHeader'},{text: 'Party Name', style: 'tableHeader'},{text: 'From Module', style: 'tableHeader'},{text: 'From Batch', style: 'tableHeader'},{text: 'Bird Name', style: 'tableHeader'},{text: 'Unit', style: 'tableHeader'},{text: 'Location', style: 'tableHeader'},{text: 'Received Quantity', style: 'tableHeader'},{text: 'Received  Weight', style: 'tableHeader'},{text: 'Actual Quantity', style: 'tableHeader'},{text: 'Actual  Weight', style: 'tableHeader'},{text: 'Shrinkage', style: 'tableHeader'},{text: 'Shrinkage Loss(%)', style: 'tableHeader'},{text: 'Mortality Quantity', style: 'tableHeader'},{text: 'Mortality Percentage', style: 'tableHeader'},{text: 'Mortality Weight', style: 'tableHeader'},{text: 'Rate', style: 'tableHeader'},{text: 'Net Amount', style: 'tableHeader'}],";

            for (var i = 0; i < tbleModel.length; i++) {
                if (tbleModel[i].invoicedate == null) {
                    tbleModel[i].invoicedate = "-";
                }
                if (tbleModel[i].purchaseinvoiceno == null) {
                    tbleModel[i].purchaseinvoiceno = "-";
                }
                if (tbleModel[i].referenceno == null) {
                    tbleModel[i].referenceno = "-";
                }
                if (tbleModel[i].transferdate == null) {
                    tbleModel[i].transferdate = "-";
                }
                if (tbleModel[i].partyname == null) {
                    tbleModel[i].partyname = "-";
                }
                if (tbleModel[i].modulename == null) {
                    tbleModel[i].modulename = "-";
                }
                if (tbleModel[i].itembatch == null) {
                    tbleModel[i].itembatch = "-";
                }
                if (tbleModel[i].itemname == null) {
                    tbleModel[i].itemname = "-";
                }
                if (tbleModel[i].itemunitname == null) {
                    tbleModel[i].itemunitname = "-";
                }
                
                if (tbleModel[i].locationname == null) {
                    tbleModel[i].locationname = "-";
                }
                if (tbleModel[i].transferqty == null) {
                    tbleModel[i].transferqty = "-";
                }
                if (tbleModel[i].receivedweight == null) {
                    tbleModel[i].receivedweight = "-";
                }
                if (tbleModel[i].receiptqty == null) {
                    tbleModel[i].receiptqty = "-";
                }
               
                if (tbleModel[i].actualweight == null) {
                    tbleModel[i].actualweight = "-";
                }
                if (tbleModel[i].shrinkage == null) {
                    tbleModel[i].shrinkage = "-";
                }
                if (tbleModel[i].shrikageper == null) {
                    tbleModel[i].shrikageper = "-";
                }

                if (tbleModel[i].transitmortality == null) {
                    tbleModel[i].transitmortality = "-";
                }
                if (tbleModel[i].morper == null) {
                    tbleModel[i].morper = "-";
                }
                if (tbleModel[i].morweight == null) {
                    tbleModel[i].morweight = "-";
                }
                if (tbleModel[i].costperkg == null) {
                    tbleModel[i].costperkg = "-";
                }
                if (tbleModel[i].netamt == null) {
                    tbleModel[i].netamt = "-";
                }

                headertable1 += "['" + tbleModel[i].invoicedate + "','" + tbleModel[i].purchaseinvoiceno + "','" + tbleModel[i].referenceno + "','" + tbleModel[i].transferdate + "','" + tbleModel[i].partyname + "','" + tbleModel[i].modulename + "','" + tbleModel[i].itembatch + "','" + tbleModel[i].itemname + "','" + tbleModel[i].itemunitname + "','" + tbleModel[i]. locationname + "','" + tbleModel[i].transferqty + "','" + tbleModel[i].receivedweight + "','" + tbleModel[i].receiptqty + "','" + tbleModel[i].actualweight + "','" + tbleModel[i].shrinkage + "','" + tbleModel[i].shrikageper + "','" + tbleModel[i].transitmortality + "','" + tbleModel[i].morper + "','"  + tbleModel[i].morweight + "','" + tbleModel[i].costperkg + "','" + tbleModel[i].netamt + "'],"
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
                "pdfMake.createPdf(docDefinition).download('Processing_Live_Bird_Detail_Report.pdf');" +
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
          
            let modukname = this.inputitemBatchesname;
            let item = this.outputitemname;

            let filename = modukname + '_' + item;



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
                        name: "Invoice Date.",
                        template: { content: "{invoicedate}" }
                    },
                    {
                        name: "Invoice No.",
                        template: { content: "{purchaseinvoiceno}" }
                    },
                    {
                        name: "Reference No.",
                        template: { content: "{referenceno}" }
                    },
                    {
                        name: "DC Date",
                        template: { content: "{transferdate}" }
                    },
                    {
                        name: "Party Name",
                        template: { content: "{partyname}" }
                    },
                    {
                        name: "From Module",
                        template: { content: "{modulename}" }
                    },
                    {
                        name: "From Batch",
                        template: { content: "{itembatch}" }
                    },
                    {
                        name: "Bird Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Unit",
                        template: { content: "{itemunitname}" }
                    },
                    {
                        name: "Location",
                        template: { content: "{locationname}" }
                    },
                    {
                        name: "Received Quantity",
                        template: { content: "{transferqty}" }
                    },
                    {
                        name: "Received  Weight",
                        template: { content: "{receivedweight}" }
                    },
                    {
                        name: "Actual Quantity",
                        template: { content: "{receiptqty}" }
                    },
                    {
                        name: "Actual  Weight",
                        template: { content: "{actualweight}" }
                    },
                    {
                        name: "Shrinkage",
                        template: { content: "{shrinkage}" }
                    },
                    {
                        name: "Shrinkage Loss(%)",
                        template: { content: "{shrikageper}" }
                    },
                    {
                        name: "Mortality Quantity",
                        template: { content: "{transitmortality}" }
                    },
                    {
                        name: "Mortality Percentage",
                        template: { content: "{morper}" }
                    },
                    {
                        name: "Mortality Weight",
                        template: { content: "{morweight}" }
                    },
                    {
                        name: "Rate",
                        template: { content: "{costperkg}" }
                    },
                    {
                        name: "Net Amount",
                        template: { content: "{netamt}" }
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
