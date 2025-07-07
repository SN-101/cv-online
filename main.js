class CVManager {
    constructor() {
        this.currentLang = 'en';
        this.cvData = {};
        this.init();
    }

    async init() {
        await this.loadLanguageData();
        this.setupLanguageButtons();
        this.renderCV();
    }

    async loadLanguageData() {
        try {
            const languages = ['en', 'fr', 'ar'];
            const promises = languages.map(lang =>
                fetch(`lang/${lang}.json`).then(res => res.json())
            );

            const results = await Promise.all(promises);
            languages.forEach((lang, index) => {
                this.cvData[lang] = results[index];
            });
        } catch (error) {
            console.error('Error loading language data:', error);
        }
    }

    setupLanguageButtons() {
        const langButtons = document.querySelectorAll('[data-lang]');
        langButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.switchLanguage(lang);
            });
        });
    }

    switchLanguage(lang) {
        this.currentLang = lang;

        // Update button states
        document.querySelectorAll('[data-lang]').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-lang="${lang}"]`).classList.add('active');

        // Update document direction and language
        const html = document.documentElement;
        html.setAttribute('lang', lang);
        html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

        this.renderCV();
    }

    renderCV() {
        const data = this.cvData[this.currentLang];
        if (!data) return;

        this.renderBasicInfo(data);
        this.renderSkills(data);
        this.renderLanguages(data);
        this.renderExperience(data);
        this.renderEducation(data);
        this.renderProjects(data);
        this.renderCertifications(data);
    }

    renderBasicInfo(data) {
        // Update all elements with data-key attributes
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.dataset.key;
            if (data[key]) {
                element.textContent = data[key];
            }
        });
    }

    renderSkills(data) {
        const technicalSkills = document.getElementById('technical-skills');
        const softSkills = document.getElementById('soft-skills');

        technicalSkills.innerHTML = '';
        softSkills.innerHTML = '';

        data.skills_data.technical.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.textContent = skill;
            technicalSkills.appendChild(skillTag);
        });

        data.skills_data.soft.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.textContent = skill;
            softSkills.appendChild(skillTag);
        });
    }

    renderLanguages(data) {
        const languagesList = document.getElementById('languages-list');
        languagesList.innerHTML = '';

        data.languages_data.forEach(lang => {
            const langItem = document.createElement('div');
            langItem.className = 'language-item';
            langItem.innerHTML = `
                <span class="language-name">${lang.name}</span>
                <span class="language-level">${lang.level}</span>
            `;
            languagesList.appendChild(langItem);
        });
    }

    renderExperience(data) {
        const experienceList = document.getElementById('experience-list');
        experienceList.innerHTML = '';

        data.experience_data.forEach(exp => {
            const expItem = document.createElement('div');
            expItem.className = 'experience-item';

            const achievementsList = exp.achievements.map(achievement =>
                `<li>${achievement}</li>`
            ).join('');

            expItem.innerHTML = `
                <div class="item-header">
                    <div>
                        <div class="item-title">${exp.position}</div>
                        <div class="item-company">${exp.company}</div>
                        <div class="item-location">${exp.location}</div>
                    </div>
                    <div class="item-period">${exp.period}</div>
                </div>
                <div class="item-description">${exp.description}</div>
                <ul class="achievements-list">
                    ${achievementsList}
                </ul>
            `;
            experienceList.appendChild(expItem);
        });
    }

    renderEducation(data) {
        const educationList = document.getElementById('education-list');
        educationList.innerHTML = '';

        data.education_data.forEach(edu => {
            const eduItem = document.createElement('div');
            eduItem.className = 'education-item';

            const honorsList = edu.honors ? edu.honors.map(honor =>
                `<li>${honor}</li>`
            ).join('') : '';

            eduItem.innerHTML = `
                <div class="item-header">
                    <div>
                        <div class="item-title">${edu.degree}</div>
                        <div class="item-school">${edu.school}</div>
                        <div class="item-location">${edu.location}</div>
                    </div>
                    <div class="item-period">${edu.period}</div>
                </div>`;
            educationList.appendChild(eduItem);
        });
    }

    renderProjects(data) {
        const projectsList = document.getElementById('projects-list');
        projectsList.innerHTML = '';

        data.projects_data.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';

            const techTags = project.technologies.map(tech =>
                `<span class="tech-tag">${tech}</span>`
            ).join('');

            projectItem.innerHTML = `
                <div class="item-header">
                    <div>
                        <div class="item-title">${project.name}</div>
                        ${project.urlgit ? `<div class="item-company">
                            <i class="fas fa-external-link-alt"></i> ${project.urlgit}
                        </div>` : ''}
                        ${project.urlsite ? `<div class="item-company">
                            <i class="fas fa-external-link-alt"></i> ${project.urlsite}
                        </div>` : ''}
                    </div>
                </div>
                <div class="item-description">${project.description}</div>
                <div class="technologies">
                    ${techTags}
                </div>
            `;
            projectsList.appendChild(projectItem);
        });
    }

    renderCertifications(data) {
        const certificationsList = document.getElementById('certifications-list');
        certificationsList.innerHTML = '';

        data.certifications_data.forEach(cert => {
            const certItem = document.createElement('div');
            certItem.className = 'certification-item';

            certItem.innerHTML = `
                <div class="item-header">
                    <div>
                        <div class="item-title">${cert.name}</div>
                        <div class="item-company">${cert.issuer}</div>
                        ${cert.credential ? `<div class="item-location">
                            <i class="fas fa-certificate"></i> ${cert.credential}
                        </div>` : ''}
                    </div>
                    <div class="item-period">${cert.date}</div>
                </div>
            `;
            certificationsList.appendChild(certItem);
        });
    }
}

// Initialize the CV Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CVManager();
});