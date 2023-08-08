sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/SalesReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/HatcheryReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',

], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction, saleReportsService, hatcheryReports, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Sale.CustomerWiseSaleWithoutGroupReport", {

        currentContext: null,

        onInit: function () {
            this.currentContext = this;
            this.partyStr = [];
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            this.party = 31;



            // get All Parties 
            commonFunction.getAllVendor(this, 32);
            var model = new JSONModel();
            model.setData([]);
            this.getView().setModel(model, "reportModel");

            // set empty model
            var emptyModel = this.getModelDefault();
            model.setData(emptyModel)

            //set child model
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblModel");
            this.getView().byId("txtdownload").setVisible(false);
        },

        //default Model
        getModelDefault: function () {
            return {
                customerid: null,
                fromdate: null,
                todate: null
            }

        },

        // reset all models
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

        // Function Used For PDF Download
        replaceTemplateData: function (template) {
            // Item table Data --------------

            var tbleModel = this.getView().getModel("tblModel").oData.modelData;
            var htmTable = "";
            for (var indx in tbleModel) {
                var model = tbleModel[indx];
                // Replace/create column sequence data table
                htmTable += "<tr>";
                htmTable += "<td align='center'>" + model["partygroupname"] + "</td>"
                htmTable += "<td>" + model["partygroupname"] + "</td>"
                htmTable += "<td align='right'>" + model["partyname"] + "</td>"
                htmTable += "<td align='right'>" + model["branch"] + "</td>"
                htmTable += "<td>" + model["invoiceid"] + "</td>"
                htmTable += "<td>" + model["salesinvoicedate"] + "</td>"
                htmTable += "<td>" + model["referenceno"] + "</td>"
                htmTable += "<td align='right'>" + model["itemcode"] + "</td>"
                htmTable += "<td>" + model["des"] + "</td>"
                htmTable += "<td>" + model["quantity"] + "</td>"
                htmTable += "<td>" + model["rate"] + "</td>"
                htmTable += "<td>" + model["cgstamount"] + "</td>"
                htmTable += "<td>" + model["sgstamount"] + "</td>"
                htmTable += "<td>" + model["igstamount"] + "</td>"
                htmTable += "<td>" + model["utgstamount"] + "</td>"
                htmTable += "<td>" + model["grosstotal"] + "</td>"
                htmTable += "<td>" + model["nettotal"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var partyname = this.partyname;
            // var batchname = this.batchname;

            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);


            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##FromDate##", fromdate);
            template = this.replaceStr(template, "##ToDate##", todate);
            template = this.replaceStr(template, "##PartyName##", partyname);

            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Sale", "customerwisesalewithoutgroup.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Customer Wise Sale Without Group Report");
            });
        },



        // get data of report
        onCustomerwisesaleWithoutGroupReport: function () {
            if (this.validateForm()) {
                var currentContext = this;
                var partystring = this.getView().byId("partyList").getSelectedKeys();
                var partyStr = "";
                for (var i = 0; i < partystring.length; i++) {
                    if (i == 0)
                        partyStr = parseInt(partystring[i]);
                    else
                        partyStr = partyStr + "," + parseInt(partystring[i]);
                }

                var oModel = this.getView().getModel("reportModel");
                var fromdate = commonFunction.getDate(oModel.oData.fromdate);
                var todate = commonFunction.getDate(oModel.oData.todate);


                hatcheryReports.getCustomerWiseSaleWithoutGroupReport({ fromdate: fromdate, todate: todate, partyid: this.partyStr }, function async(data) {
                    console.log("getCustomerWiseSaleWithoutGroupReport", data);
                    var oBatchModel = currentContext.getView().getModel("tblModel");
                    oBatchModel.setData({ modelData: data[0] });

                })
            }
            this.getView().byId("txtdownload").setVisible(true);

        },

        // select all functionality
        partySelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedparties = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedparties.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }

            for (var i = 0; selectedparties.length > i; i++) {
                if (selectedparties[i].text != "Select All")
                    this.partyStr.push(selectedparties[i].key);
            }

            this.partyname = [];
            for (var i = 0; i < selectedparties.length; i++) {
                this.partyname.push(selectedparties[i].text);
            }

            this.getView().byId("partyList").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },


        partySelectionChange: function (oEvent) {
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

        // Validation Function

        validateForm: function () {
            var isValid = true;

            if (!commonFunction.ismultiComRequired(this, "partyList", "Party is required is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtFromdate", "From Date is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtTodate", "To Date is required"))
                isValid = false;
            return isValid;
        },


        // function for export CSV file
        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var partyname = this.partyname;
            var filename = fromdate + '_' + todate + '_' + partyname;
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
                        name: "Sale Employee",
                        template: { content: "{employeename}" }
                    },
                    {
                        name: "Customer Group",
                        template: { content: "{partygroupname}" }
                    },
                    {
                        name: "Customer Name",
                        template: { content: "{partyname}" }
                    },
                    {
                        name: "Branch",
                        template: { content: "{branch}" }
                    },
                    {
                        name: "Invoice No",
                        template: { content: "{invoiceid}" }
                    },
                    {
                        name: "Invoice Date",
                        template: { content: "{salesinvoicedate}" }
                    },
                    {
                        name: "Invoice Reference No",
                        template: { content: "{referenceno}" }
                    },
                    {
                        name: "Item Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Item Code",
                        template: { content: "{itemcode}" }
                    },
                    {
                        name: "Item Description",
                        template: { content: "{des}" }
                    },

                    {
                        name: "Quantity",
                        template: { content: "{quantity}" }
                    },
                    {
                        name: "Weight",
                        template: { content: "{weight}" }
                    },
                    {
                        name: "Price",
                        template: { content: "{rate}" }
                    },
                    {
                        name: "CGST Amount",
                        template: { content: "{cgstamount}" }
                    },
                    {
                        name: "SGST Amount",
                        template: { content: "{sgstamount}" }
                    },
                    {
                        name: "IGST Amount",
                        template: { content: "{igstamount}" }
                    },
                    {
                        name: "UTGST Amount",
                        template: { content: "{utgstamount}" }
                    },
                    {
                        name: "Gross total",
                        template: { content: "{grosstotal}" }
                    },
                    {
                        name: "Net total",
                        template: { content: "{nettotal}" }
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
