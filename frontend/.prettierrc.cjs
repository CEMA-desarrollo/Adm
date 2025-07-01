// .prettierrc.cjs
/* eslint-env node */
module.exports = {
  printWidth: 100, // Longitud máxima de la línea antes de envolver
  tabWidth: 2, // Número de espacios por tabulación
  useTabs: false, // Usar espacios en lugar de tabulaciones
  semi: true, // Puntos y comas al final de las declaraciones
  singleQuote: true, // Comillas simples en lugar de dobles
  quoteProps: 'as-needed', // Solo comillas en propiedades de objetos cuando sea necesario
  trailingComma: 'es5', // Comas finales en objetos y arrays (es5 para compatibilidad)
  bracketSpacing: true, // Espacios dentro de llaves de objetos
  arrowParens: 'always', // Paréntesis alrededor de los parámetros de funciones flecha
  endOfLine: 'lf', // Asegura consistencia en los saltos de línea (Linux-style)
};
