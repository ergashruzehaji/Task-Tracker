# Weekly Task Tracker

A modern web application for organizing tasks by day and time. Built with Node.js, Express, and vanilla JavaScript.

## ✨ Features

- **Weekly Planner Layout**: View tasks organized by days of the week (Sunday through Saturday)
- **Hourly Time Slots**: Assign tasks to specific hours or keep them as all-day tasks
- **Task Management**: Add, complete, and delete tasks with ease
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Instant UI updates when managing tasks
- **Clean Architecture**: Separate backend and frontend folders for better organization
- **JSON Storage**: Simple file-based storage that's easy to backup and migrate

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ergashruzehaji/Task-Tracker.git
   cd Task-Tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   - Visit [http://localhost:3001](http://localhost:3001)

## 📁 Project Structure

```
Task-Tracker/
├── backend/
│   ├── server.js          # Express server and API routes
│   └── tasks.json         # Task data storage (auto-created)
├── frontend/
│   ├── index.html         # Main UI
│   ├── style.css          # Styling and responsive design
│   └── script.js          # Frontend logic and API calls
├── package.json           # Project configuration
└── README.md             # This file
```

## 🛠 API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:day` - Get tasks for a specific day
- `POST /api/tasks` - Create a new task
  - Body: `{ text: string, day: string, hour?: number }`
- `PUT /api/tasks/:id` - Update task (completion, hour, text)
  - Body: `{ completed?: boolean, hour?: number, text?: string }`
- `DELETE /api/tasks/:id` - Delete a task

### Frontend
- `GET /` - Serve the main application

## 💡 Usage

### Adding Tasks
1. Enter your task description
2. Select a day of the week
3. Optionally select a specific hour (leave blank for all-day tasks)
4. Click "Add Task"

### Managing Tasks
- **Complete a task**: Check the checkbox next to the task
- **Delete a task**: Click the × button on the task
- **View by time**: Tasks are organized by all-day and hourly sections

### Time Organization
- **All Day**: Tasks without specific times appear in the "All Day" section
- **Hourly**: Tasks with specific times appear in time slots (6 AM - 11 PM shown by default)

## 🎨 Customization

### Adding More Time Slots
Edit the `commonHours` array in `frontend/script.js`:
```javascript
const commonHours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
```

### Database Integration
Replace the JSON file storage in `backend/server.js` with your preferred database:
- SQLite for a lightweight database
- PostgreSQL/MySQL for production use
- MongoDB for document-based storage

### Styling
Modify `frontend/style.css` to customize:
- Color themes
- Layout dimensions
- Typography
- Responsive breakpoints

## 🌐 Deployment

### Production Setup
1. Set the `PORT` environment variable
2. Consider using PM2 for process management
3. Set up a reverse proxy (nginx/Apache) for static files
4. Implement proper logging and error handling

### Environment Variables
- `PORT` - Server port (default: 3001)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Future Enhancements

- [ ] User authentication and multiple user support
- [ ] Task categories and color coding
- [ ] Recurring tasks
- [ ] Task priorities
- [ ] Export/import functionality
- [ ] Calendar integration
- [ ] Mobile app version
- [ ] Push notifications