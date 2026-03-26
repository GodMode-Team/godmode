// Shared file icon and type label utilities used by grouped-render and tool-cards.

/** File extension to emoji icon mapping. */
export const FILE_ICONS: Record<string, string> = {
  // Documents
  pdf: "\u{1F4D5}",
  doc: "\u{1F4D8}",
  docx: "\u{1F4D8}",
  txt: "\u{1F4C4}",
  rtf: "\u{1F4C4}",
  // Spreadsheets
  xls: "\u{1F4D7}",
  xlsx: "\u{1F4D7}",
  csv: "\u{1F4CA}",
  // Presentations
  ppt: "\u{1F4D9}",
  pptx: "\u{1F4D9}",
  // Images
  jpg: "\u{1F5BC}\uFE0F",
  jpeg: "\u{1F5BC}\uFE0F",
  png: "\u{1F5BC}\uFE0F",
  gif: "\u{1F5BC}\uFE0F",
  webp: "\u{1F5BC}\uFE0F",
  svg: "\u{1F5BC}\uFE0F",
  // Audio
  mp3: "\u{1F3B5}",
  wav: "\u{1F3B5}",
  m4a: "\u{1F3B5}",
  // Video
  mp4: "\u{1F3AC}",
  mov: "\u{1F3AC}",
  avi: "\u{1F3AC}",
  // Archives
  zip: "\u{1F4E6}",
  rar: "\u{1F4E6}",
  "7z": "\u{1F4E6}",
  tar: "\u{1F4E6}",
  gz: "\u{1F4E6}",
  // Code
  js: "\u{1F4DC}",
  ts: "\u{1F4DC}",
  py: "\u{1F4DC}",
  json: "\u{1F4DC}",
  html: "\u{1F4DC}",
  css: "\u{1F4DC}",
  md: "\u{1F4DC}",
  // Default
  default: "\u{1F4CE}",
};

export function getFileIcon(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  return FILE_ICONS[ext] ?? FILE_ICONS.default;
}

export function getFileTypeLabel(mimeType: string, fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";

  const typeLabels: Record<string, string> = {
    pdf: "PDF Document",
    doc: "Word Document",
    docx: "Word Document",
    xls: "Excel Spreadsheet",
    xlsx: "Excel Spreadsheet",
    csv: "CSV File",
    ppt: "PowerPoint",
    pptx: "PowerPoint",
    txt: "Text File",
    md: "Markdown",
    json: "JSON File",
    zip: "ZIP Archive",
    png: "PNG Image",
    jpg: "JPEG Image",
    jpeg: "JPEG Image",
    gif: "GIF Image",
    mp3: "Audio File",
    mp4: "Video File",
    html: "HTML Document",
    css: "Stylesheet",
    js: "JavaScript",
    ts: "TypeScript",
    py: "Python",
  };

  return typeLabels[ext] || mimeType.split("/")[1]?.toUpperCase() || "File";
}
