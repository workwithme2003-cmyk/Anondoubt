# AnonDoubt 🤫

AnonDoubt is a beautiful, modern, and lightweight anonymous college doubt sharing and discussion forum. It allows students to ask questions across multiple subjects (such as Computer Science, Mathematics, Physics, Chemistry, Economics, and Biology) and get answers completely anonymously.

---

## 🚀 Features

- **100% Anonymous Q&A:** Post questions and write answers without logging in or revealing your identity.
- **Upvote System:** Upvote important questions so they rise to the top of the popular feed.
- **Categorization & Sorting:**
  - Filter questions by subject (Mathematics, Computer Science, Physics, Chemistry, etc.).
  - Sort questions by *Latest*, *Popular*, or view only *Unanswered* questions.
- **Real-time Search:** Filter doubts instantly using the search bar.
- **Seed Data:** Automatically pre-seeded with helpful sample doubts on startup.
- **Persistent Storage:** Uses a simple, robust JSON file-based database (`db.json`) for data persistence.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, Vanilla CSS, JavaScript (ES6)
- **Backend:** Node.js, Express.js
- **Database:** JSON File Storage (`fs` module)
- **Utilities:** `uuid` for unique identifiers, `cors` for cross-origin requests

---

## 📦 Installation & Setup

Make sure you have [Node.js](https://nodejs.org/) installed.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/workwithme2003-cmyk/Anondoubt.git
   cd Anondoubt
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   ```

4. **Start the Application:**
   * For production/standard execution:
     ```bash
     npm start
     ```
   * For development (with hot-reload):
     ```bash
     npm run dev
     ```

5. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔌 API Endpoints

The server exposes the following REST API endpoints:

| Method | Endpoint | Description |
|---|---|---|
| **GET** | `/api/questions` | Get all questions (supports query params: `subject`, `sort`, `search`) |
| **GET** | `/api/questions/:id` | Get detailed view of a single question and its answers |
| **POST** | `/api/questions` | Create a new question |
| **PATCH** | `/api/questions/:id/vote` | Upvote/downvote a question |
| **POST** | `/api/questions/:id/answers` | Add an answer to a question |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
