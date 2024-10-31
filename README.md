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

Client-side ![Next.js](https://img.shields.io/badge/-Next.js-000?logo=next.js) 
![TypeScript](https://img.shields.io/badge/-TypeScript-000?&logo=TypeScript)  ![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-000?logo=tailwindcss)  
Server-side ![Node.js](https://img.shields.io/badge/-Node.js-000?logo=node.js) 
![JavaScript](https://img.shields.io/badge/-JavaScript-000?&logo=JavaScript)![Express.js](https://img.shields.io/badge/-Express.js-000?logo=express)  ![Prisma](https://img.shields.io/badge/-Prisma-000?logo=prisma) ![JWT](https://img.shields.io/badge/-JWT-000?logo=json-web-tokens)  ![AdminJS](https://img.shields.io/badge/-AdminJS-000?logo=adminjs)  ![Context API](https://img.shields.io/badge/-Context%20API-000)  

![AdminJS](https://img.shields.io/badge/play-station-blue.svg?logo=data:image/png;base64,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)
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
