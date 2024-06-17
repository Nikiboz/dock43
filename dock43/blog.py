#blog.py
from flask import Blueprint, render_template, request, flash, redirect, url_for, abort
from flask_login import login_required
from flask_login import current_user
from .db import db
from .models import Post
from .forms import PostForm

blog = Blueprint('blog', __name__)

@blog.route('/')
def index():
    posts = Post.query.all()
    return render_template('blog.html', posts=posts)

@blog.route('/create', methods=['GET', 'POST'])
@login_required
def create():
    form = PostForm()
    if form.validate_on_submit():
        new_post = Post(
            title=form.title.data,
            body=form.body.data,
            author_id=current_user.id
        )
        db.session.add(new_post)
        db.session.commit()
        flash('Post created!', 'success')
        return redirect(url_for('blog.index'))
    return render_template('create_post.html', form=form)

@blog.route('/<int:id>/update', methods=['GET', 'POST'])
@login_required
def update(id):
    post = Post.query.get_or_404(id)
    if post.author_id != current_user.id:
        abort(403)
    form = PostForm()
    if form.validate_on_submit():
        post.title = form.title.data
        post.body = form.body.data
        db.session.commit()
        flash('Post updated!', 'success')
        return redirect(url_for('blog.index'))
    elif request.method == 'GET':
        form.title.data = post.title
        form.body.data = post.body
    return render_template('update_post.html', form=form)