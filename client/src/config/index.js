export const categoryOptions = [
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "kids", label: "Kids" },
  { id: "accessories", label: "Accessories" },
  { id: "footwear", label: "Footwear" },
];

export const brandOptions = [
  { id: "nike", label: "Nike" },
  { id: "adidas", label: "Adidas" },
  { id: "puma", label: "Puma" },
  { id: "levi", label: "Levi's" },
  { id: "zara", label: "Zara" },
  { id: "h&m", label: "H&M" },
  { id: "max", label: "Max" },
  { id: "pantaloons", label: "Pantaloons" },
  { id: "gap", label: "GAP" },
  { id: "cantabil", label: "Cantabil" },
];

export const sizeOptions = [
  { id: "xs", label: "XS" },
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
  { id: "xl", label: "XL" },
];

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addProductFormElements = [
  { name: "title", label: "Title", componentType: "input", type: "text" },
  { name: "description", label: "Description", componentType: "textarea" },
  { name: "category", label: "Category", componentType: "select", options: categoryOptions },
  { name: "brand", label: "Brand", componentType: "select", options: brandOptions },
  { name: "sizes", label: "Available Sizes", componentType: "multi-checkbox", options: sizeOptions },

  { name: "price", label: "Price", componentType: "input", type: "number" },
  { name: "salePrice", label: "Sale Price (optional)", componentType: "input", type: "number" },
  { name: "totalStock", label: "Total Stock", componentType: "input", type: "number" },
];

export const registerFormControls = [
  { name: "userName", label: "Username", componentType: "input", type: "text" },
  { name: "email", label: "Email", componentType: "input", type: "email" },
  { name: "password", label: "Password", componentType: "input", type: "password" },
];

export const loginFormControls = [
  { name: "email", label: "Email", componentType: "input", type: "email" },
  { name: "password", label: "Password", componentType: "input", type: "password" },
];

export const addressFormControls = [
  { name: "address", label: "Address", componentType: "input", type: "text" },
  { name: "city", label: "City", componentType: "input", type: "text" },
  { name: "pincode", label: "Pincode", componentType: "input", type: "text" },
  { name: "phone", label: "Phone", componentType: "input", type: "text" },
  { name: "notes", label: "Notes (optional)", componentType: "textarea" },
];
