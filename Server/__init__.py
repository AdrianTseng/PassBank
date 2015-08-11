__author__ = 'LimeQM'

from flask import Flask
from flask_wtf import CsrfProtect
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.bcrypt import Bcrypt
import config

app = Flask(__name__, static_folder='../static')
app.config.from_object(config)
db = SQLAlchemy(app)
crypt = Bcrypt(app)
csrf = CsrfProtect(app)

app.jinja_env.variable_start_string = '{{ '
app.jinja_env.variable_end_string = ' }}'

from . import views, models

from .blueprints.Home import home
from .blueprints.User import user
from .blueprints.Keeper import keeper
from .blueprints.API_v1 import api as api_v1

app.register_blueprint(home)
app.register_blueprint(user)
app.register_blueprint(keeper)
