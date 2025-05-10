# 📱 Momentify — Social Media Platform  
🚀 Share moments, connect with friends, and express yourself in real-time.  

Momentify is a modern, fully responsive social media web application built with the MERN stack. With a sleek UI powered by Chakra UI, real-time interactions via Socket.io, and secure JWT authentication, Momentify offers a seamless social experience.  

## 🌐 Live Demo  
**Live Link:** [Momentify](https://momentify-0w7c.onrender.com/)  

## ⚙️ Key Features  

### 🗨️ Real-time Interactions  
- **Live updates** for posts, likes, and comments using **Socket.io v4.8**  
- **Typing indicators** with Socket.io events  
- **Message seen status** with real-time updates  

### 📝 Post Management  
- **Create/Delete Posts** with Cloudinary image uploads  
- **Like/Unlike** with instant UI feedback  
- **Nested Comments** system  

### 👥 Social Graph  
- **Follow/Unfollow** with profile tracking  
- **User Search** with debounced queries  
- **Profile Customization** using Cloudinary  

### 💬 Chat System  
- **Encrypted messaging** with image support  
- **Message reactions** (❤️/😂/👍) via Socket.io  
- **Notification sounds** with audio API  

### 🎨 UI & UX  
- **🌓 Dark/Light Mode** (Chakra UI Theme)  
- **Mobile-first** responsive design  
- **60FPS animations** with Framer Motion  

### 🔒 Security  
- **JWT Auth** with HTTP-only cookies  
- **Account freezing** with cron cleanup  

## 🛠️ Tech Stack  

### Frontend  
| Technology | Version | Usage |
|------------|---------|-------|
| React | 18.3.1 | Core framework |
| Vite | 6.3.5 | Build tool |
| Chakra UI | 2.10.7 | UI Components |
| Recoil | 0.7.7 | State management |
| Socket.io Client | 4.8.1 | Real-time comms |

### Backend  
| Technology | Version | Usage |
|------------|---------|-------|
| Node.js | 18+ | Runtime |
| Express | 4.18.2 | Server framework |
| MongoDB | 8.13.2 | Database |
| Socket.io | 4.8.1 | WebSockets |
| Cloudinary | 2.6.0 | Image storage |

## 🚀 Getting Started  

### Prerequisites  
- Node.js v18+  
- MongoDB Atlas URI  
- Cloudinary account  

### Installation  
1. Clone the repository:  
   ```bash  
   git clone https://github.com/yourusername/momentify.git  
   cd momentify  
   ```  

2. Install dependencies:  
   ```bash  
   npm install && cd frontend && npm install  
   ```  

3. Configure environment:  
   ```bash
   # backend/.env
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_secure_key
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```

4. Run in development:  
   ```bash
   npm run dev        # Backend (port 5000)
   cd frontend && npm run dev  # Frontend (port 5173)
   ```

## 🚀 Deployment  
**Recommended Setup:**  
- **Frontend:** Vercel (optimized for Vite)  
- **Backend:** Render (with persistent storage)  
- **Database:** MongoDB Atlas  
- **Media:** Cloudinary  

```bash
# Production build
cd frontend && npm run build  # Outputs to /dist
npm start                    # Starts backend
```

## 🤝 Contributing  
1. Fork the repository  
2. Create feature branch:  
   ```bash
   git checkout -b feat/your-feature
   ```  
3. Commit changes:  
   ```bash
   git commit -m "feat: add your feature"
   ```  
4. Push to branch:  
   ```bash
   git push origin feat/your-feature
   ```  

## 📄 License  
MIT © 2023 MirazZim  

## 📩 Connect with Me

- GitHub: [@MirazZim](https://github.com/MirazZim)
- LinkedIn: [Miraz zim](https://www.linkedin.com/in/mirazur-rahman-zim-62a973272/)
