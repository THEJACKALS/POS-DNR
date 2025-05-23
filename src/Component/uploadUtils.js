export function uploadJSONFile(onDataLoaded) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';

  input.onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        onDataLoaded(json);
      } catch (error) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  input.click();
}
