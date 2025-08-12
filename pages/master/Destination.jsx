
import React, { useEffect, useState } from "react";
import axiosInstance from "../../components/AxiosInstance";

const Destination = () => {
  const [places, setPlaces] = useState([]);

  const destinationList = async () => {
      try {
      const response = await axiosInstance.get("/api/destination", );
      setPlaces(response.data);
    } catch (error) {
      console.log("error::", error);
    }
  };

  useEffect(() => {
    destinationList();
  }, []);

  return (
    <div className="container">
      <h2 className="text-center">List of Destinations</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th> Id</th>
            <th>State</th>
            <th>Country</th>
            <th>Destination</th>
           </tr>
        </thead>
        <tbody>
          {places.map((destination) => (
            <tr key={destination.id}>
              <td>{destination.id}</td>
              <td>{destination.state}</td>
               <td>{destination.country}</td>
                <td>{destination.name}</td>
                        </tr>
          ))}
          <tr></tr>
        </tbody>
      </table>
    </div>
  );
};

export default Destination;
