from django.contrib.gis import admin
from .models import Map, DataLayer, Pictogram, TileLayer, TileLayerWMS, WMSCategory, WMSProvider, Licence


admin.site.site_header = 'Baltic Explorer admin'
admin.site.index_title = 'Baltic Explorer administration'
admin.site.site_title = 'Baltic Explorer administration'

class WMSAdmin(admin.ModelAdmin):
	list_display = ('name', 'layers', 'url_template', 'url_legend')
	list_editable = ('url_template', 'url_legend')
class TileLayerAdmin(admin.ModelAdmin):
    list_display = ('name', 'rank', )
    list_editable = ('rank', )


admin.site.register(Map, admin.OSMGeoAdmin)
admin.site.register(DataLayer)
admin.site.register(TileLayer, TileLayerAdmin)
admin.site.register(TileLayerWMS, WMSAdmin)
admin.site.register(WMSCategory)
admin.site.register(WMSProvider)