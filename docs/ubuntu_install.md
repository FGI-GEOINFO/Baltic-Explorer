# Install instructions for Ubuntu 18.04 from local copy

This tutorial will cover an installation of Baltic Explorer for Ubuntu 18.04 LTS from a local copy.

You need sudo grants and must be connected to the Internet.

## Download Baltic-Explorer master

Download and save Baltic-Explorer master from GitHub.

## Install GDAL Python dependencies
*GDAL is not needed in the main Baltic Explorer system. It is included to enable adding, for example, analysis functionalities to the system. If you do not wish to install GDAL, in order not to get errors in the installation, you need to remove the import of "osgeo" from the views.py file.*

    sudo add-apt-repository ppa:ubuntugis/ppa

    sudo apt-get update
    sudo apt install gdal-bin libgdal-dev
    
    export CPLUS_INCLUDE_PATH=/usr/include/gdal
    export C_INCLUDE_PATH=/usr/include/gdal

## Install other system dependencies

    sudo apt install build-essential autoconf python3.6 python3.6-dev python-virtualenv wget nginx uwsgi uwsgi-plugin-python3 postgresql-10 postgresql-server-dev-10 postgresql-10-postgis-2.4 git libxml2-dev libxslt1-dev zlib1g-dev

## Create deployment directories:

    sudo mkdir -p /srv/umap
    sudo mkdir -p /etc/umap

*You can change this path, but then remember to adapt the other steps accordingly.*


## Create a Unix user

    sudo useradd -N umap -d /srv/umap/

*Here we use the name `umap`, but this name is up to you. Remember to change it
on the various commands and configuration files if you go with your own.*

## Create folders for custom files
*You can change these locations, but you need to specify the directories in the configurations (umap.conf file). If you place them in a location other than /srv/umap, you need to give user umap ownership of the directories (e.g. like what is done for /srv/umap in the next step).*
    
    sudo mkdir -p /srv/umap/var/static
    sudo mkdir -p /srv/umap/var/templates

## Give umap user access to the config folder

    sudo chown umap:users /etc/umap
    sudo chown umap:users /srv/umap


## Create a postgresql user

    sudo -u postgres createuser umap


## Create a postgresql database

    sudo -u postgres createdb umap -O umap


## Activate PostGIS extension

    sudo -u postgres psql umap -c "CREATE EXTENSION postgis"


## Login as umap Unix user

    sudo -u umap -i

From now on, unless we say differently, the commands are run as `umap` user.


## Create a virtualenv and activate it

    virtualenv /srv/umap/venv --python=/usr/bin/python3.6
    . /srv/umap/venv/bin/activate

*Note: this activation is not persistent, so if you open a new terminal window,
you will need to run again this last line.*


## Install umap
*Specify the path to the downloaded and unzipped Baltic-Explorer-master directory*

    pip3 install /PATH/TO/Baltic-Explorer-master

## Install GDAL
*GDAL is not needed in the main Baltic Explorer system. It is included to enable adding, for example, analysis functionalities to the system. If you wish to not install GDAL, in order to not get errors in the installation, you need to remove the import of "osgeo" from the views.py file.*

    pip3 install numpy
    pip3 install GDAL==2.4.2
    pip3 install rasterio

## Create a local configuration file

    cp PATH/TO/Baltic-Explorer-master/etc/umap/umap.conf /etc/umap/umap.conf

## Customize umap.conf
*NOTE! If you just want to start by testing that everything works, you can skip this step.*
    
    nano /etc/umap/umap.conf

## Create the tables
    
    umap makemigrations
    umap migrate

## Collect the statics

    umap collectstatic

## Create a superuser

    umap createsuperuser

## Start the demo server

    umap runserver 0.0.0.0:8000

You can now go to [http://localhost:8000/](http://localhost:8000/) and try to create a map for testing.

When you're done with testing, quit the demo server (type Ctrl+C).

## Add minimum data requirements

login to http://localhost:8000/admin and add a WMS provider, category and layer. Also add a background map.
Data for baltic sea can be found from, amongst others, HELCOM.
E.g. wms layers:
https://maps.helcom.fi/arcgis/services/MADS/Biodiversity/MapServer/WMSServer?request=GetCapabilities&service=WMS
Background map:
To be added!

## Configure the HTTP API

*Note: nginx and uwsgi are not required for local development environment* 
i.e. you do not have to do the following parts if you just wish to run Baltic Explorer locally from your own computer

Now let's configure a proper HTTP server.

### uWSGI

Create a file named `/srv/umap/uwsgi_params`, with this content
(without making any change on it):

```
uwsgi_param  QUERY_STRING       $query_string;
uwsgi_param  REQUEST_METHOD     $request_method;
uwsgi_param  CONTENT_TYPE       $content_type;
uwsgi_param  CONTENT_LENGTH     $content_length;

uwsgi_param  REQUEST_URI        $request_uri;
uwsgi_param  PATH_INFO          $document_uri;
uwsgi_param  DOCUMENT_ROOT      $document_root;
uwsgi_param  SERVER_PROTOCOL    $server_protocol;
uwsgi_param  REQUEST_SCHEME     $scheme;
uwsgi_param  HTTPS              $https if_not_empty;

uwsgi_param  REMOTE_ADDR        $remote_addr;
uwsgi_param  REMOTE_PORT        $remote_port;
uwsgi_param  SERVER_PORT        $server_port;
uwsgi_param  SERVER_NAME        $server_name;
```

Then create a configuration file for uWSGI:

    nano /srv/umap/uwsgi.ini

And paste this content. Double check paths and user name in case you
have customized some of them during this tutorial. If you followed all the bits of the
tutorial without making any change, you can use it as is:

```
[uwsgi]
uid = umap
gid = users
# Python related settings
# the base directory (full path)
chdir           = /srv/umap/
# umap's wsgi module
module          = umap.wsgi
# the virtualenv (full path)
home            = /srv/umap/venv

# process-related settings
# master
master          = true
# maximum number of worker processes
processes       = 4
# the socket (use the full path to be safe
socket          = /srv/umap/uwsgi.sock
# ... with appropriate permissions - may be needed
chmod-socket    = 666
stats           = /srv/umap/stats.sock
# clear environment on exit
vacuum          = true
plugins         = python3

```

### Nginx

Create a new file:

    nano /srv/umap/nginx.conf

with this content:

```
# the upstream component nginx needs to connect to
upstream umap {
    server unix:///srv/umap/uwsgi.sock;
}

# configuration of the server
server {
    # the port your site will be served on
    listen      80;
    listen   [::]:80;
    listen      443 ssl;
    listen   [::]:443 ssl;
    # the domain name it will serve for
    server_name your-domain.org;
    charset     utf-8;

    # max upload size
    client_max_body_size 5M;   # adjust to taste

    # Finally, send all non-media requests to the Django server.
    location / {
        uwsgi_pass  umap;
        include     /srv/umap/uwsgi_params;
    }
}
```

Remember to adapt the domain name.

### Activate and restart the services

Now quit the `umap` session, simply by typing Ctrl+D.

You should now be logged in as your normal user, which is sudoer.

- Activate the Nginx configuration file:

        sudo ln -s /srv/umap/nginx.conf /etc/nginx/sites-enabled/umap

- Activate the uWSGI configuration file:

        sudo ln -s /srv/umap/uwsgi.ini /etc/uwsgi/apps-enabled/umap.ini

- Restart both services:

        sudo systemctl restart uwsgi nginx


Now you should access your server through your url and create maps:

    http://yourdomain.org/


Congratulations!

- - -

## Troubleshooting

- Nginx logs are in /var/log/nginx/:

        sudo tail -f /var/log/nginx/error.log
        sudo tail -f /var/log/nginx/access.log

- uWSGI logs are in /var/log/uwsgi:

        sudo tail -f /var/log/uwsgi/umap.log


## Before going live

### Add a real SECRET_KEY

In your local.py file, add a real secret and unique `SECRET_KEY`, and do
not share it.


### Specify locations
In your nginx config:

    location /static {
        autoindex off;
        alias /path/to/umap/var/static/;   
    }

    location /uploads {
        autoindex off;
        alias /path/to/umap/var/data/;    
    }

### Configure social auth

Now you can login with your superuser, but you may allow users to user social
authentication.

### Configure default map center

In your umap.conf change those settings:

    LEAFLET_LONGITUDE = 2
    LEAFLET_LATITUDE = 51
    LEAFLET_ZOOM = 6

### Activate statics compression

In your local.py, set `COMPRESS_ENABLED = True`, and then run the following command

    umap compress


### Configure the site URL and short URL

In your local.py:

    SITE_URL = "http://localhost:8019"
    SHORT_SITE_URL = "http://s.hort"

Also adapt `ALLOWED_HOSTS` accordingly.


## Add more background maps, wms layers etc.

Go to the admin: [http://localhost:8020/admin/](http://localhost:8020/admin/),
and create the objects you want.

