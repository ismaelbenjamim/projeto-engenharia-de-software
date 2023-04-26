import { Badge, Button, Card, Col, Form, Modal, Nav, Row, Table } from "@themesberg/react-bootstrap";
import React from "react";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import api from "../../pages/authentication/api";
import { Link, useHistory } from "react-router-dom";
import { Routes } from "../../routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

export const EntradaTable = () => {
    const hist = useHistory();
    const getPageEdit = (uuid) => {
      hist.push('/entrada/edit?uuid=' + uuid);
    }

    const ObjectListReload = () => {
      setReload(true);
    }
    const [reload, setReload] = useState(false);

    const [resultsPerPage] = useState(10);
    const [resultsTotal, setResultsTotal] = useState(0);
    const [offset, setOffset] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const handlePageClick = (event) => {
      const selectedPage = event.selected;
      setOffset(selectedPage + 1);
    };

    const [showDefault, setShowDefault] = useState(false);
    const [instance_obj, setInstanceObject] = useState({});
    const handleClose = () => setShowDefault(false);
    const [showDelete, setShowDelete] = useState(false);
    const CloseDelete = () => setShowDelete(false);
    const setModal = (uuid, modal_detail) => {
      api.get('entradas/entrada/' + uuid + '/').then((res) => {
        const data = res.data;
        setInstanceObject(data);
        if (modal_detail) {
          setShowDefault(true);
        } else {
          setShowDelete(true);
        }
      });
    }

    const ObjectDetail = (instance_obj) => {
      return(
        <Form onSubmit={(e) => { e.preventDefault(); }}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="uuid">
                <Form.Label>UUID</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.uuid ? instance_obj.uuid : ""} />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="dt_entrada">
                <Form.Label>Data de entrada</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.dt_entrada ? instance_obj.dt_entrada : ""} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6} className="mb-3">
              <Form.Group id="doc_fisc">
                <Form.Label>Descrição</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.item ? instance_obj.item.descricao : ""} />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group id="is_doacao">
                <Form.Label>É doação</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.is_doacao ? "Sim" : "Não"} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6} className="mb-3">
              <Form.Group id="validade">
                <Form.Label>Validade</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.validade ? instance_obj.validade : "Não existe validade"} />
              </Form.Group>
            </Col>
            <Col sm={6} className="mb-3">
              <Form.Group id="val_unit">
                <Form.Label>Valor unitário</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.val_unit ? instance_obj.val_unit : ""} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6} className="mb-3">
              <Form.Group id="val_total">
                <Form.Label>Valor total</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.val_total ? instance_obj.val_total : ""} />
              </Form.Group>
            </Col>
            <Col sm={6} className="mb-3">
              <Form.Group id="fornecedor">
                <Form.Label>Fornecedor</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.fornecedor ? instance_obj.fornecedor : ""} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={12} className="mb-3">
              <Form.Group id="doc_fisc">
                <Form.Label>Documento fiscal</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.doc_fisc ? instance_obj.doc_fisc : ""} />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      )
    }

    const getModal = () => {
      return (
        <Modal as={Modal.Dialog} size="lg" centered show={showDefault} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title className="h6">Detalhes da Entrada</Modal.Title>
            <Button variant="close" aria-label="Close" onClick={handleClose} />
          </Modal.Header>
          <Modal.Body>
            {ObjectDetail(instance_obj)}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="link" className="text-gray ms-auto" onClick={handleClose}>
              Fechar
          </Button>
          </Modal.Footer>
        </Modal>
      )
    }

    const ObjectDelete = (instance_obj) => {
      const callDelete = () => {
        api.delete('entradas/entrada/' + instance_obj.uuid).then((res) => {
          ObjectListReload();
          CloseDelete();
        });
      }
      return(
        <Form onSubmit={(e) => { callDelete(); e.preventDefault(); }}>
          <h4>Você tem certeza que deseja deletar a entrada: <br/>{instance_obj.uuid}?</h4>
          <Button variant="danger" className="mt-3" type="submit">Deletar entrada</Button>
        </Form>
      )
    }

    const getModalDelete = () => {
      return (
        <Modal as={Modal.Dialog} size="lg" centered show={showDelete} onHide={CloseDelete}>
          <Modal.Header>
            <Modal.Title className="h6">Deletar Entrada</Modal.Title>
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
      api.get('entradas/entrada/').then((res) => {
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
      const { uuid, usuario, item, dt_entrada, quantidade, is_doacao } = props;
      return (
        <tr>
          <td>
            <span className="fw-normal">
              {item.descricao}
            </span>
          </td>
          <td>
            <span className="fw-normal">
              {dt_entrada}
            </span>
          </td>
          <td>
            <span className="fw-normal">
              {usuario}
            </span>
          </td>
          <td>
            <span className="fw-normal">
              {quantidade}
            </span>
          </td>
          <td>
            <span className="fw-normal">
              {getValidator(is_doacao)}
            </span>
          </td>
          <td>
            <Button variant="link" className="text-dark me-2 p-0" onClick={() => setModal(uuid, true)}><FontAwesomeIcon icon={faEye} className="" /></Button>
            <Button variant="link" className="text-dark me-2 p-0" onClick={() => getPageEdit(uuid)}><FontAwesomeIcon icon={faEdit} className="" /></Button>
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
                <th className="border-bottom">Data de entrada</th>
                <th className="border-bottom">Usuário</th>
                <th className="border-bottom">Quantidade</th>
                <th className="border-bottom">É doação?</th>
                <th className="border-bottom">Validade</th>
                <th className="border-bottom"></th>
              </tr>
            </thead>
            <tbody>
              {estoque.map(t => <TableRow key={`transaction-${t.uuid}`} {...t} />)}
              {getModal()}
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