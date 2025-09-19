import api from "./axios";

export async function listItems(
  limit: number,
  offset: number,
  search?: string,
  type?: string,
  status?: string,
  category?: string,
  sort?: string,
  max_price?: number,
  availability?: string
) {
  const response = await api.get("/items", {
    params: {
      limit,
      offset,
      ...(search ? { search } : {}),
      ...(type ? { type } : {}),
      ...(status ? { status } : {}),
      // Only include category if no search
      ...(!search && category ? { category } : {}),
      ...(sort ? { sort } : {}),
      ...(max_price ? { max_price } : {}),
      ...(availability ? { availability } : {}),
    },
  });
  return response.data;
}

export async function getCategoryItem(id: number) {
  const response = await api.get(`/category/products/${id}`);
  return response.data;
}


export async function getItemDetail(slug: string) {
  const response = await api.get(`/product/${slug}`);
  return response.data;
}