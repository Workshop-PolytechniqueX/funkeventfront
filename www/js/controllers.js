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

<<<<<<< HEAD
=======
/* INFINITE SCROLL
var currentStart = 0

$scope.addItems = function() {
    for (var i = currentStart; i < currentStart+20; i++) {
      $scope.items.push("Item " + i)
    }
    currentStart += 20
    $scope.$broadcast('scroll.infiniteScrollComplete')
  }
*/

 
.controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {
>>>>>>> ce09c6d0ea209dc99fde6ca9686017a1c93bc9c0

})



.controller('LikeCtrl', function($scope, $stateParams, Likes) {
    $scope.like = Likes.get({likeId: $stateParams.likeId});
    
});
