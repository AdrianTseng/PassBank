__author__ = 'LimeQM'

from flask import render_template, abort
from jinja2 import TemplateNotFound
from . import keeper

@keeper.route('/<path:page>')
def keeper_partials(page):
    try:
        return render_template('%s.html' % page)
    except TemplateNotFound:
        abort(404)