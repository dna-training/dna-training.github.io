document.addEventListener('DOMContentLoaded', function() {
    const content = document.getElementById('content');
    let challenges = [];
    let currentChallengeIndex = localStorage.getItem('currentChallengeIndex') ? parseInt(localStorage.getItem('currentChallengeIndex')) : 0;

    function loadTemplate(template) {
        fetch(`templates/${template}.html`)
            .then(response => response.text())
            .then(data => {
                content.innerHTML = data;
            });
    }

    function loadChallenge(challengeDate) {
        fetch(`challenges/${challengeDate}/DNA.json`)
            .then(response => response.json())
            .then(data => {
                if (data.image !== false) {
                    loadTemplate('image');
                } else {
                    loadTemplate('noimage');
                }
            })
            .catch(() => {
                content.innerHTML = '<h1>404 Not Found</h1>';
            });
    }

    function updateProgress(status) {
        if (status === 'correct') {
            loadTemplate('correct')
            /*currentChallengeIndex++;
            localStorage.setItem('currentChallengeIndex', currentChallengeIndex);
            if (currentChallengeIndex < challenges.length) {
                loadChallenge(challenges[currentChallengeIndex]);
            } else {
                content.innerHTML = '<h1>All challenges completed!</h1>';
            }*/
        } else {
            loadTemplate('wrong');
        }
    }

    function handleRouting() {
        const path = window.location.pathname.split('/').filter(segment => segment);
        if (path.length === 0) {
            loadChallenge(challenges[currentChallengeIndex]);
        } else if (path.length === 1) {
            const status = path[0];
            if (status === 'correct' || status === 'wrong') {
                updateProgress(status);
            } else {
                content.innerHTML = '<h1>404 Not Found</h1>';
            }
        } else {
            content.innerHTML = '<h1>404 Not Found</h1>';
        }
    }

    function fetchChallenges() {
        fetch('challenges/challenges.json')
            .then(response => response.json())
            .then(data => {
                challenges = data;
                handleRouting();
            })
            .catch(() => {
                content.innerHTML = '<h1>Error loading challenges</h1>';
            });
    }

    window.addEventListener('popstate', handleRouting);

    fetchChallenges();
});