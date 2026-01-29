
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

// create a marker at a coordinate
const marker = new mapboxgl.Marker({color:"#fe424d"})
  .setLngLat(listing.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({maxWidth: "90vw"}).setHTML(`<h5>${listing.title}</h5><p>Exact location will be provide after booking</p>`))
  .addTo(map);
