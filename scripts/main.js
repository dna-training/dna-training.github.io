document.addEventListener('DOMContentLoaded', function() {
    const content = document.getElementById('content');
    let currentChallengeIndex = localStorage.getItem('currentChallengeIndex') ? parseInt(localStorage.getItem('currentChallengeIndex')) : 1;
    localStorage.setItem('currentChallengeIndex', currentChallengeIndex);

    function runTemplateScript(template) {
        const filePath = `/scripts/${template}.js`
        const types = ["image", "noimage"]

        types.forEach(x => {
            const existingScript = document.querySelector(`script[src="/scripts/${x}.js"]`);

            if(existingScript !== null) {
                existingScript.parentNode.removeChild(existingScript)
            };
        })

        if(types.includes(template)) {
            const script = document.createElement('script');
            script.src = `/scripts/${template}.js`;
            document.body.appendChild(script);
        }
        
    }

    function loadTemplate(template) {
        fetch(`templates/${template}.html`)
            .then(response => response.text())
            .then(data => {
                content.innerHTML = data;
                runTemplateScript(template);
            });
    }

    function loadChallenge() {
        currentChallengeIndex = parseInt(localStorage.getItem('currentChallengeIndex'));
        fetch(`challenges/${currentChallengeIndex}/DNA.json`)
            .then(response => response.json())
            .then(data => {
                if (data.image !== false) {
                    loadTemplate('image');
                } else {
                    loadTemplate('noimage');
                }
            })
            .catch(() => {
                localStorage.setItem('currentChallengeIndex', 1);
                content.innerHTML = `<h1>Você completou todos os desafios! Atualize a página para voltar ao desafio #1. Você estava no desafio: ${currentChallengeIndex - 1}</h1>`;
            });
    }

    function handleRouting() {
        const path = window.location.pathname.split('/').filter(segment => segment);
        if (path.length === 0) {
            loadChallenge();
        }
    }

    function setChallenge() {
        const set = prompt("Você gostaria de pular para outro desafio? Se sim, insira o número do desafio abaixo:")
        try {
            const ID = parseInt(set);
            if (1 <= ID) {
                localStorage.setItem('currentChallengeIndex', ID);
                loadChallenge()
            }
        } catch (e) {
            return;
        }
    }

    //window.addEventListener('popstate', handleRouting);
    handleRouting();

    document.addEventListener('wrongAnswer', function() {
        loadTemplate('wrong');
    })

    document.addEventListener('rightAnswer', function() {
        loadTemplate('correct');
    })

    document.addEventListener('loadChallenge', loadChallenge);
    document.addEventListener('setChallenge', setChallenge);
    document.addEventListener('resetChallenge', function() {
        const confirmation = confirm("Tem certeza que quer reiniciar ao primeiro desafio?")
        if (confirmation) {
            localStorage.setItem('currentChallengeIndex', 1);
            loadChallenge()
        }
    });
});