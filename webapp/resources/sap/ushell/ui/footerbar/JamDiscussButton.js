// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/Log","sap/m/Button","sap/m/ButtonRenderer","sap/ushell/resources"],function(e,s,t,i){"use strict";var n=s.extend("sap.ushell.ui.footerbar.JamDiscussButton",{metadata:{library:"sap.ushell",properties:{beforePressHandler:{type:"any",group:"Misc",defaultValue:null},afterPressHandler:{type:"any",group:"Misc",defaultValue:null},jamData:{type:"object",group:"Misc",defaultValue:null}}},renderer:"sap.m.ButtonRenderer"});n.prototype.init=function(){var e=this;if(s.prototype.init){s.prototype.init.apply(this,arguments)}this.setEnabled();this.setIcon("sap-icon://discussion-2");this.setText(i.i18n.getText("discussBtn"));this.attachPress(function(){if(e.getBeforePressHandler()){e.getBeforePressHandler()()}this.showDiscussDialog(e.getAfterPressHandler())})};n.prototype.showDiscussDialog=function(e){if(!this.discussComponent){this.discussComponent=sap.ui.getCore().createComponent({name:"sap.collaboration.components.fiori.feed.dialog"})}this.discussComponent.setSettings(this.getJamData());this.discussComponent.open();if(e){e()}};n.prototype.setEnabled=function(t){if(!sap.ushell.Container){if(this.getEnabled()){e.warning("Disabling JamDiscussButton: unified shell container not initialized",null,"sap.ushell.ui.footerbar.JamDiscussButton")}t=false}else{var i=sap.ushell.Container.getUser();if(!(i&&i.isJamActive())){if(this.getEnabled()){e.info("Disabling JamDiscussButton: user not logged in or Jam not active",null,"sap.ushell.ui.footerbar.JamDiscussButton")}t=false;this.setVisible(false)}}s.prototype.setEnabled.call(this,t)};return n});