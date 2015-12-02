angular.module('starter.services', ['ngResource'])

.factory('Likes', function ($resource) {
    return $resource('http://funkevent.herokuapp.com/likes/:likeId.json',
     {'query':  {method:'GET', isArray:false}});
})

.factory('Places', function ($resource) {
    return $resource('http://funkevent.herokuapp.com/places/:placeId.json');
})

.factory('Events', function ($resource) {
    return $resource('http://funkevent.herokuapp.com/events/:eventID.json');
})

.factory('NearEvents', function ($resource) {
    return $resource('http://funkevent.herokuapp.com/events/nearby.json?latitude=:latId&longitude=:lgtId&distance=:distId');
})

.factory('SearchEvents', function ($resource) {
    return $resource('http://funkevent.herokuapp.com/events/search.json?latitude=:latId&longitude=:lgtId&distance=:distanceId&chp=:chpId&cat=:catId&gnr=:gnrId');
})

.factory('Performers', function ($resource) {
    return $resource('http://funkevent.herokuapp.com/performers/:performerId.json');
})


.factory('Markers', ['$q','$resource','Places','Performers','NearEvents', function ($q, $resource, Places, Performers, NearEvents) {

  
  var place = null;
  var performer = null;

  return {
    getMarkers: function(Lat,Lgt,dist){
    var promises = [];
    var deferredCombinedItems = $q.defer();
    var combinedItems = [];

    return NearEvents.query({latId: Lat, lgtId: Lgt, distId: dist}).$promise.then(function (result) {

    angular.forEach(result, function(ev) { //pour chaque like, on GET le lieu ou la place associé

      var deferredItemList = $q.defer();

      Places.get({placeId: ev.place_id}).$promise.then(function (place){
      
          combinedItems.push({ "latitude": place.latitude,
                          "longitude": place.longitude,
                          "name": ev.name,
                          "description": ev.description,
                          "place": place.name
          });
          
          deferredItemList.resolve();
/*          console.log("promesse la plus profonde finie")*/

      } );

      promises.push(deferredItemList.promise);
/*      console.log("fin de l'élement boucle for");*/
    } );

    return $q.all(promises).then( function() {
/*          console.log("se fait tout a la fin");*/
          deferredCombinedItems.resolve(combinedItems);
          return combinedItems;
    });

    });
  
    }
  }

}])


.factory('GoogleMaps', function($cordovaGeolocation, Markers){

  var apiKey = false;
  var map = null;
  var maPos = null;
  var markerCache = [];
  var openwindow;

  function initMap(){

    var options = {timeout: 10000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      maPos = latLng;

      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map(document.getElementById("map"), mapOptions);

      //Wait until the map is loaded
      google.maps.event.addListenerOnce(map, 'idle', function(){

      //Reload markers every time the zoom changes
      google.maps.event.addListener(map, 'zoom_changed', function(){
        console.log("zoomed!");
        loadMarkers();
      });

      var iconBase = 'https://maps.google.com/mapfiles/kml/paddle/';
      var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: iconBase + 'blu-blank-lv.png'
      });

      var infoWindow = new google.maps.InfoWindow({
          content: "Vous êtes ici!"
      });

      google.maps.event.addListener(marker, 'click', function () {

        if(openwindow){
          eval(openwindow).close();
      }

        infoWindow.open(map, marker);
        openwindow=infoWindow;

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

      var bounds = map.getBounds();
 
      //Convert objects returned by Google to be more readable
      var boundsNorm = {
          northeast: {
              lat: bounds.getNorthEast().lat(),
              lng: bounds.getNorthEast().lng()
          },
          southwest: {
              lat: bounds.getSouthWest().lat(),
              lng: bounds.getSouthWest().lng()
          }
      };
 
      var boundingRadius = (getDistanceBetweenPoints(boundsNorm.northeast, boundsNorm.southwest, 'km')) / 2;
 
      //Get all of the markers from our Markers factory
      Markers.getMarkers(maPos.lat(),maPos.lng(),boundingRadius).then(function(markers){

        //For each place, we are putting a marker on the map
        for (var i = 0; i < markers.length; i++) {
          if (!markerExists(markers[i].latitude, markers[i].longitude)){

          //Get the marker position 
          var markerPos = new google.maps.LatLng(markers[i].latitude, markers[i].longitude);

          // Add the markerto the map
          var marker = new google.maps.Marker({
              map: map,
              animation: google.maps.Animation.DROP,
              position: markerPos
          });

         // Add the marker to the markerCache so we know not to add it again later
          var markerData = {
            lat: markers[i].latitude,
            lng: markers[i].longitude,
          };
 
          markerCache.push(markerData);

          var infoWindowContent = "<h4>" + "Event: " + markers[i].name + "<br>" + "Description: " + markers[i].description 
          + "<br>" + "Place: " + markers[i].place + "</h4>";          

          addInfoWindow(marker, infoWindowContent);
  
          }
        }

     }); 

  }


  function markerExists(lat, lng){
      var exists = false;
      var cache = markerCache;
      for(var i = 0; i < cache.length; i++){
        if(cache[i].lat === lat && cache[i].lng === lng){
          exists = true;
        }
      }
 
      return exists;
  }


  function getDistanceBetweenPoints( pos1, pos2, units){
 
    var earthRadius = {
        miles: 3958.8,
        km: 6371
    };
    var R = earthRadius[units || 'miles'];
    var lat1 = pos1.lat;
    var lon1 = pos1.lng;
    var lat2 = pos2.lat;
    var lon2 = pos2.lng;
 
    var dLat = toRad((lat2 - lat1));
    var dLon = toRad((lon2 - lon1));
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
 
    return d;
 
  }
 
  function toRad(x){
      return x * Math.PI / 180;
  }


  function addInfoWindow(marker, message) {

      var infoWindow = new google.maps.InfoWindow({
          content: message
      });

      google.maps.event.addListener(marker, 'click', function () {
      
      if(openwindow){
        eval(openwindow).close();
      }
      infoWindow.open(map, marker);
      openwindow=infoWindow;

      });
      
  }

  return {
    init: function(){
      initMap();
    }
  }
});
