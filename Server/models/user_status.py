__author__ = 'LimeQM'

from Server import db
from uuid import uuid4


class UserStatus(db.Model):
    id = db.Column(db.String(32), default=lambda: str(uuid4()).replace('-', ''), primary_key=True)
    state = db.Column(db.String(16), unique=True, nullable=False)
    user = db.relationship('Users', backref='state', lazy='dynamic')

    def __repr__(self):
        return "帐号状态： <%s> " % self.state
