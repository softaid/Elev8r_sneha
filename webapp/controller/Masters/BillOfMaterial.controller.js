sap.ui.define([
	"sap/ui/model/json/JSONModel",
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Masters/BillOfMaterial.service',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service'
], function (JSONModel, BaseController, MessageToast, MessageBox, commonFunction, billofMaterialService, commonService) {
	"use strict";

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Masters.BillOfMaterial", {

		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();
			
			this.bus.subscribe("billofmaterial", this.setDetailPage, this);
			this.bus.subscribe("billofmaterial", "handleBillOfMaterialList", this.handleBillOfMaterialList, this);
			this.bus.subscribe("billofmaterial", "onAddbillofmaterial", this.onAddbillofmaterial, this);
			this.bus.subscribe("billofmaterial", "onDeletebillofmaterial", this.onDeletebillofmaterial, this);
			this.oFlexibleColumnLayout = this.byId("fclBillOfMaterial");
			var currentContext = this;

			var emptyModel = this.getModelDefault();
			var model = new JSONModel();
			model.setData(emptyModel);
			this.getView().setModel(model, "billofmaterialModel");

			// set empty model to view		
			var model = new JSONModel();
			model.setData({ modelData: [] });
			this.getView().setModel(model, "tblModel");

			// commonFunction.getItemList(this);
			commonFunction.getEmployeeList(1, this);
			this.loadData();
			//get itemgroup
			commonFunction.getItemGroups(this, "itemGroupModel");

			commonFunction.getNewDocSeries("BOM", this);
			this.fnShortCuts();
			
			this.getView().byId("btnDuplicate").setVisible(false);

			this.flag = false;
			
			this.bomArr = [];
			this.bomDetailArr = [];

			commonFunction.getFeedMillSettingData(this, 726);
		},

		getModelDefault: function () {
			return {
				id: null,
				itemid: null,
				itemname: null,
				itemunitname: null,
				unitcost: null,
				bomdate: commonFunction.getDateFromDB(new Date()),
				quantity: null,
				createdby: null,
				isactive: true,
				note: null,
			}
		},

		handleBillOfMaterialList: function(sChannel, sEvent, oData) {

			let selRow = oData.viewModel;
			let oThis = this;

			if(selRow != null)  {

				if (selRow.action == "view") {
					oThis.getView().byId("btnSave").setEnabled(false);
				} else {
					oThis.getView().byId("btnSave").setEnabled(true);
				}

				oThis.bindBillOfMaterial(selRow.id);

			}

		},

		onAfterRendering: function(){
			jQuery.sap.delayedCall(1000, this, function () {
                this.getView().byId("btnList").focus();
            });
		},

		fnShortCuts:function(){
			var currentContext = this;
			$(document).keydown(function(event){
				if (event.keyCode== 83 && (event.ctrlKey)){
					event.preventDefault();
					jQuery(document).ready(function($) {
						currentContext.onSave()
					})
				}
				if (event.keyCode== 67 && (event.ctrlKey)){
					event.preventDefault();
                jQuery(document).ready(function($) {
                    currentContext.resetModel()
                })
				}
			 })
            
        },

		

		itemgroupSelect: function () {
			var itemgroupid = this.getView().byId("txtItemGroup").getSelectedKey();
			commonFunction.getItemsByItemGroups(itemgroupid, this, "itemList");
		},
		//Dialog for item
		handleItemValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			// if (!this._valueHelpDialog) {
			this._valueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.elev8rerp.componentcontainer.fragmentview.Common.ItemDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);
			// }
			this._valueHelpDialog.open(sInputValue);
		},

		_handleItemSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['itemcode', 'itemname'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		onItemDialogClose: function (oEvent) {
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");

			// if(aContexts != undefined){
			var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });
			var oModel = currentContext.getView().getModel("billofmaterialModel");

			//update existing model to set locationid
			oModel.oData.itemid = selRow[0].id;
			oModel.oData.itemname = selRow[0].itemname;
			oModel.oData.itemunitname = selRow[0].itemunitname;
			oModel.oData.unitid = selRow[0].itemunitid;


			this.getBOMByItemid(selRow[0].id);
			oModel.refresh();



		},

		getBOMByItemid: function (itemid) {
			var currentContext = this;
			var bomCode = this.getView().byId('textbmcode').getValue();
			billofMaterialService.getBomByItemid({ itemid: itemid, bomcode: bomCode }, function (data) {

				if (data[0].length > 0) {
					currentContext.bindBillOfMaterial(data[0][0].bomid);
				}

				//
			});


		},
		itemTotal: function () {
			var oModel = this.getView().getModel("billofmaterialModel");
			var tblModel = this.getView().getModel("tblModel").oData.modelData;

			var basicCost = 0;
			var itemcost = 0;
			var itemtotalqty = 0;
			for (var i = 0; i < tblModel.length; i++) {

				basicCost = tblModel[i].quantity * tblModel[i].unitcost;
				itemcost += parseFloat(basicCost);
				itemtotalqty += parseFloat(tblModel[i].quantity)
				// oModel.oData.unitcost += parseInt(basicCost);
			}
			var unitcost = parseFloat(itemcost / oModel.oData.quantity).toFixed(4);
			oModel.oData.unitcost = unitcost;
			oModel.oData.itemtotalqty = parseFloat(itemtotalqty).toFixed(3);
			oModel.refresh();
		},


		onExit: function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},
		onAddbillofmaterial: function (sChannel, sEvent, oData) {
			var validModel = this.getView().getModel("tblModel").oData.modelData;
			var planedqty = this.getView().byId('quantity').getValue();
			var totalitemQty = this.totalQty();

			var jsonStr = oData.data;

			var oModel = this.getView().getModel("tblModel");

			var flag = true
			if (jsonStr["index"] == null) {
				for (var i = 0; i < validModel.length; i++) {
					if (validModel[i].itemid == jsonStr.itemid) {
						flag = false;
						MessageBox.error("Item already exist!");
						break;
					}
				}
			}

			if (flag) {

				if (jsonStr["index"] == null) { //add new shed pen
					// push new record in object
					jsonStr["rowstatus"] = "New";
					oModel.oData.modelData.push(jsonStr);

				}
				if (jsonStr["index"] != null) { //update existing shed pen
					var tableData = oModel.getData();

					// Replace the record in the array
					jsonStr["rowstatus"] = "Edited";
					tableData.modelData.splice(jsonStr["index"], 1, jsonStr);
				}
				oModel.refresh();
				this.itemTotal();
			}

		},
		qtyValidation:function(){
			var totalitemQty = this.totalQty();
			var planedqty = this.getView().byId('quantity').getValue();
			if (planedqty != parseFloat(totalitemQty)){
				MessageBox.error("BOM quantity and total item quantity should be equal!");
				return false;
				
			}else{
				return true;
			
			}
		},
		totalQty: function () {
			var childModel = this.getView().getModel("tblModel").oData.modelData;

			var totalitemQty = 0;
			for (var i = 0; i < childModel.length; i++) {
				totalitemQty += parseFloat(childModel[i].quantity);
			}
			return totalitemQty.toFixed(3)
		},


		onAddNewRow: function () {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("billofmaterial", { viewName: "BillOfMaterialDetail" });
		},

		onListItemPress: function (oEvent) {
			var totalitemQty = this.totalQty();
			var viewModel = oEvent.getSource().getBindingContext("tblModel");
			var spath = viewModel.sPath.split("/");
			var rowIndex = spath[spath.length - 1];
			var model = {
				id: viewModel.getProperty("id") ? viewModel.getProperty("id") : null,
				itemid: viewModel.getProperty("itemid"),
				bomid: viewModel.getProperty("bomid"),
				parentid: viewModel.getProperty("parentid"),
				quantity: viewModel.getProperty("quantity"),
				itemname: viewModel.getProperty("itemname"),
				unitid: viewModel.getProperty("unitid"),
				unitcost: viewModel.getProperty("unitcost"),
				itemunitname: viewModel.getProperty("itemunitname"),
				materialtype: viewModel.getProperty("materialtype"),
				materialtypeid: viewModel.getProperty("materialtypeid"),
				parentitemname: viewModel.getProperty("parentitemname"),
				index: rowIndex,
				rowstatus: "Edited",
				curitemQty: totalitemQty - viewModel.getProperty("quantity"),
				bomplanedQty: this.getView().byId('quantity').getValue()
			};
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("billofmaterial", { viewName: "BillOfMaterialDetail", viewModel: model });


		},

		onListIconPress: function (oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("sap.ui.elev8rerp.componentcontainer.fragmentview.FeedMill.Master.billOfMaterialDialog", this);
			}
			// Multi-select if required
			var bMultiSelect = !!oEvent.getSource().data("multi");
			this._oDialog.setMultiSelect(bMultiSelect);
			// Remember selections if required
			var bRemember = !!oEvent.getSource().data("remember");
			this._oDialog.setRememberSelections(bRemember);
			this.getView().addDependent(this._oDialog);
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},

		handleBOMSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var columns = ['itemname'];
			var oFilter = new sap.ui.model.Filter(columns.map(function (colName) {
				return new sap.ui.model.Filter(colName, sap.ui.model.FilterOperator.Contains, sValue);
			}),
				false);  // false for OR condition
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleBOMClose: function (oEvent) {
			var currentContext = this;
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts != undefined) {
				var selRow = aContexts.map(function (oContext) { return oContext.getObject(); });

				currentContext.bindBillOfMaterial(selRow[0].id);
				this.getView().byId("btnDuplicate").setVisible(true);

			} else {

			}
		},

		bindBillOfMaterial: function (id) {
			var currentContext = this;
			billofMaterialService.getBillOfMaterial({ id: id }, function (data) {
				// Update current series with existing series number
				var seriesModel = currentContext.getView().getModel("docSeriesModel");
				seriesModel.oData.newseries = data[0][0].bomno;
				seriesModel.refresh();
				data[0][0].isactive = data[0][0].isactive == 1 ? true : false;
				var oModel = currentContext.getView().getModel("billofmaterialModel");
				oModel.setData(data[0][0]);
				oModel.refresh();
			});
			this.bindtable(id);
		},


		bindtable: function (id) {
			var currentContext = this;
			var arry = [];
			billofMaterialService.getAllBillOfMaterialDetailResult({ bomid: id }, function (data) {
				console.log("data",data)
				var tblModel = currentContext.getView().getModel("tblModel");

				tblModel.setData({ modelData: data[0] });
				tblModel.refresh();


				var oModel = new sap.ui.model.json.JSONModel();

				var map = {}, node, roots = [], i;
					if(data[1].length>0){
				for (i = 0; i < data[1].length; i += 1) {
					map[data[1][i].itemid] = i; // initialize the map
					data[1][i].children = []; // initialize the children
				}
				for (i = 0; i < data[1].length; i += 1) {
					node = data[1][i];
					if (node.parentid !== null) {
						// if you have dangling branches check that map[node.parentId] exists
						data[1][map[node.parentid]].children.push(node);
					} else {
						roots.push(node);
					}
				}

				oModel.setData({ modelData: roots });
				currentContext.getView().setModel(oModel, "bomTreeModel");
					}

				currentContext.itemTotal();
				//
			});
		},

		resourceBundle: function () {
			var currentContext = this;
			var oBundle = this.getModel("i18n").getResourceBundle()
			return oBundle
		},


		onSave: function () {
			var currentContext = this;
			if (this.validateForm()) {
				var parentModel = this.getView().getModel("billofmaterialModel").oData;
				var childModel = this.getView().getModel("tblModel").oData.modelData;
				if(this.flag)
					parentModel["id"] = null;
				parentModel["bomdate"] = commonFunction.getDate(parentModel.bomdate);
				parentModel["companyid"] = commonService.session("companyId");
				parentModel["userid"] = commonService.session("userId");
				parentModel["bomno"] = this.getView().byId('txtbomno').getValue();

				billofMaterialService.saveBillOfMaterial(parentModel, function (data) {

					if (data.id > 0) {
						var bomid = data.id;
						var parentid = parentModel.itemid;
						// insert/edit record in child table 
						for (var i = 0; i < childModel.length; i++) {
							if(currentContext.flag)
								childModel[i]["id"] = null;	
							childModel[i]["bomid"] = bomid;
							//  }
							childModel[i]["companyid"] = commonService.session("companyId");
							childModel[i]["userid"] = commonService.session("userId");
							childModel[i]["parentid"] = parentid;
							billofMaterialService.saveBillOfMaterialDetail(childModel[i], function (data) {
								var Savemsg = currentContext.resourceBundle().getText("feedMillBOMSaveMag");
								MessageToast.show(Savemsg);
								currentContext.loadData();
							})
						}
					}
				})


				currentContext.resetModel();
				this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
			}
		},

		validateForm: function () {
			var isValid = true;
			var BOMCodeMsg = this.resourceBundle().getText("feedMillBOMvalidMsgBomCode");
			var ItemNameMsg = this.resourceBundle().getText("feedMillBOMvalidMsgItem");
			var qtyMsg = this.resourceBundle().getText("feedMillBOMvalidMsgQty");

			console.log(this.bomArr);
			console.log(this.bomDetailArr);

			var parentModel = this.getView().getModel("billofmaterialModel").oData;
			var childModel = this.getView().getModel("tblModel").oData.modelData;

			if (!commonFunction.isRequired(this, "textbmcode", BOMCodeMsg))
				isValid = false;

			if (!commonFunction.isRequired(this, "txtitemname", ItemNameMsg))
				isValid = false;

			if (!commonFunction.isRequired(this, "quantity", qtyMsg))
				isValid = false;
			if (!commonFunction.isSelectRequired(this, "txtCreatedBy", "Created by is required !"))
				isValid = false;

			if(!this.qtyValidation())
				isValid = false;

			var cnt = 0;

			for(var i = 0; i < childModel.length; i++){
				for(var j = 0; j < this.bomDetailArr.length; j++){
					if((childModel[i].itemid == this.bomDetailArr[j].itemid) && (childModel[i].quantity == this.bomDetailArr[j].quantity)){
						cnt ++;
					}
				}
			}

			if(parentModel.bomcode != this.bomArr.bomcode){
				if(cnt == childModel.length && cnt == this.bomDetailArr.length && parentModel.itemid == this.bomArr.itemid){
					MessageBox.error("Same items with same quantity are not allowd for multiple BOM!");

					isValid = false;
				}				
			}else{
				MessageBox.error("BOM code should be unique!");

				isValid = false;
			}

			return isValid;
		},


		loadData: function () {
			var currentContext = this;

			billofMaterialService.getAllBillOfMaterialResult(function (data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ modelData: data[0] });
				currentContext.getView().setModel(oModel, "billOfMaterialList");
				//
			});
		},


		resetModel: function () {

			var emptyModel = this.getModelDefault();
			var model = this.getView().getModel("billofmaterialModel");
			model.setData(emptyModel);

			var tableModel = this.getView().getModel("tblModel");
			tableModel.setData({ modelData: [] });

			this.loadData();

			//get itemgroup
			commonFunction.getItemGroups(this, "itemGroupModel");

			commonFunction.getNewDocSeries("BOM", this);
		},


		setDetailPage: function (channel, event, data) {

			this.detailView = sap.ui.view({
				viewName: "sap.ui.elev8rerp.componentcontainer.view.Masters." + data.viewName,
				type: "XML"
			});

			this.detailView.setModel(data.viewModel, "viewModel");
			this.oFlexibleColumnLayout.removeAllMidColumnPages();
			this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
		},

		onDeletebillofmaterial: function (sChannel, sEvent, oData) {

			var oModel = this.getView().getModel("tblModel");
			var tableData = oModel.getData();
			// Find the index of the object via id
			var index = tableData.modelData
				.map(function (pen) { return pen.id; })
				.indexOf(oData.data.id);

			// delete record in the array
			tableData.modelData.splice(index, 1);
			oModel.refresh();

		},

		onCopyPaste : function(){
			var oModel = this.getView().getModel("billofmaterialModel");
			var tblModel = this.getView().getModel("tblModel");
			var transactionid = oModel.oData.id;
			var itemgroupid = oModel.oData.itemgroupid;

			this.bomArr = oModel.oData;
			this.bomDetailArr = tblModel.oData.modelData;

			this.resetModel();

			this.bindBillOfMaterial(transactionid);

			this.bindtable(transactionid);

			commonFunction.getItemsByItemGroups(itemgroupid, this, "itemList");

			commonFunction.getNewDocSeries("BOM", this);
			
			this.flag = true;

			this.getView().byId("btnDuplicate").setVisible(false);
		},
	});
}, true);
