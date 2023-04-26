import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Form, Button, InputGroup } from '@themesberg/react-bootstrap';
import api from "../../pages/authentication/api";
import { getToken } from "../../pages/authentication/auth";
import { useHistory } from "react-router-dom";


export const SaidaEdit = () => {
  const [quantidade, setQuantidade] = useState("");
  const [erro_saida, setErroSaida] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [is_ultimo, setIsUltimo] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [item, setItem] = useState("");
  const [saida_pai, setSaidaPai] = useState("");

  const [errors, setError] = useState([]);
  const [success, setSuccess] = useState("");

  const history = useHistory();

  const postData = () => {
    api.post("saidas/saida-update/", {
      "quantidade": quantidade,
      "erro_saida": erro_saida,
      "descricao": descricao,
      "is_ultimo": is_ultimo,
      "usuario": usuario,
      "item": item,
      "saida_pai": saida_pai      
    }).then(function (response) {
      setSuccess('Item alterado com sucesso!')
    }).catch(function(errors) {
      setError(errors.response.data);
    })
  }
  const queryParameters = new URLSearchParams(window.location.search)
  const obj_uuid = queryParameters.get("uuid")
  useEffect(() => {
    api.get("saidas/saida/" + obj_uuid + "/" , {
    }).then(function (response) {
        const data = response.data;
        setQuantidade(data.quantidade);
        setErroSaida(data.erro_saida);
        setDescricao(data.descricao);
        setIsUltimo(data.is_ultimo);
        setUsuario(data.usuario.uuid);
        setItem(data.item.uuid);
        setSaidaPai(obj_uuid);
    }).catch(function(errors) {
      setError(errors.response.data);
    })
  },[])
  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
      <Button variant="outline-primary" onClick={(e) => history.push("/saida/list")} size="sm" className="mb-3"><FontAwesomeIcon icon={faArrowLeft} /> Voltar</Button>
      <h5 className="mb-4">Edição de Saida</h5>
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
                <Form.Label>Descrição</Form.Label>
                <Form.Control defaultValue={descricao} type="text" placeholder="Descrição" onChange={(e) => setDescricao(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">               
              <Form.Check checked={erro_saida} label="É uma saida com problema?" id="erro_saida" htmlFor="erro_saida" onChange={(e) => setErroSaida(!erro_saida)} />             
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
