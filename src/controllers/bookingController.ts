import { Request, Response } from "express";
import { GoogleSpreadsheet } from "google-spreadsheet";
import dotenv from "dotenv";
dotenv.config();

export const book = async (req: Request, res: Response) => {
  const { name, contact, building, department, floor, room } = req.body;
  if (name && contact && building && department && floor && room) {
    const doc = new GoogleSpreadsheet(process.env.sheetID);
    try {
      await doc.useServiceAccountAuth({
        client_email: process.env.clientEmail!,
        private_key: process.env.privateKey!,
      });
      await doc.loadInfo();
      const sheet = doc.sheetsByTitle[process.env.sheetTitle!];
      let date = new Date();
      const time = new Date().toLocaleTimeString();
      if (parseInt(time.split(":")[0]) > 10) {
        date.setDate(date.getDate() + 1);
      } else {
        date.setDate(date.getDate());
      }
      const row = await sheet.addRow({
        name: name,
        contact: contact,
        building: building,
        department: department,
        floor: floor,
        room: room,
        date: date.toLocaleDateString(),
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
