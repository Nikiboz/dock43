import os
from flask import Blueprint, render_template, request, jsonify, current_app
from dock43.db import get_db
from dock43.models import Photo  # Import the Photo model

gallery = Blueprint('gallery', __name__)

# Route to display the gallery
@gallery.route('/gallery')
def show_gallery():
    db = get_db()
    # Query all photos from the database
    photos = Photo.query.all()
    return render_template('gallery.html', photos=photos)

# API endpoint to add a new photo
@gallery.route('/api/photo', methods=['POST'])
def add_photo():
    data = request.json
    photo_link = data.get('photo_link')
    photo_text_body = data.get('photo_text_body')

    # Validate input
    if not photo_link:
        return jsonify({'error': 'Missing photo_link parameter'}), 400

    # Create a new Photo object and add it to the database
    new_photo = Photo(photo_link=photo_link, photo_text_body=photo_text_body)
    db = get_db()
    db.session.add(new_photo)
    db.session.commit()

    return jsonify({'message': 'Photo added successfully', 'photo': {
        'id': new_photo.id,
        'photo_link': new_photo.photo_link,
        'photo_text_body': new_photo.photo_text_body
    }}), 201

# Route to fetch static images from the static/gg/ directory
@gallery.route('/api/static_images', methods=['GET'])
def get_static_images():
    image_folder = os.path.join(current_app.static_folder, 'GG')
    images = []
    if os.path.exists(image_folder):
        for filename in os.listdir(image_folder):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                images.append(os.path.join('static', 'GG', filename))
    return jsonify(images)

# Example of how to delete a photo (if needed)
@gallery.route('/api/photo/<int:photo_id>', methods=['DELETE'])
def delete_photo(photo_id):
    db = get_db()
    photo = Photo.query.get_or_404(photo_id)

    db.session.delete(photo)
    db.session.commit()

    return jsonify({'message': 'Photo deleted successfully'}), 200
