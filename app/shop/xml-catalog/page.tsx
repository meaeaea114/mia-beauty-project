"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/app/context/cart-context"
import { Star, Database, Loader2 } from "lucide-react"

// Define types based on our XML structure
type XMLProduct = {
  id: string
  name: string
  tagline: string
  price: number
  image: string
  rating: number
  reviews: number
  colors: string[]
  category: string
}

export default function XMLCatalogPage() {
  const [products, setProducts] = useState<XMLProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { addItem } = useCart()

  // --- 1. XML FETCHING & PARSING LOGIC ---
  useEffect(() => {
    const fetchXMLData = async () => {
      try {
        // Fetch the file from the public folder
        const response = await fetch('/products.xml')
        
        if (!response.ok) {
          throw new Error(`Failed to load XML database: ${response.statusText}`)
        }

        const textData = await response.text()
        
        // Use browser's native DOMParser to parse XML string
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(textData, "text/xml")
        
        // Check for parsing errors
        const parseError = xmlDoc.getElementsByTagName("parsererror")
        if (parseError.length > 0) {
          throw new Error("Error parsing XML structure")
        }

        const parsedProducts: XMLProduct[] = []
        
        // Navigate XML DOM: Catalog -> Category -> Product
        const categories = xmlDoc.getElementsByTagName("category")
        
        Array.from(categories).forEach((category) => {
           const categoryName = category.getAttribute("name") || "Uncategorized"
           const productNodes = category.getElementsByTagName("product")
           
           Array.from(productNodes).forEach((node) => {
              // Helper to safely get text content from a tag
              const getTag = (tag: string) => node.getElementsByTagName(tag)[0]?.textContent || ""
              
              // Helper to get color list
              const colorNodes = node.getElementsByTagName("color")
              const colors = Array.from(colorNodes).map(c => c.textContent || "#000")

              parsedProducts.push({
                  id: node.getAttribute("id") || `xml-${Math.random()}`,
                  name: getTag("name"),
                  tagline: getTag("tagline"),
                  price: parseFloat(getTag("price")) || 0,
                  image: getTag("image"),
                  rating: parseFloat(getTag("rating")) || 0,
                  reviews: parseInt(getTag("reviews")) || 0,
                  colors: colors,
                  category: categoryName
              })
           })
        })

        setProducts(parsedProducts)
        setLoading(false)

      } catch (err: any) {
        console.error("XML Error:", err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchXMLData()
  }, [])

  // --- 2. ADD TO CART HANDLER ---
  const handleAddToCart = (product: XMLProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      variant: "Standard" // XML simplified data assumes standard variant
    })
    toast({
      title: "Added from XML Database",
      description: `${product.name} added to your bag.`,
      duration: 1500,
    })
  }

  // --- 3. RENDER ---
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FDFCFA] dark:bg-black">
        <Loader2 className="h-10 w-10 animate-spin text-[#AB462F] mb-4" />
        <p className="text-stone-500 font-medium uppercase tracking-widest text-xs">Loading XML Database...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="w-full bg-transparent text-foreground font-sans pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Page Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
             <Database className="w-4 h-4 text-[#AB462F]" />
             <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#AB462F]">XML Integration Demo</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 text-foreground">
            Product Catalog
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            This page dynamically fetches and parses product data from <code>/public/products.xml</code>
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col group animate-in fade-in zoom-in duration-500">
              
              {/* Image Card */}
              <div className="relative aspect-[4/5] bg-white/50 dark:bg-black/20 overflow-hidden mb-3 border border-stone-100 dark:border-white/10 rounded-sm">
                 <div className="absolute top-2 right-2 bg-black/80 text-white text-[9px] px-2 py-1 uppercase tracking-widest font-bold z-10">
                    {product.category}
                 </div>
                 
                 <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                 />

                 {/* Desktop Hover Button */}
                 <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden md:block bg-white/90 dark:bg-black/80 backdrop-blur-sm">
                    <Button 
                        className="w-full h-9 rounded-full text-xs font-bold uppercase tracking-wider bg-[#AB462F] hover:bg-[#944E45] text-white" 
                        onClick={() => handleAddToCart(product)}
                    >
                        Add - ₱{product.price}
                    </Button>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1">
                 <div className="flex justify-between items-start">
                    <h3 className="font-bold text-base uppercase tracking-tight text-foreground">{product.name}</h3>
                    <span className="text-sm font-semibold text-foreground">₱{product.price}</span>
                 </div>

                 {/* Rating */}
                 <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <div className="flex text-[#AB462F]">
                        {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-current" : "opacity-30"}`} />
                        ))}
                    </div>
                    <span>({product.reviews})</span>
                 </div>

                 <p className="text-xs text-muted-foreground line-clamp-1">{product.tagline}</p>
                 
                 {/* Color Swatches */}
                 <div className="flex gap-1 mt-2 h-3">
                    {product.colors.map((color, i) => (
                        <div key={i} className="w-3 h-3 rounded-full border border-stone-200 dark:border-white/20 shadow-sm" style={{ backgroundColor: color }} />
                    ))}
                 </div>

                 {/* Mobile Button */}
                 <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3 md:hidden rounded-full text-[10px] font-bold uppercase"
                    onClick={() => handleAddToCart(product)}
                 >
                    Add to Bag
                 </Button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}