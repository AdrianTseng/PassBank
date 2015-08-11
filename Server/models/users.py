__author__ = 'LimeQM'

from Server import crypt, app, db
from datetime import datetime
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, SignatureExpired, BadSignature
from .role import Role
from .user_status import UserStatus
from random import sample
from string import ascii_letters, digits
from Crypto.Cipher import AES
from Crypto.Hash import SHA256
from base64 import b64decode, b64encode


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role_id = db.Column(db.String(32), db.ForeignKey('role.id'), index=True, default=lambda: Role.query.filter_by(name='user').first().id)
    state_id = db.Column(db.String(32), db.ForeignKey('user_status.id'), default=lambda: UserStatus.query.filter_by(state='reserve').first().id)

    email = db.Column(db.String(32), unique=True)
    username = db.Column(db.String(16))
    password = db.Column(db.String(128))

    finger_print = db.Column(db.String(28), default=lambda: ''.join(sample(ascii_letters + digits, 28)), nullable=False )
    keeper = db.relationship('Keeper', backref='owner', lazy='dynamic')
    keeper_key = db.Column(db.String(64))
    keeper_active = db.Column(db.Boolean, default=False)
    keeper_length = db.Column(db.SmallInteger, default=12)

    register_date = db.Column(db.DateTime, default=lambda: datetime.utcnow())
    last_signin_date = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    @staticmethod
    def hash_password(password):
        return crypt.generate_password_hash(password, app.config['SECURITY']['iterations'])

    @staticmethod
    def pad(original):
        data = str(original).encode()
        padding_length = AES.block_size - len(data) % AES.block_size
        return original + padding_length * chr(padding_length)

    @staticmethod
    def unpad(padded):
        return padded[:-ord(padded[len(padded)-1:])]

    def generate_keeper_key(self, pin):
        sha = SHA256.new()
        sha.update(("%s%s" % (self.finger_print, pin)).encode())
        return sha.hexdigest()

    def verify_keeper_key(self, pin):
        return self.generate_keeper_key(pin) == self.keeper_key

    def encrypt(self, data, pin, iv):
        cipher = AES.new("%s%s" %(self.finger_print, pin), AES.MODE_CBC, self.pad(iv))
        return "{0}".format(b64encode(cipher.encrypt(self.pad(data))).decode())

    def decrypt(self, ciphered, pin, iv):
        cipher = AES.new("%s%s" % (self.finger_print, pin), AES.MODE_CBC, self.pad(iv))
        return self.unpad(cipher.decrypt(b64decode(ciphered))).decode()

    def verify_password(self, _password):
        try:
            return crypt.check_password_hash(self.password, _password)
        except:
            return False

    def generate_auth_token(self):
        s = Serializer(app.config['SECRET_KEY'], expires_in=app.config['SECURITY']['expiration'])
        return s.dumps({ 'id': self.id }).decode('utf-8')

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token.encode('utf-8'))
            return Users.query.get(data['id'])
        except SignatureExpired and BadSignature:
            return None
        except:
            return None

    def user_info(self):
        return {
            'name': self.username,
            'access_key': self.role.generate_access_key(),
            'keeper_active': self.keeper_active,
            'keeper_length': self.keeper_length
        }

    def __repr__(self):
        return '<User %s>' % (self.username)
