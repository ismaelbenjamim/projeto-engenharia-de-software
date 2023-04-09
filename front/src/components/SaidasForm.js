
import React, { useState } from "react";
import moment from "moment-timezone";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Form, Button, InputGroup } from '@themesberg/react-bootstrap';
import api from "../pages/authentication/api";
import { getToken } from "../pages/authentication/auth";
import { useHistory } from "react-router-dom";


export const SaidasForm = () => {
  const [data_saida, setDataSaida] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [item, setItem] = useState("");
  const [errors, setError] = useState([]);

  const history = useHistory();

  const postData = () => {
    api.post("saidas/saida/", {
      "dt_saida": data_saida,
      "quantidade": quantidade,
      "item": item,
      "usuario": getToken()
    }).then(function (response) {
      history.push("/estoque-atual/");
    }).catch(function(errors) {
      console.log(errors.data)
      setError(errors.data);
    })
  }

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Criação de Saida</h5>
        <Form method="post" onSubmit={(e) => { postData(); e.preventDefault(); }}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="data_saida">
                <Form.Label>Data de saida</Form.Label>
                <Datetime
                  timeFormat={false}
                  onChange={setDataSaida}
                  renderInput={(props, openCalendar) => (
                    <InputGroup>
                      <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                      <Form.Control
                        required
                        type="text"
                        value={data_saida ? moment(data_saida).format("DD/MM/YYYY") : ""}
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
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="grupo">
                <Form.Label>Item</Form.Label>
                <Form.Select defaultValue="0" onChange={(e) => setItem(e.target.value)}>
                  <option value="item 1">Item 1</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <p className="mb-3">{errors}</p>
          <div className="mt-3">
            <Button variant="primary" type="submit">Enviar</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
