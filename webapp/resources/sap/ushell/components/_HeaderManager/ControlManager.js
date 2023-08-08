// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/m/Avatar","sap/m/library","sap/ui/Device","sap/ushell/EventHub","sap/ushell/resources","sap/ushell/ui/shell/ShellHeadItem"],function(e,t,a,r,s,i){"use strict";var n=t.AvatarSize;var o=[];function u(e,t,a){o.push(p(a))}function l(){o.forEach(function(e){var t=sap.ui.getCore().byId(e);if(t){if(t.destroyContent){t.destroyContent()}t.destroy()}});o=[]}function p(t){var a="meAreaHeaderButton",i=sap.ushell.Container.getUser(),o=s.i18n.getText("MeAreaToggleButtonAria",i.getFullName());var u=new e({id:a,src:"{/userImage/personPlaceHolder}",initials:i.getInitials(),ariaHasPopup:"Menu",displaySize:n.XS,tooltip:o,press:function(){r.emit("showMeArea",Date.now())}});u.setModel(t);return a}return{init:u,destroy:l}});