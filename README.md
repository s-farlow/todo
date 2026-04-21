# Full-Stack To-Do Application in React

Full-stack task managment app built with React, TypeScript, Node.js, Express, Redux Toolkit, and SQLite.

## Features

- Add tasks with optional due dates & times
- Mark tasks as complete - completed tasks animate to bottom of list
- Delete individual tasks, all tasks, or all completed tasks
- Completed-task counter with total task count
- Persistent storage through SQLite backend
- Responsive design for desktop and mobile

## Project Structure 

```
my-app/
├── client/          # React frontend
│   └── src/
│       ├── store/   # Redux store, slice, hooks
│       ├── types/   # TypeScript interfaces
│       └── App.tsx
│
└── server/          # Express backend
    └── src/
        ├── routes/  # API route handlers
        ├── db/      # Database setup
        └── types/   # TypeScript interfaces
```

## Set Up

### Required
- Node.js v18 or higher
- npm

### Installation

1. Clone this repository
```bash
   git clone https://github.com/yourusername/my-app.git
   cd my-app
```

2. Install npm for Root Dependencies
```bash
   npm install
```

3. Install Client Dependencies
```bash
   cd client && npm install
```

4. Install Server Dependencies
```bash
   cd ../server && npm install
```

### How To Run the App


From the root, run both the servers simultaneously:
```bash
npm run dev
```


Or separately in seperate terminal windows:

Terminal 1 — Backend [http://localhost:3001](http://localhost:3001)
```bash
cd server && npm run dev
```

Terminal 2 — Frontend [http://localhost:5173](http://localhost:5173)
```bash
cd client && npm run dev
```


Then open  [http://localhost:5173](http://localhost:5173) in your browser.

## Potential Future Additions
- [ ] Add CSS module declaration file
- [ ] Drag and Drop Reordering
- [ ] User Authentication
- [ ] Menu/Navigation + Multiple Tabs for task organization
