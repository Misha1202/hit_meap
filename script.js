document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('converterForm');
  const fileInput = document.getElementById('fileInput');
  const fileDropArea = document.querySelector('.file-drop-area');
  const statusDiv = document.getElementById('status');

  // Обработка drag and drop
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    fileDropArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    fileDropArea.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    fileDropArea.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
    fileDropArea.classList.add('highlight');
  }

  function unhighlight() {
    fileDropArea.classList.remove('highlight');
  }

  fileDropArea.addEventListener('drop', handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    fileInput.files = files;
    updateFileDisplay(files[0]);
  }

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
      updateFileDisplay(fileInput.files[0]);
    }
  });

  function updateFileDisplay(file) {
    const fileDropText = document.querySelector('.file-drop-text p');
    fileDropText.textContent = `Selected: ${file.name} (${formatFileSize(file.size)})`;
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Обработка формы
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const file = fileInput.files[0];
    const targetFormat = document.getElementById('targetFormat').value;
    
    if (!file || !targetFormat) {
      alert('Please select a file and target format');
      return;
    }

    // Показываем статус загрузки
    statusDiv.classList.remove('hidden');
    form.classList.add('hidden');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', targetFormat);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      // Скрываем статус и показываем форму снова
      statusDiv.classList.add('hidden');
      form.classList.remove('hidden');

      // Браузер автоматически обработает скачивание файла
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during conversion. Please try again.');
      statusDiv.classList.add('hidden');
      form.classList.remove('hidden');
    }
  });
});