import React from "react";
import { faCheck, faCog, faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Form, Button, ButtonGroup, Breadcrumb, InputGroup, Dropdown } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UsuarioTable } from "../../components/usuario/UsuarioTable";

export const ListUsuario = () => {
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>IVH Iventário</Breadcrumb.Item>
            <Breadcrumb.Item active>Usuários</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Usuários</h4>
          <p className="mb-0">Lista de usuários cadastrados no sistema.</p>
        </div>
      </div>
      <UsuarioTable />
    </>
  );
};
