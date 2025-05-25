import {useEffect, useState} from 'react';
import axios from 'axios';
import {Container, Row, Col, Spinner, Alert} from 'react-bootstrap';
import ProductCard from './ProductCard';
import {Product} from "../interfaces";
import {GET_PRODUCTS_URL} from "../constants.ts";

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get(GET_PRODUCTS_URL)
            .then((res) => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching products:", err);
                setError("Nepodařilo se načíst produkty.");
                setLoading(false);
            });
    }, []);

    return (
        <Container className="py-4">
            <h2 className="mb-4">Produkty</h2>

            {loading && (
                <div className="text-center">
                    <Spinner animation="border"/>
                </div>
            )}

            {error && (
                <Alert variant="danger">{error}</Alert>
            )}

            {!loading && !error && products.length === 0 && (
                <Alert variant="info">Žádné produkty v nabídce.</Alert>
            )}

            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {[...products]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((product) => (
                        <Col key={product.id}>
                            <ProductCard product={product}/>
                        </Col>
                    ))}
            </Row>
        </Container>
    );
};


export default Products;
