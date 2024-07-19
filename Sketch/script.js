// Get references to the table and buttons
const table = document.getElementById("editableTable");
        const addRowButton = document.getElementById("addRow");
        const addColumnButton = document.getElementById("addColumn");
        const removeRowButton = document.getElementById("removeRow");
        const removeColumnButton = document.getElementById("removeColumn");

// Event listener for adding a row
addRowButton.addEventListener("click", () => {
    const newRow = table.insertRow();
    const cell1 = newRow.insertCell();
    const cell2 = newRow.insertCell();
    cell1.contentEditable = true;
    cell2.contentEditable = true;
    cell1.textContent = "New row";
    cell2.textContent = "New row";
});

// Event listener for adding a column
addColumnButton.addEventListener("click", () => {
    const rows = table.getElementsByTagName("tr");
    for (const row of rows) {
        const newCell = row.insertCell();
        newCell.contentEditable = true;
        newCell.textContent = "New column";
    }
});

removeRowButton.addEventListener("click", () => {
    const rows = table.getElementsByTagName("tr");
    if (rows.length > 1) {
        table.deleteRow(rows.length - 1);
    }
});

removeColumnButton.addEventListener("click", () => {
    const rows = table.getElementsByTagName("tr");
    for (const row of rows) {
        const cells = row.getElementsByTagName("td");
        if (cells.length > 1) {
            row.deleteCell(cells.length - 1);
        }
    }
});

function downloadTableAsCSV(tableId) {
    const rows = document.querySelectorAll(`#${tableId} tr`);
    const separator = ','; // You can customize the separator (e.g., use ';' for Excel compatibility)

    const csv = [];
    for (const row of rows) {
        const cols = row.querySelectorAll('td, th');
        const rowData = Array.from(cols).map(col => {
            let data = col.innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/\s\s/gm, ' ');
            data = data.replace(/"/g, '""'); // Escape double quotes
            return `"${data}"`;
        });
        csv.push(rowData.join(separator));
    }

    const csvString = csv.join('\n');
    const filename = `export_${tableId}_${new Date().toLocaleDateString()}.csv`;

    const link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    link.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csvString)}`);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Attach download functionality to the button
const downloadButton = document.getElementById('downloadCSV');
downloadButton.addEventListener('click', () => {
    downloadTableAsCSV('editableTable');
});


function loadTableData() {
    const savedData = localStorage.getItem('editableTableData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        const rows = document.querySelectorAll('#editableTable tbody tr');
        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, columnIndex) => {
                cell.textContent = parsedData[rowIndex][columnIndex];
            });
        });
    }
}

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