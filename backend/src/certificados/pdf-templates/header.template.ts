// src/certificados/pdf-templates/header.template.ts
import { Content } from 'pdfmake/interfaces';
import { generarPieFirma } from './footer.template';


export function generarEncabezadoPDF(): Content[] {
  return [
    {
      columns: [
        { image: 'logo', width: 80 },
        {
          text: [
            {
              text: 'COOPERATIVA DE LOS TRABAJADORES DE LA EDUCACIÓN Y EMPRESARIOS DEL PUTUMAYO\n',
              style: 'tituloInstitucional',
            },
            {
              text: 'Personería Jurídica No. 111 del 1 de febrero de 1984 - DANCOOP\nNit.800.173.694-5\n\n',
              style: 'subtitulo',
            },
          ],
          alignment: 'center',
        },
      ],
    },
    {
      text: 'EL SUSCRITO DIRECTOR DE TALENTO HUMANO DE LA COOPERATIVA DE LOS TRABAJADORES DE LA EDUCACIÓN Y EMPRESARIOS DEL PUTUMAYO “COOTEP”',
      style: 'negritaMayus',
      alignment: 'center',
      margin: [0, 10, 0, 10],
    },
    {
      text: 'HACE CONSTAR',
      style: 'negritaMayus',
      alignment: 'center',
      margin: [0, 10, 0, 20],
    },
  ];
}
