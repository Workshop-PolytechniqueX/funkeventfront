var APIAccessModule = angular.module('starter.services', ['ngResource'])


APIAccessModule.factory('Likes', function ($resource) {
    return $resource('http://funkevent.herokuapp.com/likes/:likeId.json');
});

APIAccessModule.factory('Places', function ($resource) {
    return $resource('http://funkevent.herokuapp.com/places/:placeId.json');
});

APIAccessModule.factory('Performers', function ($resource) {
    return $resource('http://funkevent.herokuapp.com/performers/:performerId.json');
});

APIAccessModule.factory('Events', function ($resource) {
    return $resource('http://funkevent.herokuapp.com/events/:eventId.json');
});
