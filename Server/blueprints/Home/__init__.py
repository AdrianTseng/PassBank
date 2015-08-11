__author__ = 'LimeQM'

from flask import Blueprint

home = Blueprint('home', __name__, template_folder='./templates', url_prefix='/home')
