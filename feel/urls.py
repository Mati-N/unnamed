from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.decorators.csrf import csrf_exempt

from graphene_file_upload.django import FileUploadGraphQLView
from graphql_jwt.decorators import jwt_cookie


urlpatterns = [
    path("", include("frontend.urls")),
    path("api/", csrf_exempt(jwt_cookie(FileUploadGraphQLView.as_view(graphiql=True)))),
    path("admin/", admin.site.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
