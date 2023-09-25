sap.ui.define([

    'sap/ui/elev8rerp/componentcontainer/utility/SessionManager'
],
    function () {
        "use strict";

        return {
            /**
            * @public
            * @param {boolean} bIsPhone the value to be checked
            * @returns {string} path to image
            */

            session: function (key) {
                var sessionStorage = null;
                var currentSession = MYSAP.SessionManager.getSession('currentSession');

                if (currentSession) {
                    sessionStorage = currentSession[key];
                }

                return sessionStorage;
            },

            runJQueryX: function (type, methodName, params, callBackFn, errorCallback, objArray) {

                var accessToken = this.session("accessToken");
                var cToken = this.session("cToken");
                //console.log('accessToken,  cToken: ', accessToken, cToken);

                //var oConfig= new sap.ui.model.json.JSONModel("./config/config.json");
                //var confData = oConfig.oData;

                var oConfig = sap.ui.getCore().getModel("configModel");

                var busyDialog = (busyDialog) ? busyDialog : new sap.m.BusyDialog('busy0' + Math.floor(Math.random() * 1000000), { text: 'Loading ...' });

                busyDialog.open();


                var aData = jQuery.ajax({
                    type: type,
                    contentType: 'application/json; charset=utf-8',
                    url: oConfig.oData.webapi.url + methodName,
                    data: params != null ? JSON.stringify(params) : null,
                    beforeSend: function (request) {
                        request.setRequestHeader("x-access-token", accessToken);
                        request.setRequestHeader("c-token", cToken);
                    },
                    success: function (data, textStatus, jqXHR) {
                        var fn = eval(callBackFn);
                        fn(data, objArray);
                        busyDialog.close()
                    },
                    error: function (err) {
                        if (errorCallback) {
                            var fn = eval(errorCallback);
                            fn(err);
                        }
                        console.log('Service Error :', err);
                        busyDialog.close()
                    }
                });
            },

            getCurrentTimestamp: function (callback) {
            },

            runJQueryUrl: function (fullUrl, type, params, callBackFn, errorCallback, objArray) {

                var accessToken = this.session("accessToken");
                var cToken = this.session("cToken");
                //console.log('accessToken,  cToken: ', accessToken, cToken);

                var busyDialog = (busyDialog) ? busyDialog : new sap.m.BusyDialog('busy0' + Math.floor(Math.random() * 1000000), { text: 'Loading ...' });

                busyDialog.open();

                var aData = jQuery.ajax({
                    type: type,
                    contentType: 'application/json; charset=utf-8',
                    url: fullUrl,
                    dataType: "jsonp",
                    data: params != null ? JSON.stringify(params) : null,
                    beforeSend: function (request) {
                        request.setRequestHeader("x-access-token", accessToken);
                        request.setRequestHeader("c-token", cToken);
                    },
                    success: function (data, textStatus, jqXHR) {
                        var fn = eval(callBackFn);
                        fn(data, objArray);
                        busyDialog.close()
                    },
                    error: function (err) {
                        if (errorCallback) {
                            var fn = eval(errorCallback);
                            fn(err);
                        }
                        console.log('Service Error :', err);
                        busyDialog.close()
                    }
                });
            },

            runJQueryBackground: function (type, url, methodName, params, callBackFn, errorCallback, objArray) {

                var accessToken = this.session("accessToken");
                var cToken = this.session("cToken");

                var oConfig = sap.ui.getCore().getModel("configModel");
                console.log(url == null ? oConfig.oData.webapi.url + methodName : url + (methodName == null ? "" : methodName));
                var aData = jQuery.ajax({
                    type: type,
                    contentType: 'application/json; charset=utf-8',
                    url: (url == null ? oConfig.oData.webapi.url + methodName : url + (methodName == null ? "" : methodName)),
                    data: params != null ? JSON.stringify(params) : null,
                    beforeSend: function (request) {
                        request.setRequestHeader("x-access-token", accessToken);
                        request.setRequestHeader("c-token", cToken);
                    },
                    success: function (data, textStatus, jqXHR) {
                        var fn = eval(callBackFn);
                        fn(data, objArray);
                    },
                    error: function (err) {
                        if (errorCallback) {
                            var fn = eval(errorCallback);
                            fn(err);
                        }
                        console.log('Service Error :', err);
                    }
                });
            },

            runJQueryXSendEmail: function (sType, sMethodName, oData, callBackFn, errorCallback, objArray) {

                let sContentType = 'application/json; charset=utf-8';
    
                let oConfig = sap.ui.getCore().getModel("configModel");
    
                let oBusyDialog = new sap.m.BusyDialog('busy0' + Math.floor(Math.random() * 1000000), {text: 'Please wait...'});
    
                oBusyDialog.open();
    
                let aData = jQuery.ajax({
                    type: sType,
                    contentType: sContentType,
                    url: oConfig.oData.webapi.emailurl + sMethodName,
                    data: oData !== null ? JSON.stringify(oData) : null,
                    beforeSend: function (request) {
                    },
                    success: function (data, textStatus, jqXHR) {
                        var fn = eval(callBackFn);
                        fn(data, objArray);
                        oBusyDialog.close();
                    },
                    error: function (err) {
                        if (errorCallback) {
                            var fn = eval(errorCallback);
                            fn(err);
                        }
                        console.log('Service Error :', err);
                        oBusyDialog.close();
                    }
                });
            },

            masterDataExport: function (params, callback, errcallback) {
                console.log("params", params);
                this.runJQueryX("POST", "common/masterdataexport", params, callback, errcallback);
            },

            sendEmailNotification: function (params, callback) {
                this.runJQueryX("POST", "common/emailnotification/send", params, callback, null);
            },

            getTransactionNotification: function (params, callback) {
                this.runJQueryX("GET", "common/transnotification/" + params.transactioncode, null, callback, null);
            },

            getTransactionNotificationAll: function (callback) {
                this.runJQueryX("GET", "common/transnotificationall", null, callback, null);
            },

            getNotificationPlaceholders: function (params, callback) {
                this.runJQueryX("GET", "notificationsetting/notificationplaceholders/" + params.transactiontypeid, null, callback, null);
            },

            getNotificationHistoryList: function (callback) {
                this.runJQueryX("GET", "common/notificationhistory/" + this.session("userId"), null, callback, null);
            },

            readNotifications: function (params, callback) {
                this.runJQueryX("POST", "common/notificationhistory/read", params, callback, null);
            },

            getNotificationHistoryPopupList: function (params, callback) {
                this.runJQueryBackground("GET", null, "common/notificationhistorypopuplist/" + this.session("userId") + "/" + params.limit, null, callback, null);
            },

            saveNotificationHistory: function (params, callback) {
                this.runJQueryX("POST", "common/savenotificationhistory", params, callback, null);
            },

            getNotificationCreatedFor: function (params, callback) {
                this.runJQueryX("GET", "common/notificationcreatedfor/" + params.userid, null, callback, null);
            },

            // Get New Doc Series for individual document
            getNewDocSeries: function (params, callback) {
                this.runJQueryX("GET", "common/newseries/" + params.doccode + "/" + this.session("companyId"), null, callback, null);
            },

            // Get New Doc Series for individual document
            getNewDocSeriesforParty: function (params, callback) {
                this.runJQueryX("GET", "common/newseries/" + params.doccode + "/" + this.session("companyId") + "/" + params.roleid, null, callback, null);
            },

            // Get New Doc Series for Vouchertype
            getNewDocSeriesforVouchertype: function (params, callback) {
                this.runJQueryX("GET", "common/newseriesforje/" + params.doccode + "/" + this.session("companyId") + "/" + params.vouchertypeid, null, callback, null);
            },

            getCurrentTimestamp: function (callback) {
                this.runJQueryX("GET", "common/currenttimestamp", null, callback, null);
            },

            // APIs to bind dropdown
            getLocationTypes: function (callback) {
                this.runJQueryX("GET", "common/locationtype/" + this.session("companyId"), null, callback, null);
            },

            getWarehouse: function (callback) {
                this.runJQueryX("GET", "common/warehouse/" + this.session("companyId"), null, callback, null);
            },

            getWarehouseAddress: function (params, callback) {
                this.runJQueryX("GET", "warehouse/address/" + params.moduleid + "/" + this.session("companyId"), null, callback, null);
            },

            getLocations: function (params, callback) {
                this.runJQueryX("GET", "common/location/" + this.session("companyId") + "/" + params.moduleids, null, callback, null);
            },

            getWarehouseBin: function (callback) {
                this.runJQueryX("GET", "common/warehousebin/" + this.session("companyId"), null, callback, null);
            },

            getReference: function (params, callback) {
                this.runJQueryX("GET", "common/reference/" + params.typecode, null, callback, null);
            },

            getLedgerList: function (callback) {
                this.runJQueryX("GET", "common/ledger/" + this.session("companyId"), null, callback, null);
            },

            getPartyAddress: function (Params, Callback) {
                this.runJQueryX("GET", "party/partyaddress/" + Params.partyid + "/" + Params.addresstypeid + "/" + this.session("companyId"), Params, Callback, null);
            },

            getFinancialYearList: function (callback) {
                this.runJQueryX("GET", "financialyearsetting/list/" + this.session("companyId"), null, callback, null);
            },

            getTaxList: function (callback) {
                this.runJQueryX("GET", "common/tax/" + this.session("companyId"), null, callback, null);
            },

            getSingleTaxList: function (callback) {
                this.runJQueryX("GET", "common/singletax/" + this.session("companyId"), null, callback, null);
            },

            //APIs for fragment view
            getLocationList: function (callback) {
                this.runJQueryX("GET", "location/search/" + this.session("companyId"), null, callback, null);
            },

            getWarehouseList: function (callback) {
                this.runJQueryX("GET", "warehouse/search/" + this.session("companyId"), null, callback, null);
            },

            //common APIs
            getPrevNextRecord: function (params, callback) {
                this.runJQueryX("GET", params.apiName + "/id/" + params.id + "/order/" + params.order, null, callback, null);
            },

            getItem: function (callback) {
                this.runJQueryX("GET", "common/item/" + this.session("companyId"), null, callback, null);
            },

            getHSNList: function (callback) {
                this.runJQueryX("GET", "itemhsn/list/" + this.session("companyId"), null, callback, null);
            },

            getItemAvgWeight: function (params, callback) {
                this.runJQueryX("GET", "common/item/avgweight/" + params.itemid + "/" + this.session("companyId"), null, callback, null);
            },

            getFreightList: function (callback) {
                this.runJQueryX("GET", "common/freightlist/" + this.session("companyId"), null, callback, null);
            },

            getEmployeeList: function (callback) {
                this.runJQueryX("GET", "common/employeelist/" + this.session("companyId"), null, callback, null);
            },

            getBreederBatches: function (callback) {
                this.runJQueryX("GET", "breederbatch/search/" + this.session("companyId"), null, callback, null);
            },

            getBreederBatchPhases: function (callback) {
                this.runJQueryX("GET", "phase/search/" + this.session("companyId"), null, callback, null);
            },

            getLocationwiseInProgressBreederBatches: function (LocationId, callback) {
                this.runJQueryX("GET", "breederbatch/locationwiseinprogresssearch/" + LocationId + "/" + this.session("companyId"), null, callback, null);
            },

            getShedsForBreederBatch: function (BreederBatchId, callback) {
                this.runJQueryX("GET", "breedershed/search/" + this.session("companyId") + "/batch/" + BreederBatchId, null, callback, null);
            },

            getHatchers: function (callback) {
                this.runJQueryX("GET", "hatcher/search/" + this.session("companyId"), null, callback, null);
            },

            getSetterBatchesForCurrentLocation: function (params, callback) {
                this.runJQueryX("GET", "setterbatch/" + this.session("companyId") + "/location/" + params.locationid, null, callback, null);
            },

            getAvailableSheds: function (params, callback) {
                this.runJQueryX("GET", "common/shed/" + this.session("companyId") + "/statusid/" + params.statusid + "/locationid/" + params.locationid, null, callback, null);
            },

            getAvailableHatchers: function (params, callback) {
                this.runJQueryX("GET", "common/hatcher/" + this.session("companyId") + "/locationid/" + params.locationid, null, callback, null);
            },

            getUser: function (params, callback) {
                this.runJQueryX("GET", "common/user/" + this.session("companyId") + "/roleid/" + params, null, callback, null);
            },
            getAllVendor: function (params, callback) {
                this.runJQueryX("GET", "common/vendor/" + this.session("companyId") + "/partnerroleid/" + params, null, callback, null);
            },

            getHatcherBatchesForCurrentLocation: function (params, callback) {
                this.runJQueryX("GET", "hatcherbatch/" + this.session("companyId") + "/location/" + params.locationid, null, callback, null);
            },

            getAllHatcherBatch: function (callback) {
                this.runJQueryX("GET", "hatcherbatch/hatcherbatchsearch/" + this.session("companyId"), null, callback, null);
            },

            getLocationWiseWarehouse: function (params, callback) {
                this.runJQueryX("GET", "common/warehouse/" + this.session("companyId") + "/locationid/" + params.locationid, null, callback, null);
            },

            getModuleWiseWarehouses: function (params, callback) {
                this.runJQueryX("GET", "common/warehouse/" + this.session("companyId") + "/moduleid/" + params.moduleid, null, callback, null);
            },

            getAllWarehousewiseWarehouseBin: function (params, callback) {
                this.runJQueryX("GET", "warehousebin/search/warehouseid/" + params.warehouseid, null, callback, null);
            },

            getWarehousewiseBreederBatch: function (params, callback) {
                this.runJQueryX("GET", "common/breederbatch/" + this.session("companyId") + "/warehouseid/" + params.warehouseid, null, callback, null);
            },

           // get vendor list according to status

             getpurchaserequestbystatus: function (params, callback) {
                this.runJQueryX("GET", "common/purchaserequest/" + this.session("companyId") + "/statusid/" + params.statusid +  "/moduleid/"  + params.moduleid , null, callback, null);
            },

            getMaterialTransferList: function (params, callback) {
                this.runJQueryX("GET", "materialtransfer/" + params + "/" + this.session("companyId"), null, callback, null);
            },

            getGrpoList: function (params, callback) {
                this.runJQueryX("GET", "grpo/" + params + "/" + this.session("companyId"), null, callback, null);
            },

            getAllMaterialRequests: function (callback) {
                this.runJQueryX("GET", "common/materialrequest/" + this.session("companyId"), null, callback, null);
            },

            getAllCountries: function (callback) {
                this.runJQueryX("GET", "common/country", null, callback, null);
            },

            getAllStates: function (callback) {
                this.runJQueryX("GET", "common/state", null, callback, null);
            },

            getAllCities: function (callback) {
                this.runJQueryX("GET", "common/city", null, callback, null);
            },

            getStatesByCountryid: function (params, callback) {
                this.runJQueryX("GET", "common/state/" + params.countryid, null, callback, null);
            },

            getCitiesByStateid: function (params, callback) {
                this.runJQueryX("GET", "common/city/" + params.stateid, null, callback, null);
            },

            getAllItemgroup: function (callback) {
                this.runJQueryX("GET", "common/list/" + this.session("companyId"), null, callback, null);
            },

            //get batches by request target
            getBatchesByRequesTtarget: function (params, callback) {
                this.runJQueryX("GET", "materialrequest/search/" + this.session("companyId") + "/" + params.requesttarget, null, callback, null);
            },
            getBreederSetting: function (callback) {
                this.runJQueryX("GET", "common/breedersettingsearch/" + this.session("companyId"), null, callback, null);
            },

            //get all breederbatches with status 221 = 'new'
            getAllBreederBatchesByStatusid: function (params, callback) {
                this.runJQueryX("GET", "common/" + this.session("companyId") + "/bystatus/" + params.statusid, null, callback, null);
            },

            getLocationandStatuswiseBreederBatches: function (params, callback) {
                this.runJQueryX("GET", "common/locationid/" + params.locationid + "/statusid/" + params.statusid + "/companyid/" + this.session("companyId"), null, callback, null);
            },



            getBreederBatchesByLocation: function (params, callback) {
                this.runJQueryX("GET", "common/locationwise/" + params.locationid + "/companyid/" + this.session("companyId"), null, callback, null);
            },

            getItemLiveStock: function (params, callback) {
                this.runJQueryX("GET", "common/itemlivestock/" + params.itemid + "/warehousebin/" + params.warehousebinid + "/company/" + this.session("companyId"), null, callback, null);
            },
            getItemBatchbyitemid: function (params, callback) {
                this.runJQueryX("GET", "common/itembatchbyitemid/" + params.itemid + "/" + params.warehouseid + "/" + params.warehousebinid + "/" + this.session("companyId"), null, callback, null);
            },
			
			getItemInStock : function (params, callback) {
                this.runJQueryX("GET", "common/iteminstock/" + params.itemid + "/" + params.warehousebinid + "/" + params.transactiondate + "/" + this.session("companyId"), null, callback, null);
            },

            getAllPartner: function (callback) {
                this.runJQueryX("GET", "common/partnersearch/" + this.session("companyId"), null, callback, null);
            },

            getBreederSettings: function (callback) {
                this.runJQueryX("GET", "breedersetting/search/" + this.session("companyId"), null, callback, null);
            },

            getItemGroups: function (callback) {
                this.runJQueryX("GET", "itemgroup/search/" + this.session("companyId"), null, callback, null);
            },

            getItemAndWarehousewiseInstock : function(params, callback){
                this.runJQueryX("GET", "common/warehousewiseiteminstock/" + params.itemid + "/" + params.warehouseid + "/" + params.transactiondate + "/" + this.session("companyId"), null, callback, null);
            },

            getItemsLiveStockByWHid: function (params, callback) {
                this.runJQueryX("GET", "common/itemlivestock/" + params.itemgroupid + "/" + params.warehouseid + "/" + params.warehousebinid + "/" + this.session("companyId"), null, callback, null);
            },


            getItemsByItemGroups: function (params, callback) {
                this.runJQueryX("GET", "common/itemgroupid/" + params.itemgroupid + "/companyid/" + this.session("companyId"), null, callback, null);
            },

            getItemsBytaxcategory: function (params, callback) {
                this.runJQueryX("GET", "common/itemgroupid/" + params.itemgroupid + "/taxcategoryid/" + params.taxcategoryid + "/companyid/" + this.session("companyId"), null, callback, null);
            },

            getItemsByInvoiceType: function (params, callback) {
                this.runJQueryX("GET", "common/itemgroupid/" + params.itemgroupid + "/invoicetype/" + params.invoicetypeid + "/companyid/" + this.session("companyId"), null, callback, null);
            },

            // getUserList :  function(params,callback){
            //     this.runJQueryX("GET", "common/user/" + this.session("companyId"), null, callback, null);
            // }

            //get all layer with status 981 = 'new'
            getAllLayerBatchesByStatusid: function (params, callback) {
                this.runJQueryX("GET", "common/" + this.session("companyId") + "/layerbatchstatus/" + params.statusid, null, callback, null);
            },

            getBranchList: function (Callback) {
                this.runJQueryX("GET", "branch/search/" + this.session("companyId"), null, Callback, null);
            },

            getAccountLedgerList: function (Callback) {
                this.runJQueryX("GET", "common/accountledger/" + this.session("companyId"), null, Callback, null);
            },

            // get layer batch pahse
            getAllLayerPhases: function (callback) {
                this.runJQueryX("GET", "layerphase/search/" + this.session("companyId"), null, callback, null);
            },

            getDefaultBin: function (params, callback) {
                this.runJQueryX("GET", "common/defaultbin/" + params.warehouseid + "/companyid/" + this.session("companyId"), null, callback, null);
            },

            getLocationwiseInProgressLayerBatches: function (LocationId, callback) {
                this.runJQueryX("GET", "layerbatch/locationwiseinprogresssearch/" + LocationId + "/" + this.session("companyId"), null, callback, null);
            },

            getBatchwiseLayerSheds: function (Layerbatchid, callback) {
                this.runJQueryX("GET", "layershed/search/" + this.session("companyId") + "/layerbatchid/" + Layerbatchid, null, callback, null);
            },

            getLayerSettings: function (callback) {
                this.runJQueryX("GET", "layersetting/search/" + this.session("companyId"), null, callback, null);
            },

            getCbfSettings: function (callback) {
                this.runJQueryX("GET", "cbfsetting/search/" + this.session("companyId"), null, callback, null);
            },


            getCategorywiseLedgers: function (params, callback) {
                this.runJQueryX("GET", "chartofaccount/searchledgers/" + params.categoryid + "/" + this.session("companyId"), null, callback, null);
            },

            getAllCashLedgers: function (callback) {
                this.runJQueryX("GET", "chartofaccount/getcashledgers/companyid/" + this.session("companyId"), null, callback, null);
            },

            getAllParties: function (Callback) {
                this.runJQueryX("GET", "party/search/" + this.session("companyId"), null, Callback, null);
            },

            getRolewiseParties: function (params, Callback) {
                this.runJQueryX("GET", "party/roleid/" + params.roleid + "/companyid/" + this.session("companyId"), null, Callback, null);
            },

            getLedgersWithNoControlAccount: function (Callback) {
                this.runJQueryX("GET", "chartofaccount/getledgers/companyid/" + this.session("companyId"), null, Callback, null);
            },

            getAllBank: function (callback) {
                console.log("HI");
                this.runJQueryX("GET", "bank/search/" + this.session("companyId"), null, callback, null);
            },

            getAllLedgers: function (callback) {
                this.runJQueryX("GET", "chartofaccount/Allledgers/companyid/" + this.session("companyId"), null, callback, null);
            },

            getAllBranch: function (callback) {
                this.runJQueryX("GET", "branch/search/" + this.session("companyId"), null, callback, null);
            },

            getLocationBatchStartedBreederShed: function (params, callback) {
                this.runJQueryX("GET", "common/locationwise/batchstartedsheds/" + params.locationid + "/" + this.session("companyId"), null, callback, null);
            },

            getAllDimensions: function (callback) {
                this.runJQueryX("GET", "dimenssions/search/" + this.session("companyId"), null, callback, null);
            },

            getAllCostCenters: function (callback) {
                this.runJQueryX("GET", "costcenter/search/" + this.session("companyId"), null, callback, null);
            },

            //get batchdetail
            getBreederBatchForBatchDetails: function (params, callback) {
                this.runJQueryX("GET", "batchdetail/search/companyid/" + this.session("companyId") + "/breederbatchid/" + params.breederbatchid, null, callback, null);
            },

            //modulewise started batches
            getModuleWiseStartedBatches: function (params, callback) {
                this.runJQueryX("GET", "common/modulewise/batches/" + params.moduleid + "/" + this.session("companyId"), null, callback, null);
            },

            getDimensionwiseCostCenter: function (params, callback) {
                this.runJQueryX("GET", "costcenter/search/dimensionid/" + params.dimensionid + "/" + this.session("companyId"), null, callback, null);
            },

            //get itemby material type
            getItemByMaterailType: function (params, callback) {
                this.runJQueryX("GET", "common/itembymaterialtype/materialtypeid/" + params.materialtypeid + "/" + this.session("companyId"), null, callback, null);
            },

            //hatchery settings
            getHatcherySettings: function (callback) {
                this.runJQueryX("GET", "hatcherysettings/search/" + this.session("companyId"), null, callback, null);
            },

            //get all lines
            getAllLine: function (params, callback) {
                console.log(params);
                this.runJQueryX("GET", "line/search/" + this.session("companyId") + "/" + params.branchid, null, callback, null);
            },

            getAllWaterParameter: function (callback) {
                this.runJQueryX("GET", "waterparameter/search/companyid/" + this.session("companyId"), null, callback, null);
            },

            getAllWaterFacility: function (callback) {
                this.runJQueryX("GET", "waterfacility/search/companyid/" + this.session("companyId"), null, callback, null);
            },

            getEmployeeByRole: function (params, callback) {
                console.log(params);
                this.runJQueryX("GET", "employee/roleids/" + params.roleids + "/companyid/" + this.session("companyId"), null, callback, null);
            },

            getAllCBFDocument: function (callback) {
                this.runJQueryX("GET", "document/search/companyid/" + this.session("companyId"), null, callback, null);
            },

            getAllCommonBranchLine: function (params, callback) {
                this.runJQueryX("GET", "commonbranchline/search/branchid/" + params.branchid, null, callback, null);
            },

            getAllCommonBranch: function (callback) {
                this.runJQueryX("GET", "commonbranch/search/companyid/" + this.session("companyId"), null, callback, null);
            },

            //get layer phase by week
            getLayerPhaseByWeek: function (params, callback) {
                this.runJQueryX("GET", "common/layerphasebyweek/week/" + params.week, null, callback, null);
            },

            getCbfBatchesByStatus: function (params, callback) {
                this.runJQueryX("GET", "common/cbfbatches/statusid/" + params.statusid + "/" + this.session("companyId"), null, callback, null);
            },

            getAllFarmerEnquiry: function (callback) {
                this.runJQueryX("GET", "farmerenquiry/search/" + this.session("companyId"), null, callback, null);
            },

            getAllTds: function (callback) {
                this.runJQueryX("GET", "tds/search/" + this.session("companyId"), null, callback, null);
            },

            getCbfSetting: function (callback) {
                this.runJQueryX("GET", "cbfsetting/search/" + this.session("companyId"), null, callback, null);
            },

            getAccountLedgers: function (callback) {
                this.runJQueryX("GET", "common/accountledger/" + this.session("companyId"), null, callback, null);
            },

            getAgeInDays: function (params, callback) {
                this.runJQueryX("GET", "breederbatchopening/getDays/" + params.batchplacementdate + "/" + params.livebatchdate, null, callback, null);
            },
            getPartyModulewise: function (params, callback) {
                this.runJQueryX("GET", "common/party/" + params.roleid + "/" + params.moduleid + "/" + this.session("companyId"), null, callback, null);
            },
            getAllCBFLine: function (params, callback) {
                this.runJQueryX("GET", "line/search/" + this.session("companyId") + "/" + params.branchid, null, callback, null);
            },


            getItemGroupModuleWise: function (params, callback) {
                this.runJQueryX("GET", "common/itemgroupmodulewise/" + params.moduleid + "/" + this.session("companyId"), null, callback, null);
            },

            saveCommonSetting: function (params, callback) {
                this.runJQueryX("POST", "common/commonsetting", params, callback, null);
            },
            getAllCommonSetting: function (callback) {
                this.runJQueryX("GET", "common/commonsetting/search/" + this.session("companyId"), null, callback, null);
            },
            saveCommonSetting: function (params, callback) {
                this.runJQueryX("POST", "common/commonsetting", params, callback, null);
            },
            getAllCommonSetting: function (callback) {
                this.runJQueryX("GET", "common/commonsetting/search/" + this.session("companyId"), null, callback, null);
            },
            
            importMaster : function(params, callback, errcallback){
                console.log("params",params);
                this.runJQueryX("POST", "common" , params, callback, errcallback);
            },
            
            saveUserShortcutKeys: function (params, callback) {
                this.runJQueryX("POST", "common/usershortcutkey", params, callback, null);
            },
            getRolewisePageKey: function (params,callback) {
                this.runJQueryX("GET", "common/usershortcutkey/search/"  + params.roleids + "/" + this.session("companyId"), null, callback, null);
            },
            getRolewiseEntity: function (params,callback) {
                this.runJQueryX("GET", "common/rolewiseentity/"  + params.roleid, null, callback, null);
            },
            getRole: function (callback) {
                this.runJQueryX("GET", "common/role", null, callback, null);
            },

            getAllEntities: function (callback) {
                this.runJQueryX("GET", "common/entity", null, callback, null);
            },

            getCommonDashboardData: function (params, callback) {
                this.runJQueryX("GET", "common/commondashboard/" + params.userid, null, callback, null);
            },

            userLogout: function (callback) {
                this.runJQueryX("GET", "common/userlogout/" + this.session("userId") + "/" + this.session("companyId"), null, callback, null);
            },
			getBatchWiseShed: function (params, callback) {
                
                this.runJQueryX("GET", "common/getshedbatchwise/" + params.moduleid +"/"+ params.batchid, null, callback, null);
            },
			
			getBatchWiseCumulativeFeedConsumption: function (params, callback) {
                this.runJQueryX("GET", "common/getbatchwiseCumFeedCon/" + params.batchid +"/"+ params.shedid + "/" + params.transactiondate + "/" + params.moduleid + "/" + this.session("companyId"), null, callback, null);
            },
            getCommonDashBoard: function (params, callback) {
                this.runJQueryX("GET", "common/commondashboard1/company_id/"+this.session("companyId") +"/to_date/"+ params.to_date, null, callback, null);
            },
            /**
             * Function TO Fecth Data From JE
             * @param {} params 
             * @param {*} callback 
             */
            
            getJeDetail : function(params, callback){
                this.runJQueryX("GET", "common/commondashboard1/jE/company_id/" + this.session("companyId")+"/transaction_id/"+params.transaction_id+"/vouchertype_id/"+params.vouchertype_id, null, callback, null);
            },

            getAllBatches : function(callback){
                this.runJQueryX("GET", "layerbatch/search/" + this.session("companyId"), null, callback, null);
            },

            getStageMasters : function(callback){
                this.runJQueryX("GET", "stage/search/" + this.session("companyId"), null, callback, null);
            },

            modulewiseDashboards  : function(params, callback){
                this.runJQueryX("GET", "common/modulewisedashboards/" + params.moduleid, null, callback, null);
            },


            // getAllItemgroup: function (callback) {
            //     this.runJQueryX("GET", "common/list/" + this.session("companyId"), null, callback, null);
            // },


            getBreederSettingForDashBoard: function (callback) {
                this.runJQueryX("GET", "common/commondashboardbreedersetting/" +this.session("companyId") , null, callback, null);
            },

            getCommonSettingForDashBoard: function (callback) {
                this.runJQueryX("GET", "common/commondashboardsettingdata/"+this.session("companyId") , null, callback, null);
            },

            getLayerSettingForDashBoard: function (callback) {
                this.runJQueryX("GET", "common/commondashboardlayersetting/"+this.session("companyId") , null, callback, null);
            },
            getCBFSettingForDashBoard: function (callback) {
                this.runJQueryX("GET", "common/commondashboardcbfsetting/"+this.session("companyId") , null, callback, null);
            },
            getHatcherySettingForDashBoard: function (callback) {
                this.runJQueryX("GET", "common/commondashboardhatcherysetting/"+this.session("companyId") , null, callback, null);
            },
            getFeedMillSettingForDashBoard: function (callback) {
                this.runJQueryX("GET", "common/commondashboardfeedmillsetting/"+this.session("companyId") , null, callback, null);
            },
            getProcessingSettingForDashBoard: function (callback) {
                this.runJQueryX("GET", "common/commondashboardproccessingsetting/"+this.session("companyId") , null, callback, null);
            },
            getModuleDatabyUser: function (callback) {
                this.runJQueryX("GET", "common/getmoduleacessbyuser/"  + this.session("userId") + "/" + this.session("companyId") , null, callback, null);
            },

            getSettingStatusResult : function(callback){
                this.runJQueryX("GET", "common/settingstatussearch/" + this.session("companyId"), null, callback, null);
            },
     
            getSettingStatus : function(params, callback){
                this.runJQueryX("GET", "common/settingstatusselect/" + params.id + "/"  + this.session("companyId"), null, callback, null);
            },

            saveSettingStatus : function(params, callback){
                this.runJQueryX("POST", "common" , params, callback, null);
            },
         
            getLayerBatchPhases: function (callback) {
                this.runJQueryX("GET", "layerphase/search/" + this.session("companyId"), null, callback, null);
            },

            getReferenceByTypeCode : function(params, callback){
                this.runJQueryX("GET", "leadmaster/referencebytypecode/" + params.typecode, null, callback, null);
            },

            getAllLeads: function(callback){
                this.runJQueryX("GET", "lead/searchlead/" + this.session("companyId"), null, callback, null);
            },

            getAllContacts: function(callback){
                this.runJQueryX("GET", "contact/search/" + this.session("companyId"), null, callback, null);
            },
            
            getAllSubcontractors: function(callback){
                this.runJQueryX("GET", "subcontractor/searchsubcontractors/" + this.session("companyId"), null, callback, null);
            },
            getQcCheckList : function(callback){
                this.runJQueryX("GET", "common/getqcchecklistsearch/" + this.session("companyId"), null, callback, null);
            },
        };
    }
);
