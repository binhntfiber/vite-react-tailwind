import api from "../index";

export const getUserProfile = async () => {
  const { data } = await api.get<
    null,
    {
      id: string;
      avatar: any;
      fullname: any;
      last_name: string;
      first_name: string;
      address: any;
      email: string;
      phone: string;
      country_phone_code: string;
      google_id: any;
      status: string;
      created_at: string;
      updated_at: string;
    }
  >("/api/v1/profiles");
  return data;
};
