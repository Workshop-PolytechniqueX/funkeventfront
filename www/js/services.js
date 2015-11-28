angular.module('starter.services', ['ngResource','starter.constants'])

.factory('UserSession', function($resource) {
  return $resource("http://funkevent.herokuapp.com/users/sign_in.json");
})

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


 .factory('Yelp', function($http, $q, apiUrl) {
    return {
      search: function(position) {
        return $http({
          method: "get",
          url: apiUrl + 'api/v1/yelp/search',
          params: {
            limit: 10,
            radius_filter: 500,
            sort: 1,
            ll: [position.coords.latitude, position.coords.longitude].join()
          }
        });
      }
    };
  });