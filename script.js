const App = (() => {
    /* ==============================
       CONFIG
    ============================== */
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwe-iNZjmDrSyjNsS1TOKmCj8PMY6O7_OA_JSuIMygJwWWFeHOs2PT8N_2lR41lZJod9g/exec';
    const JUDGE0_URL = 'https://ce.judge0.com/submissions/?base64_encoded=false&wait=true';

    const JUDGE0_LANG_MAP = {
        python: 71,
        cpp: 54,
        java: 62
    };

    let isTerminating = false; // Shared flag to bypass navigation warnings

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
                code: `class Solution:\n    def romanToInt(self, s: str) -> int:\n        roman = {'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}\n        total = 0\n        for i in range(len(s)):\n            if i+1 < len(s) and roman[s[i]] > roman[s[i+1]]:\n                total -= roman[s[i]]\n            else:\n                total += roman[s[i]]\n        return total\n\nprint(Solution().romanToInt(\"IV\"))\n`
            },
            {
                title: "Combination Sum",
                desc: "Return a list of combinations that sum up to the target.",
                code: `class Solution:\n    def combinationSum(self, nums, target):\n        result = []\n\n        def dfs(start, path, rem):\n            if rem == 0:\n                result.append(path[:])\n                return\n            if rem < 0:\n                return\n\n            for i in range(start, len(nums)):\n                path.append(nums[i])\n                dfs(i + 1, path, rem - nums[i])\n                path.pop()\n\n        dfs(0, [], target)\n        return len(result)\n\nprint(Solution().combinationSum([2,3,6,7], 7))\n`
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
                code: `import java.util.*;\n\nclass Main {\n    static int romanToInt(String s){\n        Map<Character,Integer> r=new HashMap<>();\n        r.put('I',1); r.put('V',5); r.put('X',10);\n        r.put('L',50); r.put('C',100); r.put('D',500); r.put('M',1000);\n        int total=0;\n        for(int i=0;i<s.length();i++){\n            if(i+1<s.length() && r.get(s.charAt(i)) > r.get(s.charAt(i+1)))\n                total-=r.get(s.charAt(i));\n            else total+=r.get(s.charAt(i));\n        }\n        return total;\n    }\n    public static void main(String[] args){\n        System.out.println(romanToInt(\"IV\"));\n    }\n}`
            },
            {
                title: "Combination Sum",
                desc: "Return combinations that sum up to target.",
                code: `import java.util.*;\n\nclass Main {\n    static int dfs(int[] nums,int start,int rem){\n        if(rem==0) return 1;\n        if(rem<0) return 0;\n        int count=0;\n        for(int i=start;i<nums.length;i++)\n            count+=dfs(nums,i+1,rem-nums[i]);\n        return count;\n    }\n    public static void main(String[] args){\n        int[] arr={2,3,6,7};\n        System.out.println(dfs(arr,0,7));\n    }\n}`
            },
            {
                title: "Median of Two Arrays",
                desc: "Find the median of two sorted arrays.",
                code: `class Main {\n    static int search(int[] arr,int target){\n        int l=0,r=arr.length-1;\n        while(l<=r){\n            int mid=(l+r)/2;\n            if(arr[mid]==target) return mid;\n            else if(arr[mid]<target) r=mid-1;\n            else l=mid+1;\n        }\n        return -1;\n    }\n    public static void main(String[] args){\n        int[] arr={1,3,5,7,9};\n        System.out.println(search(arr,7));\n    }\n}`
            }
        ],
        cpp: [
            {
                title: "Roman to Integer",
                desc: "Convert Roman numeral string to an integer.",
                code: `#include <bits/stdc++.h>\nusing namespace std;\n\nint romanToInt(string s){\n    unordered_map<char,int> r={{'I',1},{'V',5},{'X',10},{'L',50},{'C',100},{'D',500},{'M',1000}};\n    int total=0;\n    for(int i=0;i<s.size();i++){\n        if(i+1<s.size() && r[s[i]] > r[s[i+1]]) total-=r[s[i]];\n        else total+=r[s[i]];\n    }\n    return total;\n}\n\nint main(){\n    cout<<romanToInt(\"IV\");\n}\n`
            },
            {
                title: "Combination Sum",
                desc: "Return combinations that sum up to target.",
                code: `#include <bits/stdc++.h>\nusing namespace std;\n\nint combinationSum(vector<int>& nums,int target){\n    int count=0;\n    function<void(int,int)> dfs=[&](int start,int rem){\n        if(rem==0){count++;return;}\n        if(rem<0)return;\n        for(int i=start;i<nums.size();i++) dfs(i+1,rem-nums[i]);\n    };\n    dfs(0,target);\n    return count;\n}\n\nint main(){\n    vector<int> v={2,3,6,7};\n    cout<<combinationSum(v,7);\n}\n`
            },
            {
                title: "Median of Two Arrays",
                desc: "Find the median of two sorted arrays.",
                code: `#include <bits/stdc++.h>\nusing namespace std;\n\nint search(vector<int>& arr,int target){\n    int l=0,r=arr.size()-1;\n    while(l<=r){\n        int mid=(l+r)/2;\n        if(arr[mid]==target) return mid;\n        else if(arr[mid]<target) r=mid-1;\n        else l=mid+1;\n    }\n    return -1;\n}\n\nint main(){\n    vector<int>a={1,3,5,7,9};\n    cout<<search(a,7);\n}\n
`
            }
        ]
    };

    /* ==============================
       API HELPERS
    ============================== */
    /* ==============================
       UI HELPERS
    ============================== */
    function showModal(msg, title = "NOTICE", callback, showClose = true, btnText = "Continue") {
        const modal = document.getElementById('warningModal');
        const header = document.getElementById('warningHeader');
        const text = document.getElementById('warningText');
        const closeBtn = document.getElementById('closeModalBtn');

        if (!modal || !text) {
            alert(`${title}\n\n${msg}`);
            if (callback) callback();
            return;
        }

        if (header) header.innerText = title;
        text.innerText = msg;
        modal.style.display = 'flex';

        if (closeBtn) {
            closeBtn.style.display = showClose ? 'block' : 'none';
            closeBtn.innerText = btnText;
        }

        window.onModalConfirm = () => {
            modal.style.display = 'none';
            if (callback) callback();
        };
    }

    function showLoading(show) {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = show ? 'flex' : 'none';
    }

    async function postData(data) {
        try {
            // Normalize Gmail if present
            if (data.gmail) data.gmail = data.gmail.toLowerCase().trim();

            const resp = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(data),
                mode: 'cors'
            });
            const result = await resp.json();
            return result;
        } catch (e) {
            console.error("Critical API Error:", e);
            return { result: 'error', message: 'Connection Error: ' + e.toString() };
        }
    }

    async function executeCode(source_code, lang_key) {
        try {
            const lang_id = JUDGE0_LANG_MAP[lang_key] || 71;
            const response = await fetch(JUDGE0_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    source_code: source_code,
                    language_id: lang_id,
                    stdin: ""
                })
            });

            if (!response.ok) {
                throw new Error(`Judge0 API Error: ${response.status}`);
            }

            const data = await response.json();

            // Interpret Judge0 Status
            // Status ID 3 is "Accepted"
            let output = "";
            if (data.stdout) output += data.stdout;
            if (data.compile_output) output += (output ? "\n" : "") + "--- COMPILE ERROR ---\n" + data.compile_output;
            if (data.stderr) output += (output ? "\n" : "") + "--- RUNTIME ERROR ---\n" + data.stderr;

            if (!output) {
                if (data.status && data.status.id !== 3) {
                    output = `Execution Status: ${data.status.description}`;
                } else {
                    output = "Execution completed with no output.";
                }
            }

            return output;
        } catch (error) {
            console.error("Judge0 Execution Failed:", error);
            return "Connection Error: Failed to reach Judge0 servers. Check internet.";
        }
    }

    /* ==============================
       PAGES
    ============================== */
    function initSignup() {
        const form = document.getElementById('signupForm');
        const btn = document.getElementById('submitBtn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = Object.fromEntries(new FormData(form).entries());

            if (Object.values(user).some(val => !val.trim())) {
                showModal("All fields are required.", "SIGNUP ERROR");
                return;
            }

            const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
            if (!gmailRegex.test(user.gmail)) {
                showModal("Please use a valid @gmail.com address.", "SIGNUP ERROR");
                return;
            }

            try {
                btn.disabled = true;
                btn.innerText = "SUBMITTING...";
                showLoading(true);

                // Clear any old session
                sessionStorage.clear();

                const response = await postData({ action: 'signup', ...user });

                if (response.result === 'success') {
                    saveSession({
                        user,
                        violations: 0,
                        timeLeft: 3600,
                        completed: [false, false, false],
                        results: ['', '', ''],
                        currentIdx: 0,
                        finished: false
                    });
                    window.location.href = "language.html"; // First jump uses href
                } else {
                    showModal(response.message || "Registration failed.", "SIGNUP ERROR");
                    btn.disabled = false;
                    btn.innerText = "SUBMIT";
                }
            } catch (err) {
                showModal("Submission failed. Check connection.", "SIGNUP ERROR");
                btn.disabled = false;
                btn.innerText = "SUBMIT";
            } finally {
                showLoading(false);
            }
        });
    }

    function initLanguage() {
        // Preload Monaco Editor to save time later
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs/loader.min.js';
        document.head.appendChild(script);

        document.querySelectorAll('.lang-tile').forEach(tile => {
            tile.onclick = async () => {
                const lang = tile.dataset.lang;
                const state = getSession();
                saveSession({ selectedLanguage: lang });

                showLoading(true);
                if (state.user && state.user.gmail) {
                    await postData({
                        action: 'sync',
                        gmail: state.user.gmail,
                        language: lang
                    });
                }
                window.location.replace("instructions.html"); // Use replace to hide language.html
            };
        });
    }

    function initInstructions() {
        const check = document.getElementById('agreeCheck');
        const btn = document.getElementById('startContestBtn');

        if (check && btn) {
            check.addEventListener('change', () => {
                btn.disabled = !check.checked;
            });

            btn.onclick = () => {
                window.location.replace("editor.html"); // Use replace to hide instructions.html
            };
        }
    }

    function initEnd() {
        saveSession({ finished: true });
        // Lock navigation on end page too
        history.pushState(null, null, location.href);
        window.onpopstate = () => {
            history.pushState(null, null, location.href);
        };
    }

    let sharedTimeLeft = 3600; // Shared state for timer
    const TOTAL_TIME = 3600;

    const formatTime = (s) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    const getElapsedTimeString = (s) => {
        const elapsed = TOTAL_TIME - s;
        const m = Math.floor(elapsed / 60);
        const sec = elapsed % 60;
        return `${m}.${String(sec).padStart(2, '0')}`;
    };

    function initSecurity() {
        const state = getSession();
        let violations = state.violations || 0;
        sharedTimeLeft = (state.timeLeft !== undefined && state.timeLeft !== null) ? state.timeLeft : TOTAL_TIME;

        const timerEl = document.getElementById('timerValue');
        const violationEl = document.getElementById('violationCount');
        if (violationEl) violationEl.innerText = violations;

        if (timerEl) timerEl.innerText = formatTime(sharedTimeLeft);

        // Navigation Locking
        // Ensure we have an initial state to push against
        if (!history.state || history.state.bh_locked !== true) {
            history.pushState({ bh_locked: true }, null, location.href);
        }

        window.onpopstate = () => {
            history.pushState({ bh_locked: true }, null, location.href);
            showModal("Back navigation is disabled during the contest.", "NAVIGATION LOCKED");
        };

        // Prevent refresh/leaving via standard browser warning
        window.onbeforeunload = (e) => {
            if (!isTerminating && !getSession().finished) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        async function autoSubmitAll(reason = "") {
            if (isTerminating) return;
            isTerminating = true;

            showLoading(true);
            const session = getSession();
            if (session.user && session.user.gmail) {
                // Atomic sync of ALL current data
                await postData({
                    action: 'sync',
                    gmail: session.user.gmail,
                    language: session.selectedLanguage,
                    results: session.results,
                    timeTaken: getElapsedTimeString(sharedTimeLeft)
                });
            }
            showLoading(false);

            showModal(`Violations breached. Auto-submitting. Reason: ${reason}`, "SESSION TERMINATED", () => {
                isTerminating = true;
                saveSession({ finished: true });
                window.location.replace("end.html"); // Use replace
            }, true, "OK");
        }

        const timerInterval = setInterval(() => {
            if (sharedTimeLeft <= 0) {
                clearInterval(timerInterval);
                autoSubmitAll("Time's Up!");
                return;
            }
            sharedTimeLeft--;
            if (timerEl) timerEl.innerText = formatTime(sharedTimeLeft);
            if (sharedTimeLeft % 5 === 0) saveSession({ timeLeft: sharedTimeLeft });
        }, 1000);

        let lastViolationTime = 0;
        const VIOLATION_COOLDOWN = 1000; // 1 second ignore window

        const handleViolation = (msg) => {
            const now = Date.now();
            if (now - lastViolationTime < VIOLATION_COOLDOWN) return; // Prevent double-counting ghost signals

            if (!isTerminating) {
                lastViolationTime = now;
                violations++;
                saveSession({ violations });
                if (violationEl) violationEl.innerText = violations;

                if (violations > 3) {
                    autoSubmitAll("Violation Limit Reached.");
                } else {
                    showModal(`${msg} (${violations}/3)`, "⚠️ MALPRACTICE WARNING");
                }
            }
        };

        const startMonitoring = () => {
            // Window/App Switching Detection
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) handleViolation("Tab/Window switching detected!");
            });

            window.addEventListener('blur', () => {
                handleViolation("Application focus lost!");
            });
        };

        // Start Monitoring immediately if in editor
        if (document.getElementById('editorContainer')) {
            startMonitoring();
        }

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
                out.value = ""; // Clear output box before execution
                out.placeholder = "Executing...";
                out.value = await executeCode(window.editor.getValue(), lang);
                out.placeholder = "Run result will appear here...";
                btn.disabled = false;
                btn.innerText = "Run";
            };

            document.getElementById("submitBtn").onclick = async () => {
                const out = document.getElementById("answer").value;
                if (!out || out === "Executing..." || out.includes("Connection Error") || out.includes("ERROR")) {
                    return showModal("Please run your code successfully before submitting.", "SUBMISSION ERROR");
                }

                const confirmed = await confirmSubmission();
                if (!confirmed) return;

                showLoading(true);
                state.completed[currentIdx] = true;
                state.results[currentIdx] = out;
                saveSession(state);

                if (state.user && state.user.gmail) {
                    // Atomic sync of ALL current data
                    const res = await postData({
                        action: 'sync',
                        gmail: state.user.gmail,
                        language: state.selectedLanguage,
                        results: state.results,
                        timeTaken: getElapsedTimeString(sharedTimeLeft)
                    });
                    if (!res || res.result !== 'success') {
                        showLoading(false);
                        const msg = res && res.message ? res.message : "Unknown error";
                        return showModal(`Storage failed. Reason: ${msg}`, "BACKEND ERROR");
                    }
                }
                showLoading(false);

                if (state.completed.every(c => c)) {
                    isTerminating = true;
                    saveSession({ finished: true });
                    window.location.replace("end.html"); // Use replace
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

        // Hide loader by default on every page load
        showLoading(false);

        // 1. Navigation Locking (Global)
        if (!isSignupPage) {
            // Push state twice to ensure we have a history entry to go back to that we control
            if (!history.state || history.state.bh_locked !== true) {
                history.pushState({ bh_locked: true }, null, location.href);
            }
            window.onpopstate = (event) => {
                history.pushState({ bh_locked: true }, null, location.href);
                if (!isEndPage) {
                    showModal("Back navigation is disabled during the contest.", "NAVIGATION LOCKED");
                }
            };
        }

        // 2. STRICT REDIRECTION: If finished, only allow end page or signup
        if (state.finished && !isEndPage && !isSignupPage) {
            window.location.replace("end.html");
            return;
        }

        // 3. Initial signup setup
        if (isSignupPage) {
            sessionStorage.clear();
            initSignup();
            return;
        }

        // 4. Regular Page Inits
        if (document.querySelector('.lang-tile')) initLanguage();
        if (document.querySelector('.instructions-page')) initInstructions();
        if (document.getElementById('editorContainer')) {
            initEditor();
            initSecurity();
        }
        if (isEndPage) initEnd();
    };

    // BFCache Protection: Force reload/re-check if restored from cache
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            window.location.reload();
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
