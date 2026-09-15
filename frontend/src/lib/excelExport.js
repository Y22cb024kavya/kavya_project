import * as XLSX from "xlsx";

/**
 * Format timestamp into readable IST string
 */
export function formatISTDate(rawDate) {
  if (!rawDate) return "N/A";
  try {
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return String(rawDate);
    return d.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  } catch {
    return String(rawDate);
  }
}

/**
 * Prepare formatted rows for Excel/CSV export
 */
export function prepareEnquiryRows(enquiries = []) {
  return enquiries.map((item, index) => {
    const firstName = item.first_name || item.name || "";
    const lastName = item.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim() || "Anonymous";

    return {
      "S.No": index + 1,
      "Date & Time": formatISTDate(item.timestamp || item.$createdAt || item.created_at),
      "Full Name": fullName,
      "Email Address": item.email || "N/A",
      "Phone Number": item.phone || "N/A",
      "Programme / Interest": item.program || item.programme || "General Enquiry",
      "City / Location": item.city || "N/A",
      "Message": item.message || item.comments || "N/A",
    };
  });
}

/**
 * Export Contact Us data to a genuine Microsoft Excel (.xlsx) file
 */
export function exportToExcel(enquiries = [], fileNamePrefix = "voktaa-contact-us-data") {
  const formattedRows = prepareEnquiryRows(enquiries);
  if (!formattedRows.length) return;

  // Create worksheet from JSON data
  const worksheet = XLSX.utils.json_to_sheet(formattedRows);

  // Set optimal column widths for Excel formatting
  worksheet["!cols"] = [
    { wch: 8 },  // S.No
    { wch: 24 }, // Date & Time
    { wch: 25 }, // Full Name
    { wch: 30 }, // Email Address
    { wch: 18 }, // Phone Number
    { wch: 32 }, // Programme / Interest
    { wch: 20 }, // City / Location
    { wch: 55 }, // Message
  ];

  // Create workbook and append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Contact Us Submissions");

  // Generate file name with current date
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `${fileNamePrefix}-${dateStr}.xlsx`;

  // Trigger download
  XLSX.writeFile(workbook, fileName);
}

/**
 * Fallback Export to CSV format with UTF-8 BOM for Excel compatibility
 */
export function exportToCSV(enquiries = [], fileNamePrefix = "voktaa-contact-us-data") {
  const formattedRows = prepareEnquiryRows(enquiries);
  if (!formattedRows.length) return;

  const cols = Object.keys(formattedRows[0]);
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  
  const csvContent = [
    cols.map(esc).join(","),
    ...formattedRows.map((r) => cols.map((c) => esc(r[c])).join(","))
  ].join("\n");

  // Prepend UTF-8 BOM so Excel opens Telugu / special characters properly
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const dateStr = new Date().toISOString().slice(0, 10);
  a.download = `${fileNamePrefix}-${dateStr}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
