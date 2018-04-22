'use strict';

angular

    .module('wayTracker.map', ['ngRoute'])
    .factory('mapsInit', mapsInitFactory)
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/map', {
            templateUrl: 'map/map.html',
            controller: 'MapCtrl'
        });
    }])
    .controller('MapCtrl', ['$scope', 'mapsInit', function ($scope, mapsInit) {


        let getUserData = function () {

            let user = {
                name: 'Vlad',
                mapCenter: {lat: 50.9169244, lng: 34.8011216},
                path: ["mvxuHeugsEup@y~@k[aiA|`AbAR}`Arg@hh@eJrm@vYr]jXpV}~@?dKv}@", "yc{uHqfisEiUscAtYhRTji@yGtIoL_GtCcOxG?dL~[`[bW", "{nwuHa}isEIfbBfQe|@lF|b@iWcAfPm[o`@e_@kWyJIhw@lGdW}SfCuAjZhVa{@dKpd@cfBybEtr@bHdKnwA"]
            };

            user.stats = {};
            user.stats.distance = 0;

            return user;
        };

        let drawPath = function (path) {
            for (let i in path) {
                let decodedPath = google.maps.geometry.encoding.decodePath(path[i]);
                $scope.userData.stats.distance += google.maps.geometry.spherical.computeLength(decodedPath);
                let decodedLevels = decodeLevels("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");

                let setRegion = new google.maps.Polyline({
                    path: decodedPath,
                    levels: decodedLevels,
                    strokeColor: "#008931",
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    map: $scope.map
                });

            }
            document.getElementById("myHeader").innerHTML = $scope.userData.stats.distance.toFixed(0);

        };

        let init = function (mapsInit) {
            $scope.newPoly = false;
            $scope.userId = '0'; // m
            let mapConfig = {zoom: 14}; // m
            $scope.userData = getUserData($scope.userId);
            mapConfig.center = $scope.userData.mapCenter;

            mapsInit.mapsInitialized.then(function () {
                initMap(mapConfig);
            }, function () {
                // Promise rejected
            });
        };

        let decodeLevels = function (encodedLevelsString) {
            let decodedLevels = [];

            for (let i = 0; i < encodedLevelsString.length; ++i) {
                let level = encodedLevelsString.charCodeAt(i) - 63;
                decodedLevels.push(level);
            }
            return decodedLevels;
        };

        document.onkeypress = function (e) {
            e = window.event || e;
            if (e.charCode === 110 || e.charCode === 1090) {
                $scope.newPoly = true;
                $scope.userData.path.push(google.maps.geometry.encoding.encodePath($scope.temp));
                let tre = JSON.stringify($scope.userData.path);
                savePathForUser();
                $scope.userData.stats.distance += google.maps.geometry.spherical.computeLength($scope.temp);
                console.log($scope.userData.stats.distance);
                document.getElementById("myHeader").innerHTML = $scope.userData.stats.distance.toFixed(0);
            } else if (e.charCode === 102 || e.charCode === 1072) {
            }
        };

        let initMap = function (mapConfig) {

            $scope.map = new google.maps.Map(document.getElementById('map'), mapConfig);
            google.maps.event.addListener($scope.map, 'click', function (event) {
                addLatLngToPoly(event.latLng, $scope.poly);
            });
            $scope.map.addListener('mousemove', function (event) {
                let existingPolylinePath = $scope.poly.getPath();
                if (existingPolylinePath.length > 0 && $scope.newPoly === false) {
                    $scope.tempPoly.setPath([existingPolylinePath.getAt(existingPolylinePath.length - 1), event.latLng]);
                }
            });
            google.maps.event.addListener($scope.map, 'mousemove', function (event) {
                $scope.map.setOptions({draggableCursor: 'crosshair'});
            });
            $scope.poly = new google.maps.Polyline({
                strokeColor: '#008931',
                strokeOpacity: 1.0,
                strokeWeight: 3,
                map: $scope.map,
                clickable: false
            });
            $scope.tempPoly = new google.maps.Polyline({
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 3,
                map: $scope.map,
                clickable: false
            });

            drawPath($scope.userData.path);
        };

        let addLatLngToPoly = function (latLng) {
            let path = $scope.poly.getPath();
            if ($scope.newPoly === true) {
                $scope.poly = new google.maps.Polyline({
                    strokeColor: '#005431',
                    strokeOpacity: 1,
                    strokeWeight: 3,
                    map: $scope.map
                });
                $scope.newPoly = false;
            }
            path = $scope.poly.getPath();
            path.push(latLng);
            $scope.temp = '';
            $scope.temp = path;
        };

        let savePathForUser = function (userId, path) {
            //savehere
        };

        init(mapsInit);

    }]);


function mapsInitFactory($window, $q) {
    let asyncUrl = 'https://maps.googleapis.com/maps/api/js?libraries=geometry&callback=',
        mapsDefer = $q.defer();

    $window.googleMapsInitialized = mapsDefer.resolve;

    let asyncLoad = function (asyncUrl, callbackName) {
        let script = document.createElement('script');
        script.src = asyncUrl + callbackName;
        document.body.appendChild(script);
    };
    asyncLoad(asyncUrl, 'googleMapsInitialized');

    return {
        mapsInitialized: mapsDefer.promise
    };
}