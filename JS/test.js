/* =================================
   Google Apps Script API URL
================================= */

const API_URL = "https://script.google.com/macros/s/AKfycbx1e8YY_xrSaWeWV3yL5dsyd4sf165ws8DRlYmh8F7l8XScadq1CTv4jPCPTOUEQWxm/exec";


/* =================================
   Get HTML Elements
================================= */

const salesForm = document.getElementById("salesForm");


const customerNameInput = document.getElementById("customerName");

const phoneInput = document.getElementById("phone");

const addressInput = document.getElementById("address");

const branchInput = document.getElementById("branch");

const submitButton = document.getElementById("submitButton");

const messageBox = document.getElementById("message");


/* =================================
   Read Battery ID from QR URL
================================= */

/*
   Example QR URL:

   https://yourwebsite.netlify.app/?battery_id=BAT-000001
*/

const urlParameters = new URLSearchParams(
    window.location.search
);

const batteryIdFromUrl = urlParameters.get("battery_id");


/*
   Automatically fill Battery ID
   when it is available in the URL.
*/

const batteryIdInput = document.getElementById("batteryId");

const urlParameters = new URLSearchParams(
    window.location.search
);

const batteryIdFromUrl = urlParameters.get("battery_id");

if (batteryIdFromUrl) {
    batteryIdInput.value = batteryIdFromUrl;
}

if (batteryIdFromUrl) {

    batteryIdInput.value = batteryIdFromUrl;

}


/* =================================
   Display Message
================================= */

function showMessage(message, type) {

    messageBox.textContent = message;

    messageBox.className = `message ${type}`;

}


/* =================================
   Hide Message
================================= */

function hideMessage() {

    messageBox.textContent = "";

    messageBox.className = "message hidden";

}


/* =================================
   Handle Form Submission
================================= */

salesForm.addEventListener("submit", async function (event) {

    /*
       Prevent normal browser form submission.
    */

    event.preventDefault();


    hideMessage();


    /*
       Read and clean form values.
    */

    const batteryId = batteryIdInput.value.trim();

    const customerName = customerNameInput.value.trim();

    const phone = phoneInput.value.trim();

    const address = addressInput.value.trim();

    const branch = branchInput.value;


    /*
       Validate required fields.
    */

    if (
        !batteryId ||
        !customerName ||
        !phone ||
        !address ||
        !branch
    ) {

        showMessage(
            "Please complete all required fields.",
            "error"
        );

        return;

    }


    /*
       Disable button during submission.
    */

    submitButton.disabled = true;

    submitButton.textContent = "Submitting...";


    /*
       Data format must match
       the Google Apps Script backend.
    */

    const requestData = {

        battery_id: batteryId,

        customer_name: customerName,

        phone: phone,

        address: address,

        branch: branch

    };


    try {

        /*
           Send data to Google Apps Script.
        */

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type": "text/plain;charset=utf-8"

            },

            body: JSON.stringify(requestData)

        });


        /*
           Read backend response.
        */

        const result = await response.json();


        /*
           Check whether backend succeeded.
        */

        if (result.success) {

            showMessage(
                "Battery sale registered successfully!",
                "success"
            );


            /*
               Clear customer fields after success.
            */

            customerNameInput.value = "";

            phoneInput.value = "";

            addressInput.value = "";

            branchInput.value = "";

        } else {

            showMessage(
                result.message || "Registration failed.",
                "error"
            );

        }


    } catch (error) {

        console.error("API Error:", error);

        showMessage(
            "Unable to connect to the server. Please try again.",
            "error"
        );

    } finally {

        /*
           Enable button again.
        */

        submitButton.disabled = false;

        submitButton.textContent = "Register Sale";

    }

});