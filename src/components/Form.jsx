import { useState, useEffect, useRef } from "react";

//react-datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

import { useURLPosition } from "../hooks/useURLPosition";
import { useCities } from "../contexts/CitiesContext";

import Button from "./Button";
import BackButton from "./BackButton";
import styles from "./Form.module.css";
import Message from "./Message";
import Spinner from "./Spinner";

const BASE_URL_COORDS =
  "https://api.bigdatacloud.net/data/reverse-geocode-client";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const { createCity, isLoading: isLoadingAddCity } = useCities();
  const navigate = useNavigate();

  const emoji = useRef("");

  const [isLoadingCoords, setIsLoadingCoords] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [journeyDate, setJourneyDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [geoError, setGeoError] = useState("");

  const [lat, lng] = useURLPosition();
  useEffect(
    function () {
      if (!lat && !lng) return;
      async function fetchCityData() {
        try {
          setIsLoadingCoords(true);
          setGeoError("");
          const res = await fetch(
            `${BASE_URL_COORDS}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          console.log(data);

          if (!data.countryCode)
            throw new Error("It Seems that is not a country, no? 🙃");

          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
          emoji.current = convertToEmoji(data.countryCode);
        } catch (error) {
          setGeoError("Occured an error: " + error.message);
        } finally {
          setIsLoadingCoords(false);
        }
      }

      fetchCityData();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !journeyDate) return;

    const newCity = {
      cityName,
      country,
      emoji: emoji.current,
      date: journeyDate,
      notes,
      position: { lat, lng },
    };
    await createCity(newCity);
    navigate("/app/cities");
  }

  if (!lat && !lng) return <Message message="Start by clicking on the map" />;
  if (isLoadingCoords) return <Spinner />;
  if (geoError) return <Message message={geoError} />;

  return (
    <form
      className={`${styles.form} ${isLoadingAddCity ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji.current}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          onChange={(date) => setJourneyDate(date)}
          selected={journeyDate}
          dateFormat={"dd/MM/yyyy"}
          className={styles.calender}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
