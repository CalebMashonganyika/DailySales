let itemCounter = 0;

function addInvoiceItem() {
    itemCounter++;

    const newItemRow = `<tr id="itemRow${itemCounter}"> 
        <td><input type="text" class="form-control" placeholder="Enter Description" required></td>
        <td><input type="number" class="form-control quantity" placeholder="Enter quantity" required></td>
        <td><input type="number" class="form-control unitPrice" placeholder="Enter unit Price" required></td>
        <td><input type="number" class="form-control totalItemPrice" disabled readonly></td>
        <td><button type="button" class="btn btn-danger" onclick="removeInvoiceItem(${itemCounter})">Remove</button></td>
    </tr>`;

    $("#invoiceItems").append(newItemRow);

    // Add event listeners to the new inputs
    $(`#itemRow${itemCounter} .quantity, #itemRow${itemCounter} .unitPrice`).on('input', updateTotalAmount);

    // Update total amount on every item added
    updateTotalAmount();
}

function removeInvoiceItem(itemId) {
    $(`#itemRow${itemId}`).remove();
    updateTotalAmount();
}

function updateTotalAmount() {
    let totalAmount = 0;
    $("tr[id^='itemRow']").each(function() {
        const quantity = parseFloat($(this).find(".quantity").val()) || 0;
        const unitPrice = parseFloat($(this).find(".unitPrice").val()) || 0;
        const totalItemPrice = quantity * unitPrice;
        $(this).find(".totalItemPrice").val(totalItemPrice.toFixed(2));
        totalAmount += totalItemPrice;
    });

    $("#totalAmount").val(totalAmount.toFixed(2));
}

//automatically set current date

$(document).ready(function(){
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    $("#InvoiceDate").val(formattedDate);
});

$("#invoiceForm").submit(function(event){
    event.preventDefault();
    updateTotalAmount();
});

// printbill invoice

// Ensure jQuery and jsPDF are loaded before this script

function downloadInvoicePDF() {
    const customerName = $("#customerName").val();
    const invoiceDate = $("#invoiceDate").val();
    const items = [];
  
    // Gather invoice item details
    $("tr.item-row").each(function() {
      const description = $(this).find("td:eq(0) input.item-description").val();
      const quantity = $(this).find("td:eq(1) input.item-quantity").val();
      const unitPrice = $(this).find("td:eq(2) input.item-unit-price").val();
      const totalItemPrice = $(this).find("td:eq(3) input.item-total").val();
  
      items.push({
        description,
        quantity,
        unitPrice,
        totalItemPrice,
      });
    });
  
    const totalAmount = $("totalAmount").val();
  
    // Construct the invoice content in HTML format
    const invoiceContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
  
            h2 {
              color: #007bff;
            }
  
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
  
            th,
            td {
              border: 1px solid white;
              text-align: left;
              padding: 8px;
            }
  
            .total {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <h2>Invoice Slip</h2>
          <p><strong>Customer Name: </strong> ${customerName}</p>
          <p><strong>Date and Time: </strong> ${invoiceDate}</p>
  
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map((item) => `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unitPrice}</td>
                    <td>${item.totalItemPrice}</td>
                  </tr>
                `)
                .join("")}
            </tbody>
          </table>
          <p class="total">Total Amount: ${totalAmount}</p>
        </body>
      </html>
    `;
  
    // Convert HTML to PDF using jsPDF library
    const doc = new jsPDF();
    doc.fromHTML(invoiceContent, 15, 15, {
      // Adjust margins and other options as needed
      pagesplit: true, // Enable page splitting if content overflows
      autotable: { // Enable automatic table layout (optional)
        startY: 35, // Start table below invoice details
        margin: { top: 10, left: 15, right: 15, bottom: 15 },
        head: [["Description", "Quantity", "Unit Price", "Total"]],
        body: items.map((item) => [item.description, item.quantity, item.unitPrice, item.totalItemPrice]),
      },
    });
  
    // Prepare PDF download using a Blob (cross-browser compatibility)
}  