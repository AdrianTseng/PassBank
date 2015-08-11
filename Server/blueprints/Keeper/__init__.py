__author__ = 'LimeQM'

from flask import Blueprint

keeper = Blueprint('keeper', __name__, template_folder='./templates', url_prefix='/keeper')

from . import views
