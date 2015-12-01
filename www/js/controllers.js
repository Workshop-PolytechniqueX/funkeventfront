angular.module('starter.controllers', ['starter.services', 'Devise'])

.config(function(AuthProvider) {
        AuthProvider.loginPath('http://funkevent.herokuapp.com/users/sign_in.json');
        AuthProvider.logoutPath('http://funkevent.herokuapp.com/users/sign_out.json');
        AuthProvider.logoutMethod('GET');
        AuthProvider.loginMethod('GET');
        AuthProvider.resourceName('customer');
    })

/* controller qui gère les formulaires de login et signup */
.controller('LogCtrl', [
'$scope',
'$state',
'Auth',
function($scope, $state, Auth){
   var config = {
            headers: {
                'X-HTTP-Method-Override': 'POST'
            }
        };
 
  console.log("hi");
  $scope.login = function() {
    Auth.login($scope.user, config).then(function(){
      $state.go('tab.likes');
    });
  };

  $scope.register = function() {
    Auth.register($scope.user, config).then(function(){
      $state.go('tab.likes');
    });
  };


}])

/* Controle l'authentification de l'utilisateur (savoir s'il est login ou pas) */
.controller('AuthCtrl', ['$scope','Auth', function($scope, Auth) {
  $scope.signedIn = Auth.isAuthenticated;
  $scope.logout = Auth.logout;
  Auth.currentUser().then(function (user){
  $scope.user = user;
  });

  $scope.$on('devise:new-registration', function (e, user){
    $scope.user = user;
  });

  $scope.$on('devise:login', function (e, user){
    console.log("Log in");
    $scope.user = user;
  });

  $scope.$on('devise:logout', function (e, user){
    console.log("Log out");
    $scope.user = {};
  });

   $scope.logout = function() {
    Auth.logout($scope.user, config).then(function(){
      $state.go('tab.likes');
    });
  };

}])

.controller('LikesCtrl', ['$scope','Likes','Performers','Places',
  function($scope, Likes, Performers, Places) {
  
    
    $scope.performersLike = [];
    $scope.placesLike = [];

    /* Promise, pour attendre le resultat de la Likes.query() avant de faire autre chose! */
    Likes.query().$promise.then(function (result) { //result est le tableau contenant les likes de l'utilisateur

  
    angular.forEach(result, function(like) { //pour chaque like, on GET le lieu ou la place associé
      
      if(like.like_link_type=="performer"){
        $scope.performersLike.push(Performers.get({performerId: like.like_link_id}) );
      }
      else if(like.like_link_type=="place"){
        $scope.placesLike.push(Places.get({placeId: like.like_link_id}) );
      }

    });

  });
}])


.controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {

})


.controller('LikeCtrl', function($scope, $stateParams, Likes) {
    $scope.like = Likes.get({likeId: $stateParams.likeId});
    
})

.controller('EventsCtrl', function($scope, Events) {
    $scope.events = Events.query();
    
})

.controller('EventCtrl', function($scope, $stateParams, Events) {
    $scope.event = Events.get({eventId: $stateParams.eventId});
    
})

.controller('SearchEventsCtrl', function($scope, SearchEvents, Events) {
  
    $scope.events = Events.query();

    $scope.searchevents = function() {
      $scope.events = SearchEvents.query({chpId: $scope.query.price, catId: $scope.query.category, gnrId: $scope.query.genre, latId: $scope.query.latitude, lgtId: $scope.query.longitude, distanceId: $scope.query.distance});
    }
    
})

.controller('Homectrl', function($scope) {

    $scope.init = function() {
      alert($scope.query.price);
    }

  });