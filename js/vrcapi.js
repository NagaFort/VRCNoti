// var apiKey = 'JlE5Jldo5Jibnk5O5hTx6XVqsJu4WJ26';
//var apiURL = 'https://api.vrchat.cloud/api/1/';
var vrcApi = {};

(function(api){

    api.apiURL = 'http://localhost:3000/api/';
    // api.apiURL = 'http://192.168.100.2:3000/api/';
    // api.apiURL = 'https://vrcnoti.herokuapp.com/api/';
    api.authorizated = false;
    api.authorization = '';
    api.userData = {};
    
    api.get = function (apiUrl, url, params={}) {

        var fullUrl = api.apiURL + 'get/' + apiUrl;

        params.url = url;
        params.authorization = api.authorization;
            
        return fetch(fullUrl, { 
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response){ return response.json();});
    };

    api.logIn = function (username, password){
        
        api.logOut();
    
        var credentialsBase64 = btoa(username+':'+password); 
        
        api.authorization = 'Basic ' + credentialsBase64;
    
        return api.get('login','auth/user')
            .then(function(response) {
                if(!response.ok) return false;

                api.authorizated = true;
                api.userData = response.data;
                return true;
            })
            .catch(function(err) {
                return false;
            });
    };

    api.logOut = function() {
        api.userData = {};
        api.authorization = '';
        api.authorizated = false;
    };

})(vrcApi);


