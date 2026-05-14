window.TeamLabels = (function() {
    function getShowTeams() {
        const match = document.cookie.split("; ").find(row => row.startsWith("showTeams="));
        return match ? match.split("=")[1] === "true" : false;
    }

    function renderLabels(teams, show) {
        if (window !== window.top) {
            return;
        }

        let container = document.getElementById('team-labels-container');
        if (container) {
            container.remove();
        }

        if (!show || !teams || !teams.length) return;

        container = document.createElement('div');
        container.id = 'team-labels-container';
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.right = '10px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';
        container.style.zIndex = '10000';
        container.style.pointerEvents = 'none';

        const uniqueTeams = [];
        const seenNames = new Set();
        for (const t of teams) {
            if (!seenNames.has(t.name)) {
                seenNames.add(t.name);
                uniqueTeams.push(t);
            }
        }

        uniqueTeams.forEach(team => {
            const label = document.createElement('div');
            label.style.backgroundColor = team.color;
            label.style.color = 'white';
            label.style.padding = '5px 10px';
            label.style.fontWeight = 'bold';
            label.style.fontSize = '14px';
            label.style.borderRadius = '5px';
            label.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            label.innerText = team.name;
            container.appendChild(label);
        });

        document.body.appendChild(container);
    }

    function init(teams) {
        let state = getShowTeams();
        renderLabels(teams, state);

        setTimeout(() => {
           window.dispatchEvent(new CustomEvent('teamStateChanged', { detail: { show: state } }));
        }, 0);

        setTimeout(() => {
            const toggle = document.getElementById('show-teams-toggle');
            if (toggle) {
                toggle.checked = state;
                toggle.addEventListener('change', (e) => {
                    const isChecked = e.target.checked;
                    if (window !== window.top) {
                        try {
                            window.top.postMessage({ type: 'TOGGLE_TEAMS', show: isChecked }, '*');
                        } catch (err) {}
                    } else {
                        document.cookie = `showTeams=${isChecked}; Path=/; SameSite=Lax`;
                        renderLabels(teams, isChecked);
                        window.dispatchEvent(new CustomEvent('teamStateChanged', { detail: { show: isChecked } }));
                        document.querySelectorAll('iframe').forEach(iframe => {
                            try { iframe.contentWindow.postMessage({ type: 'TOGGLE_TEAMS', show: isChecked }, '*'); } catch(err) {}
                        });
                    }
                });
            }
        }, 50);

        window.addEventListener('message', (e) => {
            if (e.data && e.data.type === 'TOGGLE_TEAMS') {
                const isChecked = e.data.show;

                if (window === window.top) {
                    document.cookie = `showTeams=${isChecked}; Path=/; SameSite=Lax`;
                    renderLabels(teams, isChecked);
                    window.dispatchEvent(new CustomEvent('teamStateChanged', { detail: { show: isChecked } }));
                    document.querySelectorAll('iframe').forEach(iframe => {
                        try { iframe.contentWindow.postMessage(e.data, '*'); } catch (err) {}
                    });
                } else {
                    const toggle = document.getElementById('show-teams-toggle');
                    if (toggle && toggle.checked !== isChecked) {
                        toggle.checked = isChecked;
                    }
                    window.dispatchEvent(new CustomEvent('teamStateChanged', { detail: { show: isChecked } }));
                }
            }
        });
    }

    return { init };
})();
