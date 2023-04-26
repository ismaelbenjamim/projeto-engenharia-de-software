import { Badge, Button, Card, Col, Form, Modal, Nav, Row, Table } from "@themesberg/react-bootstrap";
import React from "react";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import api from "../../pages/authentication/api";
import { Link, useHistory } from "react-router-dom";
import { Routes } from "../../routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

export const SaidaTable = () => {
    const hist = useHistory();
    const getPagItem = (uuid) => {
      hist.push('/saida/edit?uuid=' + uuid);
    }
    const ObjectListReload = () => {
      setReload(true);
    }
    const [reload, setReload] = useState(false);

    const [resultsPerPage] = useState(10);
    const [resultsTotal, setResultsTotal] = useState(0);
    const [offset, setOffset] = useState(1);
    const [pageCount, setPageCount] = useState(0)
    const handlePageClick = (event) => {
      const selectedPage = event.selected;
      setOffset(selectedPage + 1);
    };
  
    const [instance_obj, setInstanceObject] = useState({});
    const [showDetail, setShowDetail] = useState(false);
    const CloseDetail = () => setShowDetail(false);
    const [showDelete, setShowDelete] = useState(false);
    const CloseDelete = () => setShowDelete(false);
    const setModal = (uuid, modal_detail) => {
      api.get('saidas/saida/' + uuid + '/').then((res) => {
        const data = res.data;
        setInstanceObject(data);
        if (modal_detail) {
          setShowDetail(true);
        } else {
          setShowDelete(true);
        }
      });
    }

    const ObjectDetail = (instance_obj) => {
      return(
        <Form onSubmit={(e) => { e.preventDefault(); }}>
          <Row>
            <Col sm={12} className="mb-3">
              <Form.Group id="item">
                <Form.Label>Item vinculado</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.item ? instance_obj.item.descricao + " (" + instance_obj.item.cod + ")" : ""} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="uuid">
                <Form.Label>UUID</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.uuid ? instance_obj.uuid : ""} />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="dt_saida">
                <Form.Label>Data de saida</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.dt_saida ? instance_obj.dt_saida : ""} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Form.Group id="quantidade">
                <Form.Label>Quantidade</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.quantidade} />
              </Form.Group>
            </Col>
            <Col sm={6} className="mb-3">
              <Form.Group id="erro_saida">
                <Form.Label>Problema na saida</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.erro_saida ? "Sim" : "Não"} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6} className="mb-3">
              <Form.Group id="descricao">
                <Form.Label>Descrição da saida</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.descricao ? instance_obj.descricao : ""} />
              </Form.Group>
            </Col>
            <Col sm={6} className="mb-3">
              <Form.Group id="usuario">
                <Form.Label>Usuário</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.usuario ? instance_obj.usuario.username : ""} />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      )
    }

    const getModalDetail = () => {
      return (
        <Modal as={Modal.Dialog} size="lg" centered show={showDetail} onHide={CloseDetail}>
          <Modal.Header>
            <Modal.Title className="h6">Detalhes da Entrada</Modal.Title>
            <Button variant="close" aria-label="Close" onClick={CloseDetail} />
          </Modal.Header>
          <Modal.Body>
            {ObjectDetail(instance_obj)}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="link" className="text-gray ms-auto" onClick={CloseDetail}>
              Fechar
          </Button>
          </Modal.Footer>
        </Modal>
      )
    }

    const ObjectDelete = (instance_obj) => {
      const callDelete = () => {
        api.delete('saidas/saida/' + instance_obj.uuid).then((res) => {
          ObjectListReload();
          CloseDelete();
        });
      }
      return(
        <Form onSubmit={(e) => { callDelete(); e.preventDefault(); }}>
          <h4>Você tem certeza que deseja deletar a saida: <br/>{instance_obj.uuid}?</h4>
          <Button variant="danger" className="mt-3" type="submit">Deletar saida</Button>
        </Form>
      )
    }

    const getModalDelete = () => {
      return (
        <Modal as={Modal.Dialog} size="lg" centered show={showDelete} onHide={CloseDelete}>
          <Modal.Header>
            <Modal.Title className="h6">Deletar saida</Modal.Title>
            <Button variant="close" aria-label="Close" onClick={CloseDelete} />
          </Modal.Header>
          <Modal.Body className="text-center">
            {ObjectDelete(instance_obj)}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="link" className="text-gray ms-auto" onClick={CloseDelete}>
              Fechar
          </Button>
          </Modal.Footer>
        </Modal>
      )
    }
  
    const [estoque, setEstoque_atual] = useState([]);
    useEffect(() => {
      api.get('saidas/saida/').then((res) => {
        const data = res.data;
        const slice = data.slice(offset * resultsPerPage - resultsPerPage, offset * resultsPerPage);
        setResultsTotal(data.length);
        setEstoque_atual(slice);
        setPageCount(Math.ceil(data.length / resultsPerPage));
      });
    }, [offset, reload]);
    const getValidator = (is_bem_de_consumo) => {
      if (is_bem_de_consumo) {
        return <Badge bg="success" className="badge-lg">Sim</Badge>
      } else {
        return <Badge bg="danger" className="badge-lg">Não</Badge>
      }
    }
    const TableRow = (props) => {
      const { uuid, usuario, item, dt_saida, quantidade } = props;
      return (
        <tr>
          <td>
            <span className="fw-normal">
              {item.descricao}
            </span>
          </td>
          <td>
            <span className="fw-normal">
              {dt_saida}
            </span>
          </td>
          <td>
            <span className="fw-normal">
              {usuario.username}
            </span>
          </td>
          <td>
            <span className="fw-normal">
              {quantidade}
            </span>
          </td>
          <td>
            <span className="fw-normal">
              {getValidator(true)}
            </span>
          </td>
          <td>
            <Button variant="link" className="text-dark me-2 p-0" onClick={() => setModal(uuid, true)}><FontAwesomeIcon icon={faEye} className="" /></Button>
            <Button variant="link" className="text-dark me-2 p-0" onClick={() => getPagItem(uuid)}><FontAwesomeIcon icon={faEdit} className="" /></Button>
            <Button variant="link" className="text-danger me-2 p-0" onClick={() => setModal(uuid, false)}><FontAwesomeIcon icon={faTrashAlt} className="" /></Button>
          </td>
        </tr>
      );
    };
  
    return (
      <Card border="light" className="shadow-sm">
        <Card.Body className="pb-0">
          <Table responsive className="table-centered table-nowrap rounded mb-0">
            <thead className="thead-light">
              <tr>
                <th className="border-bottom">Item</th>
                <th className="border-bottom">Data de saida</th>
                <th className="border-bottom">Usuário</th>
                <th className="border-bottom">Quantidade</th>
                <th className="border-bottom">É doação?</th>
                <th className="border-bottom"></th>
              </tr>
            </thead>
            <tbody>
              {estoque.map(t => <TableRow key={`${t.uuid}`} {...t} />)}
              {getModalDetail()}
              {getModalDelete()}
            </tbody>
          </Table>
          <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
            <Nav>
              <ReactPaginate
                previousLabel={"Anterior"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextLabel={"Próximo"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={"mb-2 mb-lg-0 pagination"}
                pageLinkClassName={"page-link"}
                pageClassName={"page-item"}
                activeClassName={"active"} />
            </Nav>
            <small className="fw-bold">
              Total de <b>{resultsTotal}</b> itens
            </small>
          </Card.Footer>
        </Card.Body>
      </Card>
    );
  };