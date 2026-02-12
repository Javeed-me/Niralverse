document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURATION ---
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyy2LdAaqrMEgd49EzNwh1cTHAtEpHwmQbO8sD9ZYJawx1DbUBZl0hnvhoSlcuCvr7Rig/exec';

    // --- SESSION STATE HELPERS ---
    const saveSession = (data) => {
        const session = JSON.parse(sessionStorage.getItem('bh_session') || '{}');
        sessionStorage.setItem('bh_session', JSON.stringify({ ...session, ...data }));
    };

    const getSession = () => JSON.parse(sessionStorage.getItem('bh_session') || '{}');

    // --- ROUTER FIX ---
    const path = window.location.pathname;

    if (path === '/' || path.includes('signup.html')) {
        initSignup();
    } else if (path.includes('language.html')) {
        initLanguage();
    } else if (path.includes('editor.html')) {
        initEditor();
    }

    async function postData(data) {
        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(data),
                mode: 'no-cors'
            });
            return true;
        } catch {
            return false;
        }
    }

    // =========================
    // SIGNUP PAGE
    // =========================
    function initSignup() {
        const form = document.getElementById('signupForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = document.getElementById('submitBtn');
            btn.disabled = true;
            btn.textContent = 'CONNECTING...';

            const formData = new FormData(form);
            const user = Object.fromEntries(formData.entries());

            try {
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: JSON.stringify({ action: 'signup', ...user }),
                    mode: 'no-cors'
                });

                saveSession({ user, violations: 0, progress: 0 });

                // ✅ FIXED NAVIGATION
                window.location.href = '/language.html';

            } catch {
                alert('Connection error.');
                btn.disabled = false;
                btn.textContent = 'SUBMIT';
            }
        });
    }

    // =========================
    // LANGUAGE PAGE
    // =========================
    function initLanguage() {
        const tiles = document.querySelectorAll('.lang-tile');

        tiles.forEach(tile => {
            tile.addEventListener('click', async () => {
                const lang = tile.dataset.lang;

                const state = getSession();

                await postData({
                    action: 'update',
                    type: 'language',
                    gmail: state.user.gmail,
                    value: lang
                });

                saveSession({ selectedLanguage: lang });

                // ✅ FIXED NAVIGATION
                window.location.href = '/editor.html';
            });
        });
    }

    // =========================
    // EDITOR PAGE
    // =========================
    function initEditor() {
        const state = getSession();

        if (!state.selectedLanguage) {
            window.location.href = '/language.html';
            return;
        }

        const submitBtn = document.getElementById('submitBtn');

        if (submitBtn) {
            submitBtn.addEventListener('click', async () => {

                if (!confirm("Submit answers and finish event?")) return;

                await postData({
                    action: 'update',
                    type: 'answer',
                    gmail: state.user.gmail,
                    problemIndex: 0,
                    value: "Submitted"
                });

                // ✅ FIXED NAVIGATION
                window.location.href = '/end.html';
            });
        }
    }

});
