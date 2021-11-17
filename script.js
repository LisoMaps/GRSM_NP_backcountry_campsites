// 1. Create a map object.
var mymap = L.map("map", {
  center: [35.60999997999999, -83.50232504421981],
  zoom: 10, //this line adjusts the starting zoom level of the map
  maxZoom: 18, //this line sets the maximum zoom level
  minZoom: 6, //this line sets the minimum zoom level
  detectRetina: true, // detect whether the sceen is high resolution or not.
});
// 2. Add a base map.
var Jawg_Dark = L.tileLayer(
  "https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token={accessToken}",
  {
    subdomains: "abcd",
    accessToken:
      "ihDe2jNzbuwI58KsogUop26M52pHfsT5hT0QH9hda7gwdeSNAMogAE6SD4sqASGm",
  }
);
Jawg_Dark.addTo(mymap);

// 3. Add campsite GeoJSON Data
// Null variable that will hold campsite data
var grsm_backCountry = null;

// 4. build up a set of colors from colorbrewer's dark2 category
var colors = chroma.scale("YlOrBr").mode("lch").colors(3);

// 5. dynamically append style classes to this page. The style classes will be used to shade the markers.
// We can use a for loop to do this.
for (i = 0; i < 3; i++) {
  $("head").append(
    $(
      "<style> .marker-color-" +
        (i + 1).toString() +
        " { color: " +
        colors[i] +
        "; font-size: 22px; text-shadow: 0 0 1.5px #4a4b4d;} </style>"
    )
  );
}

grsm_backCountry = L.geoJson.ajax("data/grsm_backcountry_campsites.geojson", {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<b>" +
        feature.properties.LABEL +
        "</b>" +
        "</br>" +
        feature.properties.y +
        ", " +
        feature.properties.x +
        "</br>" +
        "Elevation: " +
        feature.properties.ELEV_FT +
        " ft"
    );
  },

  pointToLayer: function (feature, latlng) {
    var id = 0;
    if (feature.properties.access == "Hiker") {
      id = 2;
    } else if (feature.properties.access == "Stock/Hiker") {
      id = 1;
    } else {
      id = 0;
    } // All other property types from attribute table
    return L.marker(latlng, {
      icon: L.divIcon({
        className: "fas fa-campground marker-color-" + (id + 1).toString(),
        iconSize: [40, 40],
        popupAnchor: [-6, -18],
      }),
      title: "Click for more info",
      riseOnHover: true,
    });
  },
  attribution:
    "&copy; <a href='http://jawg.io'> <b>Jawg</b>Maps</a> | &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors | Campsites and NP boundaries &copy; <a href='https://public-nps.opendata.arcgis.com/'>NPS Open Data</a> | Icons &copy; <a href = 'https://fontawesome.com/v5.15/icons/campground?style=solid'>fontawesome</a> | Map Author: <a href='https://weircf.wixsite.com/e-portfolio'>Chip Weir</a>",
});

// Add the Airbnbs to the map.
grsm_backCountry.addTo(mymap);

// Polygon visualization

// 6. Set function for color ramp
colors = chroma.scale("Greens").colors(6); //we'll use 5 classes of purples

// this function manually defines your choropleth classification system
//so you'll need to figure out which break points you'd like to use
//based on the data distribution
//this equal interval classification with 5 classes, takes the range of the
//data (133) and divides it by 5, to show there are intervals of 27 per class
//so...
function setColor(sites_per_sqmi) {
  var id = 0;
  if (sites_per_sqmi == 0.206159594) {
    id = 5;
  } else if (sites_per_sqmi == 0.095144611) {
    id = 4;
  } else if (sites_per_sqmi == 0.075063977) {
    id = 3;
  } else if (sites_per_sqmi == 0.074963045) {
    id = 2;
  } else if (sites_per_sqmi == 0.063481341) {
    id = 1;
  } else {
    id = 0;
  }
  return colors[id];
}

//3. Apply color palette

// 7. Set style function that sets fill color property equal to total Airbnbs
function style(feature) {
  return {
    fillColor: setColor(feature.properties.sites_per_sqmi),
    fillOpacity: 0.75,
    weight: 2,
    opacity: 0.75,
    color: "#b4b4b4",
  };
}

// 8. Add county polygons
L.geoJson
  .ajax("data/grsm_districts.geojson", {
    style: style,
  })
  .addTo(mymap);

//4. Other Map Elements - Legend

// 9. Create Leaflet Control Object for Legend
var legend = L.control({ position: "bottomright" });

// 10. Function that runs when legend is added to map
legend.onAdd = function () {
  // Create Div Element and Populate it with HTML
  var div = L.DomUtil.create("div", "legend");
  //this line creates a title for the choropleth part of the legend
  div.innerHTML += "<b>Backcountry campsites per mi&#178</b><br />";
  //notice the class breaks entered at the end of the next 5 lines
  //the colors specify the shade of purple that we used to do the polygon shading
  div.innerHTML +=
    '<i style="background: ' +
    colors[4] +
    '; opacity: 0.5"></i><p>Most campsites per mi&#178</p>';
  div.innerHTML +=
    '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>.</p>';
  div.innerHTML +=
    '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p>.</p>';
  div.innerHTML +=
    '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p>.</p>';
  div.innerHTML +=
    '<i style="background: ' +
    colors[0] +
    '; opacity: 0.5"></i><p>Least campsites per mi&#178</p>';
  //this line provides the legend title for the airbnb colored symbols
  div.innerHTML += "<hr><b>How to access<b><br />";
  //the next 3 lines call the airbnb icon along with its proper color
  //notice the names of the Airbnb property types listed within the <p> tags at the end of the lines
  div.innerHTML +=
    '<i class="fas fa-campground marker-color-3"></i><p>Hike</p>';
  div.innerHTML +=
    '<i class="fas fa-campground marker-color-2"></i><p>Stock/Hike</p>';
  div.innerHTML +=
    '<i class="fas fa-campground marker-color-1"></i><p>Water</p>';
  // Return the Legend div containing the HTML content
  return div;
};

// 11. Add a legend to map
legend.addTo(mymap);

// 12. Add a scale bar to map
L.control.scale({ position: "bottomleft" }).addTo(mymap);

/*
TO-DO:
- zoom to feature on icon click
*/
