/**
 * Upload Area - Drag and Drop File Upload
 * Handles file selection, drag-and-drop, and file preview
 */
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('archivo');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileRemove = document.getElementById('fileRemove');
    
    if (!uploadArea || !fileInput) return;
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    // Handle dropped files
    uploadArea.addEventListener('drop', handleDrop, false);
    
    // Handle file selection via click
    fileInput.addEventListener('change', handleFileSelect, false);
    
    // Handle remove button
    if (fileRemove) {
        fileRemove.addEventListener('click', removeFile, false);
    }
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight(e) {
        uploadArea.classList.add('drag-over');
    }
    
    function unhighlight(e) {
        uploadArea.classList.remove('drag-over');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            handleFiles(files);
        }
    }
    
    function handleFileSelect(e) {
        const files = e.target.files;
        
        if (files.length > 0) {
            handleFiles(files);
        }
    }
    
    function handleFiles(files) {
        const file = files[0];
        
        if (file) {
            // Display file info
            displayFileInfo(file);
            
            // Add visual feedback
            uploadArea.classList.add('has-file');
        }
    }
    
    function displayFileInfo(file) {
        fileName.textContent = file.name;
        fileInfo.style.display = 'flex';
    }
    
    function removeFile(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Clear file input
        fileInput.value = '';
        
        // Hide file info
        fileInfo.style.display = 'none';
        fileName.textContent = '';
        
        // Remove visual feedback
        uploadArea.classList.remove('has-file');
    }
});