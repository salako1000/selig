// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'myservices', 'jagruticontroller', 'starter.config'])

.run(function($ionicPlatform,$state) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
            if (localStorage.getItem('estate_name') == null){
            $state.go('user-login');
            } else if(localStorage.getItem('estate_role') == 'resident'){
            $state.go('app.home');
            } else if(localStorage.getItem('estate_role') == 'admin'){
            $state.go('recvis');
            }

        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        }
        if (window.StatusBar) {
            StatusBar.styleLightContent();
            StatusBar.overlaysWebView(true);
        }

//         document.addEventListener("deviceready", onDeviceReady, false);
//                     function onDeviceReady() {
//                     if(window.plugin != undefined){
//     
  

            var notificationOpenedCallback = function(jsonData) {
                console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
              };

              window.plugins.OneSignal
                .startInit("0a8c0512-4cde-4a0d-97e3-f5c41e783798")
                .handleNotificationOpened(notificationOpenedCallback)
                .endInit();

                window.plugins.OneSignal.enableInAppAlertNotification(true);
            // })


  });

        // if (device.platform == 'iOS') {
        //     navigator.splashscreen.hide();
        // }
        // if (cordova.platformId == 'android') {
        //     StatusBar.backgroundColorByHexString("#641A70");
        // }
    })




.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    //Ionic native scrolling
    //$ionicConfigProvider.scrolling.jsScrolling(false);

    $stateProvider

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })
        .state('user-login', {
            url: "/user-login",
            templateUrl: "templates/user-login.html",
            controller: 'UserloginCtrl'
        })
        
        .state('app.single', {
            url: "/single",
            views: {
            'menuContent': {
            templateUrl: "templates/single.html",
            controller: 'SingleCtrl'
        }
    }

        })

        .state('app.multiple', {
            url: "/multiple",
            cache: true,
            views: {
            'menuContent': {
            templateUrl: "templates/multiple.html",
            controller: 'MultipleCtrl'
        }
    }

        })

        .state('user-signup', {
            url: "/user-signup",

            templateUrl: "templates/user-signup.html",
            controller: 'UsersignupCtrl'

        })

        .state('seenVis', {
            url: "/seenVis",
            
            templateUrl: "templates/seenVis.html",
            controller: "seenVis"
      

        })


    .state('app.home', {
        url: "/home",
         cache: false,
        views: {
            'menuContent': {
                templateUrl: "templates/home.html",
                controller: 'HometwoCtrl'
            }
        }
    })
       .state('app.hometwo', {
        url: "/hometwo",
        views: {
            'menuContent': {
                templateUrl: "templates/hometwo.html",
                controller: 'HomeCtrl'
            }
        }
    })
        .state('app.contact', {
            url: "/contact",
            views: {
                'menuContent': {
                    templateUrl: "templates/contact.html",
                    controller: 'ContactCtrl'
                }
            }
        })
        .state('app.setting', {
            url: "/setting",
            views: {
                'menuContent': {
                    templateUrl: "templates/setting.html",
                    controller: 'SettingCtrl'
                }
            }
        })
        .state('app.profile', {
            url: "/profile",
            views: {
                'menuContent': {
                    templateUrl: "templates/profile.html",
                    controller: 'ProfileCtrl'
                }
            }
        })

        .state('recvis', {
            url: "/recvis",
           
                    templateUrl: "templates/recvisitor.html",
                    controller: 'RecVisitor'

              
        })
        .state('app.gallery', {
            url: "/gallery",
            views: {
                'menuContent': {
                    templateUrl: "templates/gallery.html",
                    controller: 'GalleryCtrl'
                }
            }
        })
        .state('app.gallery-category', {
            url: "/gallery-category",
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "templates/gallery-category.html",
                    controller: 'GallerycategoryCtrl'
                }
            }
        })
        .state('app.about', {
            url: "/about",
            views: {
                'menuContent': {
                    templateUrl: "templates/about.html",
                    controller: 'AboutCtrl'
                }
            }
        })
        .state('app.faq', {
            url: "/faq",
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "templates/faq.html",
                    controller: 'FaqCtrl'
                }
            }
        })
        .state('app.articles', {
            url: "/articles",
            views: {
                'menuContent': {
                    templateUrl: "templates/articles.html",
                    controller: 'ArticlesCtrl'
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('user-login');
})

