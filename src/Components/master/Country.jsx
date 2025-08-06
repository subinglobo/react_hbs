import axiosInstance from "../AxiosInstance";
import React, { useEffect, useState, useCallback } from "react";

const CountryApi = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize the API call function to prevent unnecessary recreations
  const fetchCountries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/api/country");
      setCountries(response.data);
    } catch (err) {
      console.error("Error fetching countries:", err);
      setError("Failed to load countries. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Immediate invocation for faster loading
    const loadData = async () => {
      await fetchCountries();
    };
    loadData();
  }, [fetchCountries]);

  // Early return for loading state
  if (loading) {
    return (
      <div className="container text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading countries...</p>
      </div>
    );
  }

  // Early return for error state
  if (error) {
    return (
      <div className="container alert alert-danger" role="alert">
        {error}
        <button 
          className="btn btn-sm btn-outline-danger ms-3"
          onClick={fetchCountries}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="text-center mb-4">List of Countries</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {countries.length > 0 ? (
              countries.map((country) => (
                <tr key={country.id}>
                  <td>{country.id}</td>
                  <td>{country.name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center text-muted">
                  No countries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(CountryApi);