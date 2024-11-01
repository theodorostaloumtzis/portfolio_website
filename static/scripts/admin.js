// Helper function to make requests
async function makeRequest(url, method, body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);
    if (response.ok) {
        return await response.json();
    } else {
        console.error('Request failed:', response.statusText);
        return null;
    }
}

// Add Skill
async function addSkill() {
    const skill = {
        title: document.getElementById('skillTitle').value,
        description: document.getElementById('skillDescription').value
    };
    const result = await makeRequest('/api/skills', 'POST', skill);
    if (result) {
        alert(result.message);
        loadSkills();
    }
}

// Add Education
async function addEducation() {
    const education = {
        title: document.getElementById('educationTitle').value,
        institution: document.getElementById('institution').value,
        start_date: document.getElementById('startDate').value,
        end_date: document.getElementById('endDate').value,
        description: document.getElementById('description').value,
        grade: document.getElementById('grade').value,
        thesis_title: document.getElementById('thesis').value,
    };
    const result = await makeRequest('/api/education', 'POST', education);
    if (result) {
        alert(result.message);
        loadEducation();
    }
}

// Add Experience
async function addExperience() {
    const experience = {
        position: document.getElementById('position').value,
        company: document.getElementById('company').value,
        start_date: document.getElementById('startDate').value,
        end_date: document.getElementById('endDate').value,
        description: document.getElementById('description').value,
    };
    const result = await makeRequest('/api/experience', 'POST', experience);
    if (result) {
        alert(result.message);
        loadExperience();
    }
}

// Add Project
async function addProject() {
    const title = document.getElementById('projectTitle').value;
    const start_date = document.getElementById('projectStartDate').value;
    const end_date = document.getElementById('projectEndDate').value;
    const description = document.getElementById('projectDescription').value;
    const url = document.getElementById('projectUrl').value;
    const imageFile = document.getElementById('projectImage').files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('start_date', start_date);
    formData.append('end_date', end_date);
    formData.append('description', description);
    formData.append('url', url);
    if (imageFile) {
        formData.append('image', imageFile);
    }

    const response = await fetch('/api/projects', {
        method: 'POST',
        body: formData
    });
    if (response.ok) {
        alert('Project added successfully');
        loadProjects();
    } else {
        console.error('Failed to add project');
    }
}

// Load Skills
async function loadSkills() {
    const response = await fetch('/api/skills');
    if (response.ok) {
        const skills = await response.json();
        const skillList = document.getElementById('skillList');
        skillList.innerHTML = '';
        skills.forEach(skill => {
            skillList.innerHTML += `
                <div class="item">
                    <span>${skill.title}</span>
                    <div>
                        <button class="edit-button" onclick="editSkill('${skill._id}')">Edit</button>
                        <button class="delete-button" onclick="deleteSkill('${skill._id}')">Delete</button>
                    </div>
                </div>`;
        });
    } else {
        console.error("Failed to load skills");
    }
}

// Load Education
async function loadEducation() {
    const response = await fetch('/api/education');
    if (response.ok) {
        const educationData = await response.json();
        const educationList = document.getElementById('educationList');
        educationList.innerHTML = '';
        educationData.forEach(edu => {
            educationList.innerHTML += `
                <div class="item">
                    <span>${edu.title} at ${edu.institution}</span>
                    <div>
                        <button class="edit-button" onclick="editEducation('${edu._id}')">Edit</button>
                        <button class="delete-button" onclick="deleteEducation('${edu._id}')">Delete</button>
                    </div>
                </div>`;
        });
    } else {
        console.error("Failed to load education");
    }
}

// Load Experience
async function loadExperience() {
    const response = await fetch('/api/experience');
    if (response.ok) {
        const experienceData = await response.json();
        const experienceList = document.getElementById('experienceList');
        experienceList.innerHTML = '';
        experienceData.forEach(exp => {
            experienceList.innerHTML += `
                <div class="item">
                    <span>${exp.position} at ${exp.company}</span>
                    <div>
                        <button class="edit-button" onclick="editExperience('${exp._id}')">Edit</button>
                        <button class="delete-button" onclick="deleteExperience('${exp._id}')">Delete</button>
                    </div>
                </div>`;
        });
    } else {
        console.error("Failed to load experience");
    }
}

// Load Projects
async function loadProjects() {
    const response = await fetch('/api/projects');
    if (response.ok) {
        const projects = await response.json();
        const projectList = document.getElementById('projectList');
        projectList.innerHTML = '';
        projects.forEach(project => {
            projectList.innerHTML += `
                <div class="item">
                    <span>${project.title}</span>
                    <div>
                        <button class="edit-button" onclick="editProject('${project._id}')">Edit</button>
                        <button class="delete-button" onclick="deleteProject('${project._id}')">Delete</button>
                    </div>
                </div>`;
        });
    } else {
        console.error("Failed to load projects");
    }
}

// Initialize by loading all data
window.onload = () => {
    loadSkills();
    loadEducation();
    loadExperience();
    loadProjects();
};
