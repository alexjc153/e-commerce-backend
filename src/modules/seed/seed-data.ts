import * as bcrypt from 'bcrypt';

interface SeedCategory {
  name: string;
  description: string;
}

interface SeedProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId?: string;
}

interface SeedUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface SeedData {
  categories: SeedCategory[];
  products: SeedProduct[];
  users: SeedUser[];
}

export const initialData: SeedData = {
  users: [
    {
      firstName: ' Jimmy Alex',
      lastName: 'Guevara Cruz',
      email: 'alexjc153@gmail.com',
      password: bcrypt.hashSync('140711', 10),
    },
    {
      firstName: 'User',
      lastName: 'Tests',
      email: 'user@test.com',
      password: bcrypt.hashSync('123456', 10),
    },
  ],
  categories: [
    {
      name: 'Laptops',
      description: 'Laptops de todas las marcas y modelos',
    },
    {
      name: 'Unidades de estado sólido',
      description: 'Unidades de estado sólido de todas las marcas',
    },
  ],
  products: [
    {
      name: 'Notebook Lenovo IdeaPad Slim 3 15.6" FHD TN Core i5-12450H 2.0/4.4GHz 16GB LPDDR5-4800MHz',
      description:
        '512GB SSD M.2 2242 PCIe 4.0x4 NVMe, Video Integrado Intel UHD Graphics, Audio HD + User-facing Stereo Speakers / 1.5W x2, optimized with Dolby, Wireless LAN WiFi 6 802.11ax (2x2) + Bluetooth 5.1, Camara Web FHD 1080p con obturador de Privacidad + Microfono 2x Array, Teclado Non-Backlit en español (LA), Bateria integrada de 47Wh, Color Abyss Blue (Azul), SD Card Reader.',
      price: 2990,
      stock: 2,
      images: [],
    },
    {
      name: 'Unidad de estado solido Kingston 1000GB NV3 PCIe 4.0 NVMe M.2 SSD',
      description:
        'Velocidad de Lectura 6000MB/S Velocidad de escritura 4000 MB/S',
      price: 310,
      stock: 10,
      images: [],
    },
    {
      name: 'Notebook ASUS TP3402VA-LZ321W 14.0" WUXGA LED IPS, Core i9-13900H hasta 5.4GHz, 16GB DDR4',
      description:
        '1TB M.2 NVMe PCIe 3.0 SSD, Video Integrado Intel Iris Xᵉ Graphics, Wireless LAN Wi-Fi 6E (802.11ax) (Dual band) 2x2 + Bluetooth 5.3 Wireless Card, Audio Smart Amp Technology / Built-in Speaker & Array Microphone, Camara Web FHD 1080p con obturador de privacidad, FingerPrint, Teclado Retroiluminado tipo Chiclet en Español, Adaptador de poder ø4.5, 90W / Entrada: 100~240V AC 50/60Hz Universal / Salida: 19V DC, 4.74A, Bateria de 50WHrs / 3S1P / 3-Cell Li-ion, Color Quiet Blue (Azul), US MIL-STD 810H military-grade standard, Pantalla Tactil (Touch) Incluye Sistema Operativo Windows 11 Home, 64-bits en español.',
      price: 5349,
      stock: 16,
      images: [],
    },
    {
      name: 'Unidad de estado solido Kingston FURY Renegade 1TB, M.2 2280 PCIe 4.0 x4 NVMe.',
      description:
        'Velocidad de escritura 6000 MB/s, Velocidad de lectura 7300 MB/s, Controlador Phison E18, NAND 3D TLC, Con Disipador termico de aluminio. Dimensiones: 8.00 cm x 2.20 cm x 0.22 cm / Peso: 32.1 gr.',
      price: 560,
      stock: 51,
      images: [],
    },
  ],
};
