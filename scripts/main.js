document.addEventListener('DOMContentLoaded', function() {
    const content = document.getElementById('content');

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

    function handleRouting() {
        const path = window.location.pathname.split('/').filter(segment => segment);
        if (path.length === 1) {
            const challengeDate = path[0];
            loadChallenge(challengeDate);
        } else if (path.length === 2) {
            const challengeDate = path[0];
            const status = path[1];
            if (status === 'correct' || status === 'wrong') {
                loadTemplate(status);
            } else {
                content.innerHTML = '<h1>404 Not Found</h1>';
            }
        } else {
            content.innerHTML = '<h1>404 Not Found</h1>';
        }
    }

    window.addEventListener('popstate', handleRouting);

    handleRouting();
});