
def documentacao(operation_summary, operation_description, response200=None, response400=None, response201=None, request_body=None, query_serializer=None, metodo=None):
    docs = {
        f'{metodo}': {
            'operation_summary': operation_summary,
            'operation_description': operation_description,
            'request_body': request_body,
            'query_serializer': query_serializer,
            'responses': {
                '200': response200,
                '201': response201,
                '400': response400
            }

        }
    }
    return docs