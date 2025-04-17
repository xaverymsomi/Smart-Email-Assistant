import React, { useEffect, useState } from "react";
import axios from "axios";

const EmailHistory = () => {
  const [emails, setEmails] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/emails");
      setEmails(res.data);
    } catch (err) {
      console.error("Failed to fetch email history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="email-history">
      <h3>📜 Email History</h3>
      {emails.length === 0 ? (
        <p>No history yet.</p>
      ) : (
        emails.map((item) => (
          <div key={item.id} className="history-item">
            <p><strong>Subject:</strong> {item.subject}</p>
            <p>{item.email}</p>
            <small>🕒 {new Date(item.created_at).toLocaleString()}</small>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default EmailHistory;
