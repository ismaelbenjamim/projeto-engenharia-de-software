
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Card, Button, FormCheck, Container, InputGroup } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';

import { Routes } from "../../routes";
import { useHistory } from 'react-router-dom';
import BgImage from "../../assets/img/illustrations/signin.svg";
import { login } from "../authentication/auth";
import api from "../authentication/api";


export default () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');
  const history = useHistory();
  function postData() {
    api.post('login/', {
      "username": username,
      "password": password,
    },).then(function (response) {
      login(response.data.token);
      history.push("/dashboard");
    }).catch(function (error) {
      console.log(error);
      if (error.status !== 200) {
        setErrors("E-mail ou senha estão incorretos.");
      }
    });
  }
  function callForm(e) {
      postData();
      e.preventDefault()
  }
  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">IVH Inventário</h3>
                </div>
                <Form className="mt-4" method='post' onSubmit={(e) => { callForm(e) }}>
                  <Form.Group id="username" className="mb-4">
                    <Form.Label>Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control autoFocus required type="email" placeholder="Email" onChange={(e) => setUsername(e.target.value)} />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Group id="password" className="mb-4">
                      <Form.Label>Senha</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUnlockAlt} />
                        </InputGroup.Text>
                        <Form.Control required type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />
                      </InputGroup>
                    </Form.Group>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      {/* <Form.Check type="checkbox">
                        <FormCheck.Input id="defaultCheck5" className="me-2" />
                        <FormCheck.Label htmlFor="defaultCheck5" className="mb-0">Lembre-se</FormCheck.Label>
                      </Form.Check> */}
                      <Card.Link as={Link} to={Routes.ForgotPassword.path} className="small text-end">Esqueceu a senha?</Card.Link>
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Text>{errors}</Form.Text>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">
                    Entrar
                  </Button>
                </Form>

                {/* <div className="d-flex justify-content-center align-items-center mt-4">
                  <span className="fw-normal">
                    Não é registrado?
                    <Card.Link as={Link} to={Routes.Signup.path} className="fw-bold">
                      {` Criar uma conta `}
                    </Card.Link>
                  </span>
                </div> */}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
