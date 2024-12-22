from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response


def landing_page(request):
    return Response({
        'message': 'Hello from the backend!'
    }, status=200)


#landing page- when we have auth setup
# @api_view(['GET'])
# def landing_page(request):
#     login_url = request.build_absolute_uri(reverse('login_user'))
#     return Response({
#         'message': 'Redirection succeeded',
#         'login_url': login_url,
#     }, status=200)
