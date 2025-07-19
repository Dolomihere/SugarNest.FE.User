import React, { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { MapService } from "../core/services/MapService";
import "leaflet/dist/leaflet.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

const DEFAULT_POSITION = {
  lat: 10.8266497,
  lng: 106.5886893,
};

const SearchField = ({ onSearch }) => {
  const map = useMap(); // Hook to access the Leaflet map instance

  useEffect(() => {
    const provider = new OpenStreetMapProvider(); // Use OpenStreetMap as the search provider
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar", // 'bar' or 'button' for search control appearance
      showMarker: true, // Show a marker at the searched location
      showPopup: false, // Optional: Disable popups
      autoClose: true, // Close results after selection
      retainZoomLevel: false, // Zoom to the searched location
      animateZoom: true, // Smooth zoom animation
      searchLabel: "Enter location", // Placeholder text
    });

    // Add the search control to the map
    map.addControl(searchControl);

    // Event listener for search results
    map.on("geosearch/showlocation", (result) => {
      const { x, y } = result.location; // x is longitude, y is latitude
      const { label } = result.location; // Location name
      onSearch({ lat: y, lng: x, label }); // Pass coordinates and label to parent
    });

    // Cleanup: Remove the control when component unmounts
    return () => {
      map.removeControl(searchControl);
    };
  }, [map, onSearch]);

  return null; // This component doesn't render anything
};

export default function GoogleMapExample({
  onChangeLocation = () => {},
  onChangeAddress = () => {},
  value,
}) {
  const [currentValue, setCurrentValue] = useState(value || DEFAULT_POSITION);
  const position = [currentValue.lat, currentValue.lng];

  const getAddressInfo = async (lat, lng) => {
    const address = await MapService.getAddressInfo(lat, lng);
    onChangeAddress(address);
  };

  const handleSearch = (location) => {
    const { lat, lng } = location || {};

    if (lat && lng)
      setCurrentValue({
        lat,
        lng,
      });
  };

  const MapClickHandler = () => {
    useMapEvents({
      async click(e) {
        const latlng = e.latlng;

        setCurrentValue({
          lat: latlng.lat,
          lng: latlng.lng,
        });

        onChangeLocation({
          lat: latlng.lat,
          lng: latlng.lng,
        });
      },
    });
    return null;
  };

  useEffect(() => {
    if (value && JSON.stringify(value) != JSON.stringify(currentValue)) {
      setCurrentValue(value);
    }
  }, [JSON.stringify(value)]);

  useEffect(() => {
    getAddressInfo(currentValue.lat, currentValue.lng);
  }, [JSON.stringify(currentValue)]);

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <MapClickHandler />
      {/* <SearchField onSearch={handleSearch} /> */}
    </MapContainer>
  );
}
