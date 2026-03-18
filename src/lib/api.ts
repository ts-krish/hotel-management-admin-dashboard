import { cookies } from "next/headers";

const api = async (url: string, options?: RequestInit) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    return errorData;
  }
  return await res.json();
};

export default api;
