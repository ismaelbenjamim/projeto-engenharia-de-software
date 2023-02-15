import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Col, Container, Form, InputGroup, Row, ThemeProvider } from 'react-bootstrap';

function App() {
  return (
    <ThemeProvider breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']} minBreakpoint="xxs">
      <header className='Login-Body'>
      <Container fluid>
        <Row className='align-items-center vh-100'>
          <Col className='col-4 mx-auto'>
          <Card className='shadow border'>
            <Card.Body className='align-items-center'>
              <Row>
                <Col lg={12} className="text-center">
                  <p className='mt-5 mb-4 h2'>Logo</p>
                  <p>Autenticação de usuário</p>
                </Col>
              </Row>
              <Form>
                <Row className="m-4">
                <Col lg={12} className="mb-4">
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Usuário</Form.Label>
                    <Form.Control type="text" placeholder="Usuário" />
                  </Form.Group>
                </Col>
                <Col lg={12} className="mb-4">
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control type="password" rows={3} placeholder="Senha" />
                </Form.Group>
                </Col>
                <Col lg={12} className="mb-4">
                  <a href='#'>Esqueceu a senha?</a>
                </Col>
                <Col className='mb-2'>
                  <Button className='col-12'>Entrar</Button>
                </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
          </Col>
        </Row>
      </Container>
      </header>
    </ThemeProvider>
  );
}

export default App;
