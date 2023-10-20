sap.ui.define([
	'sap/ui/elev8rerp/componentcontainer/controller/BaseController',
	'jquery.sap.global',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/ResponsivePopover',
	'sap/m/MessagePopover',
	'sap/m/ActionSheet',
	'sap/m/Button',
	'sap/m/Link',
	'sap/m/Bar',
	'sap/ui/layout/VerticalLayout',
	'sap/m/NotificationListItem',
	'sap/m/MessagePopoverItem',
	'sap/ui/core/CustomData',
	'sap/m/MessageToast',
	'sap/ui/Device',
	'sap/ui/elev8rerp/componentcontainer/control/XNavigationListItem',
	'sap/ui/model/Filter',
	'sap/ui/elev8rerp/componentcontainer/controller/Common/Common.function',
	'sap/ui/elev8rerp/componentcontainer/services/Common.service',
	'sap/ui/elev8rerp/componentcontainer/services/Company/ManageUser.service',
	'sap/ui/elev8rerp/componentcontainer/utility/SessionManager',
	'jquery.sap.storage',
], function (BaseController, jQuery, Fragment, Controller, JSONModel, ResponsivePopover,
	MessagePopover, ActionSheet, Button, Link, Bar, VerticalLayout, NotificationListItem,
	MessagePopoverItem, CustomData, MessageToast, Device, XNavigationListItem, Filter, commonFunction, commonService, manageruserService) {

	"use strict";
	var _navigationKeys = ["home", "dailyTransaction", "settings", "breederlocation"];

	return BaseController.extend("sap.ui.elev8rerp.componentcontainer.controller.Master", {

		_bExpanded: true,

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onInit: function () {
			

			var dateTimeModel = new JSONModel();
			dateTimeModel.setData({
				valueDTP3: new Date()
			});
			this.getView().setModel(dateTimeModel);
			console.log(this.getView().setModel(dateTimeModel));
			var currentContext = this;
			if (commonFunction.session("userId") != null)
				this.getUserPermissions();
			else {
				this.getRouter().getTargets().display("login", {});
				this.getRouter().navTo("login", true);
			}

			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("masterpage", "getUserPermissions", this.getUserPermissions, this);
			this.bus.subscribe("masterpage", "notificationHistoryPopupList", this.notificationHistoryPopupList, this);
			this.bus.subscribe("masterpage", "redirectToTransaction", this.redirectToTransaction, this);

			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

			// Transaction Notification cached in browser
			commonService.getTransactionNotificationAll(function (data) {
				var oModel = currentContext.getView().getModel("notificationsTemplateModel");
				oModel.oData.modelData = data[0];
				oModel.refresh();
			});

			// // Notification Placeholders cached in browser
			commonService.getNotificationCreatedFor({ userid: commonFunction.session("userId") }, function (data) {
				var oModel = currentContext.getView().getModel("notificationCreatedForModel");
				oModel.oData.modelData = data[0];
				oModel.refresh();
			});

			// if the app starts on desktop devices with small or meduim screen size, collaps the sid navigation
			if (Device.resize.width <= 1024) {
				this.onSideNavButtonPress();
			}

			Device.media.attachHandler(function (oDevice) {
				if ((oDevice.name === "Tablet" && this._bExpanded) || oDevice.name === "Desktop") {
					this.onSideNavButtonPress();
					this._bExpanded = (oDevice.name === "Desktop");
				}
			}.bind(this));

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.attachRouteMatched(this.routeMatched, this);

			this.sUserid = commonFunction.session("userId");

			this.oSF = this.getView().byId("searchField");

			var sKey = this.getRouter()._oRouter._prevMatchedRequest
			this.getRouter().getTargets().display(sKey, {});
			this.getRouter().navTo(sKey);
			// this.getUserKeyshortcut();

			var count = 0;
			setInterval(function () {
				$('body').mousemove(function (evt) {
					count = 0;
				});
				$('body').keypress(function (evt) {
					count = 0;
				});
				count++;
				if (count > 20) {
					if (MYSAP.SessionManager.getSession("currentSession") != null) {
					commonService.userLogout(function(data){
					if(data.length>0){
					if(data[0][0].accesstoken == null){
						// Clear currentSession Session
						MYSAP.SessionManager.clearSession('currentSession');
						localStorage.removeItem('currentSession');

						// Sent to login screen prior to session destroy
						oRouter.getTargets().display("", {});
						oRouter.navTo("", true);
					}
				     }
				})
			          }
				}
			}, 60000);
			
		window.setTimeout(this.defaultfunction(), 5000);


		},

		defaultfunction: function () {
			$(window).bind('beforeunload', function (eventObject) {
				if ($(window).load) {
					commonService.userLogout(function (data) {
						if (data.length > 0) {
							if (data[0][0].accesstoken != null) {
								MYSAP.SessionManager.clearSession('currentSession');
								localStorage.removeItem('currentSession');
							}
						}
					});

				}
				else {
					var returnValue = undefined;
					commonService.userLogout(function (data) {
						if (data.length > 0) {
							if (data[0][0].accesstoken == null) {
								MYSAP.SessionManager.clearSession('currentSession');
								localStorage.removeItem('currentSession');

							}
						}
					});
				}
				returnValue = "Do you really want to close?";
				eventObject.returnValue = returnValue;
				return returnValue;
			});
		},

		getUserKeyshortcut: function () {
			var currentContext = this;
			$('body').keydown(function (evt) {
				var keydata = evt.key;
				if (evt.key == 'F1' || evt.key == 'F2' || evt.key == 'F3' || evt.key == 'F4'|| 		evt.key == 'F5' || evt.key == 'F7' || 	evt.key == 'F8'||evt.key == 'F9' || 	evt.key == 'F10' || evt.key == 'F11' || evt.key == 'F12'){
					jQuery('body').ready(function ($) {
						evt.preventDefault();
						commonService.getRolewisePageKey({ roleids: commonFunction.session("roleIds") }, function (data) {
							if (data) {
								for (var i = 0; i < data[0].length; i++) {
									if (keydata == data[0][i].key) {
										currentContext.getRouter().getTargets().display(data[0][i].pagekey, {});
										currentContext.getRouter().navTo(data[0][i].pagekey);
									}
								}
							}
						});
					});
				}
			});

		},


		routeMatched: function (oEvent) {
			// https://tutel.me/c/programming/questions/42325406/how+can+i+get+current+route

			var oParameters = oEvent.getParameters();
			var sRouteName = oParameters.name; // Yay! Our route name!
			var oModel = this.getView().getModel("applicationModel");
			oModel.setProperty("/routeName", sRouteName);

			// Session exists but page key removed, then go to home
			if (MYSAP.SessionManager.getSession("currentSession") != null && sRouteName == "login") {
				this.getRouter().getTargets().display("home", {});
				this.getRouter().navTo("home", true);
			}

			this.userName = commonFunction.session("userName");
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				username: commonFunction.session("userName"),
				companyname: commonFunction.session("companyname"),
				countrycode: commonFunction.session("countrycode"),
				address: commonFunction.session("address"),
				detailaddress: commonFunction.session("detailaddress"),
				companycontact: commonFunction.session("companycontact"),
				companyemail: commonFunction.session("companyemail"),
				city: commonFunction.session("city"),
				pincode: commonFunction.session("pincode"),
				contactno2: commonFunction.session("contactno2"),
				faxnumber: commonFunction.session("faxnumber"),
			});

			this.getView().setModel(oModel, "userDataModel");

			if (!commonFunction.ensureLoggedIn(this)) {
				return false;
			}

			// First time popup data call
			this.getNotificationHistoryPopupList(3); // limited list

			var currentContext = this;
			// Call notification data on every 20 seconds
			setInterval(function () {
				currentContext.getNotificationHistoryPopupList(3);
			}, 20000);
		},
		notificationHistoryPopupList: function (sChannel, sEvent, oData) {
			this.getNotificationHistoryPopupList(oData.data.limit);
		},

		getNotificationHistoryPopupList: function (limit) {
			var currentContext = this;
			commonService.getNotificationHistoryPopupList({ limit: limit }, function (data) {
				var oModel = currentContext.getView().getModel("notificationPopupModel");
				oModel.oData.modelData = data[0];
				oModel.refresh();

				// currentContext.getView().byId("notificationcount").setText(data[0].length > 0 ? data[0][0].unreadcount : 0);
			});
		},


		redirectToTransaction: function (sChannel, sEvent, oData) {
			sap.m.MessageToast.show("Redirecting to transaction page....");

			// Read Notification
			this.readNotifications(oData.id, this);

			// Redirect to transaction
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getTargets().display(oData.pagekey, { id: oData.transactionid });
			oRouter.navTo(oData.pagekey, true);
		},

		readNotifications: function (id, currentContext) {
			var model = { "userid": commonService.session("userId"), "notificationids": id.toString() }
			commonService.readNotifications(model, function (data) {
				if (data) {
					currentContext.bus = sap.ui.getCore().getEventBus();
					currentContext.bus.publish("loaddata", "loadData");
					currentContext.bus.publish("masterpage", "notificationHistoryPopupList", { data: { limit: 3 } });
				}
			});
		},

		getUserPermissions: function () {

			var currentContext = this;

			var oNavigationList = this.byId('oNavigationList');
			var oFixedNavigationList = this.byId('oFixedNavigationList');

			if (oNavigationList)
				oNavigationList.removeAllItems();
			if (oFixedNavigationList)
				oFixedNavigationList.removeAllItems();

			manageruserService.getUserPermissions({ id: commonFunction.session("userId") }, function (data) {

				var oModel = new sap.ui.model.json.JSONModel();
				var oeModel = new sap.ui.model.json.JSONModel();

				if (data.length > 0) {
					var filteredData = $.grep(data[0],
						function (elementOfArray, indexInArra) {
							return elementOfArray.pk != null
						});
					oModel.setData({ modelData: filteredData });

					// Entity Model
					oeModel.setData({ modelData: data[0] });
					currentContext.getView().setModel(oeModel, "userEntityModel");
					var pageData = data[0];

					setTimeout(function () {

						var oModel = currentContext.getView().getModel("applicationModel");
						if (oModel != null) {
							var found = false;
							var routeName = oModel.oData.routeName;
							if (["home", "dashboard"].indexOf(routeName) > -1) {
								found = true;
							} else {
								for (var i = 0; i < data[0].length; i++) {
									if (data[0][i].pk == routeName) {
										found = true;
										break;
									}
								}
							}
						}

						currentContext.initSideNavigation(pageData);
					}, 800);
				}
				else {

					currentContext.initSideNavigation(null);

					oModel.setData({ modelData: [] });
				}

				// User Filtered Page Model
				currentContext.getView().setModel(oModel, "userPageModel");
			});
		},


		checkValidPage: function () {

		},

		createTreeJson: function (arr) {
			var tree = [],
				mappedArr = {},
				arrElem,
				mappedElem;

			for (var i = 0, len = arr.length; i < len; i++) {
				arrElem = arr[i];
				mappedArr[arrElem.e] = arrElem;
				mappedArr[arrElem.e]['entity'] = [];
			}
			for (var e in mappedArr) {
				if (mappedArr.hasOwnProperty(e)) {
					mappedElem = mappedArr[e];
					if (mappedElem.pr) {
						mappedArr[mappedElem['pr']]['entity'].push(mappedElem);
					}
					else {
						tree.push(mappedElem);
					}
				}
			}
			return tree;
		},


		onAfterRendering: function () {

		},

		checkIsExists: function (arrEle, arrParm) {
			if (arrEle.eid != undefined) {
				var found = false;

				if (arrEle.eid.length > 0 && arrEle.eid[0] == "0")
					return true;

				for (var i = 0; i < arrEle.eid.length; i++) {
					if (arrParm.indexOf(arrEle.eid[i]) > -1) {
						found = true;
						break;
					}
				}

				return found;
			}
			return false;
		},

		ifEidCheckIsExists: function (arrEle, arrParm) {

			var islocal = true
			if (islocal) {
				return true;
			}

			if (arrEle.eid != undefined) {
				var found = false;
				for (var i = 0; i < arrEle.eid.length; i++) {
					if (arrParm.indexOf(arrEle.eid[i]) > -1) {
						found = true;
						break;
					}
				}
				return found;
			}
			else
				return true;
		},

		initSideNavigation: function (menusData) {
			var oSideNavigation = this.byId('oSideNavigation');
			var oNavigationList = this.byId('oNavigationList');
			var oFixedNavigationList = this.byId('oFixedNavigationList');
			var oModelSideNav = new JSONModel("model/sideContent.json");
			var currentContext = this;

			oModelSideNav.attachRequestCompleted(function (oEvent) {

				var navigation = oModelSideNav.getData("/")["navigation"];
				var fixednavigation = oModelSideNav.getData("/")["fixedNavigation"];

				var arrParm = [];
				if (menusData) {
					for (var i = 0; i < menusData.length; i++) {
						arrParm.push(menusData[i].e);
					}
				}

				//destroy previous attached items ----


				if (navigation instanceof Array) {
					for (var i = 0; i < navigation.length; i++) {
						var itemI = navigation[i];

						if (currentContext.checkIsExists(itemI, arrParm)) {

							var oNavI = new XNavigationListItem("", {
								text: itemI["title"],
								icon: itemI["icon"],
								key: itemI["key"],
								expanded: itemI["expanded"]
							});

							for (var j = 0; j < itemI["items"].length; j++) {
								var itemJ = itemI["items"][j];

								if (currentContext.checkIsExists(itemJ, arrParm)) {

									var oNavJ = new XNavigationListItem("", {
										text: itemJ["title"],
										icon: itemJ["icon"],
										key: itemJ["key"],
										expanded: itemJ["expanded"],
									});

									for (var k = 0; k < itemJ["items"].length; k++) {
										var itemK = itemJ["items"][k];

										if (currentContext.checkIsExists(itemK, arrParm)) {

											var oNavK = new XNavigationListItem("", {
												text: itemK["title"],
												icon: itemK["icon"],
												key: itemK["key"],
												expanded: itemK["expanded"]
											});

											for (var l = 0; l < itemK["items"].length; l++) {
												var itemL = itemK["items"][l];

												if (currentContext.checkIsExists(itemL, arrParm)) {

													var oNavL = new XNavigationListItem("", {
														text: itemL["title"],
														icon: itemL["icon"],
														key: itemL["key"],
														expanded: itemL["expanded"]
													});

													oNavK.addItem(oNavL);
												}
											}

											oNavJ.addItem(oNavK);
										}
									}

									oNavI.addItem(oNavJ);
								}

							}
							oNavigationList.addItem(oNavI);
						}


						oSideNavigation.setItem(oNavigationList);
					}
				}

				if (fixednavigation instanceof Array) {
					for (var i = 0; i < fixednavigation.length; i++) {
						var itemI = fixednavigation[i];

						if (currentContext.ifEidCheckIsExists(itemI, arrParm)) {

							var oNavI = new XNavigationListItem("", {
								text: itemI["title"],
								icon: itemI["icon"],
								key: itemI["key"],
								expanded: itemI["expanded"]
							});

							oFixedNavigationList.addItem(oNavI);
						}
						oSideNavigation.setFixedItem(oFixedNavigationList);
					}
				}
			});
		},



		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @param {sap.ui.base.Event} oEvent The item select event
		 */
		onItemSelect: function (oEvent) {
			//  sap.ui.core.BusyIndicator.show();

			var oItem = oEvent.getParameter('item');
			var sKey = oItem.getKey();

			// if the device is phone, collaps the navigation side of the app to give more space
			if (Device.system.phone) {
				this.onSideNavButtonPress();
			}

			if (sKey != "") {
				if (sKey == "logout") {
					this.fnLogoutPress("");
				}else{
					this.getRouter().getTargets().display(sKey, {});
					this.getRouter().navTo(sKey);
				}
			}

		},

		clearAllonLogout: function () {

			var oModel = currentContext.getView().getModel("userEntityModel");
			oModel.oData.modelData = [];
			oModel.refresh();

			var oNavigationList = this.byId('oNavigationList');
			var oFixedNavigationList = this.byId('oFixedNavigationList');
			oNavigationList.removeAllItems();
			oFixedNavigationList.removeAllItems();

			// clear cache
			location.reload(true);
		},

		onUserNamePress: function (oEvent) {
			var oBundle = this.getModel("i18n").getResourceBundle();
			var oToolPage = this.getView().byId("app");
			var gRoute = this.getRouter();
			var navBtn = this.getView().byId("sideNavigationToggleButton");

			// close message popover
			var oMessagePopover = this.byId("errorMessagePopover");
			if (oMessagePopover && oMessagePopover.isOpen()) {
				oMessagePopover.destroy();
			}
			var fnHandleUserMenuItemPress = function (oEvent) {
				MessageToast.show(oEvent.getSource().getText() + " was pressed");
			};
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			var fnLogoutPress = function (oEvent) {

				MessageToast.show("Please Wait..", { duration: 1500, my: "center top", at: "center top" });
				 commonService.userLogout(function(data){
					if(data[0][0].accesstoken == null){
						// Clear currentSession Session
						MYSAP.SessionManager.clearSession('currentSession');
						localStorage.removeItem('currentSession');

						// Sent to login screen prior to session destroy
						oRouter.getTargets().display("", {});
						oRouter.navTo("", true);
					}
				})
				
			};

			var fnCompanySettingPress = function (oEvent) {
				// MYSAP.SessionManager.setSession('currentSession', session);
				oRouter.getTargets().display("chome", {});
				oRouter.navTo("chome", true);
			};

			

			var oActionSheet = new ActionSheet(this.getView().createId("userMessageActionSheet"), {
				title: oBundle.getText("userHeaderTitle"),
				showCancelButton: false,
				buttons: [
					new Button({
						text: 'User Settings',
						type: sap.m.ButtonType.Transparent
					}),
					new Button({
						text: 'Company Setting',
						type: sap.m.ButtonType.Transparent,
						press: fnCompanySettingPress
					}),
					new Button({
						text: 'Logout',
						type: sap.m.ButtonType.Transparent,
						press: fnLogoutPress
					})
				],
				afterClose: function () {
					oActionSheet.destroy();
				}
			});

			// forward compact/cozy style into dialog
			jQuery.sap.syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(), this.getView(), oActionSheet);
			oActionSheet.openBy(oEvent.getSource());
		},


		fnLogoutPress : function (oEvent) {
			let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			MessageToast.show("Please Wait..", { duration: 1500, my: "center top", at: "center top" });
			commonService.userLogout(function (data) {
				if (data[0][0].accesstoken == null) {
					// Clear currentSession Session
					MYSAP.SessionManager.clearSession('currentSession');
					localStorage.removeItem('currentSession');

					// Sent to login screen prior to session destroy 
					//login page name property passesd instead of blank value for logout issue now navigation done successfully
					oRouter.getTargets().display("login", {});
					oRouter.navTo("login", true);
				}
			})	

		},

		onAppPress: function () {
			var oToolPage = this.getView().byId("app");
			var bSideExpanded = oToolPage.getSideExpanded();
			this._setToggleButtonTooltip(bSideExpanded);
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getTargets().display("home", {});
			oRouter.navTo("home", true);
			this.getView().byId("sideNavigationToggleButton").setVisible(true)
		},

		onSideNavButtonPress: function () {
			var oToolPage = this.byId("app");
			var bSideExpanded = oToolPage.getSideExpanded();
			this._setToggleButtonTooltip(bSideExpanded);
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},

		_setToggleButtonTooltip: function (bSideExpanded) {
			var oToggleButton = this.byId('sideNavigationToggleButton');
			if (bSideExpanded) {
				oToggleButton.setTooltip('Large Size Navigation');
			} else {
				oToggleButton.setTooltip('Small Size Navigation');
			}
		},

		// Errors Pressed
		onMessagePopoverPress: function (oEvent) {
			if (!this.byId("errorMessagePopover")) {
				var oMessagePopover = new MessagePopover(this.getView().createId("errorMessagePopover"), {
					placement: sap.m.VerticalPlacementType.Bottom,
					items: {
						path: 'alerts>/alerts/errors',
						factory: this._createError
					},
					afterClose: function () {
						oMessagePopover.destroy();
					}
				});
				this.byId("app").addDependent(oMessagePopover);
				// forward compact/cozy style into dialog
				jQuery.sap.syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(), this.getView(), oMessagePopover);
				oMessagePopover.openBy(oEvent.getSource());
			}
		},

		/**
		 * Event handler for the notification button
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
		onNotificationPress: function (oEvent) {
			var currentContext = this;
			var oBundle = this.getModel("i18n").getResourceBundle();
			// close message popover
			var oMessagePopover = this.byId("errorMessagePopover");
			if (oMessagePopover && oMessagePopover.isOpen()) {
				oMessagePopover.destroy();
			}
			var oButton = new Button({
				text: oBundle.getText("notificationButtonText"),
				press: function () {
					currentContext.getRouter().getTargets().display("notifications", {});
					currentContext.getRouter().navTo("notifications", true);

					//Remove prevously created Popup object
					oNotificationPopover.destroy();
				}
			});

			var oNotificationPopover = new ResponsivePopover(this.getView().createId("notificationMessagePopover"), {
				title: oBundle.getText("Notifications"),
				contentWidth: "300px",
				endButton: oButton,
				placement: sap.m.PlacementType.Bottom,

				content: {
					path: 'notificationPopupModel>/modelData',
					factory: this._createNotification
				},
				afterClose: function () {
					oNotificationPopover.destroy();
				}
			});
			this.byId("app").addDependent(oNotificationPopover);
			// forward compact/cozy style into dialog
			jQuery.sap.syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(), this.getView(), oNotificationPopover);
			oNotificationPopover.openBy(oEvent.getSource());
		},

		/**
		 * Factory function for the notification items
		 * @param {string} sId The id for the item
		 * @param {sap.ui.model.Context} oBindingContext The binding context for the item
		 * @returns {sap.m.NotificationListItem} The new notification list item
		 * @private
		 */
		_createNotification: function (sId, oBindingContext) {

			var oBindingObject = oBindingContext.getObject();
			var oNotificationItem = new NotificationListItem({
				title: oBindingObject.title,
				description: oBindingObject.description,
				priority: oBindingObject.priority,
				unread: true,
				close: function (oEvent) {
				},
				datetime: oBindingObject.date,
				authorPicture: oBindingObject.icon,
				press: function (oEvent) {
					this.bus = sap.ui.getCore().getEventBus();
					this.bus.publish("masterpage", "redirectToTransaction", { id: oBindingObject.id, transactionid: oBindingObject.transactionid, pagekey: oBindingObject.pagekey });
				},
				customData: [
					new CustomData({
						key: "path",
						value: oBindingContext.getPath()
					})
				]
			});
			return oNotificationItem;
		},

		_createError: function (sId, oBindingContext) {
			var oBindingObject = oBindingContext.getObject();
			var oLink = new Link("moreDetailsLink", {
				text: "Go to page >>",
				press: function () {
					MessageToast.show("More Details was pressed");
				}
			});

			var oMessageItem = new MessagePopoverItem({
				title: oBindingObject.title,
				subtitle: oBindingObject.subTitle,
				description: oBindingObject.description,
				counter: oBindingObject.counter,
				link: oLink
			});
			return oMessageItem;
		},

		onSearchButtonPress: function () {
			this.getView().byId('searchPanel').setVisible(true);
			this.getView().byId('toolPanel').setVisible(false);
		},

		onClosePress: function () {
			this.getView().byId('searchPanel').setVisible(false);
			this.getView().byId('toolPanel').setVisible(true);
		},

		onSearch: function (event) {
			var item = event.getParameter("suggestionItem");
			if (item) {

				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.getTargets().display(item.getKey(), {});
				oRouter.navTo(item.getKey(), true);

				sap.m.MessageToast.show("search for: " + item.getText());
			}
		},

		onSuggest: function (event) {
			var value = event.getParameter("suggestValue");
			var filters = [];
			if (value) {
				filters = [
					new sap.ui.model.Filter([
						new sap.ui.model.Filter("dn", function (sText) {
							return (sText || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						})
					], false)
				];
			}
			this.getView().byId("searchField").getBinding("suggestionItems").filter(filters);
			this.getView().byId("searchField").suggest();
		},


		onGlobalSearch: function (oEvent) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				aFilters = [new Filter("text", sap.ui.model.FilterOperator.Contains, sQuery)];
				// aFilters.push(filter);
			}

			// update list binding
			var list = this.byId("oNavigationList");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		}
	});
});

