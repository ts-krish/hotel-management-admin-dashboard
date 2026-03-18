const api = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Request failed");
  }

  return res.json();
};

export default api;
