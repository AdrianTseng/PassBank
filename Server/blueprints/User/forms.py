__author__ = 'LimeQM'

from flask_wtf import Form
from wtforms import PasswordField, StringField
from flask_wtf.html5 import EmailField
from wtforms.validators import InputRequired, Regexp


class SigninForm(Form):
    email = EmailField('用户邮箱', validators=[InputRequired()])
    password = PasswordField('用户密码', validators=[InputRequired()])

class SignupForm(Form):
    email = EmailField('用户邮箱', validators=[InputRequired()])
    password = PasswordField('用户密码', validators=[InputRequired()])
    #用正则表达式确定“空格”、“数字”、“字母”、“汉字”，排除其他元素
    username = StringField('用户名', validators=[InputRequired(), Regexp("[\s0-9a-zA-Z\u4e00-\u9fff]", 0, "Username Data Error")])