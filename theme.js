const themeMap = {
  dark: "light",
  light: "dark",
};

const theme = localStorage.getItem('theme') //taking theme from localStorage if already available
  ||
  (tmp = Object.keys(themeMap)[0], localStorage.setItem('theme', tmp), tmp); //storing theme into system cache if not already saved.

const bodyClass = document.body.classList;
bodyClass.add(theme);

function toggleTheme() {
  const current = localStorage.getItem('theme');
  const next = themeMap[current];

  bodyClass.replace(current, next);
  localStorage.setItem('theme', next);
}

document.getElementById('themeButton').onclick = toggleTheme;
