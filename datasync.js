import connectSqlServer from "./db.js";

async function insertInvoiceToDb(invoices) {
  const db = await connectSqlServer(); // Ensure the connection is established

  for (const invoice of invoices) {
    try {
      // Corrected query execution
      await db.request().query(`
          MERGE INTO invoices AS target
          USING (SELECT '${invoice.invoice_id}' AS invoice_id, '${invoice.customer_name}' AS customer_name, ${invoice.total} AS total) AS source
          ON target.invoice_id = source.invoice_id
          WHEN MATCHED THEN UPDATE SET target.total = source.total
          WHEN NOT MATCHED THEN INSERT (invoice_id, customer_name, total) 
          VALUES (source.invoice_id, source.customer_name, source.total);
      `);

      console.log(`✅ Invoice ${invoice.invoice_id} synced successfully`);
    } catch (err) {
      console.error(`❌ Error syncing invoice ${invoice.invoice_id}:`, err);
    }
  }

  console.log("✅ Data synced to SQL Server");
}

export default insertInvoiceToDb;