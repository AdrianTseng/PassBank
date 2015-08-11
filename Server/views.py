__author__ = 'LimeQM'

from flask import render_template, redirect, url_for, abort
from jinja2 import TemplateNotFound
from . import app


@app.route('/')
def index():
    return redirect('/home')

pages = app.config['TABLES']['permits']
@app.route('/<path:page>')
def layout(page):
    if page in pages:
        return render_template('layout.html')
    else:
        abort(404)

@app.route('/partials/<path:content>.html')
def partials(content):
    try:
        return render_template("/partials/%s.html" % content, module=content)
    except TemplateNotFound:
        abort(404)

@app.route('/static/<path:statics>')
def statics(statics):
    return url_for('static', statics)