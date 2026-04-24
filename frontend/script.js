const API_URL = "https://bajaj-full-stack-psi.vercel.app/bfhl";

function submitData() {
  const input = document.getElementById("inputData").value;
  const errorDiv = document.getElementById("error");
  const resultDiv = document.getElementById("result");

  errorDiv.innerText = "";
  resultDiv.innerHTML = "Loading...";

  const data = input
    .split(",")
    .map(s => s.trim())
    .filter(s => s.length > 0);

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ data })
  })
    .then(res => {
      if (!res.ok) throw new Error("API Error");
      return res.json();
    })
    .then(data => {
      renderResult(data);
    })
    .catch(err => {
      resultDiv.innerHTML = "";
      errorDiv.innerText = "Failed to fetch API";
    });
}

function renderResult(data) {
  const resultDiv = document.getElementById("result");

  let html = "";

  html += "<h3>Hierarchies</h3>";
  data.hierarchies.forEach(h => {
    html += `
      <div class="card">
        <strong>Root:</strong> ${h.root} <br/>
        ${h.has_cycle ? "<b>Cycle Detected</b>" : ""}
        ${h.depth ? "<br/>Depth: " + h.depth : ""}
        <pre>${JSON.stringify(h.tree, null, 2)}</pre>
      </div>
    `;
  });

  html += `<h3>Invalid Entries</h3>
           <div class="card">${data.invalid_entries.join(", ")}</div>`;

  html += `<h3>Duplicate Edges</h3>
           <div class="card">${data.duplicate_edges.join(", ")}</div>`;

  html += `
    <h3>Summary</h3>
    <div class="card">
      Trees: ${data.summary.total_trees} <br/>
      Cycles: ${data.summary.total_cycles} <br/>
      Largest Root: ${data.summary.largest_tree_root}
    </div>
  `;

  resultDiv.innerHTML = html;
}