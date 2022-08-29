import { Request, Response } from "express";
import { GoogleSpreadsheet } from "google-spreadsheet";
import dotenv from "dotenv"
dotenv.config();

export const book = async (req: Request, res: Response) => {
  const { name, contact, address } = req.body;
  if (name && contact && address) {
    const doc = new GoogleSpreadsheet(
      process.env.sheetID
    );
    try {
      await doc.useServiceAccountAuth({
        client_email: process.env.clientEmail!,
        private_key: process.env.privateKey!,
      });
      await doc.loadInfo();
      const sheet = doc.sheetsByTitle[process.env.sheetTitle!];
      const row = await sheet.addRow({
        name: name,
        address: address,
        contact: contact,
      });
      res.status(200).json({ message: "Success" });
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  } else {
    res.status(400).json({ message: "Invalid data" });
  }
};
