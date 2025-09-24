# Task Tracker

A beautiful task tracking application with a modern time-slot calendar, sidebar filters, and alarm functionality.

## Features

- 📅 **Calendar Views**: Switch between Day, Week, Month, and Year views
- 🕒 **Time-slot Calendar (Day/Week)**: Block out time ranges with priority colors
- 🧭 **Navigation**: Jump to previous/next periods with a live period display
- 📋 **Sidebar with Filters**: All/Today/This Week/This Month with live counts and grouped tasks
- 📊 **Stats Panel**: Total, Today, This Month, and Completed task counts
- ⏰ **Alarm System**: Set alarms for your tasks with audio notifications
- 🎨 **Modern UI**: Beautiful gradient background with responsive design
- 📱 **Mobile Friendly**: Responsive layout that works on all devices
- 💾 **Persistent Storage**: Tasks are saved and persist between sessions

## Live Demo

🚀 **Deploy to Render**: This app is ready for deployment to Render.com

## Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/ergashruzehaji/Task-Tracker.git
   cd Task-Tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the server**

   ```bash
   npm start
   ```

4. **Open your browser**
   - Visit [http://localhost:3000](http://localhost:3000)

## Deployment to Render

This application is configured for easy deployment to Render:

1. Connect your GitHub repository to Render
2. Select "Web Service"
3. Use these settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

## File Structure

- `index.html` – Main UI with sidebar, view controls, and calendar containers
- `style.css` – Modern styling with gradients, calendar grid, and responsive layout
- `script.js` – Frontend logic: time-slot calendar, sidebar filters, stats, and alarms
- `src/server.js` – Express backend API (Render/production entry)
- `server.js` – Thin proxy that requires `src/server.js` (kept for compatibility)
- `backend/tasks.json` – Task storage (auto-created if missing)
- `task-alarm.mp3` – Alarm sound file

## API Endpoints

All endpoints are prefixed with `/api`:

- `GET /api/tasks` – Get all tasks
- `POST /api/tasks` – Create a task (`{ date, text, priority, alarmTime }`)
- `PUT /api/tasks/:date/:id` – Update a task by date and id
- `DELETE /api/tasks/:date/:id` – Delete a task by date and id

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Storage**: JSON file storage
- **Deployment**: Render

## License

MIT
