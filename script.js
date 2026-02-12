function initEditor() {
    const state = getSession();

    if (!state.selectedLanguage) {
        window.location.href = '/language.html';
        return;
    }

    const langMap = {
        python: 'python',
        java: 'java',
        cpp: 'cpp'
    };

    const selectedLang = state.selectedLanguage || 'python';

    // Load Monaco
    require.config({
        paths: {
            vs: 'https://unpkg.com/monaco-editor@0.45.0/min/vs'
        }
    });

    require(['vs/editor/editor.main'], function () {

        window.monacoEditor = monaco.editor.create(
            document.getElementById('editorContainer'),
            {
                value: "// Write or debug your code here\n",
                language: langMap[selectedLang],
                theme: 'vs-dark',
                automaticLayout: true,
                fontSize: 14,
                minimap: { enabled: false }
            }
        );
    });

    // RUN button logic
    const runBtn = document.getElementById('runBtn');
    const outputArea = document.getElementById('answer');

    if (runBtn) {
        runBtn.addEventListener('click', () => {
            if (!window.monacoEditor) return;

            const code = window.monacoEditor.getValue();

            // temporary test output
            outputArea.value =
                "Code captured successfully.\n\nFirst 200 chars:\n" +
                code.substring(0, 200);
        });
    }

    // SUBMIT logic unchanged
    const submitBtn = document.getElementById('submitBtn');

    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {

            if (!confirm("Submit answers and finish event?")) return;

            await postData({
                action: 'update',
                type: 'answer',
                gmail: state.user.gmail,
                problemIndex: 0,
                value: outputArea.value || "No output"
            });

            window.location.href = '/end.html';
        });
    }
}
