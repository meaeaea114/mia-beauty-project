import { Product } from "@/app/shop/page"

export async function fetchProductsFromXML(): Promise<Product[]> {
  try {
    // 1. Fetch the file
    const response = await fetch('/data/products.xml');
    const text = await response.text();
    
    // 2. Parse the text into "Code"
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    
    // 3. Convert XML nodes to your Product format
    const products: Product[] = Array.from(xmlDoc.getElementsByTagName("product")).map(node => ({
      id: node.getAttribute("id") || `xml-${Math.random()}`,
      name: node.getElementsByTagName("name")[0]?.textContent || "Unknown Product",
      tagline: node.getElementsByTagName("tagline")[0]?.textContent || "Beauty Essential",
      price: Number(node.getElementsByTagName("price")[0]?.textContent) || 0,
      image: node.getElementsByTagName("image")[0]?.textContent || "/images/placeholder.jpg",
      colors: [], // Default for XML items
      variants: [], // Default for XML items
      whatItIs: node.getElementsByTagName("description")[0]?.textContent || "",
      reviews: 0,
      rating: 5
    }));

    return products;
  } catch (error) {
    console.error("Error loading XML:", error);
    return [];
  }
}