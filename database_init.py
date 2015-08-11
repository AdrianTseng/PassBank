#!env/bin/python3

__author__ = 'LimeQM'

from Server import db
from Server.models import Users, Role, Keeper, Permission, UserStatus
from config import TABLES
from sys import argv

def init_keeper(owner):
    from random import sample
    from string import ascii_letters, digits

    total = ascii_letters + digits
    ranger = range(1, 26)


    label_list = ["帐号%d" % index for index in ranger]
    account_list = [''.join(sample(total, 6)) for each in ranger]
    password_list = [''.join(sample(total, 16)) for each in ranger]

    for label, account, password in zip(label_list, account_list, password_list):
        db.session.add(
            Keeper(
                label=label,
                account=owner.encrypt(account, '1234', label),
                password=owner.encrypt(password, '1234', label),
                owner=owner)
        )
    db.session.commit()

def init_basics():
    for each in TABLES['permits']:
        permissions = Permission.query.all()
        permits = [each.permit for each in permissions]
        if each not in permits:
            permission = Permission(permit=each)
            db.session.add(permission)
            db.session.commit()

    for each in TABLES['roles']:
        roles = Role.query.all()
        role_names = [each.name for each in roles]
        if each not in role_names:
            role = Role(name=each)
            db.session.add(role)
            db.session.commit()

    for each in TABLES['user_status']:
        status = UserStatus.query.all()
        states = [each.state for each in status]
        if each not in states:
            state = UserStatus(state=each)
            db.session.add(state)
            db.session.commit()

    init_relations_with_role_and_permission()

def init_user():
    users = Users.query.all()
    if len(users) == 0:
        user = Users(username="天然呆君", email="mail@qmz.me", password=Users.hash_password('123456'))
        db.session.add(user)
        db.session.commit()
        init_keeper(user)

def init_relations_with_role_and_permission():
    user_permits = ['home', 'user', 'keeper']
    relations = {'admin': TABLES['permits'], 'user': user_permits, 'vip': user_permits}

    for role in TABLES['roles']:
        permits =  relations[role]
        role = Role.query.filter_by(name=role).first()
        [role.permits.append(Permission.query.filter_by(permit=each).first()) for each in permits]
        db.session.commit()

def init_for_debug():
    init_basics()
    init_user()

if __name__ == "__main__":
    if 'debug' in argv and len(argv) is 2:
        init_for_debug()
    elif len(argv) is 1:
        init_basics()
    else:
        print("初始化数据库脚本:")
        print("\t直接运行则为生产环境更新数据库")
        print("\t加入参数 'debug' 则为生产环境更新数据库")
