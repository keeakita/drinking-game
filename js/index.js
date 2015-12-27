(function() {
    "use strict";

    var app = angular.module('drinkingGame', []);

    app.directive('checklist', ['$compile', function($compile) {
        return {
            restrict: 'E',
            templateUrl: '/checklist.html',
            controllerAs: 'checklist',
            controller: ['$scope', function($scope) {
                var checklist = this;

                checklist.list = [
                    'Donald Trump mentions his wealth or smarts',
                    '"This president..." is uttered',
                    'A candidate whines about not getting called on enough',
                    '"Make America Great Again"',
                    'Hitler, Nazis, Neville Chamberlain or related imagery, including ovens and the Holocaust',
                    'A candidate mentions his poor/hardscrabble upbringing, or a parent who "worked every day of his life."',
                    'A candidate talks about "stopping Hillary Clinton."',
                    'Anyone proposes invading Russia',
                    'Anyone proposes invading Iran',
                    'Anyone proposes invading Syria',
                    'Rand Paul disagrees',
                ];

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
            controller: ['$rootScope', function($rootScope) {
                var counter = this;

                counter.drinks = 0;
                counter.shots = 0;

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

                everytime.actions = [
                    'Claims a positive relationship with a minority, including "Some of my best friends are..."',
                    'Tries to habla Español',
                    'Invokes St. Ronald Reagan.',
                    'Advocates the use of nuclear weapons',
                    'Says something racist or bigoted, and the crowd cheers',
                ];

                everytime.phrases = [
                    'I\'m not a scientist',
                    'Repealing Obamacare',
                    'The war on Christians (or Christmas, if that\'s your fancy)',
                    'Right here in <insert state of debate>',
                    'A candidate replies with "Wrong"',
                    'Culture of dependency',
                    '"Gateway drug"',
                ];

                everytime.shots = [
                    'Kenya',
                    'All Lives Matter',
                    'Binders full of women',
                    '"Obama doesn\'t have" followed by anything',
                    'Hillary Clinton\'s emails',
                ];

                // maps action string to integer count
                everytime.count = {};

                // init
                everytime.actions.forEach(function(action) {
                    everytime.count[action] = 0;
                });

                everytime.phrases.forEach(function(phrase) {
                    everytime.count[phrase] = 0;
                });

                everytime.shots.forEach(function(shot) {
                    everytime.count[shot] = 0;
                });

                $scope.decrement = function(what) {
                    if (everytime.count[what] > 0) {
                        everytime.count[what]--;
                        $scope.$emit('drinkup', 'drinks', -1);
                    }
                }

                $scope.increment = function(what) {
                    everytime.count[what]++;
                    $scope.$emit('drinkup', 'drinks', 1);
                }

                $scope.shotDec = function(action) {
                    if (everytime.count[action] > 0) {
                        everytime.count[action]--;
                        $scope.$emit('drinkup', 'shots', -1);
                    }
                }

                $scope.shotInc = function(action) {
                    everytime.count[action]++;
                    $scope.$emit('drinkup', 'shots', 1);
                }
            }]
        };
    }]);
})();
