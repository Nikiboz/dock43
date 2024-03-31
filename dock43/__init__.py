import os
from flask import Flask,render_template

def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'dock43.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Register routes
    #@app.route('/')
    #def blog():
    #    return render_template('index.html', page='blog')

    @app.route('/projects')
    def projects():
        return render_template('projects.html', page='projects')

    @app.route('/cv')
    def cv():
        return render_template('cv.html', page='cv')

    @app.route('/photos')
    def photos():
        photos = [
            {'filename': 'photo1.jpeg', 'alt': 'Photo 1'},
            {'filename': 'photo2.jpeg', 'alt': 'Photo 2'},
            {'filename': 'photo3.jpeg', 'alt': 'Photo 3'},
            {'filename': 'photo4.jpeg', 'alt': 'Photo 4'},
            {'filename': 'photo5.jpeg', 'alt': 'Photo 5'},
            {'filename': 'photo6.jpeg', 'alt': 'Photo 6'},
            {'filename': 'photo7.jpeg', 'alt': 'Photo 7'},
            # Add more photo data as needed
        ]
        return render_template('photos.html', page='photos', photos=photos)

    # Handle 404 errors
    @app.errorhandler(404)
    def page_not_found(error):
        return render_template('404.html'), 404
    
    from . import db
    db.init_app(app)

    from . import auth
    app.register_blueprint(auth.bp)


    from . import blog
    app.register_blueprint(blog.bp)
    app.add_url_rule('/', endpoint='index')


    return app
