import { useEffect, useState } from 'react';
import { IFormData, IResponseItem } from './../../interfaces';
import { runGeocode, runSuggest } from './../../util';
import { Container, Button, ListGroup, Spinner, Alert } from 'react-bootstrap';

interface StepCheckProps {
    formData: IFormData;
    setFinalResult: React.Dispatch<React.SetStateAction<IResponseItem | null>>; // updated
    onPrevious: () => void;
    onNext: () => void;
}

export default function StepCheck({
                                      formData,
                                      setFinalResult,
                                      onPrevious,
                                      onNext,
                                  }: StepCheckProps) {
    const [geocode, setGeocode] = useState<IResponseItem[]>([]);
    const [suggestions, setSuggestions] = useState<IResponseItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasAttempted, setHasAttempted] = useState<boolean>(false);

    useEffect(() => {
        const hasInput = formData.street || formData.houseNumber || formData.city || formData.zip || formData.country;

        setGeocode([]);
        setSuggestions([]);
        setHasAttempted(false);

        if (!hasInput) {
            return;
        }

        setIsLoading(true);
        runGeocode('cs', formData, (results) => {
            setGeocode(results);
            setIsLoading(false);
            setHasAttempted(true);
        });
    }, [formData]);

    useEffect(() => {
        if (geocode.length === 1) {
            setFinalResult(geocode[0]);
            onNext();
        } else if (geocode.length > 1 || hasAttempted) {
            const query = `${formData.street} ${formData.houseNumber}, ${formData.city}, ${formData.zip}, ${formData.country}`;
            runSuggest('cs', query, setSuggestions);
        }
    }, [geocode, hasAttempted]);

    return (
        <Container className="my-3">
            {isLoading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Načítání...</span>
                    </Spinner>
                </div>
            ) : !hasAttempted ? (
                <>
                    <Alert variant="warning">
                        Nezadali jste žádné údaje. Prosím, vyplňte adresu.
                    </Alert>
                    <div className="d-flex justify-content-between my-3">
                        <Button variant="secondary" onClick={onPrevious}>
                            Zpět na zadání
                        </Button>
                    </div>
                </>
            ) : geocode.length === 0 ? (
                <>
                    <Alert variant="warning">
                        Adresu se nepodařilo dohledat.
                    </Alert>
                    <div className="d-flex justify-content-between my-3">
                        <Button variant="secondary" onClick={onPrevious}>
                            Zpět na zadání
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <Alert variant="warning">
                        Vyhledávání nevrátilo přesný výsledek.
                    </Alert>

                    <div className="d-flex justify-content-between my-3">
                        <Button variant="secondary" onClick={onPrevious}>
                            Zpět na zadání
                        </Button>
                        <Button variant="primary" onClick={onNext}>
                            Pokračovat, adresa je určitě správně
                        </Button>
                    </div>

                    {suggestions.length > 0 && (
                        <>
                            <h5>Nemysleli jste náhodou:</h5>
                            <ListGroup>
                                {suggestions.slice(0, 5).map((item) => (
                                    <ListGroup.Item
                                        key={item.label + item.position.lon + item.position.lat}
                                        className="d-flex justify-content-between align-items-center"
                                    >
                                        <div>
                                            <strong>{item.name}</strong> ({item.location})
                                        </div>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => {
                                                setFinalResult(item);
                                                onNext();
                                            }}
                                        >
                                            Vybrat
                                        </Button>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </>
                    )}
                </>
            )}
        </Container>
    );
}
