import "../../CSS/TripCard.css"
import useAuth from "../../hooks/useAuth";
import { ActionIcon } from "@mantine/core";
import { Trash, Edit } from "lucide-react";
import { deleteTrip } from "../../api/trips.api";
import { Link } from "react-router-dom";

const TripCard = ({ trip, onTripDeleted }) => {
  const { user } = useAuth();
  const isOwner = user && trip.user_id === user.id;

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Admin: Permanently delete this trip from the system?")) return;
    try {
      await deleteTrip(trip.id);
      if (onTripDeleted) onTripDeleted(trip.id);
    } catch (err) {
      console.error("Failed to delete trip:", err);
      alert("Failed to delete trip");
    }
  };

  return (
    <div className="trip-card" style={{ position: 'relative' }}>
      {user?.role === 'admin' && (
        <ActionIcon 
          color="red" 
          variant="filled" 
          size="md"
          title="Admin Delete"
          style={{ position: 'absolute', top: 10, right: 10, zIndex: 100 }}
          onClick={handleDelete}
        >
          <Trash size={16} />
        </ActionIcon>
      )}

      {isOwner && (
        <ActionIcon 
          component={Link}
          to={`/trip/${trip.slug}`}
          color="blue" 
          variant="filled" 
          size="md"
          title="Edit Trip"
          style={{ position: 'absolute', top: 10, left: 10, zIndex: 100 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Edit size={16} />
        </ActionIcon>
      )}

      <div className="image-wrapper">
        <img src={trip.image} alt={trip.title} />

        <div className="overlay"></div>

        <div className="overlay-content">
          <p className="location">
            {trip.region}, {trip.country}
          </p>

          <h3 className="title">{trip.title}</h3>

          <p className="date">
            {trip.month} {trip.year}
          </p>
        </div>
      </div>

      <div className="card-footer">
        <span className="author">By {trip.user_name || "Unknown user"}</span>
        <span className="read">View Trip →</span>
      </div>

    </div>
  );
};

export default TripCard;