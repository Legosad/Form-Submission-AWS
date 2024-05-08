document.addEventListener("DOMContentLoaded", function () {
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
});
document.addEventListener("DOMContentLoaded", function () {
  var imageError = document.getElementById("imageError");
  var myForm = document.getElementById("myForm");
  var uploadBtn = document.getElementById("upload-btn");
  var photoInput = document.getElementById("photo");
  var selectedFileName = document.getElementById("selectedFileName");
  var submitFormBtn = document.getElementById("submitForm");
  var selectedImageFile;

  imageError.style.display = "none";

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
    try {
      fetch(
        "https://nkeikn6bo6.execute-api.us-east-2.amazonaws.com/Prod/signup?form_version=new",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonData,
        }
      )
        .then(function (response) {
          if (response.ok) {
            alert(
              "Thank you for registering with Andinow. We will contact you shortly."
            );
            console.log("Data sent successfully:", response);
          } else {
            console.error("Error sending data:", response.statusText);
          }
        })
        .catch(function (error) {
          console.error("An error occurred during the fetch request:", error);
        });
    } catch (err) {
      console.error("An error occurred:", err);
    }
  }

  const API_ENDPOINT =
    "https://alngrb7b8l.execute-api.us-east-2.amazonaws.com/uploads";

  async function uploadImage(imageFile) {
    if (!imageFile) {
      console.error("No image file provided.");
      return;
    }
    try {
      const response = await fetch(API_ENDPOINT);
      if (response.ok) {
        const data = await response.json();
        await sendFormData(data.uploadURL.split("?")[0]);
      } else {
        console.error("Failed to get presigned URL:", response.statusText);
      }

      let binary = await new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(imageFile);
      });

      let blobData = new Blob(
        [
          new Uint8Array(
            atob(binary)
              .split("")
              .map((char) => char.charCodeAt(0))
          ),
        ],
        { type: "image/jpeg" }
      );

      const result = await fetch(response.data.uploadURL, {
        method: "PUT",
        body: blobData,
      });
    } catch (error) {
      console.error("An error occurred:", error);
      return null;
    }
  }

  uploadBtn.addEventListener("click", function () {
    photoInput.click();
  });

  photoInput.addEventListener("change", function () {
    selectedImageFile = this.files[0];
    const MAX_IMAGE_SIZE = 7000000;
    if (selectedImageFile && selectedImageFile.size > MAX_IMAGE_SIZE) {
      alert("Image is too large.");
      imageError.style.display = "block";
      return;
    }
    imageError.style.display = "none";
    selectedFileName.textContent = "Selected File: " + selectedImageFile.name;
    selectedFileName.style.display = "block";
  });

  myForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    let emptyField = null;
    var requiredInputs = this.querySelectorAll("[required]");
    requiredInputs.forEach(function (element) {
      if (element.value === "") {
        emptyField = element;
        return false;
      }
    });

    if (emptyField) {
      emptyField.focus();
      return;
    }

    if (selectedImageFile) {
      let imageUrl = await uploadImage(selectedImageFile);
      if (imageUrl) {
        console.log("Image uploaded successfully:", imageUrl);
        myForm.removeEventListener("submit");
        myForm.submit();
      }
    } else {
      imageError.style.display = "block";
      alert("Please select an image");
    }
  });

  submitFormBtn.addEventListener("click", function () {
    myForm.submit();
  });
});
