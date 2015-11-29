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
 

  $scope.login = function() {
    console.log($scope.user);
    Auth.login($scope.user).then(function(){
      $state.go('tab.map');
    });
  };

  $scope.register = function() {
    Auth.register($scope.user).then(function(){
      $state.go('tab.map');
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


  .controller('MapCtrl', function($scope, $timeout, $cordovaGeolocation, uiGmapGoogleMapApi, Yelp) {

    $scope.markers = [];
    $scope.infoVisible = false;
    $scope.infoBusiness = {};

    // Initialize and show infoWindow for business
    $scope.showInfo = function(marker, eventName, markerModel) {
      $scope.infoBusiness = markerModel;
      $scope.infoVisible = true;
    };

    // Hide infoWindow when 'x' is clicked
    $scope.hideInfo = function() {
      $scope.infoVisible = false;
    };

    var initializeMap = function(position) {
      console.log(position);
      if (!position) {
        // Default to downtown Paris
        position = {
          coords: {
            latitude: 48.715076, 
            longitude: 2.211249
          }
        };
      }
      console.log(position);
      // TODO add marker on current location

      $scope.map = {
        center: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        zoom: 16
      };

      // Make info window for marker show up above marker
      $scope.windowOptions = {
        pixelOffset: {
          height: -32,
          width: 0
        }
      };

      Yelp.search(position).then(function(data) {
        console.log(data);
        for (var i = 0; i < 10; i++) {
          var business = data.data.businesses[i];
          $scope.markers.push({
            id: i,
            name: business.name,
            url: business.url,
            location: {
              latitude: business.location.coordinate.latitude,
              longitude: business.location.coordinate.longitude
            }
          });
        }
      }, function(error) {
        console.log("Unable to access yelp");
        console.log(error);
      });
    };

    uiGmapGoogleMapApi.then(function(maps) {
      // Don't pass timeout parameter here; that is handled by setTimeout below
      var posOptions = {enableHighAccuracy: false};
      $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
        console.log("Got location: " + JSON.stringify(position));
        initializeMap(position);
      }, function(error) {
        console.log(error);
        initializeMap();
      });
    });

    // Deal with case where user does not make a selection
    $timeout(function() {
      if (!$scope.map) {
        console.log("No confirmation from user, using fallback");
        initializeMap();
      }
    }, 5000);

  })
  


.controller('LikeCtrl', function($scope, $stateParams, Likes) {
    $scope.like = Likes.get({likeId: $stateParams.likeId});
    
});
