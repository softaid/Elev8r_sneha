sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/CommercialLayer/LayerBatch.service',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/CommercialLayerReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',

], function (JSONModel, BaseController, MessageBox, Export, ExportTypeCSV, commonFunction,layerBatch, commercialLayerReports, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.CommercialLayer.FlockProductionSummaryReport", {

        currentContext: null,
        onInit: function () {
            this.companyname = commonFunction.session("companyname");
            this.companycontact = commonFunction.session("companycontact");
            this.companyemail = commonFunction.session("companyemail");
            this.address = commonFunction.session("address");
            this.pincode = commonFunction.session("pincode");
            var emptyModel = this.getModelDefault();

            var flockDetailModel = new JSONModel();
            flockDetailModel.setData(emptyModel);
            this.getView().setModel(flockDetailModel, "flockDetailModel");

            var tblModel = new JSONModel();
            tblModel.setData({ modelData: [] });
            this.getView().setModel(tblModel, "tblModel");
            this.handleRouteMatched(null);

            var currRouteName = this.getOwnerComponent().getModel("applicationModel").getProperty("/routeName");
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.getRoute(currRouteName).attachMatched(this.handleRouteMatched, this);
        },

        getModelDefault: function () {
            return {
                layerbatchid: null,
             
            }
        },

        handleRouteMatched: function () {
            //Breeder batch help box
            this.getAllLayerBatches(status);
        },
        
        getAllLayerBatches: function () {
            var currentContext = this;
            layerBatch.getAllBatches(function (data) {
                if (data[0].length > 0) {
                    data[0].unshift({ "id": "All", "batchname": "Select All" });
                    var oBatchModel = new sap.ui.model.json.JSONModel();
                    oBatchModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oBatchModel, "batchModel");
                } else {
                    MessageBox.error("Layer batch not available !");
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

        batchSelectionFinish: function (oEvt) {
            
            var selectedItems = oEvt.getParameter("selectedItems");
            var selectedbatches = [];
            for (var i = 0; i < selectedItems.length; i++) {
                selectedbatches.push({ key: selectedItems[i].getProperty("key"), "text": selectedItems[i].getProperty("text") });
            }
            var i = selectedbatches.length - 1;

            if (selectedbatches[i].key == "ALL") {

                selectedbatches = selectedbatches.slice(0, -1);
            }
            var batchs = [];
            for (var i = 0; i < selectedbatches.length; i++) {
                batchs.push(selectedbatches[i].key);
            }

            this.batchsname = [];
            for (var i = 0; i < selectedbatches.length; i++) {
                this.batchsname.push(selectedbatches[i].text);
            }

            this.batchesStr = "";

            for (var i = 0; i < batchs.length; i++) {
                if (i == 0)
                this.batchesStr = parseInt(batchs[i]);
                else
                this.batchesStr = this.batchesStr + "," + parseInt(batchs[i]);
            }
         
            var oModel = this.getView().getModel("flockDetailModel");
            oModel.oData.breederbatchid = this.batchesStr
            this.getView().byId("txtLayerToBatch").setValueState(sap.ui.core.ValueState.None);
            oModel.refresh();
            jQuery('.sapMTokenizerScrollContainer').find('div').each(function () {
                if (jQuery(this).find('.sapMTokenText').html() == "Select All") {
                    jQuery(this).remove();
                }
            });
        },


        resetModel: function () {
            var tbleModel = this.getView().getModel("tblModel");
            tbleModel.setData({ modelData: [] });

        },

        validateForm: function () {
            var isValid = true;
            if (!commonFunction.ismultiComRequired(this, "txtLayerToBatch", "Batch is required."))
                isValid = false;
            return isValid;
        },

        onSearchData: function () {
            if (this.validateForm()) {
                var currentContext = this;
                commercialLayerReports.layerflocksummaryReport({batchid: this.batchesStr}, function async(data) {
                    var childModel = currentContext.getView().getModel("tblModel");
                    childModel.setData({ modelData: data[0] });
                });
            }
        },

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
                htmTable += "<td align='center'>" + model["date"] + "</td>"
                htmTable += "<td>" + model["shedname"] + "</td>"
                htmTable += "<td align='right'>" + model["maleopeningbalance"] + "</td>"
                htmTable += "<td align='right'>" + model["femaleopeningbalance"] + "</td>"
                htmTable += "<td>" + model["maletransferedquantity"] + "</td>"
                htmTable += "<td>" + model["femaletransferedquantity"] + "</td>"
                htmTable += "<td>" + model["maleculls"] + "</td>"
                htmTable += "<td>" + model["femaleculls"] + "</td>"
                htmTable += "<td>" + model["cummalefemaleculls"] + "</td>"
                htmTable += "<td>" + model["malemortality"] + "</td>"
                htmTable += "<td>" + model["femalemortality"] + "</td>"
                htmTable += "<td>" + model["cummalefemalemortality"] + "</td>"
                htmTable += "<td>" + model["maleclosingbalance"] + "</td>"
                htmTable += "<td>" + model["femaleclosingbalance"] + "</td>"
                htmTable += "</tr>";
            }

            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var fromdate = this.getView().byId("txtFromDate").getValue();
            var batchname = this.batchsname;

            template = this.replaceStr(template, "##CompanyName##", companyname);
            template = this.replaceStr(template, "##CompanyContact##", companycontact);
            template = this.replaceStr(template, "##CompanyEmail##", companyemail);
            template = this.replaceStr(template, "##Address##", address);
            template = this.replaceStr(template, "##PinCode##", pincode);

            template = this.replaceStr(template, " ##ItemList##", htmTable);
            template = this.replaceStr(template, "##ReportFromDate##", fromdate);
            template = this.replaceStr(template, "##ReporToDate##", todate);
            template = this.replaceStr(template, "##BatchName##", batchname);
            return template;

        },

        createPDF: function () {
            var currentContext = this;
            commonFunction.getHtmlTemplate("Breeder", "FlockDetailReport.template.html", function (dataHtml) {
                var template = dataHtml.toString();
                template = currentContext.replaceTemplateData(template);
                commonFunction.generatePDF(template, "Flock detail report.");
            });
        },

        handlePrint: function (oEvent) {
            var fullHtml = "";
            var fullHtml1 = "";
            var fullHtml2 = "";
            var fullHtml3 = "";
            var BATCHNAME = "Batch Name:";
            var createInvoice = this.getView().getModel('tblModel');
            var batchname = this.batchsname;
            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;
            var CompanyName = "CompanyName";
            var Companycontact = "Companycontact";
            var Email = "Email";
            var Address = "Address";
            var PinCode = "PinCode";
           

            var invoice = createInvoice.oData.modelData;
            var headertable1 = "<table  border='1' style='margin-top:150px;width: 1000px;' align='center'>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'></caption>" +

                "<tr><th style='color:black'>Date</th>" +
                "<th style='color:black'>WK Of Lays</th>" +
                "<th style='color:black'>WK Of Age</th>" +
                "<th style='color:black'>Item Live Qty</th>" +
                "<th style='color:black'>Mortality</th>" +

                "<th style='color:black'>Cummu Mortality</th>" +
                "<th style='color:black'>F Std</th>" +
                "<th style='color:black'>Hen Day Pro Act</th>" +

                "<th style='color:black'>Hen Day Pro Std</th>" +
                "<th style='color:black'>Weekly Total Eggs</th>" +

                "<th style='color:black'>Cum Eggs/Hen Housed Act</th>" +
                "<th style='color:black'>Cum Eggs/Hen Housed std</th>" +
                "<th style='color:black'>Hatching Eggs% Act</th>" +
                "<th style='color:black'>Hatching Eggs% Std</th>" +

                "<th style='color:black'>Avg Egg Size(gm)Act</th>" +
                "<th style='color:black'>Weekly Hat Eggs</th>" +
                "<th style='color:black'>Cummu Hat Egg Hen Housed Std</th>" +

                "<th style='color:black'>Hatch% Act</th>" +
                "<th style='color:black'>Hatch% Std</th>" +
                
                "<th style='color:black'>weekly chicks</th>" +
                "<th style='color:black'>Cum Chicks</th>" +

                "<th style='color:black'>Consumption</th>" +
                "<th style='color:black'>Std Item Feed Con</th>" +
                "<th style='color:black'>Body Weight</th>" +
                "<th style='color:black'>Std Body Weight</th>></tr>" 

               
             var titile1= "<table  style='margin-top:50px;width: 1000px;' align='center'>" +
            "<caption style='color:black;font-weight: bold;font-size: large;'>Flock Production Summary Report</caption>" 
   

             var batchname1= "<table  style='margin-top:50px;width: 200px;' align='center'>" +
             "<caption style='color:black;font-weight: bold;font-size: large;'></caption>" 

             var header= "<table  style='margin-top:50px;width: 500px;' align='left'; padding: 15px;font-size: 14px;margin: 0;line-height:1>" +
             "<caption style='color:black;font-weight: bold;font-size: large;'></caption>"

             header +=    "<tr>" +"<th align='left'>"+ CompanyName +"<td align='left'>" + companyname + "</td>"+"</th>"+"<br>"+"</tr>"+
                          "<tr>" +"<th align='left'>"+ Companycontact +"<td align='left'>" + companyemail + "</td>"+"</th>"+"<br>"+"</tr>"+
                          "<tr>" +"<th align='left'>"+ Email +"<td align='left'>" + address + "</td>"+"</th>"+"<br>"+"</tr>"+
                          "<tr>" +"<th align='left'>"+ Address +"<td align='left'>" + address + "</td>"+"</th>"+"<br>"+"</tr>"+
                          "<tr>" +"<th align='left'>"+ PinCode +"<td align='left'>" + pincode + "</td>"+"</th>"+"<br>"+"</tr>";



             batchname1 +="<tr>" +
                          "<th align='left'>"+ BATCHNAME +"<td align='left'>" + batchname + "</td>"+"</th>"
                          "</tr>" ;

               
            //Adding row dynamically to student table....

            for (var i = 0; i < invoice.length; i++) {
                headertable1 += "<tr>" +
                    "<td>" + invoice[i].lastdate + "</td>" +
                    "<td>" + invoice[i].weekoflays + "</td>" +
                    "<td>" + invoice[i].ageinweek + "</td>" +
                    "<td>" + invoice[i].itemliveqty + "</td>" +
                    "<td>" + invoice[i].mortality + "</td>" +
                    "<td>" + invoice[i].cummalemortality + "</td>" +
                    "<td>" + invoice[i].hensdayproact + "</td>" +
                    "<td>" + invoice[i].hensdayproact + "</td>" +
                    "<td>" + invoice[i].hdinpercent + "</td>" +
                    "<td>" + invoice[i].weeklytotaleggs + "</td>" +
                    "<td>" + invoice[i].ahdinpercentct + "</td>" +
                    "<td>" + invoice[i].cumhhp + "</td>" +
                    "<td>" + invoice[i].heinpercent + "</td>" +
                    "<td>" + invoice[i].heinpercent + "</td>" +
                    "<td>" + invoice[i].hatchingavgeggsize + "</td>" +
                    "<td>" + invoice[i].weeklyhatchingeggs + "</td>" +
                    "<td>" + invoice[i].cumhhhe + "</td>" +
                    "<td>" + invoice[i].hatchact + "</td>" +
                    "<td>" + invoice[i].hatchinpercent + "</td>" +
                    "<td>" + invoice[i].weeklychickd + "</td>" +
                    "<td>" + invoice[i].cumchicks + "</td>" +
                    "<td>" + invoice[i].con + "</td>" +
                    "<td>" + invoice[i].stditemfeedcon + "</td>" +
                    "<td>" + invoice[i].bodyweight + "</td>" +
                    "<td>" + invoice[i].stditembodyweight + "</td>" +
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


            // window.open(URL, name, specs, replace)
            var wind = window.open("", "prntExample");
            wind.document.write(fullHtml3);
            wind.document.write(fullHtml2);
            wind.document.write(fullHtml1);
            wind.document.write(fullHtml);
           
            wind.print();
            wind.close();
            win.stop();
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
                models: this.getView().getModel("tblModel"),

                // binding information for the rows aggregation
                rows: {
                    path: "/modelData"
                },

                // column definitions with column name and binding info for the content

                columns: [

                    {
                        name: "Date",
                        template: { content: "{lastdate}" }
                    },
                    {
                        name: "WK Of Lays",
                        template: { content: "{weekoflays}" }
                    },
                    {
                        name: "WK Of Age",
                        template: { content: "{ageinweek}" }
                    },
                    
                    {
                        name: "Item Live Qty",
                        template: { content: "{itemliveqty}" }
                    },
                    {
                        name: "Mortality",
                        template: { content: "{mortality}" }
                    },
                    {
                        name: "Cummu Mortality",
                        template: { content: "{cummalemortality}" }
                    },
                    {
                        name: "F Std",
                        template: { content: "{hensdayproact}" }
                    },
                    {
                        name: "Hen Day Pro Act",
                        template: { content: "{hensdayproact}" }
                    },
                    {
                        name: "Hen Day Pro Std",
                        template: { content: "{hdinpercent}" }
                    },
                    {
                        name: "Weekly Total Eggs",
                        template: { content: "{weeklytotaleggs}" }
                    },
                    {
                        name: "Cum Eggs/Hen Housed Act",
                        template: { content: "{ahdinpercentct}" }
                    },

                    {
                        name: "Cum Eggs/Hen Housed std",
                        template: { content: "{cumhhp}" }
                    },
                    {
                        name: "Hatching Eggs% Act",
                        template: { content: "{heinpercent}" }
                    },
                    {
                        name: "Hatching Eggs% Std",
                        template: { content: "{heinpercent}" }
                    },

                    {
                        name: "Avg Egg Size(gm)Act",
                        template: { content: "{hatchingavgeggsize}" }
                    },
                    {
                        name: "Weekly Hat Eggs",
                        template: { content: "{weeklyhatchingeggs}" }
                    },
                    {
                        name: "Cummu Hat Egg Hen Housed Std",
                        template: { content: "{cumhhhe}" }
                    },
                    {
                        name: "Hatch% Act",
                        template: { content: "{hatchact}" }
                    },
                    {
                        name: "Hatch% Std",
                        template: { content: "{hatchinpercent}" }
                    },
                    {
                        name: "weekly chicks",
                        template: { content: "{weeklychickd}" }
                    },
                    {
                        name: "Cum Chicks",
                        template: { content: "{cumchicks}" }
                    },
                    {
                        name: "Consumption",
                        template: { content: "{con}" }
                    },
                    {
                        name: "Std Item Feed Con",
                        template: { content: "{stditemfeedcon}" }
                    },
                    {
                        name: "Body Weight",
                        template: { content: "{bodyweight}" }
                    },
                    {
                        name: "Std Body Weight",
                        template: { content: "{stditembodyweight}" }
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
