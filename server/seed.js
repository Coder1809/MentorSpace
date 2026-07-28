import "./config/environment.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import connectDB from "./config/connectDB.js";
import authModel from "./models/authModel.js";
import mentorModel from "./models/mentorModel.js";
import studentModel from "./models/studentModel.js";
import appointmentModel from "./models/appointmentModel.js";
import servicesModel from "./models/servicesModel.js";
import transactionModel from "./models/transactionModel.js";

export const seedDatabase = async (force = false) => {
  try {
    await connectDB();

    const existingUsers = await authModel.countDocuments();
    if (existingUsers > 0 && !force) {
      console.log("Database already seeded. Skipping seed.");
      return;
    }

    console.log("Seeding database for 2-Role MentorSpace platform...");

    // Clear existing data
    await Promise.all([
      authModel.deleteMany({}),
      mentorModel.deleteMany({}),
      studentModel.deleteMany({}),
      appointmentModel.deleteMany({}),
      servicesModel.deleteMany({}),
      transactionModel.deleteMany({}),
    ]);

    const salt = await bcrypt.genSalt(10);
    const commonPasswordHash = await bcrypt.hash("Admin123@", salt);

    // 1. Create 10 Mentors across requested domains
    const mentorDomains = [
      { name: "Sarah Chen", domain: "React", phone: "9876543210", gender: "Female", age: 29, exp: "6+ years", bio: "Senior Frontend Engineer specializing in React, Next.js, and Web Performance." },
      { name: "Michael Chang", domain: "Node.js", phone: "9876543211", gender: "Male", age: 34, exp: "8+ years", bio: "Backend Architect experienced in Express, Microservices, and Distributed Systems." },
      { name: "David Miller", domain: "Java", phone: "9876543212", gender: "Male", age: 36, exp: "10+ years", bio: "Principal Java Developer proficient in Spring Boot, Enterprise Architecture, and System Design." },
      { name: "Elena Rostova", domain: "Python", phone: "9876543213", gender: "Female", age: 30, exp: "5+ years", bio: "Full Stack Python Lead experienced in FastApi, Django, and Data Pipelines." },
      { name: "Dr. Andrew Kim", domain: "Machine Learning", phone: "9876543214", gender: "Male", age: 38, exp: "12+ years", bio: "AI Researcher guiding students in PyTorch, Computer Vision, and Deep Learning models." },
      { name: "James Wilson", domain: "DevOps", phone: "9876543215", gender: "Male", age: 35, exp: "7+ years", bio: "DevOps & Cloud Engineer specializing in Kubernetes, Docker, CI/CD, and Infrastructure as Code." },
      { name: "Emma Watson", domain: "UI/UX", phone: "9876543216", gender: "Female", age: 31, exp: "6+ years", bio: "Lead Product Designer training engineers in Design Systems, Figma, and User Centric UI." },
      { name: "Priya Sharma", domain: "Data Structures", phone: "9876543217", gender: "Female", age: 28, exp: "5+ years", bio: "Ex-FAANG engineer mentoring students in DSA, Algorithmic thinking, and Coding Interviews." },
      { name: "Vikram Malhotra", domain: "Competitive Programming", phone: "9876543218", gender: "Male", age: 27, exp: "4+ years", bio: "Candidate Master on Codeforces assisting students in Advanced Algorithms and Speed Coding." },
      { name: "Robert Taylor", domain: "Cloud", phone: "9876543219", gender: "Male", age: 37, exp: "9+ years", bio: "AWS Certified Solutions Architect mentoring in Cloud Security, Serverless, and GCP." },
    ];

    const mentorsCreated = [];
    for (const item of mentorDomains) {
      const email = `${item.name.toLowerCase().replace(/[^a-z]/g, "")}@mentorspace.com`;
      const mentorAuth = await authModel.create({
        name: item.name,
        email,
        password: commonPasswordHash,
        role: "mentor",
      });

      const mentorDoc = await mentorModel.create({
        mentorID: mentorAuth._id,
        name: item.name,
        specialization: item.domain,
        phone: item.phone,
        gender: item.gender,
        age: item.age,
        experience: item.exp,
        bio: item.bio,
        status: "Active",
      });

      mentorsCreated.push({ auth: mentorAuth, doc: mentorDoc });
    }
    console.log(`Created ${mentorsCreated.length} Mentors`);

    // 2. Create 5 Students
    const studentData = [
      { name: "Rahul Verma", email: "rahul@student.com", phone: "9123456780", gender: "Male", age: 21, desc: "Computer Science Junior aiming for SDE roles." },
      { name: "Ananya Gupta", email: "ananya@student.com", phone: "9123456781", gender: "Female", age: 22, desc: "Final year student preparing for System Design interviews." },
      { name: "Karan Patel", email: "karan@student.com", phone: "9123456782", gender: "Male", age: 23, desc: "Self-taught developer focusing on Full Stack Web Dev." },
      { name: "Sneha Reddy", email: "sneha@student.com", phone: "9123456783", gender: "Female", age: 20, desc: "Exploring Machine Learning and Python data pipelines." },
      { name: "Devansh Shah", email: "devansh@student.com", phone: "9123456784", gender: "Male", age: 24, desc: "Preparing for competitive programming contests." },
    ];

    const studentsCreated = [];
    for (const item of studentData) {
      const studentAuth = await authModel.create({
        name: item.name,
        email: item.email,
        password: commonPasswordHash,
        role: "student",
      });

      const studentDoc = await studentModel.create({
        studentID: studentAuth._id,
        name: item.name,
        age: item.age,
        gender: item.gender,
        phone: item.phone,
        description: item.desc,
      });

      studentsCreated.push({ auth: studentAuth, doc: studentDoc });
    }
    console.log(`Created ${studentsCreated.length} Students`);

    // 3. Create Mentorship Tracks (Structured Multi-Week Programs)
    const services = [
      {
        name: "Full-Stack Web Engineering Track",
        description: "A comprehensive 6-week mentorship track covering production React architecture, Node.js microservices, Database optimization, and cloud deployment with weekly 1-on-1 code reviews.",
        category: "Web Development",
        price: 4999,
        durationWeeks: 6,
        totalSessions: 12,
        duration: "6 Weeks (12 Live 1-on-1 Sessions)",
        skillsCovered: ["React 19", "Node.js", "TypeScript", "PostgreSQL", "Docker", "CI/CD"],
        mentorDetails: "Sarah Chen (Ex-FAANG Senior Engineer)",
        milestones: [
          "Week 1: Advanced React Patterns & Custom Hooks Architecture",
          "Week 2: Backend REST & GraphQL Microservices Design",
          "Week 3: Database Indexing, Query Tuning & Mongoose Schemas",
          "Week 4: Auth Systems, JWT, OAuth2 & Security Audit",
          "Week 5: Docker Containerization & Cloud Deployment Pipeline",
          "Week 6: Full Capstone Code Review & Mock Technical Interview",
        ],
        trackType: "Mentorship Track",
      },
      {
        name: "FAANG System Design & Scalability Track",
        description: "Master high-level and low-level system design patterns, distributed caching, load balancing, message queues, and database sharding over 4 intensive weeks.",
        category: "System Design",
        price: 3999,
        durationWeeks: 4,
        totalSessions: 8,
        duration: "4 Weeks (8 Live 1-on-1 Sessions)",
        skillsCovered: ["Distributed Systems", "Redis Caching", "Kafka", "Microservices", "API Gateways"],
        mentorDetails: "Michael Chang (Backend Architect & Ex-FAANG)",
        milestones: [
          "Week 1: Scalability Fundamentals, Load Balancing & CDN Strategy",
          "Week 2: Distributed Databases, NoSQL vs SQL, Replication & Sharding",
          "Week 3: Asynchronous Systems, Kafka Queues & Event-Driven Microservices",
          "Week 4: Real-World Design Simulation (Url Shortener, Uber, Netflix)",
        ],
        trackType: "Mentorship Track",
      },
      {
        name: "Data Structures & Algorithmic Mastery Track",
        description: "Structured 8-week intensive program designed to master core DSA patterns, Dynamic Programming, Graph algorithms, and top Tech Coding Interviews.",
        category: "DSA",
        price: 5999,
        durationWeeks: 8,
        totalSessions: 16,
        duration: "8 Weeks (16 Live 1-on-1 Sessions)",
        skillsCovered: ["Arrays & Sliders", "Trees & Graphs", "Dynamic Programming", "Tries & Heaps"],
        mentorDetails: "Priya Sharma (Ex-Google Software Engineer)",
        milestones: [
          "Week 1-2: Two Pointers, Sliding Window & Fast/Slow Pointer Patterns",
          "Week 3-4: Binary Trees, BFS/DFS Traversal & Binary Search Trees",
          "Week 5-6: Advanced Graph Algorithms (Dijkstra, Topological Sort)",
          "Week 7-8: Dynamic Programming Memoization & Simulated Coding Sprints",
        ],
        trackType: "Mentorship Track",
      },
      {
        name: "Applied Machine Learning & AI Engineering Track",
        description: "Build, evaluate, and deploy deep learning models, LLM prompt pipelines, and computer vision models with expert 1-on-1 guidance.",
        category: "Machine Learning",
        price: 6499,
        durationWeeks: 6,
        totalSessions: 12,
        duration: "6 Weeks (12 Live 1-on-1 Sessions)",
        skillsCovered: ["PyTorch", "Transformers", "RAG Pipelines", "Model Optimization", "MLOps"],
        mentorDetails: "Dr. Andrew Kim (AI Research Scientist)",
        milestones: [
          "Week 1: Data Wrangling, Feature Engineering & Linear Models",
          "Week 2: Deep Neural Networks & PyTorch Fundamentals",
          "Week 3: Transformers & Large Language Model Fine-Tuning",
          "Week 4: RAG Systems, Vector Databases & Semantic Search",
          "Week 5-6: MLOps Deployment, API Integration & Model Auditing",
        ],
        trackType: "Mentorship Track",
      },
      {
        name: "Cloud Architecture & DevOps Track",
        description: "Master AWS/GCP cloud design, Terraform infrastructure-as-code, Kubernetes orchestration, and continuous integration pipelines.",
        category: "DevOps",
        price: 4499,
        durationWeeks: 4,
        totalSessions: 8,
        duration: "4 Weeks (8 Live 1-on-1 Sessions)",
        skillsCovered: ["AWS Cloud", "Kubernetes", "Terraform", "GitHub Actions", "Prometheus"],
        mentorDetails: "James Wilson (Principal Cloud DevOps Architect)",
        milestones: [
          "Week 1: AWS Core Infrastructure (VPC, EC2, S3, IAM)",
          "Week 2: Infrastructure as Code with Terraform & Modular Setup",
          "Week 3: Container Orchestration with Kubernetes & Helm Charts",
          "Week 4: Automated CI/CD Pipelines & Monitoring Dashboards",
        ],
        trackType: "Mentorship Track",
      },
      {
        name: "UI/UX & Product Design Engineering Track",
        description: "Transform raw product ideas into modern interactive design systems, Figma prototypes, and responsive accessible user interfaces.",
        category: "UI/UX",
        price: 3499,
        durationWeeks: 4,
        totalSessions: 8,
        duration: "4 Weeks (8 Live 1-on-1 Sessions)",
        skillsCovered: ["Figma Systems", "User Research", "Wireframing", "Micro-Animations", "Design Tokens"],
        mentorDetails: "Emma Watson (Lead Product Designer)",
        milestones: [
          "Week 1: UX Research, Persona Mapping & Information Architecture",
          "Week 2: Figma Design System, Auto-Layout & UI Components",
          "Week 3: Micro-Interactions, Motion & Prototyping",
          "Week 4: Design Hand-Off, Accessibility Audit & Portfolio Review",
        ],
        trackType: "Mentorship Track",
      },
    ];

    await servicesModel.insertMany(services);
    console.log(`Created ${services.length} Structured Mentorship Tracks`);

    // 4. Generate Sample Appointments
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    const appt1 = await appointmentModel.create({
      studentID: studentsCreated[0].doc._id,
      mentorID: mentorsCreated[0].doc._id,
      date: tomorrow,
      timeSlot: "Morning",
      status: "Pending",
      reason: "React Architecture & Component performance review",
    });

    const appt2 = await appointmentModel.create({
      studentID: studentsCreated[1].doc._id,
      mentorID: mentorsCreated[1].doc._id,
      date: dayAfter,
      timeSlot: "Afternoon",
      status: "Completed",
      reason: "Node.js Microservices scale strategy",
    });

    console.log(`Created 2 Sample Appointments`);

    // 5. Generate Sample Transactions with Signature Verification Fields
    await transactionModel.create({
      userID: studentsCreated[0].auth._id,
      student: studentsCreated[0].doc._id,
      mentor: mentorsCreated[0].doc._id,
      appointment: appt1._id,
      orderID: `order_seed_${Date.now()}_1`,
      orderId: `order_seed_${Date.now()}_1`,
      paymentID: `pay_seed_${Date.now()}_1`,
      paymentId: `pay_seed_${Date.now()}_1`,
      signature: "seed_verified_hmac_signature_1",
      amount: 149900,
      currency: "INR",
      receipt: `receipt_seed_1`,
      items: [{ name: "React Architecture Review", price: 1499, duration: "60 minutes" }],
      status: "success",
    });

    await transactionModel.create({
      userID: studentsCreated[1].auth._id,
      student: studentsCreated[1].doc._id,
      mentor: mentorsCreated[1].doc._id,
      appointment: appt2._id,
      orderID: `order_seed_${Date.now()}_2`,
      orderId: `order_seed_${Date.now()}_2`,
      paymentID: `pay_seed_${Date.now()}_2`,
      paymentId: `pay_seed_${Date.now()}_2`,
      signature: "seed_verified_hmac_signature_2",
      amount: 99900,
      currency: "INR",
      receipt: `receipt_seed_2`,
      items: [{ name: "Node.js Microservices", price: 999, duration: "45 minutes" }],
      status: "success",
    });

    console.log(`Created 2 Sample Verified Transactions`);
    console.log("✅ 2-Role Database Seed Completed Successfully!");
  } catch (err) {
    console.error("❌ Seeding Error:", err);
  }
};

if (process.argv[1]?.endsWith("seed.js")) {
  seedDatabase(true).then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}
