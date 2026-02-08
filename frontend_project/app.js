const BASE_URL = "http://localhost:8080";

function $(sel) { return document.querySelector(sel); }
function show(el) { el.style.display = "block"; }
function hide(el) { el.style.display = "none"; }

async function getJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}
async function getText(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
}

function setResult(el, value) {
  el.textContent = value || "";
}

document.addEventListener("DOMContentLoaded", () => {
  const chatForm = $("#form-chat");
  const chatPrompt = $("#chat-prompt");
  const chatLoader = $("#chat-loader");
  const chatResult = $("#chat-result");

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setResult(chatResult, "");
    show(chatLoader);
    try {
      const url = `${BASE_URL}/ask-ai?prompt=${encodeURIComponent(chatPrompt.value)}`;
      const data = await getText(url);
      setResult(chatResult, data);
    } catch (err) {
      setResult(chatResult, `Erro: ${err.message}`);
    } finally {
      hide(chatLoader);
    }
  });

  const chatOptForm = $("#form-chat-options");
  const chatOptPrompt = $("#chat-options-prompt");
  const chatOptLoader = $("#chat-options-loader");
  const chatOptResult = $("#chat-options-result");

  chatOptForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setResult(chatOptResult, "");
    show(chatOptLoader);
    try {
      const url = `${BASE_URL}/ask-ai-options?prompt=${encodeURIComponent(chatOptPrompt.value)}`;
      const data = await getText(url);
      setResult(chatOptResult, data);
    } catch (err) {
      setResult(chatOptResult, `Erro: ${err.message}`);
    } finally {
      hide(chatOptLoader);
    }
  });

  const recipeForm = $("#form-recipe");
  const ingredients = $("#ingredients");
  const cuisine = $("#cuisine");
  const restrictions = $("#restrictions");
  const recipeLoader = $("#recipe-loader");
  const recipeResult = $("#recipe-result");

  recipeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setResult(recipeResult, "");
    show(recipeLoader);
    try {
      const params = new URLSearchParams({
        ingredients: ingredients.value,
        cuisine: cuisine.value,
        diataryRestrictions: restrictions.value
      });
      const url = `${BASE_URL}/recipe-creator?${params.toString()}`;
      const data = await getText(url);
      setResult(recipeResult, data);
    } catch (err) {
      setResult(recipeResult, `Erro: ${err.message}`);
    } finally {
      hide(recipeLoader);
    }
  });

  const imageForm = $("#form-image");
  const imagePrompt = $("#image-prompt");
  const quality = $("#quality");
  const n = $("#n");
  const height = $("#height");
  const width = $("#width");
  const imageLoader = $("#image-loader");
  const imageResults = $("#image-results");

  imageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    imageResults.innerHTML = "";
    show(imageLoader);
    try {
      const params = new URLSearchParams({
        prompt: imagePrompt.value,
        quality: quality.value,
        N: n.value,
        height: height.value,
        width: width.value
      });
      const url = `${BASE_URL}/generate-image?${params.toString()}`;
      const data = await getJSON(url);
      if (Array.isArray(data)) {
        data.forEach((src) => {
          const img = document.createElement("img");
          img.src = src;
          imageResults.appendChild(img);
        });
      } else {
        const pre = document.createElement("pre");
        pre.textContent = JSON.stringify(data, null, 2);
        imageResults.appendChild(pre);
      }
    } catch (err) {
      const pre = document.createElement("pre");
      pre.textContent = `Erro: ${err.message}`;
      imageResults.appendChild(pre);
    } finally {
      hide(imageLoader);
    }
  });
});
