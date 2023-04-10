
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faArrowDown, faArrowUp, faEdit, faEllipsisH, faExternalLinkAlt, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Nav, Card, Image, Button, Table, Dropdown, ProgressBar, Pagination, ButtonGroup, Modal, Form, Badge } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';

import { Routes } from "../routes";
import api from "../pages/authentication/api";
import ReactPaginate from 'react-paginate';

export const ModalEntradas = (showDefault, instance_obj, handleClose) => {
    const [resultsPerPage] = useState(5);
    const [resultsTotal, setResultsTotal] = useState(0);
    const [offset, setOffset] = useState(1);
    const [pageCount, setPageCount] = useState(0)

    const handlePageClick = (event) => {
        const selectedPage = event.selected;
        setOffset(selectedPage + 1);
    };

    const [estoque, setEstoque_atual] = useState([]);
    useEffect(() => {
        api.get('entradas/entrada/').then((res) => {
            const data = res.data;
            const slice = data.slice(offset * resultsPerPage - resultsPerPage, offset * resultsPerPage);
            setResultsTotal(data.length);
            setEstoque_atual(slice);
            setPageCount(Math.ceil(data.length / resultsPerPage));
        });
    }, [offset]);
    const getBadgeValidator = (validacao) => {
        if (validacao) {
            return <Badge bg="success" className="badge-lg">Sim</Badge>
        } else {
            return <Badge bg="danger" className="badge-lg">Não</Badge>
        }
    }
    const getDataValidade = (validade) => {
        if (validade) {
            return validade
        } else {
            return "-"
        }
    }
    const TableRow = (props) => {
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
                        {getBadgeValidator()}
                    </span>
                </td>
                <td>
                    <span className="fw-normal">
                        {getDataValidade()}
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
    return (
        <Modal as={Modal.Dialog} size={"lg"} centered show={showDefault} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title className="h6">{instance_obj.descricao}</Modal.Title>
                <Button variant="close" aria-label="Close" onClick={handleClose} />
            </Modal.Header>
            <Modal.Body>
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
                        {estoque.map(t => <TableRow key={`transaction-${t.uuid}`} {...t} />)}
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
                                pageCount={pageCount}
                                onPageChange={handlePageClick}
                                containerClassName={"mb-2 mb-lg-0 pagination"}
                                pageLinkClassName={"page-link"}
                                pageClassName={"page-item"}
                                activeClassName={"active"} />
                        </Nav>
                    </Col>
                    <Col lg={2}>
                        <small className="fw-bold">
                            Total de <b>{resultsTotal}</b> itens
                        </small>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="link" className="text-gray ms-auto" onClick={handleClose}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}