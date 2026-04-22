import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import type { Player } from "../types";

const getAge = (dateOfBirth: string) => {
    const diff = Date.now() - new Date(dateOfBirth).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

export const exportToExcel = (players: Player[], fileName: string = "reporte") => {
    try {
        const dataToExport = players.map(p => ({
            Nombre: `${p.firstName} ${p.lastName}`,
            Posición: p.position,
            Edad: getAge(p.dateOfBirth),
            Altura: p.height || "1.80m",
            Pie: p.preferredFoot || "Derecho",
            Goles: p.stats?.[0]?.goals || 0,
            Asistencias: p.stats?.[0]?.assists || 0,
            Valor: p.marketValue ? `€${(p.marketValue / 1000000).toFixed(1)}M` : "—"
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Comparación");
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } catch (error) {
        console.error("Error al exportar Excel:", error);
    }
};

export const exportToPDF = async (element: HTMLElement, fileName: string = "reporte") => {
    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: "#0F0F0F",
            useCORS: true
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${fileName}.pdf`);
    } catch (error) {
        console.error("Error al generar PDF:", error);
    }
};