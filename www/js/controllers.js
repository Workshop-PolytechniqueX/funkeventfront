angular.module('starter.controllers', ['starter.services'])


.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

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

})



.controller('LikeCtrl', function($scope, $stateParams, Likes) {
    $scope.like = Likes.get({likeId: $stateParams.likeId});
    
});
