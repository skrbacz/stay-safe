from django.contrib.auth import login, logout
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from emergency_app.models import NaturalDisaster, User, District
from emergency_app.serializers import NaturalDisasterSerializer, LoginSerializer, RegisterSerializer, DistrictSerializer


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
        disaster = NaturalDisaster.objects.get(name=name)
        serializer = NaturalDisasterSerializer(disaster)
        return Response(serializer.data, status=200)
    except NaturalDisaster.DoesNotExist:
        return Response({'message': 'Natural disaster not found'}, status=404)


@api_view(['GET'])
def get_all_natural_disasters(request):
    disasters = NaturalDisaster.objects.all()
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
        disaster = NaturalDisaster.objects.get(name=name)
        disaster.delete()
        return Response({'message': 'Natural disaster: ' + name + '- deleted'}, status=200)
    except NaturalDisaster.DoesNotExist:
        return Response({'message': 'Natural disaster not found'}, status=404)


@csrf_exempt
@api_view(['GET'])
def get_users_districts(request):
    try:
        user = User.objects.get(id=request.user.id)
        districts = user.districts.all()
        if not districts:
            return Response([], status=200)
        serializer = DistrictSerializer(districts, many=True)
        return Response(serializer.data, status=200)
    except User.DoesNotExist:
        return Response({"detail": "User not found."}, status=404)


@csrf_exempt
@api_view(['PATCH'])
def update_users_districts(request, name):
    try:
        user = User.objects.get(id=request.user.id)
        district = District.objects.get(name=name)
        if 'districts' in request.data:
            districts_data = request.data['districts']
            if districts_data.get('add'):
                user.districts.add(district)
                action = "added"
            elif districts_data.get('remove'):
                user.districts.remove(district)
                action = "removed"
            else:
                return Response({"detail": "Invalid action."}, status=400)
            user.save()
            serializer = DistrictSerializer(user.districts.all(), many=True)
            return Response(
                {
                    "detail": f"District successfully {action}.",
                    "districts": serializer.data
                },
                status=200
            )

        return Response({"detail": "No districts data provided."}, status=400)

    except User.DoesNotExist:
        return Response({"detail": "User not found."}, status=404)
    except District.DoesNotExist:
        return Response({"detail": f"District with name {name} not found."}, status=404)

@csrf_exempt
@api_view(['POST'])
def post_district(request):
    serializer = DistrictSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_all_districts(request):
    district = District.objects.all()
    serializer = DistrictSerializer(district, many=True)
    return Response(serializer.data, status=200)

