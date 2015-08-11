__author__ = 'LimeQM'


from flask.ext.restful import Resource
from ....models import Role


class Permission(Resource):
    def get(self, access_key, service):
        return {'approved': Role.verify_access_authority(service, access_key)}, 200