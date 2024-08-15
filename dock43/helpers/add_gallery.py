import os

# Directory to scan for files
photos_directory = '../static/gg'

# Output file to write SQL statements
output_file = 'insert_photos.sql'

# Open the output file for writing SQL statements
with open(output_file, 'w') as f:
    # Initialize counter for photo_text_body
    counter = 1

    # Iterate through files in the directory
    for filename in os.listdir(photos_directory):
        filepath = os.path.join(photos_directory, filename)
        if os.path.isfile(filepath):
            # Generate SQL statement
            insert_statement = f"INSERT INTO photo (photo_link, photo_text_body) VALUES ('{filepath}', '{str(counter).zfill(3)}');\n"
            # Write to file
            f.write(insert_statement)
            # Increment counter
            counter += 1

print(f"SQL statements written to {output_file}")
