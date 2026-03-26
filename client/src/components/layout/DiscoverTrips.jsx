import { useEffect, useState } from "react";
import TripCard from "./TripCard";
import "../../CSS/discover.css";
const DiscoverTrips = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    fetch("/trips.json")
      .then((res) => res.json())
      .then((data) => setTrips(data));
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
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
        <div className="view-all-container">
  <button className="view-all-btn">
    View All Trips →
  </button>
</div>

      </div>
    </section>
  );
};

export default DiscoverTrips;