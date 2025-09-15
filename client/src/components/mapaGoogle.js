import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
};

const center = {
  lat: -29.101895,
  lng: -49.638619,
};

function MapaGoogle({ onPick }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState(null);
  const [clickedCoords, setClickedCoords] = useState(null);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setClickedCoords({ lat, lng });
    if (onPick) onPick({ lat, lng });
  };

  if (loadError) return <div>Erro ao carregar o Google Maps</div>;

  return (
    <div style={{ width: '100%', height: '300px' }}>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleClick}
        >
          {clickedCoords && <Marker position={clickedCoords} />}
        </GoogleMap>
      ) : (
        <div>Carregando mapa…</div>
      )}
    </div>
  );
}

export default React.memo(MapaGoogle);