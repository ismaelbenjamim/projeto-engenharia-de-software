import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faCartArrowDown, faChartPie, faChevronDown, faClipboard, faCommentDots, faFileAlt, faPlus, faRocket, faStore } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Dropdown } from '@themesberg/react-bootstrap';
import { UsuarioAlterarSenha } from "../../components/usuario/UsuarioAlterarSenha";


export const AlterarSenha = () => {
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
      </div>
      
      <Row>
        <Col xs={12} xl={12}>
          <UsuarioAlterarSenha />
        </Col>
      </Row>
    </>
  );
};
