import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {Container, Row, Col, Spinner, Alert, Button, Card} from "react-bootstrap";
import {GET_PRODUCTS_URL} from "../constants.ts";
import {ProductDetailedInfo} from "../interfaces.ts";

const ProductDetail = () => {
    const {productId} = useParams();
    const [product, setProduct] = useState<ProductDetailedInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get(`${GET_PRODUCTS_URL}/${productId}`)
            .then(res => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Produkt se nepodařilo načíst.");
                setLoading(false);
            });
    }, [productId]);

    if (loading) return <Spinner animation="border"/>;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!product) {
        return (
            <Container className="py-5">
                <Alert variant="warning">
                    Produkt nelze zobrazit, protože se nepodařilo načíst detailní informace.
                </Alert>
                <Button variant="primary" onClick={() => window.history.back()}>Zpět</Button>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row>
                {/* Left Column - Image */}
                <Col md={6} className="d-flex flex-column align-items-center justify-content-start">
                    <Card className="shadow-sm p-2 mb-3" style={{maxWidth: "500px"}}>
                        <Card.Img
                            variant="top"
                            src={product.imageUrl}
                            alt={product.name}
                            style={{objectFit: "cover"}}
                        />
                    </Card>
                </Col>

                {/* Right Column - Info */}
                <Col md={6} className="d-flex flex-column align-items-center justify-content-center text-center">
                    <h1 className="fw-bold mb-4">{product.name}</h1>

                    <Card className="p-3 shadow-sm mb-3 text-center" style={{width: "250px"}}>
                        <h6 className="text-muted mb-1">Cena</h6>
                        <h3 className="fw-semibold text-success">{product.price} Kč</h3>
                    </Card>

                    <Button
                        variant="success"
                        size="lg"
                        style={{width: "180px"}}
                        disabled={product.quantityInStock <= 0}
                        onClick={() => {
                            const token = localStorage.getItem("authTokenResponse");
                            if (!token) {
                                alert("Pro tuto akci musíte být přihlášeni.");
                                return;
                            }
                            if (product.quantityInStock <= 0) {
                                alert("Produkt není skladem.");
                                return;
                            }
                            axios.post("http://localhost:8081/api/cart/add", {
                                token: token,
                                productId: product.id,
                                quantity: 1
                            }, {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            })
                                .then(() => alert("Produkt byl přidán do košíku"))
                                .catch(() => alert("Chyba při přidávání do košíku"));
                        }}
                    >
                        Přidat do košíku
                    </Button>

                    <Card className="p-2 shadow-sm mt-3 text-center" style={{width: "250px"}}>
                        <h6 className="text-muted mb-1">Dostupnost</h6>
                        <h5 className={product.quantityInStock > 0 ? "text-primary" : "text-danger"}>
                            {product.quantityInStock > 0
                                ? `${product.quantityInStock} ks skladem`
                                : "Není skladem"}
                        </h5>
                    </Card>

                </Col>
            </Row>

            {product.description && (
                <Row className="mt-5">
                    <Col>
                        <Card className="p-4 shadow-sm text-start">
                            <h4 className="fw-semibold mb-3">Popis produktu</h4>
                            <p className="text-muted">{product.description}</p>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default ProductDetail;