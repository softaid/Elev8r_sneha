// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/UIComponent","sap/ushell/components/cepsearchresult/util/appendStyleVars","sap/ushell/components/cepsearchresult/util/SearchResultManager"],function(e,r,s){"use strict";r(["sapUiShadowLevel0"]);var t=e.extend("sap.ushell.components.cepsearchresult.cards.searchresultwidget.Component",{onCardReady:function(e){this.oCard=e;this.oCard.getDomRef().classList.add("searchResultCard");this.mCardParameters=e.getCombinedParameters();this.oSearchResultManager=new s(this.mCardParameters.edition)},getSearchTerm:function(){return this.mParameters.searchTerm},getCategories:function(){return this.mParameters.categories}});return t});