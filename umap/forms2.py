from django import forms
from django.contrib.gis.geos import Point
from django.contrib.auth import get_user_model
from django.utils.translation import ugettext_lazy as _
from django.template.defaultfilters import slugify
from django.conf import settings
from django.forms.utils import ErrorList
from django.forms.widgets import NumberInput, CheckboxInput
from .models import Map, DataLayer, LatviaCS

DEFAULT_LATITUDE = settings.LEAFLET_LATITUDE if hasattr(settings, "LEAFLET_LATITUDE") else 51
DEFAULT_LONGITUDE = settings.LEAFLET_LONGITUDE if hasattr(settings, "LEAFLET_LONGITUDE") else 2
DEFAULT_CENTER = Point(DEFAULT_LONGITUDE, DEFAULT_LATITUDE)

User = get_user_model()


class FlatErrorList(ErrorList):
    def __unicode__(self):
        return self.flat()

    def flat(self):
        if not self:
            return u''
        return u' — '.join([e for e in self])


class UpdateMapPermissionsForm(forms.ModelForm):

    class Meta:
        model = Map
        fields = ('edit_status', 'editors', 'share_status', 'owner')


class AnonymousMapPermissionsForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(AnonymousMapPermissionsForm, self).__init__(*args, **kwargs)
        full_secret_link = "%s%s" % (settings.SITE_URL, self.instance.get_anonymous_edit_url())
        help_text = _('Secret edit link is %s') % full_secret_link
        self.fields['edit_status'].help_text = _(help_text)

    STATUS = (
        (Map.ANONYMOUS, _('Everyone can edit')),
        (Map.OWNER, _('Only editable with secret edit link'))
    )

    edit_status = forms.ChoiceField(choices=STATUS)

    class Meta:
        model = Map
        fields = ('edit_status', )


class DataLayerForm(forms.ModelForm):

    class Meta:
        model = DataLayer
        fields = ('geojson', 'name', 'display_on_load', 'rank')


class MapSettingsForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(MapSettingsForm, self).__init__(*args, **kwargs)
        self.fields['slug'].required = False
        self.fields['center'].widget.map_srid = 4326

    def clean_slug(self):
        slug = self.cleaned_data.get('slug', None)
        name = self.cleaned_data.get('name', None)
        if not slug and name:
            # If name is empty, don't do nothing, validation will raise
            # later on the process because name is required
            self.cleaned_data['slug'] = slugify(name) or "map"
            return self.cleaned_data['slug'][:50]
        else:
            return ""

    def clean_center(self):
        if not self.cleaned_data['center']:
            point = DEFAULT_CENTER
            self.cleaned_data['center'] = point
        return self.cleaned_data['center']

    class Meta:
        fields = ('settings', 'name', 'center', 'slug')
        model = Map

class RangeInput(NumberInput):
    input_type = 'range'

class LatvianCaseForm(forms.ModelForm):

    class Meta:
        model = LatviaCS
        fields = ['sustCheck','sust','mytrCheck','mytr','fuveCheck','fuve','fuluCheck','fulu','annalCheck','annal','method']
        labels = {

            "sust": "",
            "sustCheck": "Sum stones",
            "mytr": "",
            "mytrCheck": "Mytilus trossulus",
            "fuve": "",
            "fuveCheck": "Fucus vesiculosus",
            "fulu": "",
            "fuluCheck": "Furcellaria lumbricalis",
            "annal": "",
            "annalCheck": "Annual algae",
            "method": "Calculation method"
        }
        widgets = {
            "sustCheck":CheckboxInput(attrs={'class': 'latvian-check-field', 'id':'sust_check_field', 'style': 'float: left'}), 
            "sust":RangeInput(attrs={'max': 100, 'min':0, 'step':10, 'class': 'latvian-form-field', 'id':'sust_field', 'style': 'width:100%;'}), 
            "mytrCheck":CheckboxInput(attrs={'class': 'latvian-check-field', 'id':'sust_check_field', 'style': 'float: left'}), 
            "mytr":RangeInput(attrs={'max': 100, 'min':0, 'step':10, 'class': 'latvian-form-field', 'id':'mytr_field', 'style': 'width:100%;'}),
            "fuveCheck":CheckboxInput(attrs={'class': 'latvian-check-field', 'id':'sust_check_field', 'style': 'float: left'}), 
            "fuve":RangeInput(attrs={'max': 100, 'min':0, 'step':10, 'class': 'latvian-form-field', 'id':'fuve_field', 'style': 'width:100%;'}),
            "fuluCheck":CheckboxInput(attrs={'class': 'latvian-check-field', 'id':'sust_check_field', 'style': 'float: left'}), 
            "fulu":RangeInput(attrs={'max': 100, 'min':0, 'step':10, 'class': 'latvian-form-field', 'id':'fulu_field', 'style': 'width:100%;'}),
            "annalCheck":CheckboxInput(attrs={'class': 'latvian-check-field', 'id':'sust_check_field', 'style': 'float: left'}), 
            "annal":RangeInput(attrs={'max': 100, 'min':0, 'step':10, 'class': 'latvian-form-field', 'id':'annal_field', 'style': 'width:100%;'}),
            "method":forms.Select(choices=LatviaCS.METHOD, attrs={'class': 'latvian-form-selector'})
        }
