angular.module('myApp', []).controller('mainCtrl', function($scope, $http) {
    $scope.showDashboard = true;
    $scope.loginInfoError = ''
    $scope.names = [
        {name:'Jani',country:'Norway'},
        {name:'Hege',country:'Sweden'},
        {name:'Kai',country:'Denmark'}
    ];
    $scope.person = {};
    $scope.fullName = function() {
        return $scope.person.username + " " + $scope.person.password;
    };
    $scope.validateForm = function () {
        if ($scope.person.username && $scope.person.password) {
            return true;
        }
        return false;
    }
    $scope.submit = function ($event) {
        $event.preventDefault();
        if($scope.validateForm()){
            $scope.sendPostCall()
        }
        return false;
    }

    var getTokenCookie = function () {
        var documentCookie = document.cookie;
        var documentCookieArr = documentCookie.split(';')
        var returnVal = ''
        documentCookieArr.forEach(function (elem) {
            var trimmedElem = elem.trim();
            trimmedElem = trimmedElem.split('=')
            if(trimmedElem[0] === 'T') {
                returnVal = trimmedElem[1]
            }
        })
        return returnVal
    }

    $scope.sendGetCall = function (url, callback) {
        //$http.get("./response.json" + '?name=' + $scope.username )
        var cookie = getTokenCookie()
        $http.get(url,{
            'withCredentials': true
            // 'headers': {
            //     'Cookie': cookie
            // }
        })
            .then(function(result) {
                callback(result.data);
                $scope.serviceError = false;
            }, function(error) {
                $scope.serviceError = true;
                console.log("not an authorised user")
            });

    }

    $scope.modalAction = function (type) {
        switch (type) {
            case 'FIR':
                $scope.modalInfo = {
                    header: 'FIR',
                    text: 'File an FIR'
                }
                break;
            case 'Authority':
                $scope.modalInfo = {
                    header: 'Contact Authority',
                    text: 'Contact the concerned authority'
                }
                break;
        }
    }

    $scope.sendPostCall = function (url) {
        var req = {
            method: 'POST',
            url: 'https://www.prepchalk.com/api/login' + '?userName=' + $scope.person.username + '&password=' + $scope.person.password,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        $http(req)
            .then(function(result){
                    $scope.loginInfoError = '';
                    $scope.showDashboard = false;
                    document.cookie = 'T' + '=' + result.data.response.token + '; domain=.prepchalk.com; path=/';
                    $scope.showServices();
                },
                function(error){
                    $scope.loginInfoError = 'Login Credentials are not authenticated.'

                });

    }

    $scope.setServiceContent = function (result) {
        $scope.serviceContent = result.response[0];
    }

    $scope.getServiceContent = function (serviceName) {
        //var url = 'http://192.168.2.82:8080/api/user/action/logs?type=' + serviceName;
        //var url = './response.json?type=' + serviceName;
        var url = 'https://www.prepchalk.com/api/user/action/logs?type=' + serviceName;
        $scope.sendGetCall(url, $scope.setServiceContent);

    }

    $scope.showServices = function () {
        if($scope.loginInfoError) {
           return ;
        }
        $scope.showDashboard = false;
        //Array of service names
        $scope.servicesName = ['Aadhaar Card', 'Driving License', 'PanCard', 'Other'];
        $scope.activeTab = 'Aadhaar Card';
        //make call first time to show content of adhaar card
        $scope.getServiceContent('Aadhaar Card');

    }
    var that = this;
    this.mappedServiceObject = {
        'Aadhaar Card': 'aadhar',
        'Pan Card': 'pan',
        'Driving License': 'dl',
        'Other': 'other'
    }

    $scope.showTabContent = function(serviceName) {
        $scope.activeTab = serviceName;
        var mappedService = that.mappedServiceObject[serviceName];
        //make request and show content in $scope.serviceContent
        $scope.getServiceContent(mappedService);
       // $scope.serviceContent = serviceName;
    }


});