angular.module('myApp', []).controller('mainCtrl', function($scope, $http) {
    $scope.showDashboard = true;
    $scope.names = [
        {name:'Jani',country:'Norway'},
        {name:'Hege',country:'Sweden'},
        {name:'Kai',country:'Denmark'}
    ];
    $scope.person = {};
    $scope.fullName = function() {
        return $scope.person.username + " " + $scope.person.password;
    };
    $scope.validateForm = function() {
        if ($scope.person.username && $scope.person.password) {
            return true;
        }
        return false;
    }
    $scope.submit = function($event) {
        $event.preventDefault();
        if($scope.validateForm()){
            $scope.sendPostCall()
        }
        return false;
    }

    $scope.sendGetCall = function(url) {
        //$http.get("./response.json" + '?name=' + $scope.username )
        $http.get(url)
            .then(function(response) {
                $scope.data = response.data;
        });

    }

    $scope.sendPostCall = function(url) {
        //$http.get("https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json" + '?name=' + $scope.username )
        // $http.get("./response.json" + '?name=' + $scope.username )
        //     .then(function(response) {
        //         $scope.data = response.data;
        // });
        var req = {
            method: 'POST',
            url: 'http://192.168.2.82:8080/api/login' + '?userName=' + $scope.person.username + '&password=' + $scope.person.password,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        $http(req)
            .then(function(result){
                    console.log('success', result)
                    document.cookie = 't' + '=' + result.data.response.token;
                },
                function(error){
                    console.log('error', error)
                });

    }

    $scope.showServices = function() {
        $scope.showDashboard = false;
        //Array of service names
        $scope.servicesName = ['Adhaar Card', 'Driving License', 'PanCard', 'Other'];
        $scope.activeTab = 'Adhaar Card';
        //make call first time to show content of adhaar card
        $scope.serviceContent = 'Adhaar Card';

    }

    $scope.showTabContent = function(serviceName) {
        $scope.activeTab = serviceName;
        //make request and show content in $scope.serviceContent
        $scope.serviceContent = serviceName;
    }


});