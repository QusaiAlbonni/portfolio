import axios from "axios";
import type { Email } from "../types/email";

export async function contact(email: Email) {
  try {
  await axios.post("https://qusayalbonniportfolio.netlify.app/.netlify/functions/contact", email);
  }
  catch(e){
    console.error(e);
  }
}
