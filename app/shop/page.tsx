"use client"
export const dynamic = "force-dynamic"

import * as React from "react"
import { useState, useMemo, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ProductModal } from "@/components/shop/product-modal"
import { useCart } from "@/app/context/cart-context"
import { Search, X, Star } from "lucide-react"

// --- Types ---
export type Product = {
  id: string
  name: string
  tagline: string
  price: number
  image: string
  variants?: {
    name: string
    color: string
    image: string
  }[] 
  colors: string[] 
  
  weight?: string
  whatItIs?: string
  whyWeLoveIt?: string
  howItFeels?: string
  theLook?: string
  skincare?: string
  claims?: string[]
  reviews?: number
  rating?: number
  category?: string
  whatMakesItSoGood?: string
}

type Category = {
  title: string
  description: string
  media: string
  mediaType: 'video' | 'image'
  items: Product[]
}

// --- Shop Data (Updated with New Descriptions & SKIN Category) ---
const SHOP_DATA: Category[] = [
  {
    title: "LIPS",
    description: "Swipe on a layer of color that feels like nothing but looks like everything. From matte to gloss, find your perfect match.",
    media: "/vid/Makeup_Tutorial_Video_Creation.mp4",
    mediaType: "video",
    items: [
      { 
        id: "l1", 
        name: "Fluffmatte", 
        tagline: "Weightless modern matte lipstick", 
        price: 399, 
        image: "/images/Rectangle 131.png", 
        colors: ["#B55A55", "#D67F68", "#E8A69D", "#A81C26", "#944E45"],
        variants: [
          { name: "Girl Crush", color: "#B55A55", image: "/images/Girl Crush.png" },
          { name: "Brunette", color: "#D67F68", image: "/images/Brunette.png" },
          { name: "Nudist", color: "#E8A69D", image: "/images/Nudist.png" },
          { name: "Casual", color: "#A81C26", image: "/images/Casual.png" },
          { name: "Baked", color: "#944E45", image: "/images/Baked.png" }
        ],
        weight: "3.2 g / 0.11 oz",
        whatItIs: "A modern matte lipstick reinvented for everyday wear. Fluffmatte glides on effortlessly, delivering smooth, even pigment with a second-skin feel.",
        whyWeLoveIt: "Fluffmatte comes in 7 curated shades — a versatile lineup of flattering mauves, neutrals, and bold tones designed to complement a wide range of undertones. Each shade melts into the lips with a velvety finish that never feels heavy. Our soft-focus formula cushions the lips, offering comfortable wear that blurs lines and leaves a plush, diffused look all day.",
        claims: ["Easy to use", "Paraben-free", "Non-drying", "Cruelty-free", "High impact color", "Fragrance-free"],
        reviews: 3200,
        rating: 4.9
      },
      { 
        id: "l2", 
        name: "Fluffbalm", 
        tagline: "Moisturizing matte blotted lipstick", 
        price: 399, 
        image: "/images/Rectangle 131.png", 
        colors: ["#D88A7A", "#C27970", "#B55A55"],
        variants: [
          { name: "Perfect Nude", color: "#D88A7A", image: "/images/PERFECT NUDE.png" },
          { name: "Perfect Pink", color: "#C27970", image: "/images/PERFECT PINK.png" },
          { name: "Perfect Mauve", color: "#B55A55", image: "/images/PERFECT MAUVE.png" }
        ],
        weight: "3.2 g / 0.11 oz",
        whatItIs: "A moisturizing, buildable lipstick with a weightless finish, designed to give lips a soft, cloud-like diffused effect.",
        whyWeLoveIt: "Fluffbalm effortlessly provides the coveted blotted lip look in just one swipe, perfect for an everyday minimalist vibe. The unique creamy formula applies like a lipstick but feels as comfortable as your favorite lip balm, preventing dryness. It comes in three effortlessly wearable shades—the perfect nude, a perfect pink, and a perfect mauve—to deliver a subtle pop of color.",
        claims: ["Sheer and lightweight", "Paraben free", "Soft blurred finish", "Cruelty free", "Moisturizing matte", "Fragrance free"],
        reviews: 890,
        rating: 4.7
      },
      { 
        id: "l3", 
        name: "Glidegloss", 
        tagline: "Plumping high shine gloss stick", 
        price: 350, 
        image: "/images/Rectangle 133.png", 
        colors: ["#E8A69D", "#D67F68"],
        variants: [
            { name: "Gumamela", color: "#E8A69D", image: "/images/GUMAMELA.png" },
            { name: "Tart", color: "#D67F68", image: "/images/TART.png" }
        ],
        weight: "2.3 g / 0.08 oz",
        whatItIs: "A high-shine gloss stick that glides on like a balm, delivering rich pigment and an ultra-luminous finish.",
        whyWeLoveIt: "Its creamy formula melts smoothly onto the lips, giving a subtle plumping and refreshing sensation. Choose from two trend-setting, juicy shades designed to complement any look and keep your lips deeply hydrated.",
        claims: ["Gloss in a stick", "Naturally Plumping", "Non-retractable", "Ultra high shine", "Non sticky", "Moisturizing"],
        reviews: 420,
        rating: 4.6
      },
      { 
        id: "l4", 
        name: "Juicetint", 
        tagline: "Hydrating soft lip tint", 
        price: 299, 
        image: "/images/Rectangle 134.png", 
        colors: ["#A81C26", "#B55A55", "#D67F68", "#944E45"],
        variants: [
          { name: "Lychee", color: "#A81C26", image: "/images/Strawberry.png" },
          { name: "Strawberry", color: "#B55A55", image: "/images/Lychee.png" },
          { name: "Tea Rose", color: "#D67F68", image: "/images/Tea Rose.png" },
          { name: "Mulberry", color: "#944E45", image: "/images/Mulberry.png" }
        ],
        weight: "3.5 g / 0.12 oz",
        whatItIs: "Juicetint is a hydrating lip oil–tint hybrid infused with nourishing ingredients for healthier-looking lips. It applies like a gloss, melts into a lightweight tint, and leaves behind a soft, long-lasting stain.",
        whyWeLoveIt: "It keeps your lips hydrated and comfortable while giving you buildable color. It’s also enriched with skin-loving ingredients that keep your lips smooth, soft, and supple throughout the day.",
        howItFeels: "Juicetint feels lightweight, silky, and non-sticky. It glides on effortlessly, leaving your lips cushiony and hydrated. A fresh peppermint tingle adds a refreshing boost for a naturally fuller look.",
        theLook: "A glossy sheen that settles into a natural-looking stain — perfect for a subtle wash of color or a bold, layered finish.",
        skincare: "Formulated with Hyaluronic Acid, Ceramides, and a nourishing triple-oil blend to enhance hydration, smoothness, and softness.",
        claims: ["Hydrating and soft on lip", "All-day wear", "Never sticky, always comfortable", "Gloss now, tint later", "Cruelty-free", "Fragrance-free"],
        reviews: 170,
        rating: 4.8
      },
      { 
        id: "l5", 
        name: "Lip Dip", 
        tagline: "Whipped matte lip cream", 
        price: 299, 
        image: "/images/Rectangle 129-1.png", 
        colors: ["#944E45", "#B55A55", "#A81C26"],
        variants: [
            { name: "Nonchalant", color: "#944E45", image: "/images/Nonchalant.png" },
            { name: "Nougat", color: "#B55A55", image: "/images/Nougat.png" },
            { name: "Dragon", color: "#A81C26", image: "/images/Dragon.png" }
        ],
        weight: "3g / 0.11oz",
        whatItIs: "A blurred matte lip tint that gives your lips a soft, long-lasting wash of color.",
        whyWeLoveIt: "Lip Dip glides effortlessly, softening the look of imperfections while smoothing and plumping lips for a naturally fuller appearance. Its blurred matte finish is perfect for everyday wear, leaving a true-to-color tint that stays on for hours.",
        claims: ["Soft-matte blurred finish", "Lightweight and silky texture", "Non-drying formula", "Powered with Airblur Technology", "Fragrance-free", "True-to-color tint that lasts"],
        reviews: 1200,
        rating: 4.8
      },
      { 
        id: "l6", 
        name: "Staygloss", 
        tagline: "High-shine longwear lip gloss", 
        price: 595, 
        image: "/images/BABYGIRL.png", 
        colors: ["#A81C26", "#B55A55"],
        variants: [
            { name: "Lavish", color: "#A81C26", image: "/images/LAVISH.jpg" },
            { name: "Dainty", color: "#B55A55", image: "/images/DAINTY.png" }
        ],
        whatItIs: "Staygloss is a high-shine, longwear lip gloss that coats the lips in bold, vibrant color with just one swipe. Infused with nourishing conditioners and color-lock technology, this performance-driven formula cushions the lips while delivering smooth, comfortable, transfer-resistant wear for up to 12 hours.",
        whyWeLoveIt: "It’s the gloss that lasts and the comfort you didn’t expect. This advanced, transfer-resistant formula glides effortlessly to create a glassy, lacquered finish that doesn’t budge. Enjoy all-day color, shine, and hydration—without the stickiness.",
        claims: ["12-hour wear", "Budgeproof", "High-Shine Lip Gloss", "Easy to use", "Transfer-resistant", "All day comfort"],
        reviews: 540,
        rating: 4.9
      }
    ]
  },
  {
   title: "CHEEKS",
    description: "Get that natural, sun-kissed flush with our blendable, breathable cheek tints designed for every skin tone.",
    media: "/vid/d0b8a7b6-8549-46e5-a790-b30ffe3c0782.mp4", 
    mediaType: "video",
    items: [
      { 
        id: "c1", 
        name: "Airblush", 
        tagline: "Soft-focus sheer cheek tint", 
        price: 359, 
        image: "/images/Rectangle 157.png", 
        colors: ["#F28C98"],
        variants: [
            { name: "Doll", color: "#F28C98", image: "/images/Rectangle 150.png" }
        ],
        weight: "2.5 g / 0.09 oz",
        whatItIs: "A soft-focus cheek tint that delivers a subtle, blurred matte flush for effortlessly polished skin.",
        whyWeLoveIt: "Airblush’s cream-to-powder formula blends seamlessly for a naturally soft, airbrushed look. This universally flattering shade enhances any complexion with a perfect, soft flush.",
        claims: ["Blendable", "Paraben free", "Buildable", "Cruelty Free", "Easy-to-use", "Fragrance free"],
        reviews: 1540,
        rating: 4.8
      },
      { 
        id: "c2", 
        name: "Blush Duo", 
        tagline: "Soft, healthy flush", 
        price: 400, 
        image: "/images/Rectangle 145.png", 
        colors: ["#F49F86"],
        variants: [
            { name: "Warmth", color: "#F49F86", image: "/images/airblush-peached.jpg" }
        ],
        whatItIs: "A two-tone blush that blends effortlessly for a soft, naturally radiant flush.",
        whyWeLoveIt: "Blush with Benefits – our weightless formula is enriched with Macadamia Nut and Camellia extracts plus Vitamins E & D, giving your skin nourishment and protection while leaving a delicate, healthy glow.",
        reviews: 230,
        rating: 4.7
      },
      { 
        id: "c3", 
        name: "Blush On", 
        tagline: "Long-wearing cheek pigment", 
        price: 359, 
        image: "/images/Rectangle 146.png", 
        colors: ["#C67D6F", "#F28C98", "#F49F86"],
        variants: [
            { name: "Sunset", color: "#C67D6F", image: "/images/Image 12-2-25 at 12.32 PM.jpeg" },
            { name: "Petal", color: "#F28C98", image: "/images/Image 12-2-25 at 12.35 PM.jpeg" },
            { name: "Coral", color: "#F49F86", image: "/images/Image 12-2-25 at 12.28 PM (1).jpeg" }
        ],
        weight: "40 g / 1.4 oz",
        whatItIs: "A long-lasting liquid blush with rich pigment that melts seamlessly into the skin. Its silky serum tint formula melts into the skin and sets for lasting color. Enriched with our signature Radiant Blend of flower-powered ingredients, it soothes, hydrates, and nourishes.",
        whyWeLoveIt: "Blush On delivers a weightless, fresh flush without the heaviness. It builds beautifully, leaving cheeks radiant and flawless from morning to night.",
        claims: ["Long lasting", "Paraben Free", "Buildable + Blendable", "Cruelty Free", "Easy to use", "Fragrance Free"],
        reviews: 670,
        rating: 4.9
      },
      { 
        id: "c4", 
        name: "Bronzer Duo", 
        tagline: "Sun-kissed warmth", 
        price: 400, 
        image: "/images/Rectangle 144.png", 
        colors: ["#8D5E4D"],
        variants: [
            { name: "Tan", color: "#8D5E4D", image: "/images/Rectangle 144.png" }
        ],
        whatItIs: "A versatile duo of cool and warm bronzing shades for a sun-kissed, sculpted look.",
        whyWeLoveIt: "Skincare Meets Bronze – enriched with Macadamia Nut and Camellia extracts and Vitamins E & D, this Bronzer Duo nourishes and protects the skin while delivering a flawless, radiant sun-kissed finish.",
        reviews: 150,
        rating: 4.5
      },
      { 
        id: "c5", 
        name: "Glow On", 
        tagline: "Light catching liquid highlighter", 
        price: 359, 
        image: "/images/Rectangle 145-1.png", 
        colors: ["#E8DCCA", "#E3C9B0", "#D67F68"],
        variants: [
            { name: "Stellar", color: "#E8DCCA", image: "/images/STELLAR.jpg" },
            { name: "Saturn", color: "#E3C9B0", image: "/images/SATURN.jpg" },
            { name: "Moondust", color: "#D67F68", image: "/images/MOONDUST.jpg" }
        ],
        weight: "40 g / 1.4 oz",
        whatItIs: "A lightweight liquid highlighter that nourishes the skin while delivering a soft, ethereal glow.",
        whyWeLoveIt: "The silky gel formula glides smoothly and builds to your preferred intensity. Light-reflecting superfine pigments give a luminous, refined glow without glitter, elevating any makeup look with sophistication.",
        claims: ["Long lasting", "Paraben Free", "Buildable + Blendable", "Cruelty Free", "Easy to use", "Fragrance Free"],
        reviews: 410,
        rating: 4.6
      },
    ]
  },
  {
    title: "FACE",
    description: "Your skin, but better. Lightweight bases, serums, and skincare essentials that blur, brighten, and protect.",
    media: "/vid/Tinted_Moisturizer_Commercial_Video_Creation.mp4", 
    mediaType: "video",
    items: [
      { 
        id: "f1", 
        name: "Tinted Moisturizer", 
        tagline: "Oil-free base", 
        price: 430, 
        image: "/images/Rectangle 147.png", 
        colors: ["#EBEBEB"],
        variants: [
            { name: "Porcelain", color: "#EBEBEB", image: "/images/Rectangle 68.png" }
        ],
        weight: "30 ml",
        whatItIs: "An oil-free tinted moisturizer with SPF 20+ broad-spectrum UVA/UVB protection. Its creamy-jelly formula provides buildable light-to-medium coverage with a natural, blurred matte finish. Enhanced by oil-absorbing powders to keep skin fresh all day.",
        whyWeLoveIt: "Blends effortlessly for an even, healthy-looking complexion while offering 95% sun protection. Made with 75% naturally derived ingredients, it hydrates, smooths, and improves skin over time. Dermatologically approved and safe for sensitive skin, it’s the ultimate everyday essential.",
        reviews: 820,
        rating: 4.8
      },
      { 
        id: "f2", 
        name: "Base Booster", 
        tagline: "Skin-blurring tinted complexion", 
        price: 500, 
        image: "/images/Rectangle 144-1.png", 
        colors: ["#E3C9B0"],
        variants: [
            { name: "Light", color: "#E3C9B0", image: "/images/Rectangle 80.png" }
        ],
        weight: "28 ml / 0.94 oz",
        whatItIs: "A multi-use tinted illuminator packed with 82% skincare ingredients, designed to enhance your complexion as a base, highlighter, bronzer, or body glow.",
        whyWeLoveIt: "The lightweight formula nourishes and hydrates the skin while imparting a soft, radiant finish. Buildable and versatile, it delivers a sophisticated all-over luminosity",
        claims: ["Moisturizing and Hydrating", "Lightweight and silky", "Boosted with 82% skincare ingredients", "Non-comedogenic", "Works under and over makeup", "Sheer radiant finish"],
        reviews: 340,
        rating: 4.5
      },
      { 
        id: "f7", 
        name: "The Blotting Powder", 
        tagline: "Oil-absorbing sheer powder", 
        price: 499, 
        image: "/images/Rectangle 144-2.png", 
        colors: ["#FFFDD0"], 
        variants: [
            { name: "Translucent", color: "#FFFDD0", image: "/images/Rectangle 144-2.png" }
        ],
        weight: "10 g",
        whatItIs: "A talc-free, sheer buttermilk yellow blotting powder that absorbs oil, eliminates shine, and illuminates the skin with a soft-matte finish. Lightweight and breathable, it wears comfortably while providing effortless touch-ups throughout the day.",
        whyWeLoveIt: "Blends seamlessly to blur imperfections, reduce pore visibility, and neutralize redness without buildup. Enriched with oil-control spheres, it delivers a natural, fresh-skin finish that lasts from morning to night.",
        claims: ["Oil Control", "Lightweight Texture", "Soft-matte blurring finish", "Touch-up friendly", "Whitening Effect", "Clean formulation"],
        reviews: 210,
        rating: 4.7
      },
      { 
        id: "f5", 
        name: "The Concealer", 
        tagline: "Brightening and lifting liquid", 
        price: 339, 
        image: "/images/Rectangle 145-2.png", 
        colors: ["#EBEBEB"],
        variants: [
            { name: "Fair", color: "#EBEBEB", image: "/images/Rectangle 145-2.png" }
        ],
        weight: "0.12 oz",
        whatItIs: "A high-performance concealer that lifts and brightens with a silky, serum-like formula. Instantly illuminates your under-eye area while delivering long-wearing, self-setting coverage.",
        whyWeLoveIt: "Formulated with Skin Energy Boost Complex, it brightens, lifts, and reduces puffiness while keeping skin hydrated. Buildable coverage and self-setting technology ensure a flawless, all-day finish from day to night.",
        claims: ["Long-wearing formula", "Crease resistant", "Self-setting technology", "Skin-caring formula", "Serum like, easy to blend"],
        reviews: 530,
        rating: 4.6
      },
      { 
        id: "f6", 
        name: "The Multistick", 
        tagline: "Skin-enhancing complexion stick", 
        price: 399, 
        image: "/images/Rectangle 146-1.png", 
        colors: ["#E3C9B0"],
        variants: [
            { name: "Oat", color: "#E3C9B0", image: "/images/Rectangle 146-1.png" }
        ],
        weight: "3 g / 0.11 oz",
        whatItIs: "Skin So Good is a multi-purpose complexion stick that can be used as foundation, concealer, highlighter, or contour. Its soft-matte, natural finish complements every skin tone.",
        whyWeLoveIt: "The lightweight, clean formula is enriched with skin-enhancing ingredients, giving a healthy, radiant finish. Buildable coverage allows you to create your perfect look without feeling heavy.",
        claims: ["Lightweight & buildable", "Oil free", "Soft matte finish", "Clean formula", "8-hours long wear", "Skin-enhancing ingredients"],
        reviews: 190,
        rating: 4.8
      },
    ]
  },
  {
    title: "SKIN",
    description: "Nourishing, high-performance skincare designed to hydrate, protect, and enhance your natural glow.",
    media: "/images/Rectangle 80.png", // Using a placeholder image for SKIN category as none was specific for category video
    mediaType: "image",
    items: [
      { 
        id: "f3", 
        name: "Dream Cream", 
        tagline: "Supercharged hydrating serum", 
        price: 500, 
        image: "/images/Rectangle 144-3.png", 
        colors: ["#FDF3E3"],
        variants: [
            { name: "Standard", color: "#FDF3E3", image: "/images/Rectangle 144-3.png" }
        ],
        weight: "140 g / 50 ml",
        whatItIs: "A serum gel cream that instantly hydrates and revitalizes the skin, leaving a luminous, healthy glow.",
        whyWeLoveIt: "Dream Cream combines hyaluronic acid and ceramides to lock in moisture and reinforce the skin barrier. Infused with niacinamide and powerful antioxidants, it brightens, protects, and nourishes the skin, delivering a luxurious, all-in-one hydration experience.",
        claims: ["Hydrate up to 72 hours", "Paraben free", "Safe for sensitive skin", "Cruelty free", "Non-comedogenic", "Fragrance-free"],
        reviews: 450,
        rating: 5.0
      },
      { 
        id: "s1", 
        name: "Dream Serum", 
        tagline: "Universal daily serum", 
        price: 500, 
        image: "/images/Rectangle 144-4.png", 
        colors: [],
        variants: [
             { name: "Standard", color: "#FDF3E3", image: "/images/Rectangle 144-4.png" }
        ],
        weight: "30 ml / 1.01 oz",
        whatItIs: "A universal daily serum that renews, restores, and protects the skin barrier with every pump. Formulated with a potent blend of peptides, sea fennel extract, and hyaluronic acid, it delivers essential actives to reveal visibly plump, healthy-looking skin.",
        whyWeLoveIt: "Dream Serum combines high-performing ingredients to support the skin barrier while providing intense hydration. Peptides, hyaluronic acid, and sea fennel extract work together to restore, protect, and refresh the skin for a smooth, healthy glow.",
        whatMakesItSoGood: "Designed for sensitive skin, it delivers noticeable results. Peptides visibly plump, hyaluronic acid deeply hydrates, and sea fennel extract brightens, leaving skin resilient, radiant, and hydrated.",
        claims: ["Lightweight", "Suitable for all skin types", "Quick Absorption", "Non comedogenic", "Safe for sensitive skin", "Dermatologically test"],
        reviews: 80,
        rating: 4.9
      },
      { 
        id: "f4", 
        name: "Sun Safe", 
        tagline: "Invisible SPF 50+ serum", 
        price: 350, 
        image: "/images/Rectangle 145-3.png", 
        colors: ["#E3C9B0"],
        variants: [
            { name: "Invisible", color: "#E3C9B0", image: "/images/Rectangle 145-3.png" }
        ],
        weight: "80 g / 50 ml",
        whatItIs: "A lightweight, invisible SPF 50+ PA+++ sunscreen in a serum gel texture. No white cast, no heaviness—just all-day sun protection.",
        whyWeLoveIt: "Infused with niacinamide, peptides, vitamin E, and photoceramides, it protects, hydrates, and nourishes the skin, offering a lightweight, invisible barrier against UV damage while supporting a healthy, radiant complexion.",
        claims: ["Sunscreen and serum", "Fast absorbing", "Dermatologically tested", "Clean and vegan", "Lightweight", "Fragrance free"],
        reviews: 950,
        rating: 5.0
      },
    ]
  },
  {
    title: "EYES",
    description: "Captivate at a glance. From precise liners to volumizing mascaras, define your look with high-impact pigments.",
    media: "/vid/Girl_Applying_Mascara_Video.mp4",
    mediaType: "video",
    items: [
      { 
        id: "e1", 
        name: "Easyline", 
        tagline: "12-hour wear ultra precise liner", 
        price: 299, 
        image: "/images/Rectangle 144-5.png", 
        colors: ["#1A1A1A"],
        variants: [
            { name: "Ink", color: "#1A1A1A", image: "/images/Rectangle 144-5.png" }
        ],
        weight: "1 ml / 0.03 oz",
        whatItIs: "A super-precise liquid eyeliner crafted with an airtight tank system and a precision 360-bristle brush tip, ensuring uninterrupted pigment flow every time.",
        whyWeLoveIt: "Designed for 12-hour longevity, the formula glides on effortlessly for crisp, controlled lines. The airtight reservoir prevents drying, while the ultra-fine brush allows for customizable definition. Simply dip the tip in warm water and air-dry to maintain its shape and flawless application.",
        claims: ["12 hour wear", "Smudge proof", "Ultra-precise tip", "Cruelty free", "Water proof", "Fragrance free"],
        reviews: 310,
        rating: 4.8
      },
      { 
        id: "e2", 
        name: "Eyecrayon", 
        tagline: "Do-it-all eyeshadow stick", 
        price: 299, 
        image: "/images/Rectangle 145-4.png", 
        colors: ["#8D5E4D"],
        variants: [
            { name: "Terra", color: "#8D5E4D", image: "/images/Rectangle 145-4.png" }
        ],
        weight: "0.02 oz",
        whatItIs: "A creamy matte do-it-all eyeshadow stick in one universally flattering shade that enhances your eyes’ natural contours.",
        whyWeLoveIt: "The smooth, buildable formula glides on effortlessly to add soft depth and definition. Designed in a single perfect shade that works on everyone, it elevates your natural eye shape with a subtle, everyday-enhancing finish.",
        claims: ["10-hour wear", "Paraben-free", "Crease proof", "Cruelty free", "Waterproof", "Fragrance free"],
        reviews: 240,
        rating: 4.7
      },
      { 
        id: "e3", 
        name: "Eyeshadow Palette", 
        tagline: "Effortless shades", 
        price: 400, 
        image: "/images/Rectangle 144-6.png",
        colors: ["#A88B7D"],
        variants: [
            { name: "Day", color: "#A88B7D", image: "/images/Rectangle 144-6.png" }
        ],
        whatItIs: "A four-shade eyeshadow palette with versatile tones curated for blending, defining, and building any look you want.",
        whyWeLoveIt: "Makeup Made Healthier – enriched with Vitamin E for hydration and comfort, these shadows stay put all day while keeping your lids soft and protected.",
        reviews: 180,
        rating: 4.5
      },
      { 
        id: "e4", 
        name: "Lash Seeker", 
        tagline: "12-hour wear waterproof mascara", 
        price: 359, 
        image: "/images/Rectangle 146-2.png", 
        colors: ["#1A1A1A"],
        variants: [
            { name: "Black", color: "#1A1A1A", image: "/images/Rectangle 146-2.png" }
        ],
        weight: "3.5 g / 3.3 ml",
        whatItIs: "A waterproof mascara with 12-hour wear and a tiny-but-mighty wand made to catch every lash—yes, even the barely-there ones. With 800 flexible bristles, the ultra-slim wand slips between each lash to lengthen, define, and lift for that effortless, naturally fuller look.",
        whyWeLoveIt: "The precision brush makes defining your lashes super simple—no clumps, no mess, just clean separation. Plus, its conditioning formula fends off water and smudges while treating your lashes to argan oil, camellia oil, and plant squalane for healthier, happier lashes over time.",
        claims: ["Instantly lifts and lengthens", "Paraben free", "100% naturally derived ingredients", "Cruelty free", "Clean formulation", "Fragrance free"],
        reviews: 450,
        rating: 4.8
      },
      { 
        id: "e5", 
        name: "Lashlift", 
        tagline: "Curling, lifting mascara", 
        price: 359, 
        image: "/images/Rectangle 147-1.png", 
        colors: ["#1A1A1A"],
        variants: [
            { name: "Black", color: "#1A1A1A", image: "/images/Rectangle 147-1.png" }
        ],
        weight: "9 g / 0.32 oz",
        whatItIs: "A natural-looking lifting and lengthening mascara that enhances your lashes with a soft, everyday tint.",
        whyWeLoveIt: "The dual-sided brush gives instant eye-opening lift and separates every lash with ease, all while staying gentle on even the most sensitive eyes. Formulated with 100% naturally derived ingredients, it cares for your lashes while you wear it — arginine strengthens, and shea butter plus beeswax keep lashes smooth and conditioned.",
        claims: ["Instantly lifts and lengthens", "Paraben free", "100% naturally derived ingredients", "Cruelty free", "Clean formulation", "Fragrance free"],
        reviews: 320,
        rating: 4.7
      },
      { 
        id: "e6", 
        name: "Velvet Liner", 
        tagline: "Precise definition", 
        price: 445, 
        image: "/images/Rectangle 70.png", 
        colors: ["#5D4037"],
        variants: [
            { name: "Brown", color: "#5D4037", image: "/images/Rectangle 70.png" }
        ],
        whatItIs: "A long-wearing liquid eyeliner with a flexible felt tip for precise definition.",
        reviews: 210,
        rating: 4.6
      },
    ]
  },
  {
    title: "BROWS",
    description: "Frame your face with ease. Sculpt, fluff, and define your brows for a polished look that stays put all day.",
    media: "/vid/Girl_Applying_Mascara_Video.mp4",
    mediaType: "video",
    items: [
      { 
        id: "b1", 
        name: "Grooming Gel", 
        tagline: "Effortless sculpting gel", 
        price: 389, 
        image: "/images/Rectangle 144-7.png", 
        colors: ["#5D4037"],
        variants: [
            { name: "Brown", color: "#5D4037", image: "/images/brows.jpg" }
        ],
        weight: "4.5 g / 0.16 oz",
        whatItIs: "A long-wearing grooming gel that shapes and sets your brows with ease.",
        whyWeLoveIt: "The wax-gel hybrid formula tints, lifts, and adds fullness for effortlessly polished brows. With all-day hold and a precise spoolie, simply brush upward to achieve a soft, feathered finish that stays in place.",
        claims: ["Long wear", "Paraben free", "Smudge-proof", "Cruelty free", "Water-resistant", "Fragrance free"],
        reviews: 890,
        rating: 4.7
      },
      { 
        id: "b2", 
        name: "Micromarker", 
        tagline: "Stay-all-day liquid brow pen", 
        price: 300, 
        image: "/images/Rectangle 144-8.png", 
        colors: ["#4A403A"],
        variants: [
            { name: "Taupe", color: "#4A403A", image: "/images/brows.jpg" }
        ],
        weight: "7.5 g / 0.3 oz",
        whatItIs: "Lifebrow Micromarker is a long-wearing liquid brow detailing pen with an ultra-fine brush tip that delivers precise, natural, hair-like strokes. Its smudgeproof, sweatproof, and waterproof formula keeps your brows in place all day.",
        whyWeLoveIt: "This pen mimics real brow hairs with ease. The ultra-fine brush tip glides smoothly to create soft, realistic strokes, while its airtight tank ensures a skip-free, even flow of pigment every time. Wear it your way — as a brow pen, brown liner, or for faux freckles.",
        claims: ["tip for precision", "Paraben free", "Smudge-proof", "Cruelty free", "Water-resistant", "Fragrance free"],
        reviews: 410,
        rating: 4.5
      },
      { 
        id: "b3", 
        name: "Pomade Pencil", 
        tagline: "Brow defining pomade pencil", 
        price: 200, 
        image: "/images/Rectangle 146-3.png", 
        colors: ["#4A403A"],
        variants: [
            { name: "Taupe", color: "#4A403A", image: "/images/brows.jpg" }
        ],
        weight: "0.08 g / 0.003 oz",
        whatItIs: "A precision pomade pencil designed to shape, define, and naturally fill in your brows.",
        whyWeLoveIt: "We transformed the iconic pomade formula—known for its strong hold and rich pigment—into an easy-to-use pencil for effortless control. The fine tip lets you create soft, hair-like strokes that stay put from morning to night. Make short upward flicks to mimic real brow hairs, then blend and soften with the spoolie for a seamless finish.",
        claims: ["Precise tip for hair-like strokes", "Paraben free", "Brow defining", "Cruelty free", "Shades and fills", "Fragrance free"],
        reviews: 320,
        rating: 4.6
      },
    ]
  },
]

// --- Shop Card Component (Matches Image UI + Variant Logic) ---
const ShopCard = ({ product, onClick, onAdd }: { product: Product, onClick: () => void, onAdd: (p: Product) => void }) => {
  // State to manage the currently displayed image based on variant interaction
  const [activeImage, setActiveImage] = useState(product.image);
  
  // Reset active image when the product prop changes (e.g., during filtering)
  useEffect(() => {
    setActiveImage(product.image);
  }, [product]);

  return (
    <div className="flex flex-col group cursor-pointer items-center" onClick={onClick}>
      {/* 1. Image Container - Beige Rounded Box with High-Res Object-Cover */}
      <div className="relative w-full aspect-[4/5] bg-[#EFECE5] rounded-[32px] overflow-hidden mb-6 transition-all duration-300 group-hover:shadow-lg">
        <img 
          src={activeImage} 
          alt={product.name} 
          // Added transition-all duration-500 for smooth switching between variants
          className="w-full h-full object-cover object-center transition-all duration-500 ease-in-out group-hover:scale-105"
        />
        
        {/* Quick Add Button - Styled for overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
           <Button 
             className="w-full h-10 rounded-full text-xs font-bold uppercase tracking-widest bg-white/90 text-black hover:bg-[#AB462F] hover:text-white backdrop-blur-sm shadow-md" 
             onClick={(e) => {
               e.stopPropagation();
               onAdd(product);
             }}
           >
             Add - ₱{product.price}
           </Button>
        </div>
      </div>

      {/* 2. Text Details - Below Image, Centered */}
      <div className="flex flex-col items-center text-center gap-1.5 px-2">
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-stone-900">{product.name}</h3>
        
        {/* Serif Italic Tagline */}
        <p className="font-serif italic text-xs text-stone-500 tracking-wide line-clamp-1">
            {product.tagline}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-1">
           <div className="flex text-[#AB462F] gap-[1px]">
             {[...Array(5)].map((_, i) => (
               <Star 
                 key={i} 
                 size={10}
                 className={`fill-current ${i < Math.floor(product.rating || 5) ? "" : "opacity-30"}`} 
                 strokeWidth={0}
               />
             ))}
           </div>
           <span className="text-[10px] text-stone-400 font-medium">({product.reviews})</span>
        </div>

        {/* Swatches with Hover Interaction */}
        <div className="flex gap-1.5 mt-2 h-3 justify-center" onClick={(e) => e.stopPropagation()}>
          {product.variants ? (
            product.variants.slice(0, 5).map((v, i) => (
              <button 
                key={i} 
                // Change active image on hover for smooth transition
                onMouseEnter={() => setActiveImage(v.image)}
                // Reset to main image on mouse leave (optional, depends on preference)
                // onMouseLeave={() => setActiveImage(product.image)} 
                className={`w-2.5 h-2.5 rounded-full border border-stone-300 shadow-sm transition-transform duration-200 hover:scale-125 ${activeImage === v.image ? 'ring-1 ring-[#AB462F] ring-offset-1' : ''}`}
                style={{ backgroundColor: v.color }} 
                title={v.name}
                aria-label={`View ${v.name} variant`}
              />
            ))
          ) : (
            product.colors.slice(0, 5).map((c, i) => (
               <div key={i} className="w-2.5 h-2.5 rounded-full border border-stone-300 shadow-sm" style={{ backgroundColor: c }} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  const { toast } = useToast()
  const { addItem } = useCart()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  // --- SEARCH LOGIC IMPLEMENTATION ---
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchQuery = searchParams.get("q")

  const allProducts = useMemo(() => {
    return SHOP_DATA.flatMap(category => 
      category.items.map(item => ({
        ...item,
        category: category.title 
      }))
    )
  }, [])

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return []
    const lowerQuery = searchQuery.toLowerCase().trim()
    
    if (lowerQuery.includes("best") || lowerQuery.includes("seller")) {
        return allProducts.filter(p => (p.rating || 0) >= 4.8 && (p.reviews || 0) > 500)
    }

    if (lowerQuery.includes("set") || lowerQuery.includes("kit")) {
        return allProducts.filter(p => 
            p.name.toLowerCase().includes("duo") || 
            p.name.toLowerCase().includes("palette") ||
            p.tagline.toLowerCase().includes("duo")
        )
    }

    return allProducts.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.tagline.toLowerCase().includes(lowerQuery) ||
      (product.category && product.category.toLowerCase().includes(lowerQuery)) ||
      (product.whatItIs && product.whatItIs.toLowerCase().includes(lowerQuery))
    )
  }, [searchQuery, allProducts])

  const handleClearSearch = () => {
    router.push("/shop")
  }

  const handleAddToCart = (product: Product) => {
    const defaultVariant = product.variants ? product.variants[0] : null;

    addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: defaultVariant ? defaultVariant.image : product.image,
        variant: defaultVariant ? defaultVariant.name : "Standard",
    })
    toast({
      title: "ADDED TO BAG",
      description: `${product.name} - ₱${product.price}`,
      duration: 1500,
    })
  }

  return (
    <div className="w-full bg-transparent text-foreground font-sans selection:bg-[#AB462F] selection:text-white pt-28 pb-32">

      <ProductModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
      />

      <div className="container mx-auto px-6 md:px-12">
        {searchQuery ? (
           <div className="min-h-[60vh]">
              <div className="flex flex-col border-b border-stone-200 pb-8 mb-16">
                 <div className="flex justify-between items-end mb-4">
                    <div>
                        <span className="text-xs font-bold tracking-widest uppercase text-stone-500 mb-2 block">Search Results For</span>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-stone-900">
                        "{searchQuery}"
                        </h1>
                    </div>
                    <button 
                      onClick={handleClearSearch}
                      className="text-xs font-bold tracking-widest uppercase hover:text-[#AB462F] transition-colors mb-2 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" /> Clear
                    </button>
                 </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                {filteredProducts.map((product) => (
                  <ShopCard 
                    key={product.id} 
                    product={product} 
                    onAdd={handleAddToCart}
                    onClick={() => setSelectedProduct(product)} 
                  />
                ))}
              </div>
           </div>
        ) : (
          /* --- STANDARD SHOP ALL VIEW (Default) --- */
          <div className="space-y-20">
            
            {/* --- INTRODUCTORY TEXT (Added Feature) --- */}
            <div className="text-center mb-16 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                    Shop All
                </h1>
                <p className="text-lg text-stone-500 font-light leading-relaxed">
                    Explore our complete collection of consciously crafted beauty essentials. 
                    From breathable skincare to high-impact pigments, find everything you need 
                    to enhance your natural radiance.
                </p>
            </div>

            <div className="space-y-40">
                {SHOP_DATA.map((category) => (
                <section key={category.title} id={category.title.toLowerCase()} className="scroll-mt-32">
                    
                    {/* --- Updated Category Header (Matches Image) --- */}
                    {/* Split Layout: Text Left / Image Right inside Beige Box */}
                    <div className="w-full bg-[#EFECE5] rounded-[40px] overflow-hidden mb-20 flex flex-col md:flex-row min-h-[380px] shadow-sm">
                        {/* Left: Text Content */}
                        <div className="flex-1 p-10 md:p-16 flex flex-col justify-center items-start">
                            <h2 className="text-7xl md:text-8xl font-black text-stone-900 uppercase tracking-tighter mb-6 leading-none">
                                {category.title}
                            </h2>
                            <p className="text-stone-600 text-sm md:text-base font-medium max-w-sm leading-relaxed">
                                {category.description}
                            </p>
                        </div>

                        {/* Right: Media Content */}
                        <div className="flex-1 relative min-h-[300px] md:min-h-full">
                            {category.mediaType === 'video' ? (
                                <video 
                                    src={category.media} 
                                    autoPlay 
                                    loop 
                                    muted 
                                    playsInline 
                                    className="absolute inset-0 w-full h-full object-cover" 
                                />
                            ) : (
                                <img 
                                    src={category.media} 
                                    alt={category.title} 
                                    className="absolute inset-0 w-full h-full object-cover" 
                                />
                            )}
                        </div>
                    </div>

                    {/* --- Updated Product Grid (Matches Image) --- */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16 px-2">
                    {category.items.map((product) => (
                        <ShopCard 
                        key={product.id} 
                        product={product} 
                        onAdd={handleAddToCart}
                        onClick={() => setSelectedProduct(product)} 
                        />
                    ))}
                    </div>
                </section>
                ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}