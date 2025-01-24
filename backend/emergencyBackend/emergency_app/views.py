from django.contrib.auth import login, logout, authenticate
from django.http import JsonResponse
from django.urls import reverse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from emergency_app.models import NaturalDisasterModel, User, District
from emergency_app.permissions import IsSuperUser
from emergency_app.serializers import NaturalDisasterSerializer, LoginSerializer, RegisterSerializer, DistrictSerializer


@api_view(['GET'])
def landing_page(request):
    return Response({
        'message': 'Hello from the backend!'
    }, status=200)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])  # Allow unauthenticated access
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(request, username=email, password=password)

    if user is not None:
        login(request, user)  # Create session
        return Response({'detail': 'Login successful', 'user': {'email': user.email}}, status=200)
    else:
        return Response({'detail': 'Invalid credentials'}, status=401)

@api_view(['POST'])
def logout_user(request):
    """
    Logs out the user by terminating their session.

    This view handles POST requests to log out the user by calling the Django
    logout function, deleting the session cookie, and returning a success message.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        Response: A DRF Response object with a success message and HTTP status 200.
    """

    logout(request)
    response = Response({'message': 'Logout successful'}, status=200)
    response.delete_cookie('sessionid')

    return response


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])  # Allow unauthenticated access
def register_user(request):
    """
    Handle user registration via a POST request.

    This view function uses the RegisterSerializer to validate and save
    a new user based on the provided request data. If the registration
    is successful, it returns a success message along with the user's
    email and a 201 status code. If the registration fails, it returns
    an error message with the validation errors and a 400 status code.
    """
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


@api_view(['GET'])
def landing_page(request):
    login_url = request.build_absolute_uri(reverse('login_user'))
    return Response({
        'message': 'Redirection succeeded',
        'login_url': login_url,
    }, status=200)


@api_view(['GET'])
def get_natural_disaster_by_name(request, name=None):
    """
    Retrieve a natural disaster by its name.

    Args:
        request: The HTTP request object.
        name (str, optional): The name of the natural disaster to retrieve.

    Returns:
        Response: A Response object containing the serialized data of the natural disaster
        if found, or an error message if not found, with appropriate HTTP status codes.
    """
    try:
        disaster = NaturalDisasterModel.objects.get(name=name)
        serializer = NaturalDisasterSerializer(disaster)
        return Response(serializer.data, status=200)
    except NaturalDisasterModel.DoesNotExist:
        return Response({'message': 'Natural disaster not found'}, status=404)


@api_view(['GET'])
def get_all_natural_disasters(request):
    """
    Retrieve a list of all natural disasters.

    This view handles GET requests to fetch all instances of natural disasters
    from the database. The data is serialized and returned as a JSON response.

    Args:
        request: The HTTP request object.

    Returns:
        Response: A Response object containing serialized data of all natural
        disasters and an HTTP status code 200.
    """
    disasters = NaturalDisasterModel.objects.all()
    serializer = NaturalDisasterSerializer(disasters, many=True)
    return Response(serializer.data, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsSuperUser])
def post_natural_disaster(request):
    """
    Handle POST requests to create a new natural disaster record.

    This view function accepts a POST request containing data for a new
    natural disaster. It validates the data using the NaturalDisasterSerializer,
    saves the record if valid, and returns the serialized data with a 201 status.
    If the data is invalid, it returns the validation errors with a 400 status.

    Args:
        request (Request): The HTTP request object containing the data.

    Returns:
        Response: A Response object with serialized data and status code.
    """
    serializer = NaturalDisasterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
def delete_natural_disaster(request, name):
    """
    Deletes a natural disaster entry by its name.

    This view handles DELETE requests to remove a natural disaster
    record from the database. If the specified natural disaster
    exists, it is deleted, and a success message is returned.
    If not found, a 404 response is returned with an appropriate message.

    Args:
        request: The HTTP request object.
        name (str): The name of the natural disaster to be deleted.

    Returns:
        Response: A JSON response with a success message and status 200
        if the natural disaster is deleted, or a 404 status with an error
        message if the disaster does not exist.
    """
    if not request.user.is_superuser:
        return Response({'detail': 'Permission denied. Admin access only.'}, status=403)

    try:
        disaster = NaturalDisasterModel.objects.get(name=name)
        disaster.delete()
        return Response({'message': f'Natural disaster {name} deleted.'}, status=200)
    except NaturalDisasterModel.DoesNotExist:
        return Response({'message': 'Natural disaster not found.'}, status=404)


@api_view(['GET'])
def get_users_districts(request):
    """
    Retrieve the districts associated with the authenticated user.

    This view handles GET requests to fetch all districts linked to the
    currently authenticated user. If the user has no associated districts,
    an empty list is returned. If the user does not exist, a 404 response
    is returned.

    Args:
        request: The HTTP request object containing user authentication details.

    Returns:
        Response: A JSON response containing a list of districts or an error message.
    """
    try:
        user = User.objects.get(id=request.user.id)
        districts = user.districts.all()
        if not districts:
            return Response([], status=200)
        serializer = DistrictSerializer(districts, many=True)
        return Response(serializer.data, status=200)
    except User.DoesNotExist:
        return Response({"detail": "User not found."}, status=404)


@api_view(['PATCH'])
def update_users_districts(request, name):
    """
    Update the districts associated with the current user.

    This view allows the authenticated user to add or remove a district
    from their associated districts based on the provided district name
    and action in the request data.

    Args:
        request (Request): The HTTP request object containing user data
            and district action.
        name (str): The name of the district to be added or removed.

    Returns:
        Response: A response object containing a success message and the
        updated list of districts if the operation is successful, or an
        error message if the operation fails.

    Raises:
        User.DoesNotExist: If the user is not found in the database.
        District.DoesNotExist: If the district with the given name is not
        found in the database.
    """
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


@api_view(['POST'])
def post_district(request):
    """
    Handle POST requests to create a new District.

    This view function accepts a POST request containing district data,
    validates the data using the DistrictSerializer, and saves the new
    district if the data is valid. Returns a 201 status code with the
    serialized district data upon successful creation, or a 400 status
    code with validation errors if the data is invalid.
    """
    serializer = DistrictSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
def get_all_districts(request):
    """
    Retrieve all districts.

    This view handles GET requests to fetch all district records from the database.
    The districts are serialized and returned in the response with a status code of 200.

    Args:
        request: The HTTP request object.

    Returns:
        Response: A DRF Response object containing serialized district data and a status code of 200.
    """
    district = District.objects.all()
    serializer = DistrictSerializer(district, many=True)
    return Response(serializer.data, status=200)
