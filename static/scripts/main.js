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

// Load and display skills in a bullet-point list format
async function loadSkills() {
    const response = await fetch('/api/skills');
    const skillsData = await response.json();
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = ''; // Clear any existing content

    skillsData.forEach(skill => {
        const li = document.createElement('li');
        li.className = 'skill-item';
        li.innerHTML = `
            <span class="skill-title">${skill.title}</span>
            <p class="skill-description">${skill.description}</p>
        `;
        skillsList.appendChild(li);
    });
}


// Load and display experience in the specified format
async function loadExperience() {
    const response = await fetch('/api/experience');
    const experienceData = await response.json();
    const experienceList = document.getElementById('experienceList');
    experienceList.innerHTML = '';

    experienceData.forEach(exp => {
        const div = document.createElement('div');
        div.className = 'experience-item';
        div.innerHTML = `
            <h3>${exp.company} | <span class="experience-position">${exp.position}</span></h3>
            <div class="experience-details">
                <span class="experience-date">
                    <svg class="icon" height="16" width="16" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"></path></svg>
                    ${exp.start_date} - ${exp.end_date || 'Present'}
                </span>
            </div>
            <ul class="experience-description">
                ${exp.description.split('\n').map(line => `<li>${line}</li>`).join('')}
            </ul>
        `;
        experienceList.appendChild(div);
    });
}

// Load and display education in the specified format
async function loadEducation() {
    const response = await fetch('/api/education');
    const educationData = await response.json();
    const educationList = document.getElementById('educationList');
    educationList.innerHTML = '';

    educationData.forEach(edu => {
        const div = document.createElement('div');
        div.className = 'education-item';
        div.innerHTML = `
            <h3>${edu.institution} | <span class="education-degree">${edu.title}</span></h3>
            <div class="education-details">
                <span class="education-date">
                    <svg class="icon" height="16" width="16" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"></path></svg>
                    ${edu.start_date} - ${edu.end_date || 'Ongoing'}
                </span>

            </div>
            <ul class="education-description">
                <li>${edu.description}</li>
                ${edu.grade ? `<li>Grade: ${edu.grade}</li>` : ''}
                ${edu.thesis_title ? `<li>Thesis: ${edu.thesis_title}</li>` : ''}
            </ul>
        `;
        educationList.appendChild(div);
    });
}

// Fetch and display projects
async function loadProjects() {
    const githubIconUrl = '/static/images/github1.svg'; // Direct path to GitHub icon
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
                <a href="${project.url}" target="_blank" aria-label="Link to ${project.title}">
                    <img src="${githubIconUrl}" alt="GitHub logo" class="github-logo">
                </a>
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
