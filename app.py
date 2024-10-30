from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from werkzeug.security import check_password_hash

app = Flask(__name__)
CORS(app)
app.config['JWT_SECRET_KEY'] = '5465464164148441iuubggfcfrx'  # Replace with a secure key
jwt = JWTManager(app)

# MongoDB setup
client = MongoClient('mongodb://localhost:27017/')
db = client['portfoliodatabase']
users_collection = db['user']
projects_collection = db['projects']
skills_collection = db['skills']
education_collection = db['education']
experience_collection = db['experience']

# Route to render the home page (index.html)
@app.route('/')
def home():
    return render_template('index.html')

# Route to render login page
@app.route('/login_page', methods=['GET'])
def login_page():
    return render_template('login.html')

# Login route to authenticate users and provide JWT token
@app.route('/api/login', methods=['POST'])  # Changed to avoid conflict with GET /login
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Find user and verify password
    user = users_collection.find_one({"username": username})
    if user and check_password_hash(user['password'], password):
        token = create_access_token(identity={"username": username})
        return jsonify(access_token=token), 200
    return jsonify({"message": "Invalid credentials"}), 401

# Protected dashboard route that requires JWT token
@app.route('/dashboard')
@jwt_required()
def dashboard():
    return render_template('dashboard.html')

# Protected verification route for admin access
@app.route('/api/admin/verify', methods=['GET'])
@jwt_required()
def verify_admin():
    return jsonify({'status': 'admin'}), 200

# CRUD for Projects
@app.route('/api/admin/projects', methods=['POST'])
@jwt_required()
def add_project():
    data = request.json
    project_id = projects_collection.insert_one(data).inserted_id
    return jsonify({'message': 'Project added', 'project_id': str(project_id)}), 201

@app.route("/api/content/projects", methods=["GET"])
def get_projects():
    projects = [project for project in projects_collection.find()]
    for project in projects:
        project["_id"] = str(project["_id"])
    return jsonify(projects), 200

# CRUD for Skills
@app.route('/api/admin/skills', methods=['POST'])
@jwt_required()
def add_skill():
    data = request.json
    skill_id = skills_collection.insert_one(data).inserted_id
    return jsonify({'message': 'Skill added', 'skill_id': str(skill_id)}), 201

@app.route('/api/content/skills', methods=['GET'])
def get_skills():
    skills = list(skills_collection.find())
    for skill in skills:
        skill['_id'] = str(skill['_id'])
    return jsonify(skills), 200

# CRUD for Education
@app.route('/api/admin/education', methods=['POST'])
@jwt_required()
def add_education():
    data = request.json
    education_id = education_collection.insert_one(data).inserted_id
    return jsonify({'message': 'Education added', 'education_id': str(education_id)}), 201

@app.route('/api/content/education', methods=['GET'])
def get_education():
    education = list(education_collection.find())
    for edu in education:
        edu['_id'] = str(edu['_id'])
    return jsonify(education), 200

# CRUD for Experience
@app.route('/api/admin/experience', methods=['POST'])
@jwt_required()
def add_experience():
    data = request.json
    experience_id = experience_collection.insert_one(data).inserted_id
    return jsonify({'message': 'Experience added', 'experience_id': str(experience_id)}), 201

@app.route('/api/content/experience', methods=['GET'])
def get_experience():
    experience = list(experience_collection.find())
    for exp in experience:
        exp['_id'] = str(exp['_id'])
    return jsonify(experience), 200

if __name__ == '__main__':


    app.run(debug=True)
