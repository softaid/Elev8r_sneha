sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/ui/Device',
    'sap/m/MessageToast',
    'sap/ui/elev8rerp/componentcontainer/model/formatter',
    'sap/ui/elev8rerp/componentcontainer/services/company.service',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/ui/elev8rerp/componentcontainer/utility/SessionManager',
    'jquery.sap.storage'

], function (BaseController, JSONModel, Device, MessageToast, formatter, companyService, commonFunction) {
    "use strict";
    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Company", {
        formatter: formatter,

        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        onInit: function () {
            var model = new JSONModel();
            model.setData({});
            this.getView().setModel(model, "companyModel");

            this.handleRouteMatched(null);

            var currRouteName = this.getOwnerComponent().getModel("applicationModel").getProperty("/routeName");
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            if (this._oRouter.getRoute(currRouteName)) {
                this._oRouter.getRoute(currRouteName).attachMatched(this.handleRouteMatched, this);
            }
        },

        handleRouteMatched: function () {
            this.initlogin();
        },

        initlogin: function () {
            if (MYSAP.SessionManager.getSession("currentSession") != null) {
                this.getRouter().getTargets().display("home", {});
                this.getRouter().navTo("home", true);
            } else {
                // Reset Form and Login session
                this.onResetLogin();
            }
        },

        onResetLogin: function () {
            MYSAP.SessionManager.clearSession('currentSession');
            this.getView().byId("cmpcode").setValue('');
            this.getView().byId("vboxCmp").setVisible(true);
        },

        onBeforeRendering: function () {
        },

        onBeforeShow: function (evt) {
        },


        apiLoginCallback: function (data, objArray) {

            if (data != undefined && data.SessionId) {

                var oRouter = objArray[0];
                var oView = objArray[1];

                //Clear form data 
                oView.byId("umobile").setValue('');
                oView.byId("pasw").setValue('');

                MessageToast.show("Login successful, Please wait...", { duration: 1500 });

                oRouter.getTargets().display("home", {});
                oRouter.navTo("home", true);
            }
            else {
            }
        },

        apiLoginErrorCallback: function (err) {

            if (err.status == "401") {
                MessageToast.show("Login details are invalid", { my: "center top", at: "center top" });
            }
        },

        Cipher: function (text, decode) {
            // ABCDEF to QWERTY map
            var map = {
                a: 'q', b: 'w', c: 'e',
                d: 'r', e: 't', f: 'y',
                g: 'u', h: 'i', i: 'o',
                j: 'p', k: 'a', l: 's',
                m: 'd', n: 'f', o: 'g',
                p: 'h', q: 'j', r: 'k',
                s: 'l', t: 'z', u: 'x',
                v: 'c', w: 'v', x: 'b',
                y: 'n', z: 'm'
            };

            // Flip the map
            if (decode) {
                map = (function () {
                    var tmp = {};
                    var k;

                    // Populate the tmp variable
                    for (k in map) {
                        if (!map.hasOwnProperty(k)) continue;
                        tmp[map[k]] = k;
                    }

                    return tmp;
                })();
            }

            return text.split('').filter(function (v) {
                // Filter out characters that are not in our list
                return map.hasOwnProperty(v.toLowerCase());
            }).map(function (v) {
                // Replace old character by new one
                // And make it uppercase to make it look fancier
                return map[v.toLowerCase()].toUpperCase();
            }).join('');
        },

        onForgetPswLnk: function () {
            this.getView().byId("vboxLogin").setVisible(false);
            this.getView().byId("vboxForPsw").setVisible(true);
        },

        onGotoLoginLnk: function () {
            this.getView().byId("vboxLogin").setVisible(true);
            this.getView().byId("vboxForPsw").setVisible(false);
        },

        validateForgetPsw: function () {
            var isValid = true;

            if (!commonFunction.isRequired(this, "ufmobile", "Registered mobile number is required!"))
                isValid = false;

            return isValid;
        },

        onForgetPsw: function (oEvent) {

            if (this.validateForgetPsw()) {
                var urlUser = "logicaldna";
                var urlPsd = "horse99";
                var urlMob = "919960015575";
                var smsText = "Test message from SMS LANE";
                var smsURL = "http://smslane.com/vendorsms/pushsms.aspx?user=" + urlUser + "&password=" + urlPsd + "&msisdn=" + urlMob + "&sid=WebSMS&msg=" + smsText + "&fl=0";

                loginService.sendSMSForgetPsw(smsURL, function (data) {
                    MessageToast.show("SMS Sent, please check and use the login details sent on your registered mobile!");
                }, function (err) {
                    MessageToast.show("Failed - Insufficient Credits");
                });
            }
        },


        validateCompCode: function () {
            var isValid = true;

            if (!commonFunction.isRequired(this, "cmpcode", "Company code is required!"))
                isValid = false;

            return isValid;
        },

        onChkCompTap: function (oEvent) {
            var currentContext = this;
            var loginData = {
                companycode: this.getView().byId("cmpcode").getValue(),
            };

            if (this.validateCompCode()) {
                loginService.validateCompany(loginData, function (data) {
                    var oModel = currentContext.getView().getModel("loginModel");
                    oModel.oData.companycode = loginData.companycode;
                    oModel.oData.companyid = data.companyid;
                    oModel.oData.token = data.token;
                    oModel.refresh();

                    currentContext.getView().byId("vboxCmp").setVisible(false);
                    currentContext.getView().byId("vboxLogin").setVisible(true);
                },

                    function (error) {

                        if (error.responseJSON.token == null) {
                            MessageToast.show("Invalid company code submitted, Please enter correct company code!");
                        }
                    });
            }
        },

        validateLogin: function () {
            var isValid = true;

            if (!commonFunction.isRequired(this, "umobile", "Registered mobile number is required!"))
                isValid = false;

            if (!commonFunction.isRequired(this, "pasw", "Password is required!"))
                isValid = false;

            return isValid;
        },

        setUserModel: function (data) {
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({ modelData: data.d });
            sap.ui.getCore().setModel(oModel, "userEntityModel");
        },

        onLoginTap: function (oEvent) {

            var currentContext = this;
            //MessageToast.show("Wait..", {my: "center top", at: "center top" });
            if (this.validateLogin()) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var oView = this.getView();

                var oModel = currentContext.getView().getModel("loginModel");

                var loginData = {
                    username: this.getView().byId("umobile").getValue(),
                    pwd: this.getView().byId("pasw").getValue(),
                    companycode: oModel.oData.companycode,
                    companyid: oModel.oData.companyid,
                    token: oModel.oData.token
                };

                loginService.userLogin(loginData,
                    // Success methods if Login succeeded
                    function (data) {

                        // Token data decoded
                        var ca = data.token;
                        var base64Url = ca.split('.')[1];
                        var decodedUser = JSON.parse(window.atob(base64Url));

                        // Session created with User data
                        var session = new MYSAP.Session(
                            decodedUser.username,
                            decodedUser.companyid,
                            data.d[0].companyname,
                            decodedUser.id,
                            data.d[0].roleids,
                            data.d[0].rolenames,
                            data.token,
                            loginData.token);

                        // Clear login details on form
                        currentContext.getView().byId("umobile").setValue('');
                        currentContext.getView().byId("pasw").setValue('');

                        // Write to SessionStorage
                        MYSAP.SessionManager.setSession('currentSession', session);

                        currentContext.setUserModel(data);

                        // Refresh User permissions and Navigation menu (old user caching removed and refreshed with new user)
                        currentContext.bus = sap.ui.getCore().getEventBus();
                        currentContext.bus.publish("masterpage", "getUserPermissions", null);

                        oRouter.getTargets().display("home", {});
                        oRouter.navTo("home", true);
                    },

                    //Error Code if Login fails
                    function (error) {

                        if (error.responseJSON.errorcode != undefined) {
                            var errCode = error.responseJSON.errorcode;
                            var errMsg = "";
                            if (errCode.invalidcompanyuser) {
                                errMsg = "Invalid mobile number entered!";
                            } else if (errCode.inactiveuser) {
                                errMsg = "User is inactive, please contact administrator!";
                            } else if (errCode.invalidpwd) {
                                errMsg = "Invalid password entered!";
                            } else if (errCode.userlocked) {
                                errMsg = "User is locked, please contact administrator!";
                            }
                            MessageToast.show(errMsg);
                        }
                    });
            }
        }
    });
});

