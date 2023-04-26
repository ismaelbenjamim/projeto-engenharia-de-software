import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Form, Button, InputGroup } from '@themesberg/react-bootstrap';
import api from "../../pages/authentication/api";
import { getToken } from "../../pages/authentication/auth";
import { useHistory } from "react-router-dom";


export const UsuarioAlterarSenha = () => {
  const [senha_antiga, setSenhaAntiga] = useState("");
  const [senha_nova, setSenhaNova] = useState("");
  const [senha_nova_confirmacao, setSenhaNovaConfirmacao] = useState("");

  const [errors, setError] = useState([]);
  const [success, setSuccess] = useState("");

  const history = useHistory();

  const postData = () => {
    if (senha_nova == senha_nova_confirmacao) {
      api.post("usuarios/trocar-senha/", {
        "senha_antiga": senha_antiga,
        "senha_nova": senha_nova,
      }).then(function (response) {
        var element = document.getElementById("form");
        element.reset();
        setSuccess('Senha alterada com sucesso!')
      }).catch(function(errors) {
        setError(errors.response.data);
      })
    } else {
      setError({
        "senha": ["A senha e a confirmação de senha não estão iguais."]
      });
    }
  }
  return (
    <Card border="light" className="bg-white shadow-sm mb-4 mt-4">
      <Card.Body>
      <Button variant="outline-primary" onClick={(e) => history.push("/")} size="sm" className="mb-3"><FontAwesomeIcon icon={faArrowLeft} /> Voltar</Button>
      <h5 className="mb-4">Alteração de senha</h5>
        <Form id="form" method="post" onSubmit={(e) => { postData(); e.preventDefault(); }}>
        <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="senha_antiga">
                <Form.Label>Senha atual</Form.Label>
                <Form.Control required type="password" placeholder="Senha atual" onChange={(e) => setSenhaAntiga(e.target.value)} />
              </Form.Group>
            </Col>
        </Row>
        <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="senha_nova">
                <Form.Label>Nova senha</Form.Label>
                <Form.Control required type="password" placeholder="Nova senha" onChange={(e) => setSenhaNova(e.target.value)} />
              </Form.Group>
            </Col>
        </Row>
        <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="senha_nova">
                <Form.Label>Confirmação da nova senha</Form.Label>
                <Form.Control required type="password" placeholder="Nova senha" onChange={(e) => setSenhaNovaConfirmacao(e.target.value)} />
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
