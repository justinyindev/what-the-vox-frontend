const puppeteer = require("puppeteer");

const getArticleContent = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
  );
  
  await page.goto(url);

  // Wait for the <div> element with class c-entry-content to be loaded
  await page.waitForSelector(".c-entry-content");

  // Get the content of the <div> element with class c-entry-content
  const articleContent = await page.evaluate(() => {
    // Get all of the <p> and <h3> tags under the <div> element with class c-entry-content
    const paragraphs = [
      ...document.querySelectorAll(".c-entry-content p"),
    ];

    const filteredParagraphs = paragraphs.filter(
      (p) => !p.closest(".c-article-footer")
    );

    // Join the text content of the paragraphs with a newline character
    const content = filteredParagraphs.map((p) => p.textContent).join("\n");

    return content;
  });

  await page.close();

  return articleContent;
};

module.exports = getArticleContent;