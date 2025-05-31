/** @todo extend to get full text and thumbnail image */
const links = Array.from(document.querySelectorAll('.c-button')).map(n => n.querySelector('a'));
const articles = [];
for (let i = 0; i < links.length; i++) {
  const link = links[i];
  articles.push({
    index: i,
    href: link.href,
    text: link.textContent,
  });
}
console.log(JSON.stringify(articles));
