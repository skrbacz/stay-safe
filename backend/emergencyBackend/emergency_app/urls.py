from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path('login/', views.login_user, name='login_user'),
    path('logout/', views.logout_user, name='logout_user'),
    path('register/', views.register_user, name='register_user'),
    path('check_login/', views.check_login, name='check_login'),
    path('', views.landing_page, name='landing_page'),

    path('natural_disaster/', views.get_all_natural_disasters, name='get_all_natural_disasters'),
    path('natural_disaster/<str:name>/', views.get_natural_disaster_by_name, name='natural_disaster_one'),
    path('natural_disaster/create', views.post_natural_disaster, name='post_natural_disaster'),
    path('natural_disaster/delete/<str:name>/', views.delete_natural_disaster, name='delete_natural_disaster'),
    path('natural_disaster/update/<str:name>/', views.update_natural_disaster, name='update_natural_disaster'),

    path('district/', views.get_all_districts, name='get_all_districts'),
    path('district/<str:name>/', views.get_district_by_district_code, name='district_one'),
    path('district/create', views.post_district, name='post_district'),
    path('district/delete/<str:district_code>/', views.delete_district, name='delete_district'),
    path('district/update/<str:district_code>/', views.update_district, name='update_district'),


    path('user/', views.get_all_users, name='get_all_users'),
    path('user/<str:email>/', views.get_user_by_email, name='user_one'),
    path('user/delete/<str:email>/', views.delete_user, name='delete_user'),
    path('user/update/<str:email>/', views.update_user, name='update_user'),
    path('user/update/districts/<str:district_name>/', views.update_users_districts, name='update_users_districts'),
    path('user/districts', views.get_users_districts, name='get_users_districts'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
