from drf_yasg.generators import OpenAPISchemaGenerator

from ivh_inventario import settings


class HttpsSchemaGenerator(OpenAPISchemaGenerator):
    def get_schema(self, request=None, public=False):
        schema = super().get_schema(request, public)
        schema.schemes = ["http", "https"]
        return schema
