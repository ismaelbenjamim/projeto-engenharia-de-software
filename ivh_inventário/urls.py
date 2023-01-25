from django.contrib import admin
from django.urls import path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from ivh_inventário.openapi_config import HttpsSchemaGenerator

schema_view = get_schema_view(
    openapi.Info(
      title="IVH Inventário",
      default_version='v1',
      description="Sistema de gestão de estoque do Instituto Vitória Humana",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="barros.ismael@outlook.com"),
      license=openapi.License(name="CC BY-NC-ND"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    generator_class=HttpsSchemaGenerator,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
