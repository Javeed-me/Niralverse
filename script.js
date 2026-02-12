document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyy2LdAaqrMEgd49EzNwh1cTHAtEpHwmQbO8sD9ZYJawx1DbUBZl0hnvhoSlcuCvr7Rig/exec';
    const JUDGE0_API_URL = 'https://judge0-ce.p.sulu.sh'; // Public Judge0 CE instance

    // --- PROBLEM CONFIGURATION ---
    const PROBLEMS_CONFIG = {
        python: [
            {
                title: 'Array Sum Fix',
                desc: 'The function should return the sum of all elements, but it is missing the last element. Fix it.',
                code: 'def get_sum(arr):\n    total = 0\n    for i in range(len(arr) - 1):\n        total += arr[i]\n    return total\n\n# Test call\nprint(get_sum([1, 2, 3, 4, 5]))'
            },
            {
                title: 'Palindrome Check',
                desc: 'This function should return True if a string is a palindrome, but it is currently case-sensitive and ignores spaces.',
                code: 'def is_palindrome(s):\n    return s == s[::-1]\n\n# Test call\nprint(is_palindrome("Race Car"))'
            },
            {
                title: 'Dictionary Average',
                desc: 'Calculate the average score from the dictionary. There is a division by zero risk.',
                code: 'def get_avg(scores):\n    total = sum(scores.values())\n    return total / len(scores)\n\n# Test call\nprint(get_avg({}))'
            }
        ],
        java: [
            {
                title: 'Infinite Average',
                desc: 'Fix the off-by-one error causing an IndexOutOfBoundsException.',
                code: 'public class Main {\n    public static void main(String[] args) {\n        int[] n = {1, 2, 3};\n        System.out.println(avg(n));\n    }\n    public static double avg(int[] n) {\n        int s = 0;\n        for(int i=0; i <= n.length; i++) s += n[i];\n        return (double)s / n.length;\n    }\n}'
            },
            {
                title: 'Null Pointer Guard',
                desc: 'The following code crashes when passed a null string. Add a guard.',
                code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println(getLength(null));\n    }\n    public static int getLength(String s) {\n        return s.length();\n    }\n}'
            },
            {
                title: 'Factorial Error',
                desc: 'Fix the base case in this recursive factorial function.',
                code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println(fact(5));\n    }\n    public static int fact(int n) {\n        return n * fact(n-1);\n    }\n}'
            }
        ],
        cpp: [
            {
                title: 'Vector Bounds',
                desc: 'Fix the boundary condition in the loop.',
                code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\ndouble solve(vector<int> v) {\n    int s = 0;\n    for(int i=0; i <= v.size(); i++) s += v[i];\n    return (double)s/v.size();\n}\n\nint main() {\n    cout << solve({1, 2, 3});\n    return 0;\n}'
            },
            {
                title: 'String Reverse',
                desc: 'This function reverses a string but has a memory access issue.',
                code: '#include <iostream>\n#include <string>\nusing namespace std;\n\nstring reverse(string s) {\n    for(int i=0; i < s.length()/2; i++) {\n        char temp = s[i];\n        s[i] = s[s.length()-i];\n        s[s.length()-i] = temp;\n    }\n    return s;\n}\n\nint main() {\n    cout << reverse("hello");\n    return 0;\n}'
            },
            {
                title: 'Pointer Math',
                desc: 'Identify why the pointer increment is skipping values.',
                code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int arr[] = {10, 20, 30};\n    int* p = arr;\n    cout << *p << " ";\n    p = p + 2;\n    cout << *p;\n    return 0;\n}'
            }
        ]
    };

    // --- SESSION STATE HELPERS ---
    const saveSession = (data) => {
        const session = JSON.parse(sessionStorage.getItem('bh_session') || '{}');
        sessionStorage.setItem('bh_session', JSON.stringify({ ...session, ...data }));
    };

    const getSession = () => JSON.parse(sessionStorage.getItem('bh_session') || '{}');

    // --- NAVIGATION ROUTER ---
    const path = window.location.pathname;

    if (path.includes('signup.html')) {
        initSignup();
    } else if (path.includes('language.html')) {
        initLanguage();
    } else if (path.includes('editor.html')) {
        initEditor();
    }

    // --- API CALLS ---
    async function postData(data) {
        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(data),
                mode: 'no-cors'
            });
            return true;
        } catch (error) {
            console.error('API Error:', error);
            return false;
        }
    }

    // --- PISTON API CONFIGURATION (Multiple Mirrors) ---
    const PISTON_ENDPOINTS = [
        'https://emkc.org/api/v2/piston/execute',
        'https://piston.pujit.org/api/v2/piston/execute'
    ];

    const PISTON_LANG_MAP = {
        python: 'python3',
        java: 'java',
        cpp: 'cpp'
    };

    async function executeCode(source_code, lang_key) {
        let lastError = "";

        // Try each mirror
        for (const endpoint of PISTON_ENDPOINTS) {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        language: PISTON_LANG_MAP[lang_key] || lang_key,
                        version: "*", // Use latest available
                        files: [{ content: source_code }]
                    })
                });

                if (!response.ok) {
                    lastError = `Server Error (${response.status})`;
                    continue;
                }

                const data = await response.json();
                let output = "";

                if (data.compile && data.compile.stderr) {
                    output += "--- COMPILATION ERROR ---\n" + data.compile.stderr;
                }

                if (data.run) {
                    output += (output ? "\n" : "") + data.run.output;
                }

                return output || 'Execution completed with no output.';
            } catch (error) {
                lastError = error.message;
                console.warn(`Piston mirror ${endpoint} failed:`, error);
            }
        }

        // Diagnostic if all fail
        if (window.location.protocol === 'file:') {
            return `Connection Error: ${lastError}.\n\nDIAGNOSTIC: You are running this file via 'file://'. Modern browsers often block API calls for security. Please use a 'Live Server' or host it on a domain like GitHub Pages.`;
        }

        return `Connection Error: ${lastError}. This may be caused by an adblocker or corporate firewall blocking the execution servers.`;
    }

    const LANGUAGE_ID_MAP = { python: 'python', java: 'java', cpp: 'cpp' };

    // --- PAGE INITIALIZERS ---

    function initSignup() {
        const form = document.getElementById('signupForm');
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
                window.location.href = 'language.html';
            } catch (err) {
                alert('Connection error.');
                btn.disabled = false;
                btn.textContent = 'SUBMIT';
            }
        });
    }

    function initLanguage() {
        const tiles = document.querySelectorAll('.lang-tile');
        tiles.forEach(tile => {
            tile.addEventListener('click', async () => {
                const lang = tile.dataset.lang;
                tile.style.opacity = '0.5';
                tile.style.pointerEvents = 'none';

                const state = getSession();
                await postData({
                    action: 'update',
                    type: 'language',
                    gmail: state.user.gmail,
                    value: lang
                });

                saveSession({ selectedLanguage: lang });
                window.location.href = 'editor.html';
            });
        });
    }

    function initEditor() {
        const state = getSession();
        const selectedLang = state.selectedLanguage || 'python';
        const problems = (PROBLEMS_CONFIG[selectedLang] || PROBLEMS_CONFIG.python).slice(0, 3);

        // Initialize session results if not present
        if (!state.results) state.results = Array(problems.length).fill('');
        if (!state.completed) state.completed = Array(problems.length).fill(false);
        if (state.violations === undefined) state.violations = 0;
        saveSession(state);

        let currentProbIdx = 0;
        let editor = null;

        // --- Editor Setup (Load once) ---
        const editorMode = selectedLang === 'python' ? 'python' : (selectedLang === 'java' ? 'text/x-java' : 'text/x-c++src');
        editor = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
            lineNumbers: true,
            theme: 'dracula',
            mode: editorMode,
            viewportMargin: Infinity
        });

        // --- Navigation Logic ---
        const updateProblemList = () => {
            const list = document.getElementById('problemList');
            if (!list) return;
            list.innerHTML = '';
            problems.forEach((prob, idx) => {
                const item = document.createElement('li');
                item.className = `problem-item ${idx === currentProbIdx ? 'active' : ''}`;
                item.innerHTML = `
                    <div>
                        <h4>${prob.title}</h4>
                        <span class="difficulty">Level ${idx + 1}</span>
                    </div>
                    ${state.completed[idx] ? '<span class="status-icon completed">✅</span>' : ''}
                `;
                item.onclick = () => switchProblem(idx);
                list.appendChild(item);
            });
        };

        const loadProblem = (idx) => {
            currentProbIdx = idx;
            const prob = problems[idx];
            document.getElementById('problemTitle').textContent = prob.title;
            document.getElementById('problemDesc').textContent = prob.desc;
            document.getElementById('progressText').textContent = `Question ${idx + 1} of ${problems.length}`;

            // Performance: Load editor only once, switch content
            editor.setValue(prob.code);

            // Question Navigation & Locking
            if (state.completed[idx]) {
                editor.setOption('readOnly', true);
                document.getElementById('answer').value = state.results[idx] || '';
                document.getElementById('runBtn').disabled = true;
                document.getElementById('submitBtn').disabled = true;
                document.getElementById('submitBtn').textContent = 'Completed';
            } else {
                editor.setOption('readOnly', false);
                document.getElementById('answer').value = '';
                document.getElementById('runBtn').disabled = false;
                document.getElementById('submitBtn').disabled = false;
                document.getElementById('submitBtn').textContent = 'Submit Solution';
            }

            updateProblemList();
        };

        const switchProblem = (idx) => {
            if (idx === currentProbIdx) return;
            loadProblem(idx);
        };

        // --- Timer Implementation ---
        let timeLeft = 1800; // 30 Minutes default
        const timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                autoSubmitAll();
                return;
            }
            timeLeft--;
            const h = Math.floor(timeLeft / 3600);
            const m = Math.floor((timeLeft % 3600) / 60);
            const s = timeLeft % 60;
            const timerEl = document.getElementById('timerValue');
            if (timerEl) {
                timerEl.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
            }
        }, 1000);

        // --- Run Logic ---
        document.getElementById('runBtn').addEventListener('click', async () => {
            const btn = document.getElementById('runBtn');
            const outputArea = document.getElementById('answer');
            btn.disabled = true;
            btn.textContent = 'RUNNING...';
            outputArea.value = 'Connecting to execution engine...';

            const source = editor.getValue();
            const langId = LANGUAGE_ID_MAP[selectedLang];

            const result = await executeCode(source, langId);
            outputArea.value = result;

            btn.disabled = false;
            btn.textContent = 'Run';
        });

        // --- Submit Logic ---
        document.getElementById('submitBtn').addEventListener('click', async () => {
            const answer = document.getElementById('answer').value;

            if (!answer || answer.includes('Connecting to execution') || answer === 'Execution completed with no output.') {
                alert('Please run your code first and ensure there is an output before submitting.');
                return;
            }

            // Mark completed locally
            state.completed[currentProbIdx] = true;
            state.results[currentProbIdx] = answer;
            saveSession(state);

            // Navigate to next uncompleted or show final confirmation
            const allDone = state.completed.every(c => c === true);
            if (allDone) {
                if (confirm('Are you sure you want to submit all answers?\nYou cannot modify them later.')) {
                    await autoSubmitAll();
                } else {
                    loadProblem(currentProbIdx); // Refresh UI to lock
                }
            } else {
                // Find next uncompleted
                const nextIdx = state.completed.findIndex(c => c === false);
                loadProblem(nextIdx !== -1 ? nextIdx : currentProbIdx);
            }
        });

        const autoSubmitAll = async () => {
            clearInterval(timerInterval);
            const btn = document.getElementById('submitBtn');
            if (btn) {
                btn.disabled = true;
                btn.textContent = 'SUBMITTING...';
            }

            // Submission Rule: Submit final output OR error message
            for (let i = 0; i < problems.length; i++) {
                if (state.completed[i]) {
                    await postData({
                        action: 'update',
                        type: 'answer',
                        gmail: state.user.gmail,
                        problemIndex: i,
                        value: state.results[i] || 'No output recorded'
                    });
                }
            }

            window.location.href = 'end.html';
        };

        // --- Violation Logic ---
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                state.violations = (state.violations || 0) + 1;
                const violCountEl = document.getElementById('violationCount');
                if (violCountEl) violCountEl.textContent = state.violations;
                saveSession(state);

                if (state.violations > 3) {
                    alert('Violation limit exceeded! Your session is being auto-submitted.');
                    autoSubmitAll();
                } else {
                    showWarning(`Activity monitored. Tab switch detected (${state.violations}/3).`);
                }
            }
        });

        loadProblem(0);
    }

    function showWarning(msg) {
        const modal = document.getElementById('warningModal');
        if (modal) {
            document.getElementById('warningText').textContent = msg;
            modal.style.display = 'flex';
        }
    }

    window.closeModal = () => {
        const modal = document.getElementById('warningModal');
        if (modal) modal.style.display = 'none';
    };
});
