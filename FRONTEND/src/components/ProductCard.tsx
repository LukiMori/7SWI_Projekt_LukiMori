import { Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import type { Product } from "../interfaces.ts";

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
            <Card className="h-100 shadow-sm">
                {product.imageUrl && (
                    <div style={{
                        padding: "10px",
                        height: "250px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#ffffff"
                    }}>
                        <Card.Img
                            variant="top"
                            src={product.imageUrl}
                            alt={product.name}
                            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                        />
                    </div>
                )}
                <Card.Body className="d-flex flex-column">
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{product.brandName}</Card.Subtitle>
                    <Card.Text>
                        Cena: {product.price.toFixed(2)} Kč <br />
                        Skladem: {product.quantityInStock} ks
                    </Card.Text>
                    <Button variant="primary" className="mt-auto">Detail</Button>
                </Card.Body>
            </Card>
        </Link>
    );
};

export default ProductCard;
