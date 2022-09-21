import { google } from "googleapis";
import path from "path";
import { ISpreadSheetCredentials } from "../types/types";
export const auth = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve(__dirname, "./info.json"),
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  const authClientObject = await auth.getClient();
  const googleSheetsInstance = google.sheets({
    version: "v4",
    auth: authClientObject,
  });
  const credentials: ISpreadSheetCredentials = { auth, googleSheetsInstance };
  return credentials
};
