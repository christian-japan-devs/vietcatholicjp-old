from django.contrib import admin
from .models import  Country, Province, District
from .models import Church, MassSchedule, ChurchSeat, Registration, Mass, Seat

# Register your models here.
admin.site.site_header = 'VietCatholicJP'
admin.site.site_title = 'Vietcatholic JP Admintration side'
admin.index_title = 'VietCatholicJP'
admin.site_url = '/admin'


# Register your models here.
PAGE_SIZE = 30
# Helper classes

admin.site.register(Country)
admin.site.register(Province)
admin.site.register(District)
admin.site.register(Church)
admin.site.register(MassSchedule)
admin.site.register(ChurchSeat)
admin.site.register(Mass)
admin.site.register(Seat)
admin.site.register(Registration)