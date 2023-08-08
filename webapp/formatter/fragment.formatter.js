
sap.ui.define(function () {
	"use strict";

	var Formatter = {


		getBooleanValue : function(Ans){

			var boolAns = new sap.ui.model.type.Boolean();
		  
			if(Ans === 1 || Ans ==="1" || Ans == "true"){
				boolAns = true;
			}else{
				boolAns = false;
			}
		  
			return boolAns;
		},


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
									return 9;
								case "started":
									return 2;
								case "approved & transfer":
								return 7;
                				default:
                					return 9;
					}
				}
		},
		setColorHouseready: function (sValue) 
        {	
			if(sValue != null){
			switch (sValue.toLowerCase()) {

									case "ready":
                					return 5;
                				case "approved":
                                    return 8;
                                case "rejected":
                                    return 3;
                				default:
                					return 9;
					}
				}
		},
		setColorMaterialReq: function (sValue) 
        {	
			if(sValue != null){
			switch (sValue.toLowerCase()) {

								case "new":
									return 5;
								case "approve":
									return 8;
								case "cancel":
									return 3;
								case "complete":
								return 7;
                				default:
                					return 9;
					}
				}
		},
		setItemStockColor: function (sValue) 
        {	
			if(sValue != null){
			switch (sValue) {

								case 0:
									return 3;
								default:
                					return 8;
								
					}
				}
		},
	
	};

	return Formatter;

}, /* bExport= */ true);
