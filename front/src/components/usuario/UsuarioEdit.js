import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Form, Button, InputGroup } from '@themesberg/react-bootstrap';
import api from "../../pages/authentication/api";
import { getToken } from "../../pages/authentication/auth";
import { useHistory } from "react-router-dom";


export const UsuarioEdit = () => {
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("colaborador");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setError] = useState([]);
  const [success, setSuccess] = useState("");

  const history = useHistory();

  const postData = () => {
    api.patch("usuarios/usuario/" + obj_uuid + "/", {
      "username": email,
      "email": email,
      "cargo": cargo,
      "first_name": first_name,
      "last_name": last_name,
      "password": password  
    }).then(function (response) {
      setSuccess('Usuário alterado com sucesso!')
    }).catch(function(errors) {
      setError(errors.response.data);
    })
  }
  const queryParameters = new URLSearchParams(window.location.search)
  const obj_uuid = queryParameters.get("uuid")
  useEffect(() => {
    api.get("usuarios/usuario/" + obj_uuid + "/" , {
    }).then(function (response) {
        const data = response.data;
        setEmail(data.email);
        setCargo(data.cargo);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setPassword(data.password);
    }).catch(function(errors) {
      setError(errors.response.data);
    })
  },[])
  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
      <Button variant="outline-primary" onClick={(e) => history.push("/usuarios/list")} size="sm" className="mb-3"><FontAwesomeIcon icon={faArrowLeft} /> Voltar</Button>
      <h5 className="mb-4">Edição de Usuário</h5>
        <Form method="post" onSubmit={(e) => { postData(); e.preventDefault(); }}>
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
            <Col sm={6} className="mb-3">
              <Form.Group id="cargo">
                <Form.Label>Cargo</Form.Label>
                <Form.Select defaultValue={cargo} onChange={(e) => setCargo(e.target.value)}>
                  <option value={"colaborador"}>Colaborador</option>
                  <option value={"coordenador"}>Coordenador</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6} className="mb-3">
              <Form.Group id="password">
                <Form.Label>Senha</Form.Label>
                <Form.Control type="password" placeholder="Senha do usuário" onChange={(e) => setPassword(e.target.value)} />
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
