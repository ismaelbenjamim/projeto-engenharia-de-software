
const [showDelete, setShowDelete] = useState(false);
const CloseDelete = () => setShowDelete(false);

const ObjectDelete = (instance_obj) => {
    const callDelete = () => {
      api.delete('saidas/saida/' + instance_obj.uuid).then((res) => {
        ObjectListReload();
        CloseDelete();
      });
    }
    return(
      <Form onSubmit={(e) => { callDelete(); e.preventDefault(); }}>
        <h4>Você tem certeza que deseja deletar a saida: <br/>{instance_obj.uuid}?</h4>
        <Button variant="danger" className="mt-3" type="submit">Deletar saida</Button>
      </Form>
    )
  }

  const getModalDelete = () => {
    return (
      <Modal as={Modal.Dialog} size="lg" centered show={showDelete} onHide={CloseDelete}>
        <Modal.Header>
          <Modal.Title className="h6">Deletar saida</Modal.Title>
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