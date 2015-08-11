__author__ = 'LimeQM'

from flask.ext.restful import Resource, abort, fields, marshal_with, reqparse
from Server.models import Users, Keeper
from Server import db
from datetime import datetime


class DecryptRow(fields.Raw):
    def format(self, value):
        return

keeper_fields = {
    'id': fields.String,
    'label': fields.String,
    'account': fields.String,
    'password': fields.String,
    'password_original': fields.String,
    'link': fields.String,
    'modified_date': fields.DateTime(dt_format='iso8601')
}

row_data = reqparse.RequestParser()
row_data.add_argument('label', type=str, help='Can not resolve name')
row_data.add_argument('account', type=str, help='Can not resolve account')
row_data.add_argument('password', type=str, help='Can not resolve password')
row_data.add_argument('password_original', type=str, help='Can not resolve password')
row_data.add_argument('link', type=str, help='Can not resolve link')


class Passwords(Resource):
    @marshal_with(keeper_fields)
    def get(self, token, pin=1234, id=None):
        user = Users.verify_auth_token(token)
        if user and user.verify_keeper_key(pin):
            passwords = user.keeper.all()
            for each in passwords:
                each.account = user.decrypt(each.account, pin, each.label)
                each.password = user.decrypt(each.password, pin, each.label)
                if each.password_original is not None:
                    each.password_original = user.decrypt(each.password_original, pin, each.label)
            return passwords
        else:
            abort(404, message="invalid user token or pin")

    @marshal_with(keeper_fields)
    def post(self, token, pin=1234, id=None):
        user = Users.verify_auth_token(token)
        if user and user.verify_keeper_key(pin):
            data = row_data.parse_args()
            password_data = Keeper(
                owner=user,
                label=data['label'],
                account=user.encrypt(data['account'], pin, data['label']),
                password=user.encrypt(data['password'], pin, data['label']),
                link=data['link']
            )
            db.session.add(password_data)
            db.session.commit()
            return Keeper(
                owner=user,
                label=data['label'],
                account=data['account'],
                password=data['password'],
                link=data['link']
            )
        else:
            abort(404, message="invalid user token or pin")

    @marshal_with(keeper_fields)
    def put(self, token, pin=1234, id=None):
        user = Users.verify_auth_token(token)
        if user and user.verify_keeper_key(pin):
            password_data = user.keeper.filter_by(id=id).first()
            if password_data:
                data = row_data.parse_args()
                password_data.label = data['label']
                password_data.account = user.encrypt(data['account'], pin, data['label'])
                password_data.password = user.encrypt(data['password'], pin, data['label'])
                if data['password_original']:
                    password_data.password_original = user.encrypt(data['password_original'], pin, data['label'])
                password_data.link = data['link'],
                password_data.modified_date = datetime.utcnow()
                db.session.commit()

                password_data.account = data['account']
                password_data.password = data['password']
                password_data.password_original = data['password_original']
                return password_data
            else:
                abort(404, message='invalid user data')
        else:
            abort(404, message="invalid user token or pin")


    def delete(self, token, pin=1234, id=None):
        user = Users.verify_auth_token(token)
        if user and user.verify_keeper_key(pin):
            password_data = user.keeper.filter_by(id=id).first()
            if password_data:
                db.session.delete(password_data)
                db.session.commit()
                return {'state': 'done'}, 200
            else:
                return "None content found", 204
        else:
            abort(404, message="invalid user token or pin")
