
import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Form, Button, InputGroup } from '@themesberg/react-bootstrap';
import api from "../pages/authentication/api";
import { getToken } from "../pages/authentication/auth";
import { useHistory } from "react-router-dom";


export const EntradasForm = () => {
  const [data_entrada, setDataEntrada] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [grupo, setGrupo] = useState("equipamento");
  const [validade, setValidade] = useState("");
  const [codigo, setCodigo] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [valor_total, setValorTotal] = useState("");
  const [valor_unitario, setValorUnitario] = useState("");
  const [tipo_unitario, setTipoUnitario] = useState("");
  const [is_bem_de_consumo, setIsBemConsumo] = useState(false);
  const [is_doacao, setIsDoacao] = useState(false);
  const [errors, setError] = useState([]);

  const [itens, setItens] = useState([{}]);
  const [item_search, setItemSearch] = useState("");
  const [item, setItem] = useState("");
  const [showItem, setShowItem] = React.useState(false);
  const history = useHistory();
  
  const postData = () => {
    api.post("entradas/entrada/", {
      "usuario": getToken(),
      "item": {
        "is_bem_de_consumo": is_bem_de_consumo,
        "grupo": grupo,
        "cod": codigo,
        "is_doacao": is_doacao,
        "validade": validade,
        "val_unit": valor_unitario,
        "val_total": valor_total,
        "fornecedor": fornecedor,
        "descricao": descricao,
        "tipo_unit": tipo_unitario
      }
    }).then(function (response) {
      history.push("/estoque-atual/");
    }).catch(function(errors) {
      setError(errors.data);
    })
  }

  const getItens = (params="") => {
    api.get("itens/item/" + params, {
    }).then(function (response) {
      setItens(response.data);
    }).catch(function(errors) {
      console.log(errors.data)
    })
  }

  const handleClick = event => {
    setShowItem(current => !current);
  };

  useEffect(() => {
    if (item_search) {
      let params = "?descricao=" + item_search;
      getItens(params);
    }
  }, [item_search]);

  const getCheckboxItem = () => {
    return (
      <Row>
        <h5 className="my-4">Cadastro de Item</h5>
        <Row>
          <Col sm={6} className="mb-3">
            <Form.Group id="descricao">
              <Form.Label>Descrição</Form.Label>
              <Form.Control required type="text" placeholder="Descrição" onChange={(e) => setDescricao(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group id="grupo">
              <Form.Label>Grupo</Form.Label>
              <Form.Select defaultValue="0" onChange={(e) => setGrupo(e.target.value)}>
                <option value="equipamento">Equipamento</option>
                <option value="tipo_2">Tipo 2</option>
                <option value="tipo_3">Tipo 3</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="mb-3">
            <Form.Group id="validade">
              <Form.Label>Data de validade</Form.Label>
              <Datetime
                timeFormat={false}
                onChange={(e) => setValidade(e.toISOString().substring(0, 10))}
                renderInput={(props, openCalendar) => (
                  <InputGroup>
                    <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                    <Form.Control
                      required
                      type="text"
                      value={validade ? moment(validade).format("DD/MM/YYYY") : ""}
                      placeholder="dd/mm/yyyy"
                      onFocus={openCalendar}
                      onChange={() => { }} />
                  </InputGroup>
                )} />
            </Form.Group>
          </Col>
          <Col sm={6} className="mb-3">
            <Form.Group id="cod">
              <Form.Label>Código</Form.Label>
              <Form.Control required type="text" placeholder="Código" onChange={(e) => setCodigo(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col sm={6} className="mb-3">
            <Form.Group id="fornecedor">
              <Form.Label>Fornecedor</Form.Label>
              <Form.Control required type="text" placeholder="Fornecedor" onChange={(e) => setFornecedor(e.target.value)} />
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group id="val_total">
              <Form.Label>Valor total</Form.Label>
              <Form.Control required type="text" placeholder="Valor total" onChange={(e) => setValorTotal(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
        <Col sm={6}>
          <Form.Group id="val_unit">
            <Form.Label>Valor Unitário</Form.Label>
            <Form.Control required type="text" placeholder="Valor unitário" onChange={(e) => setValorUnitario(e.target.value)} />
          </Form.Group>
        </Col>
        <Col sm={6} className="mb-3">
          <Form.Group id="tipo_unit">
            <Form.Label>Tipo unitário</Form.Label>
            <Form.Control required type="text" placeholder="Tipo unitário" onChange={(e) => setTipoUnitario(e.target.value)} />
          </Form.Group>
        </Col>
        </Row>
        <Row>
          <Col className="mb-3">
          <Form.Check label="É bem de consumo?" id="is_bem_de_consumo" htmlFor="is_bem_de_consumo" onChange={(e) => setIsBemConsumo(!is_bem_de_consumo)} />
          </Col>
          <Col className="mb-3">
            <Form.Check label="É doação?" id="is_doacao" htmlFor="is_doacao" onChange={(e) => setIsDoacao(!is_doacao)} />
          </Col>
        </Row>
      </Row>
    )
  }

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Criação de Entrada</h5>
        <Form method="post" onSubmit={(e) => { postData(); e.preventDefault(); }}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="data_entrada">
                <Form.Label>Data de entrada</Form.Label>
                <Datetime
                  timeFormat={false}
                  onChange={setDataEntrada}
                  renderInput={(props, openCalendar) => (
                    <InputGroup>
                      <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                      <Form.Control
                        required
                        type="text"
                        value={data_entrada ? moment(data_entrada).format("DD/MM/YYYY") : ""}
                        placeholder="dd/mm/yyyy"
                        onFocus={openCalendar}
                        onChange={() => { }} />
                    </InputGroup>
                  )} />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="lastName">
                <Form.Label>Quantidade</Form.Label>
                <Form.Control required type="number" placeholder="Quantidade" onChange={(e) => setQuantidade(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>

          <h5 className="my-4">Item</h5>
          <Row id="escolher_item">
            <Col sm={12}>
              <Form.Group className="mb-3">
                <Form.Label>Procurar item do estoque</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FontAwesomeIcon icon={faSearch} /></InputGroup.Text>
                  <Form.Control onChange={(e) => setItemSearch(e.target.value)} type="text" placeholder="Buscar" list="lista_itens" />
                  <datalist id="lista_itens">
                    {itens.map(i => <option value={"(" + i.cod + ") " + i.descricao}>{i.descricao}</option>)}
                  </datalist>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12} className="mb-3">
              <Form.Check label="Cadastrar novo item" onClick={handleClick} id="checkbox_item" htmlFor="checkbox_item" />
            </Col>
          </Row>
          { showItem && getCheckboxItem() }
          <p className="mb-3">{errors}</p>
          <div className="mt-3">
            <Button variant="primary" type="submit">Enviar</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};