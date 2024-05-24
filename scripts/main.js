document.addEventListener('DOMContentLoaded', function() {
    const content = document.getElementById('content');
    let currentChallengeIndex = localStorage.getItem('currentChallengeIndex') ? parseInt(localStorage.getItem('currentChallengeIndex')) : 1;
    localStorage.setItem('currentChallengeIndex', currentChallengeIndex);

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
            loadChallenge(currentChallengeIndex);
        }
    }

    window.addEventListener('popstate', handleRouting);

    handleRouting();
});