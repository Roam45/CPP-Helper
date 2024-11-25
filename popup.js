const newSnippetInput = document.getElementById("new-snippet");
const saveButton = document.getElementById("save-snippet");
const snippetsList = document.getElementById("snippets-list");
const snippetLibrary = document.getElementById("snippet-library");
const insertButton = document.getElementById("insert-snippet");

// Load saved snippets on startup
chrome.storage.local.get("cppSnippets", (data) => {
  const snippets = data.cppSnippets || [];
  snippets.forEach(displaySnippet);
});

// Display a snippet with a "Copy" button
function displaySnippet(snippet) {
  const snippetWrapper = document.createElement("div");
  snippetWrapper.classList.add("snippet-wrapper");

  const snippetElement = document.createElement("div");
  snippetElement.classList.add("snippet");
  snippetElement.innerHTML = `
    <pre><code class="language-cpp">${snippet}</code></pre>
  `;
  Prism.highlightAll();

  const copyButton = document.createElement("button");
  copyButton.textContent = "Copy";
  copyButton.classList.add("copy-button");

  copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(snippet).then(
      () => alert("Snippet copied to clipboard!"),
      () => alert("Failed to copy snippet.")
    );
  });

  snippetWrapper.appendChild(snippetElement);
  snippetWrapper.appendChild(copyButton);
  snippetsList.appendChild(snippetWrapper);
}

// Save a new snippet
saveButton.addEventListener("click", () => {
  const newSnippet = newSnippetInput.value.trim();
  if (newSnippet) {
    chrome.storage.local.get("cppSnippets", (data) => {
      const snippets = data.cppSnippets || [];
      snippets.push(newSnippet);
      chrome.storage.local.set({ cppSnippets: snippets });
    });
    displaySnippet(newSnippet);
    newSnippetInput.value = ""; // Clear input field
  }
});

// Insert a predefined snippet
insertButton.addEventListener("click", () => {
  const selectedSnippet = snippetLibrary.value;
  if (selectedSnippet) {
    newSnippetInput.value += `\n${selectedSnippet}`;
  }
});
