sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/ui/Device',
    'sap/ui/elev8rerp/componentcontainer/model/formatter'
], function (BaseController, JSONModel, Device, formatter) {
    "use strict";
    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Profile.Aboutus", {
        formatter: formatter,

        onInit: function () {

            var oViewModel = new JSONModel({
                isPhone : Device.system.phone
            });
            this.setModel(oViewModel, "view");
            Device.media.attachHandler(function (oDevice) {
                this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
            }.bind(this));

            this.getRouter().navTo("home");
            

            this.getView().byId('htmlcontainer').setContent('<section id="ember619" class="mb3 container-with-shadow ember-view"><h4 class="t-18 t-black t-normal mb5">We are "Logically Yours !"&#8203;</h4><p class="white-space-pre-wrap mb5 t-14 t-black--light t-normal block-label"> <div class="block-label">LogicalDNA, the leading SAP Business One partner for niche industries like Poultry, Dairy and Sugar Factory, solves the most difficult task of managing these industries with a simplest of the solution. </div><div class="block-label">&nbsp;</div><div class="block-label"> LogicalDNA has 3 core verticals -</div><div class="block-label">&nbsp;</div><div class="block-label"> 1.	Services - We work as Product development partners and ODC for our reputed clients, you can count on us for, in place and rigorously followed processes and quality of deliverables.  Services verticals has internal units which are technology and business model based. We have expertise into healthcare, logistics and BPM for web based and mobile development.  Core technologies are : Asp.net MVC, SSRS,HANA, Azure, IoT, Laravel, Ionic, Angular and Node </div><div class="block-label">&nbsp;</div><div class="block-label"> 2.	Products –  At a heart we will be always a product company, following is list of products for this we have more than 200 paying customers LogicalTracks (<a href="http://logicaltracks.in/">http://logicaltracks.in/</a> ) – Vehicle and Field for tracking platform which is capable  of building customizable solutions for your vehicle tracking and fields force management. LogicalExpenses (<a href="http://logicalexpenses.in/"> http://logicalexpenses.in/</a> ) – LogicalExpense is a corporate expense tracking platform which can integrate into any third party ERP / SAP solution.  LogicalBMS (<a href="http://logicalbms.com/">http://logicalbms.com/</a> ). – ERP built for Sugar and Trading industry</div><div class="block-label">&nbsp;</div><div class="block-label"> 3.	SAP Business One – LogicalDNA is the only SAP partner across world to have built end to end Poultry solution on SAP platform, our solution is HANA compliant and takes care of entire operations of poultry industry like </div><div class="block-label" style="padding-left:3em"> 1.	Contract farming  </div><div class="block-label" style="padding-left:3em"> 2.	DOC  </div><div class="block-label" style="padding-left:3em">3.	Breeder  </div><div class="block-label" style="padding-left:3em">4.	Layers  </div><div class="block-label" style="padding-left:3em">5.	Hatchery  </div><div class="block-label" style="padding-left:3em">6.	Processing  </div><div class="block-label" style="padding-left:3em">7.	Feed mills  </div><div class="block-label" style="padding-left:3em">8.	Retail (Integrated POS solution )  </div><div class="block-label" style="padding-left:3em">9.	Mobile App for Poultry field force You can get more details of our poultry offering here <a href="http://www.logicaldna.com/logicaldna-offers-sap-add-on-for-poultry-industries/">http://www.logicaldna.com/logicaldna-offers-sap-add-on-for-poultry-industries/ </a> </div></p></section>');
        }

    });
});