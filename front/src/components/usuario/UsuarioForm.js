
import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Form, Button, InputGroup, Modal } from '@themesberg/react-bootstrap';
import api from "../../pages/authentication/api";
import { getToken } from "../../pages/authentication/auth";
import { useHistory } from "react-router-dom";


export const UsuarioForm = () => {
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("colaborador");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setError] = useState([]);

  const [showDefault, setShowDefault] = useState(false);
  const handleClose = () => setShowDefault(false);

  const history = useHistory();

  const getModal = () => {
    return (
    <Modal as={Modal.Dialog} centered show={showDefault} onHide={handleClose}>
    <Modal.Header>
      <Modal.Title className="h6">IVH Iventário</Modal.Title>
      <Button variant="close" aria-label="Close" onClick={handleClose} />
    </Modal.Header>
    <Modal.Body>
      <h4>Usuário cadastrado com sucesso!<br/>Um email de acesso para o usuário foi enviado!</h4>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="link" className="text-gray ms-auto" onClick={handleClose}>
        Sair
      </Button>
    </Modal.Footer>
    </Modal>
    );
  }

  const postData = () => {
    api.post("usuarios/cadastro/", {
      "username": email,
      "email": email,
      "cargo": cargo,
      "first_name": first_name,
      "last_name": last_name,
      "password": password
    }
    ).then(function (response) {
      var element = document.getElementById("form");
      element.reset();
      setShowDefault(true);
    }).catch(function(errors) {
      setError(errors.response.data);
    })
  }

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Criação de Usuário</h5>
        <Form id="form" method="post" onSubmit={(e) => { postData(); e.preventDefault(); }}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="first_name">
                <Form.Label>Nome</Form.Label>
                <Form.Control type="text" placeholder="Nome" onChange={(e) => setFirstName(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="last_name">
                <Form.Label>Sobrenome</Form.Label>
                <Form.Control type="text" placeholder="Sobrenome" onChange={(e) => setLastName(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6} className="mb-3">
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control required type="text" placeholder="E-mail do usuário" onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
            </Col>
            <Col sm={6} className="mb-3">
              <Form.Group id="cargo">
                <Form.Label>Cargo</Form.Label>
                <Form.Select onChange={(e) => setCargo(e.target.value)}>
                  <option defaultValue value={"colaborador"}>Colaborador</option>
                  <option value={"coordenador"}>Coordenador</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6} className="mb-3">
              <Form.Group id="password">
                <Form.Label>Senha</Form.Label>
                <Form.Control required type="password" placeholder="Senha do usuário" onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <p className="mb-3">{errors ? Object.entries(errors).map(([key, value]) => (<li key={key}>{value}</li>)) : null}</p>
          </Row>
          {getModal()}
          <div className="mt-3">
            <Button variant="primary" type="submit">Salvar</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};