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

    // 3. Create Mentorship Services / Domain Packages
    const services = [
      { name: "System Design Deep Dive", description: "Learn high-level and low-level system design patterns.", category: "System Design", price: 1499, duration: "60 minutes" },
      { name: "DSA & Problem Solving", description: "Master arrays, graphs, trees, and dynamic programming.", category: "DSA", price: 999, duration: "45 minutes" },
      { name: "Frontend & React Review", description: "Code review for React, Next.js, and web performance.", category: "Web Development", price: 1199, duration: "45 minutes" },
      { name: "Machine Learning Guidance", description: "Model design, PyTorch, and AI deployment advice.", category: "Machine Learning", price: 1799, duration: "60 minutes" },
      { name: "Resume & Portfolio Review", description: "Optimize your resume to get interviews at top tech companies.", category: "Resume Review", price: 699, duration: "30 minutes" },
      { name: "Mock Technical Interview", description: "Full simulated coding interview with detailed feedback.", category: "Mock Interview", price: 1999, duration: "60 minutes" },
    ];

    await servicesModel.insertMany(services);
    console.log(`Created ${services.length} Mentorship Services`);

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
