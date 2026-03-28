import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TripCard from "./TripCard";
import "../../CSS/discover.css";
import { getLatestPublishedTrips } from "../../api/trips.api";

const DiscoverTrips = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    getLatestPublishedTrips(6)
      .then((res) => {
        if (res.data.success) {
          setTrips(res.data.trips);
        }
      })
      .catch((err) => console.error("Error fetching latest trips", err));
  }, []);

  return (
    <section className="discover">
      <div className="container">

        <div className="header">
          <h2>Discover Trips</h2>
          <p>Explore adventures from travelers around the world</p>
        </div>

        <div className="grid">
          {trips.map((trip) => (
            <Link to={`/trip/${trip.slug}`} key={trip.id} style={{ textDecoration: 'none' }}>
              <TripCard trip={trip} />
            </Link>
          ))}
        </div>
        <div className="view-all-container">
          <Link to="/explore">
            <button className="view-all-btn">
              View All Trips →
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default DiscoverTrips;