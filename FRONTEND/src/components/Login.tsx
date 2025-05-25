import {useEffect, useState} from 'react';
import {Form, Button, Container, Row, Col, Alert, Card} from 'react-bootstrap';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {LOGIN_TOKEN_URL} from '../constants.ts';

const Login = (props: any) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [validEmail, setValidEmail] = useState(true);
    const [validPassword, setValidPassword] = useState(true);

    const [loginButtonClicked, setLoginButtonClicked] = useState(false);
    const [loginError, setLoginError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        setValidEmail(email.trim().length > 0);
        setValidPassword(password.trim().length > 0);
    }, [email, password]);

    function login(e: any) {
        e.preventDefault();
        setLoginButtonClicked(true);
        if (!validEmail || !validPassword) {
            return;
        }

        axios.post(LOGIN_TOKEN_URL, {email, password})
            .then(response => {
                const token = response.data.token;
                localStorage.setItem("authTokenResponse", token);
                props.setAuthTokenResponse(token);
                setLoginError("");
                navigate("/profile");
            })
            .catch(error => {
                console.error("Login error:", error);
                const message = error.response?.data || "Chyba při přihlášení.";
                setLoginError(message);
            });

        setLoginButtonClicked(false);
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{minHeight: '90vh'}}>
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={4}>
                    <Card className="p-4 shadow-sm border-0">
                        <h4 className="text-center mb-4">Přihlášení</h4>
                        <Form onSubmit={login}>
                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Zadejte email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {!validEmail && loginButtonClicked && (
                                    <Alert variant="danger" className="mt-2">Email je povinný.</Alert>
                                )}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formPassword">
                                <Form.Label>Heslo</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Zadejte heslo"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {!validPassword && loginButtonClicked && (
                                    <Alert variant="danger" className="mt-2">Heslo je povinné.</Alert>
                                )}
                            </Form.Group>

                            {loginError && (
                                <Alert variant="danger" className="mb-3">{loginError}</Alert>
                            )}

                            <Button type="submit" variant="primary" className="w-100">
                                Přihlásit se
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
