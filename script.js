Array.prototype.forEach.call(
    document.querySelectorAll(".file-upload__button"),
    function(button) {
        const hiddenInput = button.parentElement.querySelector(
            ".file-upload__input"
        );
        const label = button.parentElement.querySelector(".file-upload__label");
        const defaultLabelText = "No file(s) selected";

        // Set default text for label
        label.textContent = defaultLabelText;
        label.title = defaultLabelText;

        button.addEventListener("click", function() {
            hiddenInput.click();
        });

        hiddenInput.addEventListener("change", function() {
            const filenameList = Array.prototype.map.call(hiddenInput.files, function(
                file
            ) {
                return file.name;
            });

            label.textContent = filenameList.join(", ") || defaultLabelText;
            label.title = label.textContent;
        });
    }
);

const upload_button = document.getElementById("uploade-file");
const options = {
    method: "POST",
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json'
    },
};
upload_button.addEventListener("click", async function() {
    let result = await fetch('http://127.0.0.1:8081/upload', options)
        .then(function(response) {
            return response.text();
        })
        .catch(err => console.log('Request Failed', err));
    console.log(result);
    let label = document.getElementById("status");
    label.textContent = result;
});








// const hiddenInput = document.getElementById("file-input");
// const label = document.getElementsByClassName("file-upload");

// hiddenInput.addEventListener("change", function() {
//     var tmp = document.createElement("span");
//     const filenameList = Array.prototype.map.call(hiddenInput.files, function(file) {
//         console.log(file);
//         return file.name;
//     });
//     tmp.textContent = filenameList;
//     console.log(tmp.textContent);
//     label.appendChild(tmp);
//     // label.textContent = filenameList.join(", ") || defaultLabelText;
//     // label.title = label.textContent;
// });