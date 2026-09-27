export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export function validateEmail(email) {
  if (!email) return "Email is required.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return "Enter a valid email address.";
  return null;
}

export function validatePassword(password) {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return null;
}

export function validateName(name) {
  if (!name || !name.trim()) return "Name is required.";
  return null;
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return "Please confirm your password.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return null;
}

export function validateProductName(name) {
  if (!name || !name.trim()) return "Product name is required.";
  if (name.trim().length < 2 || name.trim().length > 100) {
    return "Product name must be between 2 and 100 characters.";
  }
  return null;
}

export function validateProductDescription(description) {
  if (!description || !description.trim()) return "Description is required.";
  if (description.trim().length < 10 || description.trim().length > 2000) {
    return "Description must be between 10 and 2000 characters.";
  }
  return null;
}

export function validateProductPrice(price) {
  if (price === "" || price === null || price === undefined) return "Price is required.";
  const num = Number(price);
  if (Number.isNaN(num) || num < 0) return "Price must be a number ≥ 0.";
  return null;
}

export function validateProductCategory(category) {
  if (!category || !category.trim()) return "Category is required.";
  if (category.trim().length < 2 || category.trim().length > 50) {
    return "Category must be between 2 and 50 characters.";
  }
  return null;
}

export function validateProductStock(stock) {
  if (stock === "" || stock === null || stock === undefined) return null; // optional
  const num = Number(stock);
  if (!Number.isInteger(num) || num < 0) return "Stock must be a whole number ≥ 0.";
  return null;
}

export function validateProductImage(file) {
  if (!file) return "Product image is required.";
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Image must be JPEG, PNG, or WebP.";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "Image must be 5 MB or smaller.";
  }
  return null;
}

export function extractApiErrorMessage(error, fallback = "Something went wrong.") {
  const data = error?.response?.data;
  if (data?.errors?.length) {
    return data.errors.map((e) => e.msg).join(" ");
  }
  return data?.message || error?.message || fallback;
}
