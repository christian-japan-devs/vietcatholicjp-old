import sys
from django.utils.crypto import get_random_string
from django.core.mail import EmailMultiAlternatives
from .constants import CODERANGE, FROM_EMAIL

def send_email_to(to_user, subject, text_content, html_content):
    try:
        msg = EmailMultiAlternatives(
            subject, text_content, FROM_EMAIL, [to_user])
        msg.attach_alternative(html_content, "text/html")
        msg.send()
    except:
        print("Send email error: ", sys.exc_info()[0])


def userRequestResetPass(user, user_name, email):
    try:
        random_code = get_random_string(length=18, allowed_chars=CODERANGE)
        userprofile = user.userprofile
        userprofile.profile_code = random_code
        userprofile.save()
        subject = _('CatholicVietJp, đổi mật khẩu.')
        text_content = _("Xin chào bạn. bạn nhận được email này vì đã yêu cầu đặt lại mật khẩu cho tài khoản đăng nhập của bạn tại trang catholicviet.jp. Xin nhấp vào đường dẫn phía dưới để cập nhật mật khẩu mới. Nếu không phải bạn xin vui lòng bỏ qua.")
        text_content += '  https://www.catholicviet.jp/account/reset-password/?username=' + \
            user_name+'&code='+random_code
        html_content = '<h5>Xin chào.<h5><br><p>Bạn nhận được email này vì đã yêu cầu đặt lại mật khẩu cho tài khoản đăng nhập của bạn tại trang catholicviet.jp.</p> <p>Xin nhấp vào nút cập nhật mật khẩu mới phía dưới.</p><p>Nếu không phải bạn xin vui lòng bỏ qua.<p><br><h5>Chúc bạn một ngày an lành. Công giáo Việt Nam tại Nhật Bản,<h5><br>'
        html_content += '<a href=" https://www.catholicviet.jp/account/reset-password/?username='+user_name+'&code='+random_code + \
            '"><button style="background: #f54642;width: 100%;padding: 1rem 0rem;border: none; color: white;cursor: pointer;border-radius: 30px;font-weight: bolder;font-size: 1rem;">Đổi Mật Khẩu</button></a>'
        send_email_to(email, subject, text_content, html_content)
        return True
    except:
        return False

# send account confirm email when user create an account
def sendConfirmEmailToUser(user):
    try:
        random_code = get_random_string(length=18, allowed_chars=CODERANGE)
        userprofile = user.userprofile
        userprofile.profile_code = random_code
        userprofile.profile_account_confimred = True
        userprofile.save()
        email = user.email
        user_name = user.username
        subject = _('CatholicVietJp, Xác nhận tài khoản.')
        text_content = _("Xin chào bạn. bạn nhận được email này vì đã yêu cầu đặt lại mật khẩu cho tài khoản đăng nhập của bạn tại trang Nessei.com. Xin nhấp vào đường dẫn phía dưới để cập nhật mật khẩu mới. Nếu không phải bạn xin vui lòng bỏ qua.")
        text_content += '  https://www.catholicviet.jp/account/confirm/?username=' + \
            user_name+'&code='+random_code
        html_content = '<h5>Xin chào.<h5><br><p>Bạn nhận được email này vì đã dùng email này để tạo tài khoản tại trang catholicviet.jp.</p> <p>Xin nhấp vào nút xác thực phía dưới.</p><p>Nếu không phải bạn xin vui lòng bỏ qua.<p><br><h5>Chúc bạn một ngày an lành. Công giáo Việt Nam tại Nhật Bản<h5><br>'
        html_content += '<a href=" https://www.catholicviet.jp/account/confirm/?username='+user_name+'&code='+random_code + \
            '"><button style="background: #f54642;width: 100%;padding: 1rem 0rem;border: none; color: white;cursor: pointer;border-radius: 30px;font-weight: bolder;font-size: 1rem;">Xác thực</button></a>'
        send_email_to(email, subject, text_content, html_content)
        return True
    except:
        return False
