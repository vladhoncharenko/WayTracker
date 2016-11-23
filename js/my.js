var poly;
var map;
var existingPolylinePath;
var tempPoly;
var newPoly=false;
var paths=[];
var temp;
var total=0;
var array=[];
var tre;
try{
	var tempArray=JSON.parse(Get());
		array=JSON.parse(tempArray);
		console.log(array);
	}catch (err){
}
	
function Get(){
	var Httpreq = new XMLHttpRequest(); // a new request
	Httpreq.open("GET",'URL TO getdata.php',false);
	Httpreq.send(null);
	return Httpreq.responseText;          
}	
function initialize() {  
	for(var i in array){	
	var decodedPath = google.maps.geometry.encoding.decodePath(array[i]); 
	total+=google.maps.geometry.spherical.computeLength(decodedPath);
    var decodedLevels = decodeLevels("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
    var setRegion = new google.maps.Polyline({
        path: decodedPath,
        levels: decodedLevels,
        strokeColor: "#008931",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map
    });				
	}			
    document.getElementById("myHeader").innerHTML = total.toFixed(0);	
}  
	
function decodeLevels(encodedLevelsString) {
    var decodedLevels = [];    
    for (var i = 0; i < encodedLevelsString.length; ++i) {
            var level = encodedLevelsString.charCodeAt(i) - 63;
            decodedLevels.push(level);
        }
    return decodedLevels;
 }

function initMap() { 	
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: {lat: 50.9169244, lng: 34.8011216}  		 
    });
    poly = new google.maps.Polyline({
        strokeColor: '#008931',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: map,
        clickable: false
    });
}