__author__ = 'LimeQM'

from Server import db
from datetime import datetime


class Keeper(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(32), nullable=False)
    account = db.Column(db.String(48), nullable=False)
    password = db.Column(db.String(48), nullable=False)
    password_original = db.Column(db.String(48))
    link = db.Column(db.Text, nullable=True)
    generated_date = db.Column(db.DateTime, default=datetime.utcnow(), nullable=False)
    modified_date = db.Column(db.DateTime, default=datetime.utcnow(), nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True)

    def __repr__(self):
        return '<password in keeper with label: %s, account: %s, password: %s>' % (self.label, self.account, self.password)
