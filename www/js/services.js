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
    return $resource('http://funkevent.herokuapp.com/events/nearby.json?latitude=:latId&longitude=:lgtId&dist=:distId');
})

.factory('Performers', function ($resource) {
    return $resource('http://funkevent.herokuapp.com/performers/:performerId.json');
})


.factory('Markers', ['$q','$resource','Places','Performers','NearEvents', function ($q, $resource, Places, Performers, NearEvents) {

  
  var place = null;
  var performer = null;

  return {
    getMarkers: function(lat,lgt,dist){
    var promises = [];
    var deferredCombinedItems = $q.defer();
    var combinedItems = [];

    return NearEvents.query({latId: lat, lgtId: lgt, distId: dist}).$promise.then(function (result) {

     console.log(result)

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
          console.log("promesse la plus profonde finie")

      } );
      

      
      promises.push(deferredItemList.promise);
      console.log("fin de l'élement boucle for");
    } );

    return $q.all(promises).then( function() {
          console.log("se fait tout a la fin");
          deferredCombinedItems.resolve(combinedItems);
          return combinedItems;
    });

    
    

    } );
  
    }
  }

}])


.factory('GoogleMaps', function($cordovaGeolocation, Markers){

  var apiKey = false;
  var map = null;
  var maPos = null;

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

<<<<<<< HEAD
APIAccessModule.factory('Events', function ($resource) {
    return $resource('http://funkevent.herokuapp.com/events/:eventId.json');
=======
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
      Markers.getMarkers(maPos.lat(),maPos.lng(),10000000).then(function(markers){

/*      console.log("Markers: ", markers);*/
/*
        var records = markers.data;*/

/*      var record = records[i];   */
       console.log(markers);
        for (var i = 0; i < markers.length; i++) {
          var markerPos = new google.maps.LatLng(markers[i].latitude, markers[i].longitude);

          // Add the markerto the map
          var marker = new google.maps.Marker({
              map: map,
              animation: google.maps.Animation.DROP,
              position: markerPos
          });

          var infoWindowContent = "<h4>" + markers[i].name + " " + markers[i].description + "</h4>";          

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

>>>>>>> dc31d98b5c824336ff530efc6e0238724a0c5f6e
});
