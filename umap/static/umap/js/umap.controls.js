L.U.BaseAction = L.ToolbarAction.extend({

    initialize: function (map) {
        this.map = map;
        this.options.toolbarIcon = {
            className: this.options.className,
            tooltip: this.options.tooltip
        };
        L.ToolbarAction.prototype.initialize.call(this);
        if (this.options.helpMenu && !this.map.helpMenuActions[this.options.className]) this.map.helpMenuActions[this.options.className] = this;
    }

});

L.U.ImportAction = L.U.BaseAction.extend({

    options: {
        helpMenu: true,
        className: 'upload-data dark',
        tooltip: L._('Import data') + ''
    },

    addHooks: function () {
        this.map.importPanel();
    }

});

L.U.EditPropertiesAction = L.U.BaseAction.extend({

    options: {
        helpMenu: true,
        className: 'update-map-settings dark',
        tooltip: L._('Edit map settings')
    },

    addHooks: function () {
        this.map.edit();
    }

});

L.U.ChangeTileLayerAction = L.U.BaseAction.extend({

    options: {
        helpMenu: true,
        className: 'dark update-map-tilelayers',
        tooltip: L._('Change tilelayers')
    },

    addHooks: function () {
        this.map.updateTileLayers();
    }

});


L.U.ChangeWMSLayerAction = L.U.BaseAction.extend({ 

    options: {
        helpMenu: true,
        className: 'dark update-map-tilelayers',
        tooltip: L._('Overlays')
    },

    addHooks: function () {
        this.map.updateWMSLayers();
    }

});


L.U.ManageDatalayersAction = L.U.BaseAction.extend({

    options: {
        className: 'dark manage-datalayers',
        tooltip: L._('Layers')
    },

    addHooks: function () {
        this.map.manageDatalayers();
    }

});

L.U.UpdateExtentAction = L.U.BaseAction.extend({

    options: {
        className: 'update-map-extent dark',
        tooltip: L._('Save this center and zoom')
    },

    addHooks: function () {
        this.map.updateExtent();
    }

});

L.U.UpdatePermsAction = L.U.BaseAction.extend({

    options: {
        className: 'update-map-permissions dark',
        tooltip: L._('Update permissions and editors')
    },

    addHooks: function () {
        this.map.permissions.edit();
    }

});

L.U.DrawMarkerAction = L.U.BaseAction.extend({

    options: {
        helpMenu: true,
        className: 'umap-draw-marker dark',
        tooltip: L._('Draw a marker')
    },

    addHooks: function () {
        if (this.editTools) {
            this.editTools.stopDrawing();
            return;
        }
        this.map.startMarker();
    }

});

L.U.DrawPolylineAction = L.U.BaseAction.extend({

    options: {
        helpMenu: true,
        className: 'umap-draw-polyline dark',
        tooltip: L._('Draw a polyline')
    },

    addHooks: function () {
        if (this.editTools) {
            this.editTools.stopDrawing();
            return;
        }
        this.map.startPolyline();
    }

});

L.U.DrawPolygonAction = L.U.BaseAction.extend({

    options: {
        helpMenu: true,
        className: 'umap-draw-polygon dark',
        tooltip: L._('Draw a polygon')
    },

    addHooks: function () {
        if (this.editTools) {
            this.editTools.stopDrawing();
            return;
        }
        this.map.startPolygon();
        
    }

});

L.U.AddPolylineShapeAction = L.U.BaseAction.extend({

    options: {
        className: 'umap-draw-polyline-multi dark',
        tooltip: L._('Add a line to the current multi')
    },

    addHooks: function () {
        this.map.editedFeature.editor.newShape();
    }

});

L.U.AddPolygonShapeAction = L.U.AddPolylineShapeAction.extend({

    options: {
        className: 'umap-draw-polygon-multi dark',
        tooltip: L._('Add a polygon to the current multi')
    }

});

L.U.BaseFeatureAction = L.ToolbarAction.extend({

    initialize: function (map, feature, latlng) {
        this.map = map;
        this.feature = feature;
        this.latlng = latlng;
        L.ToolbarAction.prototype.initialize.call(this);
        this.postInit();
    },

    postInit: function () {},

    hideToolbar: function () {
        this.map.removeLayer(this.toolbar);
    },

    addHooks: function () {
        this.onClick({latlng: this.latlng});
        this.hideToolbar();
    }

});

L.U.CreateHoleAction = L.U.BaseFeatureAction.extend({

    options: {
        toolbarIcon: {
            className: 'umap-new-hole',
            tooltip: L._('Start a hole here')
        }
    },

    onClick: function (e) {
        this.feature.startHole(e);
    }

});

L.U.ToggleEditAction = L.U.BaseFeatureAction.extend({

    options: {
        toolbarIcon: {
            className: 'umap-toggle-edit',
            tooltip: L._('Toggle edit mode (shift-click)')
        }
    },

    onClick: function (e) {
        if (this.feature._toggleEditing) this.feature._toggleEditing(e);  // Path
        else this.feature.edit(e);  // Marker
    }

});

L.U.DeleteFeatureAction = L.U.BaseFeatureAction.extend({

    options: {
        toolbarIcon: {
            className: 'umap-delete-all',
            tooltip: L._('Delete this feature')
        }
    },

    postInit: function () {
        if (!this.feature.isMulti()) this.options.toolbarIcon.className = 'umap-delete-one-of-one';
    },

    onClick: function (e) {
        this.feature.confirmDelete(e);
    }

});

L.U.DeleteShapeAction = L.U.BaseFeatureAction.extend({

    options: {
        toolbarIcon: {
            className: 'umap-delete-one-of-multi',
            tooltip: L._('Delete this shape')
        }
    },

    onClick: function (e) {
        this.feature.enableEdit().deleteShapeAt(e.latlng);
    }

});

L.U.ExtractShapeFromMultiAction = L.U.BaseFeatureAction.extend({

    options: {
        toolbarIcon: {
            className: 'umap-extract-shape-from-multi',
            tooltip: L._('Extract shape to separate feature')
        }
    },

    onClick: function (e) {
        this.feature.isolateShape(e.latlng);
    }

});

L.U.BaseVertexAction = L.U.BaseFeatureAction.extend({

    initialize: function (map, feature, latlng, vertex) {
        this.vertex = vertex;
        L.U.BaseFeatureAction.prototype.initialize.call(this, map, feature, latlng);
    }

});

L.U.DeleteVertexAction = L.U.BaseVertexAction.extend({

    options: {
        toolbarIcon: {
            className: 'umap-delete-vertex',
            tooltip: L._('Delete this vertex (Alt-click)')
        }
    },

    onClick: function () {
        this.vertex.delete();
    }

});

L.U.SplitLineAction = L.U.BaseVertexAction.extend({

    options: {
        toolbarIcon: {
            className: 'umap-split-line',
            tooltip: L._('Split line')
        }
    },

    onClick: function () {
        this.vertex.split();
    }

});

L.U.ContinueLineAction = L.U.BaseVertexAction.extend({

    options: {
        toolbarIcon: {
            className: 'umap-continue-line',
            tooltip: L._('Continue line')
        }
    },

    onClick: function () {
        this.vertex.continue();
    }

});

// Leaflet.Toolbar doesn't allow twice same toolbar class…
L.U.SettingsToolbar = L.Toolbar.Control.extend({});
L.U.DrawToolbar = L.Toolbar.Control.extend({

    initialize: function (options) {
        L.Toolbar.Control.prototype.initialize.call(this, options);
        this.map = this.options.map;
        this.map.on('seteditedfeature', this.redraw, this);
    },

    appendToContainer: function (container) {
        this.options.actions = [];
        if (this.map.options.enableMarkerDraw) {
            this.options.actions.push(L.U.DrawMarkerAction);
        }
        if (this.map.options.enablePolylineDraw) {
            this.options.actions.push(L.U.DrawPolylineAction);
            if (this.map.editedFeature && this.map.editedFeature instanceof L.U.Polyline) {
                this.options.actions.push(L.U.AddPolylineShapeAction);
            }
        }
        if (this.map.options.enablePolygonDraw) {
            this.options.actions.push(L.U.DrawPolygonAction);
            if (this.map.editedFeature && this.map.editedFeature instanceof L.U.Polygon) {
                this.options.actions.push(L.U.AddPolygonShapeAction);
            }
        }
        this.options.actions.push(L.U.ManageDatalayersAction);
        L.Toolbar.Control.prototype.appendToContainer.call(this, container);
    },

    redraw: function () {
        var container = this._control.getContainer();
        container.innerHTML = '';
        this.appendToContainer(container);
    }

});


L.U.EditControl = L.Control.extend({

    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-control-edit-enable umap-control'),
            edit = L.DomUtil.create('a', '', container);
        edit.href = '#';
        edit.title = L._('Enable/disable editing') + '';
        container.setAttribute("id", "drawingPen");
        L.DomEvent
            .addListener(edit, 'click', L.DomEvent.stop)
            .addListener(edit, 'click', map.toggleEdit, map);


        return container;
    }

});

/* Share control */
L.Control.Embed = L.Control.extend({

    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-control-embed umap-control');

        var link = L.DomUtil.create('a', '', container);
        link.href = '#';
        link.title = L._('Embed and share this map');

        L.DomEvent
            .on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', map.renderShareBox, map)
            .on(link, 'dblclick', L.DomEvent.stopPropagation);

        return container;
    }
});

L.U.MoreControls = L.Control.extend({

    options: {
        position: 'topleft'
    },

    onAdd: function () {
        var container = L.DomUtil.create('div', ''),
            more = L.DomUtil.create('a', 'umap-control-more umap-control-text', container),
            less = L.DomUtil.create('a', 'umap-control-less umap-control-text', container);
        more.href = '#';
        more.title = L._('More controls');

        L.DomEvent
            .on(more, 'click', L.DomEvent.stop)
            .on(more, 'click', this.toggle, this);

        less.href = '#';
        less.title = L._('Hide controls');

        L.DomEvent
            .on(less, 'click', L.DomEvent.stop)
            .on(less, 'click', this.toggle, this);

        return container;
    },

    toggle: function () {
        var pos = this.getPosition(),
            corner = this._map._controlCorners[pos],
            className = 'umap-more-controls';
        if (L.DomUtil.hasClass(corner, className)) L.DomUtil.removeClass(corner, className);
        else L.DomUtil.addClass(corner, className);
    }

});

L.U.DataLayersControl = L.Control.extend({
    options: {
        position: 'topleft'
    },

    initialize: function (map, options) {
        this.map = map;
        L.Control.prototype.initialize.call(this, options);
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-control-browse umap-control');

        var link = L.DomUtil.create('a', 'umap-browse-toggle', container);
        link.href = '#';
        link.title = L._('Features');

        container.style.display = 'none';
        L.DomEvent
            .on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', map.openBrowser, map)
            .on(link, 'dblclick', L.DomEvent.stopPropagation);

        return container;
    },

    onRemove: function (map) {
        this.collapse();
    },

    update: function () {
        if (this._datalayers_container && this._map) {
            this._datalayers_container.innerHTML = '';
            this._map.eachDataLayerReverse(function (datalayer) {
                this.addDataLayer(this._datalayers_container, datalayer);
            }, this)
        }
    },

    expand: function () {
        L.DomUtil.addClass(this._container, 'expanded');
    },

    collapse: function () {
        if (this._map.options.datalayersControl === 'expanded') return;
        L.DomUtil.removeClass(this._container, 'expanded');
    },

    addDataLayer: function (container, datalayer, draggable) {
        var datalayerLi = L.DomUtil.create('li', '', container);
        if (draggable) L.DomUtil.element('i', {className: 'drag-handle', title: L._('Drag to reorder')}, datalayerLi);
        datalayer.renderToolbox(datalayerLi);
        var title = L.DomUtil.add('span', 'layer-title', datalayerLi, datalayer.options.name);
        datalayerLi.id = 'browse_data_toggle_' + L.stamp(datalayer);
        L.DomUtil.classIf(datalayerLi, 'off', !datalayer.isVisible());
        if (datalayer.options.description && datalayer.options.description != "undefined") {
            title.innerHTML = (datalayer.options.name + ":" + datalayer.options.description);
        } else {
            title.innerHTML = datalayer.options.name;
        }
        
    },

    newDataLayer: function () {
        var datalayer = this.map.createDataLayer({name: this.map.options.user.name});
        datalayer.edit();
    },

    openPanel: function () {
        if (document.getElementById('umap-ui-container').classList.contains('feature-layers')) {
            this.map.ui.closePanel();
            return;
        }         
        if (!this.map.editEnabled) return;
        var container = L.DomUtil.create('ul', 'umap-browse-datalayers');
            title = L.DomUtil.add('h3', '', container, L._('Feature layers'));
        this.map.eachDataLayerReverse(function (datalayer) {
            this.addDataLayer(container, datalayer, true);
        }, this);
        var orderable = new L.U.Orderable(container);
        orderable.on('drop', function (e) {
            var layer = this.map.datalayers[e.src.dataset.id],
                other = this.map.datalayers[e.dst.dataset.id],
                minIndex = Math.min(e.initialIndex, e.finalIndex);
            if (e.finalIndex === 0) layer.bringToTop();
            else if (e.finalIndex > e.initialIndex) layer.insertBefore(other);
            else layer.insertAfter(other);
            this.map.eachDataLayerReverse(function (datalayer) {
                if (datalayer.getRank() >= minIndex) datalayer.isDirty = true;
            });
            this.map.indexDatalayers();
        }, this);
        if (this.map.options.user) {
            var bar = L.DomUtil.create('div', 'button-bar', container),
                add = L.DomUtil.create('a', 'show-on-edit block add-datalayer button', bar);
            add.href = '#';
            add.innerHTML = add.title = L._('Add a layer');

            L.DomEvent
                .on(add, 'click', L.DomEvent.stop)
                .on(add, 'click', this.newDataLayer, this);      
        }

        this.map.ui.openPanel({data: {html: container}, className: 'feature-layers'});
    }
});


L.U.DataLayer.include({

    renderToolbox: function (container) {

        var toggle = L.DomUtil.create('i', 'layer-toggle', container),
            zoomTo = L.DomUtil.create('i', 'layer-zoom_to', container);
        zoomTo.title = L._('Zoom to layer extent');
        toggle.title = L._('Show/hide layer');
        L.DomEvent.on(toggle, 'click', this.toggle, this);
        L.DomEvent.on(zoomTo, 'click', this.zoomTo, this);
        if (this.map.options.user) {
            if (this.map.permissions.options.owner.id == this.map.options.user.id || this.map.options.user.name == this.options.name) {
                
                var edit = L.DomUtil.create('i', 'layer-edit show-on-edit', container),
                    // table = L.DomUtil.create('i', 'layer-table-edit show-on-edit', container),
                    remove = L.DomUtil.create('i', 'layer-delete show-on-edit', container);

                edit.title = L._('Edit');
                // table.title = L._('Edit properties in a table');
                remove.title = L._('Delete layer');
                
                L.DomEvent.on(edit, 'click', this.edit, this);
                // L.DomEvent.on(table, 'click', this.tableEdit, this);
                L.DomEvent.on(remove, 'click', function () {
                            if (!this.isVisible()) return;
                            if (!confirm(L._('Are you sure you want to delete this layer?'))) return;
                            this._delete();
                            this.map.ui.closePanel();
                        }, this);

            }            
        }

        L.DomUtil.addClass(container, this.getHidableClass());
        L.DomUtil.classIf(container, 'off', !this.isVisible());
        container.dataset.id = L.stamp(this);
        
    },

    getHidableElements: function () {
        return document.querySelectorAll('.' + this.getHidableClass());
    },

    getHidableClass: function () {
        return 'show_with_datalayer_' + L.stamp(this);
    },

    propagateRemote: function () {
        var els = this.getHidableElements();
        for (var i = 0; i < els.length; i++) {
            L.DomUtil.classIf(els[i], 'remotelayer', this.isRemoteLayer());
        }
    },

    propagateHide: function () {
        var els = this.getHidableElements();
        for (var i = 0; i < els.length; i++) {
            L.DomUtil.addClass(els[i], 'off');
        }
    },

    propagateShow: function () {
        this.onceLoaded(function () {
            var els = this.getHidableElements();
            for (var i = 0; i < els.length; i++) {
                L.DomUtil.removeClass(els[i], 'off');
            }
        }, this);
    }

});

L.U.DataLayer.addInitHook(function () {
    this.on('hide', this.propagateHide);
    this.on('show', this.propagateShow);
    this.propagateShow();
});


L.U.Map.include({


});



L.U.TileLayerControl = L.Control.extend({
        
    options: {
        position: 'topleft'
    },

    initialize: function (map, options) {
        this.map = map;
        L.Control.prototype.initialize.call(this, options);
    },

    onAdd: function () {
        var container = L.DomUtil.create('div', 'leaflet-control-tilelayers umap-control');

        var link = L.DomUtil.create('a', '', container);
        link.href = '#';
        link.title = L._('Change map background');

        L.DomEvent
            .on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', this.openSwitcher, this)
            .on(link, 'dblclick', L.DomEvent.stopPropagation);

        return container;
    },

    openSwitcher: function (options) {
        this._tilelayers_container = L.DomUtil.create('ul', 'umap-tilelayer-switcher-container');
        this.buildList(options);

    },

    buildList: function (options) {
        this.map.eachTileLayer(function (tilelayer) {
            if (window.location.protocol === 'https:' && tilelayer.options.url_template.indexOf('http:') === 0) return;
            this.addTileLayerElement(tilelayer, options);
        }, this);
        this.map.ui.openPanel({data: {html: this._tilelayers_container}, className: options.className});
    },

    addTileLayerElement: function (tilelayer, options) {
        const selectedClass = this.map.hasLayer(tilelayer) ? 'selected' : '',
            el = L.DomUtil.create('li', selectedClass, this._tilelayers_container),
            img = L.DomUtil.create('img', '', el),
            name = L.DomUtil.create('div', '', el);
        img.src = L.Util.template(tilelayer.options.url_template, this.map.demoTileInfos);
        name.innerHTML = tilelayer.options.name;
        L.DomEvent.on(el, 'click', function () {
            this.map.selectTileLayer(tilelayer);
            this.map.ui.closePanel();
            if (options && options.callback) options.callback(tilelayer);
        }, this);
    }


});

////////////////////
/// WMS CONTROL ////
////////////////////

L.U.openWMSControl = L.Control.extend({
    
    options: {
        position: 'topleft',
        tooltip: L._('Data and maps'),
        providers: [''],
        categories: [],
        category_names: [],
        category_names_short: [],
    },

    initialize: function (map, options) {
        this.map = map;
        L.Control.prototype.initialize.call(this, options);

        this.options.provider_names = [];
        this.options.providers = [];
        this.options.provider_categories = [];
        this.options.provider_category_names = [];
        this.options.provider_category_names_short = [];

        for (let e = 0; e < this.map.options.wmsproviders.length; e++) {
        	this.options.provider_names.push(this.map.options.wmsproviders[e].name);
            this.options.providers.push(this.map.options.wmsproviders[e].abreviation);
            this.options.provider_categories.push(e);
            this.options.provider_category_names.push(e);
            this.options.provider_category_names_short.push(e);

            this.options.provider_categories[e] = [];
            this.options.provider_category_names[e] = [];
            this.options.provider_category_names_short[e] = [];

            for (let q = 0; q < this.map.options.wmscategories.length; q++) {
                if (this.map.options.wmscategories[q].wms_provider == this.map.options.wmsproviders[e].abreviation) {
                    this.options.provider_categories[e].push(this.map.options.wmscategories[q].abreviation);
                    this.options.provider_category_names[e].push(this.map.options.wmscategories[q].name);
                    this.options.provider_category_names_short[e].push(this.map.options.wmscategories[q].name);
                }
            }
        };
    },

    onAdd: function () {
        const WMScontrol_container = L.DomUtil.create('div', 'leaflet-control-tilelayers umap-control');

        const link = L.DomUtil.create('a', 'dark update-map-tilelayers', WMScontrol_container);
        link.href = '#';
        link.title = L._('Data');

        L.DomEvent
            .on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', this.map._openBrowser, this.map)
            .on(link, 'dblclick', L.DomEvent.stopPropagation);

        return WMScontrol_container;
    },
    
    ////////////////////
    //// MANAGE WMS ////
    ////////////////////

    openManageWMS: function (options) {
        const dataLargeContainer = L.DomUtil.create('div', 'manage-WMS-panel');
        if (document.getElementById('umap-ui-container').classList.contains('browse-data-panel')) {
            this.map.ui.closePanel();
            return;
        }

        
        const browserContainer = L.DomUtil.create('div', 'data-layer-column', dataLargeContainer);

        L.DomUtil.create('hr', '', browserContainer);

        const tooltip = L.DomUtil.create('div', 'opened-WMS-tooltip', browserContainer);
        tooltip.href = '#';
        tooltip.title = L._('Here you can browse features that are on the map. Click on a feature in the lists below to focus on that feature. Add more features by using the draw tools to draw on the map.');

        const tooltipText = L.DomUtil.create('div', 'opened-WMS-tooltip-text', browserContainer);
        tooltipText.innerHTML = 'Here you can browse features that are on the map. Click on a feature in the lists below to focus on that feature. Add more features by using the draw tools to draw on the map.';
        tooltipText.href = '#';
        tooltipText.style.display = 'none';

        L.DomEvent
            .on(tooltip, 'click', function() {
                if (tooltipText.style.display == 'none') {
                    tooltipText.style.display = '';
                } else {
                    tooltipText.style.display = 'none';
                }
            });

        const browseFeaturesTitle = L.DomUtil.create('div', 'opened-WMS-title', browserContainer);
        browseFeaturesTitle.innerHTML = 'Features on the map:';

        const featuresContainer = L.DomUtil.create('div', 'umap-browse-features', browserContainer); 

        var addFeature = function (feature, map, datalayer) {
            var feature_li = L.DomUtil.create('li', feature.getClassName() + ' feature');
                // zoom_to = L.DomUtil.create('i', 'feature-zoom_to', feature_li),
            if (map.options.user) {
                if (map.options.user.id == map.permissions.options.owner.id || map.options.user.name == datalayer.options.name) {
                    var edit = L.DomUtil.create('i', 'show-on-edit feature-edit', feature_li);
                }
            }
            var color = L.DomUtil.create('i', 'feature-color', feature_li),
                title = L.DomUtil.create('span', 'feature-title', feature_li),
                symbol = feature._getIconUrl ? L.U.Icon.prototype.formatUrl(feature._getIconUrl(), feature): null;
            // zoom_to.title = L._('Bring feature to center');
            if (map.options.user) {
                if (map.options.user.id == map.permissions.options.owner.id || map.options.user.name == datalayer.options.name) {
                        edit.title = L._('Edit this feature');
                }
            }
            title.innerHTML = feature.getDisplayName() || '—';
            color.style.backgroundColor = feature.getOption('color');
            if (symbol) {
                color.style.backgroundImage = 'url(' + symbol + ')';
            }

            L.DomEvent.on(title, 'click', function (e) {
                e.callback = L.bind(this.view, this.map)
                this.bringToCenter(e);
            }, feature);
            if (map.options.user) {
                if (map.options.user.id == map.permissions.options.owner.id || map.options.user.name == datalayer.options.name) {
                    L.DomEvent.on(edit, 'click', function () {
                        this.edit();
                    }, feature);
                }
            }
            return feature_li;
        };

        var append = function (datalayer) {
            var container = L.DomUtil.create('div', datalayer.getHidableClass(), featuresContainer),
                headline = L.DomUtil.create('h5', '', container);
            container.id = 'browse_data_datalayer_' + datalayer.umap_id;
            datalayer.renderToolbox(headline);
            var description
            if (datalayer.options.description == undefined) {
                description = ""
            } else {
                description = ":" + datalayer.options.description;
            }
            L.DomUtil.add('span', '', headline, datalayer.options.name + description);
            var ul = L.DomUtil.create('ul', '', container);
            L.DomUtil.classIf(container, 'off', !datalayer.isVisible());

            var build = function () {
                ul.innerHTML = '';
                datalayer.eachFeature(function (feature) {
                    ul.appendChild(addFeature(feature, this.map, datalayer));
                });
            };
            build();
            datalayer.on('datachanged', build);
            datalayer.map.ui.once('panel:closed', function () {
                datalayer.off('datachanged', build);
            });
            datalayer.map.ui.once('panel:ready', function () {
                datalayer.map.ui.once('panel:ready', function () {
                    datalayer.off('datachanged', build);
                });
            });
        };

        var appendAll = function () {
            featuresContainer.innerHTML = '';
            this.eachBrowsableDataLayer(function (datalayer) {
                append(datalayer);
            });
        };
        var resetLayers = function () {
            this.eachBrowsableDataLayer(function (datalayer) {
                datalayer.resetLayer(true);
            });
        }
        L.bind(appendAll, this.map)();

        this._manageWMS_container = L.DomUtil.create('ul', 'manage-WMS-container', dataLargeContainer); // change to unique for WMS

        L.DomUtil.create('hr', '', this._manageWMS_container);

        const openedWMSTooltip = L.DomUtil.create('div', 'opened-WMS-tooltip', this._manageWMS_container);
        openedWMSTooltip.href = '#';
        openedWMSTooltip.title = L._('Add overlay data on the map. Selected overlays will appear in the list below.');

        const openedWMSTooltipText = L.DomUtil.create('div', 'opened-WMS-tooltip-text', this._manageWMS_container);
        openedWMSTooltipText.innerHTML = 'Add overlay data on the map. Selected overlays will appear in the list below.';
        openedWMSTooltipText.href = '#';
        openedWMSTooltipText.style.display = 'none';

        L.DomEvent
            .on(openedWMSTooltip, 'click', function(){
                if (openedWMSTooltipText.style.display == 'none') {
                    openedWMSTooltipText.style.display = '';
                }

                else{
                    openedWMSTooltipText.style.display = 'none';
                }
            });
    

        const sWMSLink = L.DomUtil.create('button', 'panel-button-fullwidth', this._manageWMS_container),
              sWMSLabel = L.DomUtil.create('span', '', sWMSLink);
        sWMSLabel.innerHTML = sWMSLabel.title = L._('Manage overlays');
        L.DomEvent
            .on(sWMSLink, 'click', this.openSelectWMS, this);

        this.openedWMS_container = L.DomUtil.create('ul', 'opened-WMS-container', this._manageWMS_container);
        this.openedWMS_container.setAttribute("id", "opened-WMS-container");
        
        const openedWMSTitle = L.DomUtil.create('div', 'opened-WMS-title', this.openedWMS_container);
        openedWMSTitle.innerHTML = 'Overlay data on the map:';

        this.buildOpenedWMSList(options);

        if (document.getElementById('umap-ui-container').classList.contains('manage-WMS-panel')) {
            this.map.ui.closePanel();
        } else {

            const bgLink = L.DomUtil.create('li', ''),
                  bgLabel = L.DomUtil.create('span', '', bgLink);
            bgLabel.innerHTML = bgLabel.title = L._('Background maps');
            L.DomEvent
                .on(bgLink, 'click', this.openManageBG, this);

            this.map.ui.openPanel({data: {html: dataLargeContainer}, className: 'manage-WMS-panel', actions: [bgLink]});
            leafletRight = document.getElementsByClassName("leaflet-right");
            var i
            for (i=0; i < leafletRight.length; i++) {
                L.DomUtil.addClass(leafletRight[i], "leaflet-right-wide");
            }
        }

    },

    openBrowser: function () {
        this.map.onceDatalayersLoaded(function () {  
            this._openBrowser();
        });
    },
    
    buildOpenedWMSList: function (options) {

        const layer_container = L.DomUtil.create('ul', 'opened-WMS-layer-container', this.openedWMS_container); // change to unique for WMS
        layer_container.setAttribute("id", "opened-WMS-layer-container-list");


        for (let i = this.map.options.openWMS.length -1 ;  i >= 0; i--) {
            const el_container = L.DomUtil.create('li', 'banner-container', layer_container),
                  hider = L.DomUtil.create('i', 'hide-displayed-wms', el_container),
                  el = L.DomUtil.create('p', 'opened-WMS-layer-banner', el_container),  
                  img = L.DomUtil.create('img', 'wms-layer-icon', el), // change to unique for WMS
                  provider_logo =  this.map.options.openWMS[i].attribution,
                  layerTitle_container = L.DomUtil.create('div', '', el),
                  layerTitle = L.DomUtil.create('p', 'opened-WMS-layer-title', layerTitle_container), // change to unique for WMS
                  
                  controls = L.DomUtil.create('li', 'opened-WMS-layer-controls', el_container),
                  sliderLabel = L.DomUtil.create('p', 'opacity-slider-label', controls),
                  controlSlider = L.DomUtil.create('input', 'opacity-slider', controls),
                  nameup = L.DomUtil.create('h5', 'legend-name', controls),
                  limg = L.DomUtil.create('img', 'legend-img', controls);
            hider.title = L._('Show/hide overlay');
            controls.style.display = 'none';      
            controlSlider.setAttribute("min", 0);
            controlSlider.setAttribute("max", 1);
            controlSlider.setAttribute("type", "range");
            controlSlider.setAttribute("step", 0.01);
            sliderLabel.innerHTML = "Transparency:";

            if (this.map.options.openWMS[i].opacity) {
                controlSlider.setAttribute("value", this.map.options.openWMS[i].opacity);
                if (this.map.options.openWMS[i].opacity == 0) {
                    L.DomUtil.addClass(hider, "overlay-hidden");
                }
            }
            img.src = L.Util.template('/static/umap/img/' + provider_logo +'.png');

            layerTitle.innerHTML = this.map.options.openWMS[i].name;

            el_container.setAttribute("id", i);

            nameup.innerHTML = 'Legend';
            limg.src = this.map.options.openWMS[i].url_legend;
            limg.alt = 'Legend';


            L.DomEvent
                .on(el, 'click', function () {
                    if (controls.style.display == 'none') {        
                        controls.style.display = 'block';
                    } else {
                        controls.style.display = 'none';
                    }
                }, this);


            L.DomEvent
                .on(controlSlider, 'input', function () {

                    var li = controlSlider.closest('li');
                    var parent = li.parentElement;
                    var nodes = Array.from(parent.closest('ul').children );
                    var index = this.map.options.openWMS.length - nodes.indexOf(parent) - 1;

                    for (let l in this.map.wmslayers) {
                        if(this.map.options.openWMS[index].name == this.map.wmslayers[l].options.name) {
                            this.map.wmslayers[l].setOpacity(controlSlider.value);
                            this.map.options.openWMS[index].opacity = controlSlider.value;
                            if (controlSlider.value == 0) {
                                if (!L.DomUtil.hasClass(hider, "overlay-hidden")) {
                                    L.DomUtil.addClass(hider, "overlay-hidden");
                                    
                                }                                
                            } else {
                                if (L.DomUtil.hasClass(hider, "overlay-hidden")) {
                                    L.DomUtil.removeClass(hider, "overlay-hidden");
                                    
                                }                             
                            }
                            this.map.isDirty = true;
                        }
                    }
                }, this);

            L.DomEvent
                .on(hider, 'click', function () {

                    var parent = hider.closest('li');
                    var nodes = Array.from(parent.closest('ul').children );
                    var index = this.map.options.openWMS.length - nodes.indexOf(parent) - 1;

                    for (let l in this.map.wmslayers) {
                        if(this.map.options.openWMS[index].name == this.map.wmslayers[l].options.name) {
                            if (this.map.options.openWMS[index].opacity != 0) {
                                controlSlider.value = 0;
                                this.map.wmslayers[l].setOpacity(controlSlider.value);
                                this.map.options.openWMS[index].opacity = controlSlider.value;
                            } else {
                                controlSlider.value = 100;
                                this.map.wmslayers[l].setOpacity(controlSlider.value);
                                this.map.options.openWMS[index].opacity = controlSlider.value;
                            }
                            if (L.DomUtil.hasClass(hider, "overlay-hidden")) {
                                L.DomUtil.removeClass(hider, "overlay-hidden");
                                
                            } else {
                                L.DomUtil.addClass(hider, "overlay-hidden");
                            }
                            this.map.isDirty = true;
                        }
                    }
                }, this);

        }

        var sort = '',
            parentObj = (this,{            
            attr1: this.map.options.openWMS,  
            attr2: this.map.options.openWMS,  
                    
        sort: new Sortable(layer_container,{
            animation: 150,
            ghostClass: 'blue-background-class',
            group: 'openwmslist',
            delay: 200,
            delayOnTouchOnly: false,
            forceFallback: true,

            onChoose: function (evt) {
                evt.oldIndex;  
                var itemEl = evt.item;
                itemEl.classList.add('holdingElement');
                parentObj.getElement(itemEl);
            },

            onEnd: function (evt) {
                var itemEl = evt.item;
                itemEl.classList.remove('holdingElement');
            },

            store: {

                set: function (sortable) {

                    var sortableNodes = sortable.el.childNodes;
                    const listOpenWMS = parentObj.map.options.openWMS;
                    const listOpenWMSnew = [];
                    for (var i = sortableNodes.length -1; i >= 0; i--) {
                        let name = sortableNodes[i].childNodes[1].innerText;

                        for (let j = listOpenWMS.length  - 1; j >= 0; j--){
                            if (listOpenWMS[j].name == name) {
                                listOpenWMSnew.push(listOpenWMS[j])
                            }
                        }
                    }
                    parentObj.map.options.openWMS = listOpenWMSnew;
                    parentObj.updateWMS(listOpenWMSnew);

            }
        }
            })

        }, this)

        var dragSrcEl = null;
        this.map.initOpenWMS();
    },

    getElement: function(itemEl) {
    },

    updateWMS2: function(){
        this.map.initOpenWMS();
        this.map.isDirty = true;

    },

    updateWMS: function(openWMS){

        this.map.options.openWMS = openWMS;

        this.map.initOpenWMS();
        this.map.isDirty = true;
        var controlSlider = document.getElementsByClassName('opacity-slider');
        for (let i = 0; i < this.map.options.openWMS.length; i++) {
            L.DomEvent
                .on(controlSlider, 'input', function () {
                    for (let l in this.map.wmslayers) {
                        if(this.map.options.openWMS[i].name == this.map.wmslayers[l].options.name) {
                            this.map.wmslayers[l].setOpacity(controlSlider.value);
                            this.map.options.openWMS[i].opacity = controlSlider.value;
                            this.map.isDirty = true;
                        }
                    }
                }, this); 
        }
    },

    moveListOrder: function(){
        var arr = this.map.options.openWMS;

    },

    moveList: function (i, p) {
        const openLayerNameList = document.getElementsByClassName('opened-WMS-layer-title'),
              opacitySliderElementList = document.getElementsByClassName('opacity-slider');
        for(t in openLayerNameList) {
            if (openLayerNameList[t].innerHTML == this.map.options.openWMS[i].name) {
                openLayerNameList[t].innerHTML = this.map.options.openWMS[p].name;
                var a = opacitySliderElementList[t].value
                var i1 = t;
            } else if (openLayerNameList[t].innerHTML == this.map.options.openWMS[p].name) {
                openLayerNameList[t].innerHTML = this.map.options.openWMS[i].name;
                var b = opacitySliderElementList[t].value
                var i2 = t;
            }
        }
        opacitySliderElementList[i1].setAttribute("value", b);
        opacitySliderElementList[i2].setAttribute("value", a);
    },

    // Hidden
    playWMS: function () {
        var x = this.map.options.openWMS;
        var i = 0;
        var map = this.map;
        const spd = 2000;
        var wmsanimation = setInterval(frame, spd);
        
        function frame() {
            if (i == x.length) {
                clearInterval(wmsanimation);
                    for(var n in x) {
                        for(var y in map.wmslayers) {
                            if (map.wmslayers[y].options.name == x[n].name) {
                                if (x[n].opacity) {
                                    map.wmslayers[y].setOpacity(x[n].opacity);   
                                } else {
                                    map.wmslayers[y].setOpacity(1);  
                                }
                            }   
                        }
                    }
                map.ui.alert({content: L._('Animation finished!'), 'level': 'info', duration: 1000});
            } else {
                if(x != '') {
                    for(var r in x) {
                        for(var k in map.wmslayers) {
                            if (map.wmslayers[k].options.name == x[r].name) {
                                map.wmslayers[k].setOpacity(0);   
                            }   
                        }
                    }
                }
                if(x != '') {
                    for(var t in map.wmslayers) {
                        if (map.wmslayers[t].options.name == x[i].name) {
                            map.ui.alert({content: L._(x[i].name), 'level': 'info'});
                            map.wmslayers[t].setOpacity(1);
                            
                        }   
                    }
                }
            }
            i++;
        }

    },

    // Hidden
    flickerWMS: function () {
        var x = this.map.options.openWMS;
        var i = 0;
        var map = this.map;
        const spd = 100;
        var wmsanimation = setInterval(frame, spd);
        
        function frame() {
            if (i == x.length) {
                i = 0;
            }
            if(x != '') {
                for(let r in x) {
                    for(let k in map.wmslayers) {
                        if (map.wmslayers[k].options.name == x[r].name) {
                            map.wmslayers[k].setOpacity(0);   
                        }   
                    }
                }
            }
            if(x != '') {
                for(let t in map.wmslayers) {
                    if (map.wmslayers[t].options.name == x[i].name) {
                        map.wmslayers[t].setOpacity(1);
                        
                    }   
                }
            }
            i++;

        }

    },


    ////////////////////
    //// SELECT WMS ////
    ////////////////////

    openSelectWMS: function (options, map) { // Creates a list of WMS layers to the menu on the right side.
        this._selectWMS_container = L.DomUtil.create('ul', 'select-WMS-container');

        selectedWMS_container = L.DomUtil.create('ul', 'selected-WMS-container', this._selectWMS_container);
        selectedWMS_container.setAttribute("id", "selected-WMS-container");

        const selectedWMSTitle = L.DomUtil.create('div', 'selected-WMS-title', selectedWMS_container);
        selectedWMSTitle.innerHTML = 'Overlay data on the map:';
        this.selectedWMSLayers_container = L.DomUtil.create('ul', 'selected-WMS-layers-container', selectedWMS_container);
        this.selectedWMSLayers_container.setAttribute("id", "selected-WMS-layers-container");

        const selectedWMSTooltip = L.DomUtil.create('div', 'opened-WMS-tooltip', this.selectedWMSLayers_container);
        selectedWMSTooltip.href = '#';
        selectedWMSTooltip.innerHTML = 'i <class="layer_info">';
        selectedWMSTooltip.title = L._('Click the layers to delete them from the map');

        const selectedWMSTooltipText = L.DomUtil.create('div', 'opened-WMS-tooltip-text', this.selectedWMSLayers_container);
        selectedWMSTooltipText.innerHTML = 'Click the layers to delete them from the map';
        selectedWMSTooltipText.href = '#';
        selectedWMSTooltipText.style.display = 'none';

        if (window.matchMedia('screen and (max-width: 600px)').matches) {
            L.DomEvent.on(selectedWMSTooltip, 'click', function(){
                if (selectedWMSTooltipText.style.display == 'none') {
                        selectedWMSTooltipText.style.display = '';
                    }

                    else{
                        selectedWMSTooltipText.style.display = 'none';
                    }

            },this) ;
        }


        L.DomUtil.create('hr', '', selectedWMS_container);
        if(this.map.options.openWMS == '') {
            selectedWMS_container.style.display = "none"; 
        }

    //The search 
        searchWMS_container = L.DomUtil.create('ul', 'search-WMS-container', this._selectWMS_container);
        const searchWMSTitle = L.DomUtil.create('div', 'WMS-search-title', searchWMS_container);
        searchWMSTitle.innerHTML = 'Search data';
        const searchBox = L.DomUtil.create('input', '', searchWMSTitle);
        searchBox.setAttribute("type", 'search');
        searchBox.setAttribute("id", 'searchInput');
        searchBox.setAttribute("placeholder", "Search for data names..");

        L.DomEvent.on(searchBox, 'search', function(){
            this.clearSearch(); 
            if (document.getElementById('searchInput').value == '') {
                this.searchData();
            }
            this.displayProvidersCategories();
        },this) ;

        if (window.matchMedia('screen and (max-width: 600px)').matches) {
            const searchWMSButton = L.DomUtil.create('button', 'WMS-search-button', searchWMS_container);
            searchWMSButton.innerHTML = 'Search';

            L.DomEvent.on(searchWMSButton, 'click', function(){
                this.searchData();
            },this) ;
        } else{
            L.DomEvent.on(searchWMSTitle, 'keyup', function(){
                this.searchData();
            },this) ;
        }
        L.DomEvent.on(searchWMSTitle, 'keyup', function(){
            this.clearSearch(); 
            if (document.getElementById('searchInput').value == '') {
                this.searchData();
            }
            this.displayProvidersCategories();
        },this) ;

        	
        L.DomUtil.create('hr', 'classes-hr', this._selectWMS_container);

        providerWMS_container = L.DomUtil.create('ul', 'provider-WMS-container', this._selectWMS_container);
        const providerWMSTitle = L.DomUtil.create('div', 'WMS-provider-title', providerWMS_container);
        providerWMSTitle.innerHTML = 'Providers:';


        L.DomUtil.create('hr', 'classes-hr', this._selectWMS_container);    
        this.options.categories = this.options.provider_categories[0];
        categoryWMSMenuTop = L.DomUtil.add('h3', 'category-WMS-menu-top', this._selectWMS_container, L._(''));
        L.DomUtil.create('hr', 'classes-hr', this._selectWMS_container);

        //Loops over the providers and creates the buttons
       	for (let i = 0; i < this.options.providers.length; i++) {
            const providerWMSButton = L.DomUtil.create('button', 'provider-WMS-button', providerWMS_container),
            img = L.DomUtil.create('img', '', providerWMSButton);
            img.src = L.Util.template('/static/umap/img/' + this.options.provider_names[i] +'.png');
            providerWMSButton.innerHTML = '<a>' + this.options.provider_names[i] + '</a>';
            if (i === 0) {
	            providerWMSButton.classList.add('selected');
	        }

            this.options.categories = this.options.provider_categories[i];
            this.options.category_names = this.options.provider_category_names[i];
            this.options.category_names_short = this.options.provider_category_names_short[i];

            this.loadCategories(options, i);
 

            L.DomEvent.on(providerWMSButton, 'click', function () {
            	this.clickProviderButton(i, providerWMSButton);
            }, this);


            for (let j = 0; j < this.options.categories.length; j++) { 

                this.loadLayers(options, j);

                const categoryWMSButton = L.DomUtil.create('button', 'category-WMS-button', categoryWMSMenu);
                categoryWMSButton.innerHTML = '<a>' + this.options.category_names_short[j] + '</a>';
                    if (j === 0) {
                        categoryWMSButton.classList.add('selected');
                }

                L.DomEvent.on(categoryWMSButton, 'click', function () {
				    this.clickCategoryButton(j, i, categoryWMSButton);  
                }, this);

            }
        }

        var ollink = L.DomUtil.create('li', '');
        var label = L.DomUtil.create('span', '', ollink);
        label.innerHTML = label.title = L._('Back'); 
        L.DomEvent.on(ollink, 'click', this.openManageWMS, this);


        this.map.ui.openPanel({data: {html: this._selectWMS_container}, className: 'select-WMS-panel', actions: [ollink]});

        var selectedList = document.getElementById('selected-WMS-layers-container');        
        new Sortable(selectedList, {
            animation: 150,
            ghostClass: 'blue-background-class',
            group: 'openwmsbanner'

        });

        const categoryWMSMenuContainerList = document.getElementsByClassName('category-WMS-menu');
        for(let x = 0; x < categoryWMSMenuContainerList.length; x++) {
            categoryWMSMenuContainerList[x].style.display = "none"; 
        }
        const elem = document.getElementsByClassName('category-WMS-menu')[0];
        elem.style.display = "block"; 

        const categoryWMSLayersContainerList = document.getElementsByClassName('category-WMS-layer-container');
        for(let x = 0; x < categoryWMSLayersContainerList.length; x++) {
            categoryWMSLayersContainerList[x].style.display = "none"; 
        }
        const elem_layer = document.getElementsByClassName('category-WMS-layer-container')[0];
        elem_layer.style.display = "block";  
    },

    //If searching and clicking provider button, shows that provider element
    clickProviderButton: function(i, providerWMSButton){
        this.options.categories = this.options.provider_categories[i];
        this.options.category_names = this.options.provider_category_names[i];
        this.options.category_names_short = this.options.provider_category_names_short[i];

        const providerWMSButtonList = document.getElementsByClassName('provider-WMS-button');
        for(let y = 0; y < providerWMSButtonList.length; y++) {
            providerWMSButtonList[y].classList.remove('selected');
        }

        const categoryWMSMenuContainerList = document.getElementsByClassName('category-WMS-menu');
        for(let x = 0; x < categoryWMSMenuContainerList.length; x++) {
            categoryWMSMenuContainerList[x].style.display = "none"; 
        }
        const elem = document.getElementsByClassName('category-WMS-menu')[i];
        elem.style.display = "block";   

        const elem_category = document.getElementsByClassName('category-WMS-menu')[i];
        const categoryButtonFirst = elem_category.getElementsByClassName('category-WMS-button')[0];
        let s = 0;
    	s = this.getCategoryIndex(i, s);
        this.clickCategoryButton(0, i, categoryButtonFirst);

        providerWMSButton.classList.add('selected');
        this.displayProvidersCategories();

     },

    clickCategoryButton: function(j, i, categoryWMSButton){

        this.clearSearchButton();

    	const elem_category = document.getElementsByClassName('category-WMS-menu')[i];
        const categoryWMSButtonList = elem_category.getElementsByClassName('category-WMS-button');

        for(let y = 0; y < categoryWMSButtonList.length; y++) {
            categoryWMSButtonList[y].classList.remove('selected');
        }
        categoryWMSButton.classList.add('selected');
        const categoryWMSLayersContainerList = document.getElementsByClassName('category-WMS-layer-container');
        for(let x = 0; x < categoryWMSLayersContainerList.length; x++) {
            categoryWMSLayersContainerList[x].style.display = "none"; 
        }

    	let s = 0;
    	s = this.getCategoryIndex(i, s);
    	s = s + j;
        const w = j + i * (categoryWMSButtonList.length-1);
        const elem = document.getElementsByClassName('category-WMS-layer-container')[s];
        elem.style.display = "block"; 

        const title = document.getElementsByClassName('category-WMS-layer-title-search');
        title[0].style.display = 'none';
        this.displayProvidersCategories();

    },


    getCategoryIndex: function(i, s){
    	if (i == 0) {
    		return s;
    	}
    	else{
	    	for (let a = 0; a < i; a++) {
	        	let sub_categories = document.getElementsByClassName('category-WMS-menu')[a];
	        	let sub_categoryWMSButtonList = sub_categories.getElementsByClassName('category-WMS-button');
	        	s = sub_categoryWMSButtonList.length + s;
	    	}
	    }
        return s;   
    },

    displayProvidersCategories: function(){
        const input = document.getElementById('searchInput').value;
        if (input == '') {
            const providerMenu = document.getElementsByClassName('provider-WMS-container');
            for(let y = 0; y < providerMenu.length; y++) {
                providerMenu[y].style.display = '';
            }
            for (var i = document.getElementsByClassName('classes-hr').length - 1; i >= 0; i--) {
                document.getElementsByClassName('classes-hr')[i].style.display = '';
            }
        }

        else {
            const providerMenu = document.getElementsByClassName('provider-WMS-container');
            for(let y = 0; y < providerMenu.length; y++) {
                providerMenu[y].style.display = 'none';
            }
            const categoryMenu = document.getElementsByClassName('category-WMS-menu');
            for(let y = 0; y < categoryMenu.length; y++) {
                categoryMenu[y].style.display = 'none';
            }
            for (var i = document.getElementsByClassName('classes-hr').length - 1; i >= 0; i--) {
                document.getElementsByClassName('classes-hr')[i].style.display = 'none';
            }
        }
    },

	searchData: function() {
        const providerWMSButtonList = document.getElementsByClassName('provider-WMS-button');
        for(let y = 0; y < providerWMSButtonList.length; y++) {
            providerWMSButtonList[y].classList.remove('selected');
        }
        const categoryWMSButtonList = document.getElementsByClassName('category-WMS-button');
        for(let y = 0; y < categoryWMSButtonList.length; y++) {
            categoryWMSButtonList[y].classList.remove('selected');
        }
        const categoryWMSLayersTitleSearch = document.getElementsByClassName('category-WMS-layer-title-search');
        categoryWMSLayersTitleSearch[0].style.display = 'block';

		const elem_layer = document.getElementsByClassName('category-WMS-layer-container');
		for (let i = 0; i < elem_layer.length; i++) {
			elem_layer[i].style.display = "block";
			title = document.getElementsByClassName('category-WMS-layer-title');

			title[i].style.display ="none";

			var input, filter, ul, li, a, txtValue, p, className, dataContainer, title;
			input = document.getElementById('searchInput').value;
			filter = input.toUpperCase();
			dataContainer = document.getElementsByClassName('category-WMS-layer-container');

			for (let w = 0; w < dataContainer.length; w++) {
				ul = dataContainer[w];
				li = ul.getElementsByTagName('li');

				for (q = 0; q < li.length; q++) {
					a = li[q].getElementsByTagName("p")[0];
					txtValue = a.innerText || a.textContent;
					if (txtValue.toUpperCase().indexOf(filter) > -1) {
					li[q].style.display = "";
					} else {
					li[q].style.display = "none";
					}
				}

				if (filter == '') {
					title[i].style.display ="";

                    this.clearSearch();
				}

			}

		}

	},

    clearSearchButton: function(){
        var input;
        input = document.getElementById('searchInput').value;

        if (input != '') {
            document.getElementById('searchInput').value = '';

            //clears the selected
            const providerWMSButtonList = document.getElementsByClassName('provider-WMS-button');
            for(let y = 0; y < providerWMSButtonList.length; y++) {
                providerWMSButtonList[y].classList.remove('selected');
            }
            const categoryWMSButtonList = document.getElementsByClassName('category-WMS-button');
            for(let y = 0; y < categoryWMSButtonList.length; y++) {
                categoryWMSButtonList[y].classList.remove('selected');
            }

            const elem_layer = document.getElementsByClassName('category-WMS-layer-container');
            for (let i = 0; i < elem_layer.length; i++) {
                elem_layer[i].style.display = "block";
                title = document.getElementsByClassName('category-WMS-layer-title');

                title[i].style.display ="block";

                var input, filter, ul, li, a, txtValue, p, className, dataContainer, title;
                input = document.getElementById('searchInput').value;
                filter = input.toUpperCase();
                dataContainer = document.getElementsByClassName('category-WMS-layer-container');

                for (let w = 0; w < dataContainer.length; w++) {
                    ul = dataContainer[w];
                    li = ul.getElementsByTagName('li');

                    for (q = 0; q < li.length; q++) {
                        li[q].style.display = "";
                        
                    }

                }

            }
        }
    },

    clearSearch: function(){

        var input, filter;
        input = document.getElementById('searchInput').value;
        filter = input.toUpperCase();

        if (filter == '') {

            const providerWMSButtonList = document.getElementsByClassName('provider-WMS-button');
            providerWMSButtonList[0].classList.add('selected');
            const categoryWMSButtonList = document.getElementsByClassName('category-WMS-button');
            categoryWMSButtonList[0].classList.add('selected');


            const categoryWMSLayersTitleSearch = document.getElementsByClassName('category-WMS-layer-title-search');
            categoryWMSLayersTitleSearch[0].style.display = 'none';

            const categoryWMSLayersContainerList = document.getElementsByClassName('category-WMS-layer-container');
            for(let x = 0; x < categoryWMSLayersContainerList.length; x++) {
                categoryWMSLayersContainerList[x].style.display = "none"; 
            }
            document.getElementsByClassName('category-WMS-layer-container')[0].style.display = "block";  

            const categoryWMSMenuContainerList = document.getElementsByClassName('category-WMS-menu');
            for(let x = 0; x < categoryWMSMenuContainerList.length; x++) {
                categoryWMSMenuContainerList[x].style.display = "none"; 
            }
            document.getElementsByClassName('category-WMS-menu')[0].style.display = "block"; 
          
            this.options.categories = this.options.provider_categories[0];
            this.options.category_names = this.options.provider_category_names[0];
            this.options.category_names_short = this.options.provider_category_names_short[0];

            document.getElementsByClassName('category-WMS-layer-container')[0].style.display = "block";            

        }

    },

	loadCategories: function (options, index){
        categoryWMSMenu = L.DomUtil.add('h3', 'category-WMS-menu', categoryWMSMenuTop, L._(''));
        const categoryWMSMenuTitle = L.DomUtil.create('div', 'category-WMS-menu-title', categoryWMSMenu);
        categoryWMSMenuTitle.innerHTML = this.options.provider_names[index] +' data categories';
	},


    loadLayers: function (options, index) {
        this.categoryWMSLayers_container = L.DomUtil.create('ul', 'category-WMS-layer-container', this._selectWMS_container),
        this.categoryWMSLayers_container.setAttribute("id", this.options.categories[index]);
        const categoryWMSLayersTitle = L.DomUtil.create('div', 'category-WMS-layer-title', this.categoryWMSLayers_container);
        categoryWMSLayersTitle.innerHTML = this.options.category_names[index] + '<a id="' + this.options.categories[index] + '"></a>';

        const categoryWMSLayersTitleSearch = L.DomUtil.create('div', 'category-WMS-layer-title-search', this.categoryWMSLayers_container);
        categoryWMSLayersTitleSearch.innerHTML = 'Searched data';
        categoryWMSLayersTitleSearch.style.display = 'none';

        this.buildWMSList(options, this.options.categories[index]);
    },

    buildWMSList: function (options, category) {
        this.map.eachWMSLayer(function (wmslayer) {
            if (window.location.protocol === 'https:' && wmslayer.options.url_template.indexOf('http:') === 0) return;
            this.addWMSLayerElement(wmslayer, options, category);
        }, this);  
    },

    addWMSLayerElement: function (wmslayer, options, category) {
        if (category === wmslayer.options.wms_category) {
            let selectedClass = '';
            for (let i in this.map.options.openWMS) {  
                if (wmslayer.options.id == this.map.options.openWMS[i].id) {
                    selectedClass = 'selected';
                }
            }
            const el = L.DomUtil.create('li', selectedClass, this.categoryWMSLayers_container),
                  img = L.DomUtil.create('img', '', el),
                  name = L.DomUtil.create('div', '', el),
                  provider_logo =  wmslayer.options.wms_provider,
                  par = L.DomUtil.create('p', '', name);
            img.src = L.Util.template('/static/umap/img/' + provider_logo +'.png');
            par.innerHTML = wmslayer.options.name;
            if (selectedClass == 'selected') {
                this.selectedWMSLayers_container.appendChild(el);
                this.selectedWMSLayers_container.style.display = "block";
            } 

            L.DomEvent.on(el, 'click', function () {
                const selected = this.map.selectWMSLayer(wmslayer, el);      
                if (selected) {
                    document.getElementById('selected-WMS-layers-container').appendChild(el);
                    document.getElementById('selected-WMS-container').style.display = "block";
                } 
                else {
                    document.getElementById(category).appendChild(el);
                    if(this.map.options.openWMS == '') {
                        document.getElementById('selected-WMS-container').style.display = "none";
                    }
                } 
                if (options && options.callback) options.callback(wmslayer); 
            }, this);
        }

    },

    ////////////////////
    //// MANAGE BGs ////
    ////////////////////

    openManageBG: function (options) {
        this._tilelayers_container = L.DomUtil.create('ul', 'manage-WMS-container backgroundMaps');

        L.DomUtil.create('hr', '', this._tilelayers_container);
                
        const backgroundMapsTitle = L.DomUtil.create('div', 'opened-WMS-title', this._tilelayers_container);
        backgroundMapsTitle.innerHTML = 'Available background maps:';

        this.buildTileList(options);

    },

    buildTileList: function (options) {
        this.map.eachTileLayer(function (tilelayer) {
            if (window.location.protocol === 'https:' && tilelayer.options.url_template.indexOf('http:') === 0) return;
            this.addTileLayerElement(tilelayer, options);
        }, this);

        var browser = L.DomUtil.create('li', '');
        var label = L.DomUtil.create('span', '', browser);
        label.innerHTML = label.title = L._('Data on map');
        L.DomEvent
            .on(browser, 'click', this.openBrowser, this);

        this.map.ui.openPanel({data: {html: this._tilelayers_container}, className: options.className, actions: [browser]});
    },

    addTileLayerElement: function (tilelayer, options) {
        const selectedClass = this.map.hasLayer(tilelayer) ? 'selected' : '',
            el = L.DomUtil.create('li', selectedClass, this._tilelayers_container),
            img = '',
            name = L.DomUtil.create('div', '', el);

        img.src = L.Util.template(tilelayer.options.url_template, this.map.demoTileInfos);
        name.innerHTML = tilelayer.options.name;
        el.style.backgroundImage = 'url('+L.Util.template(tilelayer.options.url_template, this.map.demoTileInfos)+')';

        L.DomEvent.on(el, 'click', function () {
            this.map.selectTileLayer(tilelayer);
            this.map.ui.closePanel();
            if (options && options.callback) options.callback(tilelayer);
        }, this);
    }

});

////////////////////
// LEGEND CONTROL //
////////////////////


L.Control.WMSLegend = L.Control.extend({
    options: {
        position: 'topright',
        uri: '',
        name: ''
    },

    initialize: function (map, options) {
        this.map = map;
        L.Control.prototype.initialize.call(this, options);
    },

    onAdd: function () {
        const container = L.DomUtil.create('div', 'legend_control-container umap-control');

        const link = L.DomUtil.create('a', 'legend-control', container);
        link.href = '#';
        link.innerHTML = 'LEGENDS';
        link.title = L._('Information about data layers');

        L.DomEvent
            .on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', this.openLegendSwitcher, this)
            .on(link, 'dblclick', L.DomEvent.stopPropagation);

        return container;
    },

    openLegendSwitcher: function (options) {
        
        this._legends_container = L.DomUtil.create('ul', 'umap-tilelayer-switcher-container');
        const legendTitle = L.DomUtil.create('div', 'legends-title', this._legends_container);
        legendTitle.innerHTML = 'Legends:';
        this.buildList(options);
        this.map.ui.openPanel({data: {html: this._legends_container}, className: 'wms-legend-panel'});
    },


    buildList: function (options) {
        for (let i = this.map.options.openWMS.length - 1; i >= 0; i--) {
            const legendbutton = L.DomUtil.create('button', 'legend-button', this._legends_container), 
                  lecontainer = L.DomUtil.create('div', 'legend-container', this._legends_container),
                  name = L.DomUtil.create('h5', 'wms-legend-title', legendbutton),
                  nameup = L.DomUtil.create('h5', 'wms-legend-title-dark', lecontainer),
                  img = L.DomUtil.create('img', '', lecontainer);
            name.innerHTML = this.map.options.openWMS[i].name;
            nameup.innerHTML = this.map.options.openWMS[i].name;
            img.src = this.map.options.openWMS[i].url_legend;
            if (img.src == "http://") {
                img.alt == "Layer has no legend";
            } else {
                img.alt = 'Legend not found';
            }
            
            L.DomEvent
            .on(legendbutton, 'click', function () {
                lecontainer.style.display = 'block';
                legendbutton.style.display = 'none';
                if (img.width > 400) {
                    document.getElementById('umap-ui-container')[0].style.width = img.width + 'px';
                }
            });
            L.DomEvent
            .on(img, 'click', function () {
                lecontainer.style.display = 'none';
                legendbutton.style.display = 'block';
                if (img.width > 400) {
                    document.getElementsByClassName('umap-ui-container')[0].style.width = 400 + 'px';
                }
            }, this)
            .on(lecontainer, 'click', function () {
                lecontainer.style.display = 'none';
                legendbutton.style.display = 'block';
                if (img.width > 400) {
                    document.getElementsByClassName('umap-ui-container')[0].style.width = 400 + 'px';
                }
            }, this)
            .on(img, 'click', L.DomEvent.preventDefault)
            legendbutton.style.display = 'none';
        }

    },

});


L.U.AttributionControl = L.Control.Attribution.extend({

    options: {
        prefix: '\u00A9'
    },

    _update: function () {
        L.Control.Attribution.prototype._update.call(this);
        if (this._map.options.shortCredit) {
            L.DomUtil.add('span', '', this._container, ' — ' + L.Util.toHTML(this._map.options.shortCredit));
        }

    }

});


L.U.LocateControl = L.Control.extend({

    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-control-locate umap-control'),
            link = L.DomUtil.create('a', '', container);
        link.href = '#';
        link.title = L._('Center map on your location');
        var fn = function () {
            map.locate({
                setView: true,
                enableHighAccuracy: true
            });
        };

        L.DomEvent
            .on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', fn, map)
            .on(link, 'dblclick', L.DomEvent.stopPropagation);

        return container;
    }
});


L.U.Search = L.PhotonSearch.extend({

    onBlur: function (e) {
        this.fire('blur');
    },

    formatResult: function (feature, el) {
        var self = this;
        var tools = L.DomUtil.create('span', 'search-result-tools', el),
            zoom = L.DomUtil.create('i', 'feature-zoom_to', tools),
            edit = L.DomUtil.create('i', 'feature-edit show-on-edit', tools);
        zoom.title = L._('Zoom to this place');
        edit.title = L._('Save this location as new feature');

        L.DomEvent.on(zoom, 'mousedown', function (e) {
            L.DomEvent.stop(e);
            self.zoomToFeature(feature);
        });
        L.DomEvent.on(edit, 'mousedown', function (e) {
            L.DomEvent.stop(e);
            var datalayer = self.map.defaultDataLayer();
            var layer = datalayer.geojsonToFeatures(feature);
            layer.isDirty = true;
            layer.edit();
        });
        this._formatResult(feature, el);
    },

    zoomToFeature: function (feature) {
        var zoom = Math.max(this.map.getZoom(), 16);
        this.map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], zoom);
    },

    onSelected: function (feature) {
        this.zoomToFeature(feature);
        this.map.ui.closePanel();
    }

});

L.U.SearchControl = L.Control.extend({

    options: {
        position: 'topleft',
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-control-search umap-control'),
            self = this;

        L.DomEvent.disableClickPropagation(container);
        var link = L.DomUtil.create('a', '', container);
        link.href = '#';
        link.title = L._('Search a place name')
        L.DomEvent.on(link, 'click', function (e) {
            L.DomEvent.stop(e);
            self.openPanel(map);
        });
        return container;
    },

    openPanel: function (map) {
        var options = {
            limit: 10,
            noResultLabel: L._('No results'),
        }
        if (map.options.photonUrl) options.url = map.options.photonUrl;
        var container = L.DomUtil.create('div', '');

        var title = L.DomUtil.create('h3', '', container);
        title.textContent = L._('Search location');
        var input = L.DomUtil.create('input', 'photon-input', container);
        var resultsContainer = L.DomUtil.create('div', 'photon-autocomplete', container);
        this.search = new L.U.Search(map, input, options);
        var id = Math.random();
        this.search.on('ajax:send', function () {
            map.fire('dataloading', {id: id});
        });
        this.search.on('ajax:return', function () {
            map.fire('dataload', {id: id});
        });
        this.search.resultsContainer = resultsContainer;
        map.ui.once('panel:ready', function () {
            input.focus();
        });
        map.ui.openPanel({data: {html: container}});
    }

});


L.Control.MiniMap.include({

    initialize: function (layer, options) {
        L.Util.setOptions(this, options);
        this._layer = this._cloneLayer(layer);
    },

    onMainMapBaseLayerChange: function (e) {
        var layer = this._cloneLayer(e.layer);
        if (this._miniMap.hasLayer(this._layer)) {
            this._miniMap.removeLayer(this._layer);
        }
        this._layer = layer;
        this._miniMap.addLayer(this._layer);
    },

    _cloneLayer: function (layer) {
        return new L.TileLayer(layer._url, L.Util.extend({}, layer.options));
    }

});

L.Control.Loading.include({

    onAdd: function (map) {
        this._container = L.DomUtil.create('div', 'umap-loader', map._controlContainer);
        map.on('baselayerchange', this._layerAdd, this);
        this._addMapListeners(map);
        this._map = map;
    },

    _showIndicator: function () {
        L.DomUtil.addClass(this._map._container, 'umap-loading');
    },

    _hideIndicator: function() {
        L.DomUtil.removeClass(this._map._container, 'umap-loading');
    }

});


/*
* Make it dynamic
*/
L.U.ContextMenu = L.Map.ContextMenu.extend({

    _createItems: function (e) {
        this._map.setContextMenuItems(e);
        L.Map.ContextMenu.prototype._createItems.call(this);
    },

    _showAtPoint: function (pt, e) {
        this._items = [];
        this._container.innerHTML = '';
        this._createItems(e);
        L.Map.ContextMenu.prototype._showAtPoint.call(this, pt, e);
    }

});

L.U.IframeExporter = L.Evented.extend({

    options: {
        includeFullScreenLink: false,
        currentView: false,
        keepCurrentDatalayers: false
    },

    queryString: {
        scaleControl: false,
        miniMap: false,
        scrollWheelZoom: false,
        zoomControl: false,
        allowEdit: false,
        moreControl: false,
        searchControl: null,
        tilelayersControl: null,
        embedControl: null,
        datalayersControl: false,
        onLoadPanel: 'none',
		datalayersControl: false,
		legendControl: false,
		logoControl: false,
		protoControl: false,
		openWMSControl: false,
        captionBar: false
    },

    dimensions: {
        width: '100%',
        height: '300px'
    },

    initialize: function (map) {
        this.map = map;
        this.baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
        this.queryString.onLoadPanel = this.map.options.onLoadPanel;
    },

    getMap: function () {
        return this.map;
    },

    build: function () {
        var datalayers = [];
        if (this.options.keepCurrentDatalayers) {
            this.map.eachDataLayer(function (datalayer) {
                if (datalayer.isVisible() && datalayer.umap_id) {
                    datalayers.push(datalayer.umap_id);
                }
            });
            this.queryString.datalayers = datalayers.join(',');
        } else {
            delete this.queryString.datalayers;
        }
        var currentView = this.options.currentView ? window.location.hash : '',
            iframeUrl = this.baseUrl + '?' + this.map.xhr.buildQueryString(this.queryString) + currentView,
            code = '<iframe width="' + this.dimensions.width + '" height="' + this.dimensions.height + '" frameBorder="0" allowfullscreen src="' + iframeUrl + '"></iframe>';
        if (this.options.includeFullScreenLink) {
            code += '<p><a href="' + this.baseUrl + '">' + L._('See full screen') + '</a></p>';
        }
        return code;
    }

});

L.U.Editable = L.Editable.extend({

    initialize: function (map, options) {
        L.Editable.prototype.initialize.call(this, map, options);
         
        this.on('editable:drawing:start editable:drawing:click', this.drawingTooltip);
        this.on('editable:drawing:end', this.closeTooltip);
        // Layer for items added by users
        this.on('editable:drawing:cancel', function (e) {
            if (e.layer._latlngs && e.layer._latlngs.length < e.layer.editor.MIN_VERTEX) e.layer.del();
            if (e.layer instanceof L.U.Marker) e.layer.del();
        });
        this.on('editable:drawing:commit', function (e) {
            e.layer.isDirty = true;
            if (this.map.editedFeature !== e.layer) e.layer.edit(e);
        });
        this.on('editable:editing', function (e) {
            var layer = e.layer;
            layer.isDirty = true;
            if (layer._tooltip && layer.isTooltipOpen()) {
                layer._tooltip.setLatLng(layer.getCenter());
                layer._tooltip.update();
            }
        });
        this.on('editable:vertex:ctrlclick', function (e) {
            var index = e.vertex.getIndex();
            if (index === 0 || index === e.vertex.getLastIndex() && e.vertex.continue) e.vertex.continue();
        });
        this.on('editable:vertex:altclick', function (e) {
            if (e.vertex.editor.vertexCanBeDeleted(e.vertex)) e.vertex.delete();
        });
        this.on('editable:vertex:rawclick', this.onVertexRawClick);
    },

    createPolyline: function (latlngs) {
        return new L.U.Polyline(this.map, latlngs);
    },

    createPolygon: function (latlngs) {
        var polygon = new L.U.Polygon(this.map, latlngs);
        return polygon;
    },

    createMarker: function (latlng) {
        return new L.U.Marker(this.map, latlng);
    },

    connectCreatedToMap: function (layer) {
        // Overrided from Leaflet.Editable
        var datalayer = this.map.defaultDataLayer();
        datalayer.addLayer(layer);
        layer.isDirty = true;
        this.map.isDirty = true;
        return layer;
    },

    drawingTooltip: function (e) {
        var content;
        if (e.layer instanceof L.Marker) content = L._('Click to add a marker');
        else if (e.layer instanceof L.Polyline) {
            if (!e.layer.editor._drawnLatLngs.length) {
                if (e.layer instanceof L.Polygon) content = L._('Click to start drawing a polygon');
                else if (e.layer instanceof L.Polyline) content = L._('Click to start drawing a line');
            } else if (e.layer.editor._drawnLatLngs.length < e.layer.editor.MIN_VERTEX) {
                content = L._('Click to continue drawing');
            } else {
                content = L._('Click last point to finish shape');
            }
        }
        if (content) this.map.ui.tooltip({content: content});
    },

    closeTooltip: function () {
        this.map.ui.closeTooltip();
    },

    onVertexRawClick: function (e) {
        e.layer.onVertexRawClick(e);
        L.DomEvent.stop(e);
        e.cancel();
    }

});

L.U.InfoControl = L.Control.extend({

    options: {
        position: 'topleft'
    },


    initialize: function (map, options) {
        this.map = map;
        L.Control.prototype.initialize.call(this, options);
    },

    onAdd: function () {
        const container = L.DomUtil.create('div', '');

        const link = L.DomUtil.create('a', '', container);
        link.href = '#';
        link.innerHTML = '<img src="/static/umap/img/logo_short.svg" class="bblogo">';
        link.title = L._('Workspace');

        L.DomEvent
            .on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', this.map.displayAcknoledgements, this.map)
            .on(link, 'dblclick', L.DomEvent.stopPropagation);

        return container;
    },

});

L.U.SaveControl = L.Control.extend({

    options: {
        position: 'topright'
    },

    initialize: function (map, options) {
        this.map = map;
        L.Control.prototype.initialize.call(this, options);
    },

    onAdd: function () {
        const container = L.DomUtil.create('div', '');
        var save = L.DomUtil.create('a', 'leaflet-control-edit-save button umap-control', container);

        save.href = '#';
        save.title = L._('Save current edits') + '';

        L.DomEvent
            .addListener(save, 'click', L.DomEvent.stop)
            .addListener(save, 'click', this.map.save, this.map);
        return container;
    },

});






L.U.SyncControl = L.Control.extend({

    options: {
        position: 'topright'
    },


    initialize: function (map, options) {
        this.map = map;
        L.Control.prototype.initialize.call(this, options);
    },

    onAdd: function () {
        const container = L.DomUtil.create('div', 'sync-container umap-control');

        const link = L.DomUtil.create('a', 'sync', container);
        link.href = '#';
        //link.innerHTML = 's';
        link.title = L._('Sync');

        L.DomEvent
            .on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', this.map.syncDataLayers, this.map)
            .on(link, 'dblclick', L.DomEvent.stopPropagation);

        return container;
    },

});

L.U.ProtoControl = L.Control.extend({
        
    options: {
        position: 'bottomleft'
    },


    initialize: function (map, options) {
        this.map = map;
        L.Control.prototype.initialize.call(this, options);
    },
    

    onAdd: function() {
        container = L.DomUtil.create('div', 'myControl');
        var img_log = '<div class="prototype-box"><a class="prototype"><b>PROTOTYPE</b></a></div>';

        container.innerHTML = img_log;
        
        return container;
    },

});   

L.U.LogoControl = L.Control.extend({
        
    options: {
        position: 'bottomleft'
    },


    initialize: function (map, options) {
        this.map = map;
        L.Control.prototype.initialize.call(this, options);
    },
    

    onAdd: function() {
        const container = L.DomUtil.create('div', 'myControl');
        var img_log = '<a><img src="/static/umap/img/logo_short.svg" class="bblogo"></a>';


        return container;
    },

});   

