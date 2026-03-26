import "../../CSS/TripCard.css"
const TripCard = ({ trip }) => {
  return (
    <div className="trip-card">

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
        <span>12 photos</span>
        <span className="read">Read Story →</span>
      </div>

    </div>
  );
};

export default TripCard;