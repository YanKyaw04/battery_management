/* =========================================
   BATTERY SALES WEBSITE
========================================= */


/* =========================================
   API URL
========================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbx1e8YY_xrSaWeWV3yL5dsyd4sf165ws8DRlYmh8F7l8XScadq1CTv4jPCPTOUEQWxm/exec";


/* =========================================
   GET HTML ELEMENTS
========================================= */

const batteryIdInput =
    document.getElementById("batteryId");

const batteryStatus =
    document.getElementById("batteryStatus");

const salesForm =
    document.getElementById("salesForm");

const submitButton =
    document.getElementById("submitButton");

const messageBox =
    document.getElementById("message");


/* =========================================
   GET BATTERY ID FROM QR URL
========================================= */

const urlParameters =
    new URLSearchParams(
        window.location.search
    );


const batteryId =
    urlParameters.get("battery_id");


/* =========================================
   CHECK BATTERY
========================================= */

async function checkBattery() {

    if (!batteryId) {

        batteryIdInput.value = "";

        batteryStatus.textContent =
            "No battery ID found. Please scan a valid QR code.";

        batteryStatus.style.color =
            "#b91c1c";

        showMessage(
            "Please scan a valid battery QR code.",
            "error"
        );

        disableForm();

        return;
    }


    batteryIdInput.value =
        batteryId;


    batteryStatus.textContent =
        "Checking battery...";

    batteryStatus.style.color =
        "#64748b";


    showMessage(
        "Checking battery availability...",
        "success"
    );


    disableForm();


    try {

        const apiUrl =
            API_URL +
            "?battery_id=" +
            encodeURIComponent(
                batteryId
            );


        console.log(
            "Checking battery:",
            apiUrl
        );


        const response =
            await fetch(apiUrl);


        if (!response.ok) {

            throw new Error(
                "Battery check request failed"
            );

        }


        const result =
            await response.json();


        console.log(
            "Battery response:",
            result
        );


        /* =========================================
           BATTERY AVAILABLE
        ========================================= */

        if (
            result.success === true &&
            result.available === true
        ) {

            batteryStatus.textContent =
                "✓ Battery is available for sale.";

            batteryStatus.style.color =
                "#047857";


            showMessage(
                "Battery verified successfully.",
                "success"
            );


            enableForm();

            return;
        }


        /* =========================================
           BATTERY NOT AVAILABLE
        ========================================= */

        batteryStatus.textContent =
            "✕ Battery is not available for sale.";

        batteryStatus.style.color =
            "#b91c1c";


        showMessage(
            result.message ||
            "This battery is not available for sale.",
            "error"
        );


        disableForm();


    } catch (error) {

        console.error(
            "Battery check error:",
            error
        );


        batteryStatus.textContent =
            "Unable to check battery.";

        batteryStatus.style.color =
            "#b91c1c";


        showMessage(
            "Unable to connect to the battery system. Please try again.",
            "error"
        );


        disableForm();

    }

}


/* =========================================
   ENABLE FORM
========================================= */

function enableForm() {

    const formInputs =
        salesForm.querySelectorAll(
            "input, textarea, select, button"
        );


    formInputs.forEach(
        function (element) {

            if (
                element.id !== "batteryId"
            ) {

                element.disabled =
                    false;

            }

        }
    );

}


/* =========================================
   DISABLE FORM
========================================= */

function disableForm() {

    const formInputs =
        salesForm.querySelectorAll(
            "input, textarea, select, button"
        );


    formInputs.forEach(
        function (element) {

            if (
                element.id !== "batteryId"
            ) {

                element.disabled =
                    true;

            }

        }
    );

}


/* =========================================
   SHOW MESSAGE
========================================= */

function showMessage(
    message,
    type
) {

    messageBox.textContent =
        message;


    messageBox.className =
        `message ${type}`;

}


/* =========================================
   SUBMIT SALE
========================================= */

salesForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        /* =========================================
           DISABLE BUTTON
        ========================================= */

        submitButton.disabled =
            true;


        submitButton.textContent =
            "Registering Sale...";


        showMessage(
            "Saving customer information...",
            "success"
        );


        try {

            /* =========================================
               GET CUSTOMER DATA
            ========================================= */

            const customerName =
                document.getElementById(
                    "customerName"
                ).value.trim();


            const phone =
                document.getElementById(
                    "phone"
                ).value.trim();


            const address =
                document.getElementById(
                    "address"
                ).value.trim();


            const branch =
                document.getElementById(
                    "branch"
                ).value;


            /* =========================================
               CREATE SALE DATA
            ========================================= */

            const saleData = {

                battery_id:
                    batteryId,

                customer_name:
                    customerName,

                phone:
                    phone,

                address:
                    address,

                branch:
                    branch

            };


            console.log(
                "Submitting sale:",
                saleData
            );


            /* =========================================
               SEND TO GOOGLE APPS SCRIPT
            =========================================

               text/plain is intentional.

               It avoids a browser CORS preflight
               problem with Google Apps Script.
            */

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "text/plain;charset=utf-8"
                        },

                        body:
                            JSON.stringify(
                                saleData
                            )
                    }
                );


            /* =========================================
               CHECK RESPONSE
            ========================================= */

            if (!response.ok) {

                throw new Error(
                    "Sale request failed"
                );

            }


            const result =
                await response.json();


            console.log(
                "Sale response:",
                result
            );


            /* =========================================
               SALE SUCCESS
            ========================================= */

            if (
                result.success === true
            ) {

                batteryStatus.textContent =
                    "✓ Battery sale completed.";

                batteryStatus.style.color =
                    "#047857";


                showMessage(
                    "✓ Sale registered successfully!",
                    "success"
                );


                /* -----------------------------------------
                   Disable form after successful sale
                ----------------------------------------- */

                disableForm();


                submitButton.textContent =
                    "Sale Completed";


                return;

            }


            /* =========================================
               SALE FAILED
            ========================================= */

            showMessage(
                result.message ||
                "Unable to register the sale.",
                "error"
            );


            submitButton.disabled =
                false;


            submitButton.textContent =
                "Register Sale";


        } catch (error) {

            console.error(
                "Sale submission error:",
                error
            );


            showMessage(
                "Unable to register the sale. Please try again.",
                "error"
            );


            submitButton.disabled =
                false;


            submitButton.textContent =
                "Register Sale";

        }

    }
);


/* =========================================
   START
========================================= */

checkBattery();