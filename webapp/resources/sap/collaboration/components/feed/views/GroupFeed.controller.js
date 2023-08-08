/*
* ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
*/
sap.ui.define(["sap/ui/thirdparty/jquery","sap/base/Log","sap/base/security/encodeURL","sap/base/util/isEmptyObject","sap/ui/core/mvc/Controller","sap/suite/ui/commons/TimelineItem","sap/m/MessageBox","sap/collaboration/components/utils/LanguageBundle","sap/collaboration/components/utils/DateUtil","sap/collaboration/components/controls/FeedEntryEmbedded","sap/collaboration/components/controls/ReplyPopover","sap/collaboration/components/controls/SocialTextArea","sap/collaboration/components/controls/FilterPopover","sap/collaboration/components/utils/CommonUtil","sap/collaboration/components/feed/ModeFactory","sap/ui/model/json/JSONModel","sap/m/ToolbarSpacer","sap/m/Button","sap/m/library","sap/ui/core/Fragment","sap/m/ResponsivePopover","sap/ui/Device","sap/ui/core/CustomData","sap/m/Link","sap/ui/core/library","sap/m/List","sap/m/CustomListItem","sap/collaboration/library"],function(e,t,i,s,o,n,r,a,d,l,u,h,c,g,_,p,m,f,y,v,b,M,P,T,R,S,I,C){"use strict";var E=C.FeedType;var F=R.MessageType;var w=y.PlacementType;var L=y.ButtonType;var A="sap.collaboration.components.feed.views.GroupFeed";var B=o.extend(A,{onInit:function(){this._initializeUtilities();this._initializeRequestStateData();this._initializeSystemData();this._initializeModels();this._initializeTimeline()},onBeforeRendering:function(){if(!this._oMode.isJamServiceAvailable()){this.displayErrorMessage()}},onAfterRendering:function(){},onExit:function(){this._abortAllPendingRequests();this.byId("filter_popover").destroy();this.byId("addPost_popover").destroy();this._stopAutoCheckingForNewUpdates()},_initializeUtilities:function(){this._oCommonUtil=new g;this._oLogger=t.getLogger(A);this._oLanguageBundle=new a;this._oDateUtil=new d},_initializeSystemData:function(){this._oModes={};this._mCurrentUser},_initializeRequestStateData:function(){this._oNextLinks={feedEntriesNextLink:"",repliesNextLink:""};this._oPendingRequests={loadingFeedEntriesRequest:undefined,loadingRepliesRequest:undefined,loadingSuggestionsRequest:undefined,loadingFeedAtMentions:undefined,refreshingSecurityToken:undefined};this._oPostRequestData={path:undefined,payload:undefined,parameters:undefined}},_initializeModels:function(){var e=this._oLanguageBundle.createResourceModel();this.getView().setModel(e,"i18n");this._i18nModel=e;var t=new p;t.setData({feedSources:undefined,axisOrientation:undefined,enableSocial:true,enableScroll:undefined,forceGrowing:false,growingThreshold:20,groupSelectorEnabled:false,groupSelected:{},groups:[],filterEnabled:false,filter:[],filterMessage:"",feedEndpoint:undefined,addPostButtonEnabled:false});t.bindProperty("/feedSources").attachChange(this._onFeedSourcesChange,this);t.bindProperty("/feedEndpoint").attachChange(this._onFeedEndpointChange,this);t.bindProperty("/filterMessage").attachChange(this._onFilterMessageChange,this);this.getView().setModel(t);this._oViewDataModel=t},_initializeTimeline:function(){var e=this.byId("timeline");e.setContent([]);this._modifyHeaderBar();this._createSocialProfile()},_modifyHeaderBar:function(){var e=this.byId("timeline").getHeaderBar();e.removeAllContent();var t=this._createGroupSelector();e.insertContent(t,0);var i=new m(this.createId("header_spacer"));e.insertContent(i,1);var s=this._createFilterButton();e.insertContent(s,2);var o=this._createAddPostButton();e.insertContent(o,3)},_createGroupSelector:function(){var e=new f(this.createId("groupSelect_button"),{icon:"sap-icon://slim-arrow-down",iconFirst:false,text:"{/groupSelected/Name}",width:"20em",enabled:"{/groupSelectorEnabled}",type:L.Transparent,press:[this.onGroupSelectorButtonPress,this]});e.setModel(this._oViewDataModel);return e},_createFilterButton:function(){if(!this.byId("filter_popover")){var e=sap.ui.xmlfragment("sap.collaboration.components.feed.fragments.CustomListItem",this);new c(this.createId("filter_popover"),{title:this._oLanguageBundle.getText("ST_FILTER_HEADER")}).setModel(this._oViewDataModel).bindItems("/filter",e)}var t=new f(this.createId("filter_button"),{enabled:"{/filterEnabled}",visible:"{/filterEnabled}",icon:"sap-icon://filter",type:L.Transparent,press:[function(){this.byId("filter_popover").openBy(this.byId("filter_button"))},this]}).setModel(this._oViewDataModel);return t},_createAddPostButton:function(){if(this.byId("addPost_popover")===undefined){new b(this.createId("addPost_popover"),{placement:w.Auto,title:this._oLanguageBundle.getText("ST_ADD_POST_TITLE"),contentWidth:"25rem",contentHeight:"10rem",content:new h(this.createId("social_TextArea"),{height:"10rem",width:"100%",liveChange:[function(e){e.getParameter("value").trim()!==""?this.byId("addPost_postButton").setEnabled(true):this.byId("addPost_postButton").setEnabled(false)},this],suggest:[this.onSuggest,this],afterSuggestionClose:[function(){this._oPendingRequests.loadingSuggestionsRequest&&this._oPendingRequests.loadingSuggestionsRequest.abort()},this]}),endButton:new f(this.createId("addPost_postButton"),{text:this._oLanguageBundle.getText("ST_ADD_POST_BUTTON"),enabled:false,press:[this.onAddPost,this]})}).setInitialFocus(this.byId("social_TextArea"));if(!M.system.phone){this.byId("addPost_popover").setBeginButton(new f(this.createId("addPost_atMentionButton"),{text:"@",press:[function(){this.byId("social_TextArea").atMentionsButtonPressed()},this]}))}}var e=new f(this.createId("addPost_button"),{enabled:"{/addPostButtonEnabled}",icon:"sap-icon://add",type:L.Transparent,press:[function(){this.byId("addPost_popover").openBy(this.byId("addPost_button"))},this]});e.setModel(this._oViewDataModel);return e},_clearTimeline:function(){var e=this.byId("timeline");e.destroyContent()},_createTimelineItem:function(e){var t=new p(e);var i=new l(this.createId(e.Id+"_embedded"),{feedEntry:"{/}",serviceUrl:this._oMode.getJamServiceUrl(),expandCollapseClick:[function(){this.byId("timeline").adjustUI()},this],atMentionClick:[this.onAtMentionClicked,this],previewLoad:[function(e){this.byId("timeline").adjustUI()},this]});var s=new u(this.createId("replyPostPopover_"+e.Id),{socialTextArea:new h({height:"80px",width:"100%",suggestionPlacement:w.Top,suggest:[this.onSuggest,this],afterSuggestionClose:[function(){this._oPendingRequests.loadingSuggestionsRequest&&this._oPendingRequests.loadingSuggestionsRequest.abort()},this]}),postReplyPress:[this.onPostReplyPress,this],moreRepliesPress:[function(e){var t=e.getSource().getParent();this._getReplies(undefined,t.getModel().getData().Replies.__next,t)},this],afterClose:[function(){if(this._oPendingRequests.loadingRepliesRequest){this._oPendingRequests.loadingRepliesRequest.abort()}this._bReplyPopoverIsOpen=false},this]});s.getSocialTextArea().attachLiveChange(function(e){e.getParameter("value").trim()!==""?this.enableButton(true):this.enableButton(false)}.bind(s));var o=new P({key:"1",value:this._oLanguageBundle.getText("ST_MORE_CUSTOM_ACTION")});var r=new n(this.createId(e.Id),{dateTime:"{/CreatedAt}",userName:"{/Creator/FullName}",title:"{/Action}",text:"{/Text}",icon:"sap-icon://post",userNameClickable:this._oViewDataModel.getProperty("/enableSocial"),userNameClicked:[this.onUserNameClicked,this],userPicture:{path:"/Creator/Id",formatter:this._buildThumbnailImageURL.bind(this)},replyCount:"{/RepliesCount}",embeddedControl:i,customReply:s,replyListOpen:[this.onReplyListOpen,this],customAction:o,customActionClicked:[this.onMoreClicked,this]});r.setModel(t);r.setTitle("‎"+r.getTitle()+"‎");return r},_addFeedEntriesToTimeline:function(e){var t=this.byId("timeline");e.forEach(function(e){var i=this._createTimelineItem(e);t.addContent(i)},this)},_processFeedEntries:function(e){if(e.length>0){this._addFeedEntriesToTimeline(e)}else{this._oViewDataModel.setProperty("/forceGrowing",false)}this._setTimelineToNotBusy()},_processAtMentions:function(){if(this._oPendingRequests.loadingFeedAtMentions&&this._oPendingRequests.loadingFeedAtMentions.state("pending")){this._oPendingRequests.loadingFeedAtMentions.abort()}var t=this;var s;var o={async:true,success:function(e,i){n.resolveWith(t,[e,i])},error:function(e){t._oLogger.error("Failed to retrieve the @mentions.");n.rejectWith(t,[e])}};if(this._oAtMention.atMentionsNextLink){s="/"+this._oAtMention.atMentionsNextLink;o.urlParameters=this._extractUrlParams(decodeURIComponent(this._oAtMention.atMentionsNextLink))}else{s="/FeedEntries("+i("'"+this._oAtMention.feedId+"'")+")/AtMentions"}var n=e.Deferred();n.done(function(e,i){t._oAtMention.atMentionsNextLink=e.__next;t._oAtMention.aAtMentions=t._oCommonUtil.getODataResult(e).concat(t._oAtMention.aAtMentions);if(t._oAtMention.atMentionsNextLink){t._processAtMentions()}else{var s={openingControl:t._oAtMention.oUserNameLink,memberId:t._oAtMention.aAtMentions[t._oAtMention.placeholderIndex].Email};t._oSocialProfile.setSettings(s);t._oSocialProfile.open()}});this._oPendingRequests.loadingFeedAtMentions=n.promise(this._oJamModel.read(s,o))},_createSocialProfile:function(){this._oSocialProfile=(new sap.ui.getCore).createComponent("sap.collaboration.components.socialprofile");return this._oSocialProfile},_setTimelineToBusy:function(){var e=this.byId("timeline");e.setBusyIndicatorDelay(0).setBusy(true)},_setTimelineToNotBusy:function(){var e=this.byId("timeline");e.setBusyIndicatorDelay(0).setBusy(false)},_showFeedUpdatesInTimeline:function(e){var t=this.byId("timeline");var i=t.getMessageStrip();if(e>0){if(!this.byId("refreshLink")){var s=new T(this.createId("refreshLink"),{text:this._oLanguageBundle.getText("GF_REFRESH_FEED"),press:[function(){var e=this._oViewDataModel.getProperty("/feedEndpoint");this._initialLoadFeedEntries(e)},this]});i.setLink(s);i.setType(F.Information);i.setShowIcon(true)}e==1?t.setCustomMessage(this._oLanguageBundle.getText("GF_NEW_FEED_UPDATE")):t.setCustomMessage(this._oLanguageBundle.getText("GF_NEW_FEED_UPDATES",e));i.setVisible(true);t.rerender()}},_hideFeedUpdatesInTimeline:function(){var e=this.byId("timeline").getMessageStrip();e.close()},onGrow:function(e){if(!this._oPendingRequests.loadingFeedEntriesRequest||!this._oPendingRequests.loadingFeedEntriesRequest.state()!="pending"){var t=this._oViewDataModel.getProperty("/feedEndpoint");this._loadFeedEntries(t).done(this._loadFeedEntriesSuccess.bind(this))}},onGroupSelectorButtonPress:function(e){this._oMode.displayFeedSourceSelectorPopover(e.getSource())},onAddPost:function(e){this.byId("addPost_popover").close();var t=this.byId("social_TextArea").convertTextWithFullNamesToEmailAliases();if(t&&t.trim()!==""){this._getLoggedInUser().done(function(){this._setTimelineToBusy();var e=function(e,t){this.byId("social_TextArea").clearText();this.byId("addPost_postButton").setEnabled(false);this._setTimelineToNotBusy();var i=this._oCommonUtil.getODataResult(e);i.Creator=this._mCurrentUser;var s=this._createTimelineItem(i);this.byId("timeline").insertContent(s,0)};var i=function(e){this._oLogger.error("Error occured when adding a post.",e.stack)};var s=this._oMode.addPost(t);this._oPostRequestData={path:s.path,payload:s.payload};this._oPostRequestData.parameters={success:e,error:i};var o=s.promise;o.then(e.bind(this),i.bind(this))}.bind(this))}else{this._oLogger.info("Posting an empty comment is not allowed, no feed entry will be created.")}},onReplyListOpen:function(e){var t=e.getSource().getCustomReply();t.getTextArea().focus();if(!this._bReplyPopoverIsOpen){this._bReplyPopoverIsOpen=true;var i=e.getSource();var s=i.getModel().getProperty("/Id");this._getReplies(s,undefined,i)}},onPostReplyPress:function(e){var t=this;var s=e.getParameter("value");var o=e.getSource().getParent();var n=o.getCustomReply();var r=o.getModel().getData().Id;var a="/FeedEntries('"+i(r)+"')/Replies";var d={Text:s};this._getLoggedInUser();this._getLoggedInUser().done(function(){var e={async:true,success:function(e,i){n.getTextArea().clearText();n.enableButton(false);n.setBusy(false);var s=t._oCommonUtil.getODataResult(e);var r={CreatedAt:t._oDateUtil.formatDateToString(s.CreatedAt),Text:s.Text,Creator:t._mCurrentUser};r.Creator.ThumbnailImage=t._buildThumbnailImageURL(t._mCurrentUser.Id);n.addReply(r);o.getModel().setProperty("/RepliesCount",o.getModel().getProperty("/RepliesCount")+1)},error:function(e){t._oLogger.error("Failed to post reply: "+e.statusText,e.stack)}};n.getTextArea().focus();n.setBusyIndicatorDelay(0).setBusy(true);this._oPostRequestData={path:a,payload:d,parameters:e};this._oJamModel.create(a,d,e)}.bind(this))},onSuggest:function(t){var i=this;if(this._oPendingRequests.loadingSuggestionsRequest){this._oPendingRequests.loadingSuggestionsRequest.abort()}var s=t.getSource();var o=t.getParameter("value");if(o.trim()===""){s.showSuggestions([])}else{var n="/Members_Autocomplete";var r=this._oViewDataModel.getProperty("/groupSelected/Id");var a={async:true,urlParameters:{Query:"'"+o+"'",GroupId:"'"+r+"'",$top:"4"},success:function(e,t){d.resolveWith(i,[e,t])},error:function(e){i._oLogger.error("Failed to get suggestions: "+e.statusText);d.rejectWith(i,[e])}};var d=e.Deferred();d.done(function(e,t){var o=i._oCommonUtil.getODataResult(e);if(o.length===0){s.closeSuggestionPopover()}else{var n=[];var r=o.length;for(var a=0;a<r;a++){n.push({fullName:o[a].FullName,email:o[a].Email,userImage:i._buildThumbnailImageURL(o[a].Id)})}s.showSuggestions(n)}});this._oPendingRequests.loadingSuggestionsRequest=d.promise(this._oJamModel.read(n,a))}},onUserNameClicked:function(e){var t=e.getParameter("uiElement");var i=e.getSource().getModel();var s=i.getProperty("/Creator/Email");this._oSocialProfile.setSettings({openingControl:t,memberId:s});this._oSocialProfile.open()},onMoreClicked:function(e){var t=e.getSource().getModel().getProperty("/WebURL");var i=e.getSource().getModel().getProperty("/Id");var s=e.getSource().getParent().getModel().getProperty("/groupSelected/Name");var o=e.getSource().getParent().getModel().getProperty("/groupSelected/WebURL");var n=this.byId(this.createId("moreListPopover_"+i));if(n===undefined){var r=new S(this.createId("moreList_"+i),{});var a=new T(this.createId("groupNameLink_"+i),{text:this._oLanguageBundle.getText("ST_GROUP_NAME_LINK",s),target:"_blank",href:o,width:"15em"}).addStyleClass("sapCollaborationCustomLinkPadding");var d=new I(this.createId(i+"_groupNameLinkListItem"),{content:a});r.addItem(d);var l=new T(this.createId("feedEntryLink_"+i),{text:this._oLanguageBundle.getText("ST_FEED_ENTRY_LINK"),target:"_blank",href:t,width:"15em"}).addStyleClass("sapCollaborationCustomLinkPadding");var u=new I(this.createId("feedEntryLinkListItem_"+i),{content:l});r.addItem(u);var h=false;if(M.system.phone){h=true}n=new b(this.createId("moreListPopover_"+i),{content:r,showHeader:h,title:this._oLanguageBundle.getText("ST_MORE_CUSTOM_ACTION"),showCloseButton:true,placement:w.VerticalPreferedBottom,contentWidth:"15em"});var c=function(){this.close()};a.attachPress(c.bind(n));l.attachPress(c.bind(n))}n.openBy(e.getParameter("linkObj"))},onAtMentionClicked:function(e){var t=e.getSource().getModel().getProperty("/Id");var i=e.getParameter("link");var s=i.getModel().getProperty("/placeholderIndex");this._oAtMention={feedId:t,oUserNameLink:i,placeholderIndex:s,aAtMentions:[],atMentionsNextLink:undefined};this._processAtMentions()},_onFeedEndpointChange:function(e){var t=e.getSource().getValue();this._initialLoadFeedEntries(t)},_onFeedSourcesChange:function(e){var t;var i=e.getSource().getValue();if(Array.isArray(i)){i={mode:E.GroupIds,data:i}}if(this._oMode){this._oMode.stop()}if(this._oCommonUtil.isString(i.mode)){if(this._oModes[i.mode]===undefined){this._oModes[i.mode]=_.getInstance().createMode(i.mode,this)}}else{t="The mode must be a string.";this.logError(t);this.byId("timeline").destroy();throw new Error(t)}this._oMode=this._oModes[i.mode];this._oMode.start(i.data)},_onFilterMessageChange:function(e){var t=e.getSource().getValue();this.byId("timeline").setCustomMessage(t);this.byId("timeline").rerender()},_onMetadataFailed:function(e){switch(e.oSource.sServiceUrl){case this._oMode.getJamServiceUrl():this._oLogger.error("Failed to load Jam metadata. Service unavailable or possible missing JAM configuration.");this._displayJamConnectionErrorMessage();this._oMode.setJamServiceAvailable(false);break;case this._oMode.getSMIv2ServiceUrl():this._oLogger.error("Failed to load SMIv2 metadata.");this.displayErrorMessage();break}this.disableGroupFeed()},_onJamRequestCompleted:function(e){var t=e.getParameter("method");if(e.success&&t==="POST"){this._oPendingRequests.refreshingSecurityToken=undefined}},_onJamRequestFailed:function(e){this._setTimelineToNotBusy();var t=e.getParameter("method");var i=parseInt(e.getParameter("response").statusCode);var s=e.getParameter("feedEndpoint");if(!s){s=e.getParameter("url")}if(/ExternalObjects_FindByExidAndObjectType/.test(s)){this.disableGroupFeed();return}switch(i){case 403:if(t==="POST"){if(this._oPendingRequests.refreshingSecurityToken===undefined){this._refreshSecurityToken().done(function(e,t){this._oJamModel.create(this._oPostRequestData.path,this._oPostRequestData.payload,this._oPostRequestData.parameters)})}else{this._oPendingRequests.refreshingSecurityToken=undefined;this.displayErrorMessage(this._oLanguageBundle.getText("JAM_NO_ACCESS_TO_POST_TO_GROUP"))}}else{this.displayErrorMessage(this._oLanguageBundle.getText("JAM_FORBIDDEN_ACCESS"))}break;case 404:if(/Groups\(.*\)\/FeedEntries/.test(s)){this.displayErrorMessage(this._oLanguageBundle.getText("JAM_NO_ACCESS_TO_GROUP"));this.disableGroupFeed()}else if(/Groups\(.*\)/.test(s)){this.displayErrorMessage(this._oLanguageBundle.getText("JAM_NO_ACCESS_TO_GROUP"));this.disableGroupFeed()}else if(/GroupExternalObject_FeedLatestCount|Group_FeedLatestCount/.test(s)){this._stopAutoCheckingForNewUpdates()}else{this.displayErrorMessage()}break;case 500:case 503:this._displayJamConnectionErrorMessage();break;default:this.displayErrorMessage()}},_onJamRequestSent:function(e){},_onBatchCompleted:function(e){this._oJamModel.setUseBatch(false);this._oMode.onBatchCompleted(e)},_onBatchFailed:function(e){},_onBatchSent:function(e){},_abortAllPendingRequests:function(){if(this._oPendingRequests.loadingFeedEntriesRequest){this._oPendingRequests.loadingFeedEntriesRequest.abort()}if(this._oPendingRequests.loadingRepliesRequest){this._oPendingRequests.loadingRepliesRequest.abort()}if(this._oPendingRequests.loadingSuggestionsRequest){this._oPendingRequests.loadingSuggestionsRequest.abort()}},_refreshSecurityToken:function(){var t=this;var i=e.Deferred();return this._oPendingRequests.refreshingSecurityToken=i.promise(this._oJamModel.refreshSecurityToken(function(e,s){t._oLogger.info("Security token refreshed");i.resolveWith(t,[e,s])},function(e){t._oLogger.error("Security token error: "+e.statusText);i.rejectWith([e],t)}))},_getLoggedInUser:function(){var t=e.Deferred();if(!this._mCurrentUser){var i="/Self";var s={success:function(e,i){this._mCurrentUser=this._oCommonUtil.getODataResult(e);t.resolve(e,i)}.bind(this),error:function(e){this._oLogger.error("Failed to get the logged in user",e.stack);t.reject(e)}.bind(this)};return t.promise(this._oJamModel.read(i,s))}return t.resolve()},_loadFeedEntries:function(e){var t=undefined;if(!this._oMode.isJamServiceAvailable()){return}this._setTimelineToBusy();var i=this._oNextLinks.feedEntriesNextLink;if(i!==""){i=decodeURIComponent(i);t=this._extractUrlParams(i).$skiptoken}return this._oPendingRequests.loadingFeedEntriesRequest=this._oMode.getFeedEntries(e,t)},_loadFeedEntriesSuccess:function(e,t){this._oNextLinks.feedEntriesNextLink=e.__next;var i=this._oCommonUtil.getODataResult(e);this._processFeedEntries(i)},_initialLoadFeedEntries:function(e){if(this._oPendingRequests.loadingFeedEntriesRequest){this._oPendingRequests.loadingFeedEntriesRequest.abort()}this._initializeRequestStateData();this._oViewDataModel.setProperty("/forceGrowing",true);this._hideFeedUpdatesInTimeline();this._stopAutoCheckingForNewUpdates();this._loadFeedEntries(e).done([this._clearTimeline.bind(this),this._loadFeedEntriesSuccess.bind(this),this._startAutoCheckingForNewUpdates.bind(this)])},_getReplies:function(t,s,o){var n=this;var r;var a={async:true,urlParameters:{$orderby:"CreatedAt desc",$expand:"Creator"},success:function(e,t){n._oLogger.info("Replies were successfully retrieved.");l.resolveWith(n,[e,t])},error:function(e){n._oLogger.error("Failed to retrieve replies: "+e.statusText);l.rejectWith(n,[e])}};var d=o.getCustomReply();if(s){r="/"+s;a.urlParameters=this._extractUrlParams(decodeURIComponent(s));a.urlParameters.$orderby=a.urlParameters.$orderby.replace("+"," ")}else{r="/FeedEntries('"+i(t)+"')/Replies"}var l=e.Deferred();l.done(function(e,t){var i=n._oCommonUtil.getODataResult(e).reverse();i.forEach(function(e){e.Creator.ThumbnailImage=n._buildThumbnailImageURL(e.Creator.Id);e.CreatedAt=n._oDateUtil.formatDateToString(e.CreatedAt)});d.addReplies({data:i,more:e.__next?true:false});o.getModel().getData().Replies.__next=e.__next}).always(function(){d.setBusy(false)}).fail(function(){d._oReplyPopover.close()});d.setBusyIndicatorDelay(0).setBusy(true);this._oPendingRequests.loadingRepliesRequest=l.promise(this._oJamModel.read(r,a))},logError:function(e){this._oLogger.error(e)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){this.getView().setModel(e,t)},getLanguageBundle:function(){return this._oLanguageBundle},setJamModel:function(e){this._oJamModel=e;this.setModel(e,"jam")},setSmiModel:function(e){this._oSMIModel=e;this.setModel(e,"smi")},displayErrorMessage:function(e){var t=e||this._oLanguageBundle.getText("SYSTEM_ERROR_MESSAGEBOX_GENERAL_TEXT");r.error(t)},_displayJamConnectionErrorMessage:function(){var e=this._oLanguageBundle.getText("JAM_CONNECTION_ERROR_MESSAGEBOX_TEXT");r.error(e)},disableGroupFeed:function(){this._abortAllPendingRequests();var e=this.byId("timeline");if(!s(e)){e.setBusyIndicatorDelay(0).setBusy(false);this._clearTimeline();this._oViewDataModel.setProperty("/groupSelectorEnabled",false);this._oViewDataModel.setProperty("/addPostButtonEnabled",false);this._oViewDataModel.setProperty("/forceGrowing",false)}},enableGroupFeed:function(){var e=this.byId("timeline");if(!s(e)){e.setBusyIndicatorDelay(0).setBusy(false);this._oViewDataModel.setProperty("/groupSelectorEnabled",true);this._oViewDataModel.setProperty("/addPostButtonEnabled",true);this._oViewDataModel.setProperty("/forceGrowing",true)}},_startAutoCheckingForNewUpdates:function(){this._iNewFeedUpdatesCheckerTimeDelay=12e4;this._sNewFeedUpdatesCheckerTimeoutId=setTimeout(this._checkForNewFeedUpdates.bind(this),this._iNewFeedUpdatesCheckerTimeDelay)},_stopAutoCheckingForNewUpdates:function(){clearTimeout(this._sNewFeedUpdatesCheckerTimeoutId)},_checkForNewFeedUpdates:function(){var e=function(e,t){this._showFeedUpdatesInTimeline(e);this._sNewFeedUpdatesCheckerTimeoutId=setTimeout(this._checkForNewFeedUpdates.bind(this),this._iNewFeedUpdatesCheckerTimeDelay)};var t=function(e){this._oLogger.error("Failed to check for new feed updates.");this._sNewFeedUpdatesCheckerTimeoutId=setTimeout(this._checkForNewFeedUpdates.bind(this),this._iNewFeedUpdatesCheckerTimeDelay)};this._oMode.getFeedUpdatesLatestCount().done(e.bind(this)).fail(t.bind(this))},_extractUrlParams:function(e){var t=e.slice(e.indexOf("?")+1);var i=t.split("&");var s={};i.forEach(function(e){var t=e.indexOf("=");s[e.slice(0,t)]=e.slice(t+1)});return s},_buildThumbnailImageURL:function(e){return this._oJamModel.sServiceUrl+"/Members('"+i(e)+"')/ThumbnailImage/$value"}});return B},true);