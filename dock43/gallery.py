from flask import Blueprint, render_template
from dock43.db import get_db

gallery = Blueprint('gallery', __name__)

@gallery.route('/gallery')
def show_gallery():
    db = get_db()
    # Use db to query the database
    return render_template('gallery.html')
