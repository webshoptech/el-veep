import api from "./axios";

export async function listCategories(
  limit: number,
  offset: number,
  search?: string,
  type?: string,
  status?: string
) {
  const response = await api.get("/categories", {
    params: {
      limit,
      offset,
      ...(search ? { search } : {}),
      ...(type ? { type } : {}),
      ...(status ? { status } : {}),
    },
  });
  return response.data;
}
