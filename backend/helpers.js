import path from 'path';

function extractTitle(file) {
    // Example: Extract the title from the file name
    // Assuming a format like "Title - Author (Year).pdf"
    const match = file.match(/^(.*?) -/);
    return match ? match[1] : file; // Return the part before the first " - "
  }
  
  function extractAuthor(file) {
    // Example: Extract the author from the file name
    // Assuming a format like "Title - Author (Year).pdf"
    const match = file.match(/- (.*?) \(/);
    return match ? match[1] : ''; // Return the part between " - " and " ("
  }
  
  function extractISBN(file) {
    // Example: Extract ISBN (if present) from the file name
    // Assuming ISBN is in the format "ISBN 978-xxxxxxxxxxx"
    const match = file.match(/ISBN\s(\d{13})/);
    return match ? match[1] : ''; // Return the first 13-digit ISBN found
  }
  
  function extractYearReleased(file) {
    // Example: Extract year from the file name (assuming format "Title - Author (Year).pdf")
    const match = file.match(/\((\d{4})\)/);
    return match ? parseInt(match[1]) : null; // Return the year inside parentheses
  }

  function extractFormat(file) {
    // Extract file extension using path.extname
    const fileExtension = path.extname(file);  // This will return something like '.pdf'
    
    // You can return or process the file extension as needed
    return fileExtension;
  }

  export {extractTitle, extractAuthor, extractISBN, extractYearReleased, extractFormat};