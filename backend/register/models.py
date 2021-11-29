from django.db import models
import sys
from io import BytesIO
from django.utils import timezone
from PIL import Image
from smart_selects.db_fields import ChainedForeignKey
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.utils.translation import ugettext_lazy as _
from accounts.models import MyUser

from .constant_choice import *
from utils.constants import *

# Create your models here.
class Language(models.Model):
    language_name = models.CharField(_('Tên Ngôn ngữ'), help_text=_(
        'Ngôn ngữ của Quốc gia'), max_length=50)
    language_code = models.CharField(
        _('Mã'), help_text=_('Mã theo i18n'), max_length=3)
    language_en_name = models.CharField(
        _('Tên quốc tế'), help_text=_('Tên theo tiếng anh'), max_length=50)
    language_flag_small_url = models.ImageField(_('Hình ảnh'), help_text=_(
        'Hình ảnh minh hoạ'), null=True, blank=True, upload_to='flags')
    language_flag_medium_url = models.ImageField(_('Hình ảnh'), help_text=_(
        'Hình ảnh minh hoạ'), null=True, blank=True, upload_to='flags')

    def __str__(self):
        return self.language_name

class Country(models.Model):
    country_name = models.CharField(
        _('Name'), help_text=_('Country name'), max_length=50)
    country_code = models.CharField(
        _('Postal code'), help_text=_('Country code'), max_length=12)
    country_en_name = models.CharField(
        _('International Name'), help_text=_('International Name'), max_length=50)

    def __str__(self):
        return self.country_en_name

    class Meta:
        verbose_name = _("Country")
        verbose_name_plural = _("Countries")


class Province(models.Model):
    province_name = models.CharField(
        _('Name'), help_text=_('Province name'), max_length=50)
    province_code = models.CharField(
        _('Postal code'), help_text=_('Postal code'), max_length=12)
    province_en_name = models.CharField(
        _('International Name'), help_text=_('International Name'), max_length=50)
    country = models.ForeignKey(
        Country, on_delete=models.CASCADE, default=None, related_name='province')

    def __str__(self):
        return self.province_en_name

    class Meta:
        verbose_name = _("Province")
        verbose_name_plural = _("Provinces")


class District(models.Model):
    district_name = models.CharField(
        _('Name'), help_text=_('District name'), max_length=50)
    district_code = models.CharField(
        _('Postal code'), help_text=_('Postal code'), max_length=12)
    district_en_name = models.CharField(
        _('International Name'), help_text=_('International Name'), max_length=50)
    province = models.ForeignKey(
        Province, on_delete=models.CASCADE, default=None, related_name='province')

    def __str__(self):
        return self.district_en_name

    class Meta:
        verbose_name = _("District")
        verbose_name_plural = _("Districts")


class Church(models.Model):

    church_name = models.CharField(verbose_name=_(
        'Church Name'), help_text=_('Church Name'), max_length=120)
    church_sub_name = models.CharField(verbose_name=_(
        'Church Sub Name'), help_text=_('Church Sub Name'), max_length=120)
    church_brief_description = models.CharField(verbose_name=_(
        'Brief discription'), help_text=_('Brief discription'), default='', blank=True, max_length=500)
    church_image = models.ImageField(verbose_name=_('Profile image'), help_text=_(
        'Profile Image'), null=True, blank=True, upload_to='church_images')
    church_external_image = models.CharField(verbose_name=_('Image Link'), help_text=_(
        'External Image Link'), blank=True, default="", max_length=200)
    church_address = models.CharField(verbose_name=_(
        'Address'), help_text=_('Address'), max_length=255)
    church_map_link = models.CharField(verbose_name=_(
        'Map Link'), help_text=_('Map Link'), max_length=255)
    church_url = models.CharField(verbose_name=_('Web adress'), help_text=_(
        'Website adress'), max_length=100, default='', blank=True)
    church_phone = models.CharField(verbose_name=_('Phone number'), help_text=_(
        'Phone number'), max_length=15, default='', blank=True)
    church_email = models.CharField(verbose_name=_('Email'), help_text=_(
        'Email address'), max_length=50, default='', blank=True)
    church_language_main = models.CharField(_('Ngôn ngữ'), help_text=_(
        'Ngôn ngữ'), max_length=15, choices=language_choice)
    church_total_seats = models.SmallIntegerField(
        _('Total seats'), help_text=_('Chapel total seats capable'), default=50)
    church_country = models.ForeignKey(
        Country, blank=True, null=True,
        verbose_name=_('Country'),
        help_text=_('Belong to country'),
        on_delete=models.CASCADE,
        related_name="church_reversed"
    )
    church_province = ChainedForeignKey(
        Province,
        verbose_name=_('Province'),
        chained_field="country",
        chained_model_field="country",
        show_all=False,
        auto_choose=True,
        sort=True,
        blank=True,
        null=True,
        related_name="church_reversed",
        on_delete=models.CASCADE
    )
    church_district = ChainedForeignKey(
        District,
        verbose_name=_('District'),
        chained_field="province",
        chained_model_field="province",
        show_all=False,
        auto_choose=True,
        sort=True,
        blank=True,
        null=True,
        related_name="church_reversed",
        on_delete=models.CASCADE)
    church_notice_on_map = models.CharField(verbose_name=_('Brief inform on map'), help_text=_(
        'Brief inform on map'), blank=True, default="", max_length=500)
    church_lon = models.FloatField(verbose_name=_('Churchs longtitue'), help_text=_(
        'Churchs longtitue acorrding Google'), default=0.0, blank=True, null=True)
    church_lat = models.FloatField(verbose_name=_('Churchs latitue'), help_text=_(
        'Churchs latitue acorrding Google'), default=0.0, blank=True, null=True)
    church_geo_hash = models.CharField(verbose_name=_(
        'geo_hash'), max_length=30, default='', blank=True)
    church_register_user = models.ForeignKey(MyUser, verbose_name=_(
        'Created User'), on_delete=models.CASCADE, default=None, blank=True, null=True)
    church_update_user = models.ForeignKey(MyUser, verbose_name=_(
        'Last updated User'), on_delete=models.CASCADE, default=None, blank=True, null=True, related_name='church_update_user')
    church_update_date = models.DateTimeField(verbose_name=_(
        'Last updated date'), help_text=_('Last updated date'), default=timezone.now)

    def __str__(self):
        return self.church_name

    def save(self, *args, **kwargs):
        if not self.id:
            if(self.church_image):
                self.church_image = self.compressImage(self.church_image)
        super(Church, self).save(*args, **kwargs)

    def compressImage(self, church_image):
        imageTemproary = Image.open(church_image)
        outputIoStream = BytesIO()
        imageTemproaryResized = imageTemproary.resize((720, 420))
        imageTemproaryResized.save(outputIoStream, format='PNG', quality=60)
        outputIoStream.seek(0)
        mass_image = InMemoryUploadedFile(outputIoStream, 'ImageField', "%s.png" % church_image.name.split(
            '.')[0], 'image/png', sys.getsizeof(outputIoStream), None)
        return mass_image

class ChurchSeat(models.Model):
    church_seat_no = models.CharField(
        _('Số ghế'), help_text=_('Số ghế'), max_length=4)
    church_seat_type = models.CharField(_('Kiểu ghế'), help_text=_(
        'Kiểu ghế'), max_length=30, choices=seat_choice, blank=False)
    church_seat_church = models.ForeignKey(
        Church, on_delete=models.SET_NULL, null=True, help_text=_('Select Church'))

    def __str__(self):
        return f'{self.church_seat_church.church_name} : {self.church_seat_no}'


class MassSchedule(models.Model):
    mass_church = models.ForeignKey(
        Church, on_delete=models.SET_NULL, null=True, help_text=_('Select Church'), related_name='massSchedules')
    mass_week_day = models.CharField(_('Ngày trong tuần'), help_text=_(
        'Ngày trong tuần (Mon-Sun)=(0-6)'), choices=week_day_choice, max_length=10)
    mass_time = models.TimeField(_('Giờ'), help_text=_('thời gian'))
    mass_language = models.CharField(_('Ngôn ngữ'), help_text=_(
        'Ngôn ngữ'), max_length=15, choices=language_choice)

    def __str__(self):
        return f'{self.mass_church.church_name}-{self.get_mass_week_day_display()}-{self.mass_time}-{self.get_mass_language_display()}'


class ConfessionSchedule(models.Model):
    con_church = models.ForeignKey(
        Church, on_delete=models.SET_NULL, null=True, help_text=_('Select Church'))
    con_week_day = models.CharField(_('Ngày trong tuần'), help_text=_(
        'Ngày trong tuần (Mon-Sun)=(0-6)'), choices=week_day_choice, max_length=10)
    con_start_time = models.TimeField(
        _('Bắt đầu'), help_text=_('thời gian bắt đầu'))
    con_end_time = models.TimeField(
        _('Kết thúc'), help_text=_('thời gian kết thúc'))
    con_language = models.CharField(_('Ngôn ngữ'), help_text=_(
        'Ngôn ngữ'), max_length=15, choices=language_choice)
    con_father = models.ForeignKey(MyUser, verbose_name=_(
        'Cha giải tội'), on_delete=models.CASCADE, default=None, blank=True, null=True, related_name='con_father')
    con_update_date = models.DateTimeField(
        _('Last updated date'), default=timezone.now)
    con_status = models.BooleanField(_('Status'), help_text=_(
        'Active status'), default=True, blank=True, null=True)

    def __str__(self):
        return f'{self.con_church.church_name}-{self.get_con_week_day_display()}-{self.con_time}-{self.get_con_language_display()}'

class MassTime(models.Model):
    mass_type = (
        ('NORMAL', _('Weekday')),
        ('SUNDAY', _('Sunday')),
        ('SPECIAL', _('Special')),
        ('Ceremony', _('Ceremony')),
        ('OTHER', _('Others'))
    )
    mass_time_title = models.CharField(_('Tiêu đề'), help_text=_(
        'Tiêu đề'), max_length=255, null=True, blank=True)
    mass_date = models.DateTimeField(_('Thời gian'), help_text=_(
        'Thời điểm bắt đầu'), null=True, blank=True)
    mass_time = models.DateTimeField(_('Thời gian'), help_text=_(
        'Thời điểm kết thúc'), null=True, blank=True)
    mass_time_language = models.CharField(
        _('Ngôn ngữ'), max_length=15, choices=language_choice, default="vi", help_text=_('Ngôn ngữ sử dụng'))
    mass_time_type = models.CharField(
        _('Mass type'), max_length=15, choices=mass_type, default="NORMAL", help_text=_('Kiểu Thánh Lễ'))
    mass_time_date_ordinary = models.CharField(
        _('Tuần Phụng vụ'), help_text=_('Tuần phụng vụ'), max_length=4, default="0")
    mass_time_church = models.ForeignKey(
        Church, on_delete=models.CASCADE, help_text=_('Tên nhà thờ'))
    mass_time_created_user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    mass_time_updated_user = models.ForeignKey(
        MyUser, on_delete=models.CASCADE, default=None, blank=True, null=True, related_name='mass_time_updated_user')
    mass_time_last_updated_date = models.DateTimeField(
        _('Ngày cập nhật'), help_text=_('Lần cuối cập nhật'), default=timezone.now)
    mass_time_status = models.BooleanField(_('Status'), help_text=_(
        'Approve status'), default=True, blank=True, null=True)

    class Meta:
        verbose_name = _('MassTime')
        verbose_name_plural = _('MassTime')
        ordering = ('mass_date',)

    def __str__(self):
        return f'{self.mass_time_title} : {self.mass_time_language}'

class Mass(models.Model):
    mass_date = models.DateField(
        _('Ngày'), help_text=_('Ngày diễn ra Thánh Lễ'))
    mass_time = models.TimeField(_('Giờ'), help_text=_('thời gian'))
    mass_schedule = models.ForeignKey(MassSchedule, help_text=_(
        'Lựa chọn lịch xếp Lễ'), on_delete=models.SET_NULL, null=True)
    mass_title = models.CharField(_('Chủ đề'), help_text=_(
        'Tiêu đề của sự kiện'), max_length=50)
    mass_language = models.CharField(_('Ngôn ngữ'), help_text=_(
        'Ngôn ngữ'), max_length=15, choices=language_choice)
    mass_date_ordinary = models.CharField(
        _('Tuần phụng vụ'), help_text=_('Tuần phụng vụ'), max_length=3)
    mass_father_celebrant = models.ForeignKey(MyUser, verbose_name=_('Cha chủ tế'), help_text=_(
        'Cha chủ tế'), on_delete=models.CASCADE, blank=True, null=True, related_name="mass_father")
    mass_church = models.ForeignKey(Church, on_delete=models.CASCADE, help_text=_(
        'chọn Nhà thờ'), blank=True, null=True)
    mass_slots = models.SmallIntegerField(
        _('Số chỗ'), help_text=_('Số chỗ'), default=100)
    mass_slots_registered = models.SmallIntegerField(_('Số đăng ký'), help_text=_(
        'Số người đăng ký'), default=0, blank=True, null=True)
    mass_slots_attended = models.SmallIntegerField(_('Số tham dự'), help_text=_(
        'Số người tham dự'), default=0, blank=True, null=True)
    mass_waiting = models.SmallIntegerField(_('Số người đang đợi'), help_text=_(
        'Số người đang đợi'), default=0, blank=True, null=True)
    mass_total_registered = models.SmallIntegerField(_('Tổng số đăng ký'), help_text=_(
        'Tổng số người đăng ký bao gồm cả người huỷ'), default=0, blank=True, null=True)
    mass_online_url = models.URLField(_('Link trực tuyến'), help_text=_(
        'Link trực tuyến'), blank=True, null=True)
    mass_image = models.ImageField(_('Hình ảnh'), help_text=_(
        'Hình ảnh minh hoạ'), null=True, blank=True, upload_to='mass_images')
    mass_last_updated_date = models.DateTimeField(_('Ngày cập nhật'), help_text=_(
        'Lần cuối cập nhật'), default=timezone.now, blank=True, null=True)
    mass_created_user = models.ForeignKey(MyUser, on_delete=models.CASCADE, help_text=_(
        'Người cuối cập nhật'), blank=True, null=True, related_name="created_user")
    mass_require_flag = models.BooleanField(_('Yêu cầu đăng ký '), help_text=_(
        'Yêu cầu đăng  ký '), default=True, blank=True, null=True)
    mass_active = models.BooleanField(_('Tình trạng'), help_text=_(
        'Cho phép đăng ký'), default=True, blank=True, null=True)
    mass_waiting_flag = models.BooleanField(_('Cho phép đăng ký đợi'), help_text=_(
        'Cho phép đăng ký đợi'), default=False, blank=True, null=True)

    def __str__(self):
        return self.mass_date_ordinary + " : " + self.mass_language

    def save(self, *args, **kwargs):
        if not self.id:
            if(self.mass_image):
                self.mass_image = self.compressImage(self.mass_image)
        super(Mass, self).save(*args, **kwargs)

    def compressImage(self, mass_image):
        imageTemproary = Image.open(mass_image)
        outputIoStream = BytesIO()
        imageTemproaryResized = imageTemproary.resize((720, 420))
        imageTemproaryResized.save(outputIoStream, format='PNG', quality=60)
        outputIoStream.seek(0)
        mass_image = InMemoryUploadedFile(outputIoStream, 'ImageField', "%s.png" % mass_image.name.split(
            '.')[0], 'image/png', sys.getsizeof(outputIoStream), None)
        return mass_image


class Seat(models.Model):
    seat_no = models.CharField(_('Số ghế'), help_text=_(
        'Số ghế'), max_length=4, null=True, blank=False)
    seat_type = models.CharField(_('Kiểu ghế'), help_text=_(
        'Kiểu ghế'), max_length=30, choices=seat_choice, blank=False)
    seat_mass_schedule = models.ForeignKey(MassSchedule, on_delete=models.SET_NULL, help_text=_(
        'Mass chapel schedule'), default=None, blank=True, null=True)
    seat_status = models.CharField(_('Tình trạng'), help_text=_(
        'Chọn tình trạng'), max_length=2, default='A', choices=seat_status_choice)

    # class Meta:
    #unique_together = ('seat_no','seat_mass','seat_type')

    def __str__(self):
        # {self.seat_no} : {self.seat_type}'
        return f'{self.seat_mass_schedule.mass_church.church_name}:{self.seat_mass_schedule.mass_week_day}:{self.seat_mass_schedule.mass_time}'

class Registration(models.Model):
    registration_date = models.DateTimeField(_('Ngày đăng ký'), default=timezone.now, null=True, blank=True)
    registration_user = models.ForeignKey(MyUser, on_delete=models.CASCADE, help_text=_('Acc người đăng ký'))
    registration_user_name = models.CharField(_('Tên người đăng ký'), default='', null=True, blank=True, max_length=30)
    registration_user_age = models.SmallIntegerField(_('Tuổi'), default=0, null=True, blank=True)
    registration_mass = models.ForeignKey(Mass, on_delete=models.CASCADE, help_text=_('Thánh Lễ'))
    registration_confirm_code = models.CharField(_('Mã xác nhận đăng ký'), max_length=25, default='', blank=True)
    registration_code = models.CharField(_('Mã đăng ký'),max_length=200, default='', null=True, blank=True)
    registration_seat = models.ForeignKey(Seat, on_delete=models.SET_NULL, null=True, blank=True, help_text=_('Số ghế'))
    registration_total_seats = models.SmallIntegerField(_('Tổng số ghế'), default=1, null=True, blank=True)
    registration_status = models.CharField(_('Tình trạng đăng ký'), max_length=3, choices=status_choice, default=WAITING, null=True, blank=True)
    registration_approve_status = models.CharField(_('Tình trạng duyệt'), max_length=3, choices=status_choice, default=APPROVED, 
                                                    null=True, blank=True, help_text=_('Trạng thái được cập nhập sau khi đăng ký'))
    registration_confirm_status = models.CharField(_('Tình trạng xác nhận'), max_length=3, choices=cf_status_choice, default=NOTCONFIRM, null=True, blank=True)
    registration_last_update = models.DateTimeField(_('Cập nhật'), default=timezone.now, null=True, blank=True)
    registration_checkin = models.DateTimeField(_('Thời gian checkin'), null=True, blank=True, help_text=_('Thời gian checkin'))
    registration_last_updated_user = models.ForeignKey(MyUser, on_delete=models.CASCADE, default=None, blank=True, null=True, 
                                                        help_text=_('Người cuối duyệt'), related_name='registration_last_updated_user')
    registration_last_update_time = models.DateTimeField(default=timezone.now, null=True, blank=True, help_text=_('Thời gian cập nhập lần cuối'))

    class Meta:
        verbose_name = _('Registration')
        verbose_name_plural = _('Registration')
        ordering = ('-registration_date',)

    def __str__(self):
        # : {self.userregistration_seat}'
        return f'{self.registration_user.username}:{self.registration_user.userprofile.profile_full_name}:{self.registration_status}'
