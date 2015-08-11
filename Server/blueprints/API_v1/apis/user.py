__author__ = 'LimeQM'

from flask.ext.restful import Resource, abort, reqparse
from Server.models import Users
from Server import db


row_data = reqparse.RequestParser()
row_data.add_argument('data', type=str, help='Can not resolve data')

update_list = ['username', 'password', 'email', 'verify']


class User(Resource):

    def get(self, token, target=None):
        user = Users.verify_auth_token(token)
        if user:
            return {'user': user.user_info()}
        else:
            abort(404, message="user with token '{}' do not exist".format(token))

    def post(self, token, target):
        user = Users.verify_auth_token(token)
        if user:
            if target in update_list:
                data = row_data.parse_args()
                if target == 'username':
                    user.username = data['data']
                elif target == 'password':
                    user.password = Users.hash_password(data['data'])
                elif target == 'verify':
                    return {'matched': user.verify_password(data['data'])}
                else:
                    user.email = data['data']
                db.session.commit()

                return {'user': user.user_info()}
            else:
                return abort(404, message="target error")
        else:
            abort(404, message="user with token '{}' do not exist".format(token))
