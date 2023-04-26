
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCog, faEnvelopeOpen, faExclamationCircle, faSearch, faSignOutAlt, faUnlockAlt, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { Row, Col, Nav, Form, Image, Navbar, Dropdown, Container, ListGroup, InputGroup } from '@themesberg/react-bootstrap';

import NOTIFICATIONS_DATA from "../data/notifications";
import Profile3 from "../assets/img/team/profile-picture-3.jpg";
import { logout } from "../pages/authentication/auth";
import { useHistory } from "react-router";
import { usuarioInfo } from "./User";
import api from "../pages/authentication/api";


export default (props) => {
  const [usuario, setUsuario] = useState({});
  if (Object.keys(usuario).length === 0) {
    usuarioInfo().then(function(res) {
      setUsuario(res[0]);
    });
  }
  
  const history = useHistory();
  const userlogout = () => {
    logout();
    history.push("/")
  }
  const userPerfil = () => {
    history.push("/perfil/")
  }
  const userChangePassword = () => {
    history.push("/perfil/change-password/")
  }

  const [notifications, setNotifications] = useState([{}]);
  const areNotificationsRead = notifications.reduce((acc, notif) => acc && notif.read, true);

  const getNotifications = () => {
    api.get('usuarios/notificacao/').then((res) => {
        const data = res.data.slice(0, 5);
        setNotifications(data);
    });
  }

  const getPhotoUser = (foto) => {
    if (foto) {
      return foto;
    } else {
      return "https://media.licdn.com/dms/image/D4D03AQG6o-a17tXYEw/profile-displayphoto-shrink_800_800/0/1669590025953?e=2147483647&v=beta&t=EFVY6qvmWgb-cvz4AL7vRLAoy0e1b0zM5cweSjdIcHU";
    }
  }

  const markNotificationsAsRead = () => {
    setTimeout(() => {
      getNotifications();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }, 300);
  };


  const Notification = (props) => {
    const { link, titulo, image, time, descricao, read = false } = props;
    const readClassName = read ? "" : "text-danger";
    return (
      <ListGroup.Item action href={link} className="border-bottom border-light">
        <Row className="align-items-center">
          <Col className="col-auto">
            <FontAwesomeIcon icon={faExclamationCircle} size={"2x"} className="text-info" />
          </Col>
          <Col className="ps-0 ms--2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="h6 mb-0 text-small">{titulo}</h4>
              </div>
              <div className="text-end">
                <small className={readClassName}>{time}</small>
              </div>
            </div>
            <p className="font-small mt-1 mb-0">{descricao}</p>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  };

  return (
    <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0">
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex align-items-center">
          </div>
          <Nav className="align-items-center">
            <Dropdown as={Nav.Item} onToggle={markNotificationsAsRead} >
              <Dropdown.Toggle as={Nav.Link} className="text-dark icon-notifications me-lg-3">
                <span className="icon icon-sm">
                  <FontAwesomeIcon icon={faBell} className="bell-shake" />
                  {areNotificationsRead ? null : <span className="icon-badge rounded-circle unread-notifications" />}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-center mt-2 py-0">
                <ListGroup className="list-group-flush">
                  <Nav.Link href="#" className="text-center text-primary fw-bold border-bottom border-light py-3">
                    Notificações
                  </Nav.Link>

                  {notifications.map(n => <Notification key={`notification-${n.uuid}`} {...n} />)}

                  <Dropdown.Item className="text-center text-primary fw-bold py-3">
                    Ver tudo
                  </Dropdown.Item>
                </ListGroup>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="media d-flex align-items-center">
                  <Image src={getPhotoUser(usuario.foto)} className="user-avatar md-avatar rounded-circle" />
                  <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                    <span className="mb-0 font-small fw-bold">{usuario.first_name} {usuario.last_name}</span>
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                <Dropdown.Item className="fw-bold" onClick={userPerfil}>
                  <FontAwesomeIcon icon={faUserCircle} className="me-2" /> Meu perfil
                </Dropdown.Item>
                <Dropdown.Item className="fw-bold" onClick={userChangePassword}>
                  <FontAwesomeIcon icon={faUnlockAlt} className="me-2" /> Alterar senha
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="fw-bold" onClick={userlogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="text-danger me-2" /> Sair
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};
