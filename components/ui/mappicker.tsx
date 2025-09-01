'use client';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import { useState, useCallback, useEffect } from 'react';

const libraries: ('places' | 'drawing' | 'geometry' | 'visualization')[] = ['places'];
const mapContainerStyle = { width: '100%', height: '100%' };

interface MapPickerProps {
  center: { lat: number, lng: number };
  onLocationChange: (coords: { lat: number, lng: number }) => void;
}

export function MapPicker({ center, onLocationChange }: MapPickerProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyA3iPYujGJLwvxjaJmPzqR0kx_z2nk2FTM",
    libraries,
  });

  const [marker, setMarker] = useState(center);

  useEffect(() => {
    if(center.lat !== marker.lat || center.lng !== marker.lng){
        setMarker(center)
    }
  }, [center])

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newCoords = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setMarker(newCoords);
      onLocationChange(newCoords);
    }
  }, [onLocationChange]);

  if (loadError) return <div>Harita yüklenemedi.</div>;
  if (!isLoaded) return <div>Harita yükleniyor...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={15}
      center={marker}
      onClick={onMapClick}
    >
      <MarkerF position={marker} />
    </GoogleMap>
  );
}