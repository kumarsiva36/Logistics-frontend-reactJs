import React from 'react';

const WebhookSimulator = ({ logs, onViewMap }) => (
  <div className="container mt-5">
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">🔁 Webhook Simulator Logs</h5>
      </div>
      <div className="card-body">
        {logs.length === 0 ? (
          <div className="alert alert-warning">No logs available 📭</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th>📅 Timestamp</th>
                  <th>📦 Package ID</th>
                  <th>🚚 New Status</th>
                  <th>🗺️ Map</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={i}>
                    <td>{log.timestamp}</td>
                    <td>#{log.packageId}</td>
                    <td>
                    <span
    className={`badge ${
      log.status === 'Delivered' ? 'bg-success' : 'bg-secondary'
    }`}
  >
    {log.status}
  </span>

                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onViewMap(log)}
                      >
                        View Map
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default WebhookSimulator;
