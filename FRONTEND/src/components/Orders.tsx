import {useEffect, useState} from 'react';
import axios from 'axios';
import {Container, Spinner, Alert} from 'react-bootstrap';
import OrderCard from './OrderCard';
import {GET_ORDERS_URL} from "../constants.ts";
import {OrderInformation} from "../interfaces.ts";

export default function Orders() {
    const [orders, setOrders] = useState<OrderInformation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("authTokenResponse");
        if (!token) {
            setError("Musíte být přihlášeni.");
            setLoading(false);
            return;
        }

        axios.get(GET_ORDERS_URL, {
            headers: {Authorization: `Bearer ${token}`}
        }).then(res => {
            setOrders(res.data);
            setLoading(false);
        }).catch(() => {
            setError("Nepodařilo se načíst objednávky.");
            setLoading(false);
        });
    }, []);

    if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5"/>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container className="py-5">
            <h2 className="mb-4 text-center">Moje objednávky</h2>
            {orders.length === 0 ? (
                <Alert variant="info">Nemáte žádné objednávky.</Alert>
            ) : (
                orders.map((order, idx) => <OrderCard key={idx} orderInformation={order}/>)
            )}
        </Container>
    );
}