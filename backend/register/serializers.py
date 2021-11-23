from django.db import models
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from .models import ( Mass, MassTime, Registration, 
                                Country, Province, District, Church, MassSchedule, ConfessionSchedule)


class StringSerilaizer(serializers.StringRelatedField):
    def to_internal_value(self, value):
        return value

class MassScheduleSerializer(serializers.ModelSerializer):
    mass_language = serializers.SerializerMethodField()

    class Meta:
        model = MassSchedule
        fields = (
            'id', 'mass_church', 'mass_week_day', 'mass_time', 'mass_language'
        )

    def get_mass_language(self, obj):
        return obj.get_mass_language_display()

    def get_mass_week_day(self, obj):
        return obj.get_mass_week_day_display()


class ConfessionScheduleSerializer(serializers.ModelSerializer):
    con_father = serializers.ReadOnlyField(
        source='con_father.userprofile.profile_full_name')
    con_language = serializers.SerializerMethodField()

    class Meta:
        model = ConfessionSchedule
        fields = ('id', 'con_church', 'con_week_day', 'con_start_time', 'con_end_time',
                  'con_language', 'con_father', 'con_update_date', 'con_status')

    def get_con_language(self, obj):
        return obj.get_con_language_display()


class ChurchSerializer(serializers.ModelSerializer):
    massSchedules = serializers.StringRelatedField(many=True)

    class Meta:
        model = Church
        fields = (
            'id', 'church_name', 'church_sub_name', 'church_brief_description', 'church_external_image', 'church_external_image', 'massSchedules', 'church_map_link', 'church_address', 'church_url', 'church_phone', 'church_email', 'church_language_main', 'church_country', 'church_province', 'church_district',
        )

    def get_mass_language(self, obj):
        return obj.get_mass_language_display()


class ChurchDetailSerializer(serializers.ModelSerializer):
    massSchedules = serializers.StringRelatedField(many=True)

    class Meta:
        model = Church
        fields = (
            'id', 'church_name', 'church_sub_name', 'church_brief_description', 'church_external_image', 'church_external_image', 'massSchedules', 'church_map_link', 'church_address', 'church_url', 'church_phone', 'church_email', 'church_language_main', 'church_country', 'church_province', 'church_district',
        )

    def get_mass_language(self, obj):
        return obj.get_mass_language_display()


class ReMassSerializer(serializers.ModelSerializer):
    mass_reading = serializers.ReadOnlyField(source='mass_reading.id')
    mass_father_celebrant = serializers.ReadOnlyField(
        source='mass_father_celebrant.userprofile.profile_full_name')
    mass_church = serializers.ReadOnlyField(source='mass_church.church_name')

    class Meta:
        model = Mass
        fields = (
            'id', 'mass_date', 'mass_time', 'mass_title', 'mass_reading', 'mass_language', 'mass_father_celebrant', 'mass_church', 'mass_slots', 'mass_slots_registered', 'mass_waiting', 'mass_online_url', 'mass_image', 'mass_waiting_flag', 'mass_active'
        )

    def get_mass_language(self, obj):
        return obj.get_mass_language_display()


class DetailMassSerializer(serializers.ModelSerializer):
    mass_reading = serializers.ReadOnlyField(source='mass_reading.id')
    mass_father_celebrant = serializers.ReadOnlyField(
        source='mass_father_celebrant.userprofile.profile_full_name')
    mass_church = serializers.ReadOnlyField(source='mass_church.church_name')

    class Meta:
        model = Mass
        fields = (
            'id', 'mass_date', 'mass_time', 'mass_title', 'mass_reading', 'mass_language', 'mass_father_celebrant', 'mass_church', 'mass_online_url', 'mass_image'
        )

    def get_mass_language(self, obj):
        return obj.get_mass_language_display()


class RegistrationSerializer(serializers.ModelSerializer):
    registration_user = serializers.ReadOnlyField(
        source='registration_user.userprofile.profile_full_name')
    registration_mass = DetailMassSerializer()
    registration_seat = serializers.ReadOnlyField(
        source='registration_seat.seat_no')

    class Meta:
        model = Registration
        fields = (
            'id', 'registration_mass', 'registration_date', 'registration_user', 'registration_seat', 'registration_confirm_code', 'registration_status', 'registration_approve_status', 'registration_confirm_status'
        )

    def get_registration_status(self, obj):
        return obj.get_registration_status()

    def get_registration_approve_status(self, obj):
        return obj.get_registration_approve_status()

    def get_registration_confirm_status(self, obj):
        return obj.get_registration_confirm_status()

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'


class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = '__all__'


class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = '__all__'


class MassTimeSerializer(serializers.ModelSerializer):
    mass_time_church = serializers.ReadOnlyField(
        source='mass_time_church.church_name')

    class Meta:
        model = MassTime
        fields = ('id', 'mass_time_title', 'mass_date', 'mass_time',
                  'mass_time_church', 'mass_time_language')


class AccountSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        validators=[UniqueValidator(queryset=User.objects.all())])
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())])

    class Meta:
        model = User
        fields = ('username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
