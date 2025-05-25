import {useEffect, useState} from "react";
import axios from "axios";
import {
    Container,
    Alert,
    Spinner,
    Form,
    Row,
    Col,
    Card,
    Button
} from "react-bootstrap";

import StepSuggest from "./AddressUtils/StepSuggest";
import StepForm from "./AddressUtils/StepForm";
import StepCheck from "./AddressUtils/StepCheck";
import StepSummary from "./AddressUtils/StepSummary";
import {
    CONFIRM_ORDER_URL,
    EMPTY_MAP_FORM,
    GET_CART_URL,
    PROFILE_GET_ADDRESS_URL,
    PROFILE_GET_INFO_URL
} from "../constants";
import {Address, CartItemInfo, IFormData, IResponseItem, User} from "../interfaces";
import {useNavigate} from "react-router-dom";

const Checkout = () => {
    const [user, setUser] = useState<User | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(-1);
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState<IFormData>(EMPTY_MAP_FORM);
    const [finalResult, setFinalResult] = useState<IResponseItem | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cartItems, setCartItems] = useState<CartItemInfo[]>([]);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false)
    const [deliveryDate, setDeliveryDate] = useState<string>("");

    const token = localStorage.getItem("authTokenResponse");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;
        const headers = {Authorization: `Bearer ${token}`};

        axios.get(PROFILE_GET_INFO_URL, {headers})
            .then(res => setUser(res.data))
            .catch(() => setError("Nepodařilo se načíst uživatelská data."));

        axios.get(PROFILE_GET_ADDRESS_URL, {headers})
            .then(res => {
                const addr = res.data || [];
                setAddresses(addr);
                if (addr.length === 0) {
                    setShowNewAddressForm(true);
                    setActiveStep(1);
                }
            })
            .catch(() => setError("Nepodařilo se načíst adresy."));

        axios.get(GET_CART_URL, {headers})
            .then(res => setCartItems(res.data || []))
            .catch(() => setError("Nepodařilo se načíst položky v košíku."));
    }, []);

    const onSelected = (suggestion: IResponseItem) => {
        if (suggestion?.regionalStructure) {
            const streetIndex = suggestion.regionalStructure.findIndex(r => r.type === 'regional.address');
            setFormData({
                street: streetIndex === -1
                    ? suggestion.regionalStructure.find(r => r.type === 'regional.street')?.name || ''
                    : suggestion.regionalStructure.length > streetIndex
                        ? suggestion.regionalStructure[streetIndex + 1].name
                        : '',
                houseNumber: suggestion.regionalStructure.find(r => r.type === 'regional.address')?.name || '',
                city: suggestion.regionalStructure.find(r => r.type === 'regional.municipality')?.name || '',
                zip: suggestion.zip || '',
                country: suggestion.regionalStructure.find(r => r.type === 'regional.country')?.name || '',
            });
        } else {
            setFormData(EMPTY_MAP_FORM);
        }
        setActiveStep(2);
    };

    const onRestart = () => {
        setFormData(EMPTY_MAP_FORM);
        setFinalResult(null);
        setActiveStep(1);
    };

    const handleAddressAdded = (newAddr: any) => {
        if (newAddr) {
            setAddresses(prev => {
                const updated = [...prev, newAddr];
                setSelectedAddressIndex(updated.length - 1);
                setShowNewAddressForm(false);
                return updated;
            });
        } else {
            axios.get(PROFILE_GET_ADDRESS_URL, {
                headers: {Authorization: `Bearer ${token}`}
            }).then(res => {
                const updated = res.data || [];
                setAddresses(updated);
                if (updated.length > 0) {
                    setSelectedAddressIndex(updated.length - 1);
                    setShowNewAddressForm(false);
                }
            });
        }
    };

    const isValidDeliveryDate = (dateStr: string): boolean => {
        if (!dateStr) return false;

        const today = new Date();
        const selected = new Date(dateStr);

        today.setHours(0, 0, 0, 0);
        selected.setHours(0, 0, 0, 0);

        const diffInDays = Math.floor((selected.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        return diffInDays >= 2 && diffInDays <= 14;
    };

    const handleOrderConfirm = () => {
        if (
            selectedAddressIndex === -1 ||
            !addresses[selectedAddressIndex]?.id
        ) {
            alert("Musíte vybrat doručovací adresu.");
            return;
        }

        if (!isValidDeliveryDate(deliveryDate)) {
            alert("Zvolené datum doručení musí být mezi 2 a 14 dny od dneška.");
            return;
        }

        const addressId = addresses[selectedAddressIndex].id;

        axios.post(
            `${CONFIRM_ORDER_URL}?addressId=${addressId}&deliveryDate=${deliveryDate}`,
            {},
            {headers: {Authorization: `Bearer ${token}`}}
        ).then(() => {
            alert("Objednávka byla úspěšně vytvořena.");
            navigate("/orders");
        }).catch(err => {
            if (err.response?.status === 409) {
                alert("Některé produkty nejsou dostupné v požadovaném množství.");
            } else {
                alert("Chyba při vytváření objednávky.");
            }
        });
    };

    if (!token) {
        return (
            <Container className="py-5">
                <Alert variant="warning">Tato stránka je přístupná pouze přihlášeným uživatelům.</Alert>
            </Container>
        );
    }

    if (!user) return <Spinner animation="border" className="d-block mx-auto mt-5"/>;

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (

        <Container className="py-5">
            <h2 className="mb-4 text-center">Rekapitulace objednávky</h2>

            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

            <Row>
                <Col md={6}>
                    <Card className="mb-4 p-3 shadow-sm">
                        <h5>Údaje zákazníka</h5>
                        <p><strong>Jméno:</strong> {user.firstName} {user.lastName}</p>
                        <p><strong>Telefon:</strong> {user.phoneNumber}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                    </Card>

                    <Card className="p-3 shadow-sm mb-3">
                        <Form.Group className="mb-3">
                            <Form.Label>Vyberte doručovací adresu</Form.Label>
                            {addresses.length > 0 ? (
                                <Form.Select
                                    value={selectedAddressIndex}
                                    onChange={(e) => setSelectedAddressIndex(parseInt(e.target.value))}
                                >
                                    <option value={-1}>-- Vyberte adresu --</option>
                                    {addresses.map((addr, idx) => (
                                        <option key={addr.id} value={idx}>
                                            {`${addr.street} ${addr.houseNumber}, ${addr.zipCode} ${addr.city}, ${addr.country}`}
                                        </option>
                                    ))}
                                </Form.Select>
                            ) : (
                                <div className="text-muted">Nemáte žádné uložené adresy.</div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Zvolte datum doručení</Form.Label>
                            <Form.Control
                                type="date"
                                value={deliveryDate}
                                onChange={(e) => setDeliveryDate(e.target.value)}
                                min={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                                max={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                            />
                        </Form.Group>

                        {addresses.length > 0 && (
                            <Button
                                variant="outline-primary"
                                onClick={() => {
                                    setShowNewAddressForm(prev => !prev);
                                    setActiveStep(1);
                                }}
                            >
                                {showNewAddressForm ? "Zavřít formulář" : "Přidat novou adresu"}
                            </Button>
                        )}
                    </Card>

                    {showNewAddressForm && (
                        <>
                            {activeStep === 1 && <StepSuggest onSelected={onSelected}/>}
                            {activeStep === 2 && (
                                <StepForm
                                    formData={formData}
                                    setFormData={setFormData}
                                    onPrevious={() => setActiveStep(1)}
                                    onNext={() => setActiveStep(3)}
                                />
                            )}
                            {activeStep === 3 && (
                                <StepCheck
                                    formData={formData}
                                    setFinalResult={setFinalResult}
                                    onPrevious={() => setActiveStep(2)}
                                    onNext={() => setActiveStep(4)}
                                />
                            )}
                            {activeStep === 4 && (
                                <StepSummary
                                    formData={formData}
                                    finalResult={finalResult}
                                    onRestart={onRestart}
                                    onAddressAdded={handleAddressAdded}
                                />
                            )}
                        </>
                    )}
                </Col>

                <Col md={6}>
                    <Card className="p-3 shadow-sm mb-3">
                        <h5>Souhrn objednávky</h5>
                        {cartItems.length === 0 ? (
                            <Alert variant="info">Košík je prázdný.</Alert>
                        ) : (
                            <>
                                {cartItems.map((item, index) => (
                                    <div key={index} className="border-bottom pb-2 mb-2">
                                        <strong>{item.productName}</strong>
                                        <div className="small text-muted">
                                            {item.quantity} ks × {item.price} Kč = {item.quantity * item.price} Kč
                                        </div>
                                    </div>
                                ))}
                                <h5 className="mt-3">Celkem: {total} Kč</h5>
                                <Button variant="success" className="mt-3 w-100" onClick={handleOrderConfirm}>
                                    Potvrdit objednávku
                                </Button>
                            </>
                        )}
                    </Card>


                </Col>
            </Row>
        </Container>
    );
};

export default Checkout;