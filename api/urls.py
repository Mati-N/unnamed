from django.urls import path
from . import views

urlpatterns = [
    path("post/<int:id>", views.post, name="postf")
]

