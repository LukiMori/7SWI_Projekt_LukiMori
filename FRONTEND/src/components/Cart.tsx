import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {
    Container,
    Spinner,
    Alert,
    Row,
    Col,
    Card,
    Button,
} from "react-bootstrap";
import CartItem from "../components/CartItem";
import {CHECK_CART_AVAILABILITY_URL, GET_CART_URL, UPDATE_CART_URL} from "../constants.ts";
import { CartItemInfo } from "../interfaces.ts";

const Cart = () => {
    const [cartItems, setCartItems] = useState<CartItemInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [stockIssues, setStockIssues] = useState<any[]>([]);

    const token = localStorage.getItem("authTokenResponse");
    const navigate = useNavigate();

    const handleCheckout = () => {
        const payload = cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }));

        axios.post(CHECK_CART_AVAILABILITY_URL, payload, {
            headers: {Authorization: `Bearer ${token}`}
        }).then(res => {
            if (Array.isArray(res.data) && res.data.length > 0) {
                setStockIssues(res.data);
            } else {
                navigate("/checkout");
            }
        }).catch(() => {
            alert("Chyba při ověřování dostupnosti.");
        });
    };


    const fetchCart = () => {
        if (!token) {
            setError("Košík je dostupný pouze pro přihlášené uživatele.");
            setLoading(false);
            return;
        }

        axios
            .get(GET_CART_URL, {
                headers: {Authorization: `Bearer ${token}`},
            })
            .then((res) => {
                setCartItems(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Chyba při načítání položek košíku.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQuantity = (productId: number, change: number) => {
        const item = cartItems.find(i => i.productId === productId);
        if (!item) return;

        const newQuantity = item.quantity + change;

        axios.patch(UPDATE_CART_URL, {
            productId,
            quantity: newQuantity,
        }, {
            headers: {Authorization: `Bearer ${token}`}
        }).then(() => {
            fetchCart();
        }).catch(() => {
            alert("Nepodařilo se aktualizovat množství.");
        });
    };

    const handleRemoveItem = (productId: number) => {
        const item = cartItems.find(i => i.productId === productId);
        if (!item) return;

        axios
            .patch(
                UPDATE_CART_URL,
                {
                    productId: item.productId,
                    quantity: 0,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(() => {
                fetchCart();
            })
            .catch(() => {
                alert("Nepodařilo se odebrat položku.");
            });
    };

    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const totalQuantity = cartItems.reduce(
        (acc, item) => acc + item.quantity,
        0
    );

    if (loading) return <Spinner animation="border"/>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container className="py-5">
            <h2 className="mb-4">Váš košík</h2>

            {stockIssues.length > 0 && (
                <Alert variant="danger">
                    <strong>Nelze pokračovat – některé položky nejsou skladem:</strong>
                    <ul className="mt-2 mb-0">
                        {stockIssues.map((issue, idx) => (
                            <li key={idx}>
                                {issue.productName} – dostupné: {issue.available}, v košíku: {issue.requested}
                            </li>
                        ))}
                    </ul>
                </Alert>
            )}


            {cartItems.length === 0 ? (
                <Alert variant="info">Košík je prázdný.</Alert>
            ) : (
                <Row>
                    <Col md={8}>
                        {[...cartItems]
                            .sort((a, b) => a.productName.localeCompare(b.productName))
                            .map((item) => (<CartItem
                                    key={item.productId}
                                    productId={item.productId}
                                    productName={item.productName}
                                    imageUrl={item.imageUrl}
                                    price={item.price}
                                    quantity={item.quantity}
                                    onIncrease={() => updateQuantity(item.productId, +1)}
                                    onDecrease={() => updateQuantity(item.productId, -1)}
                                    onRemove={() => handleRemoveItem(item.productId)}
                                    onSetQuantity={(newQty) => updateQuantity(item.productId, newQty - item.quantity)}
                                />

                            ))}
                    </Col>

                    <Col md={4}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <h5 className="mb-3">Souhrn objednávky</h5>
                                <p>
                                    <strong>Počet položek:</strong>{" "}
                                    {cartItems.length}
                                </p>
                                <p>
                                    <strong>Počet kusů:</strong> {totalQuantity}
                                </p>
                                <p>
                                    <strong>Celková cena:</strong>{" "}
                                    {totalPrice.toFixed(2)} Kč
                                </p>
                                <Button variant="success" className="w-100 mt-3" onClick={handleCheckout}>
                                    Pokračovat k platbě
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default Cart;