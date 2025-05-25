import {IFormData} from './../../interfaces';
import {ChangeEvent, Dispatch, SetStateAction} from 'react';
import {Form, Button, Row, Col, Container} from 'react-bootstrap';

interface IStepFormProps {
    formData: IFormData;
    setFormData: Dispatch<SetStateAction<IFormData>>;
    onPrevious: () => void;
    onNext: () => void;
}

export default function StepForm({
                                     formData,
                                     setFormData,
                                     onPrevious,
                                     onNext,
                                 }: IStepFormProps) {
    const onChange = function (event: ChangeEvent<HTMLInputElement>) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <Container className="px-0">
            <Form.Group className="mb-3">
                <Form.Label
                    style={{fontWeight: 600, fontSize: '1.15rem', textAlign: 'left', display: 'block'}}
                >
                    Zkontrolujte/zadejte adresu
                </Form.Label>
            </Form.Group>
            <Form>
                <Row className="mb-3">
                    <Col md={8}>
                        <Form.Group controlId="formStreet">
                            <Form.Label style={{textAlign: 'left', display: 'block'}}>Ulice</Form.Label>
                            <Form.Control
                                name="street"
                                value={formData.street}
                                onChange={onChange}
                                placeholder="Např. Dlouhá"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formHouseNumber">
                            <Form.Label style={{textAlign: 'left', display: 'block'}}>Číslo domu</Form.Label>

                            <Form.Control
                                name="houseNumber"
                                value={formData.houseNumber}
                                onChange={onChange}
                                placeholder="Např. 123"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="formCity">
                            <Form.Label style={{textAlign: 'left', display: 'block'}}>Město/obec</Form.Label>
                            <Form.Control
                                name="city"
                                value={formData.city}
                                onChange={onChange}
                                placeholder="Např. Praha"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="formZip">
                            <Form.Label style={{textAlign: 'left', display: 'block'}}>PSČ</Form.Label>
                            <Form.Control
                                name="zip"
                                value={formData.zip}
                                onChange={onChange}
                                placeholder="Např. 11000"
                                autoComplete="postal-code"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="formCountry">
                            <Form.Label style={{textAlign: 'left', display: 'block'}}>Stát</Form.Label>
                            <Form.Control
                                name="country"
                                value={formData.country}
                                onChange={onChange}
                                placeholder="Např. Česko"
                                autoComplete="country-name"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <div className="d-flex justify-content-between mt-4">
                    <Button variant="secondary" onClick={onPrevious}>
                        Zpět
                    </Button>
                    <Button variant="primary" onClick={onNext}>
                        Potvrdit adresu
                    </Button>
                </div>
            </Form>
        </Container>
    );
}