import axiosInstance from "../AxiosInstance";
import React, { useEffect, useState } from "react";

const State = () => {
  const [states, setStates] = useState([]);

  const stateList = async () => {
   

    try {
      const response = await axiosInstance.get("/api/province",);
      setStates(response.data);
    } catch (error) {
      console.log("error::", error);
    }
  };

  useEffect(() => {
    stateList();
  }, []);

  return (
    <div className="container">
      <h2 className="text-center">List of States</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <caption>State List</caption>
          <tr>
            <th> Id</th>
            <th>Country</th>
            <th>State</th>
            <th>State Code</th>
          </tr>
        </thead>
        <tbody>
          {states.map((destination) => (
            <tr key={destination.id}>
              <td>{destination.id}</td>
              <td>{destination.country}</td>
              <td>{destination.stateName}</td>
              <td>{destination.stateCode}</td>
            </tr>
          ))}
          <tr></tr>
        </tbody>
      </table>
    </div>
  );
};

export default State;
