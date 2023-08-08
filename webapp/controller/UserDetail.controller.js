sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/ui/elev8rerp/componentcontainer/formatter/fragment.formatter',
	'sap/ui/elev8rerp/componentcontainer/services/Company/ManageUser.service',
	'sap/ui/elev8rerp/componentcontainer/services/Application/ManageEntity.service',
    'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function'
], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageBox, MessageToast,formatter, manageUserService, manageEntityService, commonFunction) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.UserDetail", {

		formatter : formatter,

		metadata: {
            manifest: "json"
		},
		
		onInit: function () {

			sap.ui.getCore().attachValidationError(function (oEvent) {
				oEvent.getParameter('element').setValueState(ValueState.Error);
			});
			
			sap.ui.getCore().attachValidationSuccess(function (oEvent) {
				oEvent.getParameter('element').setValueState(ValueState.None);
            });
        },

        onBeforeRendering: function () {
		
            this.model = this.getView().getModel("viewModel");

		    if(this.model != undefined){				  
			  this.loadUserData(this.model.id);
			  //role - permissions details

			  this.getView().byId("pnlEntityTree").setVisible(true);
			  this.getEntityByUserRoleList(this.model.id);
			}
			else{

				var oModel = new JSONModel();
				oModel.setData({ id : null} ); 
				this.getView().setModel(oModel,"userDetailModel");
				this.getView().byId("pnlEntityTree").setVisible(false);
			}
		},
		

		loadUserData: function (id) {
            var currentContext = this;
            manageUserService.getUser({id : id}, function (data) {
                var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(data[0][0]);
				data[0][0].active = data[0][0].active == 1? true : false;
				data[0][0].locked = data[0][0].locked == 1? true : false;

				window.editusername = data[0][0].username;

                currentContext.getView().setModel(oModel, "userDetailModel");
            });
        },

		
		// get resource Model
		resourceBundle: function () {
			var currentContext = this;
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},
		
		isIMEI: function (s) {
			var etal = /^[0-9]{15}$/;
			  if (!etal.test(s))
				return false;
			  var sum = 0, mul = 2, l = 14;
			  for (var i = 0; i < l; i++) {
				var digit = s.substring(l-i-1,l-i);
				var tp = parseInt(digit,10)*mul;
				if (tp >= 10)
					 sum += (tp % 10) +1;
				else
					 sum += tp;
				if (mul == 1)
					 mul++;
				else
					 mul--;
				}
			  var chk = ((10 - (sum % 10)) % 10);
			  if (chk != parseInt(s.substring(14,15),10))
				return false;
			  return true;
			},

		validateForm: function (id) {
            var isValid = true;

			if (!commonFunction.isRequired(this, "txtUserName", "User name is required!"))
                isValid = false;

            if (!commonFunction.isRequired(this, "txtMobile", "Mobile is required!"))
				isValid = false;

			if(this.getView().byId("txtEmail") != ""){
				if (!commonFunction.isEmail(this, "txtEmail", "Email is invalid!"))
					isValid = false;
			}

			if (!commonFunction.isIMEI(this, "txtIMEI", "IMEI number is invalid!"))
				isValid = false;
			
			if(id == null){
				if (!commonFunction.isRequired(this, "txtPwd", "Password is required!"))
					isValid = false;
			}

			if (!commonFunction.matchPassword(this, "txtPwd", "txtConfPwd", "Password does not match with Confirm Password!"))
                isValid = false;
				

            return isValid;
        },

		onSave: function () {
			var currentContext = this;
			
			var model = this.getView().getModel("userDetailModel").oData;

            if (this.validateForm(model.id)) {

				model["userid"] = 1;
				model["companyid"] = commonFunction.session("companyId");

                manageUserService.saveUser(model, function (data) {
                    if (data.id > 0) {
						MessageToast.show("User details submitted successfully!");
						
						currentContext.bus = sap.ui.getCore().getEventBus();
                        currentContext.bus.publish("manageuser", "loadUserData");
                        currentContext.onCancel();
                    }
                });
            }
        },

		onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---usermanagement--fclUserManagement");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		},
        
        onDelete : function(oEvent){

			var currentContext = this;

			var deleteMsg = this.resourceBundle().getText("Do you want to delete User "+ window.editusername +"?");
			var OKText = this.resourceBundle().getText("OK");
			var deleteSuccessMsg = this.resourceBundle().getText("User deleted successfully!");
			
			var viewModel = oEvent.getSource().getBindingContext("userDetailModel");
			
			if(this.model != undefined){
				var model = {
					id : this.model.id
				};

				MessageBox.confirm(
					deleteMsg, {
						styleClass:  "sapUiSizeCompact",
						onClose: function(sAction) {
							if(sAction == OKText){

								if(model.id != null) {
									manageUserService.deleteUser(model, function(data){						

										currentContext.bus = sap.ui.getCore().getEventBus();
										currentContext.bus.publish("manageuser", "loadUserData");
										
										currentContext.onCancel();
										MessageToast.show(deleteSuccessMsg);
									});
								}
								
							}
						}
					}
				);          
			}
        },
        
		
		getRoles: function (itemid) {
			var currentContext = this;

			rolePermissionsService.getRoles(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(oModel, "roleModel");
			});
		},

		getPermissions: function (itemid) {
			var currentContext = this;

			rolePermissionsService.getPermissions(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(oModel, "permissionModel");
			});
		},


		getEntityByUserRoleList: function (userid) {
			var currentContext = this;
			manageEntityService.getAllEntityByUser({ 'userid' : userid }, function (data) {
				var jsonObj = currentContext.createTreeJson(data[0]);

				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: jsonObj });
				currentContext.getView().setModel(oModel, "entityListModel");

				var oTreeTable = currentContext.getView().byId("trTblEntity");
				oTreeTable.expandToLevel(4);

			});
		},


		createTreeJson: function (arr) {

			if(arr != undefined){
			var tree = [],
				mappedArr = {},
				arrElem,
				mappedElem;

			for (var i = 0, len = arr.length; i < len; i++) {
				arrElem = arr[i];
				mappedArr[arrElem.id] = arrElem;
				mappedArr[arrElem.id]['entity'] = [];
			}
			for (var id in mappedArr) {
				if (mappedArr.hasOwnProperty(id)) {
					mappedElem = mappedArr[id];
					if (mappedElem.parentid) {
						mappedArr[mappedElem['parentid']]['entity'].push(mappedElem);
					}
					else {
						tree.push(mappedElem);
					}
				}
			}
			return tree;
		}
		return null;
		},
        
	});
}, true);

