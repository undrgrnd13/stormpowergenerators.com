// Build: tailwindcss v3.4.17 standalone CLI
//   ./tailwindcss -c tailwind.config.js -i css/tailwind.input.css -o css/styles.css --minify
// Re-run after changing classes in any *.html file, then commit css/styles.css.
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      colors: {
        brand: { 500: '#f97316', 600: '#ea580c' },
      },
    },
  },
  plugins: [],
};
