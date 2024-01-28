const express = require('express');
const PDFDocument = require('pdfkit');
const {LogbookStats} = require('../model/logbookstatsmodel');
const PdfRouter = express.Router();
const {verifyToken} = require("../middleware/verifytoken");

PdfRouter.get('/generate-pdf/:year',verifyToken, async (req, res) => {
    const year = parseInt(req.params.year);
  
    try {
      const logbookData = await LogbookStats.findOne({ year });
  
      if (!logbookData) {
        return res.status(404).send('Logbook data not found for the given year');
      }
  
      const doc = new PDFDocument();
  
      // Set response headers for the PDF file
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="logbook-stats-${year}.pdf"`);
  
      // Pipe the PDF document to the response
      doc.pipe(res);
  
      // Add content to the PDF
      doc.fontSize(18).text(`Logbook Statistics for Year ${year}`, { align: 'center' });
      doc.text('-----------------------------------------------');
      doc.fontSize(12).text(`Total Kilometers: ${logbookData.totalKilometers}`);
      doc.text(`Business Kilometers: ${logbookData.businessKilometers}`);
      doc.text(`Total Expense Cost: ${logbookData.totalExpenseCost}`);
      doc.text(`Total Liters Bought: ${logbookData.totalLitersBought}`);
      // Add more content as needed
  
      doc.end(); // Finalize the PDF
  
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Error generating PDF');
    }
  });

  module.exports = {PdfRouter};