'use strict';

angular
    .module('cleanSlate', [
        'firebase',
        'angular-md5',
        'ui.router'
    ])
    //Config
    .config(function ($stateProvider, $urlRouterProvider) {
        // Default location...
        $urlRouterProvider.otherwise("/");

        // Named states...
        $stateProvider
            .state("home", {
                url: "/",
                templateUrl: "app/home/home.html"
            })
            .state('login', {
                url: '/login',
                controller: 'AuthCtrl as authCtrl',
                templateUrl: 'app/auth/login.html'
                // ,
                // resolve: {
                //     requireNoAuth: function ($state, Auth) {
                //         return Auth.$requireAuth().then(function (auth) {
                //             $state.go('login');
                //         }, function (error) {
                //             return;
                //         });
                //     }
                // }
            })
            // .state('register', {
            //     url: '/register',
            //     controller: 'AuthCtrl as authCtrl',
            //     templateUrl: 'app/auth/register.html',
            //     resolve: {
            //         requireNoAuth: function ($state, Auth) {
            //             return Auth.$requireAuth().then(function (auth) {
            //                 $state.go('login');
            //             }, function (error) {
            //                 return;
            //             });
            //         }
            //     }
            // })
            .state("acquire", {
                url: "/acquire",
                templateUrl: "app/acquire/acquire.html"
            })
            .state("acquire-in-person", {
                url: "/acquire-in-person",
                templateUrl: "app/acquire-in-person/acquire-in-person.html"
            })
            .state("legal", {
                url: "/legal",
                templateUrl: "app/legal/legal.html"
            })
            .state("eligibility", {
                url: "/eligibility/:questionId",
                templateUrl: "app/eligibility/eligibility.html",
                controller: "EligibiltyController"
            })
            .state("faqs", {
                url: "/faqs",
                templateUrl: "app/faqs/faqs.html"
            })
            .state("definitions", {
                url: "/definitions",
                templateUrl: "app/definitions/definitions.html"
            })
            .state("screener", {
                url: "/screener",
                templateUrl: "app/screener/screener.html"
            })
            .state("contact", {
                url: "/contact",
                templateUrl: "app/contact/contact.html"
            })
            .state("admin", {
                url: "/admin",
                templateUrl: "app/admin/home.html",
                resolve: {
                    auth: function ($state, Auth) {
                        return Auth.$requireAuth().catch(function () {
                            $state.go('login');
                        });
                    }
                }
            })
            .state("admin.reports", {
                url: "/admin/reports",
                templateUrl: "app/admin/reports.html",
                resolve: {
                    auth: function ($state, Auth) {
                        return Auth.$requireAuth().catch(function () {
                            $state.go('login');
                        });
                    }
                }
            })
            .state("admin.questions", {
                url: "/admin/questions",
                templateUrl: "app/admin/questions.html",
                resolve: {
                    auth: function ($state, Auth) {
                        return Auth.$requireAuth().catch(function () {
                            $state.go('login');
                        });
                    }
                }
            })
            .state("admin.edit", {
                url: "/admin/question/:questionId",
                templateUrl: "app/admin/edit.html",
                resolve: {
                    auth: function ($state, Auth) {
                        return Auth.$requireAuth().catch(function () {
                            $state.go('login');
                        });
                    }
                }
            })
            .state("admin.partners", {
                url: "/admin/partners",
                templateUrl: "app/admin/partners.html",
                resolve: {
                    auth: function ($state, Auth) {
                        return Auth.$requireAuth().catch(function () {
                            $state.go('login');
                        });
                    }
                }
            })
            .state("admin.motions", {
                url: "/admin/motions",
                templateUrl: "app/admin/motions.html",
                resolve: {
                    auth: function ($state, Auth) {
                        return Auth.$requireAuth().catch(function () {
                            $state.go('login');
                        });
                    }
                }
            })
            .state("admin.feedback", {
                url: "/admin/feedback",
                templateUrl: "app/admin/feedback.html",
                resolve: {
                    auth: function ($state, Auth) {
                        return Auth.$requireAuth().catch(function () {
                            $state.go('login');
                        });
                    }
                }
            });
    })
    .run(function ($rootScope, $location, Analytics) {
        $rootScope.$on('$stateChangeSuccess', function () {
            Analytics.recordPageview($location.url());
        });
    })
    //Controller

    //After render directive so that jQuery for ReadClearly works
    .directive('afterRender', ['$timeout', function ($timeout) {
        var def = {
            restrict: 'A',
            terminal: false,
            transclude: false,
            link: function (scope, element, attrs) {
                $timeout(scope.$eval(attrs.afterRender), 400);  //Calling a scoped method
            }
        };
        console.log(def);
        return def;
    }])
    .service('Analytics', function () {

        this.recordPageview = function (url) {
            ga('set', 'page', url);
            ga('send', 'pageview');
        };

        this.recordEvent = function (category, action, label, value) {
            var args = Array.prototype.slice.call(arguments);
            args.unshift('event');
            args.unshift('send');
            ga.apply(ga, args);
        };

    })
    .constant('FirebaseUrl', 'https://blazing-torch-1225.firebaseio.com/')
