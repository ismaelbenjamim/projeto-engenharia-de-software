import { Badge, Button, Card, Nav, Table } from "@themesberg/react-bootstrap";
import React from "react";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import api from "../pages/authentication/api";
import { Link } from "react-router-dom";
import { Routes } from "../routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

export const SaidaTable = () => {
    const [resultsPerPage] = useState(10);
    const [resultsTotal, setResultsTotal] = useState(0);
    const [offset, setOffset] = useState(1);
    const [pageCount, setPageCount] = useState(0)
  
    const [instance_obj, setObjectModal] = useState({});
    const [showDefault, setShowDefault] = useState(false);
    const handleClose = () => setShowDefault(false);
  
    const handlePageClick = (event) => {
      const selectedPage = event.selected;
      setOffset(selectedPage + 1);
    };
  
    const getModal = (item) => {
      setObjectModal(item);
      setShowDefault(true);
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
    }, [offset]);
    const getValidator = (is_bem_de_consumo) => {
      if (is_bem_de_consumo) {
        return <Badge bg="success" className="badge-lg">Sim</Badge>
      } else {
        return <Badge bg="danger" className="badge-lg">Não</Badge>
      }
    }
    const TableRow = (props) => {
      const { usuario, item, dt_saida, quantidade } = props;
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
            <Button variant="link" className="text-dark me-2 p-0" onClick={() => getModal(item)}><FontAwesomeIcon icon={faEye} className="" /></Button>
            <Button variant="link" className="text-dark me-2 p-0"><FontAwesomeIcon icon={faEdit} className="" /></Button>
            <Button variant="link" className="text-danger me-2 p-0"><FontAwesomeIcon icon={faTrashAlt} className="" /></Button>
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
                <th className="border-bottom">Validade</th>
                <th className="border-bottom"></th>
              </tr>
            </thead>
            <tbody>
              {estoque.map(t => <TableRow key={`transaction-${t.uuid}`} {...t} />)}
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