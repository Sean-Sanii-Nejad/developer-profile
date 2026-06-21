function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const toggle = document.querySelector('.menu-toggle');
    const isOpen = navLinks.classList.toggle('active');
    toggle.setAttribute('aria-expanded', isOpen);
}

function loadGitHubProjects() {
    const username = 'Sean-Sanii-Nejad';
    const selectedRepos = [
        'BoardAITestEnv',
        'OpenGL-rendering',
        'AGD_MiniGame',
        'Genetic-Algorithm',
        'Crytography-Assignment',
        'hackerrank-3-months-preparation-kit'
    ];
    const container = document.getElementById('repos');
    if (!container) return;

    selectedRepos.forEach(repoName => {
        fetch(`https://api.github.com/repos/${username}/${repoName}`)
            .then(response => response.json())
            .then(repo => {
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
