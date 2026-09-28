-- Garante que todas as colunas existem na tabela public.products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subcategory_name TEXT NOT NULL DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(6,3) NOT NULL DEFAULT 0.5;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS width_cm INTEGER NOT NULL DEFAULT 20;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS height_cm INTEGER NOT NULL DEFAULT 15;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS length_cm INTEGER NOT NULL DEFAULT 25;

-- Insere ou atualiza os produtos vindos da planilha Excel
INSERT INTO public.products (
  sku, name, price, stock_quantity, brand, category, subcategory, subcategory_name,
  description, short_description, weight_kg, width_cm, height_cm, length_cm, images, active
) VALUES
('mtj01008', 'Ponteira Sprinter com Suporte 97/11 Traseira Lado Direito', 100.90, 33, 'MotorTech', 'acessorios', 'ponteiras', 'Ponteiras',
 'ponteira sprinter com suporte 97/11 traseira lado direito - material: plástico cinza',
 'Ponteira Sprinter com Suporte 97/11 Traseira Lado Direito', 0.39, 39, 12, 27, ARRAY['/seed/ponteira.jpg'], true),

('mtj01009', 'Ponteira Sprinter com Suporte 97/11 Traseira Lado Esquerdo', 100.90, 37, 'MotorTech', 'acessorios', 'ponteiras', 'Ponteiras',
 'ponteira sprinter com suporte 97/11 traseira lado esquerdo - material: plástico cinza',
 'Ponteira Sprinter com Suporte 97/11 Traseira Lado Esquerdo', 0.39, 39, 12, 27, ARRAY['/seed/ponteira.jpg'], true),

('mtj10395fx', 'Grade Churrasqueira Para-Brisa Gol/Parati/Saveiro G3 G4', 77.00, 189, 'MotorTech', 'acessorios', 'grades', 'Grades',
 'grade churrasqueira para-brisa gol/parati/saveiro g3 g4 com borracha de vedação - material: plástico preto',
 'Grade Churrasqueira Para-Brisa Gol/Parati/Saveiro G3 G4', 0.67, 20, 2, 100, ARRAY['/seed/grade.jpg'], true),

('mtj10501', 'Moldura Friso Tampa Traseira Saveiro G5 até G7 com Grampo', 57.90, 4, 'MotorTech', 'acessorios', 'molduras', 'Molduras',
 'moldura friso tampa traseira saveiro g5 g6 g7 com grampo + fita 3m',
 'Moldura Friso Tampa Traseira Saveiro G5 até G7', 0.29, 117, 3, 10, ARRAY['/seed/moldura.jpg'], true),

('mtj40441', 'Moldura Farol Del Rey/Belina 85/91 Pampa até 97 Lado Direito', 49.99, 27, 'MotorTech', 'acessorios', 'molduras', 'Molduras',
 'moldura farol del rey/belina 85/91 pampa até 97 lado direito - plástico preto',
 'Moldura Farol Del Rey/Belina/Pampa L. Direita', 0.22, 53, 17, 13, ARRAY['/seed/moldura.jpg'], true),

('mtj40442', 'Moldura Farol Del Rey/Belina 85/91 Pampa até 97 Lado Esquerdo', 49.99, 26, 'MotorTech', 'acessorios', 'molduras', 'Molduras',
 'moldura farol del rey/belina 85/91 pampa até 97 lado esquerdo - plástico preto',
 'Moldura Farol Del Rey/Belina/Pampa L. Esquerda', 0.20, 53, 17, 13, ARRAY['/seed/moldura.jpg'], true),

('mtj80847', 'Ponteira D20 de 85 até 97 Dianteira Direita', 41.90, 0, 'MotorTech', 'acessorios', 'ponteiras', 'Ponteiras',
 'ponteira para-choque d20 ano 85 até 97 dianteira lado direito preto',
 'Ponteira D20 Dianteira Direita', 0.23, 30, 21, 8, ARRAY['/seed/ponteira.jpg'], true),

('mtj80848', 'Ponteira D20 de 85 até 97 Dianteira Esquerda', 41.90, 0, 'MotorTech', 'acessorios', 'ponteiras', 'Ponteiras',
 'ponteira para-choque d20 ano 85 até 97 dianteira lado esquerda preto',
 'Ponteira D20 Dianteira Esquerda', 0.26, 30, 21, 8, ARRAY['/seed/ponteira.jpg'], true),

('mtlw4024', 'Farol Uno 2004 a 2013 Cromado Lado Direito', 115.90, 44, 'Lightway', 'iluminacao', 'farois', 'Faróis',
 'farol fiat uno fiorino máscara cromada 2004/2013 mille fire - lente policarbonato',
 'Farol Uno 2004 a 2013 Cromado Lado Direito', 1.0, 20, 22, 40, ARRAY['/seed/farol.jpg'], true),

('mtlw4025', 'Farol Uno 2004 a 2013 Cromado Lado Esquerdo', 115.90, 43, 'Lightway', 'iluminacao', 'farois', 'Faróis',
 'farol fiat uno fiorino máscara cromada 2004/2013 mille fire - lente policarbonato',
 'Farol Uno 2004 a 2013 Cromado Lado Esquerdo', 1.0, 20, 22, 40, ARRAY['/seed/farol.jpg'], true),

('mtlw4026', 'Lente Farol Lado Direito Fiat Uno 2004 a 2012', 41.90, 14, 'Lightway', 'iluminacao', 'lentes', 'Lentes',
 'lente farol lado direito fiat uno 2004 a 2012 em policarbonato',
 'Lente Farol Lado Direito Fiat Uno', 0.20, 20, 12, 39, ARRAY['/seed/lente.jpg'], true),

('mtlw4027', 'Lente Farol Lado Esquerdo Fiat Uno 2004 a 2012', 41.90, 13, 'Lightway', 'iluminacao', 'lentes', 'Lentes',
 'lente farol lado esquerdo fiat uno 2004 a 2012 em policarbonato',
 'Lente Farol Lado Esquerdo Fiat Uno', 0.20, 20, 12, 39, ARRAY['/seed/lente.jpg'], true),

('mtlw7025', 'Lente Farol Milha Vidro Corsa Meriva Montana 2003/2010 L. Direita', 36.90, 11, 'Lightway', 'iluminacao', 'lentes', 'Lentes',
 'lente farol milha de vidro temperado gm corsa meriva montana 2003/2010',
 'Lente Farol Milha Vidro Corsa Meriva Montana L. Direita', 0.15, 14, 7, 21, ARRAY['/seed/lente.jpg'], true),

('mtlw7026', 'Lente Farol Milha Vidro Corsa Meriva Montana 2003/2010 L. Esquerda', 36.90, 11, 'Lightway', 'iluminacao', 'lentes', 'Lentes',
 'lente farol milha de vidro temperado gm corsa meriva montana 2003/2010',
 'Lente Farol Milha Vidro Corsa Meriva Montana L. Esquerda', 0.15, 14, 7, 21, ARRAY['/seed/lente.jpg'], true),

('mtlw4030', 'Farol Fiat Uno Fiorino Máscara Negra 2004/2013 L. Direita', 115.90, 20, 'Lightway', 'iluminacao', 'farois', 'Faróis',
 'farol fiat uno fiorino máscara negra 2004/2013 mille fire - lente policarbonato',
 'Farol Fiat Uno Fiorino Máscara Negra L. Direita', 1.0, 20, 22, 40, ARRAY['/seed/farol.jpg'], true),

('mtlw4031', 'Farol Fiat Uno Fiorino Máscara Negra 2004/2013 L. Esquerdo', 115.90, 25, 'Lightway', 'iluminacao', 'farois', 'Faróis',
 'farol fiat uno fiorino máscara negra 2004/2013 mille fire - lente policarbonato',
 'Farol Fiat Uno Fiorino Máscara Negra L. Esquerdo', 1.0, 20, 22, 40, ARRAY['/seed/farol.jpg'], true),

('par40304031', 'Par Farol Fiat Uno Fiorino Máscara Negra 2004/2013', 231.80, 20, 'Lightway', 'iluminacao', 'farois', 'Faróis',
 'par de faróis fiat uno fiorino máscara negra 2004/2013 mille fire',
 'Par Farol Fiat Uno Fiorino Máscara Negra', 2.0, 40, 42, 80, ARRAY['/seed/farol.jpg'], true),

('par40244025', 'Par Farol Uno 2004 a 2013 Cromado', 231.80, 43, 'Lightway', 'iluminacao', 'farois', 'Faróis',
 'par de faróis fiat uno fiorino máscara cromada 2004/2013 mille fire',
 'Par Farol Uno 2004 a 2013 Cromado', 2.0, 40, 42, 80, ARRAY['/seed/farol.jpg'], true),

('par70257026', 'Par Lente Farol Milha Vidro Corsa Meriva Montana 2003/2010', 73.80, 11, 'Lightway', 'iluminacao', 'lentes', 'Lentes',
 'par de lentes farol milha de vidro gm corsa meriva montana 2003/2010',
 'Par Lente Farol Milha Vidro Corsa Meriva Montana', 0.30, 28, 7, 21, ARRAY['/seed/lente.jpg'], true),

('par40264027', 'Par Lente Farol Fiat Uno 2004 a 2012', 83.80, 13, 'Lightway', 'iluminacao', 'lentes', 'Lentes',
 'par de lentes de farol em policarbonato fiat uno 2004 a 2012',
 'Par Lente Farol Fiat Uno 2004 a 2012', 0.40, 40, 12, 78, ARRAY['/seed/lente.jpg'], true),

('mtwkl305', 'Kit Filtros VW Gol/ Voyage/ Saveiro 1.6 8V Flex 16/22', 63.90, 13, 'Wega', 'automotivo', 'filtros', 'Filtros',
 'kit de filtros de óleo, ar e combustível vw gol/voyage/saveiro 1.6 8v flex',
 'Kit Filtros VW Gol/Voyage/Saveiro 1.6 8V', 0.50, 20, 10, 20, ARRAY['/seed/grade.jpg'], true),

('mtwkl284', 'Kit Filtros Toyota Corolla 1.8 14/19 / 2.0 10/15', 66.90, 7, 'Wega', 'automotivo', 'filtros', 'Filtros',
 'kit de filtros toyota corolla 2.0 16v (10-15) e corolla 1.8 16v (14-19)',
 'Kit Filtros Toyota Corolla 1.8 / 2.0', 0.56, 27, 11, 27, ARRAY['/seed/grade.jpg'], true),

('mtwkl122', 'Kit Filtros Argo/Cronos 1.3 / Mobi 1.0 Flex', 75.00, 41, 'Wega', 'automotivo', 'filtros', 'Filtros',
 'kit de filtros fiat argo 1.3/1.0, cronos 1.3, mobi 1.0 e pulse 1.3',
 'Kit Filtros Argo/Cronos 1.3 / Mobi 1.0 Flex', 1.00, 32, 13, 32, ARRAY['/seed/grade.jpg'], true),

('mtwkl125', 'Kit Filtros Fiorino 14/16 Grand Siena 1.4 8V', 66.27, 55, 'Wega', 'automotivo', 'filtros', 'Filtros',
 'kit de filtros fiat fiorino furgão 1.4, grand siena 1.0/1.4 e uno 1.0/1.4',
 'Kit Filtros Fiorino / Grand Siena 1.4 8V', 0.83, 29, 11, 29, ARRAY['/seed/grade.jpg'], true),

('mtwkl225', 'Kit Filtros Hyundai HB20 / HB20S 1.0 12V Flex 12/19', 69.90, 6, 'Wega', 'automotivo', 'filtros', 'Filtros',
 'kit de filtros hyundai hb20 e hb20s 1.0 3 cilindros 12v flex 2012 a 2019',
 'Kit Filtros Hyundai HB20 / HB20S 1.0 12V', 0.77, 25, 11, 25, ARRAY['/seed/grade.jpg'], true),

('mtwku500', 'Kit Filtros Toyota Hilux 2.8 16V Diesel 16/...', 139.90, 4, 'Wega', 'automotivo', 'filtros', 'Filtros',
 'kit de filtros toyota hilux e sw4 2.8 16v diesel 2016 em diante',
 'Kit Filtros Toyota Hilux 2.8 16V Diesel', 1.37, 44, 11, 44, ARRAY['/seed/grade.jpg'], true),

('mtwku442', 'Kit Filtros GM S10 / Trailblazer 2.8 16V Diesel 12/16', 196.85, 16, 'Wega', 'automotivo', 'filtros', 'Filtros',
 'kit de filtros gm s10 e trailblazer 2.8 16v diesel 2012 a 2016',
 'Kit Filtros GM S10 / Trailblazer 2.8 16V Diesel', 1.35, 27, 22, 27, ARRAY['/seed/grade.jpg'], true),

('mtj01054', 'Para-Barro Honda City Dianteiro Direito 09/14', 91.99, 5, 'KJ', 'acessorios', 'para-barro', 'Para-Barro',
 'para-barro honda city dianteiro direito 2009 a 2014 em plástico preto',
 'Para-Barro Honda City Dianteiro Direito 09/14', 0.21, 30, 20, 30, ARRAY['/seed/moldura.jpg'], true),

('mtj01055', 'Para-Barro Honda City Dianteiro Esquerdo 09/14', 91.99, 5, 'KJ', 'acessorios', 'para-barro', 'Para-Barro',
 'para-barro honda city dianteiro esquerdo 2009 a 2014 em plástico preto',
 'Para-Barro Honda City Dianteiro Esquerdo 09/14', 0.21, 30, 20, 30, ARRAY['/seed/moldura.jpg'], true),

('mtj01109', 'Para-Barro HB20/HB20S Dianteiro Esquerdo 2023 em diante', 99.99, 11, 'KJ', 'acessorios', 'para-barro', 'Para-Barro',
 'para-barro hyundai hb20 / hb20s dianteiro esquerdo 2023 em diante',
 'Para-Barro HB20/HB20S Dianteiro Esquerdo 2023+', 0.21, 30, 20, 30, ARRAY['/seed/moldura.jpg'], true),

('mtj01110', 'Para-Barro HB20/HB20S Dianteiro Direito 2023 em diante', 99.99, 9, 'KJ', 'acessorios', 'para-barro', 'Para-Barro',
 'para-barro hyundai hb20 / hb20s dianteiro direito 2023 em diante',
 'Para-Barro HB20/HB20S Dianteiro Direito 2023+', 0.21, 30, 20, 30, ARRAY['/seed/moldura.jpg'], true),

('mtj01113', 'Acabamento / Raspador Para-Barro Hilux e SW4 2016 a 2024', 69.99, 10, 'KJ', 'acessorios', 'para-barro', 'Para-Barro',
 'acabamento / bolacha / raspador para-barro dianteiro toyota hilux e sw4 2016 a 2024',
 'Acabamento Raspador Para-Barro Hilux e SW4', 0.23, 31, 1, 13, ARRAY['/seed/moldura.jpg'], true),

('mtj0105401055', 'Par Para-Barro Honda City Dianteiro 09/14', 91.99, 5, 'KJ', 'acessorios', 'para-barro', 'Para-Barro',
 'par de para-barros honda city dianteiro (lado direito + esquerdo) 2009 a 2014',
 'Par Para-Barro Honda City Dianteiro 09/14', 0.42, 30, 20, 30, ARRAY['/seed/moldura.jpg'], true),

('mtj0110901110', 'Par Para-Barro HB20/HB20S Dianteiro 2023 em diante', 99.99, 9, 'KJ', 'acessorios', 'para-barro', 'Para-Barro',
 'par de para-barros hyundai hb20 / hb20s dianteiro (lado direito + esquerdo) 2023 em diante',
 'Par Para-Barro HB20/HB20S Dianteiro 2023+', 0.42, 30, 20, 30, ARRAY['/seed/moldura.jpg'], true)

ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  stock_quantity = EXCLUDED.stock_quantity,
  description = EXCLUDED.description,
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory;
