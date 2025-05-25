import {useEffect, useState} from 'react';
import axios from 'axios';
import Signup from './Signup';
import {Button, Form, Container, Row, Col, Card, Alert} from 'react-bootstrap';
import {IFormData, IResponseItem} from './../interfaces';
import {EMPTY_MAP_FORM} from '../constants.ts';
import {PROFILE_CHANGE_URL, PROFILE_GET_INFO_URL, PROFILE_GET_ADDRESS_URL} from '../constants';
import {User, EMPTY_USER, Address} from '../interfaces';

import StepSuggest from './AddressUtils/StepSuggest';
import StepForm from './AddressUtils/StepForm';
import StepCheck from './AddressUtils/StepCheck';
import StepSummary from './AddressUtils/StepSummary';


const Profile = () => {
    const [user, setUser] = useState<User>(EMPTY_USER);
    const [updatedUser, setUpdatedUser] = useState<User>(EMPTY_USER);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [activeStep, setActiveStep] = useState(1);
    const [finalResult, setFinalResult] = useState<IResponseItem | null>(null);
    const [formData, setFormData] = useState<IFormData>(EMPTY_MAP_FORM);
    const [addresses, setAddresses] = useState<Address[]>([]);

    const isValidPhoneNumber = /^\d{9}$/.test(updatedUser?.phoneNumber ?? "");

    useEffect(() => {
        const token = localStorage.getItem("authTokenResponse");

        if (!token) return;

        const headers = {Authorization: `Bearer ${token}`};

        axios.get(PROFILE_GET_INFO_URL, {headers})
            .then(res => {
                setUser(res.data);
                setUpdatedUser(res.data);

                return axios.get(PROFILE_GET_ADDRESS_URL, {headers});
            })
            .then(res => {
                setAddresses(res.data || []);
            })
            .catch(err => {
                setError("Nepodařilo se načíst profil nebo adresy.");
                console.warn("Adresy nejsou dostupné nebo nenalezeny:", err);
            });
    }, []);

    const token = localStorage.getItem("authTokenResponse");
    if (!token) {
        return (
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card className="p-4 shadow-sm">
                            <Signup/>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    const handleChange = (e: any) => {
        const {name, value} = e.target;
        setUpdatedUser(prev => prev ? {...prev, [name]: value} : EMPTY_USER);
        setInfo(null);
    };


    const handleSave = () => {
        if (!user) return;

        if (!isValidPhoneNumber) {
            setError("Telefonní číslo musí mít přesně 9 číslic.");
            return;
        }

        const changes: any = {};
        let somethingChanged = false;

        const fields: (keyof User)[] = ['firstName', 'lastName', 'phoneNumber'];
        fields.forEach((field) => {
            if (user[field] !== updatedUser[field]) {
                changes[field] = updatedUser[field];
                somethingChanged = true;
            }
        });

        if (!somethingChanged) {
            setInfo("Žádné změny k uložení.");
            return;
        }

        const token = localStorage.getItem("authTokenResponse");
        axios.put(PROFILE_CHANGE_URL, changes, {
            headers: {Authorization: `Bearer ${token}`}
        }).then(res => {
            setUser(res.data);
            setInfo("Změny byly uloženy.");
            setError(null);
        }).catch(err => {
            setError("Nepodařilo se uložit změny.");
            console.error(err);
        });
    };

    const handleAddressAdded = (newAddr: any) => {
        if (newAddr) {
            setAddresses(prev => [...prev, newAddr]);
        } else {
            const token = localStorage.getItem("authTokenResponse");
            axios.get(PROFILE_GET_ADDRESS_URL, {
                headers: {Authorization: `Bearer ${token}`}
            }).then(res => setAddresses(res.data || []));
        }
    };

    const onSelected = (suggestion: IResponseItem) => {
        if (suggestion?.regionalStructure) {
            const streetIndex = suggestion.regionalStructure.findIndex(region => region.type === 'regional.address');

            setFormData({
                street: streetIndex === -1
                    ? suggestion.regionalStructure.find(region => region.type === 'regional.street')?.name || ''
                    : suggestion.regionalStructure.length > streetIndex
                        ? suggestion.regionalStructure[streetIndex + 1].name
                        : '',
                houseNumber: suggestion.regionalStructure.find(region => region.type === 'regional.address')?.name || '',
                city: suggestion.regionalStructure.find(region => region.type === 'regional.municipality')?.name || '',
                zip: suggestion.zip || '',
                country: suggestion.regionalStructure.find(region => region.type === 'regional.country')?.name || '',
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


    return (
        <Container className="py-5">
            <h2 className="mb-4 text-center">Můj profil</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {info && <Alert variant="info">{info}</Alert>}

            <Row>
                {/* User Info Column */}
                <Col md={6}>
                    <Card className="mb-4 shadow-sm border-0">
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={updatedUser.email}
                                        disabled
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Jméno</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={updatedUser.firstName || ""}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Příjmení</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={updatedUser.lastName || ""}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Telefonní číslo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phoneNumber"
                                        value={updatedUser.phoneNumber || ""}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-center mt-4">
                                    <Button variant="primary" onClick={handleSave}>
                                        Uložit změny
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Address Column */}
                <Col md={6}>
                    <Card className="mb-4 shadow-sm border-0">
                        <Card.Body>
                            <Form.Group className="mb-4">
                                <Form.Label>Uložené adresy</Form.Label>
                                {addresses.length > 0 ? (
                                    <Form.Select>
                                        {addresses.map((addr) => (
                                            <option key={addr.id}>
                                                {`${addr.street} ${addr.houseNumber}, ${addr.zipCode} ${addr.city}, ${addr.country}`}
                                            </option>
                                        ))}
                                    </Form.Select>
                                ) : (
                                    <div className="text-muted">Zatím nejsou přidány žádné adresy</div>
                                )}
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Adresa</Form.Label>
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
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};


export default Profile;
