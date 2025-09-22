# Task Tracker

A simple web app to track tasks for each day of the week.

## Features

- Add, view, mark complete, and delete tasks for any day of the week.
- Modern UI and responsive layout.
- Persistent storage using a local JSON file (easy to swap for a database).
- Node.js + Express backend API.

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ergashruzehaji/Task-Tracker.git
   cd Task-Tracker
   ```

2. **Install dependencies**
   ```bash
   npm install express
   ```

3. **Run the server**
   ```bash
   node server.js
   ```

4. **Open your browser**
   - Visit [http://localhost:3001](http://localhost:3001)

## File Structure

- `public/index.html` – Main UI
- `public/style.css` – Styling
- `public/script.js` – Frontend logic
- `server.js` – Backend API
- `tasks.json` – Task storage (auto-created)
- `README.md` – Documentation

## API Endpoints

- `GET /api/tasks` – Get all tasks
- `POST /api/tasks` – Create a task (`{ text, day }`)
- `PUT /api/tasks/:id` – Update task completion (`{ completed }`)
- `DELETE /api/tasks/:id` – Delete a task

## Customization

- Swap `tasks.json` for a real database for production.
- Extend the data model with priorities, notes, etc.

## License

MIT