// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'Devise', 'starter.controllers', 'starter.services', 'ngCordova', 'uiGmapgoogle-maps'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


.config(function(uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
        //key: 'your api key',
        //libraries: 'weather,geometry,visualization',
        v: '3.17'
      });
})




.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
 $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
  // LOGIN: $httpProvider.defaults.withCredentials = true;
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // first, the login view
  .state('auth', {
      url: '/auth',
      templateUrl: 'templates/auth.html',
      controller: 'AuthCtrl'
}) 
  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LogCtrl',
      onEnter: ['$state', 'Auth', function($state, Auth) {
        Auth.currentUser().then(function (){
          console.log("already logged in");
          $state.go('tab.map');
        })
      }]
    })
  .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'LogCtrl',
      onEnter: ['$state', 'Auth', function($state, Auth) {
        Auth.currentUser().then(function (){
          console.log("already logged in");
          $state.go('tab.map');
        })
      }]
    })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.map', {
    url: '/map',
    views: {
      'tab-map': {
        templateUrl: 'templates/tab-map.html',
        controller: 'MapCtrl'
      }
    }
  })


  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.likes', {
  url: '/likes',
  views: {
      'tab-likes': {
          templateUrl: "templates/tab-likes.html",
          controller: 'LikesCtrl'
      }
  }
})
  .state('tab.likes.performers', {
  url: '/performers',
  views: {
      'tab-likes-performers': {
          templateUrl: "templates/tab-likes-performers.html",
          controller: 'LikesCtrl'
      }
  }
})
  .state('tab.likes.places', {
  url: '/places',
  views: {
      'tab-likes-places': {
          templateUrl: "templates/tab-likes-places.html",
          controller: 'LikesCtrl'
      }
  }
})
  .state('tab.likes.params', {
      url: '/params',
      views: {
      'tab-likes-params': {
          templateUrl: "templates/tab-likes-params.html",
          controller: 'AuthCtrl'
      }
  }
}) 

  .state('tab.like', {
  url: "/likes/:likeId",
  views: {
      'like': {
          templateUrl: "templates/like.html",
          controller: 'LikeCtrl'
      }
  }
});

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
