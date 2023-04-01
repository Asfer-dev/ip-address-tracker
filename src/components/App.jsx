import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function App() {

    const [query, setQuery] = useState({
        ipAddress: '',
        location: '',
        timezone: '',
        isp: ''
    });



    let url = `https://geo.ipify.org/api/v2/country?apiKey=at_vlQXhjyFUhL6NrLUvuSG2OYLFgBuR`;
    // url = 'https://google.com'

    useEffect(() => {
        
        

        axios.get(url)
        .then(response => {

            const details = response.data;
            const {ip, location, as} = details;
            const {country, city, lat, lng, timezone} = location;
            const locationString = `${city}, ${country}`;

            setQuery({
                ipAddress: ip,
                location: locationString,
                timezone: timezone,
                isp: as.name
            });



            const map = L.map('map').setView([48.773748, 9.182143], 13);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
        
            const Icon = L.icon({
                iconUrl: 'images/icon-location.svg',
        
                iconSize:     [45, 55], // size of the icon
                iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            });

            map.setView([lat, lng], 13);
        
            const marker = L.marker([lat, lng], {icon: Icon}).addTo(map);
                
            
        })
    
    }, []);

    const [inputIp, setInputIp] = useState('');

    return (
        <main>
            <section className="ip-address-section">
                <h1>IP Address Tracker</h1>
                <form>
                <input placeholder="Search for any IP address or domain" type="text" name="ipAddress" id=""
                onChange={(e) => setInputIp(e.target.value)} value={inputIp} />
                <button type="submit" onClick={(e) => {
                    
                    axios.get(url + '&ipAddress=' + inputIp)
                    .then(response => {
                        const details = response.data;
                        const {ip, location, as} = details;
                        const {country, city, lat, lng, timezone} = location;
                        const locationString = `${city}, ${country}`;

                        setQuery({
                            ipAddress: ip,
                            location: locationString,
                            timezone: timezone,
                            isp: as.name
                        });
                    })

                    e.preventDefault();
                }}>{'>'}</button>
                </form>
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
            
        </main>
    );
}