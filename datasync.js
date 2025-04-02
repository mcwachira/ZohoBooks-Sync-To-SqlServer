// import connectSqlServer from "./db.js";

// async function insertInvoiceToDb(invoices) {
//   const db = await connectSqlServer(); // Ensure the connection is established

//   for (const invoice of invoices) {
//     try {
//       // Corrected query execution
//       await db.request().query(`
//           MERGE INTO invoices AS target
//           USING (SELECT '${invoice.invoice_id}' AS invoice_id,  '${invoice.number}' AS invoice_number, '${invoice.customer_name}' AS customer_name,  '${invoice.status}' AS status, ${invoice.total} AS total) AS source
//           ON target.invoice_id = source.invoice_id
//           WHEN MATCHED THEN UPDATE SET target.total = source.total
//           WHEN NOT MATCHED THEN INSERT (invoice_id, customer_name, total)
//           VALUES (source.invoice_id, source.customer_name, source.total);
//       `);

//       console.log(`✅ Invoice ${invoice.invoice_id} synced successfully`);
//     } catch (err) {
//       console.error(`❌ Error syncing invoice ${invoice.invoice_id}:`, err);
//     }
//   }

//   console.log("✅ Data synced to SQL Server");
// }

// export default insertInvoiceToDb;

// import connectSqlServer from "./db.js";

// async function insertInvoiceToDb(invoices) {
//   const db = await connectSqlServer(); // Ensure the connection is established

//   if (!Array.isArray(invoices) || invoices.length === 0) {
//     console.error("❌ No invoices to sync");
//     return;
//   }

//   try {
//     await Promise.all(
//       invoices.map(async (invoice) => {
//         await db.request().query(`
//           MERGE INTO invoices AS target
//           USING (SELECT '${invoice.invoice_id}' AS invoice_id,
//                         '${invoice.customer_name}' AS customer_name,
//                         ${invoice.total} AS total) AS source
//           ON target.invoice_id = source.invoice_id
//           WHEN MATCHED THEN UPDATE SET target.total = source.total
//           WHEN NOT MATCHED THEN INSERT (invoice_id, customer_name, total)
//           VALUES (source.invoice_id, source.customer_name, source.total);
//         `);

//         console.log(`✅ Invoice ${invoice.invoice_id} synced successfully`);
//       })
//     );

//     console.log("✅ All invoices synced to SQL Server");
//   } catch (err) {
//     console.error("❌ Error syncing invoices:", err);
//   }
// }

// export default insertInvoiceToDb;

import connectSqlServer from "./db.js";
import moment from "moment"; // Import moment.js for date formatting

async function insertInvoiceToDb(invoices) {
  if (!Array.isArray(invoices) || invoices.length === 0) {
    console.error("❌ No invoices to sync");
    return;
  }

  let db;
  try {
    db = await connectSqlServer(); // Connect once

    const query = `
      MERGE INTO invoices AS target
      USING (SELECT @invoice_id AS invoice_id,  
                    @customer_name AS customer_name,  
                    @status AS status,  
                    @invoice_number AS invoice_number,  
                    @total AS total,  
                    @created_time AS created_time) AS source
      ON target.invoice_id = source.invoice_id
      WHEN MATCHED THEN UPDATE SET 
          target.customer_name = source.customer_name, 
          target.status = source.status, 
          target.invoice_number = source.invoice_number, 
          target.total = source.total,
          target.created_time = source.created_time
      WHEN NOT MATCHED THEN INSERT (invoice_id, customer_name, status, invoice_number, total, created_time) 
      VALUES (source.invoice_id, source.customer_name, source.status, source.invoice_number, source.total, source.created_time);
    `;

    for (const invoice of invoices) {
      // ✅ Convert date to SQL Server DATETIME format
      let formattedDate = invoice.created_time
        ? moment(invoice.created_time).format("YYYY-MM-DD HH:mm:ss")
        : null;

      await db
        .request()
        .input("invoice_id", invoice.invoice_id)
        .input("customer_name", invoice.customer_name)
        .input("status", invoice.status)
        .input("invoice_number", invoice.invoice_number)
        .input("total", invoice.total)
        .input("created_time", formattedDate) // ✅ Correct format
        .query(query);

      console.log(`✅ Invoice ${invoice.invoice_id} synced successfully`);
    }

    console.log("✅ All invoices synced to SQL Server");
  } catch (err) {
    console.error("❌ Error syncing invoices:", err);
  } finally {
    if (db) {
      db.close(); // Close connection
    }
  }
}

export default insertInvoiceToDb;
