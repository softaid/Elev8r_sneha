/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../i18n","sap/m/Input","sap/m/Label","sap/m/Text","sap/m/library","sap/m/Column","sap/m/ColumnListItem","sap/m/CustomListItem","sap/m/FlexItemData","sap/m/BusyIndicator","sap/m/FlexBox","sap/ui/core/Icon","sap/ui/layout/HorizontalLayout","sap/ui/layout/VerticalLayout","sap/ui/model/BindingMode","../SearchHelper","../controls/SearchObjectSuggestionImage","../suggestions/SuggestionType","../SearchShellHelperHorizonTheme","../sinaNexTS/providers/abap_odata/UserEventLogger","../UIEvents"],function(e,t,a,s,i,r,n,o,l,c,g,u,h,d,p,f,S,v,y,m,b){function T(e){return e&&e.__esModule&&typeof e.default!=="undefined"?e.default:e}function I(e,t){var a=typeof Symbol!=="undefined"&&e[Symbol.iterator]||e["@@iterator"];if(!a){if(Array.isArray(e)||(a=C(e))||t&&e&&typeof e.length==="number"){if(a)e=a;var s=0;var i=function(){};return{s:i,n:function(){if(s>=e.length)return{done:true};return{done:false,value:e[s++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r=true,n=false,o;return{s:function(){a=a.call(e)},n:function(){var e=a.next();r=e.done;return e},e:function(e){n=true;o=e},f:function(){try{if(!r&&a.return!=null)a.return()}finally{if(n)throw o}}}}function C(e,t){if(!e)return;if(typeof e==="string")return w(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);if(a==="Object"&&e.constructor)a=e.constructor.name;if(a==="Map"||a==="Set")return Array.from(e);if(a==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return w(e,t)}function w(e,t){if(t==null||t>e.length)t=e.length;for(var a=0,s=new Array(t);a<t;a++){s[a]=e[a]}return s}var A=T(e);var R=i["ListType"];var x=T(S);var L=T(v);var D=T(y);var U=m["UserEventType"];var N=T(b);var O=t.extend("sap.esh.search.ui.controls.SearchInput",{renderer:{apiVersion:2},constructor:function e(a,s){var i=this;var n=sap.ui.Device.system.phone;try{sap.ui.Device.system.phone=false;t.prototype.constructor.call(this,a,s)}finally{sap.ui.Device.system.phone=n}this.setWidth("100%");this.setShowValueStateMessage(false);this.setShowTableSuggestionValueHelp(false);this.setEnableSuggestionsHighlighting(false);this.setShowSuggestion(true);this.setFilterSuggests(false);this.addSuggestionColumn(new r(""));this.attachSuggestionItemSelected(this.handleSuggestionItemSelected.bind(this));this.setAutocomplete(false);this.setTooltip(A.getText("search"));this.bindProperty("placeholder",{path:"/searchTermPlaceholder",mode:p.OneWay});this.attachLiveChange(this.handleLiveChange.bind(this));this.bindProperty("enabled",{parts:[{path:"/initializingObjSearch"}],formatter:function e(t){return!t}});this.bindAggregation("suggestionRows",{path:"/suggestions",factory:function e(t,a){return i.suggestionItemFactory(t,a)}});this.addStyleClass("searchInput");this._bUseDialog=false;this._bFullScreen=false;this._ariaDescriptionIdNoResults=a+"-No-Results-Description";this.addAriaDescribedBy(this._ariaDescriptionIdNoResults);this.listNavigationMode=false;this.listNavigationModeCache={}},isMobileDevice:function e(){return false},onfocusin:function e(a){t.prototype.onfocusin.call(this,a);var s=this.getModel();if(s.getSearchBoxTerm().length===0&&s.config.bRecentSearches){s.doSuggestion()}},onsapenter:function e(){var t;if(!((t=this["_oSuggestionPopup"])!==null&&t!==void 0&&t.isOpen()&&this["_oSuggPopover"].getFocusedListItem())){this.getModel().invalidateQuery();this.triggerSearch()}for(var a=arguments.length,s=new Array(a),i=0;i<a;i++){s[i]=arguments[i]}sap.m.Input.prototype.onsapenter.apply(this,s)},triggerSearch:function e(){var t=this.getModel().getProperty("/messagePopoverControlId");var a=sap.ui.getCore().byId(t);if(this.getModel().getProperty("/errors").length>0&&a!==null&&a!==void 0&&a.isOpen()){a.close();a.setVisible(false)}f.subscribeOnlyOnce("triggerSearch","ESHSearchFinished",function(){this.getModel().autoStartApp()},this);var s=this.getModel();var i=this.getValue();if(i.trim()===""&&s.config.isUshell){i="*"}s.setSearchBoxTerm(i,false);var r=true;var n=I(s.searchTermHandlers),o;try{for(n.s();!(o=n.n()).done;){var l=o.value;var c=l.handleSearchTerm(i,this);if(c.navigateToSearchApp===false){r=false}}}catch(e){n.e(e)}finally{n.f()}if(r){this.navigateToSearchApp()}this.destroySuggestionRows();s.abortSuggestions()},handleLiveChange:function e(){var t=this;var a=this["_oSuggPopover"];if(a&&a.handleListNavigation&&!a.handleListNavigation.decorated){var s=a.handleListNavigation;a.handleListNavigation=function(){t.listNavigationMode=true;t.listNavigationModeCache={};for(var e=arguments.length,i=new Array(e),r=0;r<e;r++){i[r]=arguments[r]}var n=s.apply(a,i);t.listNavigationMode=false;return n};a.handleListNavigation.decorated=true}var i=this.getValue();var r=this.getModel();r.setSearchBoxTerm(i,false);if(r.getSearchBoxTerm().length>0||r.config.bRecentSearches){r.doSuggestion()}else{this.destroySuggestionRows();r.abortSuggestions()}},handleSuggestionItemSelected:function e(t){var a;var s=this.getModel();var i=s.getSearchBoxTerm();var r=t.getParameter("selectedRow").getBindingContext().getObject();var n=r.searchTerm||"";var o=r.dataSource||s.getDataSource();var l=r.url;var c=r.uiSuggestionType;if(c===L.Header){return}s.eventLogger.logEvent({type:U.SUGGESTION_SELECT,suggestionType:c,suggestionTerm:n,searchTerm:i,targetUrl:l,dataSourceKey:o?o.id:""});if(s.config.bRecentSearches&&s.recentlyUsedStorage&&c===L.Object){s.recentlyUsedStorage.addItem(r)}this.selectText(0,0);switch(c){case L.Recent:if((a=r.titleNavigation)!==null&&a!==void 0&&a._href){var g;s.invalidateQuery();if((g=r.titleNavigation)!==null&&g!==void 0&&g._target){var u,h;window.open((u=r.titleNavigation)===null||u===void 0?void 0:u._href,(h=r.titleNavigation)===null||h===void 0?void 0:h._target,"noopener,noreferrer")}else{var d;window.open((d=r.titleNavigation)===null||d===void 0?void 0:d._href,"_blank","noopener,noreferrer")}break}case L.Transaction:case L.App:this.destroySuggestionRows();s.abortSuggestions();if(l[0]==="#"){if(l===f.getHashFromUrl()||l===decodeURIComponent(f.getHashFromUrl())){s.setSearchBoxTerm(s.getLastSearchTerm(),false);s.notifySubscribers(N.ESHSearchFinished);sap.ui.getCore().getEventBus().publish(N.ESHSearchFinished);return}if(window["hasher"]){if(l[1]===window.hasher.prependHash){l=l.slice(0,1)+l.slice(2)}window["hasher"].setHash(l)}else{window.location.href=l}}else{this.logRecentActivity(r);window.open(l,"_blank","noopener,noreferrer");s.setSearchBoxTerm("",false);this.setValue("")}if(s.config.isUshell&&l.indexOf("#Action-search")!==0){if(!D.isSearchFieldExpandedByDefault()){sap.ui.require("sap/esh/search/ui/SearchShellHelper").collapseSearch()}}else{this.focus()}break;case L.DataSource:s.setDataSource(o,false);s.setSearchBoxTerm("",false);this.setValue("");this.focus();break;case L.SearchTermData:s.setDataSource(o,false);s.setSearchBoxTerm(n,false);s.invalidateQuery();this.navigateToSearchApp();this.setValue(n);break;case L.SearchTermHistory:s.setDataSource(o,false);s.setSearchBoxTerm(n,false);s.invalidateQuery();this.navigateToSearchApp();this.setValue(n);break;case L.Object:if(r.titleNavigation){r.titleNavigation.performNavigation()}break;default:break}},logRecentActivity:function e(t){sap.ui.require(["sap/ushell/Config","sap/ushell/services/AppType"],function(e,a){var s=e.last("/core/shell/enableRecentActivity")&&e.last("/core/shell/enableRecentActivityLogging");if(s){var i={title:t.title,appType:a.URL,url:t.url,appId:t.url};sap.ushell.Container.getRenderer("fiori2").logRecentActivity(i)}})},suggestionItemFactory:function e(t,a){var s=a.getObject();var i=s.uiSuggestionType;if(i===L.Recent){i=s.originalUiSuggestionType}switch(i){case L.Object:return this.objectSuggestionItemFactory(t,a);case L.Header:return this.headerSuggestionItemFactory();case L.BusyIndicator:return this.busyIndicatorSuggestionItemFactory();default:return this.regularSuggestionItemFactory(t,a)}},busyIndicatorSuggestionItemFactory:function e(){var t=this;var a=new d("",{content:[new c("",{size:"0.6rem"})]});a["getText"]=function(){return t.getValue()};var s=new n("",{cells:[a],type:R.Inactive});s.addStyleClass("searchSuggestion");s.addStyleClass("searchBusyIndicatorSuggestion");s.getVisible=this.assembleListNavigationModeGetVisibleFunction(s);return s},headerSuggestionItemFactory:function e(){var t=this;var s=new a("",{text:{path:"label"}});var i=new d("",{content:[s]});i["getText"]=function(){return t.getValue()};var r=new n("",{cells:[i],type:R.Inactive});r.addStyleClass("searchSuggestion");r.addStyleClass("searchHeaderSuggestion");r.getVisible=this.assembleListNavigationModeGetVisibleFunction(r);return r},assembleListNavigationModeGetVisibleFunction:function e(t){var a=this;return function(){if(!a.listNavigationMode){return true}if(!a.listNavigationModeCache[t.getId()]){a.listNavigationModeCache[t.getId()]=true;return false}else{return true}}},assembleObjectSuggestionLabels:function e(t){var s=[];var i=new a("",{text:{path:"label1"}});i.addEventDelegate({onAfterRendering:function e(){f.boldTagUnescaper(i.getDomRef())}},i);i.addStyleClass("sapUshellSearchObjectSuggestion-Label1");s.push(i);if(t.label2){var r=new a("",{text:{path:"label2"}});r.addEventDelegate({onAfterRendering:function e(){f.boldTagUnescaper(r.getDomRef())}},r);r.addStyleClass("sapUshellSearchObjectSuggestion-Label2");s.push(r)}var n=new d("",{content:s});n.addStyleClass("sapUshellSearchObjectSuggestion-Labels");return n},objectSuggestionItemFactory:function e(t,a){var s=this;var i=a.getObject();var r=[];if(i.imageExists&&i.imageUrl){if(i.imageUrl.startsWith("sap-icon://")){r.push(new u("",{src:i.imageUrl}).addStyleClass("sapUshellSearchObjectSuggestIcon"))}else{r.push(new x("",{src:{path:"imageUrl"},isCircular:{path:"imageIsCircular"}}))}}var o=this.assembleObjectSuggestionLabels(i);r.push(o);var l=new h("",{content:r});l.addStyleClass("sapUshellSearchObjectSuggestion-Container");l["getText"]=function(){return s.getValue()};var c=new n("",{cells:[l],type:R.Active});c.addStyleClass("searchSuggestion");c.addStyleClass("searchObjectSuggestion");return c},regularSuggestionItemFactory:function e(t,a){var i=this;var r=new u("",{src:{path:"icon"}}).addStyleClass("suggestIcon").addStyleClass("sapUshellSearchSuggestAppIcon").addStyleClass("suggestListItemCell");var c=new u("",{src:{path:"filterIcon"}}).addStyleClass("suggestIcon").addStyleClass("sapUshellSearchSuggestFilterIcon").addStyleClass("suggestListItemCell");var h=new l("",{shrinkFactor:1,minWidth:"4rem"});var d=new s("",{text:{path:"label"},layoutData:h,wrapping:false}).addStyleClass("suggestText").addStyleClass("suggestNavItem").addStyleClass("suggestListItemCell");var p=a.getModel().getProperty(a.getPath());d.addEventDelegate({onAfterRendering:function e(){if(p.uiSuggestionType===L.Recent){var t=d.getDomRef();var a=t.innerHTML;var s=a.slice(a.indexOf("&lt;span&gt;")+12,a.lastIndexOf("&lt;/span&gt;"));var i=a.slice(a.lastIndexOf("&lt;/span&gt;")+13);var r=f.boldTagUnescaperForStrings(i);t.innerHTML="<span>"+s+"</span>"+r}else{f.boldTagUnescaper(d.getDomRef())}}},d);var S=[r,d];if(p.filterIcon){S.push(c)}var v=new o("",{type:R.Active,content:new g("",{items:S,alignItems:sap.m.FlexAlignItems.Center})});v.addStyleClass("searchSuggestionCustomListItem");v["getText"]=function(){return typeof p.searchTerm==="string"?p.searchTerm:i.getValue()};var y=new n("",{cells:[v],type:R.Active});v.addStyleClass("searchSuggestionColumnListItem");if(p.uiSuggestionType===L.App){if(p.title&&p.title.indexOf("combinedAppSuggestion")>=0){y.addStyleClass("searchCombinedAppSuggestion")}else{y.addStyleClass("searchAppSuggestion")}}if(p.uiSuggestionType===L.DataSource){y.addStyleClass("searchDataSourceSuggestion")}if(p.uiSuggestionType===L.SearchTermData){y.addStyleClass("searchBOSuggestion")}if(p.uiSuggestionType===L.SearchTermHistory){y.addStyleClass("searchHistorySuggestion")}if(p.uiSuggestionType===L.Recent){y.addStyleClass("searchRecentSuggestion")}y.addStyleClass("searchSuggestion");return y},navigateToSearchApp:function e(){var t=this.getModel();if(f.isSearchAppActive()||!t.config.isUshell){t._firePerspectiveQuery()}else{t.resetSearchResultItemMemory();var a=t.renderSearchURL();window.location.hash=a}},getAriaDescriptionIdForNoResults:function e(){return this._ariaDescriptionIdNoResults},onAfterRendering:function e(){$(this.getDomRef()).find("input").attr("autocomplete","off");$(this.getDomRef()).find("input").attr("autocorrect","off");$(this.getDomRef()).find("input").attr("type","search");$(this.getDomRef()).find("input").attr("name","search");var t=jQuery('<form action=""></form>').on("submit",function(){return false});$(this.getDomRef()).children("input").parent().append(t);$(this.getDomRef()).children("input").detach().appendTo(t)},onValueRevertedByEscape:function e(){if(f.isSearchAppActive()){return}this.setValue(" ")}});return O})})();