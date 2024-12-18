// 取得記錄資料
let records = JSON.parse(localStorage.getItem('counselingRecords')) || [];

// 更新學生選項列表
function updateStudentsList() {
    const studentsList = document.getElementById('studentsList');
    const students = JSON.parse(localStorage.getItem('students')) || [];
    
    // 依年級、班級、座號排序
    students.sort((a, b) => {
        if (a.grade !== b.grade) return a.grade - b.grade;
        if (a.class !== b.class) return a.class - b.class;
        return a.number - b.number;
    });

    // 生成選項
    studentsList.innerHTML = students.map(student => 
        `<option value="${student.name}">${student.grade}年${student.class}班${student.number}號 ${student.name}</option>`
    ).join('');
}

// 儲存記錄
function saveRecord() {
    const date = document.getElementById('date').value;
    const student = document.getElementById('student').value;
    const content = document.getElementById('content').value;
    const editId = document.getElementById('editId').value;

    // 表單驗證
    if (!date || !student || !content) {
        alert('請填寫所有欄位！');
        return;
    }

    // 驗證學生是否存在
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const studentExists = students.some(s => s.name === student);
    
    if (!studentExists) {
        if (!confirm('此學生不在學生名單中，是否繼續？')) {
            return;
        }
    }

    if (editId) {
        // 編輯現有記錄
        const index = records.findIndex(record => record.id === parseInt(editId));
        if (index !== -1) {
            records[index] = {
                ...records[index],
                date: date,
                student: student,
                content: content,
                isCollapsed: false
            };
        }
    } else {
        // 新增記錄
        const record = {
            id: Date.now(),
            date: date,
            student: student,
            content: content,
            isCollapsed: false
        };
        records.push(record);
    }

    // 儲存並返回主頁
    localStorage.setItem('counselingRecords', JSON.stringify(records));
    window.location.href = 'index.html';
}

// 取消編輯
function cancelEdit() {
    if (confirm('確定要取消編輯嗎？未儲存的內容將會遺失。')) {
        window.location.href = 'index.html';
    }
}

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', function() {
    // 更新學生選項列表
    updateStudentsList();
    
    const editId = localStorage.getItem('editId');
    if (editId) {
        // 如果是編輯現有記錄
        const record = records.find(record => record.id === parseInt(editId));
        if (record) {
            document.getElementById('date').value = record.date;
            document.getElementById('student').value = record.student;
            document.getElementById('content').value = record.content;
            document.getElementById('editId').value = record.id;
            document.getElementById('submitBtn').textContent = '更新記錄';
        }
    } else {
        // 如果是新增記錄，設定今天的日期
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }
}); 