"""
bookings/invoices.py

Generates a PDF invoice for a given Booking using reportlab.
Kept separate from views.py to keep view logic thin.

Install dependency first:
    pip install reportlab
"""

import io
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle


def generate_invoice_pdf(booking):
    """
    Builds a PDF invoice in memory and returns it as a BytesIO buffer,
    ready to be sent back in an HttpResponse.
    """
    buffer = io.BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        topMargin=25 * mm,
        bottomMargin=25 * mm,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "InvoiceTitle",
        parent=styles["Heading1"],
        fontSize=22,
        textColor=colors.HexColor("#B8860B"),  # gold-ish, matches brand
        spaceAfter=4,
    )
    subtitle_style = ParagraphStyle(
        "InvoiceSubtitle",
        parent=styles["Normal"],
        fontSize=10,
        textColor=colors.grey,
        spaceAfter=20,
    )
    section_style = ParagraphStyle(
        "SectionHeader",
        parent=styles["Heading3"],
        fontSize=12,
        spaceBefore=16,
        spaceAfter=6,
    )

    elements = []

    # --- Header ---
    elements.append(Paragraph("AureliaStays", title_style))
    elements.append(Paragraph("Booking Invoice", subtitle_style))

    # --- Invoice meta info ---
    meta_data = [
        ["Invoice For Booking #:", str(booking.id)],
        [
            "Issue Date:",
            (
                booking.created_at.strftime("%d %b %Y")
                if hasattr(booking, "created_at")
                else "-"
            ),
        ],
        ["Status:", booking.status.capitalize()],
    ]
    meta_table = Table(meta_data, colWidths=[60 * mm, 100 * mm])
    meta_table.setStyle(
        TableStyle(
            [
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("TEXTCOLOR", (0, 0), (0, -1), colors.grey),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    elements.append(meta_table)

    # --- Guest info ---
    elements.append(Paragraph("Billed To", section_style))
    guest_name = (
        f"{booking.guest.first_name} {booking.guest.last_name}".strip()
        or booking.guest.username
    )
    guest_data = [
        ["Name:", guest_name],
        ["Email:", getattr(booking.guest, "email", "-")],
    ]
    guest_table = Table(guest_data, colWidths=[60 * mm, 100 * mm])
    guest_table.setStyle(
        TableStyle(
            [
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("TEXTCOLOR", (0, 0), (0, -1), colors.grey),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    elements.append(guest_table)

    # --- Stay details ---
    elements.append(Paragraph("Stay Details", section_style))
    nights = (booking.check_out_date - booking.check_in_date).days

    stay_table_data = [
        ["Hotel", "Room Type", "Check-in", "Check-out", "Nights"],
        [
            booking.room.hotel.name,
            booking.room.get_room_type_display(),
            booking.check_in_date.strftime("%d %b %Y"),
            booking.check_out_date.strftime("%d %b %Y"),
            str(nights),
        ],
    ]
    stay_table = Table(
        stay_table_data,
        colWidths=[45 * mm, 30 * mm, 30 * mm, 30 * mm, 20 * mm],
    )
    stay_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F5EFE0")),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E0D6BE")),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    elements.append(stay_table)
    elements.append(Spacer(1, 20))

    # --- Total ---
    total_table = Table(
        [["Total Amount", f"PKR {booking.total_price:,.2f}"]],
        colWidths=[125 * mm, 30 * mm],
    )
    total_table.setStyle(
        TableStyle(
            [
                ("FONTSIZE", (0, 0), (-1, -1), 12),
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica-Bold"),
                ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#8B6914")),
                ("ALIGN", (1, 0), (1, 0), "RIGHT"),
                ("LINEABOVE", (0, 0), (-1, 0), 1, colors.HexColor("#B8860B")),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    elements.append(total_table)
    elements.append(Spacer(1, 30))

    footer_style = ParagraphStyle(
        "Footer", parent=styles["Normal"], fontSize=9, textColor=colors.grey
    )
    elements.append(
        Paragraph(
            "Thank you for booking with AureliaStays. "
            "For questions about this invoice, contact support@aureliastays.com",
            footer_style,
        )
    )

    doc.build(elements)
    buffer.seek(0)
    return buffer
