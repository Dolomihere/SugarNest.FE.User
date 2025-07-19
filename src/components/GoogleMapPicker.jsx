import React, { useCallback, useEffect, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
} from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "320px",
};
const defaultCenter = {
  lat: 10.762622,
  lng: 106.660172,
};

export default function GoogleMapPicker({ onAddressSelect, initialLat, initialLng }) {
  const [markerPosition, setMarkerPosition] = useState({
    lat: initialLat || defaultCenter.lat,
    lng: initialLng || defaultCenter.lng,
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // 🔑 Thay bằng API key thật
    libraries,
  });

  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_GOOGLE_MAPS_API_KEY`
      );
      const data = await res.json();
      if (data.status === "OK") {
        const address = data.results[0]?.formatted_address || "Không tìm thấy địa chỉ";
        onAddressSelect({ address, lat, lng });
      } else {
        onAddressSelect({ address: "Không thể lấy địa chỉ", lat, lng });
      }
    } catch {
      onAddressSelect({ address: "Lỗi mạng khi lấy địa chỉ", lat, lng });
    }
  }, [onAddressSelect]);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    reverseGeocode(lat, lng);
  };

  useEffect(() => {
    reverseGeocode(markerPosition.lat, markerPosition.lng);
  }, []);

  if (loadError) return <div>Không tải được bản đồ</div>;
  if (!isLoaded) return <div>Đang tải bản đồ…</div>;

  return (
    <div className="overflow-hidden border rounded-lg h-80">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={16}
        center={markerPosition}
        onClick={handleMapClick}
      >
        <Marker
          position={markerPosition}
          draggable
          onDragEnd={(e) => {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setMarkerPosition({ lat, lng });
            reverseGeocode(lat, lng);
          }}
        />
      </GoogleMap>
    </div>
  );
}
