import { Badge, Button, Card, Col, Form, Modal, Nav, Row, Table } from "@themesberg/react-bootstrap";
import React from "react";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import api from "../../pages/authentication/api";
import { Link, useHistory } from "react-router-dom";
import { Routes } from "../../routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";

export const EstoqueAtualTable = () => {
    const [resultsPerPage] = useState(10);
    const [resultsTotal, setResultsTotal] = useState(0);
    const [offset, setOffset] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const hist = useHistory();
    const handlePageClick = (event) => {
      const selectedPage = event.selected;
      setOffset(selectedPage + 1);
    };

    const ObjectListReload = () => {
      setReload(true);
    }
    const [reload, setReload] = useState(false);

    const [showDefault, setShowDefault] = useState(false);
    const [instance_obj, setInstanceObject] = useState({});
    const handleClose = () => setShowDefault(false);
    const [showDelete, setShowDelete] = useState(false);
    const CloseDelete = () => setShowDelete(false);
    const setModal = (uuid, modal_detail) => {
      api.get('itens/item/' + uuid + '/').then((res) => {
        const data = res.data;
        setInstanceObject(data);
        if (modal_detail) {
          setShowDefault(true);
        } else {
          setShowDelete(true);
        }
      });
    }

    const EntradasDetail = (entrada_obj) => {
      const [resultsPerPageModal] = useState(10);
      const [resultsTotalModal, setResultsTotalModal] = useState(0);
      const [offsetModal, setOffsetModal] = useState(1);
      const [pageCountModal, setPageCountModal] = useState(0)
      const handlePageClickModal = (event) => {
        const selectedPage = event.selected;
        setOffset(selectedPage + 1);
      };
      const [entradas_estoque, setEntradasEstoque] = useState([]);
      useEffect(() => {
        api.get('entradas/entrada/?item=' + entrada_obj.uuid).then((res) => {
          const data_modal = res.data;
          const slice_modal = data_modal.slice(offsetModal * resultsPerPageModal - resultsPerPageModal, offsetModal * resultsPerPageModal);
          setResultsTotalModal(data_modal.length);
          setEntradasEstoque(slice_modal);
          setPageCountModal(Math.ceil(data_modal.length / resultsPerPageModal));
        });
      }, [offsetModal, entrada_obj]);
      const EntradasRow = (props) => {
        const { uuid, dt_entrada, quantidade, doc_fisc, is_doacao, validade, val_unit, val_total, fornecedor, tipo_unit, usuario, item, doador } = props;
        return (
            <tr>
                <td>
                    <span className="fw-normal">
                        {dt_entrada}
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
                    <span className="fw-normal">
                        {validade ? moment(validade).format("DD/MM/YYYY") : "Não tem validade"}
                    </span>
                </td>
                <td>
                    <span className="fw-normal">
                        {usuario}
                    </span>
                </td>
            </tr>
        );
      };
      return(
      <>
        <Table responsive className="table-centered table-nowrap rounded mb-0">
            <thead className="thead-light">
                <tr>
                    <th className="border-bottom">Data de entrada</th>
                    <th className="border-bottom">Quantidade</th>
                    <th className="border-bottom">É doação</th>
                    <th className="border-bottom">Validade</th>
                    <th className="border-bottom">Usuário</th>
                </tr>
            </thead>
            <tbody>
                {entradas_estoque.map(t => <EntradasRow key={`${t.uuid}`} {...t} />)}
            </tbody>
        </Table>
        <Row className="mt-3">
            <Col lg={10}>
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
                        pageCount={pageCountModal}
                        onPageChange={handlePageClickModal}
                        containerClassName={"mb-2 mb-lg-0 pagination"}
                        pageLinkClassName={"page-link"}
                        pageClassName={"page-item"}
                        activeClassName={"active"} />
                </Nav>
            </Col>
            <Col lg={2}>
                <small className="fw-bold">
                    Total de <b>{resultsTotalModal}</b> itens
                </small>
            </Col>
        </Row>
      </>
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
            {EntradasDetail(instance_obj)}
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
        api.delete('itens/item/' + instance_obj.uuid).then((res) => {
          ObjectListReload();
          CloseDelete();
        });
      }
      return(
        <Form onSubmit={(e) => { callDelete(); e.preventDefault(); }}>
          <h4>Você tem certeza que deseja deletar o item: <br/>{instance_obj.uuid}?</h4>
          <Button variant="danger" className="mt-3" type="submit">Deletar item</Button>
        </Form>
      )
    }

    const getModalDelete = () => {
      return (
        <Modal as={Modal.Dialog} size="lg" centered show={showDelete} onHide={CloseDelete}>
          <Modal.Header>
            <Modal.Title className="h6">Deletar Item</Modal.Title>
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
      api.get('itens/item/').then((res) => {
        const data = res.data;
        const slice = data.slice(offset * resultsPerPage - resultsPerPage, offset * resultsPerPage);
        setResultsTotal(data.length);
        setEstoque_atual(slice);
        setPageCount(Math.ceil(data.length / resultsPerPage));
      });
    }, [offset, reload]);
    const getValidator = (validator) => {
      if (validator) {
        return <Badge bg="success" className="badge-lg">Sim</Badge>
      } else {
        return <Badge bg="danger" className="badge-lg">Não</Badge>
      }
    }
    const TableRow = (props) => {
      const { uuid, cod, descricao, grupo, estoque_atual, is_bem_de_consumo } = props;
      return (
        <tr>
          <td>
            <Card.Link as={Link} to={Routes.Invoice.path} className="fw-normal">
              {cod}
            </Card.Link>
          </td>
          <td>
            <span className="fw-normal">
              {descricao}
            </span>
          </td>
          <td>
            <span className="fw-normal">
              {grupo}
            </span>
          </td>
          <td>
            <span className="fw-normal">
              {estoque_atual}
            </span>
          </td>
          <td>
            <span className="fw-normal">
              {getValidator(is_bem_de_consumo)}
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

    const getPageEdit = (uuid) => {
      hist.push('/estoque-atual/edit?uuid=' + uuid);
    }
  
    return (
      <Card border="light" className="shadow-sm">
        <Card.Body className="pb-0">
          <Table responsive className="table-centered table-nowrap rounded mb-0">
            <thead className="thead-light">
              <tr>
                <th className="border-bottom">Código</th>
                <th className="border-bottom">Descrição</th>
                <th className="border-bottom">Grupo</th>
                <th className="border-bottom">Quantidade no estoque</th>
                <th className="border-bottom">É bem de consumo?</th>
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