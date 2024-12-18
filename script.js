let records = JSON.parse(localStorage.getItem('counselingRecords')) || [];
let filteredRecords = [...records];

// 修改 addRecord 函數以支援編輯功能
function addRecord() {
    const date = document.getElementById('date').value;
    const student = document.getElementById('student').value;
    const content = document.getElementById('content').value;
    const editId = document.getElementById('editId').value;

    if (!date || !student || !content) {
        alert('請填寫所有欄位！');
        return;
    }

    if (editId) {
        // 編輯現有紀錄
        const index = records.findIndex(record => record.id === parseInt(editId));
        if (index !== -1) {
            records[index] = {
                ...records[index],
                date: date,
                student: student,
                content: content
            };
        }
        document.getElementById('submitBtn').textContent = '新增紀錄';
        document.getElementById('cancelBtn').style.display = 'none';
    } else {
        // 新增紀錄
        const record = {
            id: Date.now(),
            date: date,
            student: student,
            content: content
        };
        records.push(record);
    }

    saveRecords();
    displayRecords();
    clearForm();
}

// 編輯紀錄
function editRecord(id) {
    const record = records.find(record => record.id === id);
    if (record) {
        document.getElementById('date').value = record.date;
        document.getElementById('student').value = record.student;
        document.getElementById('content').value = record.content;
        document.getElementById('editId').value = record.id;
        document.getElementById('submitBtn').textContent = '更新紀錄';
        document.getElementById('cancelBtn').style.display = 'inline';
    }
}

// 取消編輯
function cancelEdit() {
    clearForm();
    document.getElementById('submitBtn').textContent = '新增紀錄';
    document.getElementById('cancelBtn').style.display = 'none';
}

// 搜尋紀錄
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
    displayRecords(true);
}

// 更新 displayRecords 函數以支援搜尋結果
function displayRecords(isFiltered = false) {
    const recordsList = document.getElementById('records-list');
    recordsList.innerHTML = '';

    const displayData = isFiltered ? filteredRecords : records;
    displayData.sort((a, b) => new Date(b.date) - new Date(a.date));

    displayData.forEach(record => {
        const recordDiv = document.createElement('div');
        recordDiv.className = 'record-item';
        recordDiv.innerHTML = `
            <p><strong>日期：</strong>${record.date}</p>
            <p><strong>輔導對象：</strong>${record.student}</p>
            <p><strong>輔導內容：</strong>${record.content}</p>
            <button onclick="editRecord(${record.id})">編輯</button>
            <button onclick="deleteRecord(${record.id})">刪除</button>
        `;
        recordsList.appendChild(recordDiv);
    });
}

// 匯出為 CSV
function exportToCSV() {
    const csvContent = [
        ['日期', '輔���對象', '輔導內容'], // CSV 標題
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
    link.setAttribute('download', `輔導紀錄_${new Date().toLocaleDateString()}.csv`);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ... 原有的其他函數 (clearForm, saveRecords, deleteRecord) ... 