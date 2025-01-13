from django.contrib.auth import login, logout
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt

from emergency_app.models import NaturalDisasterModel
from emergency_app.serializers import NaturalDisasterSerializer, LoginSerializer, RegisterSerializer


@api_view(['GET'])
def landing_page(request):
    return Response({
        'message': 'Hello from the backend!'
    }, status=200)


@api_view(['POST'])
def login_user(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        return Response({'message': 'Login successful'}, status=200)
    return Response({'message': 'Login failed', 'error': serializer.errors}, status=400)


@api_view(['POST'])
def logout_user(request):
    logout(request)

    response = Response({'message': 'Logout successful'}, status=200)
    response.delete_cookie('sessionid')

    return response

@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            {'message': 'Registration successful', 'user': {'email': user.email}},
            status=201
        )
    else:
        return Response(
            {'message': 'Registration failed', 'errors': serializer.errors},
            status=400
        )


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


@csrf_exempt  #only until we have auth
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
