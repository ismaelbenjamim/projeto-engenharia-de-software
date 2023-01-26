from django.contrib import admin
from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions, routers

from ivh_inventario.entrada.api.viewsets import CRUDEntradaViewSet
from ivh_inventario.estoque.api.viewsets import CRUDEstoqueViewSet
from ivh_inventario.openapi_config import HttpsSchemaGenerator
from ivh_inventario.saida.api.viewsets import CRUDSaidaViewSet
from ivh_inventario.usuario.api.viewsets import UsuarioLoginViewSet, CRUDUsuarioViewSet, UsuarioCadastroViewSet

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

router = routers.DefaultRouter()

router.register('entradas/entrada', CRUDEntradaViewSet, basename='CRUD de entrada')

router.register('saidas/saida', CRUDSaidaViewSet, basename='CRUD de saida')

router.register('estoques/estoque', CRUDEstoqueViewSet, basename='CRUD de estoque')

router.register('usuarios/usuario', CRUDUsuarioViewSet, basename='CRUD de usuário')
router.register('usuarios/cadastro', UsuarioCadastroViewSet, basename='cadastro do usuário')



APIs = [
    path('login/', UsuarioLoginViewSet.as_view()),

]

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/', include(APIs)),
    path('admin/', admin.site.urls),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
