import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Form, Button, Container, Row, Col, Alert, Card} from "react-bootstrap";
import axios from "axios";
import {SIGNUP_TOKEN_URL} from "../constants";
import {RegistrationDTO} from "../interfaces";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [signupButtonClicked, setSignupButtonClicked] = useState(false);
    const [responseMsg, setResponseMsg] = useState("");

    const navigate = useNavigate();

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPassword = /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    const isMatchingPasswords = password === confirmPassword;
    const isValidFirstName = firstName.trim().length > 0;
    const isValidLastName = lastName.trim().length > 0;
    const isValidPhoneNumber = /^\d{9}$/.test(phoneNumber);

    const isEmailEmpty = email.trim().length === 0;
    const isPasswordEmpty = password.trim().length === 0;
    const isFormValid = isValidEmail && isValidPassword && isMatchingPasswords && isValidFirstName && isValidLastName && isValidPhoneNumber;

    function signup(e: any) {
        e.preventDefault();
        setSignupButtonClicked(true);

        if (!isFormValid) return;

        const registrationDTO: RegistrationDTO = {
            email: email.trim(),
            password,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phoneNumber: phoneNumber.trim(),
        };

        axios.post(SIGNUP_TOKEN_URL, registrationDTO)
            .then(response => {
                setResponseMsg(response.data);
                navigate("/login");
            })
            .catch(error => {
                try {
                    setResponseMsg(error.response.data);
                } catch {
                    setResponseMsg("Nelze se připojit k autentizačnímu serveru.");
                }
            });

        setSignupButtonClicked(false);
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{minHeight: '80vh'}}>
            <Row className="w-100 justify-content-center">
                <Col>
                    <Card className="border-0 w-100">
                        <h4 className="text-center mb-4">Registrace</h4>
                        <Form onSubmit={signup}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" onChange={(e) => setEmail(e.target.value)}/>
                                {signupButtonClicked && isEmailEmpty && (
                                    <Alert variant="danger" className="mt-2">Email je povinný.</Alert>
                                )}
                                {signupButtonClicked && !isEmailEmpty && !isValidEmail && (
                                    <Alert variant="danger" className="mt-2">Email musí být ve správném formátu (např.
                                        uzivatel@example.com).</Alert>
                                )}                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Heslo</Form.Label>
                                <Form.Control type="password" onChange={(e) => setPassword(e.target.value)}/>
                                {signupButtonClicked && isPasswordEmpty && (
                                    <Alert variant="danger" className="mt-2">Heslo je povinné.</Alert>
                                )}
                                {signupButtonClicked && !isPasswordEmpty && !isValidPassword && (
                                    <Alert variant="danger" className="mt-2">
                                        Heslo musí mít alespoň 8 znaků, obsahovat jedno velké písmeno a jednu číslici.
                                    </Alert>
                                )}                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Potvrďte heslo</Form.Label>
                                <Form.Control type="password" onChange={(e) => setConfirmPassword(e.target.value)}/>
                                {!isMatchingPasswords && signupButtonClicked &&
                                    <Alert variant="danger" className="mt-2">Hesla se neshodují.</Alert>}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Jméno</Form.Label>
                                <Form.Control type="text" onChange={(e) => setFirstName(e.target.value)}/>
                                {!isValidFirstName && signupButtonClicked &&
                                    <Alert variant="danger" className="mt-2">Jméno je povinné.</Alert>}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Příjmení</Form.Label>
                                <Form.Control type="text" onChange={(e) => setLastName(e.target.value)}/>
                                {!isValidLastName && signupButtonClicked &&
                                    <Alert variant="danger" className="mt-2">Příjmení je povinné.</Alert>}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Telefonní číslo</Form.Label>
                                <Form.Control type="text" onChange={(e) => setPhoneNumber(e.target.value)}/>
                                {!isValidPhoneNumber && signupButtonClicked &&
                                    <Alert variant="danger" className="mt-2">Telefonní číslo musí mít 9 číslic (např.
                                        123456789).</Alert>}
                            </Form.Group>

                            {responseMsg && (
                                <Alert
                                    variant={responseMsg === "Uživatele s emailem " + email + " zaregistrován." ? "success" : "danger"}
                                    className="mb-3"
                                >
                                    {responseMsg}
                                </Alert>
                            )}
                            <div className="d-flex flex-column align-items-center">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="mb-3"
                                    style={{minWidth: '180px', maxWidth: '100%'}}
                                >
                                    Registrovat se
                                </Button>

                                <p className="mb-2 text-center">Už máte účet?</p>

                                <Button
                                    variant="outline-secondary"
                                    onClick={() => navigate("/login")}
                                    style={{minWidth: '180px', maxWidth: '100%'}}
                                >
                                    Přihlásit se
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Signup;
