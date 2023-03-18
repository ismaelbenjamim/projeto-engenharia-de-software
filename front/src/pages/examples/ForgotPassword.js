
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Card, Button, Container, InputGroup } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';

import { Routes } from "../../routes";


export default () => {
  return (
    <main>
      <section className="vh-lg-100 mt-4 mt-lg-0 bg-soft d-flex align-items-center">
        <Container>
          <Row className="justify-content-center">
            <p className="text-center">
              <Card.Link as={Link} to={Routes.Signin.path} className="text-gray-700">
                <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Volte para a área de Login
            </Card.Link>
            </p>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="signin-inner my-3 my-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <h3>Esqueceu sua senha?</h3>
                <p className="mb-4">Não se assuste! Insira seu nome de usuário que enviaremos uma nova</p>
                <Form>
                  <div className="mb-4">
                    <Form.Label htmlFor="email">Seu nome de usuário</Form.Label>
                    <InputGroup id="username">
                      <Form.Control required autoFocus type="username" placeholder="Username" />
                    </InputGroup>
                  </div>
                  <Button variant="primary" type="submit" className="w-100">
                    Recuperar a senha
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
