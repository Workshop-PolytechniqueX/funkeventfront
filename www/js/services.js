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


.factory('Markers', function($http) {

  var markers = [];

  return {
    getMarkers: function(){


      return $http.get("http://funkevent.herokuapp.com/places.json").then(function(response){
          markers = response;          

          return markers;

      });

    }
  }

})


.factory('GoogleMaps', function($cordovaGeolocation, Markers){

  var apiKey = false;
  var map = null;

  function initMap(){

    var options = {timeout: 10000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map(document.getElementById("map"), mapOptions);

      //Wait until the map is loaded
      google.maps.event.addListenerOnce(map, 'idle', function(){


      var marker = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP,
          position: latLng
      });

      var infoWindow = new google.maps.InfoWindow({
          content: "Here I am!"
      });

      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open(map, marker);
      });

        //Load the markers
        loadMarkers();

      });

    }, function(error){
      console.log("Could not get location");

        //Load the markers
        loadMarkers();
    });

  }





  function loadMarkers(){

      //Get all of the markers from our Markers factory
      Markers.getMarkers().then(function(markers){

/*      console.log("Markers: ", markers);*/
/*
        var records = markers.data;*/

/*      var record = records[i];   */

        for (var i = 0; i < markers.data.length; i++) {
          var markerPos = new google.maps.LatLng(markers.data[i].latitude, markers.data[i].longitude);

          // Add the markerto the map
          var marker = new google.maps.Marker({
              map: map,
              animation: google.maps.Animation.DROP,
              position: markerPos
          });

          var infoWindowContent = "<h4>" + markers.data[i].name + "</h4>";          

          addInfoWindow(marker, infoWindowContent);
  
        }

      }); 

  }


  function addInfoWindow(marker, message) {

      var infoWindow = new google.maps.InfoWindow({
          content: message
      });

      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open(map, marker);
      });
      
  }

  return {
    init: function(){
      initMap();
    }
  }

});