#!/usr/bin/env python

"""
This script creates simple tileserver with sqlite datafile sources.
"""

__author__ = "Starodubov Sergey a.k.a. Starik"
__license__ = "ISC"
__version__ = "0.1.0"
__email__ = "4analit@gmail.com"

import sqlite3
import io

from flask import Flask
from flask import send_file

app = Flask(__name__)
dbName = None
c = None
db = None

@app.route('/<name>/<z>/<x>/<y>')
def tile(name, z, x, y):
    global dbName, c, db

    if dbName != name:
        dbName = name
        db = sqlite3.connect(dbName)
        c = db.cursor()

    c.execute("SELECT * FROM tiles WHERE z={} AND x={} AND y={}".format(z, x, y))
    img = c.fetchone()[4]

    return send_file(io.BytesIO(img), mimetype='image/png')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=9999)
