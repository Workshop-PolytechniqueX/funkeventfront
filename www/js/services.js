angular.module('starter.services', ['ngResource'])


.factory('Likes', function ($resource) {
    return $resource('http://funkevent.herokuapp.com/likes/:likeId.json',
     {'query':  {method:'GET', isArray:false}});
})

.factory('Places', function ($resource) {
    return $resource('http://funkevent.herokuapp.com/places/:placeId.json');
})

.factory('Performers', function ($resource) {
    return $resource('http://funkevent.herokuapp.com/performers/:performerId.json');
})


;