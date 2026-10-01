/**
 * COLORIDO 2K26 — Certificate PDF Generator
 * Uses jsPDF to produce real, downloadable PDF certificates.
 */
import { jsPDF } from 'jspdf';
import { CertificateItem } from '../types/database';

/** Truncate long text to fit within a max pixel width via measuring. */
function fitText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars - 3) + '...';
}

/** Build a safe filename from participant name and event name */
export function buildCertFilename(cert: CertificateItem): string {
  const safeName = cert.participant_name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').slice(0, 30);
  const safeEvent = cert.event_name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').slice(0, 25);
  const type = cert.certificate_type.includes('Winner') ? 'Winner' :
               cert.certificate_type.includes('Runner') ? 'RunnerUp' : 'Participation';
  return `COLORIDO_2K26_${type}_${safeName}_${safeEvent}.pdf`;
}

/** Main PDF generator — returns jsPDF instance */
export function generateCertificatePDF(cert: CertificateItem): jsPDF {
  const isWinner = cert.certificate_type === 'Winner Certificate';
  const isRunnerUp = cert.certificate_type === 'Runner-up Certificate';
  const isThird = cert.achievement?.includes('Third') || cert.achievement?.includes('3rd') || cert.winner_position === '3rd Place';

  // Landscape A4: 297mm × 210mm
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = 297;
  const H = 210;
  const cx = W / 2;

  // ─── Background ────────────────────────────────────────────────────────────
  doc.setFillColor(252, 252, 250);
  doc.rect(0, 0, W, H, 'F');

  // Subtle gradient overlay bands (simulated with rectangles)
  doc.setFillColor(255, 248, 220); // warm cream
  doc.rect(0, 0, W, 2, 'F');
  doc.rect(0, H - 2, W, 2, 'F');

  // ─── Decorative Outer Border ────────────────────────────────────────────────
  const borderColor = isWinner ? [180, 120, 20] : isRunnerUp ? [100, 100, 120] : isThird ? [120, 80, 40] : [20, 120, 100];
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(3);
  doc.rect(6, 6, W - 12, H - 12);

  // Inner border (thin)
  doc.setLineWidth(0.6);
  doc.rect(9, 9, W - 18, H - 18);

  // Corner ornament lines
  const oc = 18; // corner size
  const corners = [[6,6],[W-6,6],[6,H-6],[W-6,H-6]];
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(1.2);
  // TL
  doc.line(6, 6, 6 + oc, 6); doc.line(6, 6, 6, 6 + oc);
  // TR
  doc.line(W - 6, 6, W - 6 - oc, 6); doc.line(W - 6, 6, W - 6, 6 + oc);
  // BL
  doc.line(6, H - 6, 6 + oc, H - 6); doc.line(6, H - 6, 6, H - 6 - oc);
  // BR
  doc.line(W - 6, H - 6, W - 6 - oc, H - 6); doc.line(W - 6, H - 6, W - 6, H - 6 - oc);

  // ─── Header Section ─────────────────────────────────────────────────────────
  let y = 22;

  // Festival name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42);
  doc.text('COLORIDO 2K26', cx, y, { align: 'center' });

  y += 6;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 80, 30);
  doc.text('NATIONAL LEVEL CULTURAL & SPORTS FESTIVAL', cx, y, { align: 'center' });

  // Decorative divider
  y += 5;
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(0.8);
  doc.line(cx - 45, y, cx + 45, y);

  // ─── Certificate Type ───────────────────────────────────────────────────────
  y += 8;
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(16);
  doc.setTextColor(120, 53, 15);
  doc.text(cert.certificate_type.toUpperCase(), cx, y, { align: 'center' });

  // Winner position badge
  if (cert.winner_position) {
    y += 7;
    const posLabel = cert.winner_position === '1st Place' ? '🥇 FIRST PLACE — GOLD AWARD' :
                     cert.winner_position === '2nd Place' ? '🥈 SECOND PLACE — SILVER AWARD' :
                     '🥉 THIRD PLACE — BRONZE AWARD';
    const badgeColor = cert.winner_position === '1st Place' ? [180, 120, 20] :
                       cert.winner_position === '2nd Place' ? [100, 100, 120] : [120, 80, 40];
    doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
    doc.roundedRect(cx - 42, y - 5, 84, 8, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(posLabel, cx, y, { align: 'center' });
    doc.setTextColor(15, 23, 42);
  }

  // ─── Certify text ───────────────────────────────────────────────────────────
  y += 9;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('THIS IS TO PROUDLY CERTIFY THAT', cx, y, { align: 'center' });

  // ─── Participant Name ────────────────────────────────────────────────────────
  y += 8;
  const displayName = fitText(cert.participant_name, 55);
  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42);
  doc.text(displayName, cx, y, { align: 'center' });

  // Underline
  const nameWidth = doc.getTextWidth(displayName);
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(0.5);
  doc.line(cx - nameWidth / 2, y + 1.5, cx + nameWidth / 2, y + 1.5);

  // College
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const displayCollege = fitText(`of ${cert.college}`, 65);
  doc.text(displayCollege, cx, y, { align: 'center' });

  // ─── Achievement / Body text ─────────────────────────────────────────────────
  y += 7;
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  const displayEvent = fitText(cert.event_name, 55);
  doc.text('has demonstrated outstanding dedication and sportsmanship in the discipline of', cx, y, { align: 'center' });
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${displayEvent}`, cx, y, { align: 'center' });
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text('at COLORIDO 2K26, held at the University Campus.', cx, y, { align: 'center' });

  // ─── Footer divider ──────────────────────────────────────────────────────────
  y += 10;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(14, y, W - 14, y);

  // ─── Three-column footer: Sig | QR | Sig ────────────────────────────────────
  const footerY = y + 5;
  const sigW = 60;

  // Left signature
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(10);
  doc.setTextColor(30, 27, 75);
  doc.text('Dr. Arvind Sharma', 14 + sigW / 2, footerY + 4, { align: 'center' });
  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.3);
  doc.line(14, footerY + 6, 14 + sigW, footerY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('Festival Convener', 14 + sigW / 2, footerY + 10, { align: 'center' });
  doc.text('COLORIDO 2K26', 14 + sigW / 2, footerY + 14, { align: 'center' });

  // Right signature
  const rx = W - 14 - sigW;
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(10);
  doc.setTextColor(30, 27, 75);
  doc.text('Prof. Sunita Rao', rx + sigW / 2, footerY + 4, { align: 'center' });
  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.3);
  doc.line(rx, footerY + 6, rx + sigW, footerY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('Dean of Student Affairs', rx + sigW / 2, footerY + 10, { align: 'center' });
  doc.text('COLORIDO 2K26', rx + sigW / 2, footerY + 14, { align: 'center' });

  // Center QR placeholder box (QR rendering in browser via canvas is complex in jsPDF)
  const qrSize = 22;
  const qrX = cx - qrSize / 2;
  const qrY = footerY - 2;
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(0.8);
  doc.rect(qrX, qrY, qrSize, qrSize);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(100, 116, 139);
  doc.text('VERIFY AT', cx, qrY + 6, { align: 'center' });
  doc.text('colorido2k26.edu/verify', cx, qrY + 10, { align: 'center' });
  doc.setFontSize(5);
  doc.text(`ID: ${cert.certificate_id}`, cx, qrY + 14, { align: 'center' });

  // ─── Bottom verification bar ─────────────────────────────────────────────────
  const bY = H - 8;
  doc.setFillColor(248, 250, 252);
  doc.rect(9, bY - 3, W - 18, 6, 'F');
  doc.setFont('courier', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `CERT ID: ${cert.certificate_id}  |  ISSUED: ${cert.issue_date}  |  Verified by COLORIDO 2K26 Academic Secretariat`,
    cx, bY, { align: 'center' }
  );

  return doc;
}

/** Generate and trigger browser download of a certificate PDF */
export function downloadCertificatePDF(cert: CertificateItem): void {
  const doc = generateCertificatePDF(cert);
  const filename = buildCertFilename(cert);
  doc.save(filename);
}
