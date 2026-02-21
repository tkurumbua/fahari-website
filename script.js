const SUPABASE_URL = "https://dsjmbkrutmaupnkrxinq.supabase.co";
const SUPABASE_KEY = "sb_publishable_LC6ivKBKM555V3rWAtaocg_AIkHCYiL";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
async function submitSuggestion() {
  const message = document.getElementById("message").value;

  if (!message) {
    alert("Please enter suggestion");
    return;
  }

  const { data, error } = await client
    .from("suggestions")
    .insert([
      { message: message }
    ]);

  if (error) {
    console.error(error);
    document.getElementById("response").innerText = "Error submitting.";
  } else {
    document.getElementById("response").innerText = "Submitted successfully.";
    document.getElementById("message").value = "";
  }
}

async function loadSuggestions() {
  const table = document.querySelector("#suggestionsTable tbody");
  if (!table) return;

  const { data, error } = await client
    .from("suggestions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  table.innerHTML = "";

  data.forEach(row => {
    table.innerHTML += `
      <tr>
        <td>${row.id}</td>
        <td>${row.message}</td>
        <td>${row.status}</td>
        <td>${new Date(row.created_at).toLocaleString()}</td>
        <td>
          <button onclick="updateStatus(${row.id}, 'Reviewed')">Review</button>
          <button onclick="updateStatus(${row.id}, 'Resolved')">Resolve</button>
        </td>
      </tr>
    `;
  });
}

async function updateStatus(id, status) {
  await client
    .from("suggestions")
    .update({ status: status })
    .eq("id", id);

  loadSuggestions();
}

loadSuggestions();