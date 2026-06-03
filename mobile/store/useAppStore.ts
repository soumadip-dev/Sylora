import { create } from 'zustand';
import { Product, CartItem, Order, UserProfile, OrderStatus } from '../types';

interface AppState {
  products: Product[];
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  orders: Order[];
  user: UserProfile;

  // Actions
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: () => void;
  returnOrder: (orderId: string) => void;
  updateUserAddress: (newAddress: string) => void;
}

// Full product catalog based on the Stitch UI designs
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Silk-Trimmed Blazer',
    price: 42500,
    brand: 'Aurelia Paris',
    category: 'Apparel',
    description:
      'A masterpiece of contemporary tailoring, this blazer is cut from superfine wool with silk-satin lapels. Features structured shoulders and a cinched waist for an elegant silhouette.',
    image:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
    sizes: ['FR 36', 'FR 38', 'FR 40', 'FR 42'],
    colors: ['Midnight Black', 'Ivory Cream'],
    isExclusive: true,
  },
  {
    id: 'p2',
    title: 'Midnight Chronograph',
    price: 89000,
    brand: "L'Heure",
    category: 'Watches',
    description:
      'Designed for precision and timeless appeal, this chronograph features a matte-black stainless steel case, sapphire crystal glass, and a hand-stitched alligator leather strap.',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    sizes: ['40mm', '42mm'],
    colors: ['Midnight Blue', 'Stealth Black'],
  },
  {
    id: 'p3',
    title: 'Essential Cashmere',
    price: 12999,
    brand: 'Studio Core',
    category: 'Apparel',
    description:
      'Sourced from the highlands of Mongolia, this crewneck sweater is knitted from ultra-soft 100% cashmere. Breathable, exceptionally warm, and designed for versatile layering.',
    image:
      'https://images.unsplash.com/photo-1667586680656-6b8e381cddb5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Heather Grey', 'Oatmeal', 'Camel'],
  },
  {
    id: 'p4',
    title: 'Structured Tote',
    price: 56000,
    brand: 'Maison M',
    category: 'Bags',
    description:
      'Crafted from pebbled Italian leather, this structured tote is the ultimate companion for the modern professional. Spacious compartment with a padded laptop divider.',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    sizes: ['Standard'],
    colors: ['Tan', 'Black', 'Forest Green'],
  },
  {
    id: 'p5',
    title: 'Air Jordan Retro',
    price: 18300,
    brand: 'Nike',
    category: 'Footwear',
    description:
      'The iconic classic, redesigned for modern luxury styling. Features premium full-grain leather overlays and the signature air-sole unit for unmatched comfort.',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: ['Chicago Red', 'Obsidian Blue'],
  },
  {
    id: 'p6',
    title: 'Air Max Alpha',
    price: 9500,
    brand: 'Nike',
    category: 'Footwear',
    description:
      'Engineered for stability and dynamic cushioning. Lightweight mesh upper reinforced with synthetic skins to handle high-impact movements.',
    image:
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80',
    sizes: ['UK 8', 'UK 9', 'UK 10'],
    colors: ['Wolf Grey', 'Volt Black'],
  },
  {
    id: 'p7',
    title: "Blazer Mid '77",
    price: 8200,
    brand: 'Nike',
    category: 'Footwear',
    description:
      'Vintage basketball style optimized for lifestyle wear. Suede accents, retro swoosh branding, and a vulcanized outsole for a classic broken-in feel.',
    image:
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: ['Vintage White', 'Black Suede'],
  },
  {
    id: 'p8',
    title: 'Zoom Fly 5',
    price: 14900,
    brand: 'Nike',
    category: 'Footwear',
    description:
      'Bridging the gap between weekend training runs and race day. Features ZoomX foam and a carbon-fiber plate for maximum energy return.',
    image:
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80',
    sizes: ['UK 8', 'UK 9', 'UK 10'],
    colors: ['Hyper Orange', 'Ocean Blue'],
  },
  {
    id: 'p9',
    title: 'The Artisan Loafer v.II',
    price: 24500,
    brand: 'Footwear',
    category: 'Footwear',
    description:
      'Hand-finished by master artisans in our Italian atelier, the Artisan Loafer v.II features glove-soft calfskin leather and a reinforced shank for unmatched structural integrity. The signature gold-tone hardware provides a touch of quiet luxury for the modern discerning gentleman.',
    image:
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80',
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: ['Cognac Brown', 'Nero Black'],
    isExclusive: true,
  },
  {
    id: 'p10',
    title: 'The Skyline Runner',
    price: 18900,
    brand: 'Footwear',
    category: 'Footwear',
    description:
      'Premium casual trainer crafted from high-performance knit and nubuck leather panels. Ultra-responsive custom foam footbed.',
    image:
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=600&q=80',
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: ['Slate Grey', 'Off-White'],
  },
  {
    id: 'p11',
    title: 'Nightfall Derby',
    price: 31200,
    brand: 'Formal',
    category: 'Footwear',
    description:
      'Exquisite formal shoes crafted from premium patent leather. Sleek profile with hand-painted leather outsoles.',
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
    sizes: ['UK 8', 'UK 9', 'UK 10'],
    colors: ['Polished Black', 'Burgundy'],
  },
  {
    id: 'p12',
    title: 'Azure Suede Slip-on',
    price: 21400,
    brand: 'Casual Luxe',
    category: 'Footwear',
    description:
      'Sleek slip-ons in Italian suede. Treated with water-resistant coating, featuring a soft leather lining and flexible rubber sole.',
    image:
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80',
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: ['Royal Azure', 'Sand Beige'],
  },
  // Cart items
  {
    id: 'p13',
    title: 'Oud & Amber Nuit',
    price: 14500,
    brand: 'Sylora Private Collection',
    category: 'Fragrance',
    description:
      'An opulent blend of dark Cambodian oud, absolute amber, and warm spices. Evocative, mysterious, and long-lasting.',
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80',
    sizes: ['50ml', '100ml'],
    colors: ['Classic Gold'],
  },
  {
    id: 'p14',
    title: 'Chronos Gold III',
    price: 42000,
    brand: 'Heritage Artisans',
    category: 'Watches',
    description:
      'Indulge in pure gold casing combined with a modern Swiss automatic movement. A timeless watch designed to pass down generations.',
    image:
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80',
    sizes: ['38mm', '40mm'],
    colors: ['Yellow Gold', 'Rose Gold'],
  },
  {
    id: 'p15',
    title: 'Bespoke Slim Wallet',
    price: 8900,
    brand: 'Essential Crafts',
    category: 'Accessories',
    description:
      'Minimalist wallet made from full-grain vegetable-tanned leather. Holds up to 8 cards and cash without bulk.',
    image:
      'https://images.unsplash.com/photo-1614330315526-166f2d71e544?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    sizes: ['Standard'],
    colors: ['Nero Black', 'Tan Leather', 'Cognac'],
  },
  // Wishlist items
  {
    id: 'p16',
    title: 'Chronos Heritage IV',
    price: 48000,
    brand: 'Heritage Artisans',
    category: 'Watches',
    description:
      'Classic silver-cased automatic watch with Roman numerals and blue steel Breguet hands. Exhibition case back.',
    image:
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
    sizes: ['40mm'],
    colors: ['Sterling Silver'],
  },
  {
    id: 'p17',
    title: 'Azure Silk Wrap',
    price: 12500,
    brand: 'Aurelia Paris',
    category: 'Accessories',
    description:
      'Pure Mulberry silk scarf hand-printed with bespoke abstract patterns in deep azure and gold.',
    image:
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    sizes: ['One Size'],
    colors: ['Azure & Gold'],
  },
  {
    id: 'p18',
    title: 'Monolith Leather Tote',
    price: 38000,
    brand: 'Maison M',
    category: 'Bags',
    description:
      'Unstructured, extra-spacious tote crafted from durable, double-faced drum-dyed calfskin leather.',
    image:
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    sizes: ['Standard'],
    colors: ['Stone Grey', 'Nero Black'],
  },
  {
    id: 'p19',
    title: 'Velvet Oud Extract',
    price: 15500,
    brand: 'Sylora Private Collection',
    category: 'Fragrance',
    description:
      'Highly concentrated pure perfume extract combining dark roses, rich leather, and pure agarwood oud.',
    image:
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
    sizes: ['50ml'],
    colors: ['Velvet Crimson'],
  },
  {
    id: 'p20',
    title: 'Everwhite Linen Shirt',
    price: 6800,
    brand: 'Studio Core',
    category: 'Apparel',
    description:
      'Breathable, relaxed-fit shirt made from high-grade Irish linen. Features a band collar and mother-of-pearl buttons.',
    image:
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Optic White'],
  },
];

// Helper to generate ISO dates relative to now
const daysAgo = (num: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - num);
  return date.toISOString();
};

export const useAppStore = create<AppState>(set => ({
  products: MOCK_PRODUCTS,

  // Initial cart matching the Stitch "Shopping Cart" design
  cart: [
    {
      id: 'p13-100ml-ClassicGold',
      product: MOCK_PRODUCTS.find(p => p.id === 'p13')!,
      selectedSize: '100ml',
      selectedColor: 'Classic Gold',
      quantity: 1,
    },
    {
      id: 'p14-40mm-YellowGold',
      product: MOCK_PRODUCTS.find(p => p.id === 'p14')!,
      selectedSize: '40mm',
      selectedColor: 'Yellow Gold',
      quantity: 1,
    },
    {
      id: 'p15-Standard-NeroBlack',
      product: MOCK_PRODUCTS.find(p => p.id === 'p15')!,
      selectedSize: 'Standard',
      selectedColor: 'Nero Black',
      quantity: 1,
    },
  ],

  // Initial wishlist matching the Stitch "Wishlist" design
  wishlist: ['p16', 'p17', 'p18', 'p19', 'p20'],

  // Prepopulated orders, including historical ones and recently delivered ones for return window checks
  orders: [
    {
      id: 'o1',
      orderNumber: 'SL-884930-IN',
      orderDate: daysAgo(3),
      deliveryDate: daysAgo(2), // 2 days ago, which is <= 7 days. ELIGIBLE FOR RETURN.
      items: [
        {
          productId: 'p1',
          title: 'Silk-Trimmed Blazer',
          price: 42500,
          quantity: 1,
          image:
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
          selectedSize: 'FR 38',
          selectedColor: 'Midnight Black',
        },
      ],
      totalAmount: 42500,
      status: 'Delivered',
      shippingAddress:
        '42nd Avenue, Penthouse Suite B Upper East Side, Manhattan New York, NY 10021',
    },
    {
      id: 'o2',
      orderNumber: 'SL-772910-IN',
      orderDate: '2023-10-12T10:00:00Z',
      deliveryDate: '2023-10-15T14:30:00Z', // Delivered, but > 7 days ago. NOT ELIGIBLE FOR RETURN.
      items: [
        {
          productId: 'p2',
          title: 'Midnight Chronograph',
          price: 89000,
          quantity: 1,
          image:
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
          selectedSize: '42mm',
          selectedColor: 'Stealth Black',
        },
      ],
      totalAmount: 89000,
      status: 'Delivered',
      shippingAddress:
        '42nd Avenue, Penthouse Suite B Upper East Side, Manhattan New York, NY 10021',
    },
    {
      id: 'o3',
      orderNumber: 'SL-654921-IN',
      orderDate: '2023-09-28T09:15:00Z',
      deliveryDate: '2023-10-01T12:00:00Z', // Delivered, > 7 days ago. NOT ELIGIBLE FOR RETURN.
      items: [
        {
          productId: 'p20',
          title: 'Everwhite Linen Shirt',
          price: 6800,
          quantity: 1,
          image:
            'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80',
          selectedSize: 'M',
          selectedColor: 'Optic White',
        },
      ],
      totalAmount: 6800,
      status: 'Delivered',
      shippingAddress:
        '42nd Avenue, Penthouse Suite B Upper East Side, Manhattan New York, NY 10021',
    },
    {
      id: 'o4',
      orderNumber: 'SL-993801-IN',
      orderDate: daysAgo(1),
      items: [
        {
          productId: 'p4',
          title: 'Structured Tote',
          price: 56000,
          quantity: 1,
          image:
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
          selectedSize: 'Standard',
          selectedColor: 'Tan',
        },
      ],
      totalAmount: 56000,
      status: 'Processing', // Processing, NOT DELIVERED. CANNOT RETURN.
      shippingAddress:
        '42nd Avenue, Penthouse Suite B Upper East Side, Manhattan New York, NY 10021',
    },
  ],

  user: {
    name: 'Julianne Sterling',
    email: 'julianne.s@luxurymail.com',
    address: '42nd Avenue, Penthouse Suite B Upper East Side, Manhattan New York, NY 10021',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },

  addToCart: (product, size, color, quantity = 1) =>
    set(state => {
      const id = `${product.id}-${size}-${color}`;
      const existingIndex = state.cart.findIndex(item => item.id === id);

      if (existingIndex > -1) {
        const updatedCart = [...state.cart];
        updatedCart[existingIndex].quantity += quantity;
        return { cart: updatedCart };
      } else {
        const newItem: CartItem = {
          id,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity,
        };
        return { cart: [...state.cart, newItem] };
      }
    }),

  removeFromCart: cartItemId =>
    set(state => ({
      cart: state.cart.filter(item => item.id !== cartItemId),
    })),

  updateCartQuantity: (cartItemId, quantity) =>
    set(state => ({
      cart: state.cart.map(item =>
        item.id === cartItemId ? { ...item, quantity: Math.max(1, quantity) } : item
      ),
    })),

  clearCart: () => set({ cart: [] }),

  toggleWishlist: productId =>
    set(state => {
      const isWishlisted = state.wishlist.includes(productId);
      const updatedWishlist = isWishlisted
        ? state.wishlist.filter(id => id !== productId)
        : [...state.wishlist, productId];
      return { wishlist: updatedWishlist };
    }),

  placeOrder: () =>
    set(state => {
      if (state.cart.length === 0) return {};

      const newOrder: Order = {
        id: `o${state.orders.length + 1}-${Date.now()}`,
        orderNumber: `SL-${Math.floor(100000 + Math.random() * 900000)}-IN`,
        orderDate: new Date().toISOString(),
        // Auto-simulate delivery in 2 days for simulation, but initially marked as 'Processing'
        items: state.cart.map(item => ({
          productId: item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        })),
        totalAmount: state.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        status: 'Processing',
        shippingAddress: state.user.address,
      };

      return {
        orders: [newOrder, ...state.orders],
        cart: [],
      };
    }),

  returnOrder: orderId =>
    set(state => ({
      orders: state.orders.map(order =>
        order.id === orderId ? { ...order, status: 'Returned' as OrderStatus } : order
      ),
    })),

  updateUserAddress: newAddress =>
    set(state => ({
      user: { ...state.user, address: newAddress },
    })),
}));
export default useAppStore;
