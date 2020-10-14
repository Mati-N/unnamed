from django.contrib import admin
from django.urls import path, include, re_path

from wagtail.admin import urls as wagtailadmin_urls
from wagtail.documents import urls as wagtaildocs_urls
from wagtail.core import urls as wagtail_urls
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
    re_path(r'^cms/', include(wagtailadmin_urls)),
    re_path(r'^documents/', include(wagtaildocs_urls)),
    re_path(r'^pages/', include(wagtail_urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# URL PATTERNS
