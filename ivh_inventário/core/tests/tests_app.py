from ivh_inventário.core.apps import CoreConfig


def test_app_name():
    assert CoreConfig.name == 'ivh_inventário.core'
