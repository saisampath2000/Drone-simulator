import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';

const MapBox = ({ data, setRenderMap }) => {
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

  const map = useRef(null);
  const viewRegion = { center: [29, 9.88], zoom: 2 };
  const mapContainerRef = useRef(null);
  let currentIndex = 0;
  let point = null;

  const updateMap = () => {
    const mapInstance = map.current;

    if (currentIndex < data.length) {
      point.remove();
      const obj = data[currentIndex];
      const marker = new mapboxgl.Marker({ color: 'blue', rotation: 45 })
        .setLngLat([parseFloat(obj.long), parseFloat(obj.lat)])
        .addTo(mapInstance);
      currentIndex = currentIndex + 1;
      point = marker;
      setTimeout(() => {
        updateMap();
      }, parseInt(data[currentIndex].time) * 1000);
    }

    return mapInstance;
  };

  const createMap = (arr) => {

    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: viewRegion.center,
      zoom: viewRegion.zoom,
      testMode: true
    });

    const mapInstance = map.current;

    mapInstance.on('load', () => {

      const marker = new mapboxgl.Marker({ color: 'blue', rotation: 45 })
        .setLngLat(arr[currentIndex])
        .addTo(mapInstance);

      currentIndex = currentIndex + 1;
      point = marker;

      setTimeout(() => {
        updateMap();
      }, parseInt(data[currentIndex].time) * 1000);

      mapInstance.addSource('route', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'LineString',
            'coordinates': arr
          }
        }
      });

      mapInstance.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#808080',
          'line-width': 8
        }
      });
    })

    mapInstance.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-left');

    return mapInstance;
  };

  useEffect(() => {
    const arr = data.map((element) => [parseFloat(element.long), parseFloat(element.lat)]);
    const mapInstance = createMap(arr);
    return () => mapInstance.remove();
  }, []);

  return <>
    <button onClick={() => setRenderMap(false)} style={{ padding: '0.5rem 1rem', boxShadow: '0px 0px 0.6em #111c;', color: '#fff', cursor: 'pointer', backgroundColor: '#25f', borderRadius: '5px' }}>Back</button>
    <div className='mapWrapper' ref={mapContainerRef} />
  </>
}

export default MapBox;
