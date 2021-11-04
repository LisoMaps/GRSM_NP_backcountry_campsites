# Great Smoky Mountain National Park Backcountry Campsite Map

#### Locations and site density per park district

---

This project maps out the location and density (per sq. mi.) of backcountry campsites in GRSM NP. All data were taken from [NPS open data](https://public-nps.opendata.arcgis.com/) and displayed on the map using primarily JavaScript and various JS libraries like Leaflet, jQuery, and Chroma.

---

#### Campsite density choropleth symbology

The original park district GeoJSON downloaded had a "Shape_Area" field in sq. meters. I converted each districts area to sq. miles and added those values as a new field to the GeoJSON using [geojson.io](http://geojson.io/#map=2/20.0/0.0). Afterwards, I added up the amount of campsites per park district and divided that sum by the districts area in sq. miles. Lastly, I added those values as a new field to the GeoJSON using [geojson.io](http://geojson.io/#map=2/20.0/0.0). Thus the data was ready to be displayed!

Lower densities of backcountry campsites are displayed in lighter green shades, while higher densities are shown in darker shades of green.

---

#### Campsite location

Campsite point data were downloaded as a GeoJSON and then dislayed on the map. Tent icons ([fontawesome](https://fontawesome.com/v5.15/icons/campground?style=solid)) show campsite locations as well as how one can access them. Clicking on an icon fires a popup containing the sites name, coordinates in decimal degrees (DD), and elevation in feet.
