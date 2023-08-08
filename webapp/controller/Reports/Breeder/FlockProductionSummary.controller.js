sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/services/Reports/BreederReports.service',
    'sap/ui/elev8rerp/componentcontainer/services/Breeder/BreederBatch.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',

], function (JSONModel, BaseController, MessageToast, MessageBox, Export, ExportTypeCSV, commonFunction, breederReportsService, breederBatchService, commonService) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Reports.Breeder.FlockProductionSummary", {

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
                breederbatchid: null,
             
            }
        },

        handleRouteMatched: function () {
            //Breeder batch help box
            this.getAllBreederBatches(status);
        },



        getAllBreederBatches: function () {
            var currentContext = this;
            breederBatchService.getAllBatches(function (data) {
                if (data[0].length > 0) {
                    var oBatchModel = new sap.ui.model.json.JSONModel();
                    oBatchModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oBatchModel, "batchModel");
                } else {
                    MessageBox.error("Breeder batch not availabel!");
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
            this.getView().byId("txtBreederToBatch").setValueState(sap.ui.core.ValueState.None);
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
            if (!commonFunction.isSelectRequired(this, "txtBreederToBatch", "Batch is required!"))
				isValid = false;    
            return isValid;
        },

        onSearchData: function () {
            if (this.validateForm()) {
                var currentContext = this;
                var batchesStr= currentContext.getView().byId("txtBreederToBatch").getSelectedItem().mProperties.key;
                console.log("batchesStr",batchesStr);
                breederReportsService.flocksummaryReport({breederbatchid: batchesStr}, function async(data) {
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
                commonFunction.generatePDF(template, "Flock Detail Report");
            });
        },


        handlePrint: function (oEvent) {
            var fullHtml = "";
            var fullHtml1 = "";
            var fullHtml2 = "";
            var fullHtml3 = "";
            var createInvoice = this.getView().getModel('tblModel');
            var batchname = this.batchsname;
            var companyname = this.companyname;
            var companycontact = this.companycontact;
            var companyemail = this.companyemail;
            var address = this.address;
            var pincode = this.pincode;

            var invoice = createInvoice.oData.modelData;
            var headertable1 = "<table  border='1' style='margin-top:150px;width: 1000px;' align='center'>" +
                "<caption style='color:black;font-weight: bold;font-size: large;'></caption>" +
                "<tr><th style='color:black'>Date</th>" +
                "<th style='color:black'>WK Of Lays</th>" +
                "<th style='color:black'>WK Of Age</th>" +
                "<th style='color:black'>Female Live Qty</th>" +
                "<th style='color:black'>Male Live Qty</th>" +
                "<th style='color:black'>Female M</th>" +
                "<th style='color:black'>Female M%</th>" +
                "<th style='color:black'>F Cummu M%</th>" +

                "<th style='color:black'>F Std</th>" +
                "<th style='color:black'>Male M</th>" +
                "<th style='color:black'>Male M%</th>" +
                "<th style='color:black'>M Cummu M%</th>" +
                "<th style='color:black'>Hen Day Pro Act</th>" +
                "<th style='color:black'>Hen Day Pro Std</th>" +
                "<th style='color:black'>Weekly Total Eggs</th>" +

                "<th style='color:black'>Cummu Total Eggs</th>" +
                "<th style='color:black'>Cum Eggs/Hen Housed Act</th>" +
                "<th style='color:black'>Cum Eggs/Hen Housed std</th>" +
                "<th style='color:black'>Hatching Eggs% Act</th>" +
                "<th style='color:black'>Hatching Eggs% Std</th>" +
                "<th style='color:black'>Avg Egg Size(gm)Act</th>" +
                "<th style='color:black'>Avg Egg Size(gm)std</th>" +

                "<th style='color:black'>Weekly Hat Eggs</th>" +
                "<th style='color:black'>Cummu Hat Eggs</th>" +
                "<th style='color:black'>Cummu Hat Egg Hen Housed Act</th>" +
                "<th style='color:black'>Cummu Hat Egg Hen Housed Std</th>" +
                "<th style='color:black'>Difference</th>" +
                "<th style='color:black'>Hatch% Act</th>" +
                "<th style='color:black'>Hatch% Std</th>" +

                "<th style='color:black'>weekly chicks</th>" +
                "<th style='color:black'>Cum Chicks</th>" +
                "<th style='color:black'>Cum Chicks/Hen Housed Act</th>" +
                "<th style='color:black'>Cum Chicks/Hen Housed std</th>" +
                "<th style='color:black'>Female Feed Con</th>" +
                "<th style='color:black'>Male Feed Con</th>" +
                "<th style='color:black'>Cummu Feed</th>" +

                "<th style='color:black'>Feed/1 female</th>" +
                "<th style='color:black'>std Feed Female</th>" +
                "<th style='color:black'>Feed/1 male</th>" +
                "<th style='color:black'>std Feed Male</th>" +
                "<th style='color:black'>female Act weight</th>" +
                "<th style='color:black'>female Std weight</th>" +
                "<th style='color:black'>difference</th>" +

                "<th style='color:black'>Male Act weight</th>" +
                "<th style='color:black'>Male Std weight</th>" +
                "<th style='color:black'>EggMass Act</th>" +
                "<th style='color:black'>EggMass Std</th>" +
                "<th style='color:black'>Feed/HE</th>></tr>" 

               
             var titile1= "<table  style='margin-top:50px;width:800px;' align='center'>" +
            "<caption style='color:black;font-weight: bold;font-size: large;'>Flock Production Summary Report</caption>" 
   

             var batchname1= "<table  style='margin-top:60px;width: 800px;' align='left'>" +
             "<caption style='color:black;font-weight: bold;font-size: large;'></caption>" 

             var header= "<table  style='margin-top:-60px;width: 500px;' align='left'; padding: 0px;font-size: 14px;margin: 0;line-height:1;cellpadding=0px; cellspacing=0px>" +
             "<caption style='color:black;font-weight: bold;font-size: large;'></caption>"

             header +=    "<tr>" +"<th align='left'> CompanyName </th>"+"<td align='left'>" + companyname + "</td>"+"</tr>"+
                          "<tr>" +"<th align='left'> Companycontact </th>" +"<td align='left'>" + companycontact + "</td>"+"<br>"+"</tr>"+
                          "<tr>" +"<th align='left'> Email </th>"+"<td align='left'>" + companyemail + "</td>"+"<br>"+"</tr>"+
                          "<tr>" +"<th align='left'> Address </th>" +"<td align='left'>" + address + "</td>"+"<br>"+"</tr>"+
                          "<tr>" +"<th align='left'> PinCode </th>"+"<td align='left'>" + pincode + "</td>"+"<br>"+"</tr>";
         
           
             batchname1 += "<tr>"+ "<th align='right'> Batch Name </th>" +"<td align='right'>" + batchname + "</td>"+"<br>"+"</tr>";
                           
       
               
            //Adding row dynamically to student table....

            for (var i = 0; i < invoice.length; i++) {
                headertable1 += "<tr>" +
                    "<td>" + invoice[i].lastdate + "</td>" +
                    "<td>" + invoice[i].weekoflays + "</td>" +
                    "<td>" + invoice[i].ageinweek + "</td>" +
                    "<td>" + invoice[i].femaleliveqty + "</td>" +
                    "<td>" + invoice[i].maleliveqty + "</td>" +
                    "<td>" + invoice[i].femalemortality + "</td>" +
                    "<td>" + invoice[i].femalemortalityper + "</td>" +
                    "<td>" + invoice[i].cummalefemalemortality + "</td>" +

                    "<td>" + invoice[i].stdmortality + "</td>" +
                    "<td>" + invoice[i].malemortality + "</td>" +
                    "<td>" + invoice[i].malemortalityper + "</td>" +
                    "<td>" + invoice[i].cummalemalemortality + "</td>" +
                    "<td>" + invoice[i].hensdayproact + "</td>" +
                    "<td>" + invoice[i].hdinpercent + "</td>" +
                    "<td>" + invoice[i].weeklytotaleggs + "</td>" +
                    "<td>" + invoice[i].cumulativetotaleggs + "</td>" +

                    "<td>" + invoice[i].act + "</td>" +
                    "<td>" + invoice[i].cumhhp + "</td>" +
                    "<td>" + invoice[i].hatchper + "</td>" +
                    "<td>" + invoice[i].heinpercent + "</td>" +
                    "<td>" + invoice[i].hatchingavgeggsize + "</td>" +
                    "<td>" + invoice[i].hatchingavgeggsizestd + "</td>" +
                    "<td>" + invoice[i].weeklyhatchingeggs + "</td>" +
                    "<td>" + invoice[i].cumulativehatchingeggs + "</td>" +

                    "<td>" + invoice[i].hatchingact + "</td>" +
                    "<td>" + invoice[i].cumhhhe + "</td>" +
                    "<td>" + invoice[i].difference + "</td>" +
                    "<td>" + invoice[i].hatchact + "</td>" +
                    "<td>" + invoice[i].hatchinpercent + "</td>" +
                    "<td>" + invoice[i].weeklychickd + "</td>" +
                    "<td>" + invoice[i].cumchicks + "</td>" +
                    "<td>" + invoice[i].cumchicks + "</td>" +

                    "<td>" + invoice[i].cumchicks + "</td>" +
                    "<td>" + invoice[i].femalecon + "</td>" +
                    "<td>" + invoice[i].malecon + "</td>" +
                    "<td>" + invoice[i].cumulativemalefemalefeedcon + "</td>" +
                    "<td>" + invoice[i].feed1female + "</td>" +
                    "<td>" + invoice[i].stdfemalefeedcon + "</td>" +
                    "<td>" + invoice[i].feed1male + "</td>" +
                    "<td>" + invoice[i].stdmalefeedcon + "</td>" +

                    "<td>" + invoice[i].femalebodyweight + "</td>" +
                    "<td>" + invoice[i].stdfemalebodyweight + "</td>" +
                    "<td>" + invoice[i].hatchper + "</td>" +
                    "<td>" + invoice[i].heinpercent + "</td>" +
                    "<td>" + invoice[i].stdmalebodyweight + "</td>" +
                    "<td>" + invoice[i].eggmass + "</td>" +
                    "<td>" + invoice[i].eggmassstd + "</td>" +
                    "<td>" + invoice[i].feedperHE + "</td>" +
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
                        name: "Female Live Qty",
                        template: { content: "{femaleliveqty}" }
                    },
                    {
                        name: "Male Live Qty",
                        template: { content: "{maleliveqty}" }
                    },
                    {
                        name: "Female M",
                        template: { content: "{femalemortality}" }
                    },
                    {
                        name: "Female M%",
                        template: { content: "{femalemortalityper}" }
                    },
                    {
                        name: "F Cummu M%",
                        template: { content: "{cummalefemalemortality}" }
                    },
                    {
                        name: "F Std",
                        template: { content: "{F Std}" }
                    },
                    {
                        name: "Male M",
                        template: { content: "{malemortality}" }
                    },
                    {
                        name: "Male M%",
                        template: { content: "{malemortalityper}" }
                    },
                    {
                        name: "M Cummu M%",
                        template: { content: "{cummalemalemortality}" }
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
                        name: "Cummu Total Eggs",
                        template: { content: "{cumulativetotaleggs}" }
                    },
                    {
                        name: "Cum Eggs/Hen Housed Act",
                        template: { content: "{act}" }
                    },
                    {
                        name: "Cum Eggs/Hen Housed std",
                        template: { content: "{cumhhp}" }
                    },
                    {
                        name: "Hatching Eggs% Act",
                        template: { content: "{hatchper}" }
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
                        name: "Avg Egg Size(gm)std",
                        template: { content: "{hatchingavgeggsizestd}" }
                    },
                    {
                        name: "Weekly Hat Eggs",
                        template: { content: "{weeklyhatchingeggs}" }
                    },
                    {
                        name: "Cummu Hat Eggs",
                        template: { content: "{cumulativehatchingeggs}" }
                    },
                    {
                        name: "Cummu Hat Egg Hen Housed Act",
                        template: { content: "{hatchingact}" }
                    },
                    {
                        name: "Cummu Hat Egg Hen Housed Std",
                        template: { content: "{cumhhhe}" }
                    },
                    {
                        name: "Difference",
                        template: { content: "{difference}" }
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
                        name: "Cum Chicks/Hen Housed Act",
                        template: { content: "{aaa}" }
                    },
                    {
                        name: "Cum Chicks/Hen Housed Std",
                        template: { content: "{aaa}" }
                    },
                    {
                        name: "Female Feed Con",
                        template: { content: "{femalecon}" }
                    },
                    {
                        name: "Male Feed Con",
                        template: { content: "{malecon}" }
                    },
                    {
                        name: "Cummu Feed",
                        template: { content: "{cumulativemalefemalefeedcon}" }
                    },
                    {
                        name: "Feed/1 female",
                        template: { content: "{feed1female}" }
                    },
                    {
                        name: "std Feed Female",
                        template: { content: "{stdfeedfemale}" }
                    },
                    {
                        name: "Feed/1 male",
                        template: { content: "{feed1male}" }
                    },

                    {
                        name: "std Feed Male",
                        template: { content: "{stdfeedmale}" }
                    },
                    {
                        name: "female Act weight",
                        template: { content: "{femalebodyweight}" }
                    },
                    {
                        name: "female Std weight",
                        template: { content: "{femalestd}" }
                    },
                    {
                        name: "difference",
                        template: { content: "{femalebodyweightdifference}" }
                    },
                    {
                        name: "Male Act weight",
                        template: { content: "{malebodyweight}" }
                    },
                    {
                        name: "Male Std weight",
                        template: { content: "{stdmalebodyweight}" }
                    },
                    {
                        name: "EggMass Act",
                        template: { content: "{eggmass}" }
                    },
                    {
                        name: "EggMass Std",
                        template: { content: "{eggmassstd}" }
                    },
                    {
                        name: "Feed/HE",
                        template: { content: "{feedperHE}" }
                    },
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
