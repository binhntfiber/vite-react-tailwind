export interface SignUpPayload {
  "g-recaptcha-response": string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  country_phone_code: string;
  phone: string;
}
