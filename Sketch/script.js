// Get references to the table and buttons
document.getElementById('addRow').addEventListener('click', function() {
    let table = document.getElementById('editableTable').getElementsByTagName('tbody')[0];
    let newRow = table.insertRow();
    let cells = table.rows[0].cells.length;
    for (let i = 0; i < cells; i++) {
        let newCell = newRow.insertCell(i);
        newCell.contentEditable = 'false';
        newCell.innerText = '';
        newCell.style.border = '1px solid black';
    }
});

document.getElementById('addColumn').addEventListener('click', function() {
    let table = document.getElementById('editableTable');
    let rows = table.rows;
    for (let i = 0; i < rows.length; i++) {
        let newCell = rows[i].insertCell(-1);
        newCell.contentEditable = i === 0 ? 'true' : 'false';
        newCell.innerText = i === 0 ? 'Edit me!' : '';
        newCell.style.border = '1px solid black';
    }
});

document.getElementById('removeRow').addEventListener('click', function() {
    let table = document.getElementById('editableTable').getElementsByTagName('tbody')[0];
    if (table.rows.length > 1) {
        table.deleteRow(-1);
    }
});

document.getElementById('removeColumn').addEventListener('click', function() {
    let table = document.getElementById('editableTable');
    let rows = table.rows;
    if (rows[0].cells.length > 1) {
        for (let i = 0; i < rows.length; i++) {
            rows[i].deleteCell(-1);
        }
    }
});

document.getElementById('deleteColumn').addEventListener('click', function() {
    let columnIndex = parseInt(document.getElementById('columnIndex').value);
    let table = document.getElementById('editableTable');
    let rows = table.rows;
    if (columnIndex >= 0 && columnIndex < rows[0].cells.length) {
        for (let i = 0; i < rows.length; i++) {
            rows[i].deleteCell(columnIndex);
        }
    }
});

document.getElementById('addColumnAt').addEventListener('click', function() {
    let columnIndex = parseInt(document.getElementById('columnIndex').value);
    let table = document.getElementById('editableTable');
    let rows = table.rows;
    if (columnIndex >= 0 && columnIndex <= rows[0].cells.length) {
        for (let i = 0; i < rows.length; i++) {
            let newCell = rows[i].insertCell(columnIndex);
            newCell.contentEditable = i === 0 ? 'true' : 'false';
            newCell.innerText = i === 0 ? 'Edit me!' : '';
            newCell.style.border = '1px solid black';
        }
    }
});

document.getElementById('createTable').addEventListener('click', function() {
    let numRows = parseInt(document.getElementById('numRows').value);
    let numCols = parseInt(document.getElementById('numCols').value);
    let table = document.getElementById('editableTable').getElementsByTagName('tbody')[0];
    table.innerHTML = ''; // Clear existing table body

    for (let i = 0; i < numRows; i++) {
        let newRow = table.insertRow();
        for (let j = 0; j < numCols; j++) {
            let newCell = newRow.insertCell(j);
            newCell.contentEditable = i === 0 ? 'true' : 'false';
            newCell.innerText = i === 0 ? 'Edit me!' : '';
            newCell.style.border = '1px solid black';
        }
    }
});

document.getElementById('downloadCSV').addEventListener('click', function() {
    let table = document.getElementById('editableTable');
    let csv = [];
    for (let i = 0; i < table.rows.length; i++) {
        let row = [], cols = table.rows[i].cells;
        for (let j = 0; j < cols.length; j++) {
            row.push(cols[j].innerText);
        }
        csv.push(row.join(','));
    }
    let csvFile = new Blob([csv.join('\n')], { type: 'text/csv' });
    let downloadLink = document.createElement('a');
    downloadLink.download = 'table.csv';
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
});

document.getElementById('downloadImage').addEventListener('click', function() {
    html2canvas(document.getElementById('editableTable')).then(function(canvas) {
        let downloadLink = document.createElement('a');
        downloadLink.download = 'table.png';
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
    });
});

// Save data to local storage
function saveTableData() {
    const rows = document.querySelectorAll('#editableTable tbody tr');
    const tableData = [];
    rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        const rowData = Array.from(cells).map((cell) => cell.textContent);
        tableData.push(rowData);
    });
    localStorage.setItem('editableTableData', JSON.stringify(tableData));
}

// Call loadTableData when the page loads
window.addEventListener('load', loadTableData);

// Attach saveTableData to relevant events (e.g., when a cell is edited)
const cells = document.querySelectorAll('#editableTable td');
cells.forEach((cell) => {
    cell.addEventListener('input', saveTableData);
});