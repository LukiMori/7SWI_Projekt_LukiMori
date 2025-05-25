import { Card, Row, Col } from "react-bootstrap";
import {OrderInformation} from "../interfaces.ts";

interface OrderCardProps {
    orderInformation: OrderInformation;
}

export default function OrderCard({ orderInformation }: OrderCardProps) {
    return (
        <Card className="mb-4 shadow-sm">
            <Card.Body>
                <Card.Title className="mb-4">Objednávka #{orderInformation.id}</Card.Title>

                <p className="mb-2"><strong>Datum doručení:</strong> {orderInformation.deliveryDate}</p>
                <p className="mb-2"><strong>Adresa:</strong> {orderInformation.address}</p>
                <p className="mb-2"><strong>Stav:</strong> {orderInformation.status}</p>
                <p className="mb-3"><strong>Celková cena:</strong> {orderInformation.totalPrice} Kč</p>

                <hr className="mb-3" />

                {orderInformation.items.map((item: any, idx: number) => (
                    <Row key={idx} className="fs-6 py-2 border-bottom align-items-center">
                        <Col md={5}>{item.productName}</Col>
                        <Col md={2}>{item.quantity} ks</Col>
                        <Col md={2}>{item.priceAtTime} Kč / ks</Col>
                        <Col md={3} className="text-end">{item.quantity * item.priceAtTime} Kč</Col>
                    </Row>
                ))}
            </Card.Body>
        </Card>
    );
}
