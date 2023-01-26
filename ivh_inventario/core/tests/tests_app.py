from ivh_inventario.core.apps import CoreConfig


def test_app_name():
    assert CoreConfig.name == 'ivh_inventario.core'
