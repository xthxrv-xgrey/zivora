import api from "./axios";

export function getProducts() {
  return api.get("/products").then((res) => res.data.data.products);
}

export function getProduct(id) {
  return api.get(`/products/${id}`).then((res) => res.data.data.product);
}

export function createProduct(formData) {
  // Do NOT set Content-Type manually — the browser needs to set the
  // multipart boundary itself when sending a FormData body.
  return api
    .post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data.data.product);
}

export function updateProduct(id, data) {
  return api.put(`/products/${id}`, data).then((res) => res.data.data.product);
}

export function deleteProduct(id) {
  return api.delete(`/products/${id}`).then((res) => res.data);
}
