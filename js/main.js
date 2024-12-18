// 儲存所有記錄的陣列
let records = JSON.parse(localStorage.getItem('counselingRecords')) || [];
let filteredRecords = [...records];

// 更新側欄月份列表
function updateMonthList() {
    const monthList = document.getElementById('monthList');
    const months = {};
    
    records.forEach(record => {
        const monthKey = record.date.substring(0, 7);
        months[monthKey] = (months[monthKey] || 0) + 1;
    });

    const sortedMonths = Object.entries(months)
        .sort((a, b) => b[0].localeCompare(a[0]));

    monthList.innerHTML = sortedMonths.map(([month, count]) => {
        const [year, monthNum] = month.split('-');
        const monthName = `${year}年${monthNum}月`;
        return `
            <li class="month-item" onclick="filterByMonth('${month}')">
                <span>${monthName}</span>
                <span class="month-count">${count}</span>
            </li>
        `;
    }).join('');
}

// 更新學生列表
function updateStudentList() {
    const studentList = document.getElementById('studentList');
    const students = {};
    
    records.forEach(record => {
        students[record.student] = (students[record.student] || 0) + 1;
    });

    const sortedStudents = Object.entries(students)
        .sort((a, b) => a[0].localeCompare(b[0]));

    studentList.innerHTML = sortedStudents.map(([student, count]) => `
        <li class="student-item" onclick="filterByStudent('${student}')">
            <span>${student}</span>
            <span class="student-count">${count}</span>
        </li>
    `).join('');
}

// 依月份篩選記錄
function filterByMonth(month) {
    document.querySelectorAll('.month-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const monthItems = document.querySelectorAll('.month-item');
    monthItems.forEach(item => {
        if (item.textContent.includes(month)) {
            item.classList.add('active');
        }
    });

    filteredRecords = records.filter(record => 
        record.date.startsWith(month)
    );
    
    displayRecords(true);
}

// 依學生篩選記錄
function filterByStudent(student) {
    document.querySelectorAll('.student-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const studentItems = document.querySelectorAll('.student-item');
    studentItems.forEach(item => {
        if (item.textContent.includes(student)) {
            item.classList.add('active');
        }
    });

    filteredRecords = records.filter(record => 
        record.student === student
    );
    
    displayRecords(true);
}

// 顯示記錄
function displayRecords(isFiltered = false) {
    const recordsList = document.getElementById('records-list');
    const displayData = isFiltered ? filteredRecords : records;
    
    if (displayData.length === 0) {
        recordsList.innerHTML = '<div class="no-results">沒有符合的記錄</div>';
        return;
    }

    displayData.sort((a, b) => new Date(b.date) - new Date(a.date));

    recordsList.innerHTML = displayData.map(record => `
        <div class="record-item">
            <div class="record-header">
                <div class="record-summary">
                    <strong>日期：</strong>${record.date} | 
                    <strong>輔導對象：</strong>${record.student}
                </div>
                <button class="collapse-btn" onclick="toggleCollapse(this)">
                    <span class="collapse-icon ${record.isCollapsed ? 'collapsed' : ''}">▼</span>
                    ${record.isCollapsed ? '展開' : '收合'}
                </button>
            </div>
            <div class="record-content ${record.isCollapsed ? 'collapsed' : ''}">
                <p><strong>輔導內容：</strong>${record.content}</p>
                <div class="button-group">
                    <button onclick="navigateToEditPage(${record.id})">編輯</button>
                    <button class="danger" onclick="deleteRecord(${record.id})">刪除</button>
                </div>
            </div>
        </div>
    `).join('');
}

// 導向編輯頁面
function navigateToEditPage(editId = null) {
    if (editId) {
        localStorage.setItem('editId', editId);
    } else {
        localStorage.removeItem('editId');
    }
    window.location.href = 'edit.html';
}

// 刪除記錄
function deleteRecord(id) {
    if (confirm('確定要刪除這筆記錄嗎？')) {
        records = records.filter(record => record.id !== id);
        localStorage.setItem('counselingRecords', JSON.stringify(records));
        displayRecords();
        updateMonthList();
        updateStudentList();
    }
}

// 搜尋記錄
function searchRecords() {
    const searchText = document.getElementById('searchText').value.toLowerCase();
    const searchDate = document.getElementById('searchDate').value;

    filteredRecords = records.filter(record => {
        const matchText = !searchText || 
            record.student.toLowerCase().includes(searchText) ||
            record.content.toLowerCase().includes(searchText);
        
        const matchDate = !searchDate || record.date === searchDate;

        return matchText && matchDate;
    });

    displayRecords(true);
}

// 清除搜尋
function clearSearch() {
    document.getElementById('searchText').value = '';
    document.getElementById('searchDate').value = '';
    filteredRecords = [...records];
    displayRecords(false);
    
    document.querySelectorAll('.month-item, .student-item').forEach(item => {
        item.classList.remove('active');
    });
}

// 收合切換
function toggleCollapse(button) {
    const recordItem = button.closest('.record-item');
    const content = recordItem.querySelector('.record-content');
    const icon = button.querySelector('.collapse-icon');
    const isCollapsed = content.classList.toggle('collapsed');
    icon.classList.toggle('collapsed');
    
    button.innerHTML = `
        <span class="collapse-icon ${isCollapsed ? 'collapsed' : ''}">▼</span>
        ${isCollapsed ? '展開' : '收合'}
    `;
}

// PDF 匯出功能
function exportToPDF() {
    const content = document.createElement('div');
    content.innerHTML = `
        <h2 style="text-align: center; color: #4a90e2; margin-bottom: 20px;">學生輔導記錄表</h2>
        <p style="text-align: right; margin-bottom: 20px;">匯出日期：${new Date().toLocaleDateString()}</p>
        <div style="margin-bottom: 20px;">
            ${records.sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(record => `
                    <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 8px;">
                        <p><strong>日期：</strong>${record.date}</p>
                        <p><strong>輔導對象：</strong>${record.student}</p>
                        <p><strong>輔導內容：</strong>${record.content}</p>
                    </div>
                `).join('')}
        </div>
    `;

    const opt = {
        margin: 1,
        filename: `輔導記錄_${new Date().toLocaleDateString()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(content).save();
}

// CSV 匯出功能
function exportToCSV() {
    try {
        const csvContent = [
            ['日期', '輔導對象', '輔導內容'],
            ...records.map(record => [
                record.date,
                record.student,
                record.content
            ])
        ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `輔導記錄_${new Date().toLocaleDateString()}.csv`);
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        alert('匯出 CSV 時發生錯誤：' + error.message);
    }
}

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', function() {
    displayRecords();
    updateMonthList();
    updateStudentList();
}); 