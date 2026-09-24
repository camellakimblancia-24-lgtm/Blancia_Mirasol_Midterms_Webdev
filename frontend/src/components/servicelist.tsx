import { useContext, useEffect } from "react";
import { serviceContext } from "../context/serviceContext";
import { fetchPies } from "../api/MicroService";
import { Card, Grid } from "./styles";

export const ServiceList: React.FC = () => {
  const context = useContext(serviceContext);
  if (!context) throw new Error("ServiceList must be used within a ServiceProvider.");
  const { state, dispatch } = context;

  useEffect(() => {
    const loadService = async () => {
      dispatch({ type: "FETCH_SERVICES_SUCCESS" });

      try {
        const data = await fetchService();
        dispatch({ type: "FETCH_SERVICE_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: (error as Error).message });
      }
    };
    loadService();
  }, [dispatch]);

  if (state.loading) return <p>Loading service...</p>;
  if (state.error) return <p>Error: {state.error}</p>;

  return (
    <Grid>
      {state.service.map((Microservice) => (
        <Card key={Microservice.id}>
          <h4>{Microservice.name}</h4>
          <p>
            <strong>Health Status:</strong> {Microservice.healthStatus}
          </p>
          <p>
            <strong>Service Status:</strong> {Microservice.serviceStatus}
          </p>
        </Card>
      ))}
    </Grid>
  );
};