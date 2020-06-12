import os
import time

from django.contrib.gis.db import models
from django.conf import settings
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _
from django.core.signing import Signer
from django.template.defaultfilters import slugify
from django.core.files.base import File
from django.core.validators import MaxValueValidator, MinValueValidator
from .fields import DictField
from .managers import PublicManager


class NamedModel(models.Model):
    name = models.CharField(max_length=200, verbose_name=_("name"))

    class Meta:
        abstract = True
        ordering = ('name', )

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.name


def get_default_licence():
    """
    Returns a default Licence, creates it if it doesn't exist.
    Needed to prevent a licence deletion from deleting all the linked
    maps.
    """
    return Licence.objects.get_or_create(
        # can't use ugettext_lazy for database storage, see #13965
        name=getattr(settings, "UMAP_DEFAULT_LICENCE_NAME",
                     'No licence set')
    )[0]


class Licence(NamedModel):
    """
    The licence one map is published on.
    """
    details = models.URLField(
        verbose_name=_('details'),
        help_text=_('Link to a page where the licence is detailed.')
    )

    @property
    def json(self):
        return {
            'name': self.name,
            'url': self.details
        }


class TileLayer(NamedModel):
    url_template = models.CharField(
        max_length=200,
        help_text=_("URL template using OSM tile format")
    )
    minZoom = models.IntegerField(default=0)
    maxZoom = models.IntegerField(default=18)
    attribution = models.CharField(max_length=300)
    rank = models.SmallIntegerField(
        blank=True,
        null=True,
        help_text=_('Order of the tilelayers in the edit box')
    )
    # See https://wiki.openstreetmap.org/wiki/TMS#The_Y_coordinate
    tms = models.BooleanField(default=False)

    @property
    def json(self):
        return dict((field.name, getattr(self, field.name))
                    for field in self._meta.fields)

    @classmethod
    def get_default(cls):
        """
        Returns the default tile layer (used for a map when no layer is set).
        """
        return cls.objects.order_by('rank')[0]  # FIXME, make it administrable

    @classmethod
    def get_list(cls):
        default = cls.get_default()
        l = []
        for t in cls.objects.all():
            fields = t.json
            if default and default.pk == t.pk:
                fields['selected'] = True
            l.append(fields)
        return l

    class Meta:
        ordering = ('rank', 'name', )
        verbose_name = 'Background map'
        verbose_name_plural = 'Background maps'

class WMSProvider(NamedModel):
    name = models.CharField(
        max_length=200,
        help_text=_("Provider full name"),
        default="Other",
        unique=True,
    )
    abreviation = models.CharField(
        max_length=5,
        help_text=_("Short name"),
        default="OT",
        unique=True,
    )
    rank = models.SmallIntegerField(
        blank=True,
        null=True,
        help_text=_('Order of the providers in the edit box')
    )

    @property
    def json(self):
        return dict((field.name, getattr(self, field.name))
                    for field in self._meta.fields)

    @classmethod
    def get_list(cls):
        default = cls.get_default()
        l = []
        for t in cls.objects.all():
            fields = t.json
            if default and default.pk == t.pk:
                fields['selected'] = True
            l.append(fields)
        return l

    @classmethod
    def get_default(cls):
        return cls.objects.order_by('rank')[0]  # FIXME, make it administrable

    class Meta:
        ordering = ('name', 'abreviation')
        verbose_name = 'WMS provider'
        verbose_name_plural = 'WMS providers'

class WMSCategory(NamedModel):
    name = models.CharField(
        max_length=200,
        help_text=_("Category full name"),
        default="Other",
        unique=True,
    )
    abreviation = models.CharField(
        max_length=5,
        help_text=_("Short name"),
        default="OT",
        unique=True,
    )

    rank = models.SmallIntegerField(
        blank=True,
        null=True,
        help_text=_('Order of the categories in the edit box')
    )
    wms_provider = models.CharField(max_length=300, default="unknown", blank=True)

    @property
    def json(self):
        return dict((field.name, getattr(self, field.name))
                    for field in self._meta.fields)

    @classmethod
    def get_list(cls):
        default = cls.get_default()
        l = []
        for t in cls.objects.all():
            fields = t.json
            if default and default.pk == t.pk:
                fields['selected'] = True
            l.append(fields)
        return l

    @classmethod
    def get_default(cls):
        """
        Returns the default tile layer (used for a map when no layer is set).
        """
        return cls.objects.order_by('rank')[0]  # FIXME, make it administrable

    class Meta:
        ordering = ('name', 'abreviation')
        verbose_name = 'WMS category'
        verbose_name_plural = 'WMS categories'

class TileLayerWMS(NamedModel):
    url_template = models.CharField(
        max_length=200,
        help_text=_("WMS url"),
        default="http://",
    )
    url_legend = models.CharField(
        max_length=300,
        help_text=_("WMS legnd url"),
        default="http://",
    )
    layers = models.CharField(max_length=300, default="dummy")
    transparent = models.BooleanField(default=True, blank=True)
    format = models.CharField(max_length=50, default="image/png")
    minZoom = models.IntegerField(default=0)
    maxZoom = models.IntegerField(default=18)
    attribution = models.CharField(max_length=300, default="unknown", blank=True)
    wms_category = models.CharField(max_length=300, default="unknown", blank=True)
    wms_provider = models.CharField(max_length=300, default="unknown", blank=True)

    rank = models.SmallIntegerField(
        blank=True,
        null=True,
        help_text=_('Order of the tilelayers in the edit box'),
    )

    @property
    def json(self):
        return dict((field.name, getattr(self, field.name))
                    for field in self._meta.fields)

    @classmethod
    def get_default(cls):
        """
        Returns the default tile layer (used for a map when no layer is set).
        """
        return cls.objects.order_by('rank')[0]  # FIXME, make it administrable

    @classmethod
    def get_list(cls):
        default = cls.get_default()
        l = []
        for t in cls.objects.all():
            fields = t.json
            if default and default.pk == t.pk:
                fields['selected'] = True
            l.append(fields)
        return l

    class Meta:
        ordering = ('rank', 'name', )
        verbose_name = 'WMS layer'
        verbose_name_plural = 'WMS layers'

class LatviaCS(models.Model):
    AND = 0
    OR = 1
    METHOD = (
        (AND, _('Areas where all of the criteria apply')),
        (OR, _('Areas where at least one of the criteria apply')),
    )
    sust = models.IntegerField(default=0, validators=[MaxValueValidator(100), MinValueValidator(0)])
    sustCheck = models.BooleanField(default=True)
    mytr = models.IntegerField(default=0, validators=[MaxValueValidator(100), MinValueValidator(0)])
    mytrCheck = models.BooleanField(default=True)
    fuve = models.IntegerField(default=0, validators=[MaxValueValidator(100), MinValueValidator(0)])
    fuveCheck = models.BooleanField(default=True)
    fulu = models.IntegerField(default=0, validators=[MaxValueValidator(100), MinValueValidator(0)])
    fuluCheck = models.BooleanField(default=True)
    annal = models.IntegerField(default=0, validators=[MaxValueValidator(100), MinValueValidator(0)])
    annalCheck = models.BooleanField(default=True)
    """ method 1 = AND, 2 = OR """
    method = models.SmallIntegerField(choices=METHOD, default=AND)
    url_sust = models.CharField(
            help_text=_("url to find layer"),
            max_length=300
        )
    url_mytr = models.CharField(
            help_text=_("url to find layer"),
            max_length=300
        )
    url_fuve = models.CharField(
            help_text=_("url to find layer"),
            max_length=300
        )
    url_fulu = models.CharField(
            help_text=_("url to find layer"),
            max_length=300
        )
    url_annal = models.CharField(
            help_text=_("url to find layer"),
            max_length=300
        )
    url_result = models.CharField(
            help_text=_("url to find layer"),
            max_length=300
        )
    minx = models.FloatField(default=0)
    maxx = models.FloatField(default=0)
    miny = models.FloatField(default=0)
    maxy = models.FloatField(default=0)

    @property
    def json(self):
        return dict((field.name, getattr(self, field.name))
                    for field in self._meta.fields)
 
    @classmethod
    def get_list(cls):
        l = []
        for t in cls.objects.all():
            fields = t.json
            l.append(fields)
        return l


class Map(NamedModel):
    """
    A single thematical map.
    """
    ANONYMOUS = 1
    EDITORS = 2
    OWNER = 3
    PUBLIC = 1
    OPEN = 2
    PRIVATE = 3
    EDIT_STATUS = (
        (ANONYMOUS, _('Everyone can edit')),
        (EDITORS, _('Only editors can edit')),
        (OWNER, _('Only owner can edit')),
    )
    SHARE_STATUS = (
        (PUBLIC, _('Public: everyone')),
        (OPEN, _('Hidden: anyone with link')),
        (PRIVATE, _('Private: editors only')),
    )
    slug = models.SlugField(db_index=True)
    description = models.TextField(blank=True, null=True, verbose_name=_("description"))
    center = models.PointField(geography=True, verbose_name=_("center"))
    zoom = models.IntegerField(default=7, verbose_name=_("zoom"))
    epsg = models.TextField(default=settings.EPSG, blank=True, null=True, verbose_name=_("EPSG code"))
    proj = models.TextField(default=settings.PROJ, blank=True, null=True, verbose_name=_("Proj"))
    resolutions = models.TextField(default=settings.RESOLUTIONS, blank=True, null=True, verbose_name=_("Proj"))
    origin = models.TextField(default=settings.ORIGIN, blank=True, null=True, verbose_name=_("Proj"))


    locate = models.BooleanField(default=False, verbose_name=_("locate"), help_text=_("Locate user on load?"))
    licence = models.ForeignKey(
        Licence,
        help_text=_("Choose the map licence."),
        verbose_name=_('licence'),
        on_delete=models.SET_DEFAULT,
        default=get_default_licence
    )
    modified_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, related_name="owned_maps", verbose_name=_("owner"), on_delete=models.PROTECT)
    editors = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, verbose_name=_("editors"))
    edit_status = models.SmallIntegerField(choices=EDIT_STATUS, default=EDITORS, verbose_name=_("edit status"))
    share_status = models.SmallIntegerField(choices=SHARE_STATUS, default=PUBLIC, verbose_name=_("share status"))
    settings = DictField(blank=True, null=True, verbose_name=_("settings"))

    objects = models.Manager()
    public = PublicManager()

    def get_absolute_url(self):
        return reverse("map", kwargs={'slug': self.slug or "map", 'pk': self.pk})

    def get_anonymous_edit_url(self):
        signer = Signer()
        signature = signer.sign(self.pk)
        return reverse('map_anonymous_edit_url', kwargs={'signature': signature})

    def is_anonymous_owner(self, request):
        if self.owner:
            # edit cookies are only valid while map hasn't owner
            return False
        key, value = self.signed_cookie_elements
        try:
            has_anonymous_cookie = int(request.get_signed_cookie(key, False)) == value
        except ValueError:
            has_anonymous_cookie = False
        return has_anonymous_cookie

    def can_edit(self, user=None, request=None):
        """
        Define if a user can edit or not the instance, according to his account
        or the request.
        """
        can = False
        if request and not self.owner:
            if (getattr(settings, "UMAP_ALLOW_ANONYMOUS", False)
                    and self.is_anonymous_owner(request)):
                can = True
        if self.edit_status == self.ANONYMOUS:
            can = True
        elif not user.is_authenticated:
            pass
        elif user == self.owner:
            can = True
        elif self.edit_status == self.EDITORS and user in self.editors.all():
            can = True
        return can

    def can_view(self, request):
        if self.owner is None:
            can = True
        elif self.share_status in [self.PUBLIC, self.OPEN]:
            can = True
        elif request.user == self.owner:
            can = True
        else:
            can = not (self.share_status == self.PRIVATE
                       and request.user not in self.editors.all())
        return can

    @property
    def signed_cookie_elements(self):
        return ('anonymous_owner|%s' % self.pk, self.pk)

    def get_tilelayer(self):
        return self.tilelayer or TileLayer.get_default()

    def clone(self, **kwargs):
        new = self.__class__.objects.get(pk=self.pk)
        new.pk = None
        new.name = u"%s %s" % (_("Clone of"), self.name)
        if "owner" in kwargs:
            # can be None in case of anonymous cloning
            new.owner = kwargs["owner"]
        new.save()
        for editor in self.editors.all():
            new.editors.add(editor)
        for datalayer in self.datalayer_set.all():
            datalayer.clone(map_inst=new)
        return new

    class Meta:
        verbose_name = 'Workspace'
        verbose_name_plural = 'Workspaces'

class Pictogram(NamedModel):
    """
    An image added to an icon of the map.
    """
    attribution = models.CharField(max_length=300)
    pictogram = models.ImageField(upload_to="pictogram")

    @property
    def json(self):
        return {
            "id": self.pk,
            "attribution": self.attribution,
            "name": self.name,
            "src": self.pictogram.url
        }


# Must be out of Datalayer for Django migration to run, because of python 2
# serialize limitations.
def upload_to(instance, filename):
    if instance.pk:
        return instance.upload_to()
    name = "%s.geojson" % slugify(instance.name)[:50] or "untitled"
    return os.path.join(instance.storage_root(), name)


class DataLayer(NamedModel):
    """
    Layer to store Features in.
    """
    ANONYMOUS = 1
    EDITORS = 2
    OWNER = 3
    PUBLIC = 1
    OPEN = 2
    PRIVATE = 3
    EDIT_STATUS = (
        (ANONYMOUS, _('Everyone can edit')),
        (EDITORS, _('Only editors can edit')),
        (OWNER, _('Only owner can edit')),
    )
    SHARE_STATUS = (
        (PUBLIC, _('everyone (public)')),
        (OPEN, _('anyone with link')),
        (PRIVATE, _('editors only')),
    )
    map = models.ForeignKey(Map, on_delete=models.CASCADE)
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name=_("description")
    )
    geojson = models.FileField(upload_to=upload_to, blank=True, null=True)
    display_on_load = models.BooleanField(
        default=False,
        verbose_name=_("display on load"),
        help_text=_("Display this layer on load.")
    )
    rank = models.SmallIntegerField(default=0)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, related_name="owned_layers", verbose_name=_("owner"), on_delete=models.PROTECT)
    editors = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="layer_editors", verbose_name=_("editors"))
    edit_status = models.SmallIntegerField(choices=EDIT_STATUS, default=OWNER, verbose_name=_("edit status"))
    share_status = models.SmallIntegerField(choices=SHARE_STATUS, default=PUBLIC, verbose_name=_("share status"))

    class Meta:
        ordering = ('rank',)

    def can_edit(self, user=None, request=None):
        """
        Define if a user can edit or not the instance, according to his account
        or the request.
        """
        can = False
        if request and not self.owner:
            if (getattr(settings, "UMAP_ALLOW_ANONYMOUS", False)
                    and self.is_anonymous_owner(request)):
                can = True
        if self.edit_status == self.ANONYMOUS:
            can = True
        elif not user.is_authenticated:
            pass
        elif user == self.owner:
            can = True
        elif self.edit_status == self.EDITORS and user in self.editors.all():
            can = True
        return can

    def can_view(self, request):
        if self.owner is None:
            can = True
        elif self.share_status in [self.PUBLIC, self.OPEN]:
            can = True
        elif request.user == self.owner:
            can = True
        else:
            can = not (self.share_status == self.PRIVATE
                       and request.user not in self.editors.all())
        return can

    def save(self, force_insert=False, force_update=False, **kwargs):
        is_new = not bool(self.pk)
        super(DataLayer, self).save(force_insert, force_update, **kwargs)

        if is_new:
            force_insert, force_update = False, True
            filename = self.upload_to()
            old_name = self.geojson.name
            new_name = self.geojson.storage.save(filename, self.geojson)
            self.geojson.storage.delete(old_name)
            self.geojson.name = new_name
            super(DataLayer, self).save(force_insert, force_update, **kwargs)
        self.purge_old_versions()

    def upload_to(self):
        root = self.storage_root()
        name = '%s_%s.geojson' % (self.pk, int(time.time() * 1000))
        return os.path.join(root, name)

    def storage_root(self):
        path = ["datalayer", str(self.map.pk)[-1]]
        if len(str(self.map.pk)) > 1:
            path.append(str(self.map.pk)[-2])
        path.append(str(self.map.pk))
        return os.path.join(*path)

    @property
    def metadata(self):
        return {
            "name": self.name,
            "id": self.pk,
            "displayOnLoad": self.display_on_load
        }

    def clone(self, map_inst=None):
        new = self.__class__.objects.get(pk=self.pk)
        new.pk = None
        if map_inst:
            new.map = map_inst
        new.geojson = File(new.geojson.file.file)
        new.save()
        return new

    def is_valid_version(self, name):
        return name.startswith('%s_' % self.pk) and name.endswith('.geojson')

    def version_metadata(self, name):
        els = name.split('.')[0].split('_')
        return {
            "name": name,
            "at": els[1],
            "size": self.geojson.storage.size(self.get_version_path(name))
        }

    def get_versions(self):
        root = self.storage_root()
        names = self.geojson.storage.listdir(root)[1]
        names = [name for name in names if self.is_valid_version(name)]
        names.sort(reverse=True)  # Recent first.
        return names

    @property
    def versions(self):
        names = self.get_versions()
        return [self.version_metadata(name) for name in names]

    def get_version(self, name):
        path = self.get_version_path(name)
        with self.geojson.storage.open(path, 'r') as f:
            return f.read()

    def get_version_path(self, name):
        return '{root}/{name}'.format(root=self.storage_root(), name=name)

    def purge_old_versions(self):
        root = self.storage_root()
        names = self.get_versions()[settings.UMAP_KEEP_VERSIONS:]
        for name in names:
            for ext in ['', '.gz']:
                path = os.path.join(root, name + ext)
                try:
                    self.geojson.storage.delete(path)
                except FileNotFoundError:
                    pass
    class Meta:
        verbose_name = 'Data layer'
        verbose_name_plural = 'Data layers'
