import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {Container, Row, Col, Spinner, Alert} from "react-bootstrap";
import ProductCard from "./ProductCard";
import {GET_CATEGORY_URL, GET_PRODUCTS_BY_CATEGORY_URL} from "../constants";
import {Product} from "../interfaces";

const ProductsByCategory = () => {
    const {categoryId} = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categoryName, setCategoryName] = useState<string>("");

    useEffect(() => {
        setLoading(true);
        axios.get(`${GET_CATEGORY_URL}/${categoryId}`)
            .then((res) => {
                setCategoryName(res.data.name);
            })
            .catch((err) => {
                console.error("Nepodařilo se načíst název kategorie", err);
                setCategoryName("Neznámá kategorie");
            });

        axios.get(`${GET_PRODUCTS_BY_CATEGORY_URL}/${categoryId}`)
            .then((res) => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Nepodařilo se načíst produkty pro tuto kategorii.");
                setLoading(false);
                console.error(err);
            });
    }, [categoryId]);

    return (
        <Container className="py-4">
            <h2 className="mb-4">{categoryName}</h2>

            {!loading && !error && products.length === 0 && (
                <Alert variant="info">Žádné produkty v této kategorii.</Alert>
            )}

            {loading && <Spinner animation="border"/>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {[...products as Product[]]
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

export default ProductsByCategory;