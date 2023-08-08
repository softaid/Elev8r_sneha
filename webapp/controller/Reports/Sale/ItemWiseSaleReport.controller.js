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

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Sale.ItemWiseSaleReport", {

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

            // get All parties
            commonFunction.getAllVendor(this, 32);

            // get all ItemGroup
            this.getItemGroups(this, "itemGroupList");
            var model = new JSONModel();
            model.setData([]);
            this.getView().setModel(model, "reportModel");

            //set default model
            var emptyModel = this.getModelDefault();
            model.setData(emptyModel)

            //set child model
            var model = new JSONModel();
            model.setData({ modelData: [] });
            this.getView().setModel(model, "tblModel");
            this.getView().byId("txtdownload").setVisible(false);
        },

        // default model
        getModelDefault: function () {
            return {
                customerid: null,
                fromdate: null,
                todate: null
            }
        },

        // reset model
        resetModel: function () {
            var tbleModel = this.getView().getModel("tblModel");
            tbleModel.setData({ modelData: [] });

            var pModel = this.getView().getModel("reportModel");
            pModel.setData([]);

        },

        //get all itemgroups
        getItemGroups: function (currentContext) {
            commonService.getItemGroups(function (data) {
                var oBranchModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "groupname": "Select All" });
                    } else {
                        MessageBox.error("group not availabel.")
                    }
                }
                oBranchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBranchModel, "itemGroupList");
            });
        },

        //select all functionality
        groupSelectionFinish: function (oEvt) {
            var currentContext = this;
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedKeys = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedKeys.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }

            var itemgroupid = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                itemgroupid.push(selectedKeys[i].key);
            }

            this.groupname = [];
            for (var i = 0; i < selectedKeys.length; i++) {
                this.groupname.push(selectedKeys[i].text);
            }
            if (itemgroupid[i] == "NaN") {

                itemgroupid.shift();
            }
            else {
                itemgroupid;
            }

            commonService.getItemsByItemGroups({ itemgroupid: itemgroupid }, function (data) {
                var oBranchModel = new sap.ui.model.json.JSONModel();
                if (data.length > 0) {
                    if (data[0].length > 0) {
                        data[0].unshift({ "id": "All", "itemname": "Select All" });
                    } else {
                        MessageBox.error("group not availabel.")
                    }
                }
                oBranchModel.setData({ modelData: data[0] });
                oBranchModel.setSizeLimit(data[0].length);
                currentContext.getView().setModel(oBranchModel, "itemList");
            });
            this.getView().byId("txtitemgroup").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            })
        },

        // select all functionality
        itemSelectionFinish: function (oEvt) {
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedsheds = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedsheds.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            this.itemStr = [];
            for (var i = 0; selectedsheds.length > i; i++) {
                if (selectedsheds[i].text != "Select All")
                    this.itemStr.push(selectedsheds[i].key);
            }

            this.itemname = [];
            for (var i = 0; i < selectedsheds.length; i++) {
                this.itemname.push(selectedsheds[i].text);
            }

            this.getView().byId("txtitemname").setValueState(sap.ui.core.ValueState.None);
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            })
        },

        handleselectionChange: function (oEvent) {
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

        // PDF function   
        handlePrint: function (oEvent) {
            var fullHtml = "";
            var fullHtml1 = "";
            var fullHtml2 = "";
            var fullHtml3 = "";
            var createInvoice = this.getView().getModel('tblModel');
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var groupname = this.groupname;
            var itemname = this.itemname;

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var invoice = createInvoice.oData.modelData;
            var headertable1 = "<table  border='1' style='margin-top:150px;width: 1000px;' align='center'>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'></caption>" +
                "<tr><th style='color:black'>Item Name</th>" +
                "<th style='color:black'>Customer Name</th>" +
                "<th style='color:black'>Invoice No</th>" +
                "<th style='color:black'>Invoice Date</th>" +
                "<th style='color:black'>Weight</th>" +
                "<th style='color:black'>Quantity</th>" +
                "<th style='color:black'>Avg Price</th>" +
                "<th style='color:black'>Gross Total</th>" +

                "<th style='color:black'>Item Discount</th>" +
                "<th style='color:black'>Invoice Discount</th>" +
                "<th style='color:black'>CGST Amount</th>" +
                "<th style='color:black'>SGST Amount</th>" +
                "<th style='color:black'>IGST Amount</th>" +
                "<th style='color:black'>UTGST Amount</th>" +
                "<th style='color:black'>Net Total</th></tr>"


            var titile1 = "<table  style='margin-top:50px;width:800px;' align='center'>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'>Item Wise Sale Report</caption>"


            var batchname1 = "<table  style='margin-top:60px;width: 800px;' align='left'>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'></caption>"

            var header = "<table  style='margin-top:-60px;width: 500px;' align='left'; padding: 0px;font-size: 14px;margin: 0;line-height:1;cellpadding=0px; cellspacing=0px>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'></caption>"

            header += "<tr>" + "<th align='left'> CompanyName </th>" + "<td align='left'>" + companyname + "</td>" + "</tr>" +
                "<tr>" + "<th align='left'> Companycontact </th>" + "<td align='left'>" + companycontact + "</td>" + "<br>" + "</tr>" +
                "<tr>" + "<th align='left'> Email </th>" + "<td align='left'>" + companyemail + "</td>" + "<br>" + "</tr>" +
                "<tr>" + "<th align='left'> Address </th>" + "<td align='left'>" + address + "</td>" + "<br>" + "</tr>" +
                "<tr>" + "<th align='left'> PinCode </th>" + "<td align='left'>" + pincode + "</td>" + "<br>" + "</tr>";


            batchname1 += "<tr>" + "<th align='left'>From Date </th>" + "<td align='left'>" + fromdate + "</td>" +
                "<th align='right'>To Date </th>" + "<td align='right'>" + todate + "</td>" + "<br>" + "</tr>" +
                "<tr>" + "<th align='left'>Item Group Name </th>" + "<td align='left'>" + groupname + "</td>" +
                "<th align='right'>Item Name </th>" + "<td align='right'>" + itemname + "</td>" + "<br>" + "</tr>";


            //Adding row dynamically to student table....

            for (var i = 0; i < invoice.length; i++) {
                headertable1 += "<tr>" +
                    "<td>" + invoice[i].itemname + "</td>" +
                    "<td>" + invoice[i].partyname + "</td>" +
                    "<td>" + invoice[i].salesinvoiceno + "</td>" +
                    "<td>" + invoice[i].salesinvoicedate + "</td>" +
                    "<td>" + invoice[i].weight + "</td>" +
                    "<td>" + invoice[i].quantity + "</td>" +
                    "<td>" + invoice[i].rate + "</td>" +

                    "<td>" + invoice[i].grosstotal + "</td>" +
                    "<td>" + invoice[i].discount + "</td>" +
                    "<td>" + invoice[i].invoicediscount + "</td>" +
                    "<td>" + invoice[i].cgstamount + "</td>" +
                    "<td>" + invoice[i].sgstamount + "</td>" +
                    "<td>" + invoice[i].igstamount + "</td>" +
                    "<td>" + invoice[i].utgstamount + "</td>" +
                    "<td>" + invoice[i].nettotal + "</td>" +

                    "</tr>";
            }

            header += "</table>";
            fullHtml3 += header;

            titile1 += "</table>";
            fullHtml2 += titile1;

            batchname1 += "</table>";
            fullHtml1 += batchname1;

            headertable1 += "</table>";
            fullHtml += headertable1;

            var wind = window.open("", "prntExample");
            wind.document.write(fullHtml3);
            wind.document.write(fullHtml2);
            wind.document.write(fullHtml1);
            wind.document.write(fullHtml);

            //setTimeout(function() {


            wind.print();
            wind.close();
            wind.stop();
            //},1000);
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
                htmTable += "<td>" + model["partyname"] + "</td>"
                htmTable += "<td align='right'>" + model["itemname"] + "</td>"
                htmTable += "<td align='right'>" + model["weight"] + "</td>"
                htmTable += "<td>" + model["quantity"] + "</td>"
                htmTable += "<td>" + model["rate"] + "</td>"
                htmTable += "<td>" + model["grosstotal"] + "</td>"
                htmTable += "<td align='right'>" + model["discount"] + "</td>"
                htmTable += "<td>" + model["invoicediscount"] + "</td>"
                htmTable += "<td>" + model["cgstamount"] + "</td>"
                htmTable += "<td>" + model["sgstamount"] + "</td>"
                htmTable += "<td>" + model["igstamount"] + "</td>"
                htmTable += "<td>" + model["utgstamount"] + "</td>"
                htmTable += "<td>" + model["nettotal"] + "</td>"
                htmTable += "<td>" + model["nettotal"] + "</td>"
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
            commonFunction.getHtmlTemplate("Sale", "itemwisesalereport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generateLargePDF(template, "Item Wise Sale Report");
            });
        },


        // Function for pdf finish

        //get all data for itemwisesale report
        onItemWiseSaleReport: function () {
            if (this.validateForm()) {
                var currentContext = this;
                var oModel = this.getView().getModel("reportModel");
                var fromdate = commonFunction.getDate(oModel.oData.fromdate);
                var todate = commonFunction.getDate(oModel.oData.todate);


                hatcheryReports.getItemWiseSaleReport({ fromdate: fromdate, todate: todate, itemid: this.itemStr }, function async(data) {

                    var oBatchModel = currentContext.getView().getModel("tblModel");
                    oBatchModel.setData({ modelData: data[0] });

                })
            }
            this.getView().byId("txtdownload").setVisible(true);
        },

        // Validation Function
        validateForm: function () {
            var isValid = true;
            if (!commonFunction.ismultiComRequired(this, "txtitemgroup", " itemgroup is required"))
                isValid = false;

            if (!commonFunction.ismultiComRequired(this, "txtitemname", " item is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtFromdate", "From Date is required"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtTodate", "To Date is required"))
                isValid = false;


            return isValid;
        },

        // export CSV file for itemwise sale report
        onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
            var fromdate = this.getView().byId("txtFromdate").getValue();
            var todate = this.getView().byId("txtTodate").getValue();
            var groupname = this.groupname;
            var itemname = this.itemname;

            var filename = fromdate + '_' + todate + '_' + groupname + '_' + itemname;

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
                        name: "Item Name",
                        template: { content: "{itemname}" }
                    },
                    {
                        name: "Customer Name",
                        template: { content: "{partyname}" }
                    },
                    {
                        name: "Invoice No",
                        template: { content: "{salesinvoiceno}" }
                    },
                    {
                        name: "Invoice Date",
                        template: { content: "{salesinvoicedate}" }
                    },
                    {
                        name: "Weight",
                        template: { content: "{weight}" }
                    },
                    {
                        name: "Quantity",
                        template: { content: "{quantity}" }
                    },
                    {
                        name: "Rate",
                        template: { content: "{rate}" }
                    },
                    {
                        name: "Gross Total",
                        template: { content: "{grosstotal}" }
                    },
                    {
                        name: "Item Discount",
                        template: { content: "{discount}" }
                    },
                    {
                        name: "Invoice Discount",
                        template: { content: "{invoicediscount}" }
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
                        name: "Net Total",
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
