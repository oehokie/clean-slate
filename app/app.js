angular.module("app", ["ui.router"])
    //Config
    .config(function($stateProvider, $urlRouterProvider) {
        "use strict";

        // Default location...
        $urlRouterProvider.otherwise("/");

        // Named states...
        $stateProvider
            .state("home", {
                url: "/",
                templateUrl: "app/home/home.html"
            })
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
            });
    })
    .run(function($rootScope, $location, Analytics) {
      $rootScope.$on('$stateChangeSuccess', function() {
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
    .service('Analytics', function() {

      this.recordPageview = function(url) {
        ga('set', 'page', url);
        ga('send', 'pageview');
      };

      this.recordEvent = function (category, action, label, value) {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('event');
        args.unshift('send');
        ga.apply(ga, args);
      };

    });
