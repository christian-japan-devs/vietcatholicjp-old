from django.contrib import admin

from admin_auto_filters.filters import AutocompleteFilter
from django_admin_listfilter_dropdown.filters import RelatedDropdownFilter
from .models import UserProfile, Country, Province, District
from .models import Church, MassSchedule, ChurchSeat, Registration, Mass, Seat

# Register your models here.
admin.site.site_header = 'VietCatholicJP'
admin.site.site_title = 'Vietcatholic JP Admintration side'
admin.index_title = 'VietCatholicJP'
admin.site_url = '/admin'


# Register your models here.
PAGE_SIZE = 30
# Helper classes

class StatusAdminFilter(AutocompleteFilter):
    title = 'Status Fitler'
    field_name = 'status'


class CountryAdminFilter(AutocompleteFilter):
    title = 'Country Filter'
    field_name = 'country'    # name of the foreign key field


class ProvinceAdminFilter(AutocompleteFilter):
    title = 'Province Filter'
    field_name = 'province'


class ChurchBase(admin.ModelAdmin):
    class Meta:
        abstract = True

    list_display = ('church_name', 'church_brief_description',
                    'church_country')
    search_fields = ('name__unaccent', )
    list_per_page = PAGE_SIZE


class CountryAdmin(admin.ModelAdmin):
    # this is required for django's autocomplete functionality
    search_fields = ['country_name', 'country_en_name']
    URL_CUSTOM_TAG = 'country'
    list_per_page = PAGE_SIZE


class ProvinceAdmin(admin.ModelAdmin):
    search_fields = ['province_name', 'province_en_name']
    list_filter = [CountryAdminFilter]
    list_per_page = PAGE_SIZE


class DistrictAdmin(admin.ModelAdmin):
    search_fields = ['district_name', 'district_en_name']
    list_filter = [('province__country', RelatedDropdownFilter),
                   ProvinceAdminFilter]
    URL_CUSTOM_TAG = 'district'
    list_per_page = PAGE_SIZE

admin.site.register(Country, CountryAdmin)
admin.site.register(Province, ProvinceAdmin)
admin.site.register(District, DistrictAdmin)
admin.site.register(UserProfile)
admin.site.register(Church)
admin.site.register(MassSchedule)
admin.site.register(ChurchSeat)
admin.site.register(Mass)
admin.site.register(Seat)
admin.site.register(Registration)