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
  }