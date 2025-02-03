from django.contrib.auth import login, logout, authenticate
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from emergency_app.models.district import District
from emergency_app.models.natural_disaster import NaturalDisaster
from emergency_app.models.user import User
from emergency_app.permissions import IsSuperUser
from emergency_app.serializers import UserSerializer, DistrictSerializer, NaturalDisasterSerializer, RegisterSerializer, \
    DisasterHistorySerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def landing_page(request):
    """
    Returns a welcome message from the backend.

    Args:
        request: The HTTP request object.

    Returns:
        Response: JSON response with a welcome message.
    """
    return Response({
        'message': 'Hello from the backend!'
    }, status=200)


#Auth views
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    Authenticates and logs in a user.

    Args:
         request: The HTTP request object containing email and password.

    Returns:
        Response: JSON response with login success or failure message.
    """
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(request, username=email, password=password)

    if user is not None:
        login(request, user)  # Create session
        return Response({'detail': 'Login successful', 'user': {'email': user.email}}, status=200)
    else:
        return Response({'detail': 'Invalid credentials'}, status=401)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Registers a new user.

    Args:
        request: The HTTP request object containing user registration data.

    Returns:
        Response: JSON response with registration success or failure message.
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


@api_view(['POST'])
def logout_user(request):
    """
    Logs out a user.

    Args:
        request: The HTTP request object.

    Returns:
        Response: JSON response with logout success message.
    """
    logout(request)
    response = Response({'message': 'Logout successful'}, status=200)
    response.delete_cookie('sessionid')

    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_login(request):
    """
    Checks if the user is authenticated.

    Args:
        request: The HTTP request object.

    Returns:
        Response: JSON response with authentication status.
    """
    if request.user.is_authenticated:
        return Response({'detail': 'User is authenticated', 'user': {'email': request.user.email}}, status=200)
    return Response({'detail': 'User is NOT authenticated'}, status=401)


# User / admin views

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

    disasters = NaturalDisaster.objects.all()
    serializer = NaturalDisasterSerializer(disasters, many=True)
    return Response(serializer.data, status=200)


@api_view(['GET'])
def get_natural_disaster_by_id(request, id=None):
    """
    Retrieve a natural disaster by its name.

    Args:
        request: The HTTP request object.
        name: The name of the natural disaster to retrieve.

    Returns:
        Response: A Response object containing the serialized data of the
        natural disaster and an HTTP status code 200.
    Raises:
        NaturalDisaster.DoesNotExist: If the natural disaster is not found in the database.
    """
    try:
        disaster = NaturalDisaster.objects.get(id=id)
        serializer = NaturalDisasterSerializer(disaster)
        return Response(serializer.data, status=200)
    except NaturalDisaster.DoesNotExist:
        return Response({'message': 'Natural disaster not found'}, status=404)


@api_view(['GET'])
def get_all_districts(request):
    """
    Retrieve all districts.

    Args:
        request: The HTTP request object.

    Returns:
        Response: A DRF Response object containing serialized district data and a status code of 200.
    """
    district = District.objects.all()
    serializer = DistrictSerializer(district, many=True)
    return Response(serializer.data, status=200)


@api_view(['GET'])
def get_district_by_district_code(request, district_code):
    """
    Retrieve a district by its name.

    Args:
        request: The HTTP request object.
        district_code: The id of the district to retrieve.

    Returns:
        Response: A Response object containing the serialized data of the
        district and an HTTP status code 200.
    Raises:
        District.DoesNotExist: If the district is not found in the database.
    """
    try:
        district = District.objects.get(name=district_code)
        serializer = DistrictSerializer(district)
        return Response(serializer.data, status=200)
    except District.DoesNotExist:
        return Response({'message': 'District not found'}, status=404)


@api_view(['GET'])
def get_users_districts(request):
    """
    Retrieve the districts associated with the current user.

    Args:
        request: The HTTP request object.

    Returns:
        Response: JSON response containing the districts associated with the user or error
        message id the user doesn't exist.
    Raises:
        User.DoesNotExist: If the user is not found in the database.
    """
    try:
        user = User.objects.get(email=request.user.email)
        print(request.user)
        print(user)
        districts = user.districts.all()
        if not districts:
            return Response([], status=200)
        serializer = DistrictSerializer(districts, many=True)
        return Response(serializer.data, status=200)
    except User.DoesNotExist:
        return Response({"detail": "User not found."}, status=404)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access
def update_users_districts(request, district_name):
    """
    Update the districts associated with the current user.

    Args:
        request (Request): The HTTP request object containing user data
            and district action.
        district_name (str): The name of the district to be added or removed.

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
        user = User.objects.get(email=request.user.email)  # Corrected user lookup
        district = District.objects.get(name=district_name)

        districts_data = request.data.get('districts', {})  # Safely fetch data
        action = None

        if isinstance(districts_data, dict):  # Ensure it's a dictionary
            if "add" in districts_data and district_name in districts_data["add"]:
                user.districts.add(district)
                action = "added"
            elif "remove" in districts_data and district_name in districts_data["remove"]:
                user.districts.remove(district)
                action = "removed"

        if action:
            serializer = DistrictSerializer(user.districts.all(), many=True)
            return Response(
                {
                    "detail": f"District successfully {action}.",
                    "districts": serializer.data
                },
                status=200
            )

        return Response({"detail": "Invalid request. Specify 'add' or 'remove'."}, status=400)

    except User.DoesNotExist:
        return Response({"detail": "User not found."}, status=404)
    except District.DoesNotExist:
        return Response({"detail": f"District '{district_name}' not found."}, status=404)


@api_view(['POST'])
def post_disaster_history(request):
    """
    Creates a new disaster history record, automatically assigning the user
    from the session or authentication.

    Args:
        request: The HTTP request object containing disaster history details.

    Returns:
        Response: JSON response with the created disaster history or validation errors.
    """
    # Check if the user is authenticated
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

    # Attach the authenticated user to the request data before passing to the serializer
    request.data['user_id'] = request.user.id  # Automatically set the user_id from the session user

    serializer = DisasterHistorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# Only admin views
@api_view(['POST'])
@permission_classes([IsSuperUser])
def post_natural_disaster(request):
    """
    Creates a new natural disaster record.

    Args:
        request: The HTTP request object containing disaster details.

    Returns:
        Response: JSON response with the created disaster or validation errors.
    """

    serializer = NaturalDisasterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@permission_classes([IsSuperUser])
def delete_natural_disaster(request, name):
    """
    Deletes a natural disaster by name.

    Args:
        request: The HTTP request object.
        name (str): The name of the disaster to delete.

    Returns:
        Response: JSON response confirming deletion or error message.
    Raises:
        NaturalDisaster.DoesNotExist: If the natural disaster is not found in the database.
    """

    try:
        disaster = NaturalDisaster.objects.get(name=name)
        disaster.delete()
        return Response({'message': f'Natural disaster {name} deleted.'}, status=200)
    except NaturalDisaster.DoesNotExist:
        return Response({'message': 'Natural disaster not found.'}, status=404)


@api_view(['PATCH'])
@permission_classes([IsSuperUser])
def update_natural_disaster(request, name):
    """
    Updates a natural disaster by name.

    Args:
        request: The HTTP request object.
        name (str): The name of the disaster to update.

    Returns:
        Response: JSON response confirming update or error message.
    Raises:
        NaturalDisaster.DoesNotExist: If the natural disaster is not found in the database.
    """

    try:
        disaster = NaturalDisaster.objects.get(name=name)
        serializer = NaturalDisasterSerializer(disaster, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    except NaturalDisaster.DoesNotExist:
        return Response({'message': 'Natural disaster not found.'}, status=404)


@api_view(['POST'])
@permission_classes([IsSuperUser])
def post_district(request):
    """
    Handle POST requests to create a new District.

    Args:
        request (Request): The HTTP request object containing district data.

    Returns:
        Response: Json response with the created district or validation errors.
    """

    serializer = DistrictSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@permission_classes([IsSuperUser])
def delete_district(request, district_code):
    """
    Deletes a district by name.

    Args:
        request: The HTTP request object.
        district_code (str): The id of the district to delete.

    Returns:
        Response: JSON response confirming deletion or error message.
    Raises:
        District.DoesNotExist: If the district is not found in the database.
    """

    try:
        district = District.objects.get(district_code=district_code)
        district.delete()
        return Response({'message': f'District {district.name} deleted.'}, status=200)
    except District.DoesNotExist:
        return Response({'message': 'District not found.'}, status=404)


@api_view(['PATCH'])
@permission_classes([IsSuperUser])
def update_district(request, district_code):
    """
    Updates a district by name.

    Args:
        request: The HTTP request object.
        district_code (str): The id of the district to update.

    Returns:
        Response: JSON response confirming update or error message.
    Raises:
        District.DoesNotExist: If the district is not found in the database.
    """

    try:
        district = District.objects.get(district_code=district_code)
        serializer = DistrictSerializer(district, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    except District.DoesNotExist:
        return Response({'message': 'District not found.'}, status=404)


@api_view(['GET'])
@permission_classes([IsSuperUser])
def get_all_users(request):
    """
    Retrieve all users.

    Args:
        request: The HTTP request object.

    Returns:
        Response: A DRF Response object containing serialized user data and a status code of 200.
    """
    user = User.objects.all()
    serializer = UserSerializer(user, many=True)
    return Response(serializer.data, status=200)


@api_view(['GET'])
@permission_classes([IsSuperUser])
def get_user_by_email(request, email):
    """
    Retrieve a user by email.

    Args:
        request: The HTTP request object.
        email (str): The email of the user to retrieve.

    Returns:
        Response: A Response object containing the serialized data of the
        user and an HTTP status code 200.
    Raises:
        User.DoesNotExist: If the user is not found in the database.
    """
    try:
        user = User.objects.get(email=email)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=200)
    except User.DoesNotExist:
        return Response({'message': 'User not found.'}, status=404)


@api_view(['DELETE'])
@permission_classes([IsSuperUser])
def delete_user(request, email):
    """
    Deletes a user by email.

    Args:
        request: The HTTP request object.
        email (str): The email of the user to delete.

    Returns:
        Response: JSON response confirming deletion or error message.
    Raises:
        User.DoesNotExist: If the user is not found in the database.
    """

    try:
        user = User.objects.get(email=email)
        user.delete()
        return Response({'message': f'User {email} deleted.'}, status=200)
    except User.DoesNotExist:
        return Response({'message': 'User not found.'}, status=404)


@api_view(['PATCH'])
@permission_classes([IsSuperUser])
def update_user(request, email):
    """
    Updates a user by email.

    Args:
        request: The HTTP request object.
        email (str): The email of the user to update.

    Returns:
        Response: JSON response confirming update or error message.
    Raises:
        User.DoesNotExist: If the user is not found in the database.
    """

    try:
        user = User.objects.get(email=email)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    except User.DoesNotExist:
        return Response({'message': 'User not found.'}, status=404)
