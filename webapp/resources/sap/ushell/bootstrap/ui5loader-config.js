// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
(function(){"use strict";var o=window.sap&&window.sap.ui&&window.sap.ui.loader;if(!o){throw new Error("FLP bootstrap: ui5loader is needed, but could not be found")}var i={},e=document.getElementById("sap-ui-bootstrap"),s=e&&e.getAttribute("src"),n=/^((?:.*\/)?resources\/~\d{14}~\/)/,t;if(s&&n.test(s)){t=n.exec(s)[1];window["sap-ui-config"]=window["sap-ui-config"]||{};window["sap-ui-config"].resourceRoots=window["sap-ui-config"].resourceRoots||{};window["sap-ui-config"].resourceRoots[""]=t}o.config(i)})();