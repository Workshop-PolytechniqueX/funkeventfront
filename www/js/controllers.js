angular.module('starter.controllers', ['starter.services', 'Devise'])

.config(function(AuthProvider) {
        AuthProvider.loginPath('http://funkevent.herokuapp.com/users/sign_in.json');
        AuthProvider.logoutPath('http://funkevent.herokuapp.com/users/sign_out.json');
        AuthProvider.logoutMethod('DELETE');
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

   var config = {
            headers: {
                'X-HTTP-Method-Override': 'DELETE'
            }
        };
 

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
    Auth.logout(config).then(function(oldUser){
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

.controller('PerformerCtrl', function($scope, $stateParams, Performers, Images) {
  $scope.performer = Performers.get({performerId: $stateParams.performerId});
  Images.query({imtype: "performer", imid: $stateParams.performerId}).$promise.then(function (result) {
    if (result != null){
      $scope.image = result[0];
    }

  });
    
})

.controller('PlaceCtrl', function($scope, $stateParams, Places, Images, Likes, $timeout) {
  $scope.place = Places.get({placeId: $stateParams.placeId});
  Images.query({imtype: "place", imid: $stateParams.placeId}).$promise.then(function (result) {
    if (result != null){
      $scope.image = result[0];
    }
  }); 

   $scope.addLike = function() {

     $scope.like=new Likes();
      result = $scope.like;
      result.link_like_id=$scope.place.id;
      result.link_like_type="place";
      result.user_id=2;
      console.log(result);
      result.$save();

  };
    // $scope.like.link_like_type="place";
    // $scope.like.link_like_id=$scope.place.id;
    // $scope.like.user_id=1;
     //$http.post('ttp://funkevent.herokuapp.com/likes.json', $scope.like);
}
)

.controller('EventCtrl', function($scope, $stateParams, Events, Places, Performers, Images) {
  Events.get({eventId: $stateParams.eventId}).$promise.then(function (result) {
    $scope.even = result;
    $scope.perf = Performers.get({performerId: result.performer_id});
    $scope.place = Places.get({placeId: result.place_id});
  })
 
  Images.query({imtype: "event", imid: $stateParams.eventId}).$promise.then(function (result) {
    if (result != null){
      $scope.image = result[0];

    }
  });  
})

.controller('SearchEventsCtrl', function($scope, SearchEvents, Events) {
  
    $scope.events = Events.query();

    $scope.searchevents = function() {
      $scope.events = SearchEvents.query({chpId: $scope.query.price,
       catId: $scope.query.category, gnrId: $scope.query.genre, latId: $scope.query.latitude,
        lgtId: $scope.query.longitude, distanceId: $scope.query.distance, date: $scope.query.date});
    }
    
})
;
