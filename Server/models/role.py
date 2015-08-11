__author__ = 'LimeQM'

from Server import app, db
from uuid import uuid4
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, SignatureExpired, BadSignature

authority = db.Table('authorities', db.Model.metadata,
                     db.Column('permission_id', db.Integer, db.ForeignKey('permission.id')),
                     db.Column('role_id', db.String(32), db.ForeignKey('role.id')))


class Role(db.Model):
    id = db.Column(db.String(32), default=lambda: str(uuid4()).replace('-', ''), primary_key=True)
    name = db.Column(db.String(32), unique=True, nullable=False, index=True)
    permits = db.relationship('Permission', secondary=authority, backref=db.backref('roles', lazy='dynamic'))
    users = db.relationship('Users', backref='role', lazy='dynamic')

    def generate_access_key(self):
        s = Serializer(app.config['SECRET_KEY'], expires_in=app.config['SECURITY']['expiration'])
        return s.dumps({ 'id': self.id }).decode('utf-8')

    @staticmethod
    def verify_access_authority(page, access_key):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            role_id = s.loads(access_key.encode('utf-8'))['id']
            role = Role.query.get(role_id)
            permissions = role.permits
            permits = [each.permit for each in permissions]
            return True if page in permits else False
        except SignatureExpired and BadSignature:
            return False

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return "用户 <%s>" % self.name
