document.addEventListener("DOMContentLoaded", function () {
  initializeEvents();

  var imageError = document.getElementById("imageError");
  var uploadBtn = document.getElementById("upload-btn");
  var photoInput = document.getElementById("photo");
  var selectedFileName = document.getElementById("selectedFileName");
  var submitFormBtn = document.getElementById("submitForm");
  var selectedImageFile;

  imageError.style.display = "none";

  uploadBtn.addEventListener("click", function () {
    photoInput.click();
  });

  photoInput.addEventListener("change", function () {
    selectedImageFile = this.files[0];
    const MAX_IMAGE_SIZE = 7000000;
    if (selectedImageFile) {
      const fileName = selectedImageFile.name;
      const fileExtension = fileName.split(".").pop().toLowerCase();
      const allowedExtension = ["jpeg", "png", "jpg"];
      if (!allowedExtension.includes(fileExtension)) {
        errorToast("Please upload .jpg, .jpeg or .png files");
        imageError.style.display = "block";
        return;
      }
    }
    if (selectedImageFile.size > MAX_IMAGE_SIZE) {
      errorToast("Image is too large.");
      imageError.style.display = "block";
      return;
    }
    imageError.style.display = "none";
    selectedFileName.textContent = "Selected File: " + selectedImageFile.name;
    selectedFileName.style.display = "block";
  });

  submitFormBtn.addEventListener("click", function (e) {
    e.preventDefault();
    submitForm();
  });
});

function sendFormData(imgUrl) {
  var data = {};
  var inputs = document.querySelectorAll("#myForm :input");
  inputs.forEach(function (element) {
    var fieldName = element.getAttribute("name");
    if (fieldName && element.getAttribute("type") !== "file") {
      var fieldValue = element.value;
      data[fieldName] = fieldValue;
    }
  });
  data["photo"] = imgUrl;
  var jsonData = JSON.stringify(data);
  console.log(jsonData);
  // try {
  //   fetch(
  //     "https://nkeikn6bo6.execute-api.us-east-2.amazonaws.com/Prod/signup?form_version=new",
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: jsonData,
  //     }
  //   )
  //     .then(function (response) {
  //       if (response.ok) {
  // successToast(
  //           "Thank you for registering with Andinow. We will contact you shortly."
  //         );
  //         console.log("Data sent successfully:", response);
  //       } else {
  //         console.error("Error sending data:", response.statusText);
  //       }
  //     })
  //     .catch(function (error) {
  //       console.error("An error occurred during the fetch request:", error);
  //     });
  // } catch (err) {
  //   console.error("An error occurred:", err);
  // }
  // console.log(jsonData);
}

async function imageToBlob(imageFile) {
  let binary = await new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    // console.log(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(imageFile);
  });
  binary = atob(binary.split(",")[1]);

  let array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  let blobData = new Blob([new Uint8Array(array)], { type: imageFile.type });

  return blobData;
}
let response;
async function uploadImage(imageFile) {
  if (!imageFile) {
    console.error("No image file provided.");
    return;
  }
  try {
    const API_ENDPOINT =
      "https://alngrb7b8l.execute-api.us-east-2.amazonaws.com/uploads";
    response = await fetch(API_ENDPOINT);
    console.log(response);
    if (response.ok) {
      const data = await response.json();
      // await sendFormData(data.uploadURL.split("?")[0]);
      // console.log(data.uploadURL.split("?")[0]);
      console.log(data.uploadURL.split("?")[0]);
    } else {
      console.error("Failed to get presigned URL:", response.statusText);
    }

    let blobData = await imageToBlob(imageFile);

    const result = await fetch(
      "https://alngrb7b8l.execute-api.us-east-2.amazonaws.com/uploads",
      {
        method: "PUT",
        body: blobData,
      }
    );
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
}

async function submitForm() {
  if (!validateForm()) {
    console.log("returned");
    return;
  }
  if (!validateImage()) {
    console.log("returned");
    return;
  }
  if (!validateRecaptcha()) {
    console.log("returned");
    return;
  }
  //
  let selectedImage = document.querySelector("#photo").files[0];
  console.log(selectedImage);

  // image upload function
  uploadImage(selectedImage);

  //Send Form Data
  // sendFormData(data.uploadUrl)
}

function validateForm() {
  let emptyField = null;
  let requiredInputs = document.querySelectorAll("#myForm input[required]");
  requiredInputs.forEach(function (element) {
    if (element.value === "") {
      emptyField = element;
      return false;
    }
  });

  if (emptyField) {
    emptyField.focus();
    return false;
  }

  return true;
}
function validateImage() {
  let selectedImageFile = document.querySelector("#photo").files[0];
  const MAX_IMAGE_SIZE = 7000000;
  if (selectedImageFile) {
    const fileName = selectedImageFile.name;
    const fileExtension = fileName.split(".").pop().toLowerCase();
    const allowedExtension = ["jpeg", "png", "jpg"];
    if (!allowedExtension.includes(fileExtension)) {
      errorToast("Please upload .jpg, .jpeg or .png files");
      imageError.style.display = "block";
      return false;
    } else if (selectedImageFile.size > MAX_IMAGE_SIZE) {
      errorToast("Image is too large.");
      imageError.style.display = "block";
      return false;
    }
    imageError.style.display = "none";
    selectedFileName.textContent = "Selected File: " + selectedImageFile.name;
    selectedFileName.style.display = "block";
    return true;
  } else {
    imageError.style.display = "block";
    return false;
  }
}
function validateRecaptcha() {
  // console.log("Validation Started");
  let response = grecaptcha.getResponse();
  // console.log(response);
  if (response.length == 0) {
    // errorToast("Please validate Recaptcha");
    document.querySelector(".g-recaptcha-error").style.display = "block";
    return false;
  } else {
    document.querySelector(".g-recaptcha-error").style.display = "none";
    return true;
  }
}
function initializeEvents() {
  var seeAnotherField = document.getElementById("seeAnotherField");
  var whatsappDiv = document.getElementById("whatsapp_div");
  var whatsappDiv2 = document.getElementById("whatsapp_div2");
  var usDiv = document.getElementById("us_div");
  var zipcodeDiv = document.getElementById("zipcode_div");
  var whatsappPhone = document.getElementById("whatsapp_phone");
  var userPhone = document.getElementById("user_phone");
  var zipcode = document.getElementById("zipcode");

  seeAnotherField.addEventListener("change", function () {
    if (this.value === "whatsapp") {
      whatsappDiv.style.display = "block";
      whatsappDiv2.style.display = "block";
      usDiv.style.display = "none";
      zipcodeDiv.style.display = "none";
      whatsappPhone.setAttribute("required", "");
      whatsappPhone.setAttribute("data-error", "This field is required.");
      userPhone.removeAttribute("required");
      userPhone.removeAttribute("data-error");
      zipcode.removeAttribute("required");
    } else {
      whatsappDiv.style.display = "none";
      whatsappDiv2.style.display = "none";
      usDiv.style.display = "block";
      zipcodeDiv.style.display = "block";
      whatsappPhone.removeAttribute("required");
      whatsappPhone.removeAttribute("data-error");
      userPhone.setAttribute("required", "");
      userPhone.setAttribute("data-error", "This field is required.");
      zipcode.setAttribute("required", "");
    }
  });

  seeAnotherField.dispatchEvent(new Event("change"));
}

function successToast(message) {
  Toastify({
    text: message,
    duration: 3000,
  }).showToast();
}

function errorToast(message) {
  Toastify({
    text: message,
    duration: 3000,
    style: {
      background: "red",
    },
  }).showToast();
}

function infoToast(message) {
  Toastify({
    text: message,
    duration: 3000,
    style: {
      background: "orange",
    },
  }).showToast();
}
