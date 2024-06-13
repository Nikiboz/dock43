# load_gallery.py
import os
import sqlite3

def load_gallery_data():
    # Print current working directory
    print("Current working directory:", os.getcwd())

    # Connect to the SQLite database
    db_path = os.path.join(os.getcwd(), 'instance', 'dock43.sqlite')
    print("Database path:", db_path)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Check if the photo_links.txt file exists
    photo_links_path = os.path.join(os.getcwd(), 'helpers', 'photo_links.txt')
    if not os.path.exists(photo_links_path):
        print("Error: photo_links.txt file not found.")
        return


    # Read the file and split the content by commas
    with open('photo_links.txt', 'r') as file:
        lines = file.read().split(',')

    # Iterate over the URLs and insert them into the database
    for i, url in enumerate(lines, 1):
        # Insert the URL and image number into the database
        cursor.execute("INSERT INTO gallery (photo_link, photo_text_body) VALUES (?, ?)", (url.strip(), str(i)))

    # Commit the changes and close the connection
    conn.commit()
    conn.close()
    print("Gallery data loaded successfully.")

if __name__ == "__main__":
    load_gallery_data()
