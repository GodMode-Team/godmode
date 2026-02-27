/**
 * Upload constants and helpers for file validation
 *
 * PRACTICAL LIMITS FOR DRAG-AND-DROP:
 * Upload is best for screenshots, PDFs, and small documents.
 * For larger files (videos, large images), use file path instead:
 *   "Check out the file at ~/Downloads/video.mp4"
 */

// Per-file size limit - practical for WebSocket + base64 overhead
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB per file

// Total size limit per message
export const MAX_TOTAL_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB total per upload

// Maximum files per upload batch
export const MAX_FILES_PER_UPLOAD = 20;

/**
 * Format bytes as human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Validation result for a single file
 */
export type FileValidationResult = {
  file: File;
  valid: boolean;
  error?: string;
};

/**
 * Validate a list of files before processing
 * Returns valid files and any validation errors
 */
export function validateFilesForUpload(
  files: FileList | File[],
  existingTotalSize = 0,
): { validFiles: File[]; errors: string[] } {
  const validFiles: File[] = [];
  const errors: string[] = [];
  let totalSize = existingTotalSize;

  const fileArray = Array.from(files);

  for (const file of fileArray) {
    // Check file count
    if (validFiles.length >= MAX_FILES_PER_UPLOAD) {
      errors.push(`Maximum ${MAX_FILES_PER_UPLOAD} files allowed per upload`);
      break;
    }

    // Check individual file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      errors.push(
        `"${file.name}" is too large (${formatFileSize(file.size)}). Max ${formatFileSize(MAX_FILE_SIZE_BYTES)}. For larger files, tell Atlas the file path instead.`,
      );
      continue;
    }

    // Check total size
    if (totalSize + file.size > MAX_TOTAL_SIZE_BYTES) {
      errors.push(`Total upload size exceeds ${formatFileSize(MAX_TOTAL_SIZE_BYTES)} limit`);
      break;
    }

    totalSize += file.size;
    validFiles.push(file);
  }

  return { validFiles, errors };
}
