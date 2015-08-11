__author__ = 'LimeQM'

from ... import app, csrf
from flask.ext.restful import Api

api = Api(app, prefix='/api/v1', decorators=[csrf.exempt])

from .apis.user import User
from .apis.keeper import Passwords
from .apis.random import Random
from .apis.permission import Permission
from .apis.preference import Preference


api.add_resource(User, '/user/<string:token>', '/user/<string:token>/<string:target>')
api.add_resource(Passwords, '/keeper/<string:token>/<string:pin>', '/keeper/<string:token>/<string:pin>/<int:id>')
api.add_resource(Random, '/random/<string:token>', '/random/<string:token>/<int:length>')
api.add_resource(Permission, '/permission/<string:access_key>/<string:service>')
api.add_resource(Preference, '/preference/<string:token>/<string:target>/<string:item>/<string:new_value>', '/preference/<string:token>/<string:target>/<string:item>/<string:new_value>/<string:old_value>')