from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from graphql_jwt.decorators import jwt_cookie
from graphene_django.views import GraphQLView
from graphene_file_upload.django import FileUploadGraphQLView
from django.http import HttpResponseRedirect
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path("", include("frontend.urls")),
    path("api/", csrf_exempt(jwt_cookie(FileUploadGraphQLView.as_view(graphiql=True)))),
    path('admin/', admin.site.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# URL PATTERNS
