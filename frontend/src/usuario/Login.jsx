import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    function postData() {
        axios.post('http://127.0.0.1:8000/api/login/', {
            "username": username,
            "password": password,
        },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(function (response) {
                navigate("/dashboard");
            })
            .catch(function (error) {
                console.error(error)
            });
    }
    function callForm(e) {
        postData();
        e.preventDefault()
    }
    return (
        <ThemeProvider
            breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
            minBreakpoint="xxs">

            <Container>
                <Row className="vh-100 d-flex justify-content-center align-items-center">
                    <Col md={8} lg={5} xs={12}>
                        <Card className="shadow rounded">
                            <Card.Body className='m-5'>
                                <div className="mb-3">
                                    <h2 className="fw-bold mb-2 text-center">IVH Iventário</h2>
                                    <p className="mb-5 text-center">Autenticação de usuário</p>
                                    <div className="mb-3">
                                        <Form method='post' onSubmit={(e) => { callForm(e) }}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="text-center">
                                                    Usuário
                                                </Form.Label>
                                                <Form.Control type="text" name='username' id='username' onChange={(e) => setUsername(e.target.value)} placeholder="Digite seu usuário" required />
                                            </Form.Group>

                                            <Form.Group
                                                className="mb-3"
                                            >
                                                <Form.Label>Senha</Form.Label>
                                                <Form.Control type="password" name='password' id='password' onChange={(e) => setPassword(e.target.value)} placeholder="Digite a senha" required />
                                            </Form.Group>
                                            <Form.Group
                                                className="mb-3"
                                                controlId="formBasicCheckbox"
                                            >
                                                <p className="small">
                                                    <a className="text-primary" href="#!">
                                                        Esqueceu a senha?
                                                    </a>
                                                </p>
                                            </Form.Group>
                                            <div className="d-grid">
                                                <Button variant="primary" type="submit">
                                                    Login
                                                </Button>
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

        </ThemeProvider>
    );
}