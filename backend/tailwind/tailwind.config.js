// Gera static/tailwind.css:  npm install && npm run build:css   (dentro de backend/tailwind)
module.exports = {
  content: ["../src/main/resources/static/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        fundo: '#FFFFFF', tinta: '#0F1A16', verdeescuro: '#12302A', verde: '#2FAE55',
        verdeclaro: '#47C96B', verdefundo: '#EAF7EE', cinza: '#6B7280', linha: '#E7EBE8',
        vermelho: '#D2483C', vermelhofundo: '#FBEBE9',
      },
      fontFamily: {
        display: ['Poppins', 'Arial', 'sans-serif'],
        body: ['Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
};
