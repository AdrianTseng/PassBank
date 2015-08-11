# CSRF
CSRF_ENABLED = True
SECRET_KEY = 'some random string for csrf'

# DataBase
SQLALCHEMY_DATABASE_URI = 'postgres://user:password@localhost/Database'

# 权限控制相关
PAGE_LIST = ['home', 'user', 'keeper', 'signup', 'preference']
__ROLES = ['admin', 'vip', 'user']
__USER_STATUS = ['reserve', 'normal', 'suspend', 'deleted']

# 使用 Table 保存列表内容，提高性能
TABLES = {
    'permits': set(PAGE_LIST),
    'roles':  set(__ROLES),
    'user_status': set(__USER_STATUS)
}

# 安全相关配置，token-authorization 的周期与 bcryption 加密密码的迭代次数
SECURITY = {
    'expiration': 10800, # 三个小时过期 3 * 60 * 60
    'iterations': 8
}