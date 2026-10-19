# Ecotronic — Totem de Descarte (Java + Supabase só para login)

```
Navegador (totem / minha conta / monitoramento)
   │  login nome+senha ──────────────► Supabase Auth   (ÚNICO uso do Supabase)
   │  Bearer <access_token> / X-Totem-Key
   ▼
API Java (Spring Boot)  ──valida o token no Supabase──►
   │
   ▼
Banco de dados (H2 em arquivo; PostgreSQL opcional)   tabelas: perfis, descartes
```

O que vive em cada lugar:

| Dado | Onde |
|---|---|
| E-mail/senha, sessão (login) | Supabase Auth |
| Perfil, código do totem (token), flag de admin | Banco Java (`perfis`) |
| Descartes e ecodots | Banco Java (`descartes`) |
| Sorteio dos ecodots por categoria | Servidor Java (`Categoria.java`) |

## Como rodar

Requisitos: **Java 17+** e **Maven 3.9+**.

```bash
cd backend
mvn spring-boot:run
```

Abra **http://localhost:8080** (totem), `/usuario.html` (Minha Conta) e `/monitoramento.html` (admin).
As telas ficam em `backend/src/main/resources/static/` e são servidas pela própria API.
O banco é criado sozinho em `backend/data/ecotronic.mv.db`. Console SQL: http://localhost:8080/h2-console
(JDBC URL `jdbc:h2:file:./data/ecotronic`, usuário `sa`, senha vazia).

## Usar no celular

As telas são um **site responsivo instalável (PWA)**: funcionam em qualquer celular com navegador moderno
(Android/Chrome, iPhone/Safari), sem app de loja. O celular precisa abrir o endereço da API — **`localhost` só
funciona no próprio computador**.

### Opção A — teste rápido pelo Wi-Fi (mesma rede do computador)
1. Rode `mvn spring-boot:run` no computador.
2. Descubra o IP dele (`ipconfig` no Windows, `ip a` / `ifconfig` no Linux/Mac), ex.: `192.168.0.25`.
3. No celular, abra `http://192.168.0.25:8080`.
4. Se não abrir, libere a porta **8080** no firewall do computador (no Windows: "Permitir um aplicativo" → Java).
   Em rede de faculdade/empresa o isolamento de clientes pode bloquear; use a Opção B ou o hotspot do celular.

Em `http://` o login, o totem e o painel funcionam, mas o navegador **não permite instalar** o app na tela inicial.

### Opção B — publicar na internet com HTTPS (funciona em qualquer celular, qualquer rede)
O projeto já tem `backend/Dockerfile`. Em Render, Railway, Fly.io etc.:
1. Suba a pasta `backend` (GitHub) e crie um serviço Docker.
2. Crie um **PostgreSQL** na própria hospedagem (o disco do H2 é apagado a cada deploy) e configure as variáveis:

| Variável | Valor |
|---|---|
| `DB_URL` | `jdbc:postgresql://HOST:5432/BANCO` |
| `DB_USER` / `DB_PASSWORD` | credenciais do Postgres |
| `TOTEM_KEY` | uma chave sua (e a mesma em `TOTEM_API_KEY` no `config.js`) |
| `ADMIN_EMAILS` | e-mail do admin, ex.: `maria.admin@ecotronic.com` |

3. Abra o endereço `https://seu-app...` no celular. Como `API_URL` é vazio (mesma origem), nada mais precisa mudar.
4. **Instalar:** Android/Chrome → menu ⋮ → "Instalar app"; iPhone/Safari → Compartilhar → "Adicionar à Tela de Início".

### O que foi feito para o celular
- Tailwind **compilado** (`tailwind.css`, ~14 KB) em vez do script CDN — carrega rápido em aparelhos fracos.
  Se mudar classes nos HTML/JS: `cd backend/tailwind && npm install && npm run build:css`.
- `manifest.json`, ícones e `sw.js` (instalável; abre a interface mesmo com rede ruim — os dados sempre vêm da API).
- Campos com fonte de 16px (o iPhone não dá zoom ao digitar), `100dvh` (barra do navegador), cabeçalho do painel
  compacto em telas pequenas e botão "Copiar" com alternativa quando não há HTTPS.

## Primeiro administrador

1. Crie uma conta normal em `/usuario.html` (ex.: nome `Maria Admin` → e-mail interno `maria.admin@ecotronic.com`).
2. Defina `ecotronic.admin-emails=maria.admin@ecotronic.com` em `application.properties`
   (ou a variável de ambiente `ADMIN_EMAILS`) e reinicie. Ou rode no H2 console:
   `UPDATE perfis SET is_admin = TRUE WHERE nome = 'Maria Admin';`

## Configuração

| Onde | Chave | Para quê |
|---|---|---|
| `application.properties` | `ecotronic.supabase.url` / `anon-key` | projeto Supabase (só login) |
| `application.properties` | `ecotronic.totem-key` | chave que o totem envia em `X-Totem-Key` |
| `static/config.js` | `TOTEM_API_KEY`, `TOTEM_ID` | mesma chave do totem, id do totem (`API_URL` já usa a mesma origem) |

Para PostgreSQL, siga o bloco comentado em `application.properties`.

## Endpoints

| Método | Rota | Quem | O que faz |
|---|---|---|---|
| GET | `/api/health` | público | verifica se a API está no ar |
| POST | `/api/totem/validar-token` | totem | `{token}` → `{nome}` (404 se não existir; 429 após 10 erros/min por IP) |
| POST | `/api/totem/descartes` | totem | `{totemId, categoria, token?}` → sorteia e grava; devolve `{ecodots,...}` |
| POST | `/api/perfis` | logado | `{nome}` cria o perfil e gera o código de 6 dígitos |
| GET | `/api/perfis/me` | logado | perfil (nome, token, admin) |
| PUT | `/api/perfis/me` | logado | `{nome}` altera o nome |
| POST | `/api/perfis/me/token` | logado | gera novo código (invalida o antigo) |
| GET | `/api/perfis/me/descartes` | logado | histórico do usuário |
| GET | `/api/admin/descartes?limit=2000` | admin | todos os descartes (painel) |

Erros sempre voltam como `{"erro": "mensagem"}`.

## Segurança — o que está e o que falta

- A API confirma cada token de login chamando `GET {SUPABASE_URL}/auth/v1/user`, então não é preciso guardar o JWT secret.
- Dados de admin exigem login **e** `is_admin = true` (verificado no banco a cada chamada).
- O totem usa uma chave fixa (`X-Totem-Key`) que fica visível no navegador do totem. Em produção, use HTTPS
  e troque a chave padrão; o ideal é uma chave por totem.
- Os ecodots são sorteados no servidor, então o navegador não consegue "inventar" pontos.
- Restrinja o CORS (`WebConfig`) para o seu domínio ao publicar.

## Migração dos dados antigos

As tabelas `perfis`/`descartes` do Supabase deixam de ser usadas (os arquivos `.sql` antigos não são mais necessários).
Quem já tinha conta no Supabase ganha um perfil novo, com **novo código**, no primeiro login; os descartes antigos
não são trazidos automaticamente.
