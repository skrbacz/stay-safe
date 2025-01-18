from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    # path('login/', views.login_user, name='login_user'),
    # path('logout/', views.logout_user, name='logout_user'),
    # path('register/', views.register_user, name='register_user'),
    # path('check_login/', views.check_login, name='check_login'),
    path('', views.landing_page, name='landing_page'),
    path('natural_disaster/<str:name>/', views.get_natural_disaster_by_name, name='natural_disaster_one'),
    path('natural_disaster/', views.get_all_natural_disasters, name='get_all_natural_disasters'),
    path('natural_disaster/create', views.post_natural_disaster, name='post_natural_disaster'),
    path('natural_disaster/delete/<str:name>/', views.delete_natural_disaster, name='delete_natural_disaster'),
    path('user/update/districts', views.update_users_districts, name='update_users_districts'),
    path('district/create', views.post_district, name='post_district'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
