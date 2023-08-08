jQuery.sap.require("sap.ui.model.json.JSONModel");
sap.ui.model.json.JSONModel.extend("myJSONModel", {
          //declare our new method including two new parameters fnSuccess and fnError, our callback functions
          loadDataNew: function(sURL, fnSuccess, fnError, oParameters, bAsync, sType, bMerge, bCache){
                              var that = this;
                              if (bAsync !== false) {
                                        bAsync = true;
                              }
                              if (!sType)          {
                                        sType = "GET";
                              }
                              if (bCache === undefined) {
                                        bCache = this.bCache;
                              }
                              this.fireRequestSent({url : sURL, type : sType, async : bAsync, info : "cache="+bCache+";bMerge=" + bMerge});
                              jQuery.ajax({
                                url: sURL,
                                async: bAsync,
                                dataType: 'json',
                                cache: bCache,
                                data: oParameters,
                                type: sType,
                                success: function(oData) {
                                        if (!oData) {
                                                  jQuery.sap.log.fatal("The following problem occurred: No data was retrieved by service: " + sURL);
                                        }
                                        that.setData(oData, bMerge);
                                        that.fireRequestCompleted({url : sURL, type : sType, async : bAsync, info : "cache=false;bMerge=" + bMerge});
                                        // call the callback success function if informed
                                        if (typeof fnSuccess === 'function') {
                                             fnSuccess(oData);
                                         }
                                },
                                error: function(XMLHttpRequest, textStatus, errorThrown){
                                        jQuery.sap.log.fatal("The following problem occurred: " + textStatus, XMLHttpRequest.responseText + ","
                                                                      + XMLHttpRequest.status + "," + XMLHttpRequest.statusText);
                                        that.fireRequestCompleted({url : sURL, type : sType, async : bAsync, info : "cache=false;bMerge=" + bMerge});
                                        that.fireRequestFailed({message : textStatus,
                                                  statusCode : XMLHttpRequest.status, statusText : XMLHttpRequest.statusText, responseText : XMLHttpRequest.responseText});
                                         // call the callback error function if informed
                                        if (typeof fnError === 'function') {
                                             fnError({message : textStatus, statusCode : XMLHttpRequest.status, statusText : XMLHttpRequest.statusText, responseText : XMLHttpRequest.responseText});
                                         }
                                }
                              });
          }
});