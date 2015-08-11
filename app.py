#!env/bin/python

__author__ = 'LimeQM'

from Server import app, db
from flask.ext.script import Manager, Command
from flask.ext.migrate import Migrate, MigrateCommand

migrate = Migrate(app, db)
manager = Manager(app)


class debug(Command):
    app = app

    def run(self):
        app.run(host='0.0.0.0', debug=True)

manager.add_command('debug', debug())
manager.add_command('db', MigrateCommand)

if __name__ == "__main__":
    manager.run()