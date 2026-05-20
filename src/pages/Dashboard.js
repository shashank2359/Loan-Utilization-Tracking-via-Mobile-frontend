import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const role = localStorage.getItem("role") || "beneficiary";
  const name = localStorage.getItem("name") || "User";
  const token = localStorage.getItem("token");

  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  const fetchLoans = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const url =
        role === "admin"
          ? "http://localhost:5000/api/loans/all"
          : "http://localhost:5000/api/loans/my-loans";

      const res = await axios.get(url, { headers });
      setLoans(res.data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load loans");
    } finally {
      setLoading(false);
    }
  }, [role, headers]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const applyLoan = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/loans/apply",
        { amount, purpose: purpose.trim() },
        { headers }
      );
      alert("Loan applied successfully");
      setAmount("");
      setPurpose("");
      fetchLoans();
    } catch (err) {
      const message = err?.response?.data?.message || "Error applying loan";
      alert(message);
    }
  };

  const updateLoanStatus = async (id, action) => {
    try {
      const url = `http://localhost:5000/api/loans/${id}/${action}`;
      await axios.put(url, {}, { headers });
      fetchLoans();
    } catch (err) {
      alert(err?.response?.data?.message || "Unable to update loan status");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-top">
        <div>
          <h1>Welcome, {name}</h1>
          <span>Role: {role}</span>
        </div>
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <h2 className="panel-title">
            {role === "beneficiary" ? "Apply for a Loan" : "Admin Loan Management"}
          </h2>
          {role === "beneficiary" ? (
            <>
              <input
                type="number"
                placeholder="Loan Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="auth-input"
              />
              <input
                type="text"
                placeholder="Purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="auth-input"
              />
              <button className="button" onClick={applyLoan}>
                Apply Loan
              </button>
            </>
          ) : (
            <p className="faded">Use the panel on the right to review and update loan status.</p>
          )}
        </div>

        <div className="dashboard-panel">
          <h2 className="panel-title">{role === "admin" ? "All Loans" : "My Loans"}</h2>

          {loading ? (
            <p className="faded">Loading loans...</p>
          ) : error ? (
            <p style={{ color: "#dc2626" }}>{error}</p>
          ) : loans.length === 0 ? (
            <p className="faded">No loans found yet.</p>
          ) : (
            <div className="loan-table-wrapper">
              <table className="loan-table">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Purpose</th>
                    <th>Status</th>
                    <th>Created At</th>
                    {role === "admin" && <th>User</th>}
                    {role === "admin" && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan._id}>
                      <td>₹{loan.amount}</td>
                      <td>{loan.purpose || "-"}</td>
                      <td>
                        <span className={`loan-tag ${loan.status}`}>
                          {loan.status}
                        </span>
                      </td>
                      <td>{new Date(loan.createdAt).toLocaleString()}</td>
                      {role === "admin" ? (
                        <>
                          <td>{loan.user?.name || loan.user?.email || "Unknown"}</td>
                          <td className="action-row">
                            <button
                              className="small-button"
                              onClick={() => updateLoanStatus(loan._id, "approve")}
                              disabled={loan.status !== "pending"}
                            >
                              Approve
                            </button>
                            <button
                              className="small-button"
                              onClick={() => updateLoanStatus(loan._id, "reject")}
                              disabled={loan.status !== "pending"}
                            >
                              Reject
                            </button>
                          </td>
                        </>
                      ) : null}
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
}

export default Dashboard;