// import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

// const ZOHO_TOKEN_URL = "https://accounts.zoho.com/oauth/v2/token";
// const ZOHO_BOOKS_URL = "https://www.zohoapis.com/books/v3";

// async function getAccessToken() {
//   const response = await axios.post(ZOHO_TOKEN_URL, null, {
//     params: {
//       refresh_token: process.env.ZOHO_REFRESH_TOKEN,
//       client_id: process.env.ZOHO_CLIENT_ID,
//       client_secret: process.env.ZOHO_CLIENT_SECRET,
//       grant_type: "refresh_token",
//     },
//   });

//   console.log(response.data.access_token);

//   return response.data.access_token;
// }

// async function fetchInvoices() {
//   const token = await getAccessToken();

//   const url = `https://www.zohoapis.com/books/v3/invoices?organization_id=${process.env.ZOHO_ORG_ID}`;

//   const response = await axios.get(`${ZOHO_BOOKS_URL}/invoices`, {
//     headers: {
//       Authorization: `Zoho-oauthtoken ${token}`,
//     },
//     params: {
//       organization_id: process.env.ZOHO_ORG_ID,
//     },
//   });

//   console.log(response.data.invoices);

//   return response.data.invoices || [];
// }

// export default fetchInvoices;

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const ZOHO_TOKEN_URL = "https://accounts.zoho.com/oauth/v2/token";
const ZOHO_BOOKS_URL = "https://www.zohoapis.com/books/v3";

async function getAccessToken() {
  const response = await axios.post(ZOHO_TOKEN_URL, null, {
    params: {
      refresh_token: process.env.ZOHO_REFRESH_TOKEN,
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      grant_type: "refresh_token",
    },
  });

  console.log("🔑 Zoho Access Token:", response.data.access_token);
  return response.data.access_token;
}

async function fetchInvoices() {
  const token = await getAccessToken();
  const url = `${ZOHO_BOOKS_URL}/invoices`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Zoho-oauthtoken ${token}` },
      params: { organization_id: process.env.ZOHO_ORG_ID },
    });

    // Flatten invoices in case they are in multiple separate arrays
    let invoices = response.data.invoices || [];
    invoices = invoices.flat(); // Ensures a single array

    console.log(`📄 Fetched ${invoices.length} invoices from Zoho`);
    return invoices;
  } catch (error) {
    console.error(
      "❌ Error fetching invoices:",
      error.response?.data || error.message
    );
    return [];
  }
}

export default fetchInvoices;
