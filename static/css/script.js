// Utility function to make authenticated requests
async function makeRequest(url, method, body = null) {
    const token = localStorage.getItem('token');
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    };
    const response = await fetch(url, options);
    return response.ok ? await response.json() : console.error('Request failed:', response.statusText);
}

// Add project
async function addProject(event) {
    event.preventDefault();
    const project = {
        title: document.getElementById('projectTitle').value,
        image: document.getElementById('projectImage').value,
        description: document.getElementById('projectDescription').value,
        github_link: document.getElementById('projectGithub').value
    };
    const result = await makeRequest('/api/admin/projects', 'POST', project);
    alert(result.message);
}

// Add skill
async function addSkill(event) {
    event.preventDefault();
    const skill = {
        name: document.getElementById('skillName').value,
        proficiency: document.getElementById('skillProficiency').value,
        description: document.getElementById('skillDescription').value
    };
    const result = await makeRequest('/api/admin/skills', 'POST', skill);
    alert(result.message);
}

// Add education
async function addEducation(event) {
    event.preventDefault();
    const education = {
        degree: document.getElementById('educationDegree').value,
        institution: document.getElementById('educationInstitution').value,
        duration: document.getElementById('educationDuration').value
    };
    const result = await makeRequest('/api/admin/education', 'POST', education);
    alert(result.message);
}

// Add experience
async function addExperience(event) {
    event.preventDefault();
    const experience = {
        title: document.getElementById('experienceTitle').value,
        company: document.getElementById('experienceCompany').value,
        duration: document.getElementById('experienceDuration').value,
        description: document.getElementById('experienceDescription').value
    };
    const result = await makeRequest('/api/admin/experience', 'POST', experience);
    alert(result.message);
}
