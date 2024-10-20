# 🚍 LuxeTravel – Multi-API Integration Bus Ticketing System

Welcome to **LuxeTravel**! This is a demonstration project showcasing the integration of multiple independent APIs in a unified web platform. This project combines real-time bus seat booking with optional food add-ons, offering a seamless user experience powered by Next.js, Node.js, and Prisma.

## ✨ Features  

- ✅ **Real-time seat booking**: Avoid double bookings with live seat availability.  
- ✅ **Food add-ons**: Enhance your journey with meal options during the booking process.  
- ✅ **Secure authentication**: JWT-based authentication ensures safe transactions.  

## 🎯 Project Goal
This project demonstrates how to integrate multiple APIs from independent services into a cohesive platform. Each API—one for bus ticketing and another for food add-ons—runs independently, but they interact seamlessly with the website. LuxeTravel aims to showcase the complexities and solutions involved in managing secure, real-time data flows between APIs while ensuring a smooth user experience.

## 🔗 Live Demo and API  

- **LuxeTravel Platform**: [travel.moongo.my.id](https://travel.moongo.my.id)  
- **Bus Data Public API**: [api-bus.moongo.my.id](https://api-bus.moongo.my.id/api/bus/buses)  

> **Note**: Bus data is available for **September 22-24, 2024**. Please select these dates when booking for testing purposes.


## 🛠 Tech Stack  

Client-side ![Next.js](https://img.shields.io/badge/-Next.js-000?logo=next.js)  ![Node.js](https://img.shields.io/badge/-Node.js-000?logo=node.js)  ![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-000?logo=tailwindcss)  
Server-side ![Prisma](https://img.shields.io/badge/-Prisma-000?logo=prisma)  ![Express.js](https://img.shields.io/badge/-Express.js-000?logo=express)  ![JWT](https://img.shields.io/badge/-JWT-000?logo=json-web-tokens)  ![AdminJS](https://img.shields.io/badge/-AdminJS-000?logo=adminjs)  ![Context API](https://img.shields.io/badge/-Context%20API-000)  


## 🚀 Project Overview  

LuxeTravel integrates two independent services:  
- **Bus API**: Real-time seat availability.  
- **Food API**: Optional food add-ons for passengers.

Each service operates independently, but they are unified in the LuxeTravel platform to create a seamless user experience.

This project demonstrates:
- Management of multiple APIs independently.
- Implementation of secure JWT-based authentication.
- Client-side state management using Context API.
- Backend management with Prisma for CRUD operations and AdminJS for Dashboard UI.


## 🔧 Installation and Setup  

### 1. Clone the repository:  
```bash
git clone https://github.com/Moontaz/LuxeTravel-v1.0.0.git
cd LuxeTravel-v1.0.0
```

### 2. Client Setup (Next.js Frontend):  
Navigate to the **client** directory:  
```bash
cd client
```

Install dependencies:  
```bash
npm install
```

Run the development server:  
```bash
npm run dev
```

### 3. Server Setup (Node.js Backend for Bus & Food APIs):  
Navigate to the **food-server** or **bus-server** directory:  
```bash
cd server1 #for Bus API
```
```bash
cd server2 #for Food API
```

Install dependencies:  
```bash
npm install
```

Run the server:  
```bash
node app.js
```

### 4. Prisma Configuration (Backend Database):  
Generate Prisma client:  
```bash
npx prisma generate
```

Apply migrations (if any):  
```bash
npx prisma migrate dev
```

### 5. Environment Variables:  
Create a `.env` file in both client and server directories with the following keys:
- **JWT_SECRET**: Secret key for JWT authentication.
- **DATABASE_URL**: MySQL database connection string for Prisma.

Example `.env`:
```
JWT_SECRET=your-secret-key
DATABASE_URL=mysql://user:password@localhost:3306/luxetravel
```

## 💡 How to Use  

1. Visit the [LuxeTravel platform](https://travel.moongo.my.id).  
2. Choose a travel date (e.g., **September 22-24, 2024**).  
3. Select a bus and book your seat in real-time.  
4. Add food to your booking if desired.  
5. Confirm your booking with secure JWT authentication.

## 🙌 Feedback  

I’m excited to hear your thoughts and suggestions! Feel free to open an issue or reach out directly for collaboration opportunities.
