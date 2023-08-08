// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/Core","sap/ui/core/library","sap/m/library"],function(e,l,a){"use strict";var s=sap.ui.getCore().initLibrary({name:"sap.ushell",version:"1.109.2",dependencies:["sap.ui.core","sap.m"],types:["sap.ushell.AllMyAppsState","sap.ushell.AllMyAppsProviderType","sap.ushell.AppTitleState","sap.ushell.ContentNodeType","sap.ushell.components.container.ApplicationType","sap.ushell.DisplayFormat","sap.ushell.NavigationState","sap.ushell.ui.launchpad.ViewPortState","sap.ushell.ui.tile.State","sap.ushell.ui.tile.StateArrow","sap.ushell.VisualizationLoadState","sap.ushell.AppType","sap.ushell.AppBoxPreviewSize","sap.ushell.FloatingNumberType"],interfaces:[],controls:["sap.ushell.components.container.ApplicationContainer","sap.ushell.components.factsheet.controls.PictureTile","sap.ushell.components.factsheet.controls.PictureViewer","sap.ushell.components.factsheet.controls.PictureViewerItem","sap.ushell.components.shell.Settings.userDefaults.UserDefaultsForm","sap.ushell.components.tiles.sbtilecontent","sap.ushell.components.workPageBuilder.controls.WorkPage","sap.ushell.components.workPageBuilder.controls.WorkPageButton","sap.ushell.components.workPageBuilder.controls.WorkPageCell","sap.ushell.components.workPageBuilder.controls.WorkPageColumn","sap.ushell.components.workPageBuilder.controls.WorkPageColumnResizer","sap.ushell.components.workPageBuilder.controls.WorkPageRow","sap.ushell.components.workPageBuilder.controls.WorkPageSection","sap.ushell.components.workPageBuilder.controls.WorkPageWidgetContainer","sap.ushell.services._VisualizationInstantiation.VizInstance","sap.ushell.services._VisualizationInstantiation.VizInstanceAbap","sap.ushell.services._VisualizationInstantiation.VizInstanceCdm","sap.ushell.services._VisualizationInstantiation.VizInstanceLaunchPage","sap.ushell.services._VisualizationInstantiation.VizInstanceLink","sap.ushell.ui.AppContainer","sap.ushell.ui.ContentNodeSelector","sap.ushell.ui.ContentNodeTreeItem","sap.ushell.ui.CustomGroupHeaderListItem","sap.ushell.ui.ShellHeader","sap.ushell.ui.appfinder.AppBox","sap.ushell.ui.appfinder.PinButton","sap.ushell.ui.contentFinder.AppBox","sap.ushell.ui.footerbar.AboutButton","sap.ushell.ui.footerbar.AddBookmarkButton","sap.ushell.ui.footerbar.ContactSupportButton","sap.ushell.ui.footerbar.JamDiscussButton","sap.ushell.ui.footerbar.JamShareButton","sap.ushell.ui.footerbar.LogoutButton","sap.ushell.ui.footerbar.SendAsEmailButton","sap.ushell.ui.footerbar.SettingsButton","sap.ushell.ui.footerbar.UserPreferencesButton","sap.ushell.ui.launchpad.ActionItem","sap.ushell.ui.launchpad.AnchorItem","sap.ushell.ui.launchpad.AnchorNavigationBar","sap.ushell.ui.launchpad.CatalogEntryContainer","sap.ushell.ui.launchpad.CatalogsContainer","sap.ushell.ui.launchpad.DashboardGroupsContainer","sap.ushell.ui.launchpad.GroupHeaderActions","sap.ushell.ui.launchpad.GroupListItem","sap.ushell.ui.launchpad.LinkTileWrapper","sap.ushell.ui.launchpad.LoadingDialog","sap.ushell.ui.launchpad.Page","sap.ushell.ui.launchpad.PlusTile","sap.ushell.ui.launchpad.Section","sap.ushell.ui.launchpad.Tile","sap.ushell.ui.launchpad.TileContainer","sap.ushell.ui.launchpad.TileState","sap.ushell.ui.launchpad.section.CompactArea","sap.ushell.ui.shell.FloatingContainer","sap.ushell.ui.shell.NavigationMiniTile","sap.ushell.ui.shell.OverflowListItem","sap.ushell.ui.shell.RightFloatingContainer","sap.ushell.ui.shell.ShellAppTitle","sap.ushell.ui.shell.ShellFloatingAction","sap.ushell.ui.shell.ShellFloatingActions","sap.ushell.ui.shell.ShellHeadItem","sap.ushell.ui.shell.ShellLayout","sap.ushell.ui.shell.ShellNavigationMenu","sap.ushell.ui.shell.ToolArea","sap.ushell.ui.shell.ToolAreaItem","sap.ushell.ui.tile.DynamicTile","sap.ushell.ui.tile.ImageTile","sap.ushell.ui.tile.StaticTile","sap.ushell.ui.tile.TileBase"],elements:["sap.ushell.ui.launchpad.AccessibilityCustomData"],extensions:{"sap.ui.support":{diagnosticPlugins:["sap/ushell/support/plugins/flpConfig/FlpConfigurationPlugin"]}}});s.AllMyAppsState={FirstLevel:"FirstLevel",SecondLevel:"SecondLevel",Details:"Details",FirstLevelSpread:"FirstLevelSpread"};s.AllMyAppsProviderType={HOME:0,EXTERNAL:1,CATALOG:2};s.AppTitleState={ShellNavMenuOnly:"ShellNavMenuOnly",AllMyAppsOnly:"AllMyAppsOnly",ShellNavMenu:"ShellNavMenu",AllMyApps:"AllMyApps"};s.ContentNodeType={HomepageGroup:"HomepageGroup",Space:"Space",Page:"Page"};s.components.container.ApplicationType={NWBC:"NWBC",SAPUI5:"SAPUI5",TR:"TR",URL:"URL",WCF:"WCF",WDA:"WDA"};s.DisplayFormat={Standard:"standard",Compact:"compact",Flat:"flat",FlatWide:"flatWide",StandardWide:"standardWide"};s.NavigationState={InProgress:"InProgress",Finished:"Finished"};s.ui.launchpad.ViewPortState={Left:"Left",Center:"Center",Right:"Right",LeftCenter:"LeftCenter",CenterLeft:"CenterLeft",RightCenter:"RightCenter",CenterRight:"CenterRight"};s.ui.tile.State={Neutral:"Neutral",None:"None",Negative:"Negative",Error:"Error",Positive:"Positive",Success:"Success",Critical:"Critical",Warning:"Warning"};s.ui.tile.StateArrow={None:"None",Up:"Up",Down:"Down"};s.VisualizationLoadState={Loading:"Loading",Loaded:"Loaded",InsufficientRoles:"InsufficientRoles",OutOfRoleContext:"OutOfRoleContext",NoNavTarget:"NoNavTarget",Failed:"Failed",Disabled:"Disabled"};s.AppType={OVP:"OVP",SEARCH:"Search",FACTSHEET:"FactSheet",COPILOT:"Co-Pilot",URL:"External Link",APP:"Application"};s.AppBoxPreviewSize={Small:"Small",Large:"Large"};s.FloatingNumberType={None:"None",Notifications:"Notifications",OverflowButton:"OverflowButton"};return s});