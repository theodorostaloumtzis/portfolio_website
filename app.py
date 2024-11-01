from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import pymongo
import os
from werkzeug.utils import secure_filename
import logging
from bson import ObjectId

# Initialize Flask app
_api = Flask(__name__)
_api.secret_key = 'your_secret_key'  # Needed for session management

UPLOAD_FOLDER = 'static/uploads'
_api.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

_user = 'admin'
_password = 'admin'  # Replace with the password you used above
_host = 'localhost'
_port = '27017'

_client = pymongo.MongoClient(f'mongodb://{_user}:{_password}@{_host}:{_port}/?authSource=admin')
_db = _client['mydatabase']
_skills = _db['skills']  
_projects = _db['projects']
_education = _db['education']
_experience = _db['experience']

# Admin credentials (for demonstration purposes only)
ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'admin'


# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Home route - fetches Skills, Experience, Education data and passes it to index.html
@_api.route('/')
def home():
    skills = _skills.find_one({"name": "skills"}).get('data', [])
    education = _education.find_one({"name": "education"}).get('data', [])
    experience = _experience.find_one({"name": "experience"}).get('data', [])
    projects = _projects.find_one({"name": "projects"}).get('data', [])
    return render_template('index.html', skills=skills, education=education, experience=experience, projects=projects)

# Login route
@_api.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            session['logged_in'] = True
            return redirect(url_for('admin_dashboard'))
        else:
            return "Invalid credentials", 401
    return render_template('login.html')

# Logout route
@_api.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('login'))

# Admin dashboard route
@_api.route('/admin')
def admin_dashboard():
    if 'logged_in' in session:
        return render_template('admin.html')
    else:
        return redirect(url_for('login'))

# API endpoint to get and add skills
@_api.route('/api/skills', methods=['GET', 'POST'])
def skills():
    if request.method == 'GET':
        skills = _skills.find_one({"name": "skills"})
        return jsonify(skills.get('data', [])), 200
    elif request.method == 'POST' and 'logged_in' in session:
        data = request.json
        _skills.update_one(
            {"name": "skills"},
            {"$push": {"data": data}},
            upsert=True
        )
        return jsonify({"message": "Skill added successfully"}), 201
    return jsonify({"error": "Unauthorized"}), 403

# API endpoint to get and add education
@_api.route('/api/education', methods=['GET', 'POST'])
def education():
    if request.method == 'GET':
        education = _education.find_one({"name": "education"})
        return jsonify(education.get('data', [])), 200
    elif request.method == 'POST' and 'logged_in' in session:
        data = request.json
        _education.update_one(
            {"name": "education"},
            {"$push": {"data": data}},
            upsert=True
        )
        return jsonify({"message": "Education added successfully"}), 201
    return jsonify({"error": "Unauthorized"}), 403

# API endpoint to get and add experience
@_api.route('/api/experience', methods=['GET', 'POST'])
def experience():
    if request.method == 'GET':
        experience = _experience.find_one({"name": "experience"})
        return jsonify(experience.get('data', [])), 200
    elif request.method == 'POST' and 'logged_in' in session:
        data = request.json
        _experience.update_one(
            {"name": "experience"},
            {"$push": {"data": data}},
            upsert=True
        )
        return jsonify({"message": "Experience added successfully"}), 201
    return jsonify({"error": "Unauthorized"}), 403

# API endpoint to get and add projects with image upload
@_api.route('/api/projects', methods=['GET', 'POST'])
def projects():
    if request.method == 'GET':
        projects = _projects.find_one({"name": "projects"})
        return jsonify(projects.get('data', [])), 200
    elif request.method == 'POST' and 'logged_in' in session:
        try:
            title = request.form.get('title')
            start_date = request.form.get('start_date')
            end_date = request.form.get('end_date')
            description = request.form.get('description')
            url = request.form.get('url')
            image_file = request.files.get('image')

            image_path = None
            if image_file and image_file.filename != '':
                filename = secure_filename(image_file.filename)
                image_path = os.path.join(_api.config['UPLOAD_FOLDER'], filename)
                image_file.save(image_path)
                image_path = f"{UPLOAD_FOLDER}/{filename}"

            project_data = {
                "title": title,
                "start_date": start_date,
                "end_date": end_date,
                "description": description,
                "url": url,
                "image": image_path
            }

            _projects.update_one(
                {"name": "projects"},
                {"$push": {"data": project_data}},
                upsert=True
            )
            return jsonify({"message": "Project added successfully"}), 201

        except Exception as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Unauthorized"}), 403

# Run the Flask application
def main():
    _api.run(debug=True)

if __name__ == '__main__':
    main()
