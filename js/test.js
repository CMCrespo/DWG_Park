var pURL = sql+sql2;
        console.log(pURL)
        console.log("Feature has been submitted");
        postUrl = "https://cmcrespo.carto.com/api/v2/sql?q=" + pURL + "&api_key=apikeyhere";
        $.post(postUrl) 

/* Carlos M. Crespo - 2018 - Geog 777 Project #2 */

//database queries
//will go here
//get all access locations from dataset
var sqlPOI = "SELECT * FROM poi";    
var sqlboundary = "SElECT * FROM nps_boundary"
var sqlcamps = "SELECT * FROM camping"
var sqlaccess = "SELECT * FROM accesspoints"
var sqltrails = "SELECT * FROM trails_wp"

//Global variables
// will go here
var pointsOfInterest = null;
var boundary = null;
var campSites = null;
var accessPoints = null;
var trailsWP = null;

// set CARTO username
var cartoDBUserName = "ethanreuse";

//function to instantiate the Leaflet map
//function createMap() {
    //create the map
var map = L.map('map', {
    center: [41.163, -74.805],
    zoom: 10.4
});

    //add OSM base tilelayer
var tileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/ccrespo/cjj6go1v61fk12rns1a2g6ml3/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2NyZXNwbyIsImEiOiJjaXNkd3lzdTQwMDd4Mnl2b3V2cTBmbnUzIn0.d7wSdKZ3KwqoXSGAByFYrw', {
   attribution: 'Data: National Park Service</a>, Design - Carlos M. Crespo, 2018; Map: <a href="http://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>'
   })
tileLayer.addTo(map);
//$(document).click(function () {
//    $(".welcomeWin").hide();
//});


// Function to add all Points of Interests
function showPOI(){
    if(map.hasLayer(pointsOfInterest)){
        map.removeLayer(pointsOfInterest);
    };
    // Get CARTO selection as GeoJSON and Add to Map
    $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlPOI, function(data) {
        pointsOfInterest = L.geoJson(data,{
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p><b>' + 
                feature.properties.name + '</b><br /><em>' + feature.properties.note + '</em></p>');
                layer.cartodb_id=feature.properties.cartodb_id;
            }
        }).addTo(map);
    });
};

// Function to add Park Boundary
function showBoundary(){
    if(map.hasLayer(boundary)){
        map.removeLayer(boundary);
    };
    // Get CARTO selection as GeoJSON and Add to Map
    $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlboundary, function(data) {
        boundary = L.geoJson(data,{
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p><b>' + 
                feature.properties.parkname + '</b><br /><em>' + feature.properties.unit_type + '</em></p>');
                layer.cartodb_id=feature.properties.cartodb_id;
            }
        }).addTo(map);
    });
};

// Function to add Campsites
function showCamps(){
    if(map.hasLayer(campSites)){
        map.removeLayer(campSites);
    };
    // Get CARTO selection as GeoJSON and Add to Map
    $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlcamps, function(data) {
        campSites = L.geoJson(data,{
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p><b>' + 
                feature.properties.name + '</b><br /><em>' + 
                "Number of Sites: "+feature.properties.num_of_sit + '</b><br /><em>' +
                "Max # of people: "+feature.properties.per_per_si + '</b><br /><em>' +                
                "Permit required: "+feature.properties.permit + '</em></p>');
                layer.cartodb_id=feature.properties.cartodb_id;
            }
        }).addTo(map);
    });
};

// Function to add Park Boundary
function showAccess(){
    if(map.hasLayer(accessPoints)){
        map.removeLayer(accessPoints);
    };
    // Get CARTO selection as GeoJSON and Add to Map
    $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlaccess, function(data) {
        accessPoints = L.geoJson(data,{
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p><b>' + 
                feature.properties.acc_name + '</b><br /><em>' +
                "Boat Ramp: "+feature.properties.ramp + '</b><br /><em>' +
                "Fishing allowed: "+feature.properties.shore_fish + '</b><br /><em>' +
                "Entry fee: "+feature.properties.fee + '</em></p>');
                layer.cartodb_id=feature.properties.cartodb_id;
            }
        }).addTo(map);
    });
};

// Function to add all Trails
function showTrails(){
    if(map.hasLayer(trailsWP)){
        map.removeLayer(trailsWP);
    };
    // Get CARTO selection as GeoJSON and Add to Map
    $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqltrails, function(data) {
        trailsWP = L.geoJson(data,{
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p><b>' + 
                feature.properties.name01 + '</b><br /><em>' + "County: " + feature.properties.county + '</em></p>');
                layer.cartodb_id=feature.properties.cartodb_id;
            }
        }).addTo(map);
    });
};

//L.control.layers(null, {'Park Boundary': boundary, 'Points of Interest': pointsOfInterest, 'Campsites': campSites, 'Access Points': accessPoints, 'Trails': trailsWP }).addTo(map);

// Run showAll function automatically when document loads
$(document).ready(function() {
  showTrails()
  showAccess()
  showBoundary()
  showCamps()
  showPOI()
});

//$(document).ready(createMap);

//$(document).ready(createMap);

// Find five closest coffee shops

// Set Global Variable that will hold your location
var myLocation = null;

// Set Global Variable that will hold the marker that goes at our location when found
var locationMarker = null;

// Set 'Your Location' icon
var redIcon = L.icon({
    iconUrl: 'images/reddot.png',
    iconSize: [27, 27],
    iconAnchor: [13, 41]
});


// Function that will locate the user when called
function locateUser(){
  map.locate({setView: true, maxZoom: 15});
};

// Map Event Listener listening for when the user location is found
map.on('locationfound', locationFound);

// Map Event Listener listening for when the user location is not found
map.on('locationerror', locationNotFound);

// Function that will run when the location of the user is found
function locationFound(e){
    myLocation = e.latlng;
    closestCampsite(); 
    locationMarker = L.marker(e.latlng, {icon: redIcon});
    map.addLayer(locationMarker);    
};

// Function that will run if the location of the user is not found
function locationNotFound(e){
    alert(e.message);
};

// Function will find and load the five nearest coffee shops to a user location
function closestCampsite(){
  // Set SQL Query that will return five closest coffee shops
  var sqlQueryClosest = "SELECT * FROM camps ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint("+myLocation.lng+","+myLocation.lat+"), 4326) LIMIT 5";

  // remove CoffeeShopLocations if on map
  if(map.hasLayer(campSites)){
    map.removeLayer(campSites);
  };

  // remove locationMarker if on map
  if(map.hasLayer(locationMarker)){
    map.removeLayer(locationMarker);
  };

  // Get GeoJSON of five closest points to the user
  $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlQueryClosest, function(data) {
    campSites = L.geoJson(data,{
      onEachFeature: function (feature, layer) {
        layer.bindPopup('' + feature.properties.name + '' + feature.properties.address + '');
        layer.cartodb_id=feature.properties.cartodb_id;
      }
    }).addTo(map);
  });
};

<!doctype html>
<html lang="en">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial- scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>Delaware Water Gap</title>
        <meta name="viewport" content="width=device-width">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    
        <h1>Welcome to the Delaware Water Gap National Recreation Area</h1>

    
        <!-- Add your site or application content here -->
        <input type="button" onclick="startEdits()" value="Click to Start Editing">
        <input type="button" onclick="stopEdits()" value="Stop Your Editing Session">
    
        <!--put your external stylesheet links here-->
    
        <link rel="manifest" href="site.webmanifest">
        <link rel="apple-touch-icon" href="icon.png">
        
        <link rel="stylesheet" href="css/main.css"> 
        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="lib/leaflet.css">
    
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
        <link rel="stylesheet" href="http://libs.cartocdn.com/cartodb.js/v3/3.15/themes/css/cartodb.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/0.4.2/leaflet.draw.css"/>
        <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css">        
        <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
	    <link rel="stylesheet" href="https://domoritz.github.io/leaflet-locatecontrol/dist/L.Control.Locate.min.css" />
        <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
        <!--<link rel="stylesheet" href="js/easy-button.css"> -->
        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/0.4.2/leaflet.draw.css"/>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/0.4.2/leaflet.draw.js"></script>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
        <link href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet"> 
        <link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
   
    

        <input type="radio" name="filter" value="all" checked>All Campsite</input>
        <input type="radio" name="filter" value="permit">Require Permit</input>

    </head>

    <body>
        <div id="map"></div>
        <div id="panel"></div>
        <div id='actions'><a href='#'>Find me!</a></div>
        
        <div id="checkbox">
			<input type="checkbox" name="filter" value="poi" checked> Points of Interest</input>
			<input type="checkbox" name="filter" value="boundary" checked> Park Boundary</input>
			<input type="checkbox" name="filter" value="camps"> Campsites</input>
			<input type="checkbox" name="filter" value="access"> Access</input>
			<input type="checkbox" name="filter" value="trail"> Trailheads</input>
			<input type="checkbox" name="filter" value="data"> Guest input!</input>
		</div>
        <div id="buttons">
            <input type="radio" name="filter" value="permit"> Permit Required</input>
			<input type="radio" name="filter" value="fee"> User Fee</input>
			<input type="radio" name="filter" value="picnic"> Picnic Area</input>
			<input type="radio" name="filter" value="ramp"> Boat Ramp Available</input>
        </div>

        
        <div id="dialog" title="Provide Feedback!">
            <form>
                <fieldset>
                    <label for="username">Your Name</label>
                    <input type="text" name="username" id="username" placeholder="Enter your Name" class="text ui-widget-content ui-corner-all">
                    <label for="description">About this Point</label>
                    <input type="text" name="description" id="description" placeholder="Description for this point" class="text ui-widget-content ui-corner-all">
                    <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
                </fieldset>
            </form>
        </div>
        
        <script src="js/vendor/modernizr-3.5.0.min.js"></script>
        <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
        <script src="js/plugins.js"></script>
        <script src="lib/leaflet.js"></script>
        <script src="js/main.js"></script>
        <script>
            window.jQuery || document.write('<script src="js/vendor/jquery-3.2.1.min.js"><\/script>')
        </script>
        <script src="https://domoritz.github.io/leaflet-locatecontrol/dist/L.Control.Locate.min.js" charset="utf-8"></script>
        <script src="http://libs.cartocdn.com/cartodb.js/v3/3.15/cartodb.js"></script> -->
        
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/0.4.2/leaflet.draw.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>
        
        
      </body>
</html>
