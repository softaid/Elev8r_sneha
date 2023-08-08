
sap.ui.define(function () {
	"use strict";

	var Formatter = {

		getPermissions : function(param){
            if(param instanceof Array){
                return param;
            }
            else if(param != undefined && param != ""){
                return param.replace(/'/g,'').replace(/"/g, '').split(','); 
            }
            else
                return [];
        },

        addDeselectOption: function() {
            var that = this;
            this.getBinding("items").attachDataReceived(function(){
                that.insertItem(new sap.ui.core.ListItem({text: '', key: undefined}), 0);
            });
        }
        

    }

	return Formatter;

}, /* bExport= */ true);
