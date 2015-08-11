__author__ = 'LimeQM'

from flask.ext.restful import Resource, abort
from Server.models import Users
from random import sample
from string import ascii_letters, digits


class Random(Resource):

    def get(self, token, length=20):
        user = Users.verify_auth_token(token)
        if user:
            return {"random": ''.join(sample(ascii_letters + digits, length))}
        else:
            abort(404, message="user with token '{}' do not exist".format(token))