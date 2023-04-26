
import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Form, Button, InputGroup, Modal } from '@themesberg/react-bootstrap';
import api from "../../pages/authentication/api";
import { getToken } from "../../pages/authentication/auth";
import { useHistory } from "react-router-dom";


export const SaidasForm = () => {
  const [quantidade, setQuantidade] = useState("");
  const [grupo, setGrupo] = useState("equipamento");
  const [erro_saida, setErroSaida] = useState(null);
  const [descricao, setDescricao] = useState("");

  const [errors, setError] = useState([]);

  const [itens, setItens] = useState([]);
  const [limite_item, setLimiteItem] = useState(null);
  const [grupos_item, setGruposItem] = useState([]);
  const [item_search, setItemSearch] = useState("");
  const [item, setItem] = useState(null);

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
      <p>Saida realizada com sucesso!</p>
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
    var data = {
      "item": item,
      "quantidade": quantidade,
      "usuario": getToken()
    }
    api.post("saidas/saida/", data
    ).then(function (response) {
      var element = document.getElementById("saida_form");
      setLimiteItem(null);
      document.getElementById("buscar_item").classList.remove('is-valid');
      document.getElementById("buscar_item").classList.remove('is-valid');
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

  useEffect(() => {
    if (item_search) {
      let params = "?descricao=" + item_search;
      getItens(params);
      if (itens.length >= 1) {
        var item_busca = itens.find(i => i.descricao === item_search);
        if (item_busca) {
          setItem(item_busca.uuid);
          setLimiteItem(item_busca.estoque_atual)
          document.getElementById("quantidade_saida").setAttribute("max", item_busca.estoque_atual)
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

  const getSearchItem = () => {
    return (
    <Row>
      <Col sm={12}>
        <Form.Group className="mb-3">
          <Form.Label>Procurar item no estoque</Form.Label>
            <Form.Control id="buscar_item" onChange={(e) => setItemSearch(e.target.value)} type="text" placeholder="Buscar" list="lista_itens" />
            <datalist id="lista_itens">
              {itens ? itens.map(i => <option key={i.cod} value={i.descricao}>{i.descricao}</option>) : null}
            </datalist>
        </Form.Group>
      </Col>
    </Row>
    )
  }

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Escolha do Item</h5>
        <Form id="saida_form" method="post" onSubmit={(e) => { postData(); e.preventDefault(); }}>
          { getSearchItem() }
          <hr></hr>
          <h5 className="mb-4 mt-4">Criação de Saida</h5>
          <Row>
            <Col md={12} className="mb-3">
              <Form.Group id="quantidade">
                <Form.Label>Quantidade</Form.Label>
                <Form.Control id="quantidade_saida" required type="number" placeholder="Quantidade" onChange={(e) => setQuantidade(e.target.value)} />
              </Form.Group>
            </Col>
            <p className="text-danger">{limite_item !== null ? "Total de itens disponívels para saída: " + limite_item : null}</p>
          </Row>
          <Row>
            <Col sm={12} className="mb-3">
              <Form.Group id="fornecedor">
                <Form.Label>Descrição da saida</Form.Label>
                <Form.Control required type="text" placeholder="Descrição" onChange={(e) => setDescricao(e.target.value)} />
              </Form.Group>
            </Col>
            <Col sm={6} className="mb-3">
              <Form.Check label="Saida com problema?" id="erro_saida" htmlFor="erro_saida" onChange={(e) => setErroSaida(!erro_saida)} />
            </Col>
          </Row>
          <Row>
            <p className="mb-3">{errors ? Object.entries(errors).map(([key, value]) => (<li key={key}>{value}</li>)) : null}</p>
          </Row>
          <div className="mt-3">
            <Button variant="primary" type="submit">Enviar</Button>
          </div>
          { getModal() }
        </Form>
      </Card.Body>
    </Card>
  );
};
