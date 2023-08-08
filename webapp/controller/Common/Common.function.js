sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/ui/elev8rerp/componentcontainer/services/Masters/Masters.service',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    "sap/ui/core/format/NumberFormat",
    'sap/ui/model/json/JSONModel',
    'sap/ui/elev8rerp/componentcontainer/services/Company/ManageUser.service'

], function (commonService,masterService, MessageBox, MessageToast, oNumberFormat, JSONModel,ManageUserService) {
    "use strict";

    return {

        session: function (key) {
            var sessionStorage = null;
            var currentSession = MYSAP.SessionManager.getSession('currentSession');

            if (currentSession) {
                sessionStorage = currentSession[key];
            }

            return sessionStorage;
        },

        ensureLoggedIn: function (currentContext) {
            var currentSession = MYSAP.SessionManager.getSession('currentSession');
            if (!currentSession) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(currentContext);
                oRouter.getTargets().display("login", {});
                oRouter.navTo("login", true);
                return false;
            }
            return true;
        },

        // for date from db and current date format
        getDateFromDB: function (dt) {
            var getdate = null;
            jQuery.sap.require("sap.ui.core.format.DateFormat");

            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "dd/MM/yyyy",
                source: {
                    pattern: "yyyy-MM-ddThh:mm:ss"
                }
            });
            getdate = dateFormat.format(new Date(dt));

            return getdate;
        },

        setDateToDB: function (dt) {
            var selecteddate = null;

            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                pattern: "yyyy-MM-dd"
            });

            selecteddate = oDateFormat.format(new Date(dt));

            return selecteddate;
        },

        setTodaysDate: function (dt) {
            var selecteddate = null;

            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                pattern: "dd/MM/YYYY",
                source: {
                    pattern: "yyyy-MM-ddThh:mm:ss SSSZ"
                }
            });

            selecteddate = oDateFormat.format(new Date(dt));

            return selecteddate;
        },

        // input string date in "dd/MM/YYYY" format
        getDate: function (strdate) {
            var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
            var date = new Date(strdate.replace(pattern, '$3-$2-$1'));

            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                pattern: "yyyy-MM-dd"
            });

            date = oDateFormat.format(new Date(date));
            return date;
        },

        getTime: function (strtime) {
            var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
            var time = new Date(strtime.replace(pattern, '$3-$2-$1'));

            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                pattern: "HH:MM:A"
            });

            date = oDateFormat.format(new Date(time));
            return time;
        },


        replaceStr: function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        },

        fillNotificationTemplate: function (currentContext, template, data) {
            var placeholders = currentContext.getView().getModel("notificationPlaceholderModel").oData.modelData;
            console.log("placeholders", placeholders);
            var customValues = [];
            if (placeholders != null) {
                for (var key in placeholders) {
                    var placeholder = placeholders[key];
                    switch (placeholder["valuetype"].toLowerCase()) {

                        case "customvalues":
                            customValues.push(this.replaceStr(placeholder["placeholder"], "#", "") + ": " + data[placeholder["propertyname"]]);
                            break;

                        case "transactionid":
                        case "transactiondate":
                        case "createdby":

                            template = this.replaceStr(template, "##" + placeholder["valuetype"] + "##", this.replaceStr(placeholder["placeholder"], "#", "") + ": " + data[placeholder["propertyname"]]);
                            break;
                    }
                }

                if (customValues.length > 0)
                    template = this.replaceStr(template, "##customvalues##", customValues.join());
            }
            return template;
        },

        filterCreatedFor: function (currentContext, createdForRoles) {

            var createdForUsers = currentContext.getView().getModel("notificationCreatedForModel").oData.modelData;
            // Get UserKeys from Filtered user by notification roles for Push Notification
            var filteredUser = [];
            for (var indx in createdForUsers) {
                var user = createdForUsers[indx];
                for (var indx in createdForRoles) {
                    if (user.rolefullname.toLowerCase().indexOf(createdForRoles[indx].toLowerCase()) !== -1) {
                        filteredUser.push(user);
                    }
                }
            }


            return filteredUser.length > 0 ? filteredUser : null;
        },

        //  get  role by id  for project management screen 
        getUserByRole: function (roleid, currentContext) {
            ManageUserService.getUserByRole({ roleid: roleid }, function (data) {
                var oRoleModel = new sap.ui.model.json.JSONModel();
                oRoleModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oRoleModel, "RoleModel");
                console.log("oRoleModel",oRoleModel);
            });
        },

        sendTransNotification: function (currentContext, transactiontypeid, transaction) {
            var transactionid = transaction.transactionid;

            var oModelTemplate = currentContext.getView().getModel("notificationsTemplateModel");

            if (oModelTemplate != undefined) {

                var notifications = $.grep(oModelTemplate.oData.modelData, function (h) {
                    return h.transactiontypeid == transactiontypeid
                });
                if (notifications && notifications.length > 0) {

                    for (var indx in notifications) {
                        // Current notification object
                        var notification = notifications[indx];
                        // Get Filtered CreatedFor users
                        var filteredUser = this.filterCreatedFor(currentContext, notification.rolenames.split(','));
                        if (filteredUser != null) {

                            // Get Ready data template for notification
                            var template = this.fillNotificationTemplate(currentContext, notification.template, transaction);

                            var notificationUserIds = [];
                            var emailIds = [];
                            var mobileNos = [];
                            var filteredUserKeys = [];
                            var currUser = null;
                            for (var indx in filteredUser) {
                                notificationUserIds.push(filteredUser[indx].id);

                                // Get User keys
                                if (filteredUser[indx].userkey != null && filteredUser[indx].userkey != "" && filteredUser[indx].userkey !== 'null')
                                    filteredUserKeys.push(filteredUser[indx].userkey);

                                // Get Email ids
                                if (filteredUser[indx].email != null && filteredUser[indx].email != "")
                                    emailIds.push(filteredUser[indx].email);

                                // Get Mobile numbers
                                if (filteredUser[indx].mobile != null && filteredUser[indx].mobile != "")
                                    mobileNos.push(filteredUser[indx].mobile);

                                // Get current User Details
                                if (filteredUser[indx].id == commonService.session("userId"))
                                    currUser = filteredUser[indx];
                            }

                            // Send In Application
                            if (notification.inapp) {
                                // If UserKeys exists, (user may exists without Userkeys)
                                if (filteredUserKeys.length > 0)
                                    this.sendInAppNotification(filteredUserKeys, template, notification.pagekey);
                            }

                            // Send Email Notifications
                            if (notification.email) {
                                // If Email Address exists, (user may exists without email)
                                if (emailIds.length > 0) {
                                    var subject = notification.transactionname + " - Notification";
                                    var emailFrom = (currUser) ? currUser.username + " <" + currUser.email + ">" : null;
                                    // Send Email using Node JS call
                                    this.sendEmailNotification(transactiontypeid, transactionid, emailIds.join(), emailFrom, subject, template);
                                }
                            }

                            // Send SMS Notification 
                            if (notification.sms) {
                                // If mobile exists, (user may exists without mobile)
                                if (mobileNos.length > 0) {
                                    // Send SMS using SMSLane service (template must be registered in SMSLane website template)
                                    this.sendSMSNotification(mobileNos, template);
                                }
                            }


                            // Notification History - Data Save
                            var histroydata = {
                                id: null,
                                moduleid: notification.moduleid,
                                transactiontypeid: notification.transactiontypeid,
                                transactionid: transaction.transactionid,
                                content: template,
                                roleids: notification.roleids,
                                inappusers: notificationUserIds.join(),
                                inappviewedusers: null,
                                occurances: 1,
                                inapp: notification.inapp,
                                sms: notification.sms,
                                email: notification.email,
                                statusid: 0,
                                userid: commonService.session("userId"),
                                companyid: commonService.session("companyId"),
                                countrycode: commonService.session("countrycode"),
                                filteredUserKeys: filteredUserKeys
                            };

                            // Notification History - Save Data
                            commonService.saveNotificationHistory(histroydata, function (data) { });

                        }
                    }
                }
            }
        },

        sendInAppNotification: function (createdFor, template, pagekey) {
            var prams = {
                "app_id": "69ddb77d-4aa5-488c-afcb-e1146ab59fe4",
                "contents": { "en": template },
                "headings": { "en": "PoultryOS Notification" },
                "include_player_ids": createdFor
                // "url" : "http://localhost:8080/#/"+ pagekey
            };

            jQuery.post("https://onesignal.com/api/v1/notifications", prams, function (result) {

            });
        },

        sendEmailNotification: function (transactiontypeid, transactionid, emailTo, emailFrom, subject, template) {

            var content = {
                transactiontypeid: transactiontypeid,
                transactionid: transactionid,
                emailFrom: emailFrom, // sender address
                emailTo: emailTo, // list of receivers
                subject: subject, // Subject line
                content: template // plain text body
            }
            commonService.sendEmailNotification(content, function (data) {
            });
        },


        sendSMSNotification: function (mobiles, template) {
            var urlUser = "logicaldna";
            var urlPsd = "horse99";
            var sid = "AALOCH";
            var smsURL = "http://smslane.com/vendorsms/pushsms.aspx";

            // This template must be registered in SMSLane website template with Sender Id (sid);
            //var smsText = "Event ##title## has been updated. Kindly check Aaloch for more details."
            var smsText = template;

            for (var indx in mobiles) {
                var urlMob = mobiles[indx];
                console.log("urlMob", urlMob);
                // var urlMob = "9755088700";

                var params = {
                    user: urlUser,
                    password: urlPsd,
                    sid: sid,
                    msisdn: urlMob,
                    msg: smsText,
                    fl: 0,
                    gwid: 2
                };
                jQuery.post(smsURL, params, function (result) {
                    console.log("result", result);
                });
            }
        },

        // Notification Placeholders
        getNotificationPlaceholders: function (currentContext, transactiontypeid) {
            commonService.getNotificationPlaceholders({ transactiontypeid: transactiontypeid }, function (data) {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, "notificationPlaceholderModel");
            });
        },


        // get New Document Series
        getNewDocSeries: function (doccode, currentContext) {
            commonService.getNewDocSeries({ doccode: doccode }, function (data) {
                if (data != null) {
                    var oLocationModel = new sap.ui.model.json.JSONModel();
                    oLocationModel.setData(data);
                    currentContext.getView().setModel(oLocationModel, "docSeriesModel");
                } else {
                    MessageBox.error("Please set docseries in financial year setting.");
                }

            });
        },

        // get New Document Series
        getNewDocSeriesforParty: function (doccode, roleid, currentContext) {
            commonService.getNewDocSeriesforParty({ doccode: doccode, roleid: roleid }, function (data) {
                if (data != null) {
                    var oLocationModel = new sap.ui.model.json.JSONModel();
                    oLocationModel.setData(data);
                    currentContext.getView().setModel(oLocationModel, "docSeriesModel");
                } else {
                    MessageBox.error("Please set docseries in financial year setting.");
                }

            });
        },

        // get New Voucher type Series
        getNewDocSeriesforVouchertype: function (doccode, vouchertypeid, currentContext) {
            commonService.getNewDocSeriesforVouchertype({ doccode: doccode, vouchertypeid: vouchertypeid }, function (data) {
                if (data != null) {
                    var oLocationModel = new sap.ui.model.json.JSONModel();
                    oLocationModel.setData(data);
                    currentContext.getView().setModel(oLocationModel, "docSeriesModel");
                } else {
                    MessageBox.error("Please set docseries in financial year setting.");
                }

            });
        },

        // get locations for current view
        getLocationList: function (currentContext) {
            commonService.getLocationList(function (data) {
                var oLocationModel = new sap.ui.model.json.JSONModel();
                oLocationModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oLocationModel, "locationList");
            });
        },

        //  get warehouse for current view
        getWarehouseAddress: function (moduleid, currentContext) {
            commonService.getWarehouseAddress({ moduleid: moduleid }, function (data) {
                var oLocationModel = new sap.ui.model.json.JSONModel();
                oLocationModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oLocationModel, "warehouseAddrList");
            });
        },

        //  get warehouse for current view
        getWarehouseList: function (currentContext) {
            commonService.getWarehouseList(function (data) {
                var oLocationModel = new sap.ui.model.json.JSONModel();
                oLocationModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oLocationModel, "warehouseList");
            });
        },

        // get locationwise warehouselist
        getLocationWiseWarehouse: function (locationid, currentContext) {
            commonService.getLocationWiseWarehouse({ locationid: locationid }, function (data) {

                if (data[0].length > 0) {
                    var oLocationModel = new sap.ui.model.json.JSONModel();
                    oLocationModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oLocationModel, "warehouseList");
                } else {
                    MessageBox.error("Warehouse is not available for selected location");
                }
            });
        },

        // get module wise warehouses
        getModuleWiseWarehouses: function (moduleId, currentContext) {
            commonService.getModuleWiseWarehouses({ moduleid: moduleId }, function (data) {
                var oLocationModel = new sap.ui.model.json.JSONModel();
                oLocationModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oLocationModel, "warehouseList");
            });
        },

        //get warehousebin
        getWarehouseBin: function (currentContext) {
            commonService.getWarehouseBin(function (data) {
                var oLocationModel = new sap.ui.model.json.JSONModel();
                oLocationModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oLocationModel, "warehouseBinList");
            });
        },

        //get warehousewise warehousebin
        getWarehousewiseWarehouseBin: function (warehouseid, currentContext) {
            commonService.getAllWarehousewiseWarehouseBin({ warehouseid: warehouseid }, function (data) {
                var oLocationModel = new sap.ui.model.json.JSONModel();
                oLocationModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oLocationModel, "warehouseBinList");
            });
        },

        // //  get country for current view
        // getAllCountries: function (currentContext) {
        //     commonService.getAllCountries( function(data){
        //         var oCountryModel = new sap.ui.model.json.JSONModel();
        //         oCountryModel.setData({modelData : data[0]}); 
        //         currentContext.getView().setModel(oCountryModel,"countryList");
        //     });	
        // },

        getHSNList: function (currentContext) {
            commonService.getHSNList(function (data) {
                var oItemModel = new sap.ui.model.json.JSONModel();
                oItemModel.setData({ modelData: data[0] });
                oItemModel.setSizeLimit(600);
                currentContext.getView().setModel(oItemModel, "itemHSNList");
            });
        },


        // get items
        getItemList: function (currentContext) {
            commonService.getItem(function (data) {
                var oItemModel = new sap.ui.model.json.JSONModel();
                oItemModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oItemModel, "itemList");
            });
        },

        getCategorywiseLedgers: function (categoryid, modelName, currentContext) {
            commonService.getCategorywiseLedgers({ categoryid: categoryid }, function (data) {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data[0] });
                oModel.setSizeLimit(1000);
                currentContext.getView().setModel(oModel, modelName);
            });
        },

        // get ledgers
        getLedgerList: function (currentContext) {
            commonService.getAccountLedgers(function (data) {
                var oLedgerModel = new sap.ui.model.json.JSONModel();
                oLedgerModel.setData({ modelData: data[0] });
                oLedgerModel.setSizeLimit(data[0].length);
                currentContext.getView().setModel(oLedgerModel, "ledgerList");
            });
        },

        // get taxes
        getFinancialYearList: function (currentContext) {
            commonService.getFinancialYearList(function (data) {
                var oLedgerModel = new sap.ui.model.json.JSONModel();
                oLedgerModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oLedgerModel, "financialyearList");
            });
        },


        // get taxes
        getTaxList: function (currentContext) {
            commonService.getTaxList(function (data) {
                var oLedgerModel = new sap.ui.model.json.JSONModel();
                oLedgerModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oLedgerModel, "taxList");
            });
        },

        // get TDS
        getTdsList: function (currentContext) {
            commonService.getAllTds(function (data) {
                var oTModel = new sap.ui.model.json.JSONModel();
                oTModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oTModel, "tdsList");
            });
        },


        // get single taxes
        getSingleTaxList: function (currentContext) {
            commonService.getSingleTaxList(function (data) {
                var oLedgerModel = new sap.ui.model.json.JSONModel();
                oLedgerModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oLedgerModel, "singletaxList");
            });
        },

        // get Freight
        getFreightList: function (currentContext) {
            commonService.getFreightList(function (data) {
                var oLedgerModel = new sap.ui.model.json.JSONModel();
                oLedgerModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oLedgerModel, "freightList");
            });
        },

        // get employee list by typeid
        getEmployeeList: function (typeid, currentContext) {
            commonService.getEmployeeList({ typeid: typeid }, function (data) {
                var oLedgerModel = new sap.ui.model.json.JSONModel();
                oLedgerModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oLedgerModel, "employeeList");
            });
        },

        // get rolewise employee list
        getEmployeeByRole: function (roleids, currentContext) {
            commonService.getEmployeeByRole({ roleids: roleids }, function (data) {
                var eModel = new sap.ui.model.json.JSONModel();
                eModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(eModel, "roleEmployeeList");
            });
        },

        //get available sheds
        getAvailableSheds: function (currentContext, statusid, locationid) {
            var sModel = {
                "statusid": statusid,
                "locationid": locationid
            }
            commonService.getAvailableSheds(sModel, function (data) {
                var oShedModel = new sap.ui.model.json.JSONModel();
                oShedModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oShedModel, "availableSheds");
            });
        },

        getAvailableHatchers: function (currentContext, locationid) {
            var sModel = {
                "locationid": locationid
            }
            commonService.getAvailableHatchers(sModel, function (data) {
                var oHatcherModel = new sap.ui.model.json.JSONModel();
                oHatcherModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oHatcherModel, "hatcherModel");
            });
        },

        //get User as supervisor
        getUser: function (currentContext, roleid) {

            commonService.getUser(roleid, function (data) {
                var oUserModel = new sap.ui.model.json.JSONModel();
                oUserModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oUserModel, "userModel");
            });
        },

        // get reference types
        getReference: function (typeCode, modelName, currentContext) {

            commonService.getReferenceByTypeCode({ typecode: typeCode }, function (data) {
                var selectModel = new sap.ui.model.json.JSONModel();
                selectModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(selectModel, modelName);
            });
        },

        getReferenceWithAll: function (typeCode, modelName, currentContext) {

            commonService.getReferenceByTypeCode({ typecode: typeCode }, function (data) {
                var selectModel = new sap.ui.model.json.JSONModel();
                selectModel.setData({modelData: [{id:"All",description:"Select All"},...data[0]]});
                currentContext.getView().setModel(selectModel, modelName);
            });
        },

         // get reference types
         getReferenceByType: function (typeCode,modelName, currentContext) {
            masterService.getReferenceByTypeCode({ typecode: typeCode }, function (data) {
                console.log("------------datypecodeta---------------",data);
                if(data.length && data[0].length){
                    var selectModel = new sap.ui.model.json.JSONModel();
                    selectModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(selectModel, modelName);
                }
            });
        },

        getReferenceStages : function(typeCode,modelName, currentContext) {
            masterService.getReferenceByTypeCode({ typecode: typeCode }, function (data) {
                if(data.length && data[0].length){
                    for(let i = 0; i < data[0].length; i++){
                        if(data[0][i].parentid == null){
                            var selectModel = new sap.ui.model.json.JSONModel();
                            selectModel.setData({ modelData: data[0] });
                            currentContext.getView().setModel(selectModel, modelName);
                        }
                    }
                }
            });
        },

        getReferenceStagesbyDepartment : function(typeCode,departmentid,modelName, currentContext) {
            masterService.getReferenceByTypeCodeDepartment({ typecode: typeCode,departmentid:departmentid}, function (data) {
                if(data.length && data[0].length){
                    for(let i = 0; i < data[0].length; i++){
                        if(data[0][i].parentid == null){
                            var selectModel = new sap.ui.model.json.JSONModel();
                            selectModel.setData({ modelData: data[0] });
                            currentContext.getView().setModel(selectModel, modelName);
                        }
                    }
                }
            });
        },

        getAllDepartments : function(modelName, currentContext) {
            masterService.getAllDepartments(function (data) {
                if(data.length && data[0].length){
                    var selectModel = new sap.ui.model.json.JSONModel();
                    selectModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(selectModel, modelName);
                }
            });
        },

          // get reference types
          getReferenceByTypeForFilter: function (typeCode,modelName, currentContext) {
            masterService.getReferenceByTypeCode({ typecode: typeCode }, function (data) {
                console.log("------------datypecodeta---------------",data);
                if(data.length && data[0].length){
                    data[0].unshift({ "id": "All", "description": "All" });
                    // if (data[0].length > 0) {
                    //     data[0].unshift({ "id": "All", "branchname": "Select All" });
                    // } else {
                    //     MessageBox.error("branch not availabel.")
                    // }

                    var selectModel = new sap.ui.model.json.JSONModel();
                    selectModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(selectModel, modelName);
                }
            });
        },

        getReferenceFilter: function (typeCode, condition, modelName, currentContext) {
            commonService.getReference({ typecode: typeCode }, function (data) {
                var selectModel = new sap.ui.model.json.JSONModel();
                var fdata = [];
                for (var i = 0; i < data[0].length; i++) {
                    if (condition.indexOf(data[0][i].id.toString()) != -1) {
                        fdata.push(data[0][i]);
                    }
                }
                console.log(fdata)
                selectModel.setData({ modelData: fdata });
                currentContext.getView().setModel(selectModel, modelName);
            });
        },

        getAllLeads : function(modelName, currentContext){
            var leadModel = new sap.ui.model.json.JSONModel();
            commonService.getAllLeads(function(data){
                if(data.length && data[0].length){
                    leadModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(leadModel, modelName);
                }else{
                    leadModel.setData({ modelData: [] });
                    currentContext.getView().setModel(leadModel, modelName);
                }
            })
        },

        getAllContacts : function(modelName, currentContext){
            var leadModel = new sap.ui.model.json.JSONModel();
            commonService.getAllContacts(function(data){
                if(data.length && data[0].length){
                    leadModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(leadModel, modelName);
                }else{
                    leadModel.setData({ modelData: [] });
                    currentContext.getView().setModel(leadModel, modelName);
                }
            })
        },

        //get all lines
        getAllLine: function (branchid, currentContext) {
            commonService.getAllLine({ branchid: branchid }, function (data) {
                if (data[0].length) {
                    var oLineModel = new sap.ui.model.json.JSONModel();
                    oLineModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oLineModel, "lineList");
                }
            });
        },

        getBranchWiseLine: function (branchid, currentContext) {
            commonService.getAllCommonBranchLine({ branchid: branchid }, function (data) {
                if (data[0].length) {
                    var oLineModel = new sap.ui.model.json.JSONModel();
                    oLineModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oLineModel, "lineList");
                }
            });
        },

        getBranchWiseCBFLine: function (branchid, currentContext) {
            commonService.getAllCBFLine({ branchid: branchid }, function (data) {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, "lineList");
            });
        },

        //get waret parameter
        getAllWaterParameter: function (currentContext) {
            commonService.getAllWaterParameter(function (data) {
                var wModel = new sap.ui.model.json.JSONModel();
                wModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(wModel, "waterParameterList");
            });
        },

        // get CBF batches by status id

        getCbfBatchesByStatus: function (statusid, currentContext) {
            commonService.getCbfBatchesByStatus({ statusid: statusid }, function (data) {
                var bModel = new sap.ui.model.json.JSONModel();
                bModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(bModel, "cbfBatchList");
            })
        },

        //get water facility
        getAllWaterFacility: function (currentContext) {
            commonService.getAllWaterFacility(function (data) {
                var wFModel = new sap.ui.model.json.JSONModel();
                wFModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(wFModel, "waterFacilityList");
            });
        },

        // get breeder batch phases
        getBreederBatchPhases: function (currentContext, modelName) {
            commonService.getBreederBatchPhases(function (data) {
                var phaseModel = new sap.ui.model.json.JSONModel();
                phaseModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(phaseModel, modelName);
            });
        },

        // get layer batch phases
        getLayerBatchPhases: function (currentContext, modelName) {
            commonService.getLayerBatchPhases(function (data) {
                var phaseModel = new sap.ui.model.json.JSONModel();
                phaseModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(phaseModel, modelName);
            });
        },

        // function to bind location dropdown
        getLocations: function (currentContext, moduleids) {
            commonService.getLocations({ moduleids: moduleids }, function (data) {
                var oLocationModel = new sap.ui.model.json.JSONModel();
                oLocationModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oLocationModel, "locationList");
            });
        },

        // function to bind warehouse dropdown        
        getWarehouses: function (currentContext) {
            commonService.getWarehouse(function (data) {
                var oLocationModel = new sap.ui.model.json.JSONModel();
                oLocationModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oLocationModel, "warehouseModel");
            });
        },

        // get all breeder batches
        getAllBreederBatches: function (currentContext) {
            commonService.getBreederBatches(function (data) {
                var oBatchModel = new sap.ui.model.json.JSONModel();
                oBatchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oBatchModel, "breederBatchList");
            });
        },

        // get module wise locations
        getModuleWiseLocations: function (moduleids) {
            commonService.getLocations({ moduleids: moduleids }, function (data) {
                if (data.length && data[0].length) {
                    return data[0];
                } else {
                    MessageBox.error("No location found!");
                }
            });
        },

        //get Modulewise batches
        getModuleWiseBatches: function (moduleid) {
            commonService.getModuleWiseStartedBatches({ moduleid: moduleid }, function (data) {
                if (data.length && data[0].length) {
                    return data[0];
                } else {
                    MessageBox.error("No batch found!");
                }
            })
        },

        formatNumberToShort: function () {

            return oNumberFormat.getFloatInstance({
                maxFractionDigits: 2,
                // groupingEnabled: true,
                // groupingSeparator: ",",
                style: "short",
                decimalSeparator: "."
            });

        },

        // Fun for PDF

        getHtmlTemplate: function (modulename, filename, callback) {

            var request = new XMLHttpRequest();
            request.open('GET', "./htmltemplate/" + modulename + "/" + filename, true);
            request.responseType = 'text';
            request.onload = function () {

                var strhtml = request.response.toString();
                var fn = eval(callback);
                fn(strhtml);
            };
            request.send();
        },

        generatePDF: function (template, pdfname) {
            setTimeout(function () {
                var iframe = document.createElement('iframe');
                jQuery('body').append(jQuery(iframe));

                var iframedoc = iframe.contentDocument || iframe.contentWindow.document;
                jQuery('body', jQuery(iframedoc)).html(template);
                html2canvas(iframedoc.body, {
                    width: 778,
                    onrendered: function (canvas) {
                        var doc = new jsPDF('p', 'pt', 'a4');
                        for (var i = 0; i <= iframe.contentWindow.document.body.scrollHeight / 778; i++) {

                            var srcImg = canvas;
                            var sX = 0;
                            var sY = 980 * i; // start 980 pixels down for every new page
                            var sWidth = 778;
                            var sHeight = 1120;
                            var dX = 0;
                            var dY = 0;
                            var dWidth = 778;
                            var dHeight = 1110;



                            window.onePageCanvas = document.createElement("canvas");

                            onePageCanvas.setAttribute('width', 778);
                            onePageCanvas.setAttribute('height', 1140);
                            var ctx = onePageCanvas.getContext('2d');
                            ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
                            var imgData = onePageCanvas.toDataURL("image/png", 1.0);

                            var width = onePageCanvas.innerwidth;
                            var height = onePageCanvas.innerHeight;



                            // doc.addImage(imgData, 'PNG', 10, 10);
                            // doc.addPage(); 

                            if (i > 0) {
                                doc.addPage(595, 842); //8.5" x 11" in pts (in*72)

                            }
                            //! now we declare that we're working on that page
                            doc.setPage(i + 1);
                            //  doc.line(20, 20, 60, 20)
                            doc.rect(10, 10, 575, 824)
                            //! now we add content to that page!
                            doc.addImage(imgData, 'PNG', 10, 20, (width * .72), (height * .71));

                        }
                        doc.save(pdfname + '.pdf');
                        jQuery("iframe").hide();
                    }

                });
                //jQuery("iframe").hide();
            }, 10);

        },

        generateLargePDF: function (template, pdfname) {
            setTimeout(function () {
                var iframe = document.createElement('iframe');
                jQuery('body').append(jQuery(iframe));

                var iframedoc = iframe.contentDocument || iframe.contentWindow.document;
                jQuery('body', jQuery(iframedoc)).html(template);


                html2canvas(iframedoc.body, {
                    width: 2000,
                    onrendered: function (canvas) {
                        // var doc = new jsPDF ( unit: 'pt', format: 'a4', orientation: 'portrait' )
                        var doc = new jsPDF('l', 'mm', 'landscape');


                        for (var i = 0; i <= iframe.contentWindow.document.body.scrollHeight / 1000; i++) {

                            var srcImg = canvas;
                            var sX = 0;
                            var sY = 1130 * i; // start 980 pixels down for every new page
                            var sWidth = 2500;
                            var sHeight = 2000;
                            var dX = 0;
                            var dY = 0;
                            var dWidth = 2500;
                            var dHeight = 2000;



                            window.onePageCanvas = document.createElement("canvas");
                            onePageCanvas.setAttribute('width', 1600);
                            onePageCanvas.setAttribute('height', 1110);
                            var ctx = onePageCanvas.getContext('2d');
                            ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
                            var imgData = onePageCanvas.toDataURL("image/png", 1.0);

                            var width = onePageCanvas.innerwidth;
                            var height = onePageCanvas.innerHeight;



                            // doc.addImage(imgData, 'PNG', 10, 10);
                            // doc.addPage(); 

                            if (i > 0) {
                                doc.addPage(595, 842); //8.5" x 11" in pts (in*72)

                            }
                            //! now we declare that we're working on that page
                            doc.setPage(i + 1);
                            //  doc.line(20, 20, 60, 20)
                            doc.rect(4, 4, 290, 200)
                            //! now we add content to that page!
                            doc.addImage(imgData, 'PNG', 4, 10, (width * .400), (height * .400));

                        }
                        doc.save(pdfname + '.pdf');
                        jQuery("iframe").hide();
                    }

                });
                //jQuery("iframe").hide();
            }, 10);

        },

        //get all hatchers
        getAllHatcher: function (currentContext) {
            commonService.getHatchers(function (data) {
                var oHatcherModel = new sap.ui.model.json.JSONModel();
                oHatcherModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oHatcherModel, "hatcherModel");
            });
        },

        //get vendor according to partner role purcahseorder 
        getAllVendor: function (currentContext, partnerroleid) {
            commonService.getRolewiseParties({ roleid: partnerroleid }, function (data) {
                if (data[0].length) {
                    var rolewisePartyListModel = new sap.ui.model.json.JSONModel();
                    rolewisePartyListModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(rolewisePartyListModel, "vendorModel");
                } else {
                    MessageBox.error("Vendor is not available");
                }
            });
        },

        //get party address
        getPartyAddress: function (partyid, addresstypeid, modelName, currentContext) {
            commonService.getPartyAddress({ partyid: partyid, addresstypeid: addresstypeid }, function (data) {
                var rolewisePartyListModel = new sap.ui.model.json.JSONModel();
                rolewisePartyListModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(rolewisePartyListModel, modelName);
            });
        },

        //get All parties
        getAllParties: function (currentContext) {
            commonService.getAllParties(function (data) {
                var partyListModel = new sap.ui.model.json.JSONModel();
                partyListModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(partyListModel, "partyModel");
            });
        },

        //get All bank
        getAllBank: function (currentContext) {
            commonService.getAllBank(function (data) {
                var bankList = new sap.ui.model.json.JSONModel();
                bankList.setData({ modelData: data[0] });
                bankList.setSizeLimit(data[0].length);
                currentContext.getView().setModel(bankList, "bankModel");
            });
        },

        //get All branch
        getAllBranch: function (currentContext) {
            commonService.getAllBranch(function (data) {
                var branchList = new sap.ui.model.json.JSONModel();
                branchList.setData({ modelData: data[0] });
                currentContext.getView().setModel(branchList, "branchModel");
            });
        },

        //get all common branch
        getAllCommonBranch: function (currentContext) {
            commonService.getAllCommonBranch(function (data) {
                var branchList = new sap.ui.model.json.JSONModel();
                branchList.setData({ modelData: data[0] });
                currentContext.getView().setModel(branchList, "branchModel");
            });
        },

        //get All dimensions
        getAllDimensions: function (currentContext) {
            commonService.getAllDimensions(function (data) {
                var dimensionModel = new sap.ui.model.json.JSONModel();
                dimensionModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(dimensionModel, "dimensionModel");
            });
        },

        //get All branch
        getAllCostCenters: function (currentContext) {
            commonService.getAllCostCenters(function (data) {
                var costcenterModel = new sap.ui.model.json.JSONModel();
                var activeCostCenters = [];
                for (var i = 0; i < data[0].length; i++) {
                    if (data[0][i].isactive == 1) {
                        activeCostCenters.push(data[0][i]);
                    }
                }
                costcenterModel.setData({ modelData: activeCostCenters });
                currentContext.getView().setModel(costcenterModel, "costcenterModel");
            });
        },

        //get modulewise started batches
        getModuleWiseStartedBatches: function (moduleid, currentContext) {
            commonService.getModuleWiseStartedBatches({ moduleid: moduleid }, function (data) {
                var batchModel = new sap.ui.model.json.JSONModel();
                batchModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(batchModel, "batchModel");
            });
        },

        // get dimensionwise costcenters
        getDimensionwiseCostCenter: function (dimensionid, currentContext) {
            commonService.getDimensionwiseCostCenter({ dimensionid: dimensionid }, function (data) {
                var costcenterModel = new sap.ui.model.json.JSONModel();
                costcenterModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(costcenterModel, "costcenterModel");
            })
        },

        //get rolewise parties
        getRolewiseParties: function (roleid, currentContext) {
            commonService.getRolewiseParties({ roleid: roleid }, function (data) {
                var rolewisePartyListModel = new sap.ui.model.json.JSONModel();
                rolewisePartyListModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(rolewisePartyListModel, "partyModel");
            });
        },

        //get ledgers with no control account
        getLedgersWithNoControlAccount: function (currentContext) {
            commonService.getLedgersWithNoControlAccount(function (data) {
                var ledgerList = new sap.ui.model.json.JSONModel();
                ledgerList.setData({ modelData: data[0] });
                ledgerList.setSizeLimit(data[0].length);
                currentContext.getView().setModel(ledgerList, "ledgerList");
            });
        },

        //get cash ledgers
        getAllCashLedgers: function (currentContext) {
            commonService.getAllCashLedgers(function (data) {
                var cashledgerList = new sap.ui.model.json.JSONModel();
                cashledgerList.setData({ modelData: data[0] });
                cashledgerList.setSizeLimit(data[0].length);
                currentContext.getView().setModel(cashledgerList, "ledgerList");
            });
        },

        //get all ledgers
        getAllLedgers: function (currentContext) {
            commonService.getAllLedgers(function (data) {
                var ledgerList = new sap.ui.model.json.JSONModel();
                ledgerList.setData({ modelData: data[0] });
                ledgerList.setSizeLimit(500);
                currentContext.getView().setModel(ledgerList, "ledgerList");
            });
        },

        // get material requests
        getMaterialRequestList: function (currentContext) {
            commonService.getAllMaterialRequests(function (data) {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, "materialRequestList");
            });
        },

        //get purchae request  according to status 
        getpurchaserequestbystatus: function (currentContext, statusid, moduleid) {
            commonService.getpurchaserequestbystatus({ statusid: statusid, moduleid: moduleid }, function (data) {
                var oBatchModel = new sap.ui.model.json.JSONModel();
                if (data[0].length) {
                    oBatchModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oBatchModel, "purrequestModel");
                } else {
                    oBatchModel.setData({ modelData: [] });
                    currentContext.getView().setModel(oBatchModel, "purrequestModel");
                }
            });
        },

        // get all partner
        getAllPartner: function (currentContext) {
            commonService.getAllPartner(function (data) {
                var partnerModel = new sap.ui.model.json.JSONModel();
                if (data[0].length) {
                    partnerModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(partnerModel, "partnerModel");
                } else {
                    partnerModel.setData({ modelData: [] });
                    currentContext.getView().setModel(partnerModel, "partnerModel");
                }
            });
        },

        getItemGroups: function (currentContext, modelName) {
            commonService.getItemGroups(function (data) {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, modelName);
            });
        },

        getItemAndWarehousewiseInstock: function (itemid, warehouseid, transactiondate) {
            commonService.getItemAndWarehousewiseInstock({ itemid: itemid, warehouseid: warehouseid, transactiondate: transactiondate }, function (data) {
                if (data.length && data[0].length) {
                    if (data[0][0].instock != null && data[0][0].instock > 0) {
                        return data[0][0].instock;
                    } else {
                        return "0";
                    }
                } else {
                    MessageBox.error("No item available.")
                }
            });
        },

        getItemsLiveStockByWHid: function (itemgroupid, warehouseid, warehousebinid, currentContext, modelName) {

            commonService.getItemsLiveStockByWHid({ itemgroupid: itemgroupid, warehouseid: warehouseid, warehousebinid: warehousebinid }, function (data) {
                if (data.length && data[0].length) {
                    var oModel = new sap.ui.model.json.JSONModel();
                    var itemArr = [];
                    for (let i = 0; i < data[0].length; i++) {
                        if (data[0][i].stockquantity != null && data[0][i].stockquantity > 0) {
                            itemArr.push(data[0][i]);
                        }
                    }
                    oModel.setData({ modelData: itemArr });
                    currentContext.getView().setModel(oModel, modelName);
                } else {
                    MessageBox.error("No item available.")
                }
            });
        },

        getItemsByItemGroups: function (ItemGroupIds, currentContext, modelName) {

            commonService.getItemsByItemGroups({ itemgroupid: ItemGroupIds }, function (data) {
                console.log(data);
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, modelName);
            });
        },

        getItemsBytaxcategoryid: function (ItemGroupIds, taxcategoryid, currentContext, modelName) {

            commonService.getItemsBytaxcategory({ itemgroupid: ItemGroupIds, taxcategoryid: taxcategoryid }, function (data) {

                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, modelName);
            });
        },

        getItemsByInvoiceType: function (itemgroupid, invoicetypeid, currentContext, modelName) {


            commonService.getItemsByInvoiceType({ itemgroupid: itemgroupid, invoicetypeid: invoicetypeid }, function (data) {

                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, modelName);
            });
        },

        getBreederTypeByItemGroups: function (ItemGroupIds, currentContext, modelName) {

            commonService.getItemsByItemGroups({ itemgroupid: ItemGroupIds }, function (data) {

                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, modelName);
            });
        },
        getLayerItemsByItemGroups: function (ItemGroupIds, currentContext, modelName) {
            commonService.getItemsByItemGroups({ itemgroupid: ItemGroupIds }, function (data) {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, modelName);
            });
        },


        getItemByMaterailType: function (materialtypeid, CurrentContext, ModelName) {

            commonService.getItemByMaterailType({ materialtypeid: materialtypeid }, function (data) {

                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data[0] });
                CurrentContext.getView().setModel(oModel, ModelName);
            });
        },

        getBranchList: function (CurrentContext) {
            commonService.getBranchList(function (data) {

                for (var i = 0; i < data[0].length; i++) {

                    data[0][i].isactive = data[0][i].isactive == 1 ? true : false;

                }
                var model = new sap.ui.model.json.JSONModel();
                model.setData({ modelData: data[0] });
                CurrentContext.getView().setModel(model, "branchList");
            });
        },
        getPartyModulewise: function (model, currentContext, modelName) {
            commonService.getPartyModulewise(model, function (data) {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, modelName);
            });
        },


        getAccountLedgerList: function (CurrentContext) {
            commonService.getAccountLedgerList(function (data) {
                var model = new sap.ui.model.json.JSONModel();
                model.setData({ modelData: data[0] });
                model.setSizeLimit(data[0].length);
                CurrentContext.getView().setModel(model, "ledgerList");
            });
        },

        // get layer batch phase
        gatAllLayerBatchPhase: function (CurrentContext) {
            commonService.getAllLayerPhases(function (data) {
                var model = new sap.ui.model.json.JSONModel();
                model.setData({ modelData: data[0] });
                CurrentContext.getView().setModel(model, "layerbatchPhaseModel");
            });
        },

        getAllLayerBatches: function (currentContext) {
            commonService.getAllBatches(function (data) {
                if (data[0].length > 0) {
                    var oBatchModel = new sap.ui.model.json.JSONModel();
                    oBatchModel.setData({ modelData: data[0] });
                    currentContext.getView().setModel(oBatchModel, "layerbatchModel");
                }
            });
        },

        //itemgroup by grouptype
        getItemGroupsByGroupType: function (currentContext, modelName, grouptype) {
            commonService.getItemGroups(function (data) {
                var serviceArray = [];
                var oModel = new sap.ui.model.json.JSONModel();
                for (var i = 0; data[0].length > i; i++) {
                    if (data[0][i].grouptypeid == grouptype) {
                        serviceArray.push(data[0][i])
                    }
                    oModel.setData({ modelData: serviceArray });
                    currentContext.getView().setModel(oModel, modelName);
                }
            });
        },

        //get module wise itemgroup

        getItemGroupModuleWise: function (moduleid, currentContext, modelName) {
            commonService.getItemGroupModuleWise({ moduleid: moduleid }, function (data) {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({ modelData: data[0] });
                currentContext.getView().setModel(oModel, modelName);
            });
        },

        // Get current financial year
        setCurrentFinancialYear: function () {

            var date = new Date();

            if ((date.getMonth() + 1) <= 3) {
                var firstDay = new Date(date.getFullYear() - 1, 3, 1);
                var lastDay = new Date(date.getFullYear(), 3, 0);
            } else {
                var firstDay = new Date(date.getFullYear(), 3, 1);
                var lastDay = new Date(date.getFullYear() + 1, 3, 0);
            }

            var firstDayDD = firstDay.getDate();
            var firstDayMM = firstDay.getMonth() + 1;
            var firstDayYYYY = firstDay.getFullYear();

            if (firstDayDD < 10) {
                firstDayDD = '0' + firstDayDD;
            }

            if (firstDayMM < 10) {
                firstDayMM = '0' + firstDayMM;
            }

            var lastDayDD = lastDay.getDate();
            var lastDayMM = lastDay.getMonth() + 1;
            var lastDayYYYY = lastDay.getFullYear();

            if (lastDayDD < 10) {
                lastDayDD = '0' + lastDayDD;
            }

            if (lastDayMM < 10) {
                lastDayMM = '0' + lastDayMM;
            }

            let dateArr = [];
            dateArr.push({
                fromDate: (firstDayYYYY + '-' + firstDayMM + '-' + firstDayDD),
                toDate: (lastDayYYYY + '-' + lastDayMM + '-' + lastDayDD)
            });

            return dateArr;

        },

        isIMEI: function (s) {
            var etal = /^[0-9]{15}$/;
            if (!etal.test(s))
                return false;
            var sum = 0, mul = 2, l = 14;
            for (var i = 0; i < l; i++) {
                var digit = s.substring(l - i - 1, l - i);
                var tp = parseInt(digit, 10) * mul;
                if (tp >= 10)
                    sum += (tp % 10) + 1;
                else
                    sum += tp;
                if (mul == 1)
                    mul++;
                else
                    mul--;
            }
            var chk = ((10 - (sum % 10)) % 10);
            if (chk != parseInt(s.substring(14, 15), 10))
                return false;
            return true;
        },

        // functions for validation
        isIMEI: function (currentContext, inputId, errorMessage) {
            var ctrl = currentContext.getView().byId(inputId);
            ctrl.setValueState(sap.ui.core.ValueState.None);

            var s = ctrl.getValue();

            var etal = /^[0-9]{15}$/;
            if (!etal.test(s)) {
                ctrl.setValueState(sap.ui.core.ValueState.Error)
                    .setValueStateText(errorMessage);
                return false;
            }
            var sum = 0, mul = 2, l = 14;
            for (var i = 0; i < l; i++) {
                var digit = s.substring(l - i - 1, l - i);
                var tp = parseInt(digit, 10) * mul;
                if (tp >= 10)
                    sum += (tp % 10) + 1;
                else
                    sum += tp;
                if (mul == 1)
                    mul++;
                else
                    mul--;
            }
            var chk = ((10 - (sum % 10)) % 10);
            if (chk != parseInt(s.substring(14, 15), 10)) {

                ctrl.setValueState(sap.ui.core.ValueState.Error)
                    .setValueStateText(errorMessage);
                return false;
            }
            return true;
        },

        // functions for validation
        matchPassword: function (currentContext, inputId, confInputId, errorMessage) {
            var ctrl = currentContext.getView().byId(inputId);
            var confCtrl = currentContext.getView().byId(confInputId);

            ctrl.setValueState(sap.ui.core.ValueState.None);
            confCtrl.setValueState(sap.ui.core.ValueState.None);

            if (ctrl.getValue() != "") {
                if (ctrl.getValue() != confCtrl.getValue()) {
                    ctrl.setValueState(sap.ui.core.ValueState.Error)
                        .setValueStateText(errorMessage);
                    return false;
                }
            }
            return true;
        },

        // functions for validation
        isRequired: function (currentContext, inputId, errorMessage) {
            var ctrl = currentContext.getView().byId(inputId);
            ctrl.setValueState(sap.ui.core.ValueState.None);

            if (ctrl.getValue() == "") {
                ctrl.setValueState(sap.ui.core.ValueState.Error)
                    .setValueStateText(errorMessage);
                return false;
            }
            return true;
        },

        // functions for validation
        isRequiredDdl: function (currentContext, inputId, errorMessage) {
            var ctrl = currentContext.getView().byId(inputId);
            ctrl.setValueState(sap.ui.core.ValueState.None);

            if (ctrl.getSelectedKey() == "") {
                ctrl.setValueState(sap.ui.core.ValueState.Error)
                    .setValueStateText(errorMessage);
                return false;
            }
            return true;
        },
        ismultiComRequired: function (currentContext, inputId, errorMessage) {
            var ctrl = currentContext.getView().byId(inputId);
            ctrl.setValueState(sap.ui.core.ValueState.None);

            if (ctrl.getSelectedKeys() == "") {
                ctrl.setValueState(sap.ui.core.ValueState.Error)
                    .setValueStateText(errorMessage);
                return false;
            }
            return true;
        },

        isSelectRequired: function (currentContext, inputId, errorMessage) {
            var ctrl = currentContext.getView().byId(inputId);
            ctrl.setValueState(sap.ui.core.ValueState.None);

            if (ctrl.getSelectedKey() == "") {
                ctrl.setValueState(sap.ui.core.ValueState.Error)
                    .setValueStateText(errorMessage);
                return false;
            }
            return true;
        },

        isSelectRequired1: function (currentContext, inputId) {


            var ctrl = currentContext.getView().getModel(inputId);
            console.log(ctrl.oData.modelData[0]);
            var model = ctrl.oData.modelData[0];

            if (model == undefined) {
                MessageBox.warning("Fill entire info. in layer detail tab");
                return false;
            }
            else {
                if (model.itemname.length > 0 && parseInt(model.liveqty) > 0 && parseInt(model.placeqty) > 0) {
                    return true;
                }
            }

        },


        isSelectRequired2: function (currentContext, inputId) {


            var ctrl = currentContext.getView().getModel(inputId);
            console.log(ctrl.oData.modelData[0]);
            var model = ctrl.oData.modelData[0];

            if (model == undefined) {
                MessageBox.warning("Fill entire info. in Consumption detail tab");
                return false;
            }
            else {
                if (model.itemname.length > 0 && model.quantity > 0 && model.rate > 0) {
                    return true;
                }
            }


        },


        isSelectRequired3: function (currentContext, inputId) {


            var ctrl = currentContext.getView().getModel(inputId);
            console.log(ctrl.oData.modelData[0]);
            var model = ctrl.oData.modelData[0];

            if (model == undefined) {
                MessageBox.warning("Fill entire info. in Location detail tab");
                return false;
            }
            else {
                if (model.itemname.length > 0 && parseInt(model.balanceqty) > 0) {
                    return true;
                }
            }


        },

        isSelectRequired4: function (currentContext, inputId) {


            var ctrl = currentContext.getView().getModel(inputId);
            console.log(ctrl.oData.modelData[0]);
            var model = ctrl.oData.modelData[0];

            if (model == undefined) {
                MessageBox.warning("Fill entire info. in Financial detail tab");
                return false;
            }
            else {
                if (parseInt(model.birdvalue) > 0 && parseInt(model.birdliveqty) > 0) {
                    return true;
                }
            }


        },

        isEmail: function (currentContext, inputId) {
            var ctrl = currentContext.getView().byId(inputId);

            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(ctrl.getValue())) {
                ctrl.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter Valid Email Id.");
                return false;
            }
            else {
                ctrl.setValueState(sap.ui.core.ValueState.None);
                return true;
            }

        },

        isNumber: function (currentContext, inputId) {
            var ctrl = currentContext.getView().byId(inputId);
            ctrl.setValueState(sap.ui.core.ValueState.None);

            var re = /^\d+$/;

            if (!re.test(ctrl.getValue())) {
                ctrl.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid number.");

                return false;
            }

            return true;
        },

        isNumbermessage: function (currentContext, inputId,message) {
            var ctrl = currentContext.getView().byId(inputId);
            ctrl.setValueState(sap.ui.core.ValueState.None);

            var re = /^\d+$/;

            if (!re.test(ctrl.getValue())) {
                ctrl.setValueState(sap.ui.core.ValueState.Error).setValueStateText(message);

                return false;
            }

            return true;
        },

        isNumberWithMessage: function (currentContext, inputId,message,length) {
            var ctrl = currentContext.getView().byId(inputId);
            ctrl.setValueState(sap.ui.core.ValueState.None);

            var re = /^\d+$/;

            if (re.test(ctrl.getValue())&&((ctrl.getValue()).length==length)) {
                ctrl.setValueState(sap.ui.core.ValueState.None);
                return true;
            }
            else{
                ctrl.setValueState(sap.ui.core.ValueState.Error).setValueStateText(message);
                return false;
            }

          },


        isNumberGreaterThanZero: function (currentContext, inputId) {
            var ctrl = currentContext.getView().byId(inputId);
            ctrl.setValueState(sap.ui.core.ValueState.None);

            // accept any number greater than 0
            var re = /^[1-9][0-9]*$/;

            if (!re.test(ctrl.getValue())) {
                ctrl.setValueState(sap.ui.core.ValueState.Error)
                    .setValueStateText("Enter valid number greater than 0.");

                return false;
            }

            return true;
        },

        isDecimal: function (currentContext, inputId) {
            var ctrl = currentContext.getView().byId(inputId);


            var re = /^\d+(\.\d{1,3})?$/;
            if (!re.test(ctrl.getValue())) {
                ctrl.setValueState(sap.ui.core.ValueState.Error)
                    .setValueStateText("Value allows either integer or decimal upto 3 digits.");

                return false;
            }
            else {
                currentContext.getView().byId(inputId).setValueState(sap.ui.core.ValueState.None);
            }

            return true;
        },

        isPercentage: function (currentContext, inputId) {
            var ctrl = currentContext.getView().byId(inputId);

            var re = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;

            if (!re.test(ctrl.getValue())) {
                ctrl.setValueState(sap.ui.core.ValueState.Error)
                    .setValueStateText("Please enter correct value.");

                return false;
            }
            else {
                currentContext.getView().byId(inputId).setValueState(sap.ui.core.ValueState.None);
            }

            return true;
        },

        isDate: function (currentContext, inputId) {
            var ctrl = currentContext.getView().byId(inputId);
            ctrl.setValueState(sap.ui.core.ValueState.None);

            var re = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
            if (!re.test(ctrl.getValue())) {
                ctrl.setValueState(sap.ui.core.ValueState.Error)
                    .setValueStateText("Enter date in DD/MM/YYYY format only.");

                return false;
            }

            return true;
        },

        // input date in "dd/mm/yyyy" format
        parseDate: function (date) {
            if (date != null) {
                var parts = date.split("/");
                return new Date(parts[2], parts[1] - 1, parts[0]);
            }
        },

        isTemperature: function (currentContext, inputId, message) {
            var ctrl = currentContext.getView().byId(inputId);
            var re = /^-?[1-9]\d{0,1}(\.[1-9]{1,2})?$/;

            if (!re.test(ctrl.getValue())) {
                ctrl.setValueState(sap.ui.core.ValueState.Error)
                    .setValueStateText(message);

                return false;
            }
            else {
                currentContext.getView().byId(inputId).setValueState(sap.ui.core.ValueState.None);
            }

            return true;
        },

        isPostalCode: function (currentContext, inputId) {
            var ctrl = currentContext.getView().byId(inputId);
            ctrl.setValueState(sap.ui.core.ValueState.None);

            var re = /^\d{6}$/;

            if (!re.test(ctrl.getValue())) {
                ctrl.setValueState(sap.ui.core.ValueState.Error)
                    .setValueStateText("Enter valid postal code.");

                return false;
            }

            return true;
        },
        isChAndSpecialCh: function (currentContext, inputId) {
            var ctrl = currentContext.getView().byId(inputId);
            ctrl.setValueState(sap.ui.core.ValueState.None);

            var re = /^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$/;

            if (!re.test(ctrl.getValue())) {
                ctrl.setValueState(sap.ui.core.ValueState.Error)
                    .setValueStateText("Enter valid Vehicle number Example-MH 12 AB 1234 ");

                return false;
            }

            return true;
        },

        isChaonly: function (currentContext, inputId) {
            var ctrl = currentContext.getView().byId(inputId);
            ctrl.setValueState(sap.ui.core.ValueState.None);

            var re = /^[a-zA-Z]{2,100}$/;

            if (!re.test(ctrl.getValue())) {
                ctrl.setValueState(sap.ui.core.ValueState.Error)
                    .setValueStateText("Enter valid name name should have 2 letters");

                return false;
            }

            return true;
        },

        getAllFarmerEnquiry: function (currentContext) {
            // var CurrentContext = this;
            commonService.getAllFarmerEnquiry(function (data) {
                var model = new sap.ui.model.json.JSONModel();
                model.setData({ modelData: data[0] });
                currentContext.getView().setModel(model, "farmerModel");
            })
        },

        //get all stage masters
        getStageMasters: function (currentContext) {
            commonService.getStageMasters(function (data) {
                if (data[0] != undefined && data[0].length > 0) {
                    var model = new sap.ui.model.json.JSONModel();
                    model.setData({ modelData: data[0] });
                    currentContext.getView().setModel(model, "stageModel");
                } else {
                    MessageBox.error("No stage available.");
                }
            })
        },

        getAllSubcontractors : function(currentContext){
            commonService.getAllSubcontractors(function(data){
                if (data[0] != undefined && data[0].length > 0) {
                    var model = new sap.ui.model.json.JSONModel();
                    model.setData({ modelData: data[0] });
                    currentContext.getView().setModel(model, "subcontractorModel");
                }
            })
        },

        //get Breeder setting data reder to dashboard setting page
        getBreederSettingData: function (currentContext, moduleid) {
            let isBreederSetting = sessionStorage.getItem(721) == "false";
            var oRouter = sap.ui.core.UIComponent.getRouterFor(currentContext);
            if (isBreederSetting) {
                if (this.session("roleIds") == 3) {
                    oRouter.getTargets().display("home", {});
                    oRouter.navTo("home", true);
                    setTimeout(function () {
                        MessageToast.show("Your Breeder settings are not complete, Please contact Breeder manager or administrator for completing setup.");
                    }, 2000);
                }
                else {
                    MessageToast.show("Your Breeder settings are not complete, Please click here to complete the setup.");
                    oRouter.getTargets().display("dashboardsettings", {});
                    oRouter.navTo("dashboardsettings", true);
                }
            }
        },

        //get common setting data reder to dashboard setting page
        getCommonSettingData: function (currentContext, moduleid) {
            let isCommonSetting = sessionStorage.getItem(730) == "false";
            if (isCommonSetting) {

                MessageToast.show("Your common settings are not complete, Please click here to complete the setup.");
                oRouter.getTargets().display("dashboardsettings", {});
                oRouter.navTo("dashboardsettings", true);
            }
        },

        // function is use for validate entries and post dates  for daily transaction screeen
        Date_validation: function (daily_transaction_date, placement_date, today_date) {
            let isValid1 = false;          //  let daily_transaction_date = this.getView().byId(id);



            let placement_date_year = placement_date.slice(6, 10);
            let placement_date_month = placement_date.slice(3, 5);
            let placement_date_day = placement_date.slice(0, 2);



            let today_date_year = today_date.slice(6, 10);
            let today_date_month = today_date.slice(3, 5);
            let today_date_day = today_date.slice(0, 2);

            let daily_transaction_date_year = (daily_transaction_date.getValue()).slice(6, 10);
            let daily_transaction_date_month = (daily_transaction_date.getValue()).slice(3, 5);
            let daily_transaction_date_day = (daily_transaction_date.getValue()).slice(0, 2);
            if (daily_transaction_date_year == today_date_year) {
                if (daily_transaction_date_month == today_date_month) {
                    if (daily_transaction_date_day <= today_date_day) {
                        placedate_validation()
                    }
                    else {
                        MessageBox.error("Post Dated entries is not allowed");
                        isValid1 = false;
                    }

                }
                else if (daily_transaction_date_month < today_date_month) {
                    isValid1 = true;
                    placedate_validation()

                }
                else {
                    MessageBox.error("Post Dated entries is not allowed");
                    isValid1 = false;
                }
            }
            else if (daily_transaction_date_year < today_date_year) {
                isValid1 = true;
                placedate_validation()


            }

            else {
                MessageBox.error("Post Dated entries is not allowed");
                isValid1 = false;
            }


            function placedate_validation() {

                if (daily_transaction_date_year == placement_date_year) {
                    if (daily_transaction_date_month == placement_date_month) {
                        if (daily_transaction_date_day >= placement_date_day) {
                            isValid1 = true;
                        }

                        else {
                            MessageBox.error(" Daily transaction date must be greater than or equal to batch  placement date");
                            isValid1 = false;
                        }
                    }
                    else if (daily_transaction_date_month > placement_date_month) {
                        isValid1 = true;
                    }
                    else {
                        MessageBox.error(" Daily transaction date must be greater than or equal to batch placement date");

                        isValid1 = false;
                    }

                }
                else if (daily_transaction_date_year > placement_date_year) {
                    isValid1 = true;

                }

                else {
                    MessageBox.error(" Daily transaction date must be greater than or equal to batch placement date");
                    isValid1 = false;

                }

            }


            return isValid1;
        },


        //get Layer setting data reder to dashboard setting page
        getLayerSettingData: function (currentContext, moduleid) {
            let islayerSetting = sessionStorage.getItem(725) == "false";
            var oRouter = sap.ui.core.UIComponent.getRouterFor(currentContext);
            if (islayerSetting) {
                if (this.roleid == 7) {
                    oRouter.getTargets().display("home", {});
                    oRouter.navTo("home", true);
                    setTimeout(function () {
                        MessageToast.show("Your Layer settings are not complete, Please contact Layer manager or administrator for completing setup.");
                    }, 2000);
                }
                else {
                    MessageToast.show("Your Layer settings are not complete, Please click here to complete the setup.");
                    oRouter.getTargets().display("dashboardsettings", {});
                    oRouter.navTo("dashboardsettings", true);
                }
            }
        },
        //get CBF setting data reder to dashboard setting page
        getCBFSettingData: function (currentContext, moduleid) {
            let isCBFSetting = sessionStorage.getItem(723) == "false";
            var oRouter = sap.ui.core.UIComponent.getRouterFor(currentContext);
            if (isCBFSetting) {
                if (this.roleid == 17) {
                    oRouter.getTargets().display("home", {});
                    oRouter.navTo("home", true);
                    setTimeout(function () {
                        MessageToast.show("Your CBF settings are not complete, Please contact CBF manager or administrator for completing setup.");
                    }, 2000);
                }
                else {
                    MessageToast.show("Your CBF settings are not complete, Please click here to complete the setup.");
                    oRouter.getTargets().display("dashboardsettings", {});
                    oRouter.navTo("dashboardsettings", true);
                }
            }
        },

        //get Hatchery setting data reder to dashboard setting page
        getHatcherySettingData: function (currentContext, moduleid) {
            let isHatcherySetting = sessionStorage.getItem(722) == "false";
            var oRouter = sap.ui.core.UIComponent.getRouterFor(currentContext);
            if (isHatcherySetting) {
                if (this.roleid == 5) {
                    oRouter.getTargets().display("home", {});
                    oRouter.navTo("home", true);
                    setTimeout(function () {
                        MessageToast.show("Your Hatchery settings are not complete, Please contact Hatchery manager or administrator for completing setup.");
                    }, 2000);
                }
                else {
                    MessageToast.show("Your Hatchery settings are not complete, Please click here to complete the setup.");
                    oRouter.getTargets().display("dashboardsettings", {});
                    oRouter.navTo("dashboardsettings", true);
                }
            }
        },

        //get Feed Mill setting data reder to dashboard setting page
        getFeedMillSettingData: function (currentContext, moduleid) {
            let isFeedMillSetting = sessionStorage.getItem(726) == "false";
            var oRouter = sap.ui.core.UIComponent.getRouterFor(currentContext);
            if (isFeedMillSetting) {
                if (this.roleid == 15) {
                    oRouter.getTargets().display("home", {});
                    oRouter.navTo("home", true);
                    setTimeout(function () {
                        MessageToast.show("Your Feed Mill settings are not complete, Please contact Feed Mill manager or administrator for completing setup.");
                    }, 2000);
                }
                else {
                    MessageToast.show("Your Feed Mill settings are not complete, Please click here to complete the setup.");
                    oRouter.getTargets().display("dashboardsettings", {});
                    oRouter.navTo("dashboardsettings", true);
                }
            }
        },
        // get Processing setting data reder to dashboard setting page
        getProcessingSettingData: function (currentContext, moduleid) {
            let isProcessingSetting = sessionStorage.getItem(724) == "false";
            var oRouter = sap.ui.core.UIComponent.getRouterFor(currentContext);
            if (isProcessingSetting) {
                if (this.roleid == 19) {
                    oRouter.getTargets().display("home", {});
                    oRouter.navTo("home", true);
                    setTimeout(function () {
                        MessageToast.show("Your Processing settings are not complete, Please contact Processing manager or administrator for completing setup.");
                    }, 2000);
                }
                else {
                    MessageToast.show("Your Processing settings are not complete, Please click here to complete the setup.");
                    oRouter.getTargets().display("dashboardsettings", {});
                    oRouter.navTo("dashboardsettings", true);
                }
            }
        },

        setModel: function (oArguments) {
            let oModel = new JSONModel();
            oModel.setData(oArguments.aData);
            oModel.setSizeLimit(oArguments.aData.length);
            return oArguments.context.getView().setModel(oModel, oArguments.sName);
        },

        updateModel: function (oArguments) {

            let oModel = oArguments.context.getView().getModel(oArguments.sName);

            let oData = oModel.getData();

            for (let sKey in oArguments.aData) {
                oData[sKey] = oArguments.aData[sKey];
            };

            return oModel.refresh();

        },

        getModel: function (oArguments) {
            return (typeof oArguments.bReturnDataOnly !== "undefined" && oArguments.bReturnDataOnly === true) ?
                oArguments.context.getView().getModel(oArguments.sName).getData() :
                oArguments.context.getView().getModel(oArguments.sName);
        }
    }
});