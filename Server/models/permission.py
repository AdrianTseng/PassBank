__author__ = 'LimeQM'

from Server import db


class Permission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    permit = db.Column(db.String(32), unique=True, nullable=False, index=True)

    def __init__(self, permit):
        self.permit = permit

    def __repr__(self):
        return "使用 <%s> 模块的权限" % self.permit
