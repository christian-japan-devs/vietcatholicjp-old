from django.urls import path
from .views import (ReMassListViewSet, MassRegister, ChurchViewSet, ProvinceViewSet, UserCreate)

app_name = 'register'

urlpatterns = [
    path('getmass/', ReMassListViewSet.as_view({
        'get': 'getlist'
    })),
    path('getmass/<str:pk>', ReMassListViewSet.as_view({
        'get': 'retrieve'
    })),
    path('massregister', MassRegister.as_view({
        'get': 'getlist',
        'post': 'create'
    })),
    path('massregister/<str:rid>', MassRegister.as_view({
        'get': 'retrieve'
    })),
    path('church', ChurchViewSet.as_view({
        'get': 'getlist'
    })),
    path('church/<str:pk>/detail', ChurchViewSet.as_view({
        'get': 'retrieve'
    })),
    path('province', ProvinceViewSet.as_view({
        'get': 'list',
        'post': 'create'
    })),
    path('province/<str:pk>', ProvinceViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    })),
    path('account/create', UserCreate.as_view({
        'post': 'create',
    })),
    path('account/confirm', UserCreate.as_view({
        'post': 'confirm',
    })),
    path('account/request-password', UserCreate.as_view({
        'post': 'requestPassword',
    })),
    path('account/reset-password', UserCreate.as_view({
        'post': 'resetPassword',
    })),
]
