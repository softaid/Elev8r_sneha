
sap.ui.define(function () {
	"use strict";

	var Formatter = {

        setColorCurrSetting: function (sValue) 
        {
			if(sValue != null){
            switch (sValue.toLowerCase()) {
                				case "yes":
                					return 8;
                				case "no":
                					return 3;
                				default:
                					return 9;
					}
				}
				return
        },
        
        setColorEggsProcSche: function (sValue) 
        {
			if(sValue != null){
			switch (sValue.toLowerCase()) {
                				case "new":
                					return 5;
                				case "approve":
                                    return 8;
                                case "cancel":
                                    return 3;
                                case "processed":
                					return 4;
                				default:
                					return;
					}
				}
		},

		setColorFarmSts: function (sValue) 
        {
			if(sValue != null){
			switch (sValue.toLowerCase()) {
                				case "new":
                					return 5;
                				case "approve":
                                    return 8;
                                case "reject":
                                    return 3;
                				default:
                					return;
					}
				}
		}
	};

	return Formatter;

}, /* bExport= */ true);
