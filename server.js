import express from "express";
import dotenv from "dotenv";
import fetchInvoices from "./zoho.js";
import insertInvoiceToDb from "./datasync.js";

const app = express();
app.use(express.json());

app.get("/sync", async (req, res) => {
  try {
    const invoices = await fetchInvoices();
    console.log(invoices);
    await insertInvoiceToDb(invoices);
    res.status(200).send("✅ Sync completed");
  } catch (err) {
    console.error("Sync error:", err);
    res.status(500).send("❌ Error syncing data");
  }
});

app.listen(3000, () => console.log("app running on port 3000"));
