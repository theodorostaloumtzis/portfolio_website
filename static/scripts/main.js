// Tab switching functionality
function opentab(tabname) {
    const tablinks = document.getElementsByClassName("tab-links");
    const tabcontents = document.getElementsByClassName("tab-contents");

    for (const tablink of tablinks) {
        tablink.classList.remove("active-link");
    }
    for (const tabcontent of tabcontents) {
        tabcontent.classList.remove("active-tab");
    }

    event.currentTarget.classList.add("active-link");
    document.getElementById(tabname).classList.add("active-tab");
}

// Fetch and display skills
async function loadSkills() {
    const response = await fetch('/api/skills');
    const skills = await response.json();
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = '';

    skills.forEach(skill => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${skill.title}</span><br>${skill.description}`;
        skillsList.appendChild(li);
    });
}

// Fetch and display experience
async function loadExperience() {
    const response = await fetch('/api/experience');
    const experience = await response.json();
    const experienceList = document.getElementById('experienceList');
    experienceList.innerHTML = '';

    experience.forEach(exp => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${exp.position}</span><br>${exp.company}`;
        experienceList.appendChild(li);
    });
}

// Fetch and display education
async function loadEducation() {
    const response = await fetch('/api/education');
    const education = await response.json();
    const educationList = document.getElementById('educationList');
    educationList.innerHTML = '';

    education.forEach(edu => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${edu.title}</span><br>${edu.institution}`;
        educationList.appendChild(li);
    });
}

// Fetch and display projects
async function loadProjects() {
    const response = await fetch('/api/projects');
    const projects = await response.json();
    const projectsList = document.querySelector('.projects-list');
    projectsList.innerHTML = '';

    projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project');
        projectDiv.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <div class="layer">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <a href="${project.url}" target="_blank">GitHub</a>
            </div>`;
        projectsList.appendChild(projectDiv);
    });
}

// Load all data on page load
window.onload = () => {
    loadSkills();
    loadExperience();
    loadEducation();
    loadProjects();
};
