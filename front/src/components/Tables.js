
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faArrowDown, faArrowUp, faEdit, faEllipsisH, faExternalLinkAlt, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Nav, Card, Image, Button, Table, Dropdown, ProgressBar, Pagination, ButtonGroup, Modal, Form, Badge } from '@themesberg/react-bootstrap';
import { Link, useHistory } from 'react-router-dom';

import { Routes } from "../routes";
import { pageVisits, pageTraffic, pageRanking } from "../data/tables";
import commands from "../data/commands";
import api from "../pages/authentication/api";
import ReactPaginate from 'react-paginate';
import { ModalEntradas } from "./ModalEntradas";


const ValueChange = ({ value, suffix }) => {
  const valueIcon = value < 0 ? faAngleDown : faAngleUp;
  const valueTxtColor = value < 0 ? "text-danger" : "text-success";

  return (
    value ? <span className={valueTxtColor}>
      <FontAwesomeIcon icon={valueIcon} />
      <span className="fw-bold ms-1">
        {Math.abs(value)}{suffix}
      </span>
    </span> : "--"
  );
};

export const PageVisitsTable = () => {
  const TableRow = (props) => {
    const { pageName, views, returnValue, bounceRate } = props;
    const bounceIcon = bounceRate < 0 ? faArrowDown : faArrowUp;
    const bounceTxtColor = bounceRate < 0 ? "text-danger" : "text-success";

    return (
      <tr>
        <th scope="row">{pageName}</th>
        <td>{views}</td>
        <td>${returnValue}</td>
        <td>
          <FontAwesomeIcon icon={bounceIcon} className={`${bounceTxtColor} me-3`} />
          {Math.abs(bounceRate)}%
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5>Page visits</h5>
          </Col>
          <Col className="text-end">
            <Button variant="secondary" size="sm">See all</Button>
          </Col>
        </Row>
      </Card.Header>
      <Table responsive className="align-items-center table-flush">
        <thead className="thead-light">
          <tr>
            <th scope="col">Page name</th>
            <th scope="col">Page Views</th>
            <th scope="col">Page Value</th>
            <th scope="col">Bounce rate</th>
          </tr>
        </thead>
        <tbody>
          {pageVisits.map(pv => <TableRow key={`page-visit-${pv.id}`} {...pv} />)}
        </tbody>
      </Table>
    </Card>
  );
};

export const PageTrafficTable = () => {
  const TableRow = (props) => {
    const { id, source, sourceIcon, sourceIconColor, sourceType, category, rank, trafficShare, change } = props;

    return (
      <tr>
        <td>
          <Card.Link href="#" className="text-primary fw-bold">{id}</Card.Link>
        </td>
        <td className="fw-bold">
          <FontAwesomeIcon icon={sourceIcon} className={`icon icon-xs text-${sourceIconColor} w-30`} />
          {source}
        </td>
        <td>{sourceType}</td>
        <td>{category ? category : "--"}</td>
        <td>{rank ? rank : "--"}</td>
        <td>
          <Row className="d-flex align-items-center">
            <Col xs={12} xl={2} className="px-0">
              <small className="fw-bold">{trafficShare}%</small>
            </Col>
            <Col xs={12} xl={10} className="px-0 px-xl-1">
              <ProgressBar variant="primary" className="progress-lg mb-0" now={trafficShare} min={0} max={100} />
            </Col>
          </Row>
        </td>
        <td>
          <ValueChange value={change} suffix="%" />
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm mb-4">
      <Card.Body className="pb-0">
        <Table responsive className="table-centered table-nowrap rounded mb-0">
          <thead className="thead-light">
            <tr>
              <th className="border-0">#</th>
              <th className="border-0">Traffic Source</th>
              <th className="border-0">Source Type</th>
              <th className="border-0">Category</th>
              <th className="border-0">Global Rank</th>
              <th className="border-0">Traffic Share</th>
              <th className="border-0">Change</th>
            </tr>
          </thead>
          <tbody>
            {pageTraffic.map(pt => <TableRow key={`page-traffic-${pt.id}`} {...pt} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export const RankingTable = () => {
  const TableRow = (props) => {
    const { country, countryImage, overallRank, overallRankChange, travelRank, travelRankChange, widgetsRank, widgetsRankChange } = props;

    return (
      <tr>
        <td className="border-0">
          <Card.Link href="#" className="d-flex align-items-center">
            <Image src={countryImage} className="image-small rounded-circle me-2" />
            <div><span className="h6">{country}</span></div>
          </Card.Link>
        </td>
        <td className="fw-bold border-0">
          {overallRank ? overallRank : "-"}
        </td>
        <td className="border-0">
          <ValueChange value={overallRankChange} />
        </td>
        <td className="fw-bold border-0">
          {travelRank ? travelRank : "-"}
        </td>
        <td className="border-0">
          <ValueChange value={travelRankChange} />
        </td>
        <td className="fw-bold border-0">
          {widgetsRank ? widgetsRank : "-"}
        </td>
        <td className="border-0">
          <ValueChange value={widgetsRankChange} />
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
              <th className="border-0">Country</th>
              <th className="border-0">All</th>
              <th className="border-0">All Change</th>
              <th className="border-0">Travel & Local</th>
              <th className="border-0">Travel & Local Change</th>
              <th className="border-0">Widgets</th>
              <th className="border-0">Widgets Change</th>
            </tr>
          </thead>
          <tbody>
            {pageRanking.map(r => <TableRow key={`ranking-${r.id}`} {...r} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export const TransactionsTable = () => {
  const [resultsPerPage] = useState(10);
  const [resultsTotal, setResultsTotal] = useState(0);
  const [offset, setOffset] = useState(1);
  const [pageCount, setPageCount] = useState(0)

  const [instance_obj, setObjectModal] = useState({});
  const [showDefault, setShowDefault] = useState(false);
  const handleClose = () => setShowDefault(false);
  const hist = useHistory();

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setOffset(selectedPage + 1);
  };

  const getModal = (item) => {
    setObjectModal(item);
    setShowDefault(true);
  }

  const getPageEdit = (uuid) => {
    hist.push('/estoque-atual/edit?uuid=' + uuid) 
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
  }, [offset]);
  const getBemConsumo = (is_bem_de_consumo) => {
    if (is_bem_de_consumo) {
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
            {getBemConsumo(is_bem_de_consumo)}
          </span>
        </td>
        <td>
          <Button variant="link" className="text-dark me-2 p-0" onClick={() => getModal(uuid)}><FontAwesomeIcon icon={faEye} className="" /></Button>
          <Button variant="link" className="text-dark me-2 p-0" onClick={() => getPageEdit(uuid)}><FontAwesomeIcon icon={faEdit} className="" /></Button>
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
              <th className="border-bottom">Código</th>
              <th className="border-bottom">Descrição</th>
              <th className="border-bottom">Grupo</th>
              <th className="border-bottom">Quantidade</th>
              <th className="border-bottom">É bem de consumo</th>
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
      {ModalEntradas(showDefault, instance_obj, handleClose)}
    </Card>
  );
};

export const CommandsTable = () => {
  const TableRow = (props) => {
    const { name, usage = [], description, link } = props;

    return (
      <tr>
        <td className="border-0" style={{ width: '5%' }}>
          <code>{name}</code>
        </td>
        <td className="fw-bold border-0" style={{ width: '5%' }}>
          <ul className="ps-0">
            {usage.map(u => (
              <ol key={u} className="ps-0">
                <code>{u}</code>
              </ol>
            ))}
          </ul>
        </td>
        <td className="border-0" style={{ width: '50%' }}>
          <pre className="m-0 p-0">{description}</pre>
        </td>
        <td className="border-0" style={{ width: '40%' }}>
          <pre><Card.Link href={link} target="_blank">Read More <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-1" /></Card.Link></pre>
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Body className="p-0">
        <Table responsive className="table-centered rounded" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          <thead className="thead-light">
            <tr>
              <th className="border-0" style={{ width: '5%' }}>Name</th>
              <th className="border-0" style={{ width: '5%' }}>Usage</th>
              <th className="border-0" style={{ width: '50%' }}>Description</th>
              <th className="border-0" style={{ width: '40%' }}>Extra</th>
            </tr>
          </thead>
          <tbody>
            {commands.map(c => <TableRow key={`command-${c.id}`} {...c} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};