from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import pymongo
import os
from werkzeug.utils import secure_filename
import logging
from bson import ObjectId
from bson.errors import InvalidId

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
    skills = list(_skills.find({}))  # Fetch all skill documents
    education = list(_education.find({}))  # Fetch all education documents
    experience = list(_experience.find({}))  # Fetch all experience documents
    projects = list(_projects.find({}))  # Fetch all project documents

    # Convert ObjectId to string for JSON serialization
    for item in skills + education + experience + projects:
        item["_id"] = str(item["_id"])

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

# Add Skill (create a new document)
@_api.route('/api/skills', methods=['POST'])
def add_skill():
    if 'logged_in' in session:
        data = request.json
        data["_id"] = ObjectId()  # MongoDB will auto-generate _id if not provided
        _skills.insert_one(data)  # Insert as a new document
        return jsonify({"message": "Skill added successfully"}), 201
    return jsonify({"error": "Unauthorized"}), 403

# Add Education
@_api.route('/api/education', methods=['POST'])
def add_education():
    if 'logged_in' in session:
        data = request.json
        data["_id"] = ObjectId()
        _education.insert_one(data)
        return jsonify({"message": "Education added successfully"}), 201
    return jsonify({"error": "Unauthorized"}), 403

# Add Experience
@_api.route('/api/experience', methods=['POST'])
def add_experience():
    if 'logged_in' in session:
        data = request.json
        data["_id"] = ObjectId()
        _experience.insert_one(data)
        return jsonify({"message": "Experience added successfully"}), 201
    return jsonify({"error": "Unauthorized"}), 403

# Add Project (with optional image upload)
@_api.route('/api/projects', methods=['POST'])
def add_project():
    if 'logged_in' in session:
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
            "_id": ObjectId(),
            "title": title,
            "start_date": start_date,
            "end_date": end_date,
            "description": description,
            "url": url,
            "image": image_path
        }

        _projects.insert_one(project_data)
        return jsonify({"message": "Project added successfully"}), 201
    return jsonify({"error": "Unauthorized"}), 403


# Load Skills
@_api.route('/api/skills', methods=['GET'])
def get_skills():
    skills = list(_skills.find({}))
    for skill in skills:
        skill["_id"] = str(skill["_id"])  # Convert ObjectId to string for JSON serialization
    return jsonify(skills), 200

# Load Education
@_api.route('/api/education', methods=['GET'])
def get_education():
    education = list(_education.find({}))
    for edu in education:
        edu["_id"] = str(edu["_id"])
    return jsonify(education), 200

# Load Experience
@_api.route('/api/experience', methods=['GET'])
def get_experience():
    experience = list(_experience.find({}))
    for exp in experience:
        exp["_id"] = str(exp["_id"])
    return jsonify(experience), 200

# Load Projects
@_api.route('/api/projects', methods=['GET'])
def get_projects():
    projects = list(_projects.find({}))
    for project in projects:
        project["_id"] = str(project["_id"])
    return jsonify(projects), 200




# Update a specific skill
@_api.route('/api/skills/<id>', methods=['PUT'])
def update_skill(id):
    if 'logged_in' in session:
        data = request.json
        _skills.update_one({"data._id": ObjectId(id)}, {"$set": {"data.$": data}})
        return jsonify({"message": "Skill updated successfully"}), 200
    return jsonify({"error": "Unauthorized"}), 403

# Delete a specific skill@_api.route('/api/skills/<id>', methods=['DELETE'])@_api.route('/api/skills/<id>', methods=['DELETE'])
@_api.route('/api/skills/<id>', methods=['DELETE'])
def delete_skill(id):
    if 'logged_in' in session:
        try:
            object_id = ObjectId(id)  # Convert id to ObjectId
            result = _skills.delete_one({"_id": object_id})  # Delete the entire document
            if result.deleted_count > 0:
                return jsonify({"message": "Skill deleted successfully"}), 200
            else:
                return jsonify({"error": "Skill not found"}), 404
        except InvalidId:
            return jsonify({"error": "Invalid ID format"}), 400
    return jsonify({"error": "Unauthorized"}), 403


# Update Education
@_api.route('/api/education/<id>', methods=['PUT'])
def update_education(id):
    if 'logged_in' in session:
        data = request.json
        try:
            object_id = ObjectId(id)
            _education.update_one({"_id": object_id}, {"$set": data})
            return jsonify({"message": "Education updated successfully"}), 200
        except InvalidId:
            return jsonify({"error": "Invalid ID format"}), 400
    return jsonify({"error": "Unauthorized"}), 403

# Delete Education
@_api.route('/api/education/<id>', methods=['DELETE'])
def delete_education(id):
    if 'logged_in' in session:
        try:
            object_id = ObjectId(id)
            result = _education.delete_one({"_id": object_id})
            if result.deleted_count > 0:
                return jsonify({"message": "Education deleted successfully"}), 200
            else:
                return jsonify({"error": "Education not found"}), 404
        except InvalidId:
            return jsonify({"error": "Invalid ID format"}), 400
    return jsonify({"error": "Unauthorized"}), 403

# Update Experience
@_api.route('/api/experience/<id>', methods=['PUT'])
def update_experience(id):
    if 'logged_in' in session:
        data = request.json
        try:
            object_id = ObjectId(id)
            _experience.update_one({"_id": object_id}, {"$set": data})
            return jsonify({"message": "Experience updated successfully"}), 200
        except InvalidId:
            return jsonify({"error": "Invalid ID format"}), 400
    return jsonify({"error": "Unauthorized"}), 403

# Delete Experience
@_api.route('/api/experience/<id>', methods=['DELETE'])
def delete_experience(id):
    if 'logged_in' in session:
        try:
            object_id = ObjectId(id)
            result = _experience.delete_one({"_id": object_id})
            if result.deleted_count > 0:
                return jsonify({"message": "Experience deleted successfully"}), 200
            else:
                return jsonify({"error": "Experience not found"}), 404
        except InvalidId:
            return jsonify({"error": "Invalid ID format"}), 400
    return jsonify({"error": "Unauthorized"}), 403

# Update Project
@_api.route('/api/projects/<id>', methods=['PUT'])
def update_project(id):
    if 'logged_in' in session:
        data = request.json
        try:
            object_id = ObjectId(id)
            _projects.update_one({"_id": object_id}, {"$set": data})
            return jsonify({"message": "Project updated successfully"}), 200
        except InvalidId:
            return jsonify({"error": "Invalid ID format"}), 400
    return jsonify({"error": "Unauthorized"}), 403

# Delete Project
@_api.route('/api/projects/<id>', methods=['DELETE'])
def delete_project(id):
    if 'logged_in' in session:
        try:
            object_id = ObjectId(id)
            result = _projects.delete_one({"_id": object_id})
            if result.deleted_count > 0:
                return jsonify({"message": "Project deleted successfully"}), 200
            else:
                return jsonify({"error": "Project not found"}), 404
        except InvalidId:
            return jsonify({"error": "Invalid ID format"}), 400
    return jsonify({"error": "Unauthorized"}), 403


# Run the Flask application
def main():
    _api.run(debug=True)

if __name__ == '__main__':
    main()
