-- 100 registros dummy para validar formulario /ia

INSERT INTO ia_form_submissions (
  rol, nombre_completo, nombre_empresa, url_sitio_web, que_vende,
  telefono, email_empresa, linkedin, como_vende, desafios_puntos_dolor,
  cliente_objetivo, tamano_equipo, presupuesto_ventas, como_enteraste_synergy,
  acepta_terminos
)
SELECT
  (ARRAY['Soy founder / Dueño de negocio','Busco unirme a un negocio o proyecto','Soy inversor','Quiero ser aliado estratégico','Busco un socio o co-fundador'])[1 + (random() * 4)::int],
  'Persona Dummy ' || n,
  'Empresa Demo ' || (1 + (n % 20)),
  'https://ejemplo' || n || '.com',
  'Producto/Servicio demo ' || n,
  '+57' || (3000000000 + ((n * 12345) % 999999999))::text,
  'contacto' || n || '@empresa' || (n % 10) || '.com',
  'https://linkedin.com/in/dummy' || n,
  'Outbound, Partnerships',
  'Escalamiento de ventas, captación de clientes',
  '25-40 años, Colombia, B2B',
  (2 + (n % 20))::text || ' personas',
  '$' || (10 + (n % 40)) || 'K mensuales',
  'Recomendación, LinkedIn, Evento Synergy',
  true
FROM generate_series(1, 100) AS n;
