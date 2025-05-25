import {IFormData, IResponseItem} from './../../interfaces';
import {Container, Alert, Button, Row, Col} from 'react-bootstrap';
import InfoMap from './InfoMap';
import axios from "axios";

interface IStepSummaryProps {
    formData: IFormData;
    finalResult: IResponseItem | null;
    onRestart: () => void;
    onAddressAdded: (newAddress: any) => void;
}

export default function StepSummary({
                                        formData,
                                        finalResult,
                                        onRestart,
                                        onAddressAdded,
                                    }: IStepSummaryProps) {
    const hasValidCoords =
        finalResult &&
        finalResult.position &&
        typeof finalResult.position.lat === 'number' &&
        typeof finalResult.position.lon === 'number';

    const handleConfirm = () => {
        const token = localStorage.getItem("authTokenResponse");
        if (!finalResult || !finalResult.position) return;

        const addressPayload = {
            street: formData.street,
            houseNumber: formData.houseNumber,
            city: formData.city,
            zipCode: formData.zip,
            country: formData.country,
        };
        console.log("Sending address to backend:", addressPayload);

        axios.post("http://localhost:8081/api/address", addressPayload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                alert("Adresa byla úspěšně uložena.");
                onAddressAdded(null);
            })
            .catch((err) => {
                console.error(err);
                if (err.response?.status === 409) {
                    alert("Tato adresa již byla přidána.");
                } else {
                    alert("Nepodařilo se uložit adresu.");
                }
            });
    };

    return (
        <Container className="my-2">
            {finalResult ? (
                <>
                    <Alert variant="success">
                        <strong>Dle zadání jsme našli tuto adresu:</strong>
                    </Alert>

                    {hasValidCoords ? (
                        <InfoMap
                            latitude={finalResult.position.lat}
                            longitude={finalResult.position.lon}
                            lang="cs"
                        />
                    ) : (
                        <Alert variant="warning">Nelze zobrazit mapu – chybí souřadnice.</Alert>
                    )}

                    <Row className="mt-4 justify-content-center">
                        <Col xs="auto">
                            <Button variant="primary" onClick={handleConfirm}>
                                Potvrdit adresu
                            </Button>
                        </Col>
                        <Col xs="auto">
                            <Button variant="outline-secondary" onClick={onRestart}>
                                Vybrat jinou adresu
                            </Button>
                        </Col>
                    </Row>
                </>
            ) : (
                <>
                    <Alert variant="danger">
                        <strong>Uživatel vyplnil údaje, ale takovou adresu jsme nenašli.</strong>
                    </Alert>

                    <div className="mb-3">
						<pre className="mb-0" style={{whiteSpace: 'pre-wrap'}}>
							{JSON.stringify(formData, null, 2)}
						</pre>
                    </div>

                    <div className="text-center mt-4">
                        <Button variant="secondary" onClick={onRestart}>
                            Vybrat jinou adresu
                        </Button>
                    </div>
                </>
            )}
        </Container>
    );
}
