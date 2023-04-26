from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions, routers

from ivh_inventario.entrada.api.viewsets import CRUDEntradaViewSet, EntradasXLSViewSet, EntradaUpdateViewSet
from ivh_inventario.item.api.viewsets import CRUDItemViewSet, ItemGruposAPI, ItemXLSViewSet
from ivh_inventario.openapi_config import HttpsSchemaGenerator
from ivh_inventario.saida.api.viewsets import CRUDSaidaViewSet, SaidasXLSViewSet, SaidaUpdateViewSet
from ivh_inventario.usuario.api.viewsets import UsuarioLoginViewSet, CRUDUsuarioViewSet, UsuarioCadastroViewSet, \
    TrocarSenhaViewSet, EsqueceuSenhaViewSet, RedefinirSenhaViewSet, UsuarioNotificacaoViewSet

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
router.register('entradas/entrada-xls', EntradasXLSViewSet, basename='entrada xls')
router.register('entradas/entrada-update', EntradaUpdateViewSet, basename='entrada upadate')
router.register('saidas/saida', CRUDSaidaViewSet, basename='CRUD de saida')
router.register('saidas/saida-xls', SaidasXLSViewSet, basename='saida xls')
router.register('saidas/saida-update', SaidaUpdateViewSet, basename='saida update')
router.register('itens/item', CRUDItemViewSet, basename='CRUD de item')
router.register('itens/item-xls', ItemXLSViewSet, basename='CRUD de item')
router.register('usuarios/usuario', CRUDUsuarioViewSet, basename='CRUD de usuário')
router.register('usuarios/cadastro', UsuarioCadastroViewSet, basename='cadastro do usuário')
router.register('usuarios/notificacao', UsuarioNotificacaoViewSet, basename='CRUD de notificacao')

APIs = [
    path('login/', UsuarioLoginViewSet.as_view()),
    path('usuarios/trocar-senha/', TrocarSenhaViewSet.as_view()),
    path('usuarios/esqueci-senha/', EsqueceuSenhaViewSet.as_view()),
    path('usuarios/redefinir-senha/', RedefinirSenhaViewSet.as_view()),
    path('itens/item-grupos/', ItemGruposAPI.as_view()),
]

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/', include(APIs)),
    path('admin/', admin.site.urls),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL,
                                                                             document_root=settings.MEDIA_ROOT)
