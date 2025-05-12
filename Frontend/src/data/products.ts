export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'mens' | 'womens' | 'caps' | 'bags' | 'shoes' | 'unisex';
  images: string[];
  sizes: string[];
  colors: string[];
  quantity: number;
  status: 'available' | 'low-stock' | 'sold-out';
}

export const products: Product[] = [
  
  {
    id: '2',
    name: 'Urban Oversize Tee - Unisex',
    price: 2500.00,
    description: 'Cotton interlock 220gsm with minimalist design and superior comfort.',
    category: 'unisex',
    images: [
      'https://i.ibb.co/F4sy3p0/DSC04648.png',
      'https://i.ibb.co/7kQRyFZ/DSC04649.png',
      'https://i.ibb.co/J5T2tWG/DSC04655.png',
      'https://i.ibb.co/Wtg2h5T/DSC04657.png',
      'https://i.ibb.co/9rYqr4w/DSC04663.png'
    ],
    sizes: ['Xs', 'S', 'M', 'L'],
    colors: ['Black'],
    quantity: 0,
    status: 'sold-out'
  },
  {
    id: '3',
    name: 'Retro Oversize Tee - Unisex',
    price: 2300.00,
    description: 'Cotton interlock 220gsm with minimalist design and superior comfort.',
    category: 'unisex',
    images: [
      'https://i.ibb.co/jVp9xsN/DSC04628.png',
      'https://i.ibb.co/GkQXfb7/DSC04633.png',
      'https://i.ibb.co/Rz5QLXK/DSC04620.png',
      'https://i.ibb.co/K7N0rDQ/DSC04617.png',
      
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black'],
    quantity: 0,
    status: 'sold-out'
  },
  {
    id: '4',
    name: 'Cannibal Desire Oversize Tee - Unisex',
    price: 2000.00,
    description: 'Cotton interlock 220gsm with minimalist design featuring a subtle Cannibal wording logo embroidered on the front for a sleek look.',
    category: 'unisex',
    images: [
      'https://i.ibb.co/G5s01QC/DSC04677.png',
      'https://i.ibb.co/9bn63ZM/DSC04695.png',
      'https://i.ibb.co/xH6JW9x/DSC04705.png',
      
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black'],
    quantity: 0,
    status: 'sold-out'
  },
  {
    id: '5',
    name: 'Deluxe Oversize Tee',
    price: 2300.00,
    description: 'Cotton interlock 220gsm with superior comfort.',
    category: 'unisex',
    images: [
      'https://i.ibb.co/p0zQbMD/DSC04717.png',
      'https://i.ibb.co/BKPP7bk/DSC04714.png',
      'https://i.ibb.co/Tvbnx02/DSC04728.png',
      'https://i.ibb.co/K7N0rDQ/DSC04617.png',
      'https://i.ibb.co/M5h6xLP/DSC04730.png',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black'],
    quantity: 0,
    status: 'sold-out'
  },
  {
    id: '6',
    name: 'Classic Oversize Tee - Unisex',
    price: 2200.00,
    description: '100% cotton with minimalist design and superior comfort.',
    category: 'unisex',
    images: [
      'https://i.ibb.co/bBsr0tH/DSC07648.png',
      'https://i.ibb.co/dDN5B2s/DSC07656.png',
      'https://i.ibb.co/GFznjbP/DSC07682.png',
      'https://i.ibb.co/T0Yr2jr/DSC07702.png',
      'https://i.ibb.co/dDx9DLr/DSC07705.png',
      'https://i.ibb.co/mt2Tc6P/DSC07710.png',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black', 'White', 'Green', 'Brown'],
    quantity: 7,
    status: 'available'
  },
  {
    id: '7',
    name: 'Finished Oversize Tee - Unisex',
    price: 2350.00,
    description: '100% cotton with minimalist design and superior comfort.',
    category: 'unisex',
    images: [
      'https://i.ibb.co/VW2rPph/DSC07603.png',
      'https://i.ibb.co/QJM0TMP/DSC07607.png',
      'https://i.ibb.co/Rz5QLXK/DSC04620.png',
      'https://i.ibb.co/2Ff35RM/DSC07632.png',
      'https://i.ibb.co/YLXWMwG/DSC07633.png',
      'https://i.ibb.co/Wn70ZjT/DSC07721.png',
      'https://i.ibb.co/2kHmqCy/DSC07691.png',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black', 'White', 'Green', 'Brown'],
    quantity: 9,
    status: 'available'
  }
];
