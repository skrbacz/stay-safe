from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class CityModel(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    postal_code = models.IntegerField()

    CITY_STATES = [
        ('safe', 'Safe'),
        ('natural_disaster_incoming', 'Natural disaster incoming'),
        ('natural_disaster_ongoing', 'Natural disaster ongoing'),
        ('natural_disaster_ended', 'Natural disaster ended'),
    ]
    state = models.CharField(max_length=100, choices=CITY_STATES, default='safe')

    def __str__(self):
        return self.name, self.country, self.postal_code, "state:", self.state


class NaturalDisasterModel(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=1000)
    todo_list = models.CharField(max_length=1000)

    def __str__(self):
        return self.name


class NaturalDisasterInCityModel(models.Model):
    id = models.AutoField(primary_key=True)
    natural_disaster = models.ForeignKey(NaturalDisasterModel, on_delete=models.CASCADE)
    city = models.ForeignKey(CityModel, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return ("disaster name:", self.natural_disaster.name, "city name:", self.city.name,
                "city state:", self.city.state, self.date)


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=100)
    hashed_password = models.CharField(max_length=255)
    city = models.ForeignKey(CityModel, null= True, blank=True, on_delete=models.SET_NULL)

    objects= UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
