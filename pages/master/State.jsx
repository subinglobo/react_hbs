
import React, { useEffect, useState } from "react";
import axiosInstance from "../../components/AxiosInstance";

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
          {states.map((ob) => (
            <tr key={ob.id}>
              <td>{ob.id}</td>
              <td>{ob.country}</td>
              <td>{ob.stateName}</td>
              <td>{ob.stateCode}</td>
            </tr>
          ))}
          <tr></tr>
        </tbody>
      </table>
    </div>
  );
};

export default State;
