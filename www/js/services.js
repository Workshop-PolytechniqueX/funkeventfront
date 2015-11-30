angular.module('starter.services', ['ngResource'])

.factory('Likes', function ($resource) {
    return $resource('http://funkevent.herokuapp.com/likes/:likeId.json',
     {'query':  {method:'GET', isArray:false}});
})

.factory('Places', function ($resource) {
    return $resource('http://funkevent.herokuapp.com/places/:placeId.json');
})

.factory('Places', function ($resource) {
    return $resource('http://funkevent.herokuapp.com/places/:placeId.json');
})

.factory('NearEvents', function ($resource) {
    return $resource('http://funkevent.herokuapp.com/events/nearby.json?lat=:latId&lgt=:lgtId&dist=:distId');
})

.factory('Performers', function ($resource) {
    return $resource('http://funkevent.herokuapp.com/performers/:performerId.json');
})


.factory('Markers', function(*resource, Places, Performers, NearEvents) {

  
  function getMarkers(lat,lgt,dist){
    var markers = [];
    NearEvents.query().$promise.then(function (result) {

    angular.forEach(result, function(ev) { //pour chaque like, on GET le lieu ou la place associé
      
      var performer = Performers.get({performerId: ev.performer_id});
      var place = Places.get({placeId: ev.place_id});
      markers.push( { "latitude": place.latitude,
                      "longitude": place.longitude,
                      "name": ev.name,
                      "description": ev.description,
                      "performer": performer.name,
                      "place": place.name
      } );

    } );


    };
  });

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
      Markers.getMarkers(latLng.latitude,latLng.longitude,1000).then(function(markers){

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

          var infoWindowContent = "<h4>" + markers.data[i].name + " " + marker.data[i].performer + "</h4>";          

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
