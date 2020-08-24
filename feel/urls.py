from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from api import views
from graphql_jwt.decorators import jwt_cookie
from graphene_django.views import GraphQLView
from django.http import HttpResponseRedirect

urlpatterns = [
    path("", include("frontend.urls")),
    path("api/", jwt_cookie(csrf_exempt(GraphQLView.as_view(graphiql=False)))),
    path('admin/', admin.site.urls),
]
