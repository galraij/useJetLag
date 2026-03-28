import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import TripCard from "../components/layout/TripCard";
import { getLatestPublishedTrips } from "../api/trips.api";
import "../CSS/explore.css";

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img skeleton-shimmer" />
      <div className="skeleton-body">
        <div className="skeleton-line wide skeleton-shimmer" />
        <div className="skeleton-line medium skeleton-shimmer" />
        <div className="skeleton-line narrow skeleton-shimmer" />
      </div>
    </div>
  );
}

export default function Explore() {
  const [publicTrips, setPublicTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");

  useEffect(() => {
    getLatestPublishedTrips(100)
      .then((res) => {
        if (res.data && res.data.success) {
          setPublicTrips(res.data.trips);
        }
      })
      .catch((err) => console.error("Error fetching trips:", err))
      .finally(() => setLoading(false));
  }, []);

  const countries = [...new Set(publicTrips.map(t => t.country).filter(Boolean))];

  const filteredTrips = publicTrips.filter(trip => {
    if (selectedCountry !== "all" && trip.country !== selectedCountry) return false;
    if (searchQuery && trip.title && !trip.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="explore-page">

      {/* HEADER */}
      <div className="explore-header">
        <h1>Explore Trips</h1>
        <p>Discover amazing journeys from travelers around the world</p>
      </div>

      {/* SEARCH BOX */}
      <div className="explore-search">
        <div className="search-input">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search trips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value="all">All Countries</option>
          {countries.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* INFO ROW — right above the grid */}
      {!loading && (
        <div className="explore-info">
          <span>
            Showing <strong>{filteredTrips.length}</strong> {filteredTrips.length === 1 ? "trip" : "trips"}
          </span>
          {(searchQuery || selectedCountry !== "all") && (
            <button
              className="clear-btn"
              onClick={() => {
                setSearchQuery("");
                setSelectedCountry("all");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* GRID */}
      <div className="trip-grid">
        {loading
          ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
          : filteredTrips.map(trip => (
              <Link to={`/trip/${trip.slug}`} key={trip.id} style={{ textDecoration: 'none' }}>
                <TripCard
                  trip={trip}
                  onTripDeleted={(id) => setPublicTrips(prev => prev.filter(t => t.id !== id))}
                />
              </Link>
            ))
        }
      </div>

    </div>
  );
}