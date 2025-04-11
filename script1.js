const grade = {
    "O": 10, "A+": 9, "A": 8, "B+": 7,
    "B": 6, "C": 5, "P": 4, "F": 0
};

const CURRENT_VERSION = "2.0"; // Bumped version for new feature

const defaultCourses = ["FOV", "MTA", "DSP", "DCT", "Elective", "Mini-Project", "PMF", "EVS"];

const defaultCredits = {
    "FOV": 3, "MTA": 4, "DSP": 3, "DCT": 4,
    "Elective": 3, "Mini-Project": 2, "PMF": 2, "EVS": 1
};

let courseCreds = { ...defaultCredits };
let courses = [...defaultCourses];
let tempEditableCourses = [...courses];
let tempEditableCourseCreds = { ...courseCreds };

function renderCourses() {
    const courseList = document.getElementById('courseList');
    courseList.innerHTML = ''; 
    courses.forEach((course) => {
        const courseDiv = document.createElement('div');
        courseDiv.classList.add('course-row');
        courseDiv.innerHTML = `
            <label for="${course}">${course}</label>
            <select id="${course}">
                <option value="O">O</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="P">P</option>
                <option value="F">F</option>
            </select>
        `;
        courseList.appendChild(courseDiv);
    });
}

function renderEditableCourses() {
    const editCourseList = document.getElementById('editCourseList');
    editCourseList.innerHTML = '';
    tempEditableCourses.forEach((course, index) => {
        const editDiv = document.createElement('div');
        editDiv.classList.add('course-edit');
        editDiv.innerHTML = `
            <button type="button" class="arrow-btn" onclick="moveUp(${index})">⬆</button>
            <input type="text" id="editName-${index}" value="${course}" placeholder="Course Name" onchange="updateEditableCourse(${index})">
            <input type="number" id="editCredits-${index}" placeholder="Creds" value="${tempEditableCourseCreds[course] || ''}" min="1" max="10" onchange="updateEditableCourse(${index})">
            <button type="button" class="delete-btn" onclick="removeEditableCourse(${index})">
                <img src="https://img.icons8.com/ios-glyphs/30/ffffff/trash.png" alt="Delete">
            </button>
        `;
        editCourseList.appendChild(editDiv);
    });
}

function calculateGPA() {
    let studentCreds = 0;
    let totalCreds = 0;
    courses.forEach((course) => {
        const selectedGrade = document.getElementById(course)?.value;
        if (selectedGrade && courseCreds[course]) {
            studentCreds += grade[selectedGrade] * courseCreds[course];
            totalCreds += courseCreds[course];
        }
    });
    const gpa = totalCreds > 0 ? (studentCreds / totalCreds) : 0;
    document.getElementById('result').innerText = `GPA: ${gpa.toFixed(3)}`;
}

function toggleEdit() {
    const editContainer = document.getElementById('editContainer');
    editContainer.style.display = (editContainer.style.display === 'none' || !editContainer.style.display) ? 'block' : 'none';
    renderEditableCourses();
}

function addCourse() {
    tempEditableCourses.push("");
    tempEditableCourseCreds[""] = 0;
    renderEditableCourses();
}

function updateEditableCourse(index) {
    const newName = document.getElementById(`editName-${index}`).value.trim();
    const newCredits = parseInt(document.getElementById(`editCredits-${index}`).value) || 0;
    if (newName) {
        tempEditableCourses[index] = newName;
        tempEditableCourseCreds[newName] = newCredits;
    }
}

function removeEditableCourse(index) {
    const course = tempEditableCourses[index];
    delete tempEditableCourseCreds[course];
    tempEditableCourses.splice(index, 1);
    renderEditableCourses();
}

function moveUp(index) {
    if (index > 0) {
        [tempEditableCourses[index], tempEditableCourses[index - 1]] = [tempEditableCourses[index - 1], tempEditableCourses[index]];
        renderEditableCourses();
    }
}

function saveChanges() {
    const updatedCourses = tempEditableCourses.filter(course => course.trim() !== "");
    const updatedCourseCreds = {};
    updatedCourses.forEach(course => {
        updatedCourseCreds[course] = tempEditableCourseCreds[course] || 0;
    });

    courses = updatedCourses;
    courseCreds = updatedCourseCreds;

    localStorage.setItem('courses', JSON.stringify(courses));
    localStorage.setItem('courseCreds', JSON.stringify(courseCreds));

    // Save under branchSemesterData if branch & semester were selected
    if (window.selectedBranch && window.selectedSemester) {
        if (!branchSemesterData[window.selectedBranch]) {
            branchSemesterData[window.selectedBranch] = {};
        }
        branchSemesterData[window.selectedBranch][window.selectedSemester] = {
            courses: [...courses],
            credits: { ...courseCreds }
        };
    }

    renderCourses();
    renderEditableCourses();
    toggleEdit();
    saveBranchSemesterData();

}


function loadSavedData() {
    const savedVersion = localStorage.getItem('courses_version');
    const savedCourses = JSON.parse(localStorage.getItem('courses'));
    const savedCourseCreds = JSON.parse(localStorage.getItem('courseCreds'));

    if (savedVersion !== CURRENT_VERSION) {
        courses = [...defaultCourses];
        courseCreds = { ...defaultCredits };
        localStorage.setItem('courses', JSON.stringify(courses));
        localStorage.setItem('courseCreds', JSON.stringify(courseCreds));
        localStorage.setItem('courses_version', CURRENT_VERSION);
    } else {
        courses = savedCourses || [...defaultCourses];
        courseCreds = savedCourseCreds || { ...defaultCredits };
    }

    tempEditableCourses = [...courses];
    tempEditableCourseCreds = { ...courseCreds };
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
}

// Dynamic course data
const branchSemesterData = {
    ECE: {
        1: {
            courses: ["Maths - 1", "Physics", "BEC", "ESC", "Programming", "Kannada", "IDT", "English"],
            credits: {
                "Maths - 1": 4, "Physics": 4, "BEC": 3, "ESC": 3, "Programming": 3, "Kannada": 1, "IDT": 1, "English": 1
            }
        },
        2: {
            courses: ["Maths - 2", "Chemistry", "CAD", "Electrical", "Elective", "Constitution", "SFH", "English Writing"],
            credits: {
                "Maths - 2": 4, "Chemistry": 4, "CAD": 3, "Electrical": 3, "Elective": 3, "Constitution": 1, "SFH": 1, "English Writing": 1
            }
        },
        3: {
            courses: ["HDL", "Maths-3", "AEC", "DCD", "SAS", "NAL", "IEL Lab", "Biology", "HDL Lab"],
            credits: {
                "HDL": 3, "Maths-3": 3, "AEC": 3, "DCD": 3, "SAS": 4, "NAL": 3, "IEL Lab": 1, "Biology": 1, "HDL Lab": 1
            }
        },
        4: {
            courses: ["FAW", "AIC", "PCS", "ARM", "Maths-4", "CST", "UHV", "APL Lab"],
            credits: {
                "FAW": 3, "AIC": 3, "PCS": 4, "ARM": 4, "Maths-4": 3, "CST": 3, "UHV": 1, "APL Lab": 1
            }
        },
        5: {
            courses: ["FOV", "MTA", "DSP", "DCT", "Elective", "Mini Project", "PMF", "EVS"],
            credits: {
                "FOV": 3, "MTA": 4, "DSP": 3, "DCT": 4, "Elective": 3, "Mini Project": 2, "PMF": 2, "EVS": 1
            }
        },
        6: {
            courses: ["WCN", "CCN", "MSD", "Prof Elec", "Open Elec", "Project Work -1", "RMI", "ASP Lab"],
            credits: {
                "WCN": 3, "CCN": 4, "MSD": 4, "Prof Elec": 3, "Open Elec": 3, "Project Work -1": 2, "RMI": 2, "ASP Lab": 1
            }
        }// More semesters can be added later
    },
    // Other branchesinitialized empty
    CSE: {},
    MECH: {},
    CIVIL: {},
    ISE: {},
    AIML: {}
};

function selectBranch(branch) {
    const semestersDiv = document.getElementById('semesters');
    const semesterButtonsDiv = document.getElementById('semesterButtons');
    semestersDiv.style.display = 'block';
    semesterButtonsDiv.innerHTML = '';

    for (let i = 1; i <= 8; i++) {
        const semesterButton = document.createElement('button');
        semesterButton.type = 'button';
        semesterButton.className = 'semester-btn';
        semesterButton.textContent = `Semester ${i}`;
        semesterButton.onclick = () => selectSemester(branch, i);
        semesterButtonsDiv.appendChild(semesterButton);
    }

    // Set selected branch title beside Semesters
    document.getElementById('currentBranch').innerText = branch;
}


function selectSemester(branch, semester) {
    const dataExists = branchSemesterData[branch] && branchSemesterData[branch][semester];

    if (dataExists) {
        const data = branchSemesterData[branch][semester];
        courses = data.courses;
        courseCreds = data.credits;

        // Save to localStorage
        localStorage.setItem('courses', JSON.stringify(courses));
        localStorage.setItem('courseCreds', JSON.stringify(courseCreds));

        tempEditableCourses = [...courses];
        tempEditableCourseCreds = { ...courseCreds };

        renderCourses();
        renderEditableCourses();

        // Close edit panel if open
        document.getElementById('editContainer').style.display = 'none';
        document.getElementById('result').innerText = "";

    } else {
        alert(`No data for ${branch} - Semester ${semester}, Please enter courses manually and save changes`);

        // Clear and prepare empty editable panel
        tempEditableCourses = [];
        tempEditableCourseCreds = {};
        renderEditableCourses();

        // Open edit panel so user can enter new course info
        document.getElementById('editContainer').style.display = 'block';

        // Clear course view & result
        const courseList = document.getElementById('courseList');
        courseList.innerHTML = '';
        document.getElementById('result').innerText = "";

        // Store branch and semester context in localStorage for saving later if needed
        localStorage.setItem('selectedBranch', branch);
        localStorage.setItem('selectedSemester', semester);
    }
}



function loadBranchSemesterData() {
    const savedBranchData = localStorage.getItem('branchSemesterData');
    if (savedBranchData) {
        const parsed = JSON.parse(savedBranchData);
        Object.assign(branchSemesterData, parsed);
    }
}

function saveBranchSemesterData() {
    localStorage.setItem('branchSemesterData', JSON.stringify(branchSemesterData));
}


window.onload = function () {
    loadBranchSemesterData();  // <- new line
    loadSavedData();
    renderCourses();
};
