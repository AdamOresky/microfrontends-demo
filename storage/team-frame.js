window.initTeamFrame = function(color) {
    window.addEventListener('teamStateChanged', (e) => {
        const show = e.detail.show;
        let frame = document.getElementById('team-frame');
        if (show) {
            if (!frame) {
                frame = document.createElement('div');
                frame.id = 'team-frame';
                frame.style.position = 'fixed';
                frame.style.top = '4px'; frame.style.left = '4px'; frame.style.right = '4px'; frame.style.bottom = '4px';
                frame.style.border = `4px dashed ${color}`;
                frame.style.pointerEvents = 'none';
                frame.style.zIndex = '9998';
                document.body.appendChild(frame);
            }
            frame.style.display = 'block';
        } else {
            if (frame) frame.style.display = 'none';
        }
    });
};

window.setupElementTeamFrame = function(element, color) {
    element.style.display = 'block';
    
    const updateFrame = function(e) {
        if (e.detail.show) {
            element.style.outline = '4px dashed ' + color;
            element.style.outlineOffset = '4px';
        } else {
            element.style.outline = '';
        }
    };
    window.addEventListener('teamStateChanged', updateFrame);
    
    // Check initial state
    const match = document.cookie.split("; ").find(function(row) { return row.startsWith("showTeams="); });
    if (match && match.split("=")[1] === "true") {
        element.style.outline = '4px dashed ' + color;
        element.style.outlineOffset = '-4px';
    }
};