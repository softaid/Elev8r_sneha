// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/Log","sap/base/util/isPlainObject"],function(i,u){"use strict";return function e(t){if(!t||!t.ui5||!t.ui5.libs){return[]}if(!u(t.ui5.libs)){i.error("Invalid ushell configuration: /ui5/libs must be an object");return[]}return Object.keys(t.ui5.libs).filter(function(i){return this[i]},t.ui5.libs)}});