// 儲存所有學生資料的陣列
let students = JSON.parse(localStorage.getItem('students')) || [];
let filteredStudents = [...students];

// 儲存學生資料
function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
}

// 顯示學生列表
function displayStudents(isFiltered = false) {
    const studentsList = document.getElementById('students-list');
    const displayData = isFiltered ? filteredStudents : students;

    if (displayData.length === 0) {
        studentsList.innerHTML = '<div class="no-results">沒有符合的學生資料</div>';
        return;
    }

    // 依年級、班級、座號排序
    displayData.sort((a, b) => {
        if (a.grade !== b.grade) return a.grade - b.grade;
        if (a.class !== b.class) return a.class - b.class;
        return a.number - b.number;
    });

    // 建立表格
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>年級</th>
                <th>班級</th>
                <th>座號</th>
                <th>姓名</th>
                <th>導師</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            ${displayData.map(student => `
                <tr>
                    <td>${student.grade}年級</td>
                    <td>${student.class}班</td>
                    <td>${student.number}號</td>
                    <td>${student.name}</td>
                    <td>${student.teacher}</td>
                    <td>
                        <div class="action-buttons">
                            <button onclick="editStudent(${student.id})">編輯</button>
                            <button class="danger" onclick="deleteStudent(${student.id})">刪除</button>
                        </div>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;

    studentsList.innerHTML = '';
    studentsList.appendChild(table);
}

// 儲存學生資料
function saveStudent() {
    const name = document.getElementById('name').value;
    const grade = document.getElementById('grade').value;
    const classNum = document.getElementById('class').value;
    const number = document.getElementById('number').value;
    const teacher = document.getElementById('teacher').value;
    const editId = document.getElementById('editStudentId').value;

    // 表單驗證
    if (!name || !grade || !classNum || !number || !teacher) {
        alert('請填寫所有欄位！');
        return;
    }

    // 檢查座號是否重複
    const isDuplicate = students.some(student => 
        student.grade === parseInt(grade) &&
        student.class === parseInt(classNum) &&
        student.number === parseInt(number) &&
        (!editId || student.id !== parseInt(editId))
    );

    if (isDuplicate) {
        alert('該班級已有相同座號的學生！');
        return;
    }

    if (editId) {
        // 編輯現有學生資料
        const index = students.findIndex(student => student.id === parseInt(editId));
        if (index !== -1) {
            students[index] = {
                ...students[index],
                name,
                grade: parseInt(grade),
                class: parseInt(classNum),
                number: parseInt(number),
                teacher
            };
        }
    } else {
        // 新增學生資料
        const student = {
            id: Date.now(),
            name,
            grade: parseInt(grade),
            class: parseInt(classNum),
            number: parseInt(number),
            teacher
        };
        students.push(student);
    }

    saveStudents();
    clearStudentForm();
    displayStudents();
}

// 編輯學生資料
function editStudent(id) {
    const student = students.find(student => student.id === id);
    if (student) {
        document.getElementById('name').value = student.name;
        document.getElementById('grade').value = student.grade;
        document.getElementById('class').value = student.class;
        document.getElementById('number').value = student.number;
        document.getElementById('teacher').value = student.teacher;
        document.getElementById('editStudentId').value = student.id;
        
        document.getElementById('formTitle').textContent = '編輯學生資料';
        document.getElementById('submitBtn').textContent = '更新資料';
        document.getElementById('cancelBtn').style.display = 'inline';
        
        // 滾動到表單區域
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    }
}

// 刪除學生資料
function deleteStudent(id) {
    if (confirm('確定要刪除這位學生的資料嗎？')) {
        students = students.filter(student => student.id !== id);
        saveStudents();
        displayStudents();
    }
}

// 取消編輯
function cancelStudentEdit() {
    clearStudentForm();
}

// 清空表單
function clearStudentForm() {
    document.getElementById('name').value = '';
    document.getElementById('grade').value = '';
    document.getElementById('class').value = '';
    document.getElementById('number').value = '';
    document.getElementById('teacher').value = '';
    document.getElementById('editStudentId').value = '';
    
    document.getElementById('formTitle').textContent = '新增學生資料';
    document.getElementById('submitBtn').textContent = '新增學生';
    document.getElementById('cancelBtn').style.display = 'none';
}

// 搜尋學生
function searchStudents() {
    const searchText = document.getElementById('searchStudent').value.toLowerCase();
    
    filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchText) ||
        `${student.grade}年${student.class}班`.includes(searchText) ||
        `${student.number}號`.includes(searchText)
    );
    
    displayStudents(true);
}

// 清除搜尋
function clearStudentSearch() {
    document.getElementById('searchStudent').value = '';
    filteredStudents = [...students];
    displayStudents(false);
}

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', function() {
    displayStudents();
}); 