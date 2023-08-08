// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/Layout","sap/ui/base/Object","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ushell/ui/launchpad/Tile","sap/ushell/ui/launchpad/DashboardGroupsContainer","sap/ushell/Config","sap/ushell/EventHub","sap/ui/core/Component","sap/ui/core/InvisibleMessage","sap/ui/core/library","sap/m/GenericTile","sap/ui/Device","sap/ushell/ui/launchpad/PlusTile","sap/ushell/resources","sap/ushell/ui/launchpad/TileContainer","sap/ushell/ui/launchpad/LinkTileWrapper","sap/m/Button","sap/ushell/ui/launchpad/GroupHeaderActions","sap/base/util/isEmptyObject","sap/ui/thirdparty/jquery","sap/ui/performance/Measurement","sap/base/util/restricted/_zipObject"],function(e,t,i,o,n,r,s,a,u,l,d,p,c,h,g,f,b,G,v,m,A,C,T){"use strict";var y=d.InvisibleMessageMode;var P=t.extend("sap.ushell.components.homepage.DashboardGroupsBox",{metadata:{publicMethods:["createGroupsBox"]},constructor:function(){if(sap.ushell.components.homepage.getDashboardGroupsBox&&sap.ushell.components.homepage.getDashboardGroupsBox()){return sap.ushell.components.homepage.getDashboardGroupsBox()}sap.ushell.components.homepage.getDashboardGroupsBox=function(e){return function(){return e}}(this.getInterface());this.oController=undefined;this.oGroupsContainer=undefined;this._oInvisibleMessageInstance=l.getInstance();sap.ui.getCore().getEventBus().subscribe("launchpad","actionModeActive",this._handleActionModeChange,this);sap.ui.getCore().getEventBus().subscribe("launchpad","actionModeInactive",this._handleActionModeChange,this);sap.ui.getCore().getEventBus().subscribe("launchpad","GroupHeaderVisibility",this._updateGroupHeaderVisibility,this);return undefined},destroy:function(){sap.ui.getCore().getEventBus().unsubscribe("launchpad","actionModeActive",this._handleActionModeChange,this);sap.ui.getCore().getEventBus().unsubscribe("launchpad","actionModeInactive",this._handleActionModeChange,this);sap.ui.getCore().getEventBus().unsubscribe("launchpad","GroupHeaderVisibility",this._updateGroupHeaderVisibility,this);if(this.oGroupsContainer){this.oGroupsContainer.destroy()}sap.ushell.components.homepage.getDashboardGroupsBox=undefined},calculateFilter:function(){var e=[];var t;var n=this.oModel.getProperty("/homePageGroupDisplay"),r=this.oModel.getProperty("/tileActionModeActive");if(!r){if(n&&n==="tabs"){t=new i("isGroupSelected",o.EQ,true)}else{t=new i("isGroupVisible",o.EQ,true)}e.push(t)}return e},zipPromiseAll:function(e,t){return Promise.all(t).then(function(t){return T(e,t)})},loadCardModuleIfNeeded:function(){var e=this;if(s.last("/core/home/featuredGroup/enable")){return sap.ui.getCore().loadLibrary("sap.ui.integration",{async:true}).then(function(){return new Promise(function(t){sap.ui.require(["sap/ui/integration/widgets/Card"],function(i){e.Card=i;t()})})})}return Promise.resolve()},createGroupsBox:function(t,i){this.oController=t;var o=this,n,s,u=function(e){var t,i;if(e&&(t=e.getDomRef())){i=t.querySelector(".sapUshellPlusTile");if(i){return i}}return null},l=function(e){var t=u(e.currentGroup),i=u(e.endGroup),n=e.tiles[e.tiles.length-2]===e.item||e.endGroup.getTiles().length===0;if(n){o._hidePlusTile(i)}else{o._showPlusTile(i)}if(e.currentGroup!==e.endGroup){o._showPlusTile(t)}};n=function(){e.getLayoutEngine().setExcludedControl(h);e.getLayoutEngine().setReorderTilesCallback.call(e.layoutEngine,l)};s=function(){if(!e.isInited){e.init({getGroups:this.getGroups.bind(this),getAllGroups:o.getAllGroupsFromModel.bind(o),isTabBarActive:o.isTabBarActive.bind(o)}).done(n);c.media.attachHandler(function(){if(!this.bIsDestroyed){e.reRenderGroupsLayout(null)}},this,c.media.RANGESETS.SAP_STANDARD);var i=this.getDomRef();t.getView().sDashboardGroupsWrapperId=!m(i)&&i.parentNode?i.parentNode.id:""}a.emit("CenterViewPointContentRendered");sap.ui.getCore().getEventBus().publish("launchpad","contentRendered");sap.ui.getCore().getEventBus().publish("launchpad","contentRefresh");if(this.getBinding("groups")){this.getBinding("groups").filter(o.calculateFilter())}};this.isTabBarActive=function(){return this.oModel.getProperty("/homePageGroupDisplay")==="tabs"};this.oModel=i;var d=this.calculateFilter();this.oGroupsContainer=new r("dashboardGroups",{displayMode:"{/homePageGroupDisplay}",afterRendering:s});this.zipPromiseAll(["launchpadService",""],[sap.ushell.Container.getServiceAsync("LaunchPage"),o.loadCardModuleIfNeeded()]).then(function(e){this.isLinkPersonalizationSupported=e.launchpadService.isLinkPersonalizationSupported();this.oGroupsContainer.bindAggregation("groups",{filters:d,path:"/groups",factory:function(){return o._createTileContainer(t,i)}})}.bind(this));if(c.system.desktop){this.oGroupsContainer.addEventDelegate({onBeforeFastNavigationFocus:function(e){e.preventDefault();sap.ui.require(["sap/ushell/components/ComponentKeysHandler"],function(e){e.getInstance().then(function(e){e.goToLastVisitedTile()}.bind(this))}.bind(this))},onsaptabnext:function(e){if(A("#sapUshellFloatingContainerWrapper").is(":visible")&&e.originalEvent.srcElement.id!==""){e.preventDefault();sap.ui.getCore().getEventBus().publish("launchpad","shellFloatingContainerIsAccessible")}}})}return this.oGroupsContainer},getAllGroupsFromModel:function(){return this.oModel.getProperty("/groups")},_createTileContainer:function(e){var t=this,n=new i("isTileIntentSupported",o.EQ,true),r=new f({headerText:"{title}",showEmptyLinksArea:{parts:["/tileActionModeActive","links/length","isGroupLocked","/isInDrag","/homePageGroupDisplay"],formatter:function(e,t,i,o,n){if(t){return true}else if(i){return false}return e||o&&n==="tabs"}},showMobileActions:{parts:["/tileActionModeActive"],formatter:function(e){return e&&!this.getDefaultGroup()}},showIcon:{parts:["/isInDrag","/tileActionModeActive"],formatter:function(e,t){return this.getIsGroupLocked()&&(e||t)}},deluminate:{parts:["/isInDrag"],formatter:function(e){return this.getIsGroupLocked()&&e}},transformationError:{parts:["/isInDrag","/draggedTileLinkPersonalizationSupported"],formatter:function(e,t){return e&&!t}},showBackground:"{/tileActionModeActive}",tooltip:"{title}",tileActionModeActive:"{/tileActionModeActive}",enableHelp:s.last("/core/extension/enableHelp"),groupId:"{groupId}",defaultGroup:"{isDefaultGroup}",isLastGroup:"{isLastGroup}",isGroupLocked:"{isGroupLocked}",isGroupSelected:"{isGroupSelected}",showHeader:true,showGroupHeader:"{showGroupHeader}",homePageGroupDisplay:"{/homePageGroupDisplay}",editMode:"{editMode}",supportLinkPersonalization:this.isLinkPersonalizationSupported,titleChange:function(e){sap.ui.getCore().getEventBus().publish("launchpad","changeGroupTitle",{groupId:e.getSource().getGroupId(),newTitle:e.getParameter("newTitle")})},showEmptyLinksAreaPlaceHolder:{parts:["links/length","/isInDrag","/homePageGroupDisplay"],formatter:function(e,t,i){return t&&i==="tabs"&&!e}},showPlaceholder:{parts:["/tileActionModeActive","tiles/length"],formatter:function(e){return e&&!this.getIsGroupLocked()}},visible:{parts:["/tileActionModeActive","isGroupVisible","visibilityModes"],formatter:function(e,t,i){if(!i[e?1:0]){return false}return t||e}},hidden:{parts:["/tileActionModeActive","isGroupVisible"],formatter:function(e,t){return e&&!t}},links:this._getLinkTemplate(),tiles:{path:"tiles",factory:this._itemFactory.bind(this),filters:[n]},add:function(e){t._handleAddTileToGroup(e)}});return r},_getLinkTemplate:function(){var e=new i("isTileIntentSupported",o.EQ,true);if(!this.isLinkPersonalizationSupported){return{path:"links",templateShareable:true,template:new b({uuid:"{uuid}",tileCatalogId:"{tileCatalogId}",target:"{target}",isLocked:"{isLocked}",tileActionModeActive:"{/tileActionModeActive}",debugInfo:"{debugInfo}",tileViews:{path:"content",factory:function(e,t){return t.getObject()}},afterRendering:function(e){var t=A(this.getDomRef().getElementsByTagName("a"));t.attr("tabindex",-1)}}),filters:[e]}}return{path:"links",factory:function(e,t){var i=t.getObject().content[0];if(i&&i.bIsDestroyed){i=i.clone();t.getModel().setProperty(t.getPath()+"/content/0",i)}return i},filters:[e]}},_createCard:function(e){return new this.Card({manifest:e})},_itemFactory:function(e,t){var i=t.getProperty(t.sPath),o,n,r,s;if(i){if(i.isCard){o=i&&i.content;n=o&&o.length&&o[0];if(n&&n["sap.card"]){s=n}else if(i.manifest){s={"sap.flp":i.manifest&&i.manifest["sap.flp"],"sap.card":{type:"List"}}}else{return this._createErrorTile()}r=this._createCard(s)}else{r=this._createTile()}i.controlId=r&&r.getId&&r.getId()}return r},_createErrorTile:function(){return new n({tileViews:{path:"content",factory:function(){return new p({state:"Failed"})}}})},_createTile:function(){var e=new n({long:"{long}",isDraggedInTabBarToSourceGroup:"{draggedInTabBarToSourceGroup}",uuid:"{uuid}",tileCatalogId:"{tileCatalogId}",isCustomTile:"{isCustomTile}",target:"{target}",isLocked:"{isLocked}",navigationMode:"{navigationMode}",tileActionModeActive:"{/tileActionModeActive}",showActionsIcon:"{showActionsIcon}",rgba:"{rgba}",debugInfo:"{debugInfo}",tileViews:{path:"content",factory:function(e,t){return t.getObject()}},coverDivPress:function(e){if(!e.oSource.getBindingContext().getObject().tileIsBeingMoved&&sap.ushell.components.homepage.ActionMode){sap.ushell.components.homepage.ActionMode._openActionsMenu(e)}},showActions:function(e){if(sap.ushell.components.homepage.ActionMode){sap.ushell.components.homepage.ActionMode._openActionsMenu(e)}},deletePress:[this.oController._dashboardDeleteTileHandler,this.oController],press:[this.oController.dashboardTilePress,this.oController]});var t=sap.ui.getCore().byId("viewPortContainer");e.addEventDelegate({onclick:function(){C.start("FLP:DashboardGroupsBox.onclick","Click on tile","FLP");C.start("FLP:OpenApplicationonClick","Open Application","FLP");function e(){C.end("FLP:DashboardGroupsBox.onclick");t.detachAfterNavigate(e)}t.attachAfterNavigate(e)}});return e},_updateGroupHeaderVisibility:function(){var e=this.oGroupsContainer.getGroups(),t=this.oModel.getProperty("/tileActionModeActive"),i=this.oController.getView().oPage.getShowHeader(),o,n=0;for(var r=0;r<e.length;r++){if(e[r].getProperty("visible")){n++;if(o===undefined){o=r}else{e[r].setShowGroupHeader(true)}}}if(o!==undefined){var s=t||n===1&&!i;e[o].setShowGroupHeader(s)}},_handleActionModeChange:function(){var t=this.oModel.getProperty("/tileActionModeActive");if(t){this._addTileContainersContent()}else{e.reRenderGroupsLayout(null)}},_addTileContainersContent:function(){var e=this.oGroupsContainer.getGroups();for(var t=0;t<e.length;t++){var i=e[t];if(!i.getBeforeContent().length){i.addBeforeContent(new G({icon:"sap-icon://add",text:g.i18n.getText("add_group_at"),visible:"{= !${isGroupLocked} && !${isDefaultGroup} && ${/tileActionModeActive}}",enabled:"{= !${/editTitle}}",press:[this._handleAddGroupButtonPress.bind(this)]}).addStyleClass("sapUshellAddGroupButton"))}if(!i.getAfterContent().length){i.addAfterContent(new G({icon:"sap-icon://add",text:g.i18n.getText("add_group_at"),visible:"{= ${isLastGroup} && ${/tileActionModeActive}}",enabled:"{= !${/editTitle}}",press:[this._handleAddGroupButtonPress.bind(this)]}).addStyleClass("sapUshellAddGroupButton"))}if(!i.getHeaderActions().length){i.addHeaderAction(new v({content:this._getHeaderActions(),tileActionModeActive:"{/tileActionModeActive}",isOverflow:"{/isPhoneWidth}"}).addStyleClass("sapUshellOverlayGroupActionPanel"))}}},_handleAddGroupButtonPress:function(e){this.oController._addGroupHandler(e);this._addTileContainersContent()},_getHeaderActions:function(){var e=[];e.push(new G({text:{path:"isGroupVisible",formatter:function(e){return g.i18n.getText(e?"HideGroupBtn":"ShowGroupBtn")}},icon:{path:"isGroupVisible",formatter:function(e){if(c.system.phone){return e?"sap-icon://hide":"sap-icon://show"}return""}},visible:"{= ${/enableHideGroups} && !${isGroupLocked} && !${isDefaultGroup}}",enabled:"{= !${/editTitle}}",press:function(e){var t=e.getSource(),i=t.getBindingContext(),o=i.getModel(),n=i.getPath(),r=o.getProperty(n+"/isGroupVisible");var s=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._oInvisibleMessageInstance.announce([g.i18n.getText(r?"Group.nowBeingHidden":"Group.nowBeingShown"),g.i18n.getText("Section.ButtonLabelChanged"),g.i18n.getText(r?"ShowGroupBtn":"HideGroupBtn"),s.getText("ACC_CTR_TYPE_BUTTON")].join(" "),y.Polite);this.oController._changeGroupVisibility(i)}.bind(this)}).addStyleClass("sapUshellHeaderActionButton"));e.push(new G({text:{path:"removable",formatter:function(e){return g.i18n.getText(e?"DeleteGroupBtn":"ResetGroupBtn")}},icon:{path:"removable",formatter:function(e){if(c.system.phone){return e?"sap-icon://delete":"sap-icon://refresh"}return""}},visible:"{= !${isDefaultGroup}}",enabled:"{= !${/editTitle}}",press:function(e){var t=e.getSource(),i=t.getBindingContext();this.oController._handleGroupDeletion(i)}.bind(this)}).addStyleClass("sapUshellHeaderActionButton"));return e},_handleAddTileToGroup:function(e){if(document.toDetail){document.toDetail()}u.getOwnerComponentFor(this.oController.getView().parentComponent).getRouter().navTo("appfinder",{"innerHash*":"catalog/"+JSON.stringify({targetGroup:encodeURIComponent(e.getSource().getBindingContext().sPath)})})},_hidePlusTile:function(e){if(e){e.classList.add("sapUshellHidePlusTile")}},_showPlusTile:function(e){if(e){e.classList.remove("sapUshellHidePlusTile")}}});return P});