# ♻️ Ecotronic Solutions

Projeto desenvolvido para a **UPX2 - FACENS**, com o objetivo de incentivar e facilitar o descarte correto de resíduos eletrônicos.

## 💡 Sobre o projeto

O **Ecotronic** é um sistema de coleta de resíduos eletrônicos que utiliza totens para registrar os descartes.

O sistema possui três interfaces principais:

- **Totem:** registro dos descartes eletrônicos.
- **Usuário:** cadastro, histórico de descartes e Ecodots.
- **Monitoramento:** acompanhamento dos descartes e dos totens.

## 🛠️ Tecnologias

- HTML
- CSS
- JavaScript
- Tailwind CSS
- Supabase
- Chart.js
- Figma

## 📁 Principais arquivos

```text
├── totem.html
├── usuario.html
├── monitoramento-standalone.html
├── config.js
└── README.md
```

## ⚙️ Configuração do Supabase

Para executar o projeto, é necessário configurar a conexão com o **Supabase** no arquivo `config.js`.

### Como obter as credenciais

1. Acesse o Supabase e entre no seu projeto.
2. Vá em **Project Settings**.
3. Acesse a seção **API**.
4. Copie a **Project URL**.
5. Copie a **Publishable key** (ou `anon` / `public`, dependendo da versão do painel).
6. Abra o arquivo `config.js`.
7. Substitua os valores indicados pelas credenciais do seu projeto:

```js
const SUPABASE_URL = "SUA_PROJECT_URL";
const SUPABASE_ANON_KEY = "SUA_PUBLISHABLE_KEY";
```

> **Importante:** utilize apenas a chave pública (`Publishable` ou `anon`). Nunca adicione `service_role`, `secret key` ou outras credenciais privadas ao código do frontend ou ao repositório.

## 🚀 Como executar

Após configurar o Supabase, abra os arquivos HTML no navegador ou utilize uma extensão como o **Live Server** no Visual Studio Code.

- `totem.html` — interface do totem
- `usuario.html` — área do usuário
- `monitoramento-standalone.html` — painel de monitoramento

## 🚧 Status

Projeto em desenvolvimento.

## 🎓 Projeto acadêmico

Desenvolvido para a **UPX2 - Usina de Projetos Experimentais da FACENS**.