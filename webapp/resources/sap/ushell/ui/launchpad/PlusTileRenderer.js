// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/resources","sap/ushell/Config"],function(l,s){"use strict";var e={apiVersion:2,render:function(e,a){e.openStart("li",a);e.attr("tabindex","-1");e.class("sapUshellTile");e.class("sapUshellPlusTile");e.class("sapContrastPlus");e.class("sapMGT");if(s.last("/core/home/sizeBehavior")==="Small"){e.class("sapUshellSmall")}if(a.getEnableHelp()){e.class("help-id-plusTile")}e.attr("aria-label",l.i18n.getText("TilePlus_label"));e.openEnd();e.renderControl(a.oIcon);e.close("li")}};return e},true);