// Wait until the DOM is fully loaded before running any code
document.addEventListener("DOMContentLoaded", () => {
  // Get necessary DOM elements
  const form = document.querySelector("#github-form");
  const searchInput = document.querySelector("#search");
  const userList = document.querySelector("#user-list");
  const reposList = document.querySelector("#repos-list");

  // Listen for form submission to trigger search
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default form behavior (page reload)
    const query = searchInput.value.trim(); // Get user input
    if (query) {
      fetchUsers(query); // Initiate user search
    }
  });

  // Fetch GitHub users based on search query
  function fetchUsers(query) {
    fetch(`https://api.github.com/search/users?q=${query}`, {
      headers: {
        Accept: "application/vnd.github.v3+json" // Required header for GitHub API v3
      }
    })
      .then(res => res.json()) // Parse the JSON response
      .then(data => {
        // Clear previous results
        userList.innerHTML = "";
        reposList.innerHTML = "";

        // Loop through users and render each one
        data.items.forEach(user => renderUser(user));
      })
      .catch(error => console.error("Error fetching users:", error));
  }

  // Display user info on the page
  function renderUser(user) {
    const li = document.createElement("li");

    // Create user card with username, avatar, and profile link
    li.innerHTML = `
      <p><strong>${user.login}</strong></p>
      <img src="${user.avatar_url}" width="100" height="100" style="border-radius: 50%;" />
      <p><a href="${user.html_url}" target="_blank">View Profile</a></p>
    `;

    // Add event listener to fetch user's repositories on click
    li.addEventListener("click", () => fetchRepos(user.login));

    // Append the user card to the list
    userList.appendChild(li);
  }

  // Fetch all public repositories for a specific GitHub user
  function fetchRepos(username) {
    fetch(`https://api.github.com/users/${username}/repos`, {
      headers: {
        Accept: "application/vnd.github.v3+json" // Required header
      }
    })
      .then(res => res.json())
      .then(repos => {
        // Clear and show heading
        reposList.innerHTML = `<h3>Repos for ${username}:</h3>`;

        // Loop through repos and display each one
        repos.forEach(repo => {
          const li = document.createElement("li");
          li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
          reposList.appendChild(li);
        });
      })
      .catch(error => console.error("Error fetching repos:", error));
  }
});
