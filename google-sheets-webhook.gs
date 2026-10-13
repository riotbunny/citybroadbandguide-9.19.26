const SPREADSHEET_ID = "1h9eSgo80saYiefK9rYNYTcwpcD3afznQDaVsIfQ1d0A";
const SHEET_NAME = "Leads";

const HEADERS = [
  "Submitted At",
  "Source",
  "Language",
  "Full Address",
  "Street Address",
  "City",
  "State",
  "ZIP",
  "Current Provider",
  "Selected Plan",
  "Install Window",
  "First Name",
  "Last Name",
  "Full Name",
  "Email",
  "Phone",
  "Date of Birth",
  "Consent",
  "User Agent",
];

function doPost(e) {
  const lead = JSON.parse(e.postData.contents || "{}");
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error("Lead sheet not found.");
  }

  const row = [
    lead.submittedAt || new Date().toISOString(),
    lead.source || "",
    lead.language || "",
    lead.fullAddress || [lead.address, lead.city, lead.state, lead.zip].filter(Boolean).join(", "),
    lead.address || "",
    lead.city || "",
    lead.state || "",
    lead.zip || "",
    lead.currentProvider || "",
    lead.selectedPlan || "",
    lead.installWindow || "",
    lead.firstName || "",
    lead.lastName || "",
    lead.fullName || "",
    lead.email || "",
    lead.phone || "",
    lead.dateOfBirth || lead.dob || "",
    lead.consent === true ? "Yes" : lead.consent || "",
    lead.userAgent || "",
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
