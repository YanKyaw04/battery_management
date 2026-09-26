import io
from pathlib import Path

import qrcode
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader


# =========================================
# SETTINGS
# =========================================

# Your live website URL
BASE_URL = "https://battersalemanagement.netlify.app"

# PDF output file
OUTPUT_PDF = "battery_qr_codes.pdf"


# =========================================
# GENERATE BATTERY IDs
# =========================================

# Example:
# BAT-0000001
# BAT-0000002
# ...
# BAT-0000020

START_NUMBER = 1
END_NUMBER = 20

battery_ids = [
    f"BAT-{number:07d}"
    for number in range(
        START_NUMBER,
        END_NUMBER + 1
    )
]


# =========================================
# PDF SETTINGS
# =========================================

PAGE_WIDTH, PAGE_HEIGHT = A4

# 4 columns × 5 rows = 20 QR codes per page
COLUMNS = 4
ROWS = 5

MARGIN_X = 12 * mm
MARGIN_TOP = 14 * mm
MARGIN_BOTTOM = 12 * mm

GAP_X = 4 * mm
GAP_Y = 5 * mm


CELL_WIDTH = (
    PAGE_WIDTH
    - 2 * MARGIN_X
    - (COLUMNS - 1) * GAP_X
) / COLUMNS


CELL_HEIGHT = (
    PAGE_HEIGHT
    - MARGIN_TOP
    - MARGIN_BOTTOM
    - (ROWS - 1) * GAP_Y
) / ROWS


# =========================================
# CREATE PDF
# =========================================

pdf = canvas.Canvas(
    OUTPUT_PDF,
    pagesize=A4
)

pdf.setTitle(
    "Battery QR Codes"
)


# =========================================
# CREATE EACH QR CODE
# =========================================

for index, battery_id in enumerate(battery_ids):

    # Start a new page after 20 QR codes
    if index > 0 and index % (
        COLUMNS * ROWS
    ) == 0:

        pdf.showPage()


    # Position inside current page
    position = index % (
        COLUMNS * ROWS
    )

    column = position % COLUMNS
    row = position // COLUMNS


    x = (
        MARGIN_X
        + column * (
            CELL_WIDTH + GAP_X
        )
    )


    y = (
        PAGE_HEIGHT
        - MARGIN_TOP
        - (row + 1) * CELL_HEIGHT
        - row * GAP_Y
    )


    # =====================================
    # CREATE QR URL
    # =====================================

    qr_url = (
        f"{BASE_URL}/"
        f"?battery_id={battery_id}"
    )


    # =====================================
    # GENERATE QR CODE
    # =====================================

    qr = qrcode.QRCode(

        version=None,

        error_correction=
            qrcode.constants.ERROR_CORRECT_M,

        box_size=10,

        border=2
    )


    qr.add_data(qr_url)

    qr.make(
        fit=True
    )


    qr_image = qr.make_image(
        fill_color="black",
        back_color="white"
    ).convert("RGB")


    # =====================================
    # CONVERT QR TO IMAGE
    # =====================================

    image_buffer = io.BytesIO()

    qr_image.save(
        image_buffer,
        format="PNG"
    )

    image_buffer.seek(0)


    # =====================================
    # QR IMAGE SIZE
    # =====================================

    image_size = min(
        CELL_WIDTH - 12 * mm,
        CELL_HEIGHT - 18 * mm
    )


    image_x = (
        x
        + (CELL_WIDTH - image_size) / 2
    )


    image_y = (
        y
        + 10 * mm
    )


    # =====================================
    # BATTERY ID
    # =====================================

    pdf.setFont(
        "Helvetica-Bold",
        10
    )


    pdf.drawCentredString(

        x + CELL_WIDTH / 2,

        y + CELL_HEIGHT - 8 * mm,

        battery_id
    )


    # =====================================
    # DRAW QR CODE
    # =====================================

    pdf.drawImage(

        ImageReader(image_buffer),

        image_x,
        image_y,

        width=image_size,
        height=image_size,

        preserveAspectRatio=True,

        mask="auto"
    )


    # =====================================
    # DESCRIPTION
    # =====================================

    pdf.setFont(
        "Helvetica",
        6.5
    )

    pdf.setFillGray(
        0.45
    )


    pdf.drawCentredString(

        x + CELL_WIDTH / 2,

        y + 3.5 * mm,

        "Scan to register battery sale"
    )


    pdf.setFillGray(
        0
    )


# =========================================
# SAVE PDF
# =========================================

pdf.save()


print()
print("=========================================")
print("QR PDF GENERATED SUCCESSFULLY")
print("=========================================")
print(f"Total QR codes : {len(battery_ids)}")
print(f"Output file    : {OUTPUT_PDF}")
print(f"Website        : {BASE_URL}")
print("=========================================")


START_NUMBER = 1
END_NUMBER = 100
