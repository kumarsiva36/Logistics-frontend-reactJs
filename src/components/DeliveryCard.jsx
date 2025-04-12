const DeliveryCard = ({ destination, status, driver }) => (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{destination}</h5>
        <p>Status: <strong>{status}</strong></p>
        <p>Driver: {driver || 'Unassigned'}</p>
      </div>
    </div>
  );
  
  export default DeliveryCard;
  