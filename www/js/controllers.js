angular.module('starter.controllers', ['starter.services'])

.controller('DashCtrl', function($scope) {})


.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('LikesCtrl', function($scope, Likes, Performers, Places) {
    $scope.likes = Likes.query();
    /* this.result = [];

    for( like in array){
      if(like.like_link_type="performer"){
        this.result.push(Performers.get({performerId: like.like_link_id}));
      }
      else if(like.like_link_type="place"){
        this.result.push(Places.get({placeId: like.like_link_id}));
      }
    }
    console.log(this.result);
    
    $scope.likes=array;
    return $scope.likes; */
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
;
