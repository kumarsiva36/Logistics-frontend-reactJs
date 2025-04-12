import DeliveryCard from './DeliveryCard';

const Dashboard = ({ deliveries = [], onSelect = () => {} }) => (
  <div className="row mt-4">
    {deliveries.length === 0 ? (
      <p className="text-muted">No deliveries available.</p>
    ) : (
      deliveries.map((delivery) => (
        <div className="col-md-4" key={delivery.id} onClick={() => onSelect(delivery)} style={{ cursor: 'pointer' }}>
          <DeliveryCard {...delivery} />
        </div>
      ))
    )}
  </div>
);

export default Dashboard;

