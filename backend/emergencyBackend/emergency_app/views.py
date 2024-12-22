from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt

from emergency_app.models import NaturalDisasterModel
from emergency_app.serializers import NaturalDisasterSerializer


@api_view(['GET'])
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


@api_view(['GET'])
def get_natural_disaster_by_name(request, name=None):
    try:
        disaster = NaturalDisasterModel.objects.get(name=name)
        serializer = NaturalDisasterSerializer(disaster)
        return Response(serializer.data, status=200)
    except NaturalDisasterModel.DoesNotExist:
        return Response({'message': 'Natural disaster not found'}, status=404)


@api_view(['GET'])
def get_all_natural_disasters(request):
    disasters = NaturalDisasterModel.objects.all()
    serializer = NaturalDisasterSerializer(disasters, many=True)
    return Response(serializer.data, status=200)


@csrf_exempt  # Exempt CSRF for this specific view
@api_view(['POST'])
def post_natural_disaster(request):
    serializer = NaturalDisasterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@csrf_exempt
@api_view(['DELETE'])
def delete_natural_disaster(request, name):
    try:
        disaster = NaturalDisasterModel.objects.get(name=name)
        disaster.delete()
        return Response({'message': 'Natural disaster: ' + name + '- deleted'}, status=200)
    except NaturalDisasterModel.DoesNotExist:
        return Response({'message': 'Natural disaster not found'}, status=404)
