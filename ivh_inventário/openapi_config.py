from drf_yasg.generators import OpenAPISchemaGenerator

from ivh_inventário import settings


class HttpsSchemaGenerator(OpenAPISchemaGenerator):
    def get_schema(self, request=None, public=False):
        schema = super().get_schema(request, public)
        schema.schemes = ["https", "http"]
        return schema
