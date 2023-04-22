import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Form, Button, InputGroup } from '@themesberg/react-bootstrap';
import api from "../pages/authentication/api";
import { getToken } from "../pages/authentication/auth";
import { useHistory } from "react-router-dom";


export const EditEntrada = () => {
  const [codigo, setCodigo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [grupo, setGrupo] = useState("");
  const [is_bem_de_consumo, setIsBemConsumo] = useState("");
  const [errors, setError] = useState([]);
  const [success, setSuccess] = useState("");

  const history = useHistory();

  const postData = () => {
    api.put("itens/item/" + item_uuid + '/', {
      "codigo": codigo,
      "descricao": descricao,
      "grupo": grupo,
      "is_bem_de_consumo": is_bem_de_consumo
    }).then(function (response) {
      setSuccess('Item alterado com sucesso!')
    }).catch(function(errors) {
      console.log(errors.data)
      setError(errors.data);
    })
  }
  const queryParameters = new URLSearchParams(window.location.search)
  const item_uuid = queryParameters.get("item")
  useEffect(() => {
    api.get("itens/item/" + item_uuid + "/" , {
    }).then(function (response) {
        const data = response.data;
        setCodigo(data.cod);
        setDescricao(data.descricao);
        setIsBemConsumo(data.is_bem_de_consumo);
        setGrupo(data.grupo);
    }).catch(function(errors) {
      console.log(errors.data)
      setError(errors.data);
    })
  },[])
  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Edição de Estoque</h5>
        <Form method="post" onSubmit={(e) => { postData(); e.preventDefault(); }}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="codigo">
                <Form.Label>Código</Form.Label>
                <Form.Control defaultValue={codigo} required type="text" placeholder="Código" onChange={(e) => setCodigo(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="descricao">
                <Form.Label>Descrição</Form.Label>
                <Form.Control defaultValue={descricao} required type="text" placeholder="Descrição" onChange={(e) => setDescricao(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="grupo">
                <Form.Label>Grupo</Form.Label>
                <Form.Control defaultValue={grupo} required type="text" placeholder="Grupo" onChange={(e) => setGrupo(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6} className="mt-5">               
              <Form.Check defaultValue={is_bem_de_consumo} label="É bem de consumo?" id="is_bem_de_consumo" htmlFor="is_bem_de_consumo" onChange={(e) => setIsBemConsumo(!is_bem_de_consumo)} />             
            </Col>
          </Row>
          <p className="mb-3">{errors}</p>
          <p className="mb-3">{success}</p>
          <div className="mt-3">
            <Button variant="primary" type="submit">Salvar</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
