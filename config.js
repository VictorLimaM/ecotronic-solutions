// ============================================================
//  Ecotronic Solutions — Configuração do Totem
// ============================================================
// Substitua os valores abaixo pelos dados do SEU projeto Supabase.
// Eles ficam em: Painel do Supabase > Project Settings > API
//
// IMPORTANTE: use sempre a "anon public key" aqui (nunca a service_role
// key) — este arquivo roda no navegador do totem e fica visível a
// qualquer pessoa que inspecione a página.
// ============================================================

const SUPABASE_URL = "SUA_PROJECT_URL";
const SUPABASE_ANON_KEY = "SUA_PUBLISHABLE_KEY";

// Nome da tabela no Supabase onde cada descarte é registrado.
// Veja o schema sugerido em README.md.
const SUPABASE_TABLE = "descartes";

// Identificador deste totem físico. Cada totem instalado deve ter
// um ID único — assim a central de controle sabe de qual ponto
// veio cada descarte.
const TOTEM_ID = "SOR-01";
