
sap.ui.define(function () {
	"use strict";

	var Formatter = {


		getBooleanValue : function(Ans){

			var boolAns = new sap.ui.model.type.Boolean();
		  
			if(Ans === 1 || Ans ==="1" || Ans === "true"){
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
                case 1:
                    return  5;
					case 0:
					return 1;
					default:
                	return 1;
								
					}
				}
				else
				{
					return  1;
				}
		},

		setCheckbox: function (sValue) 
        {	
			let model = this.getView().getModel("projectModel").oData.modelData;

			let a=true;
			let b=false;
			 if(sValue && sValue.trim() !== "")
			 {
				return a;
			 }
			 else{
				 return b;

			 }

		},

		setCheckboxEnable: function (sValue) 
        {	
			
			let a=true;
			let b=false;
			
			  if(sValue && sValue.trim() !== "" && sValue.trim() != "-"  && this.count==0)
			 {
				return b;
			 }
			 else{
				 return a;
			 }

		},

		setItemStockColorProject: function (sValue) 
        {	
			if(sValue != null){
			switch (sValue) {
                case 1:
                    return  5;
					case 0:
					return 5;
					default:
                	return 5;
								
					}
				}
                return
		},
	
		setDisplayOnly: function (sValue) 
        {	
			let userdepatment;
			let model = this.getView().getModel("projectModel").oData;
			
			let a=true;
			let b=false;
			
			if(sValue==undefined || sValue==null ){
				return a;
			}
			 else{
				 return b;
			 }

		},
		
		setDatePicking: function (date) 
        {	
			let model = this.getView().getModel("projectModel").oData.modelData;
// 			
	
					let a=true;
					let b=false;
					
					if((date!=null || date===undefined|| date==="-") && this.count==0)
					{
						return b;
					}
					else  if(date==null && this.count==0){
						return a;
					}
			 },
			 

		setDatePicker: function (date,a1,b1) 
        {	
			let model = this.getView().getModel("projectModel").oData.modelData;
// 			
					let a=true;
					let b=false;
					
					if((date!=null || date===undefined|| date==="-") && this.count==0)
					{
						console.log(model[1].Sequence6enddate)

						return b;
					}
					else  if(date==null && this.count==0){
						return a;
					}

			 }
	
	};

	return Formatter;

}, /* bExport= */ true);
