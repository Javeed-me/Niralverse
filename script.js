const App = (() => {
    /* ==============================
       CONFIG
    ============================== */
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyy2LdAaqrMEgd49EzNwh1cTHAtEpHwmQbO8sD9ZYJawx1DbUBZl0hnvhoSlcuCvr7Rig/exec';

    const PISTON_ENDPOINTS = [
        'https://emkc.org/api/v2/piston/execute',
        'https://piston.pujit.org/api/v2/piston/execute'
    ];

    const PISTON_LANG_MAP = {
        python: { language: 'python3', version: '3.10.0' },
        java: { language: 'java', version: '15.0.2' },
        cpp: { language: 'cpp', version: '10.2.0' }
    };

    /* ==============================
       SESSION HELPERS
    ============================== */
    const saveSession = (data) => {
        const session = JSON.parse(sessionStorage.getItem('bh_session') || '{}');
        sessionStorage.setItem('bh_session', JSON.stringify({ ...session, ...data }));
    };

    const getSession = () =>
        JSON.parse(sessionStorage.getItem('bh_session') || '{}');

    /* ==============================
       PROBLEMS CONFIG
    ============================== */
    const PROBLEMS = {
        python: [
            {
                title: "Roman to Integer",
                desc: "Convert Roman numeral string to an integer.",
                code: `class Solution:\n    def romanToInt(self, s: str) -> int:\n        roman = {'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}\n        total = 0\n        for i in range(len(s)):\n            if i+1 < len(s) and roman[s[i]] > roman[s[i+1]]:\n                total -= roman[s[i]]\n            else:\n                total += roman[s[i]]\n        return total`
            },
            {
                title: "Combination Sum",
                desc: "Return a list of combinations that sum up to the target.",
                code: `class Solution:\n    def combinationSum(self, candidates, target):\n        result = []\n        def backtrack(start,path,rem):\n            if rem==0:\n                result.append(list(path))\n                return\n            if rem<0:\n                return\n            for i in range(start,len(candidates)):\n                path.append(candidates[i])\n                backtrack(i+1,path,rem-candidates[i])\n                path.pop()\n        backtrack(0,[],target)\n        return result`
            },
            {
                title: "Median of Two Arrays",
                desc: "Find the median of two sorted arrays.",
                code: `class Solution:\n    def findMedianSortedArrays(self, nums1, nums2):\n        nums = sorted(nums1 + nums2)\n        n = len(nums)\n        if n % 2:\n            return nums[n//2]\n        return (nums[n//2-1] + nums[n//2]) / 2`
            }
        ],
        java: [
            {
                title: "Roman to Integer",
                desc: "Convert Roman numeral string to an integer.",
                code: `class Solution {\n    public int romanToInt(String s){\n        java.util.Map<Character,Integer> m = new java.util.HashMap<>();\n        m.put('I',1); m.put('V',5); m.put('X',10);\n        m.put('L',50); m.put('C',100); m.put('D',500); m.put('M',1000);\n        int total = 0;\n        for(int i=0; i<s.length(); i++){\n            if(i+1<s.length() && m.get(s.charAt(i)) < m.get(s.charAt(i+1)))\n                total -= m.get(s.charAt(i));\n            else total += m.get(s.charAt(i));\n        }\n        return total;\n    }\n}`
            },
            {
                title: "Combination Sum",
                desc: "Return combinations that sum up to target.",
                code: `class Solution{\n    public java.util.List<java.util.List<Integer>> combinationSum(int[] a, int t){\n        java.util.List<java.util.List<Integer>> res = new java.util.ArrayList<>();\n        backtrack(0, t, a, new java.util.ArrayList<>(), res);\n        return res;\n    }\n    void backtrack(int s, int rem, int[] a, java.util.List<Integer> p, java.util.List<java.util.List<Integer>> res){\n        if(rem == 0){ res.add(new java.util.ArrayList<>(p)); return; }\n        if(rem < 0) return;\n        for(int i=s; i<a.length; i++){\n            p.add(a[i]);\n            backtrack(i+1, rem-a[i], a, p, res);\n            p.remove(p.size()-1);\n        }\n    }\n}`
            },
            {
                title: "Median of Two Arrays",
                desc: "Find the median of two sorted arrays.",
                code: `class Median{\n    public double findMedianSortedArrays(int[] A, int[] B){\n        int[] nums = new int[A.length + B.length];\n        System.arraycopy(A, 0, nums, 0, A.length);\n        System.arraycopy(B, 0, nums, A.length, B.length);\n        java.util.Arrays.sort(nums);\n        int n = nums.length;\n        if(n % 2 == 1) return nums[n/2];\n        return (nums[n/2-1] + nums[n/2]) / 2.0;\n    }\n}`
            }
        ],
        cpp: [
            {
                title: "Roman to Integer",
                desc: "Convert Roman numeral string to an integer.",
                code: `class Solution{\npublic:\n    int romanToInt(string s){\n        unordered_map<char,int> m = {{'I',1},{'V',5},{'X',10},{'L',50},{'C',100},{'D',500},{'M',1000}};\n        int total = 0;\n        for(int i=0; i<s.size(); i++){\n            if(i+1 < s.size() && m[s[i]] < m[s[i+1]])\n                total -= m[s[i]];\n            else total += m[s[i]];\n        }\n        return total;\n    }\n};`
            },
            {
                title: "Combination Sum",
                desc: "Return combinations that sum up to target.",
                code: `class Solution{\npublic:\n    vector<vector<int>> combinationSum(vector<int>& c, int t){\n        vector<vector<int>> res;\n        vector<int> p;\n        backtrack(0, t, c, p, res);\n        return res;\n    }\n    void backtrack(int s, int rem, vector<int>& c, vector<int>& p, vector<vector<int>>& res){\n        if(rem == 0){ res.push_back(p); return; }\n        if(rem < 0) return;\n        for(int i=s; i<c.size(); i++){\n            p.push_back(c[i]);\n            backtrack(i+1, rem-c[i], c, p, res);\n            p.pop_back();\n        }\n    }\n};`
            },
            {
                title: "Median of Two Arrays",
                desc: "Find the median of two sorted arrays.",
                code: `class Median{\npublic:\n    double findMedianSortedArrays(vector<int>& A, vector<int>& B){\n        A.insert(A.end(), B.begin(), B.end());\n        sort(A.begin(), A.end());\n        int n = A.size();\n        if(n % 2) return A[n/2];\n        return (A[n/2-1] + A[n/2]) / 2.0;\n    }\n};`
            }
        ]
    };

    /* ==============================
       API HELPERS
    ============================== */
    async function postData(data) {
        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(data),
                mode: 'no-cors'
            });
            return true;
        } catch (e) {
            console.error("Critical API Error:", e);
            throw e;
        }
    }

    async function executeCode(source_code, lang_key) {
        for (const endpoint of PISTON_ENDPOINTS) {
            try {
                const config = PISTON_LANG_MAP[lang_key] || { language: lang_key, version: '*' };
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        language: config.language,
                        version: config.version,
                        files: [{ content: source_code }]
                    })
                });
                if (!response.ok) continue;
                const data = await response.json();
                let output = "";
                if (data.compile && data.compile.stderr) output += "--- COMPILATION ERROR ---\n" + data.compile.stderr;
                if (data.run) output += (output ? "\n" : "") + data.run.output;
                return output || 'Execution completed with no output.';
            } catch (error) {
                console.warn(`Mirror ${endpoint} failed:`, error);
            }
        }
        return "Connection Error: Failed to reach execution servers. Check internet.";
    }

    /* ==============================
       PAGES
    ============================== */
    function initSignup() {
        const form = document.getElementById('signupForm');
        const btn = document.getElementById('submitBtn');
        const status = document.getElementById('statusMsg');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = Object.fromEntries(new FormData(form).entries());

            if (Object.values(user).some(val => !val.trim())) {
                status.innerText = "All fields are required.";
                status.style.color = "#ff4d4d";
                return;
            }

            const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
            if (!gmailRegex.test(user.gmail)) {
                status.innerText = "Please use a valid @gmail.com address.";
                status.style.color = "#ff4d4d";
                return;
            }

            try {
                btn.disabled = true;
                btn.innerText = "SUBMITTING...";
                status.innerText = "Registering...";
                status.style.color = "#00ff66";

                // Clear any old session to enforce fresh 60-min timer
                sessionStorage.clear();

                saveSession({
                    user,
                    violations: 0,
                    timeLeft: 3600, // 60 minutes
                    completed: [false, false, false],
                    results: ['', '', ''],
                    currentIdx: 0,
                    finished: false
                });

                await postData({ action: 'signup', ...user });
                window.location.href = "language.html";
            } catch (err) {
                status.innerText = "Submission failed.";
                status.style.color = "#ff4d4d";
                btn.disabled = false;
                btn.innerText = "SUBMIT";
            }
        });
    }

    function initLanguage() {
        document.querySelectorAll('.lang-tile').forEach(tile => {
            tile.onclick = async () => {
                const lang = tile.dataset.lang;
                const state = getSession();
                saveSession({ selectedLanguage: lang });

                if (state.user && state.user.gmail) {
                    try {
                        await postData({
                            action: 'update',
                            type: 'language',
                            gmail: state.user.gmail,
                            value: lang.toUpperCase()
                        });
                    } catch (e) { }
                }
                window.location.href = "editor.html";
            };
        });
    }

    function initEnd() {
        saveSession({ finished: true });
    }

    function initSecurity() {
        const state = getSession();
        let violations = state.violations || 0;

        // Default to 60 minutes if not found in state
        let timeLeft = (state.timeLeft !== undefined && state.timeLeft !== null) ? state.timeLeft : 3600;

        const timerEl = document.getElementById('timerValue');
        const violationEl = document.getElementById('violationCount');
        if (violationEl) violationEl.innerText = violations;

        const formatTime = (s) => {
            const h = Math.floor(s / 3600);
            const m = Math.floor((s % 3600) / 60);
            const sec = s % 60;
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
        };

        if (timerEl) timerEl.innerText = formatTime(timeLeft);

        async function autoSubmitAll(reason = "") {
            const session = getSession();
            if (session.results && session.completed) {
                for (let i = 0; i < session.results.length; i++) {
                    if (session.completed[i]) {
                        await postData({
                            action: 'update',
                            type: 'answer',
                            gmail: session.user.gmail,
                            problemIndex: i,
                            value: session.results[i]
                        });
                    }
                }
            }
            alert(`Session ended: ${reason}`);
            window.location.href = "end.html";
        }

        const timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                autoSubmitAll("Time's Up!");
                return;
            }
            timeLeft--;
            if (timerEl) timerEl.innerText = formatTime(timeLeft);
            if (timeLeft % 5 === 0) saveSession({ timeLeft });
        }, 1000);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                violations++;
                saveSession({ violations });
                if (violationEl) violationEl.innerText = violations;

                if (violations > 2) {
                    autoSubmitAll("Violation Limit Reached.");
                } else {
                    const modal = document.getElementById('warningModal');
                    if (modal) {
                        document.getElementById('warningText').innerText = `Tab switching is forbidden! (${violations}/3)`;
                        modal.style.display = 'flex';
                    }
                }
            }
        });

        window.closeModal = () => {
            const modal = document.getElementById('warningModal');
            if (modal) modal.style.display = 'none';
        };
    }

    function initEditor() {
        const state = getSession();
        const lang = state.selectedLanguage || "python";
        const problems = PROBLEMS[lang] || PROBLEMS["python"];
        let currentIdx = state.currentIdx || 0;

        if (!state.completed) state.completed = [false, false, false];
        if (!state.results) state.results = ['', '', ''];
        saveSession(state);

        // Modal confirmation helper
        function confirmSubmission() {
            return new Promise((resolve) => {
                const modal = document.getElementById('confirmModal');
                if (!modal) return resolve(false);
                modal.style.display = 'flex';
                window.closeConfirmModal = (result) => {
                    modal.style.display = 'none';
                    resolve(result);
                };
            });
        }

        require.config({
            paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }
        });

        require(['vs/editor/editor.main'], function (monaco) {
            window.editor = monaco.editor.create(document.getElementById('editorContainer'), {
                value: problems[currentIdx].code,
                language: lang === 'cpp' ? 'cpp' : (lang === 'java' ? 'java' : 'python'),
                theme: "vs-dark",
                automaticLayout: true,
                fontSize: 14,
                minimap: { enabled: false }
            });

            const updateProblemList = () => {
                const list = document.getElementById('problemList');
                if (!list) return;
                list.innerHTML = '';
                problems.forEach((prob, idx) => {
                    const item = document.createElement('li');
                    item.className = `problem-item ${idx === currentIdx ? 'active' : ''}`;
                    item.innerHTML = `<span>${prob.title}</span>${state.completed[idx] ? '<span class="status-icon">✅</span>' : ''}`;
                    item.onclick = () => loadProblem(idx);
                    list.appendChild(item);
                });
            };

            const loadProblem = (idx) => {
                currentIdx = idx;
                saveSession({ currentIdx });
                const prob = problems[idx];
                document.getElementById("problemTitle").innerText = prob.title;
                document.getElementById("problemDesc").innerText = prob.desc;
                window.editor.setValue(prob.code);

                const submitBtn = document.getElementById("submitBtn");
                const output = document.getElementById("answer");

                if (state.completed[idx]) {
                    window.editor.updateOptions({ readOnly: true });
                    output.value = state.results[idx];
                    submitBtn.disabled = true;
                    submitBtn.innerText = "COMPLETED";
                } else {
                    window.editor.updateOptions({ readOnly: false });
                    output.value = "";
                    submitBtn.disabled = false;
                    submitBtn.innerText = "Submit Solution";
                }
                updateProblemList();
            };

            loadProblem(currentIdx);

            document.getElementById("runBtn").onclick = async () => {
                const btn = document.getElementById("runBtn");
                const out = document.getElementById("answer");
                btn.disabled = true;
                btn.innerText = "RUNNING...";
                out.value = "Executing...";
                out.value = await executeCode(window.editor.getValue(), lang);
                btn.disabled = false;
                btn.innerText = "Run";
            };

            document.getElementById("submitBtn").onclick = async () => {
                const out = document.getElementById("answer").value;
                if (!out || out === "Executing...") return alert("Run first.");
                const confirmed = await confirmSubmission();
                if (!confirmed) return;

                state.completed[currentIdx] = true;
                state.results[currentIdx] = out;
                saveSession(state);

                if (state.user && state.user.gmail) {
                    await postData({
                        action: 'update',
                        type: 'answer',
                        gmail: state.user.gmail,
                        problemIndex: currentIdx,
                        value: out
                    });
                }

                if (state.completed.every(c => c)) {
                    window.location.href = "end.html";
                } else {
                    const next = state.completed.findIndex(c => !c);
                    loadProblem(next !== -1 ? next : currentIdx);
                }
            };
        });
    }

    /* ==============================
       RUNNER
    ============================== */
    const start = () => {
        const state = getSession();
        const isEndPage = !!document.querySelector('.end-page');
        const isSignupPage = !!document.getElementById('signupForm');

        if (state.finished && !isEndPage && !isSignupPage) {
            window.location.href = "signup.html";
            return;
        }

        if (isSignupPage) initSignup();
        if (document.querySelector('.lang-tile')) initLanguage();
        if (document.getElementById('editorContainer')) {
            initEditor();
            initSecurity();
        }
        if (isEndPage) initEnd();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
