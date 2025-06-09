const express = require('express');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const EXCEL_FILE = 'submissions.xlsx';
const SHEET_NAME = 'Sheet1';

// Create Excel file with headers if it doesn't exist
if (!fs.existsSync(EXCEL_FILE)) {
  const headers = [
    ['Serial Number','Student Name','Gender','Affiliation','State','Branch','Branch Category','Field of Engineering','Year',
     'Division','Scientist Name','Designation','Period of Attachment','Training Period','Time','Mode','Certificate Issue','Issue Date']
  ];
  const ws = XLSX.utils.aoa_to_sheet(headers);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
  XLSX.writeFile(wb, EXCEL_FILE);
}

app.post('/submit-all', (req, res) => {
  const data = req.body;
  const workbook = XLSX.readFile(EXCEL_FILE);
  const worksheet = workbook.Sheets[SHEET_NAME];
  const rows = XLSX.utils.sheet_to_json(worksheet, {header:1});

  const newRow = [
    data.Serial_Number || '',
    data.Name || '',
    data.Gender || '',
    data.Affiliation || '',
    data.State || '',
    data.Branch || '',
    data.Branch_Category || '',
    data.Field_of_Engineering || '',
    data.Year || '',
    data.Division || '',
    data.Scientist_Name || '',
    data.Designation || '',
    data.Period_of_Attachment || '',
    data.Training_Period || '',
    data.Time || '',
    data.Mode || '',
    data.Certificate_Issue || '',
    data.Issue_Date || ''
  ];

  rows.push(newRow);

  const newWs = XLSX.utils.aoa_to_sheet(rows);
  workbook.Sheets[SHEET_NAME] = newWs;
  XLSX.writeFile(workbook, EXCEL_FILE);

  res.status(200).send('Submission saved!');
});

app.use(express.static('.')); // Serves your HTML/CSS/images

app.listen(3000, () => console.log('Server running at http://localhost:3000'));

