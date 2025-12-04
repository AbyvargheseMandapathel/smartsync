from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    USER = 'USER'
    RESTAURANT = 'RESTAURANT'
    DELIVERYPARTNER = 'DELIVERYPARTNER'
    ADMIN = 'ADMIN'

    USER_TYPE_CHOICES = [
        (USER, 'User'),
        (RESTAURANT, 'Restaurant'),
        (DELIVERYPARTNER, 'Delivery Partner'),
        (ADMIN, 'Admin'),
    ]

    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default=USER,
    )

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.user_type = self.ADMIN
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username
