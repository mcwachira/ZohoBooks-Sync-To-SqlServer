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

  console.log(response.data.access_token);

  return response.data.access_token;
}

async function fetchInvoices() {
  const token = await getAccessToken();

  const url = `https://www.zohoapis.com/books/v3/invoices?organization_id=${process.env.ZOHO_ORG_ID}`;

  const response = await axios.get(`${ZOHO_BOOKS_URL}/invoices`, {
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
    },
    params: {
      organization_id: process.env.ZOHO_ORG_ID,
    },
  });

  return response.data.invoices || [];
}

export default fetchInvoices;
