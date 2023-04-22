from django.core.mail import EmailMultiAlternatives
from django.template import loader
import os


from ivh_inventario.settings import SITE_DOMINIO, SITE_EMAIL


def enviar_email_template(usuario, titulo, html, dados):
    html_message = loader.render_to_string(
        f'email/{html}.html',
        {
            'dominio': SITE_DOMINIO,
            'dados': dados
        }
    )
    enviar = EmailMultiAlternatives(titulo, html_message, SITE_EMAIL, [usuario.email])
    enviar.mixed_subtype = 'related'
    enviar.attach_alternative(html_message, "text/html")
    #fp = open("static/logo/logo.png", 'rb')
    #msg_img = MIMEImage(fp.read())
    #fp.close()
    #msg_img.add_header('Content-ID', '<{}>'.format("logo.png"))
    #enviar.attach(msg_img)
    enviar.send(fail_silently=True)


def enviar_email_xls(usuario, titulo, html, dados, arquivo):
    html_message = loader.render_to_string(
        f'email/{html}.html',
        {
            'dominio': SITE_DOMINIO,
            'dados': dados
        }
    )
    enviar = EmailMultiAlternatives(titulo, html_message, SITE_EMAIL, [usuario.email])
    enviar.attach_file(arquivo)
    enviar.mixed_subtype = 'related'
    enviar.attach_alternative(html_message, "text/html")
    enviar.send(fail_silently=True)

    os.remove(arquivo)
