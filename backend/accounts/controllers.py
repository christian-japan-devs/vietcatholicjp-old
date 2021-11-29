
from django.core.mail.message import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.translation import ugettext_lazy as _
from django.core.mail import send_mail
from vietcatholicjp.settings import EMAIL_BCC, EMAIL_FROM

def send_multi_format_email(template_prefix, template_ctxt, target_email):
    subject_file = 'authemail/%s_subject.txt' % template_prefix
    txt_file = 'authemail/%s.txt' % template_prefix
    html_file = 'authemail/%s.html' % template_prefix

    subject = render_to_string(subject_file).strip()
    from_email = EMAIL_FROM
    to = target_email
    bcc_email = EMAIL_BCC
    text_content = render_to_string(txt_file, template_ctxt)
    html_content = render_to_string(html_file, template_ctxt)
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to],
                                 bcc=[bcc_email])
    msg.attach_alternative(html_content, 'text/html')
    msg.send()