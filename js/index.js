(function() {
    "use strict";

    var app = angular.module('drinkingGame', []);

    app.directive('selector', function() {
        return {
            restrict: 'E',
            templateUrl: '/selector.html',
            controllerAs: 'selector',
            controller: ['$http', '$scope', function($http, $scope) {
                var selector = this;

                // Loads game JSON into the scope
                selector.onChange = function() {
                    if (undefined !== selector.selectedGame && "" !== selector.selectedGame) {
                        $http.get('/data/games/' + selector.selectedGame + '.json').success(function(data) {
                            $scope.gameData = data;
                        }).error(function(data, status) {
                            alert('Could not load the game data: ' + status);
                        });
                    }
                };

                // Set the availible options
                $http.get('/data/choices.json').success(function(data) {
                    selector.games = data;
                }).error(function(data, status) {
                    alert('Could not load the game list: ' + status);
                });
            }]
        };
    });

    app.directive('checklist', ['$compile', function($compile) {
        return {
            restrict: 'E',
            templateUrl: '/checklist.html',
            controllerAs: 'checklist',
            controller: ['$scope', function($scope) {
                var checklist = this;

                // Initial values
                checklist.list = [];

                $scope.$watch('gameData', function() {
                    if ($scope.gameData !== undefined) {
                        // Reset values
                        checklist.checked = {};
                        checklist.list = $scope.gameData.checklist;
                    }
                });

                // Maps string to boolean value
                checklist.checked = {};

                // Restore if existing value
                if (localStorage.getItem('checklist')) {
                    checklist.checked = localStorage.getItem('checklist');
                }

                // Got the broadcast to save, save it
                $scope.$on('save', function(event, prefix) {
                    window.localStorage.setItem('checklist', checklist.checked);
                });

                // On change broadcast up points
                checklist.onCheckChange = function(name) {
                    if (checklist.checked[name]) {
                        $scope.$emit('drinkup', 'drinks', 1);
                    } else {
                        $scope.$emit('drinkup', 'drinks', -1);
                    }
                };
            }]
        };
    }]);

    app.directive('counter', ['$compile', function($compile) {
        return {
            restrict: 'E',
            templateUrl: '/counter.html',
            controllerAs: 'counter',
            controller: ['$rootScope', '$scope', function($rootScope, $scope) {
                var counter = this;

                counter.drinks = 0;
                counter.shots = 0;

                $scope.$watch('gameData', function() {
                    // When a new game is selected
                    if ($scope.gameData !== undefined) {
                        // Reset the drink counts
                        $scope.$emit('reset');
                        counter.drinks = 0;
                        counter.shots = 0;
                    }
                });

                $rootScope.$on('drinkup', function(event, cname, change) {
                    counter[cname] += change;
                });
            }]
        };
    }]);

    app.directive('everytime', ['$compile', function($compile) {
        return {
            restrict: 'E',
            templateUrl: '/everytime.html',
            controllerAs: 'everytime',
            controller: ['$scope', function($scope) {
                var everytime = this;

                // Initial values
                everytime.actions = [];
                everytime.phrases = [];
                everytime.shots   = [];

                $scope.$watch('gameData', function() {
                    // When a new game is selected
                    if ($scope.gameData !== undefined) {
                        // Clear the values
                        everytime.count = {};

                        // Set up new elements
                        everytime.actions = $scope.gameData.everytime.actions;
                        everytime.phrases = $scope.gameData.everytime.phrases;
                        everytime.shots = $scope.gameData.everytime.shots;
                    }
                });

                // maps action string to integer count
                everytime.count = {};
                $scope.decrement = function(what) {
                    if (everytime.count[what] > 0) {
                        everytime.count[what]--;
                        $scope.$emit('drinkup', 'drinks', -1);
                    }
                };

                $scope.increment = function(what) {
                    if (undefined === everytime.count[what]) {
                        everytime.count[what] = 0;
                    }

                    everytime.count[what]++;
                    $scope.$emit('drinkup', 'drinks', 1);
                };

                $scope.shotDec = function(action) {
                    if (everytime.count[action] > 0) {
                        everytime.count[action]--;
                        $scope.$emit('drinkup', 'shots', -1);
                    }
                };

                $scope.shotInc = function(action) {
                    if (undefined === everytime.count[action]) {
                        everytime.count[action] = 0;
                    }

                    everytime.count[action]++;
                    $scope.$emit('drinkup', 'shots', 1);
                };
            }]
        };
    }]);
})();
