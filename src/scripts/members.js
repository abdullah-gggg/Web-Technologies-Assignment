// ===== StudyHub Members: fetch data from a public API with Axios =====

// JSONPlaceholder: a free public API that needs no key. /users returns 10 user objects.
const API_URL = "https://jsonplaceholder.typicode.com/users";

const statusBox = document.getElementById("status");
const grid = document.getElementById("members-grid");

// Loading state: shown until the response arrives
statusBox.textContent = "Loading members...";

axios.get(API_URL)
    .then((response) => {
        // response.data is already a JavaScript array of user objects
        const users = response.data;
        statusBox.textContent = `${users.length} members loaded from the API.`;

        // map() turns each user object into a card of HTML
        grid.innerHTML = users.map((user) => `
            <article class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 class="font-bold text-lg text-slate-900">${user.name}</h2>
                <p class="text-sm text-slate-500">@${user.username}</p>
                <p class="text-sm mt-3">
                    <a href="mailto:${user.email}" class="text-indigo-600 hover:underline">${user.email}</a>
                </p>
                <p class="text-xs text-slate-500 mt-2">${user.company.name} &middot; ${user.address.city}</p>
            </article>
        `).join("");
    })
    .catch((error) => {
        // Error state: no internet, wrong URL or the server is down
        statusBox.textContent = "Could not load members. Check your internet connection and refresh the page.";
        console.error("API request failed:", error);
    });
