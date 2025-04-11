// Page 1

let semesterData = [
    { sgpa: '', credits: 20 },
    { sgpa: '', credits: 20 },
    { sgpa: '', credits: 22 },
    { sgpa: '', credits: 22 },
    { sgpa: '', credits: 22 },
    { sgpa: '', credits: 22 },
    { sgpa: '', credits: 20 },
    { sgpa: '', credits: 12 }
];

function renderSemesters() {
    const semesterList = document.getElementById('semesterList');
    semesterList.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        const semesterDiv = document.createElement('div');
        semesterDiv.classList.add('semester-row');
        semesterDiv.innerHTML = `
            <label>Sem ${i + 1}</label>
            <input type="text" id="sgpa-${i + 1}" class="sgpabox" placeholder="SGPA" value="${semesterData[i].sgpa}">
            <input type="number" id="credits-${i + 1}" class="creditsbox" placeholder="Total Credits" value="${semesterData[i].credits}" min="0">
        `;
        semesterList.appendChild(semesterDiv);
    }
}

function calculateCGPA() {
    let totalCredits = 0;
    let weightedSGPA = 0;

    for (let i = 1; i <= 8; i++) {
        const sgpaInput = document.getElementById(`sgpa-${i}`).value;
        const credits = parseFloat(document.getElementById(`credits-${i}`).value) || 0;

        // Check if SGPA is filled and valid
        if (sgpaInput) {
            const sgpa = parseFloat(sgpaInput) || 0;
            weightedSGPA += sgpa * credits;
            totalCredits += credits;
        }
    }

    const cgpa = totalCredits > 0 ? weightedSGPA / totalCredits : 0;
    document.getElementById('cgpaOutput').innerText = `CGPA: ${cgpa.toFixed(3)}`;
}

function saveChanges() {
    const savedData = [];
    for (let i = 1; i <= 8; i++) {
        const sgpa = document.getElementById(`sgpa-${i}`).value;
        const credits = document.getElementById(`credits-${i}`).value;
        if (sgpa || credits) {
            savedData.push({ sgpa, credits });
        }
    }
    localStorage.setItem('semesterData', JSON.stringify(savedData));
}

function loadSavedData() {
    const savedData = JSON.parse(localStorage.getItem('semesterData'));
    if (savedData) {
        savedData.forEach((data, index) => {
            if (index < 8) {
                document.getElementById(`sgpa-${index + 1}`).value = data.sgpa;
                document.getElementById(`credits-${index + 1}`).value = data.credits;
            }
        });
    }
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
}

window.onload = function () {
    renderSemesters();
    loadSavedData();
};