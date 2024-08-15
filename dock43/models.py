#models.py
from .db import db
from flask_login import UserMixin
from datetime import datetime

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created = db.Column(db.DateTime, default=db.func.current_timestamp())
    title = db.Column(db.String(100), nullable=False)
    body = db.Column(db.Text, nullable=False)
    
    author = db.relationship('User', backref=db.backref('posts', lazy=True))


class Photo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    photo_link = db.Column(db.String(255), nullable=False)
    photo_text_body = db.Column(db.Text, nullable=True)  # Optional text description for the photo

    def __repr__(self):
        return f"Photo(id={self.id}, photo_link={self.photo_link})"