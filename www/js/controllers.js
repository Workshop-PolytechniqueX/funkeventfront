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
  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){

      var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
      });      

      var infoWindow = new google.maps.InfoWindow({
          content: "Here I am!"
      });

      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
      });

    });

  }, function(error){
    console.log("Could not get location");
  });
})

  


.controller('LikeCtrl', function($scope, $stateParams, Likes) {
    $scope.like = Likes.get({likeId: $stateParams.likeId});
    
});
