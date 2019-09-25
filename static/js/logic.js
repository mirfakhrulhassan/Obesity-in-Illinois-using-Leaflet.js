var myMap = L.map("map", {
  center: [40.000000, -89.000000],
  zoom: 7
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Riad",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

var geojson;
//var link = "https://leafletjs.com/examples/choropleth/us-states.js";
var link = "Data/Illinois_Obesity_By_County.geojson";

d3.json(link,function(data){
  console.log(data);
  geojson = L.choropleth(data,{
    valueProperty: "Percent_1",
    
    //scale: ["#ffffb2", "#b10026"],
    scale: ["yellow", "red"],
    //scale: ["black", "white"],
    steps: 10,
    mode: "e",
    style:{
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    onEachFeature:function(feature,layer){
      layer.bindPopup(feature.properties.County + "<hr> Obesity: "+ feature.properties.Percent_1+"%");
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlightFeature,
        click: zoomFeature
      });
    }
  }).addTo(myMap);


var legend = L.control({ position: "bottomright"});

legend.onAdd = function() {
  var div = L.DomUtil.create("div","info legend");
  var limits = geojson.options.limits;
  var colors = geojson.options.colors;
  var label = [];
  var legendInfo = "<h1>Obesity in Illinois</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" +"Minimum: "+ limits[0] + "</div>" +
        "<div class=\"max\">" + "Maximum: "+  limits[limits.length - 1] + "</div>" +
      "</div>";

      div.innerHTML = legendInfo;

      limits.forEach(function(limit,index){
          label.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });

      div.innerHTML += "<ul>" + label.join("") + "</ul>";
        return div;
}

legend.addTo(myMap);

});

function highlightFeature(e){
  var layer = e.target;
  layer.setStyle({
    weight: 5,
		color: 'white',
		dashArray: '',
		fillOpacity: 0.9
  });
}

function resetHighlightFeature(e){
 geojson.resetStyle(e.target);

}

function zoomFeature(e){
  myMap.fitBounds(e.target.getBounds());
}