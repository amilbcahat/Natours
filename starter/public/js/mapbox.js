/*eslint-disable*/

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYW1pbGJjYWhhdCIsImEiOiJjbDV2cjkyOXIwY2h3M2JtaTMxemtjM3FmIn0.JWn8DiZcQKCoUokTKNt7kw';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/amilbcahat/cl5vrcqi4000314og9yv7s6om',
    scrollZoom: false,
    // center: [78.08107, 27.909486],
    // zoom: 10,
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((loc) => {
    //Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //Add Marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    //Extend Map bounds to include the current location
    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
