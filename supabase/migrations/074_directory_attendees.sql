-- Directorio temporal de asistentes (/directorio).
-- Idempotente: se puede ejecutar más de una vez en el SQL Editor de Supabase.
--
-- Lectura solo con la clave de servicio (SUPABASE_SECRET_KEY o
-- SUPABASE_SERVICE_ROLE_KEY). RLS activo y sin políticas: la clave anónima
-- no puede leer esta tabla.
--
-- El apellido de Jorge se guarda completo (Sánchez Barreneche). La página
-- lo muestra como «Jorge Sánchez» para que las iniciales sean JS.
-- Jesús Prieto queda fuera de la grilla (visible = false) y sí puede entrar
-- con su celular para probar.
--
-- Cerrar el acceso de este encuentro:
--   UPDATE public.directory_attendees
--   SET access_expires_at = now()
--   WHERE event_slug = 'networking-2026-10-20';
--
-- Alargar el acceso (hora de Bogotá, UTC-5):
--   UPDATE public.directory_attendees
--   SET access_expires_at = timestamptz '2026-11-05 23:59:00-05'
--   WHERE event_slug = 'networking-2026-10-20';
--
-- Otro encuentro: insertar filas con otro event_slug y, en Vercel,
-- definir DIRECTORY_EVENT_SLUG con ese valor. Si la variable no existe,
-- la página usa networking-2026-10-20.
-- Para ocultar a alguien de la grilla sin quitarle la entrada:
--   UPDATE public.directory_attendees SET visible = false WHERE telefono = '+57...';

CREATE TABLE IF NOT EXISTS public.directory_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_slug text NOT NULL,
  nombre text NOT NULL,
  apellido text NOT NULL,
  empresa text NOT NULL DEFAULT '',
  sector text NOT NULL DEFAULT '',
  soluciones text NOT NULL DEFAULT '',
  desafios text NOT NULL DEFAULT '',
  telefono text NOT NULL,
  correo text,
  visible boolean NOT NULL DEFAULT true,
  access_expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.directory_attendees
  ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'directory_attendees_event_phone'
      AND conrelid = 'public.directory_attendees'::regclass
  ) THEN
    ALTER TABLE public.directory_attendees
      ADD CONSTRAINT directory_attendees_event_phone UNIQUE (event_slug, telefono);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'directory_attendees_telefono_e164'
      AND conrelid = 'public.directory_attendees'::regclass
  ) THEN
    ALTER TABLE public.directory_attendees
      ADD CONSTRAINT directory_attendees_telefono_e164
      CHECK (telefono ~ '^\+57[0-9]{10}$');
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS directory_attendees_event_visible_idx
  ON public.directory_attendees (event_slug, visible);

ALTER TABLE public.directory_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.directory_attendees FORCE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.directory_attendees FROM PUBLIC;
REVOKE ALL ON TABLE public.directory_attendees FROM anon;
REVOKE ALL ON TABLE public.directory_attendees FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.directory_attendees TO service_role;

COMMENT ON TABLE public.directory_attendees IS
  'Directorio temporal por encuentro. Sin políticas de RLS: solo el servidor, con la clave de servicio.';

INSERT INTO public.directory_attendees (
  event_slug, nombre, apellido, empresa, sector, soluciones, desafios,
  telefono, correo, visible, access_expires_at
) VALUES
  ('networking-2026-10-20', 'Virginia', 'Quintero Blanco', 'Fundación Conciencia Educa', 'Educación', 'Educación familiar 
Herramientas para el Liderazgo consciente 
Desarrollo personal para maestros', 'Tarifas', '+573003591537', 'vquinteroblanco@gmail.com', true, timestamptz '2026-10-29 23:59:00-05'),
  ('networking-2026-10-20', 'Steffani', 'Benitez', 'Servicios Integrales de Gestión SEIG SAS', 'Talento/RRHH y SST', 'Brindar soluciones de tercerización de procesos de selección de personal, capacitación y formación, administración del talento humano, seguridad y salud en el trabajo, calidad, medio ambiente, seguridad vial. Asesorías como prestador en prevención en convenio con ARL', 'Lograr que la alta dirección de las empresas deje de percibir la SST y los sistemas integrados de gestión como un mero trámite regulatorio o gasto documental, y empiece a verlos como una palanca de productividad, rentabilidad y bienestar organizacional medible', '+573007108451', 'comercialseigsas@gmail.com', true, timestamptz '2026-10-29 23:59:00-05'),
  ('networking-2026-10-20', 'Carolina', 'Posso Peláez', 'Learningtic', 'Educación/EdTech', 'Desarrollo de habilidades con aprendizaje y tecnologIA', 'Posicionar nueva oferta.', '+573215080049', 'caroposso@learningtic.com', true, timestamptz '2026-10-29 23:59:00-05'),
  ('networking-2026-10-20', 'Marley', 'Barrios', 'Eureka', 'Desarrollo web/Software', 'Convertimos las ideas y necesidades digitales de las empresas en soluciones que funcionan y venden. Desarrollamos a la medida sitios web, tiendas online (Shopify, WordPress/WooCommerce o desarrollo propio), plataformas y automatizaciones, según lo que cada negocio necesite. No vendemos plantillas: entendemos el problema, diseñamos la solución y la optimizamos con datos para que genere resultados reales: más ventas, más clientes o menos trabajo manual.', 'Queremos conseguir clientes de forma constante y depender menos de los referidos. Buscamos conectar con dueños y gerentes de empresas que necesiten:

lanzar o rediseñar su sitio web o tienda online,
un sistema o plataforma a la medida (portales, reservas, cotizadores, integraciones con su CRM o ERP),
automatizar procesos que hoy hacen a mano,
o mejorar un sitio que ya tienen y que no convierte.

También nos interesan alianzas con agencias de marketing, pauta o branding que reciben pedidos de desarrollo y no tienen equipo técnico, para trabajar con ellas como su brazo de desarrollo. Nuestro reto es llegar a quien toma la decisión y mostrar que podemos resolver cualquier necesidad tecnológica de principio a fin.', '+573026405578', 'marleybarrios59@gmail.com', true, timestamptz '2026-10-29 23:59:00-05'),
  ('networking-2026-10-20', 'Antonio', 'Acuña', 'Loalty SAS', 'Fidelización', 'Ayuda a negocios locales a fidelizar a sus clientes aprovechando la tecnología', 'El desafío que estoy enfrentando es llegar a más dueños de negocio, y lograr incentivarlos a implementar estrategias de fidelización en sus negocios', '+573046196756', 'antony_racuba@hotmail.com', true, timestamptz '2026-10-29 23:59:00-05'),
  ('networking-2026-10-20', 'Luis', 'Gonzalez', 'Reportapp', 'Tecnología/GovTech', 'Software de gestión ciudadana', 'Crecimiento exponencial', '+573006367539', 'luisgonzalezdavila77@gmail.com', true, timestamptz '2026-10-29 23:59:00-05'),
  ('networking-2026-10-20', 'Pier', 'Puccini', 'Screen Leech app', 'Tecnología/App', 'Screen Leech ayuda a resolver el hábito de pasar horas en el celular sin darte cuenta: entras a una app por un momento y terminas haciendo scroll, dejando de lado tu trabajo, descanso o tiempo con quienes quieres. Al permitirte bloquear apps, establecer límites y programar momentos sin distracciones, te ayuda a romper ese impulso de revisar el teléfono constantemente y recuperar tiempo para lo que realmente quieres hacer.', 'El principal reto es convertir a más usuarios de la versión gratuita de Screen Leech en suscriptores del plan Pro mensual. Aunque la versión gratuita permite conocer la aplicación con funciones limitadas, necesitamos comunicar mejor el valor de las funciones de pago y cómo ayudan a reducir el tiempo de pantalla. Para lograrlo, buscamos fortalecer nuestra estrategia en redes sociales con contenido que genere interés, impulse las descargas y convierta ese interés en suscripciones.', '+573176358458', 'pierpuccini@gmail.com', true, timestamptz '2026-10-29 23:59:00-05'),
  ('networking-2026-10-20', 'Natalia', 'Rodriguez', 'Screen Leech App', 'Tecnología/App', 'Screen Leech ayuda a resolver el hábito de pasar horas en el celular sin darte cuenta: entras a una app por un momento y terminas haciendo scroll, dejando de lado tu trabajo, descanso o tiempo con quienes quieres. Al permitirte bloquear apps, establecer límites y programar momentos sin distracciones, te ayuda a romper ese impulso de revisar el teléfono constantemente y recuperar tiempo para lo que realmente quieres hacer.', 'El principal reto es convertir a más usuarios de la versión gratuita de Screen Leech en suscriptores del plan Pro mensual. Aunque la versión gratuita permite conocer la aplicación con funciones limitadas, necesitamos comunicar mejor el valor de las funciones de pago y cómo ayudan a reducir el tiempo de pantalla. Para lograrlo, buscamos fortalecer nuestra estrategia en redes sociales con contenido que genere interés, impulse las descargas y convierta ese interés en suscripciones.', '+573222115802', 'nrodriguez2309@gmail.com', true, timestamptz '2026-10-29 23:59:00-05'),
  ('networking-2026-10-20', 'Miguel', 'Iguaran', 'Miguel Iguaran', 'Talento/RRHH', 'Malas contrataciones, equipos con fricciones o líderes sin herramientas, desgaste del equipo y culturas que no acompañan el crecimiento. No llego con fórmulas genéricas: primero entiendo el contexto y luego diseño la solución', 'Mi principal desafío hoy es llegar a más empresas que estén creciendo y necesiten apoyo con su gente. Tengo la experiencia y los servicios (selección, evaluación psicotécnica, liderazgo, bienestar y cultura), pero me cuesta llegar a los founders y líderes en el momento justo: cuando van a contratar sus primeras personas clave, cuando el equipo crece rápido y empiezan las fricciones, o cuando los líderes necesitan herramientas para gestionar personas.

Me gustaría conectar con:

- Founders de startups y pymes que estén contratando o armando equipo.
- Líderes de talento humano o de operaciones que necesiten un aliado externo en selección, formación o bienestar.
- Aceleradoras, incubadoras o comunidades de emprendimiento que quieran ofrecer talleres o acompañamiento a sus empresas.

También me interesan alianzas con consultores complementarios (finanzas, legal, marketing) para referirnos clientes', '+573012666291', 'miguaran2224@gmail.com', true, timestamptz '2026-10-29 23:59:00-05'),
  ('networking-2026-10-20', 'Luis', 'Castro', 'Menube', 'Digitalización comercial', 'Digitalizamos negocios, barrios, centros comerciales y ferias', 'Tiempo y equipo', '+573015376081', 'info@menube.co', true, timestamptz '2026-10-29 23:59:00-05'),
  ('networking-2026-10-20', 'Mauxi', 'Matute', 'El club by mauxi', 'Eventos/Planes familiares', 'Guía de eventos y planes para las familias en Barranquilla', 'Crear contenido que conecte más con las familias, mejorar la forma de comisionar con los establecimientos aliados', '+573043688624', 'matutemauxi@gmail.com', true, timestamptz '2026-10-29 23:59:00-05'),
  ('networking-2026-10-20', 'Gabriela', 'Román Villa', 'Cookies & Films', 'Alimentos', 'Cookies & Films es un proyecto casero que lleva a los paladares más dulceros de Quilla, galletas estilo New York, pudines, brownies y bites rolls de canela a un precio más asequible de lo común.', 'El principal desafío que atraviesa el negocio ahora mismo es la falta de conexiones con más clientes a parte de la venta directa (es decir poder llegar a potenciales clientes mediante Redes o canales como WhatsApp).', '+573165506891', 'gabyromanvill@gmail.com', true, timestamptz '2026-10-29 23:59:00-05'),
  ('networking-2026-10-20', 'Elbis', 'Marmol', 'Imarketics', 'Marketing digital', 'Marketing y publicidad digital', 'Automstizar muchos procesos y crecer en  cartera de clientes', '+573507296462', 'imarketics@gmail.com', true, timestamptz '2026-10-29 23:59:00-05'),
  ('networking-2026-10-20', 'Moisés', 'Barros Bacci', 'Recreación Digital Sigma', 'eSports', 'Generamos espacios de ocio, competición saludable y oportunidades de representación regional y nacional a través de los deportes electrónicos.', 'Mi proyecto está requiriendo alianzas que permitan aumentar su escalabilidad, pero no sé qué pasos empezar, debido a que el proyecto viene de un nicho con mucha oportunidad debido a la industria exitosa que lo respalda y apenas está comenzando a llegar a la ciudad.', '+573045265663', 'mbarros77@gmail.com', true, timestamptz '2026-10-29 23:59:00-05'),
  ('networking-2026-10-20', 'Luis', 'Mesa', 'Q''ruta', 'Tecnología/App (movilidad)', 'La incognita de saber que ruta de bus tomar para ir a algun lugar', 'Expandirnos a nivel internacional, alternativas de monetizacion, llegar a mas usuarios, generar comunidad', '+573012784069', 'queruta@gmail.com', true, timestamptz '2026-10-29 23:59:00-05'),
  ('networking-2026-10-20', 'Jose', 'Sarmiento Moreno', 'Brandket', 'Branding', '🤪', 'Necesito clientes', '+573003972141', 'jose@brandket.co', true, timestamptz '2026-10-29 23:59:00-05'),
  ('networking-2026-10-20', 'Jose', 'Zuluaga', 'Geométrica', 'Construcción/Adecuaciones', 'Tiempo para obras', 'Actualmente el cuello botella son los trabajadores, al ser muchos subcontratistas no entienden la cultura organizacional que se quiere lograr', '+573002470904', 'jotazuluaga14@gmail.com', true, timestamptz '2026-10-29 23:59:00-05'),
  ('networking-2026-10-20', 'Anyi', 'Avella', 'NOAN | Anyi Avella — Trafficker & Estratega Digital', 'Marketing digital', 'Ayudo a empresas y marcas a conseguir más clientes y aumentar sus ventas mediante estrategias de publicidad digital, generación de demanda y optimización de campañas.

Mi experiencia viene tanto de gestionar mi propia marca, NOAN, como de trabajar con otros negocios, lo que me permite entender el proceso completo: desde atraer clientes hasta convertirlos en ventas y buscar oportunidades de crecimiento y escalabilidad.', 'Mi principal desafío es continuar escalando mi propia marca, NOAN, mientras desarrollo y consolido mi trabajo como Trafficker y Estratega Digital.

Actualmente ya he tenido experiencia trabajando con otros negocios y acompañándolos en sus procesos de publicidad y crecimiento. Uno de mis objetivos es ampliar mi cartera de clientes, conectar con empresarios y marcas que necesiten mejorar la adquisición de clientes y sus ventas, y construir relaciones estratégicas que permitan generar nuevas oportunidades de crecimiento.

Busco conectar especialmente con empresas que quieran dejar de depender únicamente de publicaciones orgánicas y desarrollar estrategias de publicidad digital orientadas a resultados.', '+573014100177', 'anyiavella@gmail.com', true, timestamptz '2026-10-29 23:59:00-05'),
  ('networking-2026-10-20', 'Jaime', 'Acuña', 'Acuña Constructores', 'Construcción', 'Servicios de obras civiles para industria, recuperación de materiales de demoliciones, aprovechamientos, disposición final', 'Alcanzar clientes de la industria', '+573115498804', 'gerencia@acuconstructores.com', true, timestamptz '2026-10-29 23:59:00-05'),
  ('networking-2026-10-20', 'Jorge', 'Sánchez Barreneche', 'Dei-Tec', 'Tecnología/Consultoría TI', 'Construye departamentos de TI dentro de empresas cuyos nichos no son tecnológicos, mediante outsourcing y consultorías', 'Sus proyectos objetivo son grandes y de larga duración; hoy su único canal es el voz a voz', '+573225822789', 'jorgesanchezbarreneche@outlook.com', true, timestamptz '2026-10-29 23:59:00-05'),
  ('networking-2026-10-20', 'Jesús', 'Prieto', 'Synergy', 'Equipo', '', '', '+573022607598', NULL, false, timestamptz '2026-10-29 23:59:00-05')
ON CONFLICT (event_slug, telefono) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  apellido = EXCLUDED.apellido,
  empresa = EXCLUDED.empresa,
  sector = EXCLUDED.sector,
  soluciones = EXCLUDED.soluciones,
  desafios = EXCLUDED.desafios,
  correo = EXCLUDED.correo,
  visible = EXCLUDED.visible,
  access_expires_at = EXCLUDED.access_expires_at;
