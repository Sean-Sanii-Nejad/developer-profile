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
    const lightboxViewport = lightbox?.querySelector('.image-lightbox-viewport');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const zoomLevelLabel = lightbox?.querySelector('[data-lightbox-zoom-level]');
    const triggers = document.querySelectorAll('.tech-visual-expand');

    if (!lightbox || !lightboxImg || !lightboxViewport || !lightboxCaption || !zoomLevelLabel || !triggers.length) {
        return;
    }

    const MIN_ZOOM = 1;
    const MAX_ZOOM = 3;
    const ZOOM_STEP = 0.25;
    const DEFAULT_ZOOM = 1.5;

    let lastFocusedElement = null;
    let zoomLevel = DEFAULT_ZOOM;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let scrollStartX = 0;
    let scrollStartY = 0;

    function updateZoomDisplay() {
        zoomLevelLabel.textContent = `${Math.round(zoomLevel * 100)}%`;
    }

    function applyZoom() {
        if (!lightboxImg.naturalWidth) return;

        lightboxImg.style.width = `${lightboxImg.naturalWidth * zoomLevel}px`;
        lightboxImg.style.height = 'auto';
        updateZoomDisplay();
    }

    function setZoom(nextZoom) {
        zoomLevel = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));
        applyZoom();
    }

    function resetLightboxState() {
        zoomLevel = DEFAULT_ZOOM;
        lightboxViewport.scrollTop = 0;
        lightboxViewport.scrollLeft = 0;
        lightboxImg.style.width = '';
        lightboxImg.style.height = '';
        updateZoomDisplay();
    }

    function closeLightbox() {
        lightbox.hidden = true;
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');
        lightboxImg.src = '';
        lightboxImg.alt = '';
        resetLightboxState();

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
        resetLightboxState();
        lightboxCaption.textContent = caption || img.alt;
        lightbox.hidden = false;
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');

        lightboxImg.onload = () => {
            setZoom(DEFAULT_ZOOM);
            lightboxViewport.scrollTop = 0;
            lightboxViewport.scrollLeft = 0;
        };

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;

        if (lightboxImg.complete) {
            lightboxImg.onload();
        }

        lightbox.querySelector('.image-lightbox-close')?.focus();
    }

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => openLightbox(trigger));
    });

    lightbox.querySelectorAll('[data-lightbox-close]').forEach(el => {
        el.addEventListener('click', closeLightbox);
    });

    lightbox.querySelector('[data-lightbox-zoom-in]')?.addEventListener('click', () => {
        setZoom(zoomLevel + ZOOM_STEP);
    });

    lightbox.querySelector('[data-lightbox-zoom-out]')?.addEventListener('click', () => {
        setZoom(zoomLevel - ZOOM_STEP);
    });

    lightboxViewport.addEventListener('wheel', event => {
        if (lightbox.hidden) return;

        event.preventDefault();
        setZoom(zoomLevel + (event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP));
    }, { passive: false });

    lightboxViewport.addEventListener('mousedown', event => {
        if (event.button !== 0) return;

        isDragging = true;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        scrollStartX = lightboxViewport.scrollLeft;
        scrollStartY = lightboxViewport.scrollTop;
        lightboxViewport.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', event => {
        if (!isDragging) return;

        const deltaX = event.clientX - dragStartX;
        const deltaY = event.clientY - dragStartY;
        lightboxViewport.scrollLeft = scrollStartX - deltaX;
        lightboxViewport.scrollTop = scrollStartY - deltaY;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        lightboxViewport.classList.remove('is-dragging');
    });

    document.addEventListener('keydown', event => {
        if (lightbox.hidden) return;

        if (event.key === 'Escape') {
            closeLightbox();
        }

        if (event.key === '+' || event.key === '=') {
            setZoom(zoomLevel + ZOOM_STEP);
        }

        if (event.key === '-') {
            setZoom(zoomLevel - ZOOM_STEP);
        }
    });
}

initImageLightbox();
