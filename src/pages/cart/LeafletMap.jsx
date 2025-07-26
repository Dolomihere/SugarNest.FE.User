import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LeafletMap = ({ onAddressSelect }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const map = L.map(mapRef.current).setView([10.762622, 106.660172], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    const marker = L.marker([10.762622, 106.660172], { draggable: true }).addTo(map);
    markerRef.current = marker;
    fetchAddress(10.762622, 106.660172);

    marker.on("dragend", (e) => {
      const { lat, lng } = e.target.getLatLng();
      fetchAddress(lat, lng);
    });

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        const newMarker = L.marker([lat, lng], { draggable: true }).addTo(map);
        markerRef.current = newMarker;
        newMarker.on("dragend", (e) => {
          const { lat, lng } = e.target.getLatLng();
          fetchAddress(lat, lng);
        });
      }
      fetchAddress(lat, lng);
    });

    async function fetchAddress(lat, lng) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        onAddressSelect(data.display_name || `${lat}, ${lng}`);
      } catch (err) {
        console.error("Lỗi lấy địa chỉ:", err);
        onAddressSelect(`${lat}, ${lng}`);
      }
    }

    return () => map.remove();
  }, [onAddressSelect]);

  return (
    <>
      <div ref={mapRef} className="w-full h-64 border rounded-lg" />
      <p className="mt-2 text-sm text-gray-500">
        🔍 Bấm vào bản đồ hoặc kéo marker để chọn vị trí giao hàng.
      </p>
    </>
  );
};

export default LeafletMap;