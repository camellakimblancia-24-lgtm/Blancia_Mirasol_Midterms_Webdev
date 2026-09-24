import { useContext, useState } from "react"
import { serviceContext } from "../context/HubContext"
import { Button, Form } from "./styles";
import { createPie } from "../api/MicroService";

export const ServiceForm: React.FC = () => {
    const context = useContext(serviceContext);
    if (!context) throw new Error('Serviceform must be used within ServiceProvider');
    const { dispatch } = context;

    const [name, setName] = useState("");
    const [environment, setHealthStatus] = useState("");
    const [servicestatus, setServiceStatus] = useState("");

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        try {
            const newService = await createService({
                name,
                environment,
                servicestatus
            });
            dispatch({ type: 'CREATE_SERVICE_SUCCESS', payload: newService });
            setName('')
            setHealthStatus('')
            setServiceStatus('')
        } catch(error) {
            console.error(error);
            alert('Failed to input!')
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <h3>REGISTER!</h3>
            <input placeholder="User" value={name} onChange={e => setName(e.target.value)} required/>
            <input placeholder="Environment" value={environment} onChange={e => setHealthStatus(e.target.value)} required/>
            <input placeholder="Health Status" value={servicestatus} onChange={e => setServiceStatus(e.target.value)} required/>
            <Button type="submit">Sumbit</Button>
        </Form>
    )
}