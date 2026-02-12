document.addEventListener('DOMContentLoaded', () => {

    /* ==============================
       CONFIG
    ============================== */
    const SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';

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
       ROUTER (Vercel safe)
    ============================== */
    if (document.getElementById('signupForm')) initSignup();
    if (document.querySelector('.lang-tile')) initLanguage();
    if (document.getElementById('editorContainer')) initEditor();

    /* ==============================
       API POST
    ============================== */
    async function postData(data) {
        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(data),
                mode: 'no-cors'
            });
        } catch (e) {
            console.warn("API failed", e);
        }
    }

    /* ==============================
       SIGNUP PAGE
    ============================== */
    function initSignup() {
        const form = document.getElementById('signupForm');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const user = Object.fromEntries(formData.entries());

            saveSession({
                user,
                violations: 0,
                progress: 0
            });

            window.location.href = "/language.html";
        });
    }

    /* ==============================
       LANGUAGE PAGE
    ============================== */
    function initLanguage() {
        document.querySelectorAll('.lang-tile').forEach(tile => {
            tile.onclick = () => {
                const lang = tile.dataset.lang;
                saveSession({ selectedLanguage: lang });
                window.location.href = "/editor.html";
            };
        });
    }

    /* ==============================
       PROBLEMS CONFIG
    ============================== */
    const PROBLEMS = {
        python: [
            {
                title: "Roman to Integer",
                desc: "Convert Roman numeral to integer.",
                code: `class Solution:
    def romanToInt(self, s: str) -> int:
        roman = {'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}
        total = 0
        for i in range(len(s)):
            if i+1 < len(s) and roman[s[i]] > roman[s[i+1]]:
                total -= roman[s[i]]
            else:
                total += roman[s[i]]
        return total`
            },
            {
                title: "Combination Sum",
                desc: "Return combinations summing to target.",
                code: `class Solution:
    def combinationSum(self, candidates, target):
        result = []
        def backtrack(start,path,rem):
            if rem==0:
                result.append(path)
                return
            if rem<0:
                return
            for i in range(start,len(candidates)):
                path.append(candidates[i])
                backtrack(i+1,path,rem-candidates[i])
                path.pop()
        backtrack(0,[],target)
        return result`
            },
            {
                title: "Median of Two Arrays",
                desc: "Find median of two sorted arrays.",
                code: `class Solution:
    def findMedianSortedArrays(self, nums1, nums2):
        nums = sorted(nums1 + nums2)
        n = len(nums)
        if n % 2:
            return nums[n//2]
        return (nums[n//2-1] + nums[n//2]) / 2`
            }
        ],

        java: [
            {
                title: "Roman to Integer",
                desc: "Convert Roman numeral to integer.",
                code: `class Solution {
    public int romanToInt(String s){
        java.util.Map<Character,Integer> m=new java.util.HashMap<>();
        m.put('I',1);m.put('V',5);m.put('X',10);
        m.put('L',50);m.put('C',100);m.put('D',500);m.put('M',1000);
        int total=0;
        for(int i=0;i<s.length();i++){
            if(i+1<s.length() && m.get(s.charAt(i))>m.get(s.charAt(i+1)))
                total-=m.get(s.charAt(i));
            else total+=m.get(s.charAt(i));
        }
        return total;
    }
}`
            },
            {
                title: "Combination Sum",
                desc: "Return combinations summing to target.",
                code: `class Solution{
    public java.util.List<java.util.List<Integer>> combinationSum(int[] a,int t){
        java.util.List<java.util.List<Integer>> res=new java.util.ArrayList<>();
        backtrack(0,t,a,new java.util.ArrayList<>(),res);
        return res;
    }
    void backtrack(int s,int rem,int[] a,
                   java.util.List<Integer> p,
                   java.util.List<java.util.List<Integer>> res){
        if(rem==0){res.add(p);return;}
        if(rem<0)return;
        for(int i=s;i<a.length;i++){
            p.add(a[i]);
            backtrack(i+1,rem-a[i],a,p,res);
            p.remove(p.size()-1);
        }
    }
}`
            },
            {
                title: "Median of Two Arrays",
                desc: "Find median of arrays.",
                code: `class Median{
    public double findMedianSortedArrays(int[] A,int[] B){
        int[] nums=new int[A.length+B.length];
        System.arraycopy(A,0,nums,0,A.length);
        System.arraycopy(B,0,nums,A.length,B.length);
        java.util.Arrays.sort(nums);
        int n=nums.length;
        if(n%2==1) return nums[n/2];
        return (nums[n/2-1]+nums[n/2])/2.0;
    }
}`
            }
        ],

        cpp: [
            {
                title: "Roman to Integer",
                desc: "Convert Roman numeral to integer.",
                code: `class Solution{
public:
    int romanToInt(string s){
        unordered_map<char,int> m={
            {'I',1},{'V',5},{'X',10},{'L',50},
            {'C',100},{'D',500},{'M',1000}};
        int total=0;
        for(int i=0;i<s.size();i++){
            if(i+1<s.size() && m[s[i]]>m[s[i+1]])
                total-=m[s[i]];
            else total+=m[s[i]];
        }
        return total;
    }
};`
            },
            {
                title: "Combination Sum",
                desc: "Return combinations summing to target.",
                code: `class Solution{
public:
    vector<vector<int>> combinationSum(vector<int>& c,int t){
        vector<vector<int>> res;
        vector<int> p;
        backtrack(0,t,c,p,res);
        return res;
    }
    void backtrack(int s,int rem,vector<int>& c,
                   vector<int>& p,vector<vector<int>>& res){
        if(rem==0){res.push_back(p);return;}
        if(rem<0)return;
        for(int i=s;i<c.size();i++){
            p.push_back(c[i]);
            backtrack(i+1,rem-c[i],c,p,res);
            p.pop_back();
        }
    }
};`
            },
            {
                title: "Median of Arrays",
                desc: "Find median of two arrays.",
                code: `class Median{
public:
    double findMedianSortedArrays(vector<int>& A,vector<int>& B){
        A.insert(A.end(),B.begin(),B.end());
        sort(A.begin(),A.end());
        int n=A.size();
        if(n%2) return A[n/2];
        return (A[n/2-1]+A[n/2])/2.0;
    }
};`
            }
        ]
    };

    /* ==============================
       EDITOR PAGE
    ============================== */
    function initEditor() {
        const state = getSession();
        const lang = state.selectedLanguage || "python";
        const problems = PROBLEMS[lang];
        let index = 0;

        require.config({
            paths: { vs: 'https://unpkg.com/monaco-editor@0.45.0/min/vs' }
        });

        require(['vs/editor/editor.main'], function () {

            window.editor = monaco.editor.create(
                document.getElementById('editorContainer'),
                {
                    value: problems[0].code,
                    language: lang,
                    theme: "vs-dark",
                    automaticLayout: true
                }
            );

            document.getElementById("problemTitle").innerText =
                problems[0].title;
            document.getElementById("problemDesc").innerText =
                problems[0].desc;
        });

        document.getElementById("runBtn").onclick = () => {
            document.getElementById("answer").value =
                "Execution output placeholder.\nIntegrate Piston here.";
        };

        document.getElementById("submitBtn").onclick = () => {
            if (!confirm("Submit answers and finish event?")) return;
            window.location.href = "/end.html";
        };
    }

});
