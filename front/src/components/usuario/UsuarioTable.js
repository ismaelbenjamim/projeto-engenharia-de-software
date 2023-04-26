import { Badge, Button, Card, Form, InputGroup, Col, Modal, Nav, Row, Table } from "@themesberg/react-bootstrap";
import React from "react";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import api from "../../pages/authentication/api";
import { Link, useHistory } from "react-router-dom";
import { Routes } from "../../routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faSync, faSyncAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";

export const UsuarioTable = () => {
    const hist = useHistory();
    const [resultsPerPage] = useState(10);
    const [resultsTotal, setResultsTotal] = useState(0);
    const [offset, setOffset] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const handlePageClick = (event) => {
      const selectedPage = event.selected;
      setOffset(selectedPage + 1);
    };

    const ObjectListReload = () => {
      setReload(true);
    }
    const [reload, setReload] = useState(false);

    const [instance_obj, setInstanceObject] = useState({});
    const [showDetail, setShowDetail] = useState(false);
    const CloseDetail = () => setShowDetail(false);
    const [showReloadUser, setShowReloadUser] = useState(false);
    const CloseReloadUser = () => setShowReloadUser(false);
    const [showDelete, setShowDelete] = useState(false);
    const CloseDelete = () => setShowDelete(false);
    const setModal = (uuid, modal) => {
      api.get('usuarios/usuario/' + uuid + '/').then((res) => {
        const data = res.data;
        setInstanceObject(data);
        if (modal == 1) {
          setShowDetail(true);
        } else if (modal == 2) {
          setShowReloadUser(true);
          redefinirSenha(data.username);
        } else {
          setShowDelete(true);
        }
      });
    }

    const redefinirSenha = (username) => {
      api.post('usuarios/esqueci-senha/', {
        "username": username
      }).then((res) => {
      });
    }

    const getPageEdit = (uuid) => {
      hist.push('/usuarios/edit?uuid=' + uuid);
    }

    const UserDetail = (instance_obj) => {
      return(
        <Form onSubmit={(e) => { e.preventDefault(); }}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="uuid">
                <Form.Label>UUID</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.uuid} />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.email} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6} className="mb-3">
              <Form.Group id="nome">
                <Form.Label>Nome</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.first_name} />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group id="sobrenome">
                <Form.Label>Sobrenome</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.last_name} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6} className="mb-3">
              <Form.Group id="cargo">
                <Form.Label>Cargo</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.cargo} />
              </Form.Group>
            </Col>
            <Col sm={6} className="mb-3">
              <Form.Group id="is_ativo">
                <Form.Label>É ativo?</Form.Label>
                <Form.Control disabled type="text" value={instance_obj.is_active ? "Sim" : "Não"} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6} className="mb-3">
              <Form.Group id="ultimo_acesso">
                <Form.Label>Último acesso</Form.Label>
                <Form.Control disabled type="text" value={moment(instance_obj.last_login).format("DD/MM/YYYY")} />
              </Form.Group>
            </Col>
            <Col sm={6} className="mb-3">
              <Form.Group id="data_criacao">
                <Form.Label>Data de criação</Form.Label>
                <Form.Control disabled type="text" value={moment(instance_obj.date_joined).format("DD/MM/YYYY")} />
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
              <Modal.Title className="h6">Detalhes do Usuário</Modal.Title>
              <Button variant="close" aria-label="Close" onClick={CloseDetail} />
            </Modal.Header>
            <Modal.Body>
              {UserDetail(instance_obj)}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="link" className="text-gray ms-auto" onClick={CloseDetail}>
                Fechar
            </Button>
            </Modal.Footer>
          </Modal>
      )
    }

    const getModalReloadUser = () => {
      return (
        <Modal as={Modal.Dialog} size="lg" centered show={showReloadUser} onHide={CloseReloadUser}>
            <Modal.Header>
              <Modal.Title className="h6">Redefinição de senha do usuário</Modal.Title>
              <Button variant="close" aria-label="Close" onClick={CloseReloadUser} />
            </Modal.Header>
            <Modal.Body className="text-center">
              <h3>E-mail de redefinição de senha enviada para o usuário:<br/>{instance_obj.email}</h3>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="link" className="text-gray ms-auto" onClick={CloseReloadUser}>
                Fechar
            </Button>
            </Modal.Footer>
          </Modal>
      )
    }

    const ObjectDelete = (instance_obj) => {
      const callDelete = () => {
        api.delete('usuarios/usuario/' + instance_obj.uuid).then((res) => {
          ObjectListReload();
          CloseDelete();
        });
      }
      return(
        <Form onSubmit={(e) => { callDelete(); e.preventDefault(); }}>
          <h4>Você tem certeza que deseja deletar o usuário: <br/>{instance_obj.email}?</h4>
          <Button variant="danger" className="mt-3" type="submit">Deletar usuário</Button>
        </Form>
      )
    }

    const getModalDelete = () => {
      return (
        <Modal as={Modal.Dialog} size="lg" centered show={showDelete} onHide={CloseDelete}>
          <Modal.Header>
            <Modal.Title className="h6">Deletar Usuário</Modal.Title>
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

    const [object_list, setObjectList] = useState([]);
    useEffect(() => {
      api.get('usuarios/usuario/').then((res) => {
        const data = res.data;
        const slice = data.slice(offset * resultsPerPage - resultsPerPage, offset * resultsPerPage);
        setResultsTotal(data.length);
        setObjectList(slice);
        setPageCount(Math.ceil(data.length / resultsPerPage));
      });
    }, [offset, reload]);

    const getValidator = (field_validator) => {
      if (field_validator) {
        return <Badge bg="success" className="badge-lg">Sim</Badge>
      } else {
        return <Badge bg="danger" className="badge-lg">Não</Badge>
      }
    }

    const TableRow = (props) => {
      const { uuid, email, first_name, last_name, cargo, is_active } = props;
      return (
        <tr>
          <td>
            <span className="fw-normal">
              {email}
            </span>
          </td>
          <td>
            <span className="fw-normal">
              {first_name + " " + last_name}
            </span>
          </td>
          <td>
            <span className="fw-normal">
              {cargo}
            </span>
          </td>
          <td>
            <span className="fw-normal">
              {getValidator(is_active)}
            </span>
          </td>
          <td>
            <Button variant="link" className="text-dark me-2 p-0" onClick={() => setModal(uuid, 1)}><FontAwesomeIcon icon={faEye} className="" /></Button>
            <Button variant="link" className="text-dark me-2 p-0" onClick={() => getPageEdit(uuid)}><FontAwesomeIcon icon={faEdit} className="" /></Button>
            <Button variant="link" className="text-dark me-2 p-0" onClick={() => setModal(uuid, 2)}><FontAwesomeIcon icon={faSyncAlt} className="" /></Button>
            <Button variant="link" className="text-danger me-2 p-0" onClick={() => setModal(uuid, 3)}><FontAwesomeIcon icon={faTrashAlt} className="" /></Button>
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
                <th className="border-bottom">Email</th>
                <th className="border-bottom">Nome</th>
                <th className="border-bottom">Cargo</th>
                <th className="border-bottom">É ativo</th>
                <th className="border-bottom"></th>
              </tr>
            </thead>
            <tbody>
              {object_list.map(t => <TableRow key={`${t.uuid}`} {...t} />)}
              {getModalDetail()}
              {getModalReloadUser()}
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