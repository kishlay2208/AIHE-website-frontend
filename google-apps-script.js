/**
 * AIHE Google Apps Script Backend
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet.
 * 2. Go to Extensions -> Apps Script.
 * 3. Replace all code in the script editor with this code.
 * 4. Ensure you have the following sheet tabs (case-sensitive):
 *    - "Instructors"
 *    - "Courses"
 *    - "CourseCatalog"
 *    - "Testimonials"
 *    - "Results"
 * 5. Deploy as Web App:
 *    - Click "Deploy" -> "New deployment"
 *    - Select type: "Web app"
 *    - Execute as: "Me (your-email)"
 *    - Who has access: "Anyone"
 * 6. Copy the URL of the deployed web app and paste it into your frontend's `.env` file as `VITE_API_BASE_URL`.
 */

function doGet(e) {
  // If run manually from editor, 'e' is undefined
  if (!e || !e.parameter) {
    return ContentService.createTextOutput(
      "Script is running, but it expects a web request."
    );
  }

  const action = e.parameter.action;
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 🚀 High-speed combined fetch
  if (action === "getAllData") {
    return createJsonResponse({
      spreadsheetName: ss.getName(),
      spreadsheetId: ss.getId(),
      sheetNames: ss.getSheets().map(s => s.getName()),
      instructors: getSheetData(ss, "Instructors"),
      courses: getSheetData(ss, "Courses"),
      catalog: getSheetData(ss, "CourseCatalog"),
      testimonials: getSheetData(ss, "Testimonials"),
      results: getSheetData(ss, "Results")
    });
  }

  // 🔁 Individual fallback endpoints
  if (action === "getInstructors") {
    return createJsonResponse(getSheetData(ss, "Instructors"));
  } else if (action === "getCourses") {
    return createJsonResponse(getSheetData(ss, "Courses"));
  } else if (action === "getCourseCatalog") {
    return createJsonResponse(getSheetData(ss, "CourseCatalog"));
  } else if (action === "getTestimonials") {
    return createJsonResponse(getSheetData(ss, "Testimonials"));
  } else if (action === "getResults") {
    return createJsonResponse(getSheetData(ss, "Results"));
  }

  return createJsonResponse({ error: "Invalid action" });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ error: "No data received" });
    }

    let body;

    try {
      body = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return createJsonResponse({ error: "Invalid JSON format" });
    }

    if (body.action === "sendContactEmail") {
      const { name, phone, email, query } = body;

      if (!name || !email || !query) {
        return createJsonResponse({ error: "Missing required fields" });
      }

      MailApp.sendEmail({
        to: "aihe@iskconujjain.com",
        subject: "AIHE Website Enquiry from " + name,
        htmlBody:
          "<h3>New Enquiry</h3>" +
          "<p><b>Name:</b> " + name + "</p>" +
          "<p><b>Phone:</b> " + phone + "</p>" +
          "<p><b>Email:</b> " + email + "</p>" +
          "<p><b>Query:</b><br>" + query + "</p>",
        replyTo: email,
      });

      logContactSubmission(name, phone, email, query);

      return createJsonResponse({ success: true });
    }

    return createJsonResponse({ error: "Invalid action" });
  } catch (err) {
    console.error("doPost Error: " + err.message);
    return createJsonResponse({ error: err.message });
  }
}

// ─── MANUAL EMAIL TEST ───
function manualTestEmail() {
  Logger.log("Testing email...");
  MailApp.sendEmail({
    to: "aihe@iskconujjain.com",
    subject: "Manual Test from Script Editor",
    htmlBody:
      "<p>If you get this, your email permissions are set correctly!</p>",
  });
  Logger.log("Email sent! Check your inbox.");
}

// ─── GENERIC SHEET FETCHER ───
function getSheetData(ss, sheetName) {
  let sheet = ss.getSheetByName(sheetName);
  
  // Case-insensitive fallback search
  if (!sheet) {
    const sheets = ss.getSheets();
    const targetLower = sheetName.toLowerCase().trim();
    for (let i = 0; i < sheets.length; i++) {
      if (sheets[i].getName().toLowerCase().trim() === targetLower) {
        sheet = sheets[i];
        break;
      }
    }
  }

  // Fallback for catalog/CourseCatalog aliases
  if (!sheet) {
    const targetLower = sheetName.toLowerCase().trim();
    if (targetLower === "catalog" || targetLower === "coursecatalog") {
      const sheets = ss.getSheets();
      for (let i = 0; i < sheets.length; i++) {
        const name = sheets[i].getName().toLowerCase().trim();
        if (name === "catalog" || name === "coursecatalog") {
          sheet = sheets[i];
          break;
        }
      }
    }
  }

  if (!sheet) return [];

  const values = sheet.getDataRange().getValues();
  if (values.length === 0) return [];

  const headers = values[0];
  const data = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const item = {};

    headers.forEach((header, index) => {
      let value = row[index];

      // Special handling for comma-separated fields
      if (header === "teaches" && typeof value === "string") {
        value = value.split(",").map((t) => t.trim());
      }

      item[header] = value;
    });

    data.push(item);
  }

  return data;
}


// ─── JSON RESPONSE HELPER ───
function createJsonResponse(data) {
  return ContentService.createTextOutput(
    JSON.stringify({ data: data })
  ).setMimeType(ContentService.MimeType.JSON);
}

// ─── LOG CONTACT FORM ───
function logContactSubmission(name, phone, email, query) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("ContactSubmissions");

  if (!sheet) {
    sheet = ss.insertSheet("ContactSubmissions");
    sheet.appendRow(["Timestamp", "Name", "Phone", "Email", "Query"]);
  }

  sheet.appendRow([new Date(), name, phone, email, query]);
}
