
sap.ui.define([
    "sap/ui/model/json/JSONModel",
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/m/MessageToast',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',

], function (JSONModel, BaseController, MessageToast, CommonService, commonFunction) {
    "use strict";

    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Common.DashboardBreederSetting", {
       
        onInit: function () {
            this.oFlexibleColumnLayout = this.byId("fcldashboardbreedersetting");
            $("#fclBreederSettings").height(1000);
            this.getBreederSettiongData();
        },

        // get breeder setting data in yes no format
        getBreederSettiongData: function () {
			var currentContext = this;
            var modulearray =[];
            	//breeder setting data
                CommonService.getBreederSettingForDashBoard(function (data1) {
               
                // If setting is partially fill up then execute if condition and if setting is totally blanck then excute else part (Disply green and red color for values) 
                if(data1[0].length != 0)
                {
                    
                for(var i=0;i<data1[0].length>0;i++)
				{
                    let finalData = data1[0].slice()[0];
					modulearray.push({ 
                        WIPledgerid: finalData.WIPledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        WIPledgeridtype: finalData.WIPledgerid== 'yes' ? "Accept" : "Reject",
                        amortizationcostnonprodbird: finalData.amortizationcostnonprodbird == 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        amortizationcostnonprodbirdtype: finalData.amortizationcostnonprodbird == 'yes' ? "Accept" : "Reject",
                        amortizationcoststd: finalData.amortizationcoststd == 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        amortizationcoststdtype: finalData.amortizationcoststd == 'yes' ? "Accept" : "Reject",
                        amortizationledgerid: finalData.amortizationledgerid == 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        amortizationledgeridtype: finalData.amortizationledgerid== 'yes' ? "Accept" : "Reject",
                        birdcostnonprodbird: finalData.birdcostnonprodbird== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        birdcostnonprodbirdtype: finalData.birdcostnonprodbird== 'yes' ? "Accept" : "Reject",
                        birdcoststd: finalData.birdcoststd== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        birdcoststdtype: finalData.birdcoststd== 'yes' ? "Accept" : "Reject",
                        breeditemgroupids: finalData.breeditemgroupids== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        breeditemgroupidstype: finalData.breeditemgroupids== 'yes' ? "Accept" : "Reject",
                        cashledgerid: finalData.cashledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        cashledgeridtype: finalData.cashledgerid== 'yes' ? "Accept" : "Reject",
                        chicksitemgroupids: finalData.chicksitemgroupids== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        chicksitemgroupidstype: finalData.chicksitemgroupids== 'yes' ? "Accept" : "Reject",
                        commercialeggscost: finalData.commercialeggscost== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        commercialeggscosttype: finalData.commercialeggscost== 'yes' ? "Accept" : "Reject",
                        companyid: finalData.companyid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        companyidtype: finalData.companyid=='yes' ? "Accept" : "Reject",
                        costofgoodsoldledgerid: finalData.costofgoodsoldledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        costofgoodsoldledgeridtype: finalData.costofgoodsoldledgerid== 'yes' ? "Accept" : "Reject",
                        crackedeggscost: finalData.crackedeggscost== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        crackedeggscosttype: finalData.crackedeggscost== 'yes' ? "Accept" : "Reject",
                        ctrlaccledgerid: finalData.ctrlaccledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        ctrlaccledgeridtype: finalData.ctrlaccledgerid== 'yes' ? "Accept" : "Reject",
                        defaultchickwarehouseid: finalData.defaultchickwarehouseid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        defaultchickwarehouseidtype: finalData.defaultchickwarehouseid== 'yes' ? "Accept" : "Reject",
                        defaultcommercialeggsitemid: finalData.defaultcommercialeggsitemid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        defaultcommercialeggsitemidtype: finalData.defaultcommercialeggsitemid== 'yes' ? "Accept" : "Reject",
                        defaultcrackedeggsitemid: finalData.defaultcrackedeggsitemid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        defaultcrackedeggsitemidtype: finalData.defaultcrackedeggsitemid== 'yes' ? "Accept" : "Reject",
                        defaultcullswarehouseid: finalData.defaultcullswarehouseid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        defaultcullswarehouseidtype: finalData.defaultcullswarehouseid== 'yes' ? "Accept" : "Reject",
                        defaultdoubleyolkeggsitemid: finalData.defaultdoubleyolkeggsitemid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        defaultdoubleyolkeggsitemidtype: finalData.defaultdoubleyolkeggsitemid== 'yes' ? "Accept" : "Reject",
                        defaultfemalechickcost: finalData.defaultfemalechickcost== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        defaultfemalechickcosttype: finalData.defaultfemalechickcost== 'yes' ? "Accept" : "Reject",
                        defaultfemalechickid: finalData.defaultfemalechickid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        defaultfemalechickidtype: finalData.defaultfemalechickid== 'yes' ? "Accept" : "Reject",
                        defaultmalechickcost: finalData.defaultmalechickcost== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        defaultmalechickcosttype: finalData.defaultmalechickcost== 'yes' ? "Accept" : "Reject",
                        defaultmalechickid: finalData.defaultmalechickid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        defaultmalechickidtype: finalData.defaultmalechickid== 'yes' ? "Accept" : "Reject",
                        defaultoutsidehatcherywarehouseid: finalData.defaultoutsidehatcherywarehouseid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        defaultoutsidehatcherywarehouseidtype: finalData.defaultoutsidehatcherywarehouseid== 'yes' ? "Accept" : "Reject",
                        discountledgerid: finalData.discountledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        discountledgeridtype: finalData.discountledgerid== 'yes' ? "Accept" : "Reject",
                        doubleyolkeggscost: finalData.doubleyolkeggscost== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        doubleyolkeggscosttype: finalData.doubleyolkeggscost== 'yes' ? "Accept" : "Reject",
                        eggspredictionperbird: finalData.eggspredictionperbird== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        eggspredictionperbirdtype: finalData.eggspredictionperbird== 'yes' ? "Accept" : "Reject",
                        feeditemgroupids: finalData.feeditemgroupids== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        feeditemgroupidstype: finalData.feeditemgroupids== 'yes' ? "Accept" : "Reject",
                        feedledgerid: finalData.feedledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        feedledgeridtype: finalData.feedledgerid== 'yes' ? "Accept" : "Reject",
                        femalestandardweight: finalData.femalestandardweight== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        femalestandardweighttype: finalData.femalestandardweight== 'yes' ? "Accept" : "Reject",
                        freightledgerid: finalData.freightledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        freightledgeridtype: finalData.freightledgerid== 'yes' ? "Accept" : "Reject",
                        grpowithoutinvoiceledgerid:finalData.grpowithoutinvoiceledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        grpowithoutinvoiceledgeridtype: finalData.grpowithoutinvoiceledgerid== 'yes' ? "Accept" : "Reject",
                        hatchingeggscost: finalData.hatchingeggscost== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        hatchingeggscosttype: finalData.hatchingeggscost== 'yes' ? "Accept" : "Reject",
                        hatchingitemgroupids: finalData.hatchingitemgroupids== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        hatchingitemgroupidstype: finalData.hatchingitemgroupids== 'yes' ? "Accept" : "Reject",
                        id: finalData.id== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        id: finalData.idtype== 'yes' ? "Accept" : "Reject",
                        inventorygainandlossledgerid: finalData.inventorygainandlossledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        inventorygainandlossledgeridtype: finalData.inventorygainandlossledgerid== 'yes' ? "Accept" : "Reject",
                        labourcharge: finalData.labourcharge== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        labourchargetype: finalData.labourcharge== 'yes' ? "Accept" : "Reject",
                        malepercentage: finalData.malepercentage== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        malepercentagetype: finalData.malepercentage== 'yes' ? "Accept" : "Reject",
                        malestandardweight: finalData.malestandardweight== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        malestandardweighttype: finalData.malestandardweight== 'yes' ? "Accept" : "Reject",
                        medicineitemgroupids: finalData.medicineitemgroupids== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        medicineitemgroupidstype: finalData.medicineitemgroupids== 'yes' ? "Accept" : "Reject",
                        mortalityledgerid: finalData.mortalityledgerid= 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        mortalityledgeridtype: finalData.mortalityledgerid= 'yes' ? "Accept" : "Reject",
                        overheadcost: finalData.overheadcost== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        overheadcosttype: finalData.overheadcost== 'yes' ? "Accept" : "Reject",
                        shedrestperiod: finalData.shedrestperiod== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        shedrestperiodtype: finalData.shedrestperiod=='yes' ? "Accept" : "Reject",
                        stockledgerid: finalData.stockledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        stockledgeridtype: finalData.stockledgerid== 'yes' ? "Accept" : "Reject",
                        vaccineitemgroupids: finalData.vaccineitemgroupids== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        vaccineitemgroupidstype: finalData.vaccineitemgroupids== 'yes' ? "Accept" : "Reject",
                        vaccineledgerid: finalData.vaccineledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        vaccineledgeridtype: finalData.vaccineledgerid== 'yes' ? "Accept" : "Reject",
                        medicineledgerid: finalData.medicineledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        medicineledgeridtype: finalData.medicineledgerid== 'yes' ? "Accept" : "Reject",
                        vitaminitemgroupids: finalData.vitaminitemgroupids== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        vitaminitemgroupidstype: finalData.vitaminitemgroupids== 'yes' ? "Accept" : "Reject",
                        vitaminledgerid: finalData.vitaminledgerid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        vitaminledgeridtype: finalData.vitaminledgerid== 'yes' ? "Accept" : "Reject",
                        wastageeggscost: finalData.wastageeggscost== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        wastageeggscosttype: finalData.wastageeggscost== 'yes' ? "Accept" : "Reject",
                        wastageeggsitemid: finalData.wastageeggsitemid== 'yes' ? "sap-icon://accept" : "sap-icon://decline",
                        wastageeggsitemidtype: finalData.wastageeggsitemid== 'yes' ? "Accept" : "Reject"
					 });
				}
            }
            else
            {
                modulearray.push({ 
                    WIPledgerid:  "sap-icon://decline",
                    WIPledgeridtype:  "Reject",
                    amortizationcostnonprodbird: "sap-icon://decline",
                    amortizationcostnonprodbirdtype:  "Reject",
                    amortizationcoststd: "sap-icon://decline",
                    amortizationcoststdtype:  "Reject",
                    amortizationledgerid:  "sap-icon://decline",
                    amortizationledgeridtype:  "Reject",
                    birdcostnonprodbird: "sap-icon://decline",
                    birdcostnonprodbirdtype:  "Reject",
                    birdcoststd: "sap-icon://decline",
                    birdcoststdtype:  "Reject",
                    breeditemgroupids:  "sap-icon://decline",
                    breeditemgroupidstype:  "Reject",
                    cashledgerid:  "sap-icon://decline",
                    cashledgeridtype: "Reject",
                    chicksitemgroupids:  "sap-icon://decline",
                    chicksitemgroupidstype:  "Reject",
                    commercialeggscost:  "sap-icon://decline",
                    commercialeggscosttype:  "Reject",
                    companyid:  "sap-icon://decline",
                    companyidtype: "Reject",
                    costofgoodsoldledgerid:  "sap-icon://decline",
                    costofgoodsoldledgeridtype: "Reject",
                    crackedeggscost:  "sap-icon://decline",
                    crackedeggscosttype:  "Reject",
                    ctrlaccledgerid:  "sap-icon://decline",
                    ctrlaccledgeridtype:  "Reject",
                    defaultchickwarehouseid: "sap-icon://decline",
                    defaultchickwarehouseidtype:  "Reject",
                    defaultcommercialeggsitemid: "sap-icon://decline",
                    defaultcommercialeggsitemidtype:  "Reject",
                    defaultcrackedeggsitemid: "sap-icon://decline",
                    defaultcrackedeggsitemidtype:  "Reject",
                    defaultcullswarehouseid: "sap-icon://decline",
                    defaultcullswarehouseidtype:  "Reject",
                    defaultdoubleyolkeggsitemid:  "sap-icon://decline",
                    defaultdoubleyolkeggsitemidtype:  "Reject",
                    defaultfemalechickcost: "sap-icon://decline",
                    defaultfemalechickcosttype:  "Reject",
                    defaultfemalechickid:  "sap-icon://decline",
                    defaultfemalechickidtype:  "Reject",
                    defaultmalechickcost: "sap-icon://decline",
                    defaultmalechickcosttype:  "Reject",
                    defaultmalechickid:  "sap-icon://decline",
                    defaultmalechickidtype:  "Reject",
                    defaultoutsidehatcherywarehouseid:  "sap-icon://decline",
                    defaultoutsidehatcherywarehouseidtype:  "Reject",
                    discountledgerid:  "sap-icon://decline",
                    discountledgeridtype: "Reject",
                    doubleyolkeggscost:  "sap-icon://decline",
                    doubleyolkeggscosttype:  "Reject",
                    eggspredictionperbird:  "sap-icon://decline",
                    eggspredictionperbirdtype: "Reject",
                    feeditemgroupids:  "sap-icon://decline",
                    feeditemgroupidstype:  "Reject",
                    feedledgerid:  "sap-icon://decline",
                    feedledgeridtype:  "Reject",
                    femalestandardweight:  "sap-icon://decline",
                    femalestandardweighttype:  "Reject",
                    freightledgerid:  "sap-icon://decline",
                    freightledgeridtype:  "Reject",
                    grpowithoutinvoiceledgerid:  "sap-icon://decline",
                    grpowithoutinvoiceledgeridtype: "Reject",
                    hatchingeggscost:  "sap-icon://decline",
                    hatchingeggscosttype:  "Reject",
                    hatchingitemgroupids:  "sap-icon://decline",
                    hatchingitemgroupidstype: "Reject",
                    id:  "sap-icon://decline",
                    id:  "Reject",
                    inventorygainandlossledgerid:  "sap-icon://decline",
                    inventorygainandlossledgeridtype: "Reject",
                    labourcharge:  "sap-icon://decline",
                    labourchargetype: "Reject",
                    malepercentage: "sap-icon://decline",
                    malepercentagetype:  "Reject",
                    malestandardweight:  "sap-icon://decline",
                    malestandardweighttype:  "Reject",
                    medicineitemgroupids:  "sap-icon://decline",
                    medicineitemgroupidstype:  "Reject",
                    mortalityledgerid:  "sap-icon://decline",
                    mortalityledgeridtype: "Reject",
                    overheadcost:  "sap-icon://decline",
                    overheadcosttype:  "Reject",
                    shedrestperiod: "sap-icon://decline",
                    shedrestperiodtype:  "Reject",
                    stockledgerid:  "sap-icon://decline",
                    stockledgeridtype: "Reject",
                    vaccineitemgroupids:  "sap-icon://decline",
                    vaccineitemgroupidstype:"Reject",
                    vaccineledgerid:  "sap-icon://decline",
                    vaccineledgeridtype:  "Reject",
                    medicineledgerid:  "sap-icon://decline",
                    medicineledgeridtype: "Reject",
                    vitaminitemgroupids:  "sap-icon://decline",
                    vitaminitemgroupidstype:  "Reject",
                    vitaminledgerid:  "sap-icon://decline",
                    vitaminledgeridtype:  "Reject",
                    wastageeggscost:  "sap-icon://decline",
                    wastageeggscosttype:  "Reject",
                    wastageeggsitemid:  "sap-icon://decline",
                    wastageeggsitemidtype: "Reject"
                 });
            }
				console.log("modulearray",modulearray)
                  var oModel = new sap.ui.model.json.JSONModel();
                  oModel.setData(modulearray[0]);
                  currentContext.getView().setModel(oModel, "BreederModel");
                  console.log("BreederModel", oModel);
                  window.scrollTo(0, document.body.scrollHeight);
			})
        },

        onExit: function () {
            if (this._oDialog) {
                this._oDialog.destroy();
            }
        },
     
    });
}, true);
