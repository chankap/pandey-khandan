function updateImage(member) {
  const fileInput = document.getElementById(`${member}Pic`);
  const image = document.getElementById(`${member}Image`);
  const nameSpan = document.getElementById(`${member}Name`);

  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imageURL = e.target.result;
      let img = image || document.createElement('img');
      img.src = imageURL;
      img.id = `${member}Image`;
      document.querySelector(`#${member} .circle`).innerHTML = '';
      document.querySelector(`#${member} .circle`).appendChild(img);
      nameSpan.style.display = 'none'; 
    }
    reader.readAsDataURL(file);
  } else {
    document.querySelector(`#${member} .circle`).innerHTML = `<span id="${member}Name">${capitalizeFirstLetter(member)} Name</span>`;
  }
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
