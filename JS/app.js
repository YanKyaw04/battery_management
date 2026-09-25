/* =========================================
   BATTERY SALES WEBSITE
   =========================================

   QR Code example:

   https://your-site.netlify.app/?battery_id=BAT-000001

   JavaScript reads:

   battery_id = BAT-000001

   and puts it into the read-only
   Battery ID field.
========================================= */


/* =========================================
   GET HTML ELEMENTS
========================================= */

const batteryIdInput =
    document.getElementById("batteryId");

const batteryStatus =
    document.getElementById("batteryStatus");

const salesForm =
    document.getElementById("salesForm");

const customerNameInput =
    document.getElementById("customerName");

const phoneInput =
    document.getElementById("phone");

const addressInput =
    document.getElementById("address");

const branchInput =
    document.getElementById("branch");

const submitButton =
    document.getElementById("submitButton");

const messageBox =
    document.getElementById("message");


/* =========================================
   READ URL
========================================= */

/*
   Example:

   https://your-site.netlify.app/?battery_id=BAT-000001

   window.location.search gives:

   ?battery_id=BAT-000001
*/

const urlParameters =
    new URLSearchParams(
        window.location.search
    );


/* =========================================
   GET BATTERY ID
========================================= */

const batteryId =
    urlParameters.get("battery_id");


/* =========================================
   CHECK BATTERY ID
========================================= */

if (batteryId) {

    /*
       Battery ID was found in the URL.
    */

    batteryIdInput.value =
        batteryId;

    batteryStatus.textContent =
        "Battery detected successfully.";

    batteryStatus.style.color =
        "#047857";

} else {

    /*
       No Battery ID was found.
    */

    batteryIdInput.value = "";

    batteryStatus.textContent =
        "No battery ID found. Please scan a valid QR code.";

    batteryStatus.style.color =
        "#b91c1c";

}


/* =========================================
   SHOW MESSAGE
========================================= */

function showMessage(message, type) {

    messageBox.textContent =
        message;

    messageBox.className =
        `message ${type} `;
}


/* =========================================
   FORM SUBMISSION
========================================= */

salesForm.addEventListener(
    "submit",
    function (event) {

        /*
           Stop normal browser submission.
        */

        event.preventDefault();


        /* -----------------------------
           Validate Battery ID
        ----------------------------- */

        if (!batteryId) {

            showMessage(
                "Battery ID is missing. Please scan the battery QR code.",
                "error"
            );

            return;
        }


        /* -----------------------------
           Get Form Values
        ----------------------------- */

        const customerName =
            customerNameInput.value.trim();

        const phone =
            phoneInput.value.trim();

        const address =
            addressInput.value.trim();

        const branch =
            branchInput.value;


        /* -----------------------------
           Validate Form
        ----------------------------- */

        if (
            !customerName ||
            !phone ||
            !address ||
            !branch
        ) {

            showMessage(
                "Please complete all customer information.",
                "error"
            );

            return;
        }


        /* -----------------------------
           Temporary Success
           -----------------------------

           We are NOT connecting
           Google Apps Script yet.

           First we test:

           QR → Battery ID → Form
        */

        showMessage(
            `Battery ${batteryId} is ready for registration.`,
            "success"
        );


        console.log(
            "Battery ID:",
            batteryId
        );

        console.log(
            "Customer Name:",
            customerName
        );

        console.log(
            "Phone:",
            phone
        );

        console.log(
            "Address:",
            address
        );

        console.log(
            "Branch:",
            branch
        );

    }
);
