import os
import errno  # Import errno module
from flask import Flask, render_template
from flask_login import LoginManager
from .db import init_app as init_db, db
from .models import User

def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev'),
        SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URL', 'sqlite:///' + os.path.join(app.instance_path, 'dock43.sqlite')),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError as e:
        if e.errno != errno.EEXIST:
            raise

    @app.route('/projects')
    def projects():
        return render_template('projects.html', page='projects')

    @app.route('/cv')
    def cv():
        return render_template('cv.html', page='cv')

    @app.errorhandler(404)
    def page_not_found(error):
        return render_template('404.html'), 404
    
    @app.errorhandler(500)
    def internal_server_error(error):
        return render_template('500.html'), 500

    init_db(app)

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from .blog import blog as blog_blueprint
    app.register_blueprint(blog_blueprint)
    
    from .gallery import gallery as gallery_blueprint
    app.register_blueprint(gallery_blueprint)

    app.add_url_rule('/', endpoint='index')

    return app
