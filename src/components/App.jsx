import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import Icon from "../icon-location.svg";
import L from "leaflet";

export default function App() {
  const MARKER_ICON = L.icon({
    iconUrl: Icon,
    iconSize: [34, 40],
  });

  const [screenSize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setScreenSize(window.innerWidth);
    });
  }, []);

  const [query, setQuery] = useState({
    ipAddress: "",
    location: "",
    timezone: "",
    isp: "",
  });

  let url = `https://geo.ipify.org/api/v2/country,city?apiKey=at_vlQXhjyFUhL6NrLUvuSG2OYLFgBuR`;
  //   url = "https://google.com";

  useEffect(() => {
    axios.get(url).then((response) => {
      const details = response.data;
      const { ip, location, as } = details;
      const { country, city, lat, lng, timezone } = location;
      const locationString = `${city}, ${country}`;

      setQuery({
        ipAddress: ip,
        location: locationString,
        timezone: timezone,
        isp: as.name,
        lat: lat,
        lng: lng,
      });
    });
  }, []);

  const [inputIp, setInputIp] = useState("");

  function LocationMarker() {
    const map = useMapEvents({
      click() {
        map.flyTo([query.lat, query.lng], map.getZoom());
      },
    });

    return (
      <Marker icon={MARKER_ICON} position={[query.lat, query.lng]}></Marker>
    );
  }

  const [message, setMessage] = useState("");

  return (
    <main>
      <div className="main-body">
        <section className="ip-address-section">
          <h1>IP Address Tracker</h1>
          <form>
            <input
              placeholder="Search for any IP address or domain"
              type="text"
              name="ipAddress"
              id=""
              onChange={(e) => setInputIp(e.target.value)}
              value={inputIp}
            />
            <button
              type="submit"
              onClick={(e) => {
                axios.get(url + "&ipAddress=" + inputIp).then((response) => {
                  const details = response.data;
                  const { ip, location, as } = details;
                  const { country, city, lat, lng, timezone } = location;
                  const locationString = `${city}, ${country}`;

                  setQuery({
                    ipAddress: ip,
                    location: locationString,
                    timezone: timezone,
                    isp: as.name,
                    lat: lat,
                    lng: lng,
                  });
                });

                setMessage("Click on the map to locate!");

                e.preventDefault();
              }}
            >
              {">"}
            </button>
          </form>
          {message && <p style={{ color: "#fff" }}>{message}</p>}
        </section>
        <section className="details-section">
          <div className="ip-address detail">
            <h2 className="detail-heading">IP Address</h2>
            <p className="detail-info">{query.ipAddress}</p>
          </div>

          <div className="partition"></div>

          <div className="location detail">
            <h2 className="detail-heading">Location</h2>
            <p className="detail-info"> {query.location}</p>
          </div>

          <div className="partition"></div>

          <div className="timezone detail">
            <h2 className="detail-heading">Timezone</h2>
            <p className="detail-info">UTC {query.timezone}</p>
          </div>

          <div className="partition"></div>

          <div className="isp detail">
            <h2 className="detail-heading">ISP</h2>
            <p className="detail-info"> {query.isp} </p>
          </div>
        </section>
      </div>
      <img
        src={
          screenSize >= 720
            ? "images/pattern-bg-desktop.png"
            : "images/pattern-bg-mobile.png"
        }
        alt=""
      />
      <div className="map-container">
        {query.lat && query.lng && (
          <MapContainer
            center={[query.lat, query.lng]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
          </MapContainer>
        )}
      </div>
    </main>
  );
}
