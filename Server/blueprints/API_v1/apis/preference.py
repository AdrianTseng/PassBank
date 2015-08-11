__author__ = 'LimeQM'

from flask.ext.restful import Resource, abort
from Server.models import Users
from Server import db


class Preference(Resource):

    def get(self, token, target, item, new_value, old_value=None):
        user = Users.verify_auth_token(token)
        if user:
            if target == "keeper":
                if item == "pin":
                    if not user.keeper_active:
                        user.keeper_key = user.generate_keeper_key(new_value)
                        user.keeper_active = True
                        db.session.commit()
                        return 'initialized', 200
                    else:
                        if user.verify_keeper_key(old_value):
                            data = user.keeper.all()
                            for each in data:
                                each.account = user.encrypt(user.decrypt(each.account, old_value, each.label), new_value, each.label)
                                each.password = user.encrypt(user.decrypt(each.password, old_value, each.label), new_value, each.label)
                                if each.password_original:
                                    each.password_original = user.encrypt(user.decrypt(each.password_original, old_value, each.label), new_value, each.label)
                            user.keeper_key = user.generate_keeper_key(new_value)
                            db.session.commit()
                            return 'done', 200
                        else:
                            return 'valid pin', 404
                elif item == "length":
                    user.keeper_length = new_value
                    db.session.commit()
                    return 'done', 200
                else:
                    abort(404, message='invalid item:{} for target:{}'.format(item, target))
            elif target == "verify":
                if item == "pin":
                    return {'valid': user.verify_keeper_key(new_value)}, 200
                else:
                    abort(404, message='invalid item:{} for target:{}'.format(item, target))
            else:
                abort(404, message='invalid target: {}'.format(target))
        else:
            abort(404, message='invalid user token: {}'.format(token))
