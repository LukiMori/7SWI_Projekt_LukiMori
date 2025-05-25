import {Card, Button, Row, Col, Image, Form} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useState, useEffect} from "react";
import {CartItemProps} from "../interfaces.ts";

const CartItem = ({
                      productId,
                      productName,
                      imageUrl,
                      price,
                      quantity,
                      onRemove,
                      onIncrease,
                      onDecrease,
                      onSetQuantity
                  }: CartItemProps) => {
    const [tempQuantity, setTempQuantity] = useState(quantity.toString());
    useEffect(() => {
        setTempQuantity(quantity.toString());
    }, [quantity]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;

        if (rawValue === "") {
            setTempQuantity("");
            return;
        }

        const digitsOnly = rawValue.replace(/\D/g, "");
        setTempQuantity(digitsOnly);
    };

    const handleInputBlur = () => {
        const parsed = parseInt(tempQuantity, 10);
        if (!tempQuantity.trim() || tempQuantity.trim() === "0") {
            if (window.confirm("Chcete tuto položku odstranit z košíku?")) {
                onRemove();
            } else {
                setTempQuantity("1");
                onSetQuantity?.(1);
            }
        } else if (!isNaN(parsed) && parsed > 0) {
            onSetQuantity?.(parsed);
        } else {
            setTempQuantity(quantity.toString());
        }
    };

    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body>
                <Row className="align-items-center">
                    <Col xs={3} md={2}>
                        <Link to={`/products/${productId}`}>
                            <Image
                                src={imageUrl}
                                alt={productName}
                                fluid
                                rounded
                            />
                        </Link>
                    </Col>

                    <Col xs={6} md={7}>
                        <h5 className="mb-2">
                            <Link to={`/products/${productId}`} className="text-decoration-none">
                                {productName}
                            </Link>
                        </h5>
                        <p className="mb-0 text-muted">Cena: {price} Kč</p>
                    </Col>

                    <Col xs={3} md={3} className="d-flex flex-column justify-content-between align-items-end h-100">
                        <div className="mb-3 w-100">
                            <div className="text-end mb-1 fw-semibold">Množství</div>
                            <div className="d-flex align-items-center justify-content-end gap-2">
                                <Button variant="outline-secondary" size="sm" onClick={onDecrease}
                                        disabled={quantity <= 1}>−</Button>
                                <Form.Control
                                    type="text"
                                    value={tempQuantity}
                                    style={{width: "70px", textAlign: "center"}}
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                />
                                <Button variant="outline-secondary" size="sm" onClick={onIncrease}>+</Button>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <Button variant="danger" size="sm" onClick={onRemove}>
                                Odstranit
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default CartItem;
