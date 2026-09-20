import { fetchJSONfromURL, sanitiseJSONData } from './js/credly.js';

let appState = {
  personalInfo: { name: '', label: '', email: '', phone: '', summary: '', location: '', url: ''},
  badges: [],
  skills: [],
  work: [],
  education: []
};

const userFetchBtn = document.querySelector('#btn-fetch-credly');
const usernameInput = document.querySelector('#credly-username');
const personalInfoSection = document.querySelector('#personal-info-section');
const badgeSection = document.querySelector("#badges-selector");
const skillsSection = document.querySelector("#skills-selector");

const addWorkBtn = document.querySelector('#btn-add-work');
const workSection = document.querySelector('#work-items-container')

const addEduBtn = document.querySelector('#btn-add-edu');
const eduSection = document.querySelector('#edu-items-container')

const jsonUploadInput = document.querySelector('#json-upload');
const jsonExportBtn = document.querySelector('#btn-export-json');

const printBtn = document.querySelector('#btn-print')


userFetchBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  if (!username) return usernameInput.reportValidity();

  const rawData = await fetchJSONfromURL(username);
  appState.badges = sanitiseJSONData(rawData);

  const allSkills = appState.badges.flatMap(b => b.skills);
  appState.skills = [...new Set(allSkills)].map(skill => ({
    name: skill,
    selected: true
  }));

  renderControls();
  renderPreviewSection("badges");
  renderPreviewSection("skills");
});

addWorkBtn.addEventListener('click', async() => {

  appState.work.push({
  id: Date.now(),
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  description: ''
  });
  renderWorkFormList();
})


addEduBtn.addEventListener('click', (e)=>{
  appState.education.push({
  id: Date.now(),
  institution: '', 
  degree: '',      
  startDate: '',
  endDate: '',
  description: ''
})
 renderEduList();
})

function renderControls() {
  let badgesHtml = `
    <div class="badges-toolbar">
      <label><input type="checkbox" id="toggle-all-badges" checked> Check / Uncheck all</label>
    </div>`;
  for (let [i, bdg] of appState.badges.entries()) {
    badgesHtml += `
      <label class="badge-item">
        <input type="checkbox" class="badge-checkbox" data-index="${i}" ${bdg.selected ? 'checked' : ''}>
        <img src="${bdg.imageUrl}" alt="${bdg.title}">
        <span>${bdg.title}</span>
      </label>`;
  }
  badgeSection.innerHTML = badgesHtml;

  let skillsHtml = `
    <div class="skills-toolbar">
      <label><input type="checkbox" id="toggle-all-skills" checked> Check / Uncheck all</label>
    </div>`;
  for (let [i, skl] of appState.skills.entries()) {
    skillsHtml += `
      <label class="skill-item">
        <input type="checkbox" class="skill-checkbox" data-index="${i}" ${skl.selected ? 'checked' : ''}>
        <span>${skl.name}</span>
      </label>`;
  }
  skillsSection.innerHTML = skillsHtml;
}


badgeSection.addEventListener('change', (e) => {
  if (e.target.id === 'toggle-all-badges') {
    appState.badges.forEach(b => b.selected = e.target.checked);
    badgeSection.querySelectorAll('.badge-checkbox').forEach(cb => cb.checked = e.target.checked);
  } else if (e.target.classList.contains('badge-checkbox')) {
    appState.badges[e.target.dataset.index].selected = e.target.checked;
  }
  renderPreviewSection("badges");
});

skillsSection.addEventListener('change', (e) => {
  if (e.target.id === 'toggle-all-skills') {
    appState.skills.forEach(s => s.selected = e.target.checked);
    skillsSection.querySelectorAll('.skill-checkbox').forEach(cb => cb.checked = e.target.checked);
  } else if (e.target.classList.contains('skill-checkbox')) {
    appState.skills[e.target.dataset.index].selected = e.target.checked;
  }
  renderPreviewSection("skills");
});

personalInfoSection.addEventListener('input', (e) =>
{
 let newId = e.target.id.replace('input-', '');
  appState.personalInfo[newId] = e.target.value;
  renderPreviewSection("personal");
})

function renderPreviewSection(type) {
  if (type === "skills") {
    const container = document.querySelector("#view-skills");
    let html = "";
    for (let skill of appState.skills.filter(s => s.selected)) {
      html += `<span class="skill-tag">${skill.name}</span>`;
    }
    container.innerHTML = html;
  }

  if (type === "badges") {
    const container = document.querySelector("#view-certificates");
    let html = "";
    for (let bdg of appState.badges.filter(b => b.selected)) {
      html += `
        <div class="badge-card">
          <img src="${bdg.imageUrl}" alt="${bdg.title}">
          <span>${bdg.title}</span>
        </div>`;
    }
    container.innerHTML = html;
  }

  if (type === 'personal')
  {
    const nameContainer = document.querySelector('#view-name');
    const labelContainer = document.querySelector('#view-label');
    const contactsContainer = document.querySelector('#view-contacts');
    const summaryContainer = document.querySelector('#view-summary');

    nameContainer.textContent = appState.personalInfo['name']|| "Your Name";
    labelContainer.textContent = appState.personalInfo['label']|| "Job Title";
    summaryContainer.textContent = appState.personalInfo['summary'] || "";

    const contactFields = [appState.personalInfo['location'], appState.personalInfo['email'], appState.personalInfo['phone'], appState.personalInfo['url']];
    const filtertedContactFields = contactFields.filter(val => val && val.trim() !== "");
    let contactHTML = ''
    for(let value of filtertedContactFields)
    {
      contactHTML+=`<span class="contact-item">${value}</span>`
    }
    contactsContainer.innerHTML = contactHTML

    const hasSummary = appState.personalInfo['summary'] && appState.personalInfo['summary'].trim() !== '';
    document.querySelector('#section-summary').style.display = hasSummary ? '' : 'none';
    }

    if (type === 'work')
    {
      const container = document.querySelector("#view-experience");
      let html = "";

      for (let job of appState.work) {
    
        const role = job.role || "Job Title";
        const company = job.company ? ` | ${job.company}` : "";
        const dates = (job.startDate || job.endDate) 
        ? `${job.startDate} – ${job.endDate || "Present"}` 
        : "";

      html += `
        <div class="experience-item">
        <div class="experience-header">
          <span class="experience-title"><strong>${role}</strong>${company}</span>
          <span class="experience-dates">${dates}</span>
        </div>
        <p class="experience-desc">${job.description}</p>
      </div>
    `;
  }

  container.innerHTML = html;

  const section = document.querySelector("#section-experience");
  if (section) {
    section.style.display = appState.work.length > 0 ? "" : "none";
  }
}

 if (type === 'education')
    {
      const container = document.querySelector("#view-edu");
      let html = "";

      for (let school of appState.education) {
    
        const degree = school.degree || "Degree";
        const institution = school.institution ? ` | ${school.institution}` : "";
        const dates = (school.startDate || school.endDate) 
        ? `${school.startDate} – ${school.endDate || "Present"}` 
        : "";

      html += `
        <div class="experience-item">
        <div class="experience-header">
          <span class="experience-title"><strong>${degree}</strong>${institution}</span>
          <span class="experience-dates">${dates}</span>
        </div>
        <p class="experience-desc">${school.description}</p>
      </div>
    `;
  }  

  container.innerHTML = html;

  const section = document.querySelector("#section-edu");
  if (section) {
    section.style.display = appState.education.length > 0 ? "" : "none";
  }
}
  }

function renderWorkFormList() {
  const container = document.querySelector('#work-items-container');
  let html = '';
  for (let item of appState.work) {
    html += `
      <div class="work-card" data-id="${item.id}">
        <input type="text" data-field="company" value="${item.company}" placeholder="Company">
        <input type="text" data-field="role" value="${item.role}" placeholder="Role">
        <input type="text" data-field="startDate" value="${item.startDate}" placeholder="Start Date">
        <input type="text" data-field="endDate" value="${item.endDate}" placeholder="End Date">
        <textarea data-field="description" placeholder="Responsibilities...">${item.description}</textarea>
        <button type="button" data-action="remove">Delete</button>
      </div>
    `;
  }
  container.innerHTML = html;
}

workSection.addEventListener('input', (e) => {
  const card = e.target.closest('.work-card');
  if (!card) return;

  const id = Number(card.dataset.id);
  const field = e.target.dataset.field;

  const workEntry = appState.work.find(item => item.id === id);
  if (workEntry && field) {
    workEntry[field] = e.target.value;
    renderPreviewSection('work');
  }
});

workSection.addEventListener('click', (e) => {
  if (e.target.dataset.action !== 'remove') return;

  const card = e.target.closest('.work-card');
  if (!card) return;

  const id = Number(card.dataset.id);

  appState.work = appState.work.filter(item => item.id !== id);

  renderWorkFormList();
  renderPreviewSection('work');
});

function renderEduList() {
  const container = document.querySelector('#edu-items-container');
  let html = '';
  for (let item of appState.education) {
    html += `
      <div class="edu-card" data-id="${item.id}">
        <input type="text" data-field="institution" value="${item.institution}" placeholder="Institution">
        <input type="text" data-field="degree" value="${item.degree}" placeholder="Degree">
        <input type="text" data-field="startDate" value="${item.startDate}" placeholder="Start Date">
        <input type="text" data-field="endDate" value="${item.endDate}" placeholder="End Date">
        <textarea data-field="description" placeholder="Description...">${item.description}</textarea>
        <button type="button" data-action="remove">Delete</button>
      </div>
    `;
  }
  container.innerHTML = html;
}

eduSection.addEventListener('input', (e) => {
  const card = e.target.closest('.edu-card');
  if (!card) return;

  const id = Number(card.dataset.id);
  const field = e.target.dataset.field;

  const eduEntry = appState.education.find(item => item.id === id);
  if (eduEntry && field) {
    eduEntry[field] = e.target.value;
    renderPreviewSection('education');
  }
});

eduSection.addEventListener('click', (e) => {
  if (e.target.dataset.action !== 'remove') return;

  const card = e.target.closest('.edu-card');
  if (!card) return;

  const id = Number(card.dataset.id);

  appState.education = appState.education.filter(item => item.id !== id);

  renderEduList();
  renderPreviewSection('education');
});

function populatePersonalForm() {
  for (let key of Object.keys(appState.personalInfo)) {
    const input = document.querySelector(`#input-${key}`);
    if (input) {
      input.value = appState.personalInfo[key] || '';
    }
  }
}

jsonUploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);

      appState.personalInfo = { ...appState.personalInfo, ...(data.personalInfo || {}) };
      appState.badges = data.badges || [];
      appState.skills = data.skills || [];
      appState.work = data.work || [];
      appState.education = data.education || [];

      populatePersonalForm();
      renderControls();
      renderWorkFormList();
      renderEduList();

      renderPreviewSection('personal');
      renderPreviewSection('badges');
      renderPreviewSection('skills');
      renderPreviewSection('work');
      renderPreviewSection('education');

      jsonUploadInput.value = '';

    } catch (err) {
      console.error('Błąd importu JSON:', err);
      alert('Niepoprawny plik JSON.');
    }
  };

  reader.readAsText(file);
});

printBtn.addEventListener('click', () => {
  window.print();
});

jsonExportBtn.addEventListener('click', () => {
  const jsonString = JSON.stringify(appState, null, 2);
  
  const blob = new Blob([jsonString], { type: 'application/json' });
  const downloadUrl = URL.createObjectURL(blob);

  const downloadLink = document.createElement('a');
  downloadLink.href = downloadUrl;
  
  const fileName = appState.personalInfo.name 
    ? `${appState.personalInfo.name.toLowerCase().replace(/\s+/g, '-')}-resume.json`
    : 'resume.json';
    
  downloadLink.download = fileName;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(downloadUrl);
});