
const Invoice = require('../app/models/invoiceModel');
const url = process.env.baseURL;
const invoiceHTML = (req, invoiceNumber) => {
  const requestData = req.body
  console.log(requestData.companyAddress);
  // Rest of your code remains unchang  ed
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const invoiceDate = `${day}-${month}-${year}`;
  const dueDate = requestData.dueDate;
  let companyLogo = '';
  if (req.file) {
    companyLogo = req.file.path;
  }
  console.log(companyLogo);
  const companyName = requestData.companyName;
  const companyAddress = requestData.companyAddress;
  const companyEmail = requestData.companyEmail;
  const customerName = requestData.customerName;
  const customerCompany = requestData.customerCompany;
  const customerAddress = requestData.customerAddress;
  const invoiceItems = requestData.invoiceItems;
  const paymentMethods = requestData.paymentMethods;
  const comments = requestData.comments;
  const invoiceStatus = requestData.invoiceStatus;
  const discount = requestData.discount;
  const totalAmount = invoiceItems.reduce((acc, item) => acc + parseFloat(item.itemAmount), 0);
  let discountAmount;

  if (discount > 0) {
    // Calculate the discount amount if the discount percentage is greater than 0
    discountAmount = (discount / 100) * totalAmount;
  } else {
    // If no discount is applied, set the discount amount to 0
    discountAmount = 0;
  }

  // Calculate the final amount after applying the discount
  const finalAmount = totalAmount - discountAmount;


  const pdfDoc = new Invoice({
    invoiceNumber: invoiceNumber,
    invoiceDate: invoiceDate,
    dueDate: dueDate,
    companyLogo: companyLogo,
    companyName: companyName,
    companyAddress: companyAddress,
    companyEmail: companyEmail,
    customerName: customerName,
    customerCompany: customerCompany,
    customerAddress: customerAddress,
    discount: discount,
    comments: comments,
    invoiceItems: invoiceItems,
    paymentMethods: paymentMethods,
    invoiceStatus: invoiceStatus,
    totalAmount: totalAmount,
    discountAmount: discountAmount,
    finalAmount: finalAmount,
  });

  // Save the 'pdfDoc' to the database
  pdfDoc.save()

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice</title>
  <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
  <style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
  }
  .invoice {
    background-color: #fff;
    /* Remove border */
    /* border: 1px solid #ccc; */
    padding: 20px;
    /* Adjust max-width to occupy full page width */
    max-width: 100%;
    margin: 0 auto;
  }
    .invoice-header {
        color: #394E8;
      text-align: left;
      margin-bottom: 20px;
    }
    .invoice-text {
        text-align: center;
        margin-bottom: 20px;
    }
    .invoice-title {
        color: #869AC7;
        font-size: 34px; 
        letter-spacing:3px;
        text-align: right;
        font-weight: bold;
      }
    .company-logo {
      max-width: 150px;
      margin: 0;
      display: block;
    }
    .invoice-header p strong {
        color: #394E88;
        font-size: 36px; 
        width: auto; 
        height: auto; 
        margin: 10px 0; 
      }
    .invoice-details {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
    .invoice-details-left {
      flex: 1;
    }
    .invoice-details-right {
      flex: 1;
      text-align: right;
    }
    .bill-to {
      background-color: #3C4D89;
      color: #fff;
      text-align: left;
      padding: 10px;
      margin-top: 20px;
      width: 30%;
      font-weight: bold;
    }
    .bill-to-details {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
    .bill-to-left {
      flex: 1;
    }
    .comments {
        margin-top: 10%;
        width: 60%;
      }
      
      .comments-box {
        width: 90%;
        border: 1px solid #ccc;
        padding: 10px;
        border-radius: 5px;
      }
      
      .comments-table {
        border-collapse: collapse;
      }              
      .comments-table td{
        padding: 8px;
        text-align: left;
        border: none;
      },
       .comments-table th {
        padding: 8px;
        text-align: left;
        border: none; 
      }
      
      .comments-table th {
        color:white;
        background-color: #3C4D89;
      }

      .thank-you {

        text-align: center; 
        margin-top: 10%;
        font-size: 18px; 
        color: #333; 
        font-weight: bold; 
      }
      
    .bill-to-right {
      flex: 1;
      text-align: right;
    }
    .invoice-items {
      margin-top: 20px;
    }
    table {
      width: 100%;
    }
    th, td {
      border: 1px solid #ddd;
      text-align: left;
      padding: 8px;
    }
    th {
      background-color: #f2f2f2;
    }
    .invoice-items th {
      background-color: #3C4D89;
      color: #fff;
    }
    .invoice-items tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    .invoice-total {
      margin-top: 20px;
    }
    
    .total-row {

      background-color:white 
      font-weight: bold;
    }
    .invoice-data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    .invoice-data-table th {
        text-align: right;
        font-size:16px;
        background-color: transparent; 
        border: none; 
      }
      .invoice-data-table td {
        width: 40%;
        font-size:16px;
        border: 1px solid #ddd; 
        text-align: right;
      }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="invoice-details">
      <div class="invoice-details-left">
        <div class="invoice-header">
          <img class="company-logo" src="${url}${companyLogo}" alt="Company Logo">
          <p><strong>${companyName}</strong></p>
          <p>${companyAddress}</p>
          <p>${companyEmail}</p>
        </div>
      </div>
      <div class="invoice-details-right">
        <div class="invoice-title">INVOICE</div>
        <table class="invoice-data-table">
        <tr>
        <th>Date</th>
        <td>${invoiceDate}</td>
      </tr>
          <tr>
            <th>Invoice #</th>
            <td>${invoiceNumber}</td>
          </tr>
          <tr>
            <th>Due Date</th>
            <td>${dueDate}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="bill-to">BILL TO</div>
    <div class="bill-to-details">
      <div class="bill-to-left">
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Company:</strong> ${customerCompany}</p>
        <p><strong>Address:</strong> ${customerAddress}</p>
      </div>
    </div>


    <div class="invoice-items">
    <table>
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Description</th>
          <th>Tax %</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${invoiceItems.map((item, index) => `
          <tr style="background-color: ${index % 2 === 0 ? '#f2f2f2' : 'white'};">
            <td>${item.itemName}</td>
            <td>${item.itemDescription}</td>
            <td>${item.itemTax}</td>
            <td>${item.itemAmount}</td>
          </tr>
        `).join('')}
        <tr class="total-row">
          <td colspan="2">Sub-Total</td>
          <td></td>
          <td>${totalAmount}</td>
        </tr>
        <tr class="total-row">
          <td colspan="2">Discount</td>
          <td></td>
          <td>${discount} %</td>
        </tr>
        <tr class="total-row">
          <td colspan="2">Total</td>
          <td></td>
          <td>${finalAmount}</td>
        </tr>
      </tbody>
    </table>
  </div>
  
    <div class="invoice-details-left">
      <div class="comments">
        <div class="comments-box">
          <table class="comments-table">
            <tbody>
              <th class="other-comments" colspan="2">Comments</th>
              ${comments.map((comment, index) => `
                <tr>
                  <td>${index + 1}. 
                  ${comment}</td>
                </tr>
              `).join('')}
            </tbody>
            
          </table>
          <div class="invoice-total">
          <p><strong>Payment Methods:</strong> ${paymentMethods}</p>
        </div>
        </div>
      </div>
    </div>

   
    <div class="thank-you">
<p>Thank You for your Business</p>
</div>
</body>
</html>

`;
};


module.exports = invoiceHTML;
