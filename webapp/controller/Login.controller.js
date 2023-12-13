sap.ui.define([
    'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/ui/Device',
    'sap/m/MessageToast',
    'sap/ui/elev8rerp/componentcontainer/model/formatter',
    'sap/ui/elev8rerp/componentcontainer/services/login.service',
    'sap/ui/elev8rerp/componentcontainer/services/Common.service',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
    'sap/m/MessageBox',
    'sap/ui/elev8rerp/componentcontainer/utility/SessionManager',
    'jquery.sap.storage',
    

], function (BaseController, JSONModel, Device, MessageToast, formatter, loginService, commonService, commonFunction, MessageBox) {
    "use strict";
    return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Login", {
        formatter: formatter,

        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        onInit: function () {
            var url = window.location.hash;
            var tempCompanyCode = url.split('/');
            this.onChkCompTap();
            // if (tempCompanyCode[1] !== 'login') {
            //     // this.getView().byId("cmpcode").setValue(tempCompanyCode[1]);
            //     this.onChkCompTap();
            // }

            var model = new JSONModel();
            model.setData({});
            this.getView().setModel(model, "loginModel");

            this.getView().byId("umobile").setValue('');
            this.getView().byId("pasw").setValue('');

            var model = new JSONModel();
            model.setData({});
            this.getView().setModel(model, "resetPwdModel");

            this.handleRouteMatched(null);

            var currRouteName = this.getOwnerComponent().getModel("applicationModel").getProperty("/routeName");
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            if (this._oRouter.getRoute(currRouteName)) {
                this._oRouter.getRoute(currRouteName).attachMatched(this.handleRouteMatched, this);
            }

            this.extendJQueryPut();

            // Push notification initialization
            this.initOneSingle();
	    this.fnShortCut();
	             },

        handleRouteMatched: function () {
            this.getView().byId("vboxLogin").setVisible(true);
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

        initOneSingle: function () {

            var OneSignal = window.OneSignal || [];

            OneSignal.push(function () {
                OneSignal.init({
                    appId: "69ddb77d-4aa5-488c-afcb-e1146ab59fe4",
                    autoRegister: true,
                    // notifyButton: {
                    //     enable: true,
                    // },
                });
                // OneSignal.showNativePrompt();

                /* These examples are all valid */
                var isPushSupported = OneSignal.isPushNotificationsSupported();
                if (isPushSupported) {
                    // Push notifications are supported

                    //OneSignal.provideUserConsent(true);

                    OneSignal.getUserId(function (userkey) {
                       // localStorage.setItem("userkey", userkey);
                       localStorage.setItem("userkey", "1234567890");
                    });

                    // OneSignal.registerForPushNotifications({
                    //     modalPrompt: true
                    // });

                    OneSignal.on('subscriptionChange', function (isSubscribed) {
                        OneSignal.getUserId(function (userkey) {
                            //localStorage.setItem("userkey", userkey);
                            localStorage.setItem("userkey", "1234567890");
                        });
                    });

                    OneSignal.on('notificationDisplay', function (event) {
                    });

                    OneSignal.on('notificationDismiss', function (event) {
                    });

                } else {
                    // Push notifications are not supported
                    MessageToast.show("Push notifications are not supported");
                }
            });
        },

        onResetLogin: function () {
            // Clear previous session with token and c-token
            MYSAP.SessionManager.clearSession('currentSession');

            // this.getView().byId("cmpcode").setValue('');
            this.getView().byId("umobile").setValue('');
            this.getView().byId("pasw").setValue('');
            this.getView().byId("ufmobile").setValue('');
            
            this.getView().byId("pwd").setValue('');
            this.getView().byId("cpwd").setValue('');

            // this.getView().byId("vboxCmp").setVisible(true);
            this.getView().byId("vboxLogin").setVisible(true);
            this.getView().byId("vboxForPsw").setVisible(false);
        },

        onAfterRendering: function () {
            this.getView().byId("umobile").setValue('');
            this.getView().byId("pasw").setValue('');
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
            } else {
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
            this.getView().byId("vboxLogin").setVisible(true);
            this.getView().byId("vboxForPsw").setVisible(true);
            this.getView().byId("ufmobile").setValue('');
            this.getView().byId("ufcompanycode").setValue('elev8r1');
            //this.getView().byId("ufcompanycode").setValue('POS6296');
            this.getView().byId("pwd").setValue('');
            this.getView().byId("cpwd").setValue('');

            //sendTransNotification
            // commonFunction.sendTransNotification(this,3102,histroydata)
        },

        onGotoLoginLnk: function () {
            this.getView().byId("vboxLogin").setVisible(true);
            this.getView().byId("vboxForPsw").setVisible(false);
            this.getView().byId("resetPsw").setVisible(false);
            this.getView().byId("umobile").setValue('');
            this.getView().byId("pasw").setValue('');
        },

        validateForgetPsw : function(){
            var isValid = true;

            if (!commonFunction.isRequired(this, "ufmobile", "Registered mobile number is required!"))
                isValid = false;

            if (!commonFunction.isRequired(this, "ufcompanycode", "Company code is required!"))
                isValid = false;

            return isValid;
        },

        onForgetPsw: function (oEvent) {

            var mobileno = this.getView().byId("ufmobile").getValue();
            var companycode = this.getView().byId("ufcompanycode").getValue();
            var lModel = this.getView().getModel("loginModel");
            console.log(lModel);
            var currentContext = this;
            var params = {
                mobileno : mobileno,
                companycode : companycode, 
                companyid : lModel.oData.companyid,
                token: lModel.oData.token,
               // userkey: localStorage.getItem("userkey")
                userkey: "1234567890"
            }

            if (this.validateForgetPsw()) {
                loginService.getuserByMobileNo(params,function(data){
                    console.log(data);
                    if(data[0].length){
                        var oModel = currentContext.getView().getModel("resetPwdModel")
                        oModel.setData(data[0]);
                        oModel.oData[0].mobileno = mobileno;
                        oModel.oData[0].companycode = companycode;
                        oModel.refresh();

                        currentContext.getView().byId("vboxForPsw").setVisible(false);
                        currentContext.getView().byId("resetPsw").setVisible(true);
                    }else{
                        MessageBox.error("Please check mobile no. and companycode!")
                    }
                })
            }
            
        },

        validateResetPsw : function(){
            var isValid = true;

            if (!commonFunction.isRequired(this, "pwd", "Password is required!"))
                isValid = false;

            if (!commonFunction.isRequired(this, "cpwd", "Confirm password is required!"))
                isValid = false;

            return isValid;
        },

        onResetPsw : function(){

            var pwd = this.getView().byId("pwd").getValue();
            var cpwd = this.getView().byId("cpwd").getValue();

            if(pwd == cpwd){
                var oModel = this.getView().getModel("resetPwdModel");
                var lModel = this.getView().getModel("loginModel");

                var currentContext = this;

                var params = {
                    companycode : oModel.oData[0].companycode,
                    mobileno : oModel.oData[0].mobileno,
                    id : oModel.oData[0].id, 
                    pwd : pwd,
                    companyid : lModel.oData.companyid,
                    token: lModel.oData.token,
                   // userkey: localStorage.getItem("userkey")
                    userkey: "9021723962"
                }

                if (this.validateResetPsw()) {
                    loginService.resetPwd(params,function(data){
                        console.log(data);
                        if(data.id == 1){
                            MessageToast.show("Password reset successfully!");
                            currentContext.onGotoLoginLnk();
                        }
                    })
                }
            }else{
                MessageBox.error("password and confirm password should be same!");
            }

        },

        onForgetCCLnk : function(){
            // this.getView().byId("vboxCmp").setVisible(false);
            this.getView().byId("vboxForCompanycode").setVisible(true);
        },

        onGotoCompanyCode : function(){
            // this.getView().byId("vboxCmp").setVisible(true);
            this.getView().byId("vboxForCompanycode").setVisible(false);
            this.getView().byId("ufemail").setValue('');
        },

        onForgetCompanyCode : function(oEvent){
            // var urlUser = "logicaldna";
            // var urlPsd = "horse99";
            // var sid = "AALOCH";
            // var smsURL = "http://smslane.com/vendorsms/pushsms.aspx";

            // // This template must be registered in SMSLane website template with Sender Id (sid);
            // //var smsText = "Event ##title## has been updated. Kindly check Aaloch for more details."
            // var smsText = "OTP is C0001 for your registration with Poultry. Do not share OTP for security reasons.";

            //     //var urlMob = mobiles[indx];
            //     var urlMob = "9755088700";

            //     var params = {
            //         user: urlUser,
            //         password: urlPsd,
            //         sid: sid,
            //         msisdn: urlMob,
            //         msg: smsText,
            //         fl: 0,
            //         gwid: 2
            //     };
            //     console.log("params",params);

            //     jQuery.post(smsURL, params, function (result) {
            //     });

            var adminemail = this.getView().byId("ufemail").getValue();
            var currentContext = this;
            loginService.getCompanyCodeByEmailfunction({email : adminemail},function(data){
                if(data[0].length){
                    var params = {
                        from : "savita.g@logicaldna.com",
                        to : adminemail,
                        subject : "PoultryOS Company code",
                        text : "Company code is : "+data[0][0].companycode
                    }
                    loginService.sendCompanycodeByEmail(params,function(data){
                        console.log(data);
                        MessageToast.show("Email sent successfully!");
                        currentContext.onGotoCompanyCode();
                    })
                }else{
                    MessageBox.error("Entered emailid is not registered!");
                    currentContext.getView().byId("ufemail").setValue('');
                }
            })
            
        },

        validateCompCode: function () {
            var isValid = true;

            // if (!commonFunction.isRequired(this, "cmpcode", "Company code is required!"))
            //     isValid = false;

            return isValid;
        },

        onChkCompTap: function (oEvent) {
            var currentContext = this;
            var loginData = {
                companycode: 'elev8r1',
              // companycode: 'POS6296',
            };

            if (this.validateCompCode()) {
                loginService.validateCompany(loginData, function (data) {
                    console.log("validateCompany : ",data);
                    var oModel = currentContext.getView().getModel("loginModel");
                    oModel.oData.companycode = loginData.companycode;
                    oModel.oData.companyid = data.companyid;
                    oModel.oData.token = data.token;
                    oModel.refresh();

                    // currentContext.getView().byId("vboxCmp").setVisible(false);
                    currentContext.getView().byId("vboxLogin").setVisible(true);
                },

                    function (error) {
                        console.log(error);
                        if (error.responseJSON.token == null) {
                            MessageToast.show("Invalid company code submitted, Please enter correct company code!");
                        }
                    });
            }
        },

		  fnShortCut: function () {
            var currentContext = this;
            $(document).keyup(function (evt) {
                if (evt.keyCode === 13) {
                //     if ( currentContext.getView().byId("vboxCmp").getVisible(true)) {
                //     jQuery(document).ready(function ($) {

                //         evt.preventDefault();
                //         currentContext.onChkCompTap()
                //     })
                // }
                // else
                // {
                    
                // }
                currentContext.onLoginTap();
            }
                
            });
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

                // OneSignal.getUserId(function (userkey) {
                //     localStorage.setItem("userkey", userkey);
                // });

                var loginData = {
                    username: this.getView().byId("umobile").getValue(),
                    pwd: this.getView().byId("pasw").getValue(),
                    companycode: oModel.oData.companycode,
                    companyid: oModel.oData.companyid,
                    token: oModel.oData.token,
                    //userkey: localStorage.getItem("userkey")
                    userkey: "9021723962"
                };

                loginService.userLogin(loginData,
                    // Success methods if Login succeeded
                    function (data) {
                        console.log("login data : ",data);
                        // Token data decoded
                        var ca = data.token;
                        var base64Url = ca.split('.')[1];
                        var decodedUser = JSON.parse(window.atob(base64Url));

                        console.log("DATA after login : ",data);

                        // Session created with User data
                        var session = new MYSAP.Session(
                            decodedUser.username,
                            decodedUser.companyid,
                            data.d[0].companyname,
                            data.d[0].email,
                            data.d[0].countrycode,
                            data.d[0].address,
                            data.d[0].detailaddress,
                            data.d[0].companycontact,
                            data.d[0].companyemail,
                            data.d[0].city,
                            data.d[0].pincode,
                            data.d[0].contactno2,
                            data.d[0].faxnumber,
                            data.d[0].department,
                            decodedUser.id,
                            data.d[0].roleids,
                            data.d[0].rolenames,
                            data.token,
                            loginData.token,
                            loginData.userkey);

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
                            console.log("errCode : ",errCode);
                            var errMsg = "";
                            if (errCode.invalidcompanyuser) {
                                errMsg = "Invalid mobile number entered!";
                            } else if (errCode.inactiveuser) {
                                errMsg = "User is inactive, please contact administrator!";
                            } else if (errCode.invalidpwd) {
                                errMsg = "Invalid password entered!";
                            } else if (errCode.userlocked) {
                                errMsg = "User is locked, please contact administrator!";
                            } else if (errCode.accesstoken) {
                                errMsg = "User is already logged in on another machine! Please logout first."
                            }
                            MessageToast.show(errMsg);
                        }
                    });
            }
        },

	
     
        extendJQueryPut: function () {

            jQuery.each(["put", "delete"], function (i, method) {
                jQuery[method] = function (url, data, callback, type) {
                    if (jQuery.isFunction(data)) {
                        type = type || callback;
                        callback = data;
                        data = undefined;
                    }

                    return jQuery.ajax({
                        url: url,
                        type: method,
                        dataType: type,
                        data: data,
                        success: callback
                    });
                };
            });
        }
    });
});

