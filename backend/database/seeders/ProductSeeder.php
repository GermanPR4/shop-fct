<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductDetail;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // --- 1. OBTENER/CREAR CATEGORÍAS ---
        // (Asegúrate de que CategorySeeder se ejecuta antes en DatabaseSeeder.php)
        $casual = Category::firstOrCreate(['name' => 'Casual']);
        $sport = Category::firstOrCreate(['name' => 'Deportivo']);
        $winter = Category::firstOrCreate(['name' => 'Invierno']);
        $summer = Category::firstOrCreate(['name' => 'Veraniego']);
        $dress = Category::firstOrCreate(['name' => 'De Vestir']);
        $ofertas = Category::firstOrCreate(['name' => 'Ofertas']);

        // --- 2. CREAR PRODUCTOS Y VARIANTES ---

        // 1. Sudadera (Existente)
        $sudadera = Product::updateOrCreate(
            ['name' => 'Hoodrich Sudadera con capucha Flash'],
            [
                'short_description' => 'Sudadera con capucha Hoodrich Flash para hombre, de corte oversize y color rosa pálido. Suave tejido de felpa con capucha fija, mangas caídas y ribetes acanalados para un look moderno y cómodo.',
                'long_description' => 'La sudadera con capucha Hoodrich Flash es la prenda ideal para elevar tu estilo urbano sin renunciar a la comodidad. Confeccionada en un suave tejido de felpa (80% algodón y 20% poliéster), presenta un tono rosa pálido y un ajuste oversize que aporta una silueta relajada.
El diseño incorpora gráficos Hoodrich llamativos, capucha fija, mangas caídas y acabados acanalados en puños y dobladillo para un look limpio y moderno.

Perfecta para combinar con vaqueros o joggers, esta sudadera es una apuesta segura tanto para tus días de descanso como para tu estilo streetwear.
Lavable a máquina.
El modelo mide 1,83 m, tiene un pecho de 96,5 cm y lleva una talla M.',
                'price' => 80.99,
                'is_active' => true,
            ]
        );
        $detailsSudadera = [
            ['color' => 'Rosa', 'size' => 'XS', 'stock' => 15, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_777351_c?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Rosa', 'size' => 'S', 'stock' => 15, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_777351_c?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Rosa', 'size' => 'M', 'stock' => 15, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_777351_c?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Rosa', 'size' => 'L', 'stock' => 15, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_777351_c?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Rosa', 'size' => 'XL', 'stock' => 15, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_777351_c?qlt=92&w=950&h=1212&v=1&fmt=auto'],
        ];
        foreach ($detailsSudadera as $detail)
            $sudadera->details()->updateOrCreate(['color' => $detail['color'], 'size' => $detail['size']], $detail);
        $sudadera->categories()->sync([$casual->id, $winter->id]);

        // 2. Zapatillas (Existente)
        $zapatillas = Product::updateOrCreate(
            ['name' => 'Nike Winflo 11'],
            [
                'short_description' => 'Zapatillas ligeras y cómodas para running diario o entrenamiento. Amortiguación reactiva y ajuste adaptable para una pisada fluida y estable.',
                'long_description' => 'Las Nike Winflo 11 ofrecen una combinación perfecta entre comodidad, ligereza y rendimiento. Diseñadas para tus entrenamientos diarios o carreras de larga distancia, incorporan una mediasuela con espuma Cushlon 3.0 y una unidad Nike Air completa, que proporcionan una amortiguación reactiva y retorno de energía excelente.

Su parte superior de malla Engineered Mesh mejora la transpirabilidad y el ajuste, mientras que la banda elástica en el mediopié y el antepié más ancho garantizan una pisada estable y adaptable.

La suela exterior de goma con diseño tipo gofre asegura una tracción fiable en todo tipo de superficies. Además, los detalles reflectantes mejoran la visibilidad en condiciones de poca luz.

Con un peso aproximado de 325 g (talla 44) y un drop de 10 mm, las Winflo 11 proporcionan una sujeción neutra ideal tanto para sesiones largas como cortas, ofreciendo una transición suave del talón a la puntera.',
                'price' => 110.00,
                'is_active' => true,
            ]
        );
        $detailsZapatillas = [
            ['color' => 'Blanco/Azul', 'size' => '42', 'stock' => 12, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_773404_a?qlt=92&w=950&h=673&v=1&fmt=auto'],
            ['color' => 'Negro/Blanco', 'size' => '43', 'stock' => 8, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_700293_a?qlt=92&w=950&h=673&v=1&fmt=auto'],
            ['color' => 'Negro', 'size' => '44', 'stock' => 15, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_700294_a?qlt=92&w=950&h=673&v=1&fmt=auto'],
        ];
        foreach ($detailsZapatillas as $detail)
            $zapatillas->details()->updateOrCreate(['color' => $detail['color'], 'size' => $detail['size']], $detail);
        $zapatillas->categories()->sync([$sport->id]);

        // 3. Camiseta Básica (Descripción completada)
        $camiseta = Product::updateOrCreate(
            ['name' => 'EA7 Emporio Armani Camiseta Tape Large Logo'],
            [
                'short_description' => 'Camiseta EA7 Emporio Armani Tape Large Logo para hombre, en negro con detalles dorados. Confeccionada en suave algodón 100% con cuello redondo y logo EA7 en el pecho.',
                'long_description' => 'Eleva tu estilo casual con la camiseta EA7 Emporio Armani Tape Large Logo, una prenda que combina la elegancia italiana con la comodidad del día a día.
Confeccionada en 100% algodón suave, ofrece una sensación ligera y agradable sobre la piel. Presenta un diseño en color negro con detalles dorados, un cuello redondo de canalé y mangas cortas con la marca grabada en los puños.

El gran logo EA7 Emporio Armani en el pecho añade un toque distintivo y sofisticado, ideal para quienes buscan un look premium sin esfuerzo.
Lavable a máquina.
El modelo mide 1,90 m, tiene 94 cm de pecho y lleva la talla M.',
                'price' => 70.95,
                'is_active' => true,
            ]
        );
        $detailsCamiseta = [
            ['color' => 'Blanco', 'size' => 'XS', 'stock' => 50, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_764133_a?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Blanco', 'size' => 'S', 'stock' => 50, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_764133_a?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Blanco', 'size' => 'M', 'stock' => 50, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_764133_a?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Blanco', 'size' => 'L', 'stock' => 60, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_764133_a?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Negro', 'size' => 'S', 'stock' => 35, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_764134_b?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Negro', 'size' => 'M', 'stock' => 40, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_764134_b?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Negro', 'size' => 'L', 'stock' => 35, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_764134_b?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Negro', 'size' => 'XL', 'stock' => 40, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_764134_b?qlt=92&w=950&h=1212&v=1&fmt=auto'],
        ];
        foreach ($detailsCamiseta as $detail)
            $camiseta->details()->updateOrCreate(['color' => $detail['color'], 'size' => $detail['size']], $detail);
        $camiseta->categories()->sync([$casual->id, $summer->id]);

        // 4. Pantalón Chino (Descripción completada)
        $pantalon = Product::updateOrCreate(
            ['name' => 'Adidas Pantalón Ultimate365 Tapered Golf'],
            [
                'short_description' => 'Pantalones de golf adidas Ultimate365 para hombre. Tejido técnico ultraelástico, corte clásico con pernera ajustada y acabado repelente al agua. Comodidad, estilo y libertad de movimiento.',
                'long_description' => 'Los pantalones adidas Ultimate365 combinan confort, rendimiento y estilo atemporal para tus jornadas de golf o cualquier ocasión casual elegante.
Con un corte clásico que se estrecha a la altura del puño, ofrecen un ajuste moderno que evita distracciones y favorece la libertad de movimiento.

Fabricados en un tejido técnico ultraelástico (88% poliéster reciclado y 12% elastano), permiten flexionarte, girar y agacharte con total comodidad. Además, su acabado repelente al agua (DWR) y su protección UV te mantienen preparado frente a cualquier condición.

Incluyen bolsillos funcionales delanteros y traseros, perfectos para guardar tees o la tarjeta de golpes.
Este producto contiene al menos un 70% de materiales reciclados, ayudando a reducir residuos y el impacto ambiental sin renunciar al rendimiento.',
                'price' => 80.00,
                'is_active' => true,
            ]
        );
        $detailsPantalon = [
            ['color' => 'Negro', 'size' => '30', 'stock' => 18, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_IT7859_a?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Negro', 'size' => '32', 'stock' => 22, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_IT7859_a?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Negro', 'size' => '34', 'stock' => 15, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_IT7859_a?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Negro', 'size' => '36', 'stock' => 12, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_IT7859_a?qlt=92&w=950&h=1212&v=1&fmt=auto'],
        ];
        foreach ($detailsPantalon as $detail)
            $pantalon->details()->updateOrCreate(['color' => $detail['color'], 'size' => $detail['size']], $detail);
        $pantalon->categories()->sync([$dress->id, $casual->id]);

        // 5. Chaqueta Impermeable (NUEVO)
        $chaqueta = Product::updateOrCreate(
            ['name' => 'MONTIREX Chaqueta Trail 3.0'],
            [
                'short_description' => 'Chaqueta Montirex Trail 3.0 para hombre, ligera y resistente al agua. Con capucha abatible, cierre de cremallera y logotipo reflectante en el pecho para un estilo funcional y moderno.',
                'long_description' => 'La chaqueta Montirex Trail 3.0 combina protección, comodidad y estilo deportivo. Su revestimiento impermeable en las zonas de trail proporciona resistencia frente al viento y la lluvia, mientras que su diseño ligero permite llevarla en capas sobre una camiseta o sudadera.

Incorpora capucha abatible y cierre de cremallera completo, ofreciendo una protección adicional en condiciones adversas. El logotipo reflectante Montirex en el pecho aporta visibilidad y un toque moderno al diseño.

Fabricada con 91% poliéster y 9% elastano, esta chaqueta es duradera, flexible y fácil de lavar a máquina.
El modelo mide 1,85 m, tiene 91 cm de pecho y lleva la talla M.',
                'price' => 85.00,
                'is_active' => true,
            ]
        );
        $detailsChaqueta = [
            ['color' => 'Negro', 'size' => 'XS', 'stock' => 10, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_770094_b?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Negro', 'size' => 'S', 'stock' => 12, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_770094_b?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Negro', 'size' => 'M', 'stock' => 20, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_770094_b?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Negro', 'size' => 'L', 'stock' => 18, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_770094_b?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Negro', 'size' => 'XL', 'stock' => 11, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_770094_b?qlt=92&w=950&h=1212&v=1&fmt=auto'],
        ];
        foreach ($detailsChaqueta as $detail)
            $chaqueta->details()->updateOrCreate(['color' => $detail['color'], 'size' => $detail['size']], $detail);
        $chaqueta->categories()->sync([$sport->id, $winter->id]);

        // 6. Vestido Verano (NUEVO)
        $vestido = Product::updateOrCreate(
            ['name' => 'Adidas Vestido adidas X FARM prémium'],
            [
                'short_description' => 'Vestido adidas x FARM para mujer, entallado con estampado de mariposa inspirado en Colombia. Tejido suave y elástico que ofrece libertad de movimiento y estilo vibrante.',
                'long_description' => 'El vestido prémium adidas x FARM celebra la belleza, la fuerza femenina y la cultura latinoamericana a través de un vibrante estampado de mariposa en toda la prenda. Con corte entallado y cuello redondo, el diseño resalta la silueta femenina sin limitar la libertad de movimiento, perfecto para bailar, pasear o disfrutar de un look lleno de estilo.

Fabricado en 85% poliéster reciclado y 15% elastano, su tejido interlock es suave, flexible y cómodo durante todo el día. Un vestido que combina moda, cultura y sostenibilidad, ideal para destacar en cualquier ocasión.',
                'price' => 115.50,
                'is_active' => true,
            ]
        );
        $detailsVestido = [
            ['color' => 'Negro con estampado mariposa', 'size' => 'S', 'stock' => 20, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_JL8610_a?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Negro con estampado mariposa', 'size' => 'M', 'stock' => 10, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_JL8610_a?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Negro con estampado mariposa', 'size' => 'L', 'stock' => 15, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_JL8610_a?qlt=92&w=950&h=1212&v=1&fmt=auto'],
        ];
        foreach ($detailsVestido as $detail)
            $vestido->details()->updateOrCreate(['color' => $detail['color'], 'size' => $detail['size']], $detail);
        $vestido->categories()->sync([$summer->id, $casual->id]);

        // 7. Zapatos de Vestir (NUEVO)
        $zapatos = Product::updateOrCreate(
            ['name' => 'Timberland Botas Utility 6 pulgadas'],
            [
                'short_description' => 'Botas Timberland utilitarias para hombre, de 15 cm con ante nobuk y paneles textiles. Cuello acolchado, suela de goma con tacos y estilo resistente para cualquier terreno.',
                'long_description' => 'Las botas Timberland utilitarias combinan durabilidad, comodidad y estilo icónico. Con 15 cm de altura, cuentan con parte superior de ante nobuk suave y paneles textiles, ofreciendo soporte y flexibilidad en cada paso.

El cuello alto y acolchado asegura un ajuste firme y cómodo, mientras que la suela de goma con tacos proporciona tracción excelente en terrenos difíciles. De color beige topo y con la marca Timberland en el lateral, estas botas son perfectas tanto para aventuras al aire libre como para un estilo urbano robusto.

Fabricadas con Leather & Textile Upper y suela sintética, garantizan resistencia y comodidad durante todo el día.',
                'price' => 120.00,
                'is_active' => true,
            ]
        );
        $detailsZapatos = [
            ['color' => 'Negro', 'size' => '41', 'stock' => 10, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_771338_a?qlt=92&w=950&h=673&v=1&fmt=auto'],
            ['color' => 'Negro', 'size' => '42', 'stock' => 15, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_771338_a?qlt=92&w=950&h=673&v=1&fmt=auto'],
            ['color' => 'Negro', 'size' => '43', 'stock' => 10, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_771338_a?qlt=92&w=950&h=673&v=1&fmt=auto'],
            ['color' => 'Negro', 'size' => '44', 'stock' => 15, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_771338_a?qlt=92&w=950&h=673&v=1&fmt=auto'],
            ['color' => 'Negro', 'size' => '45', 'stock' => 15, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_771338_a?qlt=92&w=950&h=673&v=1&fmt=auto'],
            ['color' => 'Marrón Claro', 'size' => '42', 'stock' => 8, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_771342_a?qlt=92&w=950&h=673&v=1&fmt=auto'],
            ['color' => 'Marrón Claro', 'size' => '43', 'stock' => 9, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_771342_a?qlt=92&w=950&h=673&v=1&fmt=auto'],
            ['color' => 'Marrón Claro', 'size' => '44', 'stock' => 9, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_771342_a?qlt=92&w=950&h=673&v=1&fmt=auto'],
        ];
        foreach ($detailsZapatos as $detail)
            $zapatos->details()->updateOrCreate(['color' => $detail['color'], 'size' => $detail['size']], $detail);
        $zapatos->categories()->sync([$dress->id]);

        // 8. Gorra (NUEVO)
        $gorra = Product::updateOrCreate(
            ['name' => 'Adidas Gorra Adicolor Classic Trefoil Baseball'],
            [
                'short_description' => 'Gorra adidas Adicolor para hombre, de sarga de algodón resistente. Talla única, visera curvada y cierre de hebilla con el icónico logo del trébol en la parte frontal.',
                'long_description' => 'La gorra adidas Adicolor combina estilo clásico y confort diario. Fabricada en 100% algodón de sarga, ofrece un tacto suave y gran durabilidad que mejora con el uso.

Su visera curvada protege del sol y el cierre de hebilla ajustable permite un ajuste perfecto a cualquier cabeza. El logo del trébol en la parte frontal añade un toque deportivo y atemporal, ideal para looks casuales, deportivos o urbanos.
Talla única.',
                'price' => 22.00,
                'is_active' => true,
            ]
        );
        $detailsGorra = [
            ['color' => 'Verde', 'size' => 'Única', 'stock' => 50, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_JV7390_a?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Gris', 'size' => 'Única', 'stock' => 50, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_JV7388_a?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Azul Oscuro', 'size' => 'Única', 'stock' => 45, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_JV7391_a?qlt=92&w=950&h=1212&v=1&fmt=auto'],
            ['color' => 'Morado', 'size' => 'Única', 'stock' => 30, 'image_url' => 'https://i8.amplience.net/i/jpl/jd_JZ4930_a?qlt=92&w=950&h=1212&v=1&fmt=auto'],
        ];
        foreach ($detailsGorra as $detail)
            $gorra->details()->updateOrCreate(['color' => $detail['color'], 'size' => $detail['size']], $detail);
        $gorra->categories()->sync([$casual->id, $sport->id, $summer->id]);
    }
}
