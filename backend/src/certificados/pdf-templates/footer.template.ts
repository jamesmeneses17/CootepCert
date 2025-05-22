// src/certificados/pdf-templates/footer.template.ts
import { Content } from 'pdfmake/interfaces';

export function generarPieFirma(): Content[] {
  return [
    {
      image: 'firma',
      width: 150,
      alignment: 'center',
      margin: [0, 0, 0, 10],
    },
    {
      text: 'JONATHAN MAURICIO PEJENDINO ROSERO',
      bold: true,
      alignment: 'center',
    },
    {
      text: 'Director de Talento Humano – COOTEP',
      alignment: 'center',
    },
  ];
}
