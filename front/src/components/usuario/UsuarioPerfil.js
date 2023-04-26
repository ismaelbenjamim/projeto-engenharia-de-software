import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Form, Button, InputGroup } from '@themesberg/react-bootstrap';
import api from "../../pages/authentication/api";
import { getToken, getUUID } from "../../pages/authentication/auth";
import { useHistory } from "react-router-dom";


export const UsuarioPerfil = () => {
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");

  const [errors, setError] = useState([]);
  const [success, setSuccess] = useState("");

  const history = useHistory();

  const postData = () => {
    api.patch("usuarios/usuario/" + getUUID() + "/", {
      "username": email,
      "email": email,
      "first_name": first_name,
      "last_name": last_name
    }).then(function (response) {
      setSuccess('Atualizações realizadas com sucesso!')
    }).catch(function(errors) {
      setError(errors.response.data);
    })
  }
  useEffect(() => {
    api.get("usuarios/usuario/" + getUUID() + "/" , {
    }).then(function (response) {
        const data = response.data;
        setEmail(data.email);
        setFirstName(data.first_name);
        setLastName(data.last_name);
    }).catch(function(errors) {
      setError(errors.response.data);
    })
  },[])
  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
      <Button variant="outline-primary" onClick={(e) => history.push("/")} size="sm" className="mb-3"><FontAwesomeIcon icon={faArrowLeft} /> Voltar</Button>
      <h5 className="mb-4">Meu perfil</h5>
        <Form id="form" method="post" onSubmit={(e) => { postData(); e.preventDefault(); }}>
        <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="first_name">
                <Form.Label>Nome</Form.Label>
                <Form.Control type="text" defaultValue={first_name} placeholder="Nome" onChange={(e) => setFirstName(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="last_name">
                <Form.Label>Sobrenome</Form.Label>
                <Form.Control type="text" defaultValue={last_name} placeholder="Sobrenome" onChange={(e) => setLastName(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6} className="mb-3">
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" defaultValue={email} placeholder="E-mail do usuário" onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <p className="mb-3">{errors ? Object.entries(errors).map(([key, value]) => (<li key={key}>{value}</li>)) : null}</p>
          </Row>
          <p className="mb-3">{success}</p>
          <div className="mt-3">
            <Button variant="primary" type="submit">Salvar</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
