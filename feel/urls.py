from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from graphql_jwt.decorators import jwt_cookie
from graphene_django.views import GraphQLView
from django.http import HttpResponseRedirect

urlpatterns = [
    path("", include("frontend.urls")),
    path("api/", csrf_exempt(jwt_cookie(GraphQLView.as_view(graphiql=True)))),
    path('admin/', admin.site.urls),
]

# URL PATTERNS
