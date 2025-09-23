# Task Tracker

A beautiful task tracking application with day-based organization and alarm functionality.

## Features

- 📅 **Day-based Task Organization**: Organize tasks by days of the week
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

- `index.html` – Main UI with sidebar and modern design
- `style.css` – Modern styling with gradients and animations
- `script.js` – Frontend logic with alarm functionality
- `server.js` – Express backend API
- `task-alarm.mp3` – Alarm sound file
- `tasks.json` – Task storage (auto-created)

## API Endpoints

- `GET /tasks` – Get all tasks
- `POST /tasks` – Create a task (`{ text, day, alarmTime }`)
- `PUT /tasks/:id` – Update a task
- `DELETE /tasks/:id` – Delete a task

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Storage**: JSON file storage
- **Deployment**: Render

## License

MIT