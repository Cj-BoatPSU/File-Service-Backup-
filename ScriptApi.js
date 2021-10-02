const upload_button = document.getElementById("uploade-file");
const options = {
    method: "POST",
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
};

upload_button.addEventListener("click", async function() {
    let result = await fetch('http://localhost:3001/uploadmultiple', options)
        .then(function(response) {
            return response.text();
        })
        .catch(err => console.log('Request Failed', err));
    console.log(result);
    // let label = document.getElementById("status");
    // label.textContent = result;
});