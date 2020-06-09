 # -*- coding:utf-8 -*-

"""
Example settings for local development

Use this file as a base for your local development settings and copy
it to umap/settings/local.py. It should not be checked into
your code repository.

"""
from umap.settings.base import *   # pylint: disable=W0614,W0401

SECRET_KEY = ')a)5s2rm9!6)cu+)-g!h!u9m8fus^#y8+&c56m^0os37+xoa@o'
INTERNAL_IPS = ('127.0.0.1', )

DEBUG = True

ADMINS = (
    ('You', 'your@email'),
)
MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'umap',
    }
}

INSTALLED_APPS += (
    # "django_extensions",
    # "debug_toolbar",
)


WSGI_APPLICATION = 'umap.wsgi.application'

COMPRESS_ENABLED = False
COMPRESS_OFFLINE = True

# STATICFILES_DIRS = (
#     # os.path.join(PROJECT_DIR, 'remote_static'),
#     # "/home/ybon/Code/py/cartes.data.gouv.fr/static/",
#     ("storage", "/home/ybon/Code/js/Leaflet.Storage/"),
#     ("reqs", "/home/ybon/Code/js/Leaflet.Storage/reqs/"),
# ) + STATICFILES_DIRS

LANGUAGE_CODE = 'en'

AUTHENTICATION_BACKENDS = (
    # 'cartes.oauth.DataGouvOAuth2',
    'social_core.backends.github.GithubOAuth2',
    'social_core.backends.bitbucket.BitbucketOAuth',
    'social_core.backends.twitter.TwitterOAuth',
    'social_core.backends.openstreetmap.OpenStreetMapOAuth',
    'django.contrib.auth.backends.ModelBackend',
)
SOCIAL_AUTH_GITHUB_KEY = '93761405c92b3562d0a3'
SOCIAL_AUTH_GITHUB_SECRET = '78077fdfab87244e4a890e5122c1334f4a3676e7'
SOCIAL_AUTH_BITBUCKET_KEY = 'bEXgD8EbgcLAs5umqN'
SOCIAL_AUTH_BITBUCKET_SECRET = 'bwh9Gt6fFM4JYR43xUsnssggFu4Fk7b8'
# We need email to associate with other Oauth providers
SOCIAL_AUTH_GITHUB_SCOPE = ["user:email", ]
SOCIAL_AUTH_TWITTER_KEY = "SJqnyRApuIeE7O1vLzxUUg"
SOCIAL_AUTH_TWITTER_SECRET = "h8gUUPwtRGcIu2UDXqjue4IMGDUHDjXrjVXUGOfLPY"
SOCIAL_AUTH_OPENSTREETMAP_KEY = 'LabT8mJNrgQ7yyE2HlNsS862ks7Cth4wADfE0546'
SOCIAL_AUTH_OPENSTREETMAP_SECRET = '6mhPOh6WxvFDou7lTVkQKmwEsquuePX022JdsC1s'
SOCIAL_AUTH_DATAGOUV_SECRET = "10042c1ab03e26a27521105ff115daf99fd78ec75720cca1"
SOCIAL_AUTH_DATAGOUV_KEY = "5771417e06eb3a4108ab1a29"
MIDDLEWARE += (
    'social_django.middleware.SocialAuthExceptionMiddleware',
)
SOCIAL_AUTH_RAISE_EXCEPTIONS = False
SOCIAL_AUTH_BACKEND_ERROR_URL = "/"
SOCIAL_AUTH_LOGIN_ERROR_URL = "/"

UMAP_DEMO_PK = 204
# UMAP_SHOWCASE_PK = 1373
UMAP_ALLOW_ANONYMOUS = True
# UMAP_DEMO_SITE = True
SITE_URL = "http://localhost:8019"
SHORT_SITE_URL = "http://s.hort"
# TEMPLATES[0]['DIRS'].insert(0, '/home/ybon/Code/py/cartes.data.gouv.fr/templates/')

# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': True,
#     'handlers': {
#         'null': {
#             'level': 'DEBUG',
#             'class': 'django.utils.log.NullHandler',
#         },
#         'console': {
#             'class': 'logging.StreamHandler',
#             'formatter': 'verbose',
#             'level': 'DEBUG'
#         },
#         'mail_admins': {
#             'class': 'django.utils.log.AdminEmailHandler',
#             'level': 'WARNING',  # Don't mail below warning (info, etc)
#             'include_html': False
#         },
#     },
#     'formatters': {
#         'simple': {
#             'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
#         },
#         'verbose': {
#             'format': '%(levelname)s %(asctime)s %(funcName)s(...) [from %(pathname)s:%(lineno)s] %(message)s'
#         },
#     },
#     'loggers': {
#         # Empty string to get a catch-all logger
#         '': {
#             'handlers': ['mail_admins', 'console'],
#             'propagate': False,
#             'level': 'DEBUG',  # Log everything up to INFO (excludes DEBUG)
#         },
#         'django.request': {
#             'handlers': ['mail_admins', 'console'],
#             'level': 'ERROR',  # Will mail/print 5xx errors, but not 4xx
#             'propagate': True,
#         },
#         'django.db.backends': {
#             'handlers': ['null'],  # Don't log django db stuff
#             'propagate': False,
#         },
#         'sesql': {
#             'handlers': ['console'],  # Don't log sesql stuff
#             'propagate': False,
#             'level': 'DEBUG',
#         },
#     }
# }
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
        'LOCATION': '/tmp/django_cache',
    }
}
POSTGIS_VERSION = (2, 3, 0)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
ALLOWED_HOSTS = ['*', ]
STATIC_SERVE = True
SOUTH_TESTS_MIGRATE = False
UMAP_USE_UNACCENT = True
STATIC_ROOT = '/home/ybon/.virtualenvs/umap/var/static'
MEDIA_ROOT = '/home/ybon/.virtualenvs/umap/var/uploads'
# UMAP_XSENDFILE_HEADER = 'X-Accel-Redirect'
# LEAFLET_ZOOM = 8
# UMAP_GZIP = False
DEBUG_STATIC_FINDER = True
UMAP_EXCLUDE_DEFAULT_MAPS = True
SITE_NAME = 'Baltic Explorer'
ENABLE_ACCOUNT_LOGIN = True