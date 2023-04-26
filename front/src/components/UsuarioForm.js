
import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Form, Button, InputGroup, Modal } from '@themesberg/react-bootstrap';
import api from "../pages/authentication/api";
import { getToken } from "../pages/authentication/auth";
import { useHistory } from "react-router-dom";


export const UsuarioForm = () => {
  const [quantidade, setQuantidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [grupo, setGrupo] = useState("equipamento");
  const [validade, setValidade] = useState(null);
  const [codigo, setCodigo] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [valor_total, setValorTotal] = useState("");
  const [valor_unitario, setValorUnitario] = useState("");
  const [tipo_unitario, setTipoUnitario] = useState("");
  const [is_bem_de_consumo, setIsBemConsumo] = useState(false);
  const [is_doacao, setIsDoacao] = useState(false);
  const [doc_fisc, setDocFiscal] = useState(null);
  const [doador_nome, setDoadorNome] = useState(null);
  const [doador_cnpj_cpf, setDoadorCPF] = useState(null);
  const [errors, setError] = useState([]);

  const [itens, setItens] = useState([]);
  const [grupos_item, setGruposItem] = useState([]);
  const [item_search, setItemSearch] = useState("");
  const [item, setItem] = useState(null);
  const [show_search_item, setShowSearchItem] = React.useState(true);
  const [showItem, setShowItem] = React.useState(false);

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
      <p>Entrada realizada com sucesso!</p>
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
    if (showItem == true) {
      setItem({
        "is_bem_de_consumo": is_bem_de_consumo,
        "grupo": grupo,
        "cod": codigo,
        "descricao": descricao
      });
    }
    var data = {
      "is_novo_item": showItem,
      "item": item,
      "quantidade": quantidade,
      "usuario": getToken(),
      "is_doacao": is_doacao,
      "val_unit": valor_unitario,
      "val_total": valor_total,
      "fornecedor": fornecedor,
      "tipo_unit": tipo_unitario
    }
    if (validade) {
      data["validade"] = moment(validade).format('YYYY-MM-DD');;
    }
    if (doc_fisc) {
      data["doc_fisc"] = doc_fisc;
    }
    if (doador_cnpj_cpf && doador_nome) {
      data["doador"] = {
        "nome": doador_nome,
        "cnpj_cpf": doador_cnpj_cpf
      }
    }
    api.post("entradas/entrada/", data
    ).then(function (response) {
      var element = document.getElementById("entrada_form");
      element.reset();
      setShowDefault(true);
    }).catch(function(errors) {
      setError(errors.response.data);
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

  const getGruposItem = () => {
    api.get("itens/item-grupos/", {
    }).then(function (response) {
      setGruposItem(response.data);
    }).catch(function(errors) {
      console.log(errors.data)
    })
  }

  function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setDocFiscal(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }

  const handleClick = event => {
    setShowSearchItem(current => !current);
    setShowItem(current => !current);
  };

  useEffect(() => {
    if (item_search) {
      let params = "?descricao=" + item_search;
      getItens(params);
      if (itens.length >= 1) {
        var item_busca = itens.find(i => i.descricao === item_search);
        if (item_busca) {
          setItem(item_busca.uuid);
          document.getElementById("buscar_item").classList.add('is-valid');
          document.getElementById("buscar_item").classList.remove('is-invalid');
        } else {
          setItem("");
          document.getElementById("buscar_item").classList.add('is-invalid');
          document.getElementById("buscar_item").classList.remove('is-valid');
        }
      }
    }
    getGruposItem();
  }, [item_search]);

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Criação de Usuário</h5>
        <Form id="form" method="post" onSubmit={(e) => { postData(); e.preventDefault(); }}>
          <Row>
            <Col md={12} className="mb-3">
              <p>Não encontrou o item?</p>
              <Form.Check label="Cadastrar novo item" onClick={handleClick} id="checkbox_item" htmlFor="checkbox_item" />
            </Col>
          </Row>
          <hr></hr>
          <h5 className="mb-4 mt-4">Criação de Entrada</h5>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="quantidade">
                <Form.Label>Quantidade</Form.Label>
                <Form.Control required type="number" placeholder="Quantidade" onChange={(e) => setQuantidade(e.target.value)} />
              </Form.Group>
            </Col>
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
                        type="text"
                        value={validade ? moment(validade).format("DD/MM/YYYY") : ""}
                        placeholder="dd/mm/yyyy"
                        onFocus={openCalendar}
                        onChange={() => { }} />
                    </InputGroup>
                  )} />
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
            <Col sm={6} className="mb-3">
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
            <Col sm={12} className="mb-3">
              <Form.Group id="tipo_unit">
                <Form.Label>Documento fiscal</Form.Label>
                <Form.Control type="file" onChange={(e) => getBase64(e.target.files[0])} />
              </Form.Group>
            </Col>
            <Col sm={6} className="mb-3">
              <Form.Check label="É doação?" id="is_doacao" htmlFor="is_doacao" onChange={(e) => setIsDoacao(!is_doacao)} />
            </Col>
          </Row>
          { is_doacao && getDoador() }
          <p className="mb-3">{errors}</p>
          <div className="mt-3">
            <Button variant="primary" type="submit">Enviar</Button>
          </div>
          { getModal() }
        </Form>
      </Card.Body>
    </Card>
  );
};