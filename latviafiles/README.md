# The Latvia case study module shows one example analysis functionalities added to Baltic Explorer.

* The example shows a minimum viable product version. For a smoother experience, use ajax when developing new analysis functioanlities to avoid having to reload pages to see results.

# Replace the files in umap with these files.
*Javascript files can be added to "umap/static/umap/js/" or to the custom static folder specified in the umap.conf file
*latvian_case.html can be added to "umap/templates/umap/" or to the custom templates folder specified in the umap.conf file
*Theme.css files can be added to "umap/static/umap/" or to the custom static folder specified in the umap.conf file
*Python files need to be replaced in the "umap/" main folder
*PNG and TIF files need to be added to umap/templates/data/latvian_case

*After replacing the files, make sure user umap is the owner of all files.
*Log in with user umap.
*Activate virtual enviroment running Baltic Explorer. 
  umap makemigrations
  umap migrate
  umap collecstatic
*Run the server

To enable the analysis functionalities in a workspace, make sure the workspace name starts with "LatviaCS".
