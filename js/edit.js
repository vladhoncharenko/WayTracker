var poly;
var map;
var existingPolylinePath;
var tempPoly;
var newPoly=false;
var paths=[];
var temp;
var total=0;
var array=[];
var array2=[];
var tre;
var dataaa;
try{
	var tempArray=JSON.parse(Get());
		array=JSON.parse(tempArray);
		console.log(array);
}catch (err){
}
function Get(){
	var Httpreq = new XMLHttpRequest(); 
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

document.onkeypress = function (e) {
var e = window.event || e
if (e.charCode == 110 || e.charCode == 1090) {
    newPoly=true;     		
	array.push(google.maps.geometry.encoding.encodePath(temp));	
	tre =JSON.stringify(array)	    
	passVal();
	total+=google.maps.geometry.spherical.computeLength(temp);
	console.log(total);
	document.getElementById("myHeader").innerHTML = total.toFixed(0);		
    } else if (e.charCode == 102 || e.charCode == 1072) { 		
	}
}

function initMap() { 	
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: {lat: 50.9169244, lng: 34.8011216}  		 
    });
    google.maps.event.addListener(map, 'click', function (event) {	
        addLatLngToPoly(event.latLng, poly);
    });	
    map.addListener('mousemove', function (event) {
        existingPolylinePath = poly.getPath();
        if (existingPolylinePath.length > 0 && newPoly==false) {
            tempPoly.setPath([existingPolylinePath.getAt(existingPolylinePath.length - 1), event.latLng]);
        }
    });	
	google.maps.event.addListener(map, 'mousemove', function(event) {        
            map.setOptions({ draggableCursor: 'crosshair' });        
    });
    poly = new google.maps.Polyline({
        strokeColor: '#008931',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: map,
        clickable: false
    });
    tempPoly = new google.maps.Polyline({
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: map,
        clickable: false
    });
}
function addLatLngToPoly(latLng) {
    var path = poly.getPath();   
    if (newPoly==true) {
        poly = new google.maps.Polyline({
            strokeColor: '#005431',
            strokeOpacity: 1,
            strokeWeight: 3,
            map: map
        });
		newPoly=false;
    }
    path = poly.getPath();		
    path.push(latLng);     
	temp='';
	temp=path;	
}

 function passVal(){
    var data = {            
         str:tre
    };
    $.post("db/senddata.php", data);
	console.log(data);
}