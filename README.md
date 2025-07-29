# CineSync - A Movie & Web Series Discovery Portal

Welcome to CineSync! This is a dynamic, single-page web application designed to help users explore upcoming and newly released movies and TV series from around the world.



---

## ✨ Features

- **Dynamic Content:** Fetches the latest release data directly from The Movie Database (TMDB) API.
- **Interactive UI:** Features a modern, responsive flip-card interface to display movie details without cluttering the view.
- **Advanced Filtering:** Users can filter the results by:
  - **Type:** All Releases, Movies Only, or TV & Series Only.
  - **Country:** Filters movies by their original language for more accurate results.
  - **Genre:** A comprehensive list of genres to narrow down choices.
  - **Date Range:** Select a custom start and end date for releases.
- **Detailed Information:** The back of each card reveals:
  - A high-resolution backdrop image.
  - Plot overview, genre tags, and full release date.
  - Average rating and the total number of votes.
- **"Where to Watch" Modal:** Shows the streaming, rental, and purchase options available in the user's selected country.
- **Direct Trailer Access:** A "Watch Trailer" button that intelligently finds the official trailer on YouTube for the specific movie or series.
- **Donation Support:** Includes a "Support Me" button for users who wish to contribute to the project.

---

## 🛠️ Technologies Used

This project was built from scratch using modern web technologies:

- **HTML5:** For the core structure and content.
- **CSS3 & TailwindCSS:** For all styling, responsiveness, and the 3D flip-card animation. TailwindCSS was used for its utility-first approach to building custom designs rapidly.
- **Vanilla JavaScript (ES6+):** For all dynamic functionality, including:
  - Asynchronous API calls (`async/await`) to fetch data from TMDB.
  - Dynamic DOM manipulation to render the movie grid and modals.
  - Event handling for all user interactions.
- **The Movie Database (TMDB) API:** The source of all movie, TV, and provider data.
- **Git & GitHub:** For version control and project management.
- **GitHub Pages:** For deploying the project as a live website.

---

## 🚀 How to Run This Project Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/your-repository-name.git