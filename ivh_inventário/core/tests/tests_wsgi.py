import os

from django.core.handlers.wsgi import WSGIHandler

from ivh_inventário.wsgi import application


def test_wsgi_default_settings():
    assert 'ivh_inventário.settings' == os.environ["DJANGO_SETTINGS_MODULE"]


def test_application_instance():
    assert isinstance(application, WSGIHandler)
