import React, { useState } from "react";
import axios from "axios";

function Dashboard() {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");

  const applyLoan = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/loans/apply",
        { amount, purpose },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Loan Applied Successfully");
      setAmount("");
      setPurpose("");

    } catch (error) {
      alert("Error applying loan");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          padding: "30px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          width: "350px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Apply Loan</h2>

        <input
          type="number"
          placeholder="Loan Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
        />

        <input
          type="text"
          placeholder="Purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
        />

        <button
          onClick={applyLoan}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Apply Loan
        </button>
      </div>
    </div>
  );
}

export default Dashboard;