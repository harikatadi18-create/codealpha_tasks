let students =
    JSON.parse(
        localStorage.getItem("students")
    ) || [];

let editingRollNumber = null;


// ===============================
// ADD SUBJECT
// ===============================

function addSubject() {

    const container =
        document.getElementById(
            "subjectsContainer"
        );

    const row =
        document.createElement("div");

    row.className = "subject-row";

    row.innerHTML = `
        <input
            type="text"
            class="subject-name"
            placeholder="Subject name"
        >

        <input
            type="number"
            class="subject-mark"
            placeholder="Marks"
            min="0"
            max="100"
        >

        <button
            type="button"
            class="remove-btn"
            onclick="removeSubject(this)"
        >
            ✕
        </button>
    `;

    container.appendChild(row);
}


// ===============================
// REMOVE SUBJECT
// ===============================

function removeSubject(button) {

    const rows =
        document.querySelectorAll(
            ".subject-row"
        );

    if (rows.length === 1) {

        alert(
            "At least one subject is required."
        );

        return;
    }

    button.parentElement.remove();
}


// ===============================
// GET SUBJECTS
// ===============================

function getSubjectsFromForm() {

    const names =
        document.querySelectorAll(
            ".subject-name"
        );

    const marks =
        document.querySelectorAll(
            ".subject-mark"
        );

    const subjects = [];

    for (
        let i = 0;
        i < names.length;
        i++
    ) {

        const subjectName =
            names[i].value.trim();

        const mark =
            Number(marks[i].value);

        if (!subjectName) {

            alert(
                "Please enter all subject names."
            );

            return null;
        }

        if (
            marks[i].value === "" ||
            mark < 0 ||
            mark > 100
        ) {

            alert(
                "Marks must be between 0 and 100."
            );

            return null;
        }

        subjects.push({

            name: subjectName,

            mark: mark
        });
    }

    return subjects;
}


// ===============================
// CALCULATE GRADE
// ===============================

function calculateGrade(average) {

    if (average >= 90) {
        return "A+";
    }

    if (average >= 80) {
        return "A";
    }

    if (average >= 70) {
        return "B";
    }

    if (average >= 60) {
        return "C";
    }

    if (average >= 50) {
        return "D";
    }

    return "F";
}


// ===============================
// CALCULATE RESULT
// ===============================

function calculateResult(subjects) {

    const total =
        subjects.reduce(
            (sum, subject) =>
                sum + subject.mark,
            0
        );

    const average =
        total / subjects.length;

    const highest =
        Math.max(
            ...subjects.map(
                subject =>
                    subject.mark
            )
        );

    const lowest =
        Math.min(
            ...subjects.map(
                subject =>
                    subject.mark
            )
        );

    const grade =
        calculateGrade(average);

    const status =
        average >= 50
            ? "PASS"
            : "FAIL";

    return {

        total,
        average,
        highest,
        lowest,
        grade,
        status
    };
}


// ===============================
// ADD STUDENT
// ===============================

function addStudent() {

    const name =
        document
            .getElementById("studentName")
            .value
            .trim();

    const rollNumber =
        Number(
            document
                .getElementById("rollNumber")
                .value
        );

    if (!name) {

        alert(
            "Please enter student name."
        );

        return;
    }

    if (
        !rollNumber ||
        rollNumber <= 0
    ) {

        alert(
            "Please enter a valid roll number."
        );

        return;
    }

    const duplicate =
        students.some(
            student =>
                student.rollNumber ===
                rollNumber
        );

    if (duplicate) {

        alert(
            "This roll number already exists."
        );

        return;
    }

    const subjects =
        getSubjectsFromForm();

    if (!subjects) {
        return;
    }

    const result =
        calculateResult(subjects);

    const student = {

        name,

        rollNumber,

        subjects,

        total: result.total,

        average: result.average,

        highest: result.highest,

        lowest: result.lowest,

        grade: result.grade,

        status: result.status
    };

    students.push(student);

    saveStudents();

    clearForm();

    displayStudents();

    updateDashboard();

    alert(
        "Student added successfully! 🎉"
    );
}


// ===============================
// DISPLAY STUDENTS
// ===============================

function displayStudents() {

    const table =
        document.getElementById(
            "studentsTable"
        );

    const search =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase()
            .trim();

    table.innerHTML = "";

    const filteredStudents =
        students.filter(
            student =>
                student.name
                    .toLowerCase()
                    .includes(search)
                ||
                String(
                    student.rollNumber
                ).includes(search)
        );

    if (
        filteredStudents.length === 0
    ) {

        table.innerHTML = `
            <tr>

                <td
                    colspan="6"
                    style="text-align:center;"
                >
                    No students found.
                </td>

            </tr>
        `;

        return;
    }

    filteredStudents.forEach(
        student => {

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>
                    ${student.rollNumber}
                </td>

                <td>
                    ${student.name}
                </td>

                <td>
                    ${student.average.toFixed(2)}
                </td>

                <td>

                    <span class="grade">
                        ${student.grade}
                    </span>

                </td>

                <td>

                    <span
                        class="${
                            student.status ===
                            "PASS"
                                ? "status-pass"
                                : "status-fail"
                        }"
                    >
                        ${student.status}
                    </span>

                </td>

                <td>

                    <button
                        type="button"
                        class="action-btn view-btn"
                        onclick="
                            viewStudent(
                                ${student.rollNumber}
                            )
                        "
                    >
                        View
                    </button>

                    <button
                        type="button"
                        class="action-btn edit-btn"
                        onclick="
                            editStudent(
                                ${student.rollNumber}
                            )
                        "
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="action-btn delete-btn"
                        onclick="
                            deleteStudent(
                                ${student.rollNumber}
                            )
                        "
                    >
                        Delete
                    </button>

                </td>

            `;

            table.appendChild(row);
        }
    );
}


// ===============================
// VIEW STUDENT
// ===============================

function viewStudent(rollNumber) {

    const student =
        students.find(
            student =>
                student.rollNumber ===
                rollNumber
        );

    if (!student) {
        return;
    }

    const details =
        document.getElementById(
            "studentDetails"
        );

    let subjectsHTML = "";

    student.subjects.forEach(
        subject => {

            subjectsHTML += `

                <tr>

                    <td>
                        ${subject.name}
                    </td>

                    <td>
                        ${subject.mark}
                    </td>

                </tr>

            `;
        }
    );

    details.innerHTML = `

        <h2>📊 Student Report</h2>

        <p>
            <strong>Name:</strong>
            ${student.name}
        </p>

        <p>
            <strong>Roll Number:</strong>
            ${student.rollNumber}
        </p>

        <hr>

        <p>
            <strong>Total:</strong>
            ${student.total}
        </p>

        <p>
            <strong>Average:</strong>
            ${student.average.toFixed(2)}
        </p>

        <p>
            <strong>Highest:</strong>
            ${student.highest}
        </p>

        <p>
            <strong>Lowest:</strong>
            ${student.lowest}
        </p>

        <p>
            <strong>Grade:</strong>
            ${student.grade}
        </p>

        <p>
            <strong>Status:</strong>
            ${student.status}
        </p>

        <h3>Subjects</h3>

        <table>

            <thead>

                <tr>

                    <th>
                        Subject
                    </th>

                    <th>
                        Marks
                    </th>

                </tr>

            </thead>

            <tbody>

                ${subjectsHTML}

            </tbody>

        </table>

    `;

    document.getElementById(
        "studentModal"
    ).style.display = "flex";
}


// ===============================
// CLOSE MODAL
// ===============================

function closeModal() {

    document.getElementById(
        "studentModal"
    ).style.display = "none";
}


// ===============================
// EDIT STUDENT
// ===============================

function editStudent(rollNumber) {

    const student =
        students.find(
            student =>
                student.rollNumber ===
                rollNumber
        );

    if (!student) {
        return;
    }

    editingRollNumber =
        rollNumber;

    document.getElementById(
        "studentName"
    ).value =
        student.name;

    document.getElementById(
        "rollNumber"
    ).value =
        student.rollNumber;

    document.getElementById(
        "rollNumber"
    ).disabled = true;


    const container =
        document.getElementById(
            "subjectsContainer"
        );

    container.innerHTML = "";


    student.subjects.forEach(
        subject => {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "subject-row";

            row.innerHTML = `

                <input
                    type="text"
                    class="subject-name"
                    value="${subject.name}"
                    placeholder="Subject name"
                >

                <input
                    type="number"
                    class="subject-mark"
                    value="${subject.mark}"
                    placeholder="Marks"
                    min="0"
                    max="100"
                >

                <button
                    type="button"
                    class="remove-btn"
                    onclick="removeSubject(this)"
                >
                    ✕
                </button>

            `;

            container.appendChild(row);
        }
    );


    document.getElementById(
        "saveButton"
    ).textContent =
        "Update Student";


    document.getElementById(
        "saveButton"
    ).onclick =
        updateStudent;


    document.getElementById(
        "cancelButton"
    ).style.display =
        "block";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });
}


// ===============================
// UPDATE STUDENT
// ===============================

function updateStudent() {

    if (
        editingRollNumber === null
    ) {
        return;
    }

    const student =
        students.find(
            student =>
                student.rollNumber ===
                editingRollNumber
        );

    if (!student) {
        return;
    }

    const name =
        document
            .getElementById(
                "studentName"
            )
            .value
            .trim();

    if (!name) {

        alert(
            "Please enter student name."
        );

        return;
    }

    const subjects =
        getSubjectsFromForm();

    if (!subjects) {
        return;
    }

    const result =
        calculateResult(subjects);


    student.name = name;

    student.subjects =
        subjects;

    student.total =
        result.total;

    student.average =
        result.average;

    student.highest =
        result.highest;

    student.lowest =
        result.lowest;

    student.grade =
        result.grade;

    student.status =
        result.status;


    saveStudents();

    clearForm();

    displayStudents();

    updateDashboard();

    alert(
        "Student updated successfully! ✅"
    );
}


// ===============================
// DELETE STUDENT
// ===============================

function deleteStudent(rollNumber) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this student?"
        );

    if (!confirmed) {
        return;
    }

    students =
        students.filter(
            student =>
                student.rollNumber !==
                rollNumber
        );

    saveStudents();

    displayStudents();

    updateDashboard();
}


// ===============================
// SAVE STUDENTS
// ===============================

function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}


// ===============================
// CLEAR FORM
// ===============================

function clearForm() {

    editingRollNumber = null;


    document.getElementById(
        "studentName"
    ).value = "";


    document.getElementById(
        "rollNumber"
    ).value = "";


    document.getElementById(
        "rollNumber"
    ).disabled = false;


    document.getElementById(
        "saveButton"
    ).textContent =
        "Save Student";


    document.getElementById(
        "saveButton"
    ).onclick =
        addStudent;


    document.getElementById(
        "cancelButton"
    ).style.display =
        "none";


    document.getElementById(
        "subjectsContainer"
    ).innerHTML = `

        <div class="subject-row">

            <input
                type="text"
                class="subject-name"
                placeholder="Subject name"
            >

            <input
                type="number"
                class="subject-mark"
                placeholder="Marks"
                min="0"
                max="100"
            >

            <button
                type="button"
                class="remove-btn"
                onclick="removeSubject(this)"
            >
                ✕
            </button>

        </div>

    `;
}


// ===============================
// CANCEL EDIT
// ===============================

function cancelEdit() {

    clearForm();
}


// ===============================
// UPDATE DASHBOARD
// ===============================

function updateDashboard() {

    const total =
        students.length;


    document.getElementById(
        "totalStudents"
    ).textContent =
        total;


    if (total === 0) {

        document.getElementById(
            "classAverage"
        ).textContent =
            "0.00";

        document.getElementById(
            "highestAverage"
        ).textContent =
            "0.00";

        document.getElementById(
            "passRate"
        ).textContent =
            "0%";


        document.getElementById(
            "topPerformer"
        ).innerHTML = `
            <p>No students available.</p>
        `;


        document.getElementById(
            "gradeDistribution"
        ).innerHTML = `
            <p>No grade data available.</p>
        `;

        return;
    }


    // CLASS AVERAGE

    const classAverage =
        students.reduce(
            (sum, student) =>
                sum + student.average,
            0
        ) / total;


    // HIGHEST AVERAGE

    const highestAverage =
        Math.max(
            ...students.map(
                student =>
                    student.average
            )
        );


    // PASS RATE

    const passed =
        students.filter(
            student =>
                student.status ===
                "PASS"
        ).length;


    const passRate =
        (passed / total) * 100;


    document.getElementById(
        "classAverage"
    ).textContent =
        classAverage.toFixed(2);


    document.getElementById(
        "highestAverage"
    ).textContent =
        highestAverage.toFixed(2);


    document.getElementById(
        "passRate"
    ).textContent =
        passRate.toFixed(0) + "%";


    // =========================
    // TOP PERFORMER
    // =========================

    const topStudent =
        students.reduce(
            (top, student) =>
                student.average >
                top.average
                    ? student
                    : top,
            students[0]
        );


    document.getElementById(
        "topPerformer"
    ).innerHTML = `

        <div class="top-student">

            <div class="trophy">
                🏆
            </div>

            <div>

                <h3>
                    ${topStudent.name}
                </h3>

                <p>
                    Roll No:
                    ${topStudent.rollNumber}
                </p>

                <p>
                    Average:
                    <strong>
                        ${topStudent.average.toFixed(2)}
                    </strong>
                </p>

                <p>
                    Grade:
                    <strong>
                        ${topStudent.grade}
                    </strong>
                </p>

            </div>

        </div>

    `;


    // =========================
    // GRADE DISTRIBUTION
    // =========================

    const grades = {

        "A+": 0,

        "A": 0,

        "B": 0,

        "C": 0,

        "D": 0,

        "F": 0
    };


    students.forEach(
        student => {

            if (
                Object.prototype.hasOwnProperty.call(
                    grades,
                    student.grade
                )
            ) {

                grades[
                    student.grade
                ]++;

            }

        }
    );


    let gradeHTML = "";


    Object.keys(grades).forEach(
        grade => {

            const count =
                grades[grade];


            const percentage =
                (count / total) * 100;


            gradeHTML += `

                <div class="grade-item">

                    <div class="grade-label">

                        <strong>
                            ${grade}
                        </strong>

                        <span>
                            ${count}
                            student${
                                count !== 1
                                    ? "s"
                                    : ""
                            }
                        </span>

                    </div>


                    <div class="progress-bar">

                        <div
                            class="progress-fill"
                            style="
                                width:
                                ${percentage}%
                            "
                        >
                        </div>

                    </div>

                </div>

            `;
        }
    );


    document.getElementById(
        "gradeDistribution"
    ).innerHTML =
        gradeHTML;
}


// ===============================
// INITIAL LOAD
// ===============================

displayStudents();

updateDashboard();