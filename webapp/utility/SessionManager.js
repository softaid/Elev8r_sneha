( function(MYSAP, $, undefined) {

    MYSAP.SessionManager = function() {};

    MYSAP.SessionManager.getSession = function(key)
 {
              var session;
              // Get item over SessionStorage API
              var session_storage = sessionStorage.getItem(key)
;

              if (session_storage) {
                        // Parse JSON to object
                        session_storage = JSON.parse(session_storage);
                        // Create new object
                        session = new MYSAP.Session(
                                    session_storage.userName, 
                                    session_storage.companyId, 
                                    session_storage.companyname, 
                                    session_storage.email, 
                                    session_storage.countrycode,
                                    session_storage.address,
                                    session_storage.detailaddress,
                                    session_storage.companycontact,
                                    session_storage.companyemail,
                                    session_storage.city,
                                    session_storage.pincode,
                                    session_storage.contactno2,
                                    session_storage.faxnumber,
                                    session_storage.department,
                                    session_storage.userId, 
                                    session_storage.roleIds, 
                                    session_storage.roleNames, 
                                    session_storage.accessToken, 
                                    session_storage.cToken,
                                    session_storage.userkey);
              }
              return session;
    };

    MYSAP.SessionManager.setSession = function(key, session) {
              if (session) {
                        // Serialize Object to JSON
                        var session_storage = JSON.stringify(session);
                        // Set item over SessionStorage API
                        sessionStorage.setItem(key, session_storage);
              }
    };

    MYSAP.SessionManager.clearSession = function(key)
 {
        sessionStorage.removeItem(key)
;
    }

}(window.MYSAP = window.MYSAP || {}, jQuery));




(function(MYSAP, $, undefined) {
    // Constructor
    MYSAP.Session = function(userName, companyId, companyname, email, countrycode, address,detailaddress, companycontact, companyemail, city, pincode, contactno2, faxnumber, department, userId, roleIds, roleNames, accessToken, cToken, userkey){
              this.userName = userName;
              this.companyId  = companyId;
              this.companyname = companyname;
              this.email = email;
              this.countrycode = countrycode,
              this.address = address;
              this.detailaddress = detailaddress;
              this.companycontact = companycontact;
              this.companyemail = companyemail;
              this.city = city;
              this.pincode = pincode;
              this.contactno2 = contactno2;
              this.faxnumber = faxnumber;
              this.department = department;
              this.userId  = userId;
              this.roleIds = roleIds;
              this.roleNames = roleNames;
              this.accessToken = accessToken;
              this.cToken = cToken;
              this.userkey = userkey;
    };

    MYSAP.Session.constructor = MYSAP.Session;

    // Sample instance method
    MYSAP.Session.prototype.log = function(){
        console.log("User Name : " + this.userName + ', Company Id : ' + this.companyId + ', Countrycode : ' + this.countrycode + 'Company Name : ' + this.companyname + 'Email : ' + this.email + ', User Id : ' + this.userId +  ', Role Ids : ' + this.roleIds + ', Role Names : ' + this.roleNames +', Token : ' + this.token  + ', cToken : ' + this.cToken  + ', userkey : ' + this.userkey + ', Address : ' + this.address + ', DetailAddress : ' + this.detailaddress +  ', companyemail : ' + this.companyemail + ', contactno : ' + this.companycontact + ', Department : ' + this.department);
    };
    
}(window.MYSAP = window.MYSAP || {}, jQuery));