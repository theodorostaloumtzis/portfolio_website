// Helper function to make requests
async function makeRequest(url, method, body = null, isFormData = false) {
    const options = {
        method,
        headers: !isFormData ? { 'Content-Type': 'application/json' } : undefined,
        body: isFormData ? body : JSON.stringify(body),
    };
    const response = await fetch(url, options);
    return response.ok ? response.json() : null;
}

// Skill Functions
async function loadSkills() {
    const response = await fetch('/api/skills');
    if (response.ok) {
        const skills = await response.json();
        const skillList = document.getElementById('skillList');
        skillList.innerHTML = '';
        skills.forEach(skill => {
            skillList.innerHTML += `
                <div class="item" id="skill-${skill._id}">
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

async function editSkill(id) {
    const skill = await fetch(`/api/skills/${id}`).then(res => res.json());
    const skillElement = document.getElementById(`skill-${id}`);
    skillElement.innerHTML = `
        <form id="editSkillForm">
            <label for="editSkillTitle">Skill Title:</label>
            <input type="text" id="editSkillTitle" value="${skill.title}" required>
            <label for="editSkillDescription">Description:</label>
            <input type="text" id="editSkillDescription" value="${skill.description}" required>
            <button type="button" onclick="saveSkillChanges('${id}')">Save</button>
            <button type="button" onclick="loadSkills()">Cancel</button>
        </form>
    `;
}

async function saveSkillChanges(id) {
    const updatedSkill = {
        title: document.getElementById('editSkillTitle').value,
        description: document.getElementById('editSkillDescription').value
    };
    const result = await makeRequest(`/api/skills/${id}`, 'PUT', updatedSkill);
    if (result) {
        loadSkills();
    } else {
        alert('Error saving changes.');
    }
}

async function deleteSkill(id) {
    const confirmDelete = confirm("Are you sure you want to delete this skill?");
    if (confirmDelete) {
        const result = await makeRequest(`/api/skills/${id}`, 'DELETE');
        if (result) {
            alert("Skill deleted successfully");
            loadSkills();
        }
    }
}

// Education Functions
async function loadEducation() {
    const response = await fetch('/api/education');
    if (response.ok) {
        const educationData = await response.json();
        const educationList = document.getElementById('educationList');
        educationList.innerHTML = '';
        educationData.forEach(edu => {
            educationList.innerHTML += `
                <div class="item" id="education-${edu._id}">
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

async function addEducation() {
    const education = {
        title: document.getElementById('educationTitle').value,
        institution: document.getElementById('educationInstitution').value,
        start_date: document.getElementById('educationStartDate').value,
        end_date: document.getElementById('educationEndDate').value,
        description: document.getElementById('educationDescription').value,
        grade: document.getElementById('educationGrade').value,
        thesis_title: document.getElementById('educationThesis').value,
    };
    
    console.log(education); // Debug: Log data to verify values
    
    const result = await makeRequest('/api/education', 'POST', education);
    if (result) {
        alert(result.message);
        loadEducation();
    }
}


async function editEducation(id) {
    const education = await fetch(`/api/education/${id}`).then(res => res.json());
    const educationElement = document.getElementById(`education-${id}`);
    educationElement.innerHTML = `
        <form id="editEducationForm">
            <label for="editEducationTitle">Degree:</label>
            <input type="text" id="editEducationTitle" value="${education.title}" required>
            <label for="editInstitution">Institution:</label>
            <input type="text" id="editInstitution" value="${education.institution}" required>
            <label for="editStartDate">Start Date:</label>
            <input type="text" id="editStartDate" value="${education.start_date}" required>
            <label for="editEndDate">End Date:</label>
            <input type="text" id="editEndDate" value="${education.end_date}">
            <label for="editDescription">Description:</label>
            <input type="text" id="editDescription" value="${education.description}">
            <label for="editGrade">Grade:</label>
            <input type="text" id="editGrade" value="${education.grade}">
            <label for="editThesis">Thesis:</label>
            <input type="text" id="editThesis" value="${education.thesis_title}">
            <button type="button" onclick="saveEducationChanges('${id}')">Save</button>
            <button type="button" onclick="loadEducation()">Cancel</button>
        </form>
    `;
}

async function saveEducationChanges(id) {
    const updatedEducation = {
        title: document.getElementById('editEducationTitle').value,
        institution: document.getElementById('editInstitution').value,
        start_date: document.getElementById('editStartDate').value,
        end_date: document.getElementById('editEndDate').value,
        description: document.getElementById('editDescription').value,
        grade: document.getElementById('editGrade').value,
        thesis_title: document.getElementById('editThesis').value
    };
    const result = await makeRequest(`/api/education/${id}`, 'PUT', updatedEducation);
    if (result) {
        loadEducation();
    } else {
        alert('Error saving changes.');
    }
}

async function deleteEducation(id) {
    const confirmDelete = confirm("Are you sure you want to delete this education?");
    if (confirmDelete) {
        const result = await makeRequest(`/api/education/${id}`, 'DELETE');
        if (result) {
            alert("Education deleted successfully");
            loadEducation();
        }
    }
}

// Experience Functions
async function loadExperience() {
    const response = await fetch('/api/experience');
    if (response.ok) {
        const experienceData = await response.json();
        const experienceList = document.getElementById('experienceList');
        experienceList.innerHTML = '';
        experienceData.forEach(exp => {
            experienceList.innerHTML += `
                <div class="item" id="experience-${exp._id}">
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

async function addExperience() {
    const experience = {
        position: document.getElementById('experiencePosition').value,
        company: document.getElementById('experienceCompany').value,
        start_date: document.getElementById('experienceStartDate').value,
        end_date: document.getElementById('experienceEndDate').value,
        description: document.getElementById('experienceDescription').value,
    };
    
    console.log(experience); // Debug: Log data to verify values
    
    const result = await makeRequest('/api/experience', 'POST', experience);
    if (result) {
        alert(result.message);
        loadExperience();
    }
}


async function editExperience(id) {
    const experience = await fetch(`/api/experience/${id}`).then(res => res.json());
    const experienceElement = document.getElementById(`experience-${id}`);
    experienceElement.innerHTML = `
        <form id="editExperienceForm">
            <label for="editPosition">Position:</label>
            <input type="text" id="editPosition" value="${experience.position}" required>
            <label for="editCompany">Company:</label>
            <input type="text" id="editCompany" value="${experience.company}" required>
            <label for="editStartDate">Start Date:</label>
            <input type="text" id="editStartDate" value="${experience.start_date}" required>
            <label for="editEndDate">End Date:</label>
            <input type="text" id="editEndDate" value="${experience.end_date}">
            <label for="editDescription">Description:</label>
            <input type="text" id="editDescription" value="${experience.description}" required>
            <button type="button" onclick="saveExperienceChanges('${id}')">Save</button>
            <button type="button" onclick="loadExperience()">Cancel</button>
        </form>
    `;
}

async function saveExperienceChanges(id) {
    const updatedExperience = {
        position: document.getElementById('editPosition').value,
        company: document.getElementById('editCompany').value,
        start_date: document.getElementById('editStartDate').value,
        end_date: document.getElementById('editEndDate').value,
        description: document.getElementById('editDescription').value
    };
    const result = await makeRequest(`/api/experience/${id}`, 'PUT', updatedExperience);
    if (result) {
        loadExperience();
    } else {
        alert('Error saving changes.');
    }
}

async function deleteExperience(id) {
    const confirmDelete = confirm("Are you sure you want to delete this experience?");
    if (confirmDelete) {
        const result = await makeRequest(`/api/experience/${id}`, 'DELETE');
        if (result) {
            alert("Experience deleted successfully");
            loadExperience();
        }
    }
}

// Load all projects
async function loadProjects() {
    const response = await fetch('/api/projects');
    if (response.ok) {
        const projects = await response.json();
        const projectList = document.getElementById('projectList');
        projectList.innerHTML = '';
        projects.forEach(project => {
            projectList.innerHTML += `
                <div class="item" id="project-${project._id}">
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

// Add a new project
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

// Edit project function with image handling
async function editProject(id) {
    const project = await fetch(`/api/projects/${id}`).then(res => res.json());
    const projectElement = document.getElementById(`project-${id}`);
    projectElement.innerHTML = `
        <form id="editProjectForm">
            <label for="editProjectTitle">Project Title:</label>
            <input type="text" id="editProjectTitle" value="${project.title}" required>
            <label for="editStartDate">Start Date:</label>
            <input type="text" id="editStartDate" value="${project.start_date}" required>
            <label for="editEndDate">End Date:</label>
            <input type="text" id="editEndDate" value="${project.end_date}">
            <label for="editDescription">Description:</label>
            <input type="text" id="editDescription" value="${project.description}" required>
            <label for="editUrl">URL:</label>
            <input type="text" id="editUrl" value="${project.url}">
            <label for="editImage">Change Image (optional):</label>
            <input type="file" id="editImage">
            <button type="button" onclick="saveProjectChanges('${id}')">Save</button>
            <button type="button" onclick="loadProjects()">Cancel</button>
        </form>
    `;
}

// Save project changes, including optional image update
async function saveProjectChanges(id) {
    const formData = new FormData();
    formData.append('title', document.getElementById('editProjectTitle').value);
    formData.append('start_date', document.getElementById('editStartDate').value);
    formData.append('end_date', document.getElementById('editEndDate').value);
    formData.append('description', document.getElementById('editDescription').value);
    formData.append('url', document.getElementById('editUrl').value);

    const imageFile = document.getElementById('editImage').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        body: formData
    });
    if (response.ok) {
        alert("Project updated successfully");
        loadProjects();
    } else {
        alert("Error updating project");
    }
}

async function deleteProject(id) {
    const confirmDelete = confirm("Are you sure you want to delete this project?");
    if (confirmDelete) {
        const result = await makeRequest(`/api/projects/${id}`, 'DELETE');
        if (result) {
            alert("Project deleted successfully");
            loadProjects();
        }
    }
}

// Initialize by loading all data
window.onload = () => {
    loadSkills();
    loadEducation();
    loadExperience();
    loadProjects();
};
