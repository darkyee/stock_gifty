import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Certificate } from '../types';

export async function exportCertificateToPDF(certificate: Certificate, previewElement?: HTMLElement) {
  try {
    // If no preview element is provided, create a temporary one
    let element: HTMLElement;
    if (previewElement) {
      element = previewElement;
    } else {
      // Create a temporary container
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      document.body.appendChild(container);

      // Render the certificate preview
      const CertificatePreview = (await import('../components/CertificatePreview')).CertificatePreview;
      const React = await import('react');
      const ReactDOM = await import('react-dom');
      
      ReactDOM.render(
        React.createElement(CertificatePreview, {
          certificate,
          templateId: 'classic', // Default template if not specified
        }),
        container
      );

      element = container.firstChild as HTMLElement;
    }

    // Generate PDF
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${certificate.stockSymbol}_certificate.pdf`);

    // Clean up temporary elements if created
    if (!previewElement) {
      element.parentElement?.remove();
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF certificate');
  }
}