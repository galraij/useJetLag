import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TripCard from "./TripCard";
import "../../CSS/discover.css";
import { getLatestPublishedTrips } from "../../api/trips.api";

function SkeletonCard() {
  return (
    <div className="discover-skeleton-card">
      <div className="discover-skeleton-img discover-skeleton-shimmer" />
      <div className="discover-skeleton-body">
        <div className="discover-skeleton-line wide discover-skeleton-shimmer" />
        <div className="discover-skeleton-line medium discover-skeleton-shimmer" />
        <div className="discover-skeleton-line narrow discover-skeleton-shimmer" />
      </div>
    </div>
  );
}

const DiscoverTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestPublishedTrips(8)
      .then((res) => {
        if (res.data.success) {
          setTrips(res.data.trips);
        }
      })
      .catch((err) => console.error("Error fetching latest trips", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="discover">
      <div className="container">

        <div className="header">
          <h2>Discover Trips</h2>
          <p>Explore adventures from travelers around the world</p>
        </div>

        <div className="grid">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : trips.map((trip) => (
                <Link to={`/trip/${trip.slug}`} key={trip.id} style={{ textDecoration: 'none' }}>
                  <TripCard
                    trip={trip}
                    onTripDeleted={(id) => setTrips(prev => prev.filter(t => t.id !== id))}
                  />
                </Link>
              ))
          }
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