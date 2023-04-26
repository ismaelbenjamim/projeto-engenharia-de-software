import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft, faArrowLeft, faCalendarAlt, faHeart } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Form, Button, InputGroup } from '@themesberg/react-bootstrap';
import api from "../../pages/authentication/api";
import { getToken } from "../../pages/authentication/auth";
import { useHistory } from "react-router-dom";


export const EntradaEdit = () => {
  const [quantidade, setQuantidade] = useState("");
  const [is_doacao, setIsDoacao] = useState(false);
  const [validade, setValidade] = useState("");
  const [val_unit, setValUnit] = useState("");
  const [val_total, setValTotal] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [tipo_unit, setTipoUnit] = useState("");
  const [is_ultimo, setIsUltimo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [item, setItem] = useState("");
  const [doador, setDoador] = useState("");
  const [entrada_pai, setEntradaPai] = useState("");

  const [errors, setError] = useState([]);
  const [success, setSuccess] = useState("");

  const history = useHistory();

  const postData = () => {
    api.post("entradas/entrada-update/", {
      "quantidade": quantidade,
      "is_doacao": is_doacao,
      "validade": validade,
      "val_unit": val_unit,
      "val_total": val_total,
      "fornecedor": fornecedor,
      "tipo_unit": tipo_unit,
      "is_ultimo": is_ultimo,
      "usuario": usuario,
      "item": item,
      "doador": doador,
      "entrada_pai": entrada_pai
    }).then(function (response) {
      setSuccess('Item alterado com sucesso!')
    }).catch(function(errors) {
      setError(errors.response.data);
    })
  }
  const queryParameters = new URLSearchParams(window.location.search)
  const obj_uuid = queryParameters.get("uuid")
  useEffect(() => {
    api.get("entradas/entrada/" + obj_uuid + "/" , {
    }).then(function (response) {
        const data = response.data;
        setQuantidade(data.quantidade);
        setIsDoacao(data.is_doacao);
        setValidade(data.validade);
        setValUnit(data.val_unit);
        setValTotal(data.val_total);
        setFornecedor(data.fornecedor);
        setTipoUnit(data.tipo_unit);
        setIsUltimo(data.is_ultimo);
        setUsuario(data.usuario.uuid);
        setItem(data.item.uuid);
        setDoador(data.doador);
        setEntradaPai(obj_uuid);
    }).catch(function(errors) {
      setError(errors.response.data);
    })
  },[])
  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
      <Button variant="outline-primary" onClick={(e) => history.push("/entrada/list")} size="sm" className="mb-3"><FontAwesomeIcon icon={faArrowLeft} /> Voltar</Button>
      <h5 className="mb-4">Edição de Entrada</h5>
        <Form method="post" onSubmit={(e) => { postData(); e.preventDefault(); }}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="quantidade">
                <Form.Label>Quantidade</Form.Label>
                <Form.Control defaultValue={quantidade} type="text" placeholder="Quantidade" onChange={(e) => setQuantidade(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="validade">
                <Form.Label>Validade</Form.Label>
                <Form.Control defaultValue={validade} type="text" placeholder="Validade" onChange={(e) => setValidade(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="grupo">
                <Form.Label>Valor Unitário</Form.Label>
                <Form.Control defaultValue={val_unit} type="text" placeholder="Valor unitário" onChange={(e) => setValUnit(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="val_total">
                <Form.Label>Valor Total</Form.Label>
                <Form.Control defaultValue={val_total} type="text" placeholder="Valor total" onChange={(e) => setValTotal(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="fornecedor">
                <Form.Label>Valor Unitário</Form.Label>
                <Form.Control defaultValue={fornecedor} type="text" placeholder="Fornecedor" onChange={(e) => setValUnit(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="tipo_unit">
                <Form.Label>Tipo Unitário</Form.Label>
                <Form.Control defaultValue={tipo_unit} type="text" placeholder="Tipo unitário" onChange={(e) => setValTotal(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">               
              <Form.Check checked={is_doacao} label="É doação?" id="is_doacao" htmlFor="is_doacao" onChange={(e) => setIsDoacao(!is_doacao)} />             
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
