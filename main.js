function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const toggle = document.querySelector('.menu-toggle');
    const isOpen = navLinks.classList.toggle('active');
    toggle.setAttribute('aria-expanded', isOpen);
}

function loadGitHubProjects() {
    const username = 'Sean-Sanii-Nejad';
    const selectedRepos = [
        'Aura_AbilityGameplaySystem',
        'BoardAITestEnv',
        'AGD_MiniGame'
    ];
    const container = document.getElementById('repos');
    if (!container) return;

    selectedRepos.forEach(repoName => {
        fetch(`https://api.github.com/repos/${username}/${repoName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Repo not found: ${repoName}`);
                }
                return response.json();
            })
            .then(repo => {
                if (!repo.name) return;

                const card = document.createElement('article');
                card.className = 'repo-card';

                card.innerHTML = `
                    <h4><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h4>
                    <p>${repo.description || 'No description available.'}</p>
                    <div class="repo-meta">
                        <span>⭐ ${repo.stargazers_count}</span>
                        <span>🍴 ${repo.forks_count}</span>
                        <span>${repo.language || 'N/A'}</span>
                    </div>
                `;

                container.appendChild(card);
            })
            .catch(error => {
                console.error('Error fetching repo:', repoName, error);
            });
    });
}

document.querySelector('.menu-toggle')?.addEventListener('click', toggleMenu);

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links')?.classList.remove('active');
        document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
    });
});

loadGitHubProjects();

function initTechTabs() {
    const tabs = document.querySelectorAll('.tech-tab');
    const panels = document.querySelectorAll('.tech-panel');
    if (!tabs.length || !panels.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const panelId = tab.dataset.panel;

            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });

            panels.forEach(panel => {
                panel.classList.remove('active');
                panel.hidden = true;
            });

            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            const activePanel = document.getElementById(panelId);
            if (activePanel) {
                activePanel.classList.add('active');
                activePanel.hidden = false;
            }
        });
    });
}

initTechTabs();

function initImageLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = lightbox?.querySelector('.image-lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const triggers = document.querySelectorAll('.tech-visual-expand');

    if (!lightbox || !lightboxImg || !lightboxCaption || !triggers.length) return;

    let lastFocusedElement = null;

    function closeLightbox() {
        lightbox.hidden = true;
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');
        lightboxImg.src = '';
        lightboxImg.alt = '';

        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    }

    function openLightbox(trigger) {
        const img = trigger.querySelector('img');
        const caption = trigger.closest('.tech-visual')?.querySelector('figcaption')?.textContent?.trim();

        if (!img) return;

        lastFocusedElement = trigger;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = caption || img.alt;
        lightbox.hidden = false;
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');
        lightbox.querySelector('.image-lightbox-close')?.focus();
    }

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => openLightbox(trigger));
    });

    lightbox.querySelectorAll('[data-lightbox-close]').forEach(el => {
        el.addEventListener('click', closeLightbox);
    });

    document.addEventListener('keydown', event => {
        if (lightbox.hidden) return;

        if (event.key === 'Escape') {
            closeLightbox();
        }
    });
}

initImageLightbox();
