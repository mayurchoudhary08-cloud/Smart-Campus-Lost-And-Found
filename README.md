# Smart Campus Lost & Found

> A college-based Lost & Found web application powered by Data Structures & Algorithms.

**"Lost something? Found something? Let your campus help you find it."**

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-teal)

---

## 📋 Problem Statement

Students frequently lose belongings across campus — in libraries, canteens, classrooms, and sports grounds. Meanwhile, found items may sit unclaimed because there's no easy way to connect finders with owners.

**Smart Campus Lost & Found** solves this by providing a digital platform where students can:
1. Report lost items with photos and details
2. Report found items
3. Get **automatic smart matches** when a lost report matches a found report

## 🎯 Objective

Build a practical campus utility website that demonstrates how **Data Structures and Algorithms** can solve real-world problems — without relying on AI or machine learning.

---

## 🧠 DSA Concepts Used

### 1. Hash Map (`Map<string, Item>`)
- **Purpose:** Fast O(1) item lookup by ID
- **Where:** Item storage, retrieval, and updates
- **Complexity:** O(1) average for get/set/delete

### 2. Priority Queue / Max Heap
- **Purpose:** Rank potential matches by score (highest first)
- **Where:** The matching engine uses a custom `PriorityQueue<T>` class with a max-heap implementation
- **Complexity:** O(log n) insert, O(log n) extract-max, O(1) peek
- **Implementation:** Array-based binary heap with bubble-up and bubble-down

### 3. Searching
- **Purpose:** Find items by keywords across multiple fields
- **Where:** Search bar on the Browse page
- **Complexity:** O(n × m) where n = items, m = query words

### 4. Sorting
- **Purpose:** Order items by date, name, or match score
- **Where:** Browse page sort options
- **Complexity:** O(n log n)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📸 **Photo Upload** | Upload, preview, compress, and store item photos |
| 🔴 **Lost Reports** | Report lost items with full details |
| 🟢 **Found Reports** | Report found items with current location |
| 🔍 **Search** | Keyword search across all item fields |
| 🔽 **Filters** | Filter by type, category, location, status, date |
| 📊 **Smart Matching** | Rule-based matching with detailed score breakdown |
| 📈 **Match Explanations** | See exactly why two items are matched |
| 📋 **Dashboard** | Statistics and activity overview |
| 💾 **Local Persistence** | localStorage + IndexedDB (no server needed) |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile |
| 🎓 **DSA Visualization** | Educational page explaining all algorithms |

---

## 🏗️ Smart Matching Algorithm

The matching engine scores pairs of lost/found items on a 100-point scale:

| Factor | Max Points | Method |
|--------|-----------|--------|
| Item Name | 25 | Word overlap similarity |
| Category | 20 | Exact match |
| Brand | 15 | String similarity |
| Color | 10 | Exact match |
| Location | 20 | Exact/partial match |
| Date Proximity | 10 | Days apart (≤1 day = 10pts) |
| Description | 10 | Keyword overlap (bonus) |

**Score Categories:**
- 🟢 **Strong Match** (80–100): Very likely the same item
- 🟡 **Possible Match** (60–79): Worth checking
- 🟠 **Weak Match** (40–59): Low confidence

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)

### Installation

```bash
# Clone or download the project
cd smart-campus-lost-found

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

### Run Tests

```bash
npm test
```

---

## 📁 Project Structure

```
src/
├── algorithms/           # DSA implementations
│   ├── priorityQueue.ts  # Max Heap / Priority Queue
│   ├── matching.ts       # Smart matching algorithm
│   ├── search.ts         # Keyword search
│   └── sorting.ts        # Sorting utilities
├── components/           # Reusable UI components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ItemCard.tsx
│   ├── SearchBar.tsx
│   ├── FilterBar.tsx
│   ├── PhotoUpload.tsx
│   ├── StatusBadge.tsx
│   ├── MatchCard.tsx
│   ├── MatchBreakdown.tsx
│   ├── Modal.tsx
│   └── Toast.tsx
├── pages/                # Page components
│   ├── Home.tsx
│   ├── Browse.tsx
│   ├── ReportLost.tsx
│   ├── ReportFound.tsx
│   ├── ItemDetails.tsx
│   ├── MyReports.tsx
│   ├── Dashboard.tsx
│   ├── DSAExplanation.tsx
│   └── Settings.tsx
├── data/
│   └── sampleData.ts     # Demo data (30 items)
├── types/
│   └── index.ts          # TypeScript interfaces
├── utils/
│   ├── storage.ts        # localStorage + IndexedDB
│   ├── imageCompression.ts
│   └── dateUtils.ts
├── __tests__/
│   └── algorithms.test.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🎓 Demonstration Flow (for Viva)

1. **Open Home Page** — Show the campus-style UI
2. **Click "Report Lost Item"** — Upload a photo, fill details (Black ASUS Laptop, Electronics, Library, 28 Sept)
3. **Submit** — See the success confirmation with Report ID
4. **Open Browse** — See the new report in the grid
5. **Open a matching Found Item** — See "Possible Match: 92%"
6. **Click "Why this match?"** — Show the detailed score breakdown
7. **Open "How It Works"** — Explain Hash Map, Priority Queue, Searching, Sorting
8. **Dashboard** — Show live statistics

⏱️ This demo takes approximately 3–5 minutes.

---

## ⚙️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite 6 | Build tool |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| React Router | Client-side routing |
| localStorage | Data persistence |
| IndexedDB | Image storage |
| Vitest | Testing |

---

## 🔮 Future Improvements

- User authentication and personal accounts
- Real database (PostgreSQL / MongoDB)
- Push notifications for new matches
- Campus email integration
- Admin moderation panel
- Real-time messaging between reporters
- Cloud image storage (S3 / Cloudinary)
- QR code for item identification
- Mobile app (React Native)

---

## 📄 Complexity Analysis

| Operation | Data Structure | Time Complexity |
|-----------|---------------|-----------------|
| Lookup item by ID | HashMap | O(1) average |
| Insert item | HashMap | O(1) average |
| Find best match | Priority Queue | O(log n) extract |
| Insert match | Priority Queue | O(log n) |
| Search items | Linear scan | O(n × m) |
| Sort items | Comparison sort | O(n log n) |
| Calculate match | Scoring function | O(1) per pair |
| Find all matches | PQ + scoring | O(n log n) |

---

## 📝 License

Built as a Data Structures & Algorithms course project.

© 2026 Smart Campus Lost & Found
