__author__ = 'LimeQM'

from flask import render_template, jsonify, request
from . import user
from .forms import SigninForm, SignupForm
from Server.models import Users
from Server import db


@user.route('/signin', methods = ['GET', 'POST'])
def signin():
    form = SigninForm()
    if request.method == 'POST':
        if form.validate_on_submit():
            user = Users.query.filter_by(email=form.email.data).first()
            if user and user.verify_password(form.password.data):
                return jsonify({
                    'success': True,
                    'token': user.generate_auth_token(),
                    'user': user.user_info()
                })
            else:
                return jsonify({'success': False, 'invalid_user': True})
        else:
            return jsonify({'success': False, 'errors': {'email': form.email.errors, 'password': form.password.errors}})
    else:
        return render_template("signin.html", module="user", form=form)


@user.route('/signup', methods = ['POST'])
def signup():
    form = SignupForm()
    if form.validate_on_submit():
        user = Users.query.filter_by(email=form.email.data).first()
        if user:
            return jsonify({'success': False, 'invalid_email': True})
        else:
            new_user = Users(
                username=form.username.data,
                email=form.email.data,
                password=Users.hash_password(form.password.data))
            db.session.add(new_user)
            db.session.commit()
            return jsonify({
                'success': True,
                'token': new_user.generate_auth_token(),
                'user': new_user.user_info()
            })
    else:
        return jsonify({'success': False, 'errors': {
            'email': form.email.errors,
            'password': form.password.errors,
            'username': form.username.errors}})
