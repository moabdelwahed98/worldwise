import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useURLPosition } from "../hooks/useURLPosition";

import Button from "./Button";
import styles from "./Map.module.css";
import PopupError from "./PopupError";

function Map() {
  const [mapPosition, setMapPosition] = useState([40, 4]);

  //Custom Hooks
  const [mapLat, mapLng] = useURLPosition();
  const { cities, error } = useCities();
  const {
    isLoading: isLoadingPos,
    position: geolocationPos,
    getPosition,
  } = useGeolocation();

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geolocationPos)
        setMapPosition([geolocationPos.lat, geolocationPos.lng]);
    },
    [geolocationPos]
  );
  return (
    <div className={styles.mapContainer}>
      {error && <PopupError error={error} />}
      {!geolocationPos && (
        <Button type="position" onCLickFake={getPosition}>
          {isLoadingPos ? "Loaging..." : "Get Your Position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={8}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <AdjustCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>

    //TODO SOlUTION 2 for useNavigate
    // <Link to="form" className={styles.mapContainer}>
    //   <div>
    //     <h2>
    //       {" "}
    //       position {lat}, {lng}
    //     </h2>
    //   </div>
    // </Link>
  );
}

function AdjustCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
      console.log(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
