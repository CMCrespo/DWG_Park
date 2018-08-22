
/* Carlos M. Crespo - 2018 - Geog 777 Project #2 */

var satellite = L.tileLayer('https://api.mapbox.com/styles/v1/ccrespo/cjjdaxeig7so12sn0ntyx8xoo/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY2NyZXNwbyIsImEiOiJjaXNkd3lzdTQwMDd4Mnl2b3V2cTBmbnUzIn0.d7wSdKZ3KwqoXSGAByFYrw', {
   attribution: 'Data: National Park Service</a>, Design - Carlos M. Crespo, 2018; Map: <a href="http://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>'
   }),
outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/ccrespo/cjj6go1v61fk12rns1a2g6ml3/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2NyZXNwbyIsImEiOiJjaXNkd3lzdTQwMDd4Mnl2b3V2cTBmbnUzIn0.d7wSdKZ3KwqoXSGAByFYrw', {
   attribution: 'Data: National Park Service</a>, Design - Carlos M. Crespo, 2018; Map: <a href="http://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>'
   });

//create the map
var map = new L.map('map', {
    center: [41.163, -74.805],
    zoom: 11,
    layers: [satellite, outdoors]
});

//database queries
var sqlPOI = "SELECT * FROM poi";    
var sqlboundary = "SElECT * FROM nps_boundary";
var sqlcamps = "SELECT * FROM camps";
var sqlaccess = "SELECT * FROM accesspoints";
var sqltrails = "SELECT * FROM trails_wp";
var sqldata = "SELECT * FROM data_collector"

//set var for queries
var sqlpermit = "SELECT * FROM camps WHERE permit='Y'";
var sqlfee = "SELECT * FROM accesspoints WHERE fee = 'Y'";
var sqlboat = "SELECT * FROM accesspoints WHERE ramp = 'Y'";
var sqlpicnic = "SELECT * FROM accesspoints WHERE picnic = 'Y'";

//Global variables
var pointsOfInterest = null;
var boundary = null;
var campSites = null;
var accessPoints = null;
var trailsWP = null;

var userInput = null;

// set CARTO username
var cartoDBUserName = "cmcrespo";

var baseMaps = {    
    "Satellite": satellite,
    "Basemap": outdoors,
}

L.control.layers(baseMaps, null).addTo(map);

//location control
L.control.locate( { icon: 'fa fa-compass' }).addTo(map);

// Function to add the draw control to the map to start editing
function startEdits(){
  if(controlOnMap == true){
    map.removeControl(drawControl);
    controlOnMap = false;
  }
  map.addControl(drawControl);
  controlOnMap = true;
};

// Function to remove the draw control from the map
function stopEdits(){
  map.removeControl(drawControl);
  controlOnMap = false;
};

// Function to run when feature is drawn on map
map.on('draw:created', function (e) {
  var layer = e.layer;
  drawnItems.addLayer(layer);
  map.addLayer(drawnItems);
  dialog.dialog("open");
});

// Use the jQuery UI dialog to create a dialog and set options
var dialog = $("#dialog").dialog({
  autoOpen: false,
  height: 300,
  width: 350,
  modal: true,
  position: {
    my: "center center",
    at: "center center",
    of: "#map"
  },
  buttons: {
    "Add to Database": setData,
    Cancel: function() {
      dialog.dialog("close");
      map.removeLayer(drawnItems);
    }
  },
  close: function() {
    form[ 0 ].reset();
    console.log("Dialog closed");
  }
});

// Stops default form submission and ensures that setData or the cancel function run
var form = dialog.find("form").on("submit", function(event) {
  event.preventDefault();
});

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

// Function to add all Points of Interests
function showPOI(){
    if (map.hasLayer(pointsOfInterest)){
        map.removeLayer(pointsOfInterest);
        
    };
    // Get CARTO selection as GeoJSON and Add to Map
    $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlPOI, function(data) {
        pointsOfInterest = L.geoJson(data,{
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p><b>' + 
                feature.properties.name + '</b><br /><em>' + feature.properties.note + '</em></p>');
                layer.cartodb_id=feature.properties.cartodb_id;
                var poiIcon = new L.Icon({
                    iconSize: [27, 27],
                    iconAnchor: [1, 15],
                    popupAnchor:  [1, -24],
                    iconUrl: 'img/poi.png',
                    riseOnHover: true,
                    shadowSize: [100, 100]
            });
                layer.setIcon(poiIcon);
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
                var campsiteIcon = new L.Icon({
                    iconSize: [25, 25],
                    iconAnchor: [13, 27],
                    popupAnchor:  [1, -24],
                    iconUrl: 'img/campsite.png',
                    riseOnHover: true
            });
                layer.setIcon(campsiteIcon);
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
                var accessIcon = new L.Icon({
                    iconSize: [30, 30],
                    iconAnchor: [10, 27],
                    popupAnchor:  [1, -24],
                    iconUrl: 'img/access.png',
                    riseOnHover: true
            });
                layer.setIcon(accessIcon);
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
                var trailIcon = new L.Icon({
                    iconSize: [22, 25],
                    iconAnchor: [30, 13],
                    popupAnchor:  [1, -24],
                    iconUrl: 'img/trail.png',
                    riseOnHover: true
            });
                layer.setIcon(trailIcon);
            }
        }).addTo(map);
    });
};

// Function to show user input
function showData(){
    if(map.hasLayer(userInput)){
        map.removeLayer(userInput);
    };
    // Get CARTO selection as GeoJSON and Add to Map
        $.getJSON("https://"+cartoDBUserName+".cartodb.com/api/v2/sql?format=GeoJSON&q="+sqldata, function(data) {
        userInput = L.geoJson(data,{
        pointToLayer: function(feature,latlng){
        var marker = L.marker(latlng);
        marker.bindPopup('' + feature.properties.description + ' Submitted by ' + feature.properties.name + '');
        return marker;
      }
    }).addTo(map);
  });
};

// Function to Filter campsite permits
function showPermit(){
  if(map.hasLayer(campSites)){
    map.removeLayer(campSites);
  };
  $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlpermit, function(data) {
    campSites = L.geoJson(data,{
      onEachFeature: function (feature, layer) {
        layer.bindPopup('<p><b>' + 
        feature.properties.name + '</b><br /><em>' + 
        "Number of Sites: "+feature.properties.num_of_sit + '</b><br /><em>' +
        "Max # of people: "+feature.properties.per_per_si + '</b><br /><em>' +                
        "Permit required: "+feature.properties.permit + '</em></p>');
        layer.cartodb_id=feature.properties.cartodb_id;
        var campsiteIcon = new L.Icon({
                iconSize: [27, 27],
                iconAnchor: [13, 27],
                popupAnchor:  [1, -24],
                iconUrl: 'img/campsite.png'
        });
            layer.setIcon(campsiteIcon);
        }
        }).addTo(map);
  });
};

// Function to Filter fee from accesspoint
function showFee(){
  if(map.hasLayer(accessPoints)){
    map.removeLayer(accessPoints);
  };
  $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlfee, function(data) {
    accessPoints = L.geoJson(data,{
      onEachFeature: function (feature, layer) {
        layer.bindPopup('<p><b>' + 
        feature.properties.name + '</em></p>');
        layer.cartodb_id=feature.properties.cartodb_id;
        var feeIcon = new L.Icon({
                iconSize: [20, 20],
                iconAnchor: [13, 27],
                popupAnchor:  [1, -24],
                iconUrl: 'img/fee.png'
        });
            layer.setIcon(feeIcon);
        }
        }).addTo(map);
  });
};

// Function to Filter boat ramp from accesspoint
function showRamp(){
  if(map.hasLayer(accessPoints)){
    map.removeLayer(accessPoints);
  };
  $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlboat, function(data) {
    accessPoints = L.geoJson(data,{
      onEachFeature: function (feature, layer) {
        layer.bindPopup('<p><b>' + 
        feature.properties.name + '</em></p>');
        layer.cartodb_id=feature.properties.cartodb_id;
        var boatRampIcon = new L.Icon({
                iconSize: [25, 25],
                iconAnchor: [1, 50],
                popupAnchor:  [1, -24],
                iconUrl: 'img/boatRamp.png'
        });
            layer.setIcon(boatRampIcon);
        }
        }).addTo(map);
  });
};

// Function to Filter picnic areas
function showPicnic(){
  if(map.hasLayer(accessPoints)){
    map.removeLayer(accessPoints);
  };
  $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlpicnic, function(data) {
    accessPoints = L.geoJson(data,{
      onEachFeature: function (feature, layer) {
        layer.bindPopup('<p><b>' + 
        feature.properties.name + '<em></p>');
        layer.cartodb_id=feature.properties.cartodb_id;
        var picnicIcon = new L.Icon({
                iconSize: [27, 27],
                iconAnchor: [1, 50],
                popupAnchor:  [1, -24],
                iconUrl: 'img/picnic.png'
        });
            layer.setIcon(picnicIcon);
        }
        }).addTo(map);
  });
};


// Event listeners for the layers
$('input[value=poi]').change(function() {
    if (this.checked) {
        showPOI();
    } else {
        map.removeLayer(pointsOfInterest)
    };
});

$('input[value=boundary]').change(function() {
    if (this.checked) {
        showBoundary();
    } else {
        map.removeLayer(boundary)
    };
});

$('input[value=camps]').change(function() {
    if (this.checked) {
        showCamps();
    } else {
        map.removeLayer(campSites)
    };
});

$('input[value=access]').change(function() {
    if (this.checked) {
        showAccess();
    } else {
        map.removeLayer(accessPoints)
    };
});

$('input[value=trail]').change(function() {
    if (this.checked) {
        showTrails();
    } else {
        map.removeLayer(trailsWP)
    };
});

$('input[value=data]').change(function() {
    if (this.checked) {
        showData();
    } else {
        map.removeLayer(userInput)
    };
});

// Event Listeners
$('input[value=permit]').click(function(){
   showPermit();
});

$('input[value=fee]').click(function(){
    showAccess(),
    showFee();
});

$('input[value=picnic]').click(function(){
    showPicnic();
});

$('input[value=ramp]').click(function(){
    showRamp();
});

function locateUser(){
    map.locate({setView: true, maxZoom: 13});
}

// Add a home button to go back to the default map extent
L.easyButton('fa-home', function(btn, map){
    map.setView([41.163, -74.805],11);
	}).addTo(map);


//function onLocationFound(e) {
//    var radius = e.accuracy / 2;

//    L.marker(e.latlng).addTo(map)
        
//    L.circle(e.latlng, radius).addTo(map);
//}

//map.on('locationfound', onLocationFound);

//function onLocationError(e) {
//    alert(e.message);
//}

//map.on('locationerror', onLocationError);


//$('#actions').find('a').on('click', function() {
//   locateUser();
//});


// Create Leaflet Draw Control for the draw tools and toolbox
var drawControl = new L.Control.Draw({
  draw : {
    polygon : false,
    polyline : false,
    rectangle : false,
    circle : false
  },
  edit : false,
  remove: false
});

// Boolean global variable used to control visiblity
var controlOnMap = false;

// Create variable for Leaflet.draw features
var drawnItems = new L.FeatureGroup();



//set parameters to post to db
function setData() {
    var enteredUsername = username.value;
    var enteredDescription = description.value;
    drawnItems.eachLayer(function (layer) {
        var a = layer.getLatLng();
        var postSQL = "INSERT INTO data_collector (the_geom, description, name, latitude, longitude) VALUES (ST_GeomFromText('POINT(" + a.lng + " " + a.lat + ")',4326)," +"'"+ enteredDescription +"'"+ "," +"'"+ enteredUsername +"'"+"," +"'"+ a.lat +"'"+ "," +"'"+ a.lng +"')";             
        var pURL = postSQL;       
        postUrl = "https://"+cartoDBUserName+".carto.com/api/v2/sql?q=" + pURL + "&api_key=NYzBrPvir1CAcrPjffza1w";
            $.post(postUrl) 
        console.log(postUrl);
        
    });
    
    //map.removeLayer(drawnItems);
    drawnItems = new L.FeatureGroup();
    console.log("drawnItems has been cleared");
    dialog.dialog("close");
};

// add the search bar to the map
//var controlSearch = new L.Control.Search({
//    position:'topleft',    // where do you want the search bar?
//    layer: [accessPoints, pointsOfInterest, campSites, trailsWP],  // name of the layer
//    initial: false,
//    zoom: 14,        // set zoom to found location when searched
//    marker: false,
//    textPlaceholder: 'search...', // placeholder while nothing is searched
//    autocomplete: true
//});
 
//map.addControl(controlSearch); // add it to the map


$(document).ready(function() {
    showAccess(),
    showBoundary(),
    showCamps(),
    //showData(),
    showPOI()
    //showPicnic(),
    //showFee(),
    //showPermit(),
    //showRamp()    
});