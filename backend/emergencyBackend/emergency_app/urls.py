from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', views.landing_page, name='landing_page'),
    path('natural_disaster/<str:name>/', views.get_natural_disaster_by_name, name='natural_disaster_one'),
    path('natural_disaster/', views.get_all_natural_disasters, name='natural_disaster_list'),
    path('natural_disaster/create/', views.post_natural_disaster, name='post_natural_disaster'),
    path('natural_disaster/delete/<str:name>/', views.delete_natural_disaster, name='delete_natural_disaster'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
