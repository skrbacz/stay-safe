from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class District(models.Model):
    district_code = models.TextField(primary_key=True, default="1602")
    name = models.CharField(max_length=250)

    def __str__(self):
        return self.name


class NaturalDisaster(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=1000)
    todo_list = models.CharField(max_length=1000)

    def __str__(self):
        return self.name

#Ready for future development
class NaturalDisasterInDistrict(models.Model):
    id = models.AutoField(primary_key=True)
    natural_disaster = models.ForeignKey(NaturalDisaster, on_delete=models.CASCADE)
    district = models.ForeignKey(District, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return ("disaster name:", self.natural_disaster.name, "district name:", self.district.name,
                "date:", self.date)


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
    districts = models.ManyToManyField("District", blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
