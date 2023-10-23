sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/utility/Validator',
	'sap/ui/core/ValueState',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/services/Application/ManageEntity.service',
	'sap/ui/elev8rerp/componentcontainer/services/Application/RolePermissions.service',
	'sap/ui/elev8rerp/componentcontainer/formatter/common.formatter',

], function (JSONModel, BaseController, MessageToast, MessageBox, Validator, ValueState, 
					commonFunction, commonService, manageEntityService, rolePermissionsService,
					commonFormatter) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Application.RolePermissions", {

		commonFormatter : commonFormatter,

		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();

			this.treeData = [];
		},
		onBeforeRendering: function () {
			var currentContext = this;

			this.getRoles();
			this.getPermissions();
		},

		session: function (key) {
			var sessionStorage = null;
			var currentSession = MYSAP.SessionManager.getSession('currentSession');

			if (currentSession) {
				sessionStorage = currentSession[key];
			}

			return sessionStorage;
		},

		onAfterRendering: function () {

			var oTreeTable = this.getView().byId("trTblEntity");
			oTreeTable.expandToLevel(4);
		},

		onRoleChange: function(oEvent){
			var selectedItem = oEvent.getSource().getSelectedItem();
			var roleid = selectedItem.mProperties.key;
			
			this.getEntityByRoleList(roleid);
		},

		_setPermissionsOnChange: function (keys, model, path) {
			var cur = model.getProperty(path);
			cur.permissions = keys;
		},
		
		handleSelectionChange: function(oEvent){

			var sel = oEvent.oSource.getSelectedKeys();
			var path = oEvent.oSource.oPropagatedProperties.oBindingContexts.entityListModel.sPath;
			this._setPermissionsOnChange(sel, this.getModel('entityListModel'), path);
		},

		handleSelectionFinish : function(oControlEvent) {
		},

		handleOnChange: function(oControlEvent) {
		},

		checkOnChange: function (e) {
			var path = e.getSource().oPropagatedProperties.oBindingContexts.entityListModel.sPath;

			this._validateChild(this.getModel('entityListModel'), path);
			this._validateParent(this.getModel('entityListModel'), path);
		},

		_validateChild: function (model, path) {
			var cur = model.getProperty(path);
			this._setChildState(cur, cur.checked);
		},

		_setChildState: function (obj, state) {
			var curCxt = this;
			
			this._getChildren(obj).forEach(function (x) {
				x.checked = state;
				x.permissions = curCxt._checkAndSetPermission(x, state);
				curCxt._setChildState(x, state);
			});
			
		},

		_getChildren: function (obj) {
			var children = [];
			Object.getOwnPropertyNames(obj).forEach(function (x) {
				if (typeof obj[x] === 'object') {
					if (obj[x]) {
						children.push(obj[x]);
					}
				}
			});

			return children;
		},

		_checkAndSetPermission: function(obj, state){
			var arrPerm = "";
			if(state == "Unchecked"){
				arrPerm = "";
			}
			else if(state == "Mixed"){
				arrPerm = "1";
			}
			else if(state == "Checked"){
				arrPerm = "1";
			}

			return arrPerm;
		},

		_checkAndSetPermission1: function(obj, state){
			
			if(state == "Unchecked"){
				obj.permissions = "";
			}
			else if(state == "Mixed" || state == "Checked"){
				if(obj.permissions != undefined){

					var perm = [];

					if(obj.permissions instanceof Array){
						perm = obj.permissions;
					}
					else if(obj.permissions !=""){
						perm =obj.permissions.split(',');
					}

					var exists = perm.filter(function (x) { return x == '1'; }).length;
					if(exists == 0){
						if(obj.permissions instanceof Array){
							perm.push("1");
							obj.permissions = perm.join();
						}
						else
							obj.permissions = "1";
					}
				}
				else{
					obj.permissions = "1";
				}
			}
			
			return obj;
		},

		_validateParent: function (model, path) {
			if (path === '/modelData') {
				return;
			}
			
			var obj = model.getProperty(path);
			var state = 'Unchecked';
			var children = this._getChildren(obj);
			var selectedCount = children.filter(function (x) {
				return x.checked === 'Checked';
			}).length;

			if (selectedCount === children.length) {
				obj.checked = 'Checked';
				obj.permissions = this._checkAndSetPermission(obj, "Checked");

			} else {
				var unselectedCount = children.filter(function (x) {
					return x.checked === 'Unchecked';
				}).length;

				if (unselectedCount === children.length) {
					obj.checked = 'Unchecked';
					obj.permissions = this._checkAndSetPermission(obj, "Unchecked");
				} else {
					obj.checked = 'Mixed';
					obj.permissions = this._checkAndSetPermission(obj, "Mixed");
				}
			}

			model.setProperty(path, obj);
			path = path.substring(0, path.lastIndexOf('/'));
			if (path !== '/modelData') {
				this._validateParent(model, path);
			}
		},


		attachRowSelectionChange: function (oEvent) {

			var currElem = oEvent.getParameter("rowContext").getProperty();
			if (currElem.entity.length > 0) {
				var oTreeTable = this.byId("trTblEntity");
				var aSelectedIndices = oTreeTable.getSelectedIndices();
				this.this.setChildState(currElem.entity);

				var rows = oTreeTable.getBinding("rows");
				for (var i = 0; i < rows.aIndices.length; i++) {
					var rowIndex = rows.aIndices[i];
					var model = oTreeTable.getModel();
					var array = this.getSelectedIndices();
				}
			}


			MessageToast.show("RowSelectionChange: rowIndex: " + oEvent.getParameter("rowIndex") +
				" - rowContext: " + oEvent.getParameter("rowContext"));
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


		getEntityByRoleList: function (roleid) {
			var currentContext = this;
			manageEntityService.getAllEntityByRole({ 'roleid' : roleid }, function (data) {

				var jsonObj = currentContext.createTreeJson(data[0]);

				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: jsonObj });
				currentContext.getView().setModel(oModel, "entityListModel");

				var oTreeTable = currentContext.getView().byId("trTblEntity");
				oTreeTable.expandToLevel(4);

			});
		},


		createTreeJson: function (arr) {
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
		},


		onCancel: function () {
			this.oFlexibleColumnLayout = sap.ui.getCore().byId("componentcontainer---manageapplication--fclManageApplication");
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		},

		onSave: function () {

			var entitylist = this.getView().getModel("entityListModel");
			this.readTreeData(entitylist.oData.modelData);
			
		},

		getRoleId: function(){
			return this.getView().byId("cmbRoleList").getSelectedKey();
		},

		getPermissonData: function(obj){
			return {
				roleid: parseInt(this.getRoleId()),
				entityid : obj.id,
				entityname: obj.entityname,
				entitytype: obj.entitytype,
				entitytypeid: obj.entitytypeid,
				permissions: this.arrayTostring(obj.permissions),
				checked: obj.checked,
				parentid: obj.parentid
			}
		},

		arrayTostring: function(param){
			if(param instanceof Array){
				return param.join().replace(/'/g,'').replace(/"/g, ''); 
			}
			return param;
		},

		readTreeData: function(jsonData){

				var tableData = []; //get selected plain data
	   
				if (jsonData) {
	   
					 for (var i = 0; i < jsonData.length; i++) {

						var obj_i = jsonData[i];
						if(obj_i.checked == "Mixed" || obj_i.checked == "Checked")
							tableData.push(this.getPermissonData(obj_i));

						for (var j = 0; j < obj_i.entity.length; j++) {

							var obj_j = obj_i.entity[j];
							if(obj_j.checked == "Mixed" || obj_j.checked == "Checked")
								tableData.push(this.getPermissonData(obj_j));

							for (var k = 0; k < obj_j.entity.length; k++) {

								var obj_k = obj_j.entity[k];
								if(obj_k.checked == "Mixed" || obj_k.checked == "Checked")
									tableData.push(this.getPermissonData(obj_k));

								for (var l = 0; l < obj_k.entity.length; l++) {

									var obj_l = obj_k.entity[l];
									if(obj_l.checked == "Mixed" || obj_l.checked == "Checked")
										tableData.push(this.getPermissonData(obj_l));

										for (var m = 0; l < obj_l.entity.length; m++) {

											var obj_m = obj_l.entity[m];
											if(obj_m.checked == "Mixed" || obj_m.checked == "Checked")
												tableData.push(this.getPermissonData(obj_m));

										}
								}
							}
						}
					 }
				};

			return tableData;
		},
	});
}, true);


