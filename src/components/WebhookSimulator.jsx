import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ServerUrl } from "../Constant";

const WebhookSimulator = ({ onViewMap }) => {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(
          ServerUrl + '/status-logs',

          {
            headers: { 'Content-Type': 'application/json' },
          }
        );


        setLogs(response.data.result);

      }
      catch (err) {
        console.error(err);
        // setError('Error fetching package data.');
      }
    };

    fetchPackage();
  }, []);
  return (
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
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr key={i}>
                      <td>{log.createdAt}</td>
                      {/* <td>#{log.packageId}</td> */}
                      <td>{log.packageId}</td>
                      <td>

                        <span
                          className={`badge ${log.status === 'Delivered' ? 'bg-success' : 'bg-secondary'
                            }`}
                        >
                          {log.status}
                        </span>

                      </td>


                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>)
};

export default WebhookSimulator;
