import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EmailForm = () => {
  const [subject, setSubject] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!subject.trim()) {
      toast.warning("Please enter a subject.");
      return;
    }

    setLoading(true);
    setGeneratedEmail("");

    try {
        const res = await axios.post("http://localhost:5000/api/email/save", {
          subject,
        });
      
        setGeneratedEmail(res.data.email);
        toast.success("Email generated successfully!");
      } catch (error) {
        toast.error("Failed to generate email.");
        console.error(error);
      }
      

    setLoading(false);
  };

  return (
    <div className="email-form">
      <form onSubmit={handleGenerate}>
        <input
          type="text"
          placeholder="Enter email subject..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Email"}
        </button>
      </form>

      {generatedEmail && (
        <div className="generated-email">
          <h3>📩 Generated Email</h3>
          <p>{generatedEmail}</p>
        </div>
      )}
    </div>
  );
};

export default EmailForm;
