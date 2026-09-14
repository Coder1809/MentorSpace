import "./config/environment.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import connectDB from "./config/connectDB.js";
import authModel from "./models/authModel.js";
import mentorModel from "./models/mentorModel.js";
import studentModel from "./models/studentModel.js";
import appointmentModel from "./models/appointmentModel.js";
import transactionModel from "./models/transactionModel.js";
import ratingModel from "./models/ratingModel.js";
import notificationModel from "./models/notificationModel.js";

export const seedDatabase = async (force = false) => {
  try {
    await connectDB();

    const existingUsers = await authModel.countDocuments();
    if (existingUsers > 0 && !force) {
      console.log("Database already seeded. Skipping seed.");
      return;
    }

    console.log("Clearing existing database collections...");

    // Clear all collections in database
    await Promise.all([
      authModel.deleteMany({}),
      mentorModel.deleteMany({}),
      studentModel.deleteMany({}),
      appointmentModel.deleteMany({}),
      transactionModel.deleteMany({}),
      ratingModel.deleteMany({}),
      notificationModel.deleteMany({}),
    ]);

    console.log("Database cleared successfully. Seeding exactly 8 curated Mentor profiles...");

    const salt = await bcrypt.genSalt(10);
    const commonPasswordHash = await bcrypt.hash("Admin123@", salt);

    // Exactly 8 Top-Tier Mentors across distinct software domains
    const mentorDomains = [
      {
        name: "Sarah Chen",
        title: "Senior Frontend Engineer",
        company: "Meta",
        domain: "React",
        phone: "9876543210",
        gender: "Female",
        age: 29,
        exp: "6+ years",
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux"],
        bio: "Senior Frontend Engineer specializing in React, Next.js architecture, state management, and high-performance web applications.",
      },
      {
        name: "Michael Chang",
        title: "Backend System Architect",
        company: "Stripe",
        domain: "Node.js",
        phone: "9876543211",
        gender: "Male",
        age: 34,
        exp: "8+ years",
        skills: ["Node.js", "Express", "Microservices", "PostgreSQL", "Redis"],
        bio: "Backend Architect experienced in building high-throughput APIs, distributed microservices, and event-driven architectures.",
      },
      {
        name: "David Miller",
        title: "Principal Software Engineer",
        company: "Oracle",
        domain: "Java",
        phone: "9876543212",
        gender: "Male",
        age: 36,
        exp: "10+ years",
        skills: ["Java", "Spring Boot", "Enterprise Systems", "Kafka", "Docker"],
        bio: "Principal Java Developer proficient in Spring Boot, enterprise cloud architectures, resilience patterns, and system design.",
      },
      {
        name: "Elena Rostova",
        title: "Full Stack Python Lead",
        company: "Spotify",
        domain: "Python",
        phone: "9876543213",
        gender: "Female",
        age: 30,
        exp: "5+ years",
        skills: ["Python", "FastAPI", "Django", "Data Pipelines", "PostgreSQL"],
        bio: "Full Stack Python Lead experienced in FastAPI services, asynchronous workflows, data processing, and scalable web apps.",
      },
      {
        name: "Dr. Andrew Kim",
        title: "Staff AI Researcher",
        company: "Google DeepMind",
        domain: "Machine Learning",
        phone: "9876543214",
        gender: "Male",
        age: 38,
        exp: "12+ years",
        skills: ["PyTorch", "Deep Learning", "LLMs", "Computer Vision", "TensorFlow"],
        bio: "AI Researcher guiding students in deep learning architectures, transformer models, PyTorch model training, and applied AI.",
      },
      {
        name: "James Wilson",
        title: "Senior DevOps & Cloud Engineer",
        company: "Amazon AWS",
        domain: "DevOps",
        phone: "9876543215",
        gender: "Male",
        age: 35,
        exp: "7+ years",
        skills: ["Kubernetes", "Docker", "AWS", "Terraform", "CI/CD"],
        bio: "DevOps specialist coaching developers on Kubernetes orchestration, Infrastructure as Code, CI/CD automation, and cloud deployments.",
      },
      {
        name: "Emma Watson",
        title: "Lead Product Designer",
        company: "Airbnb",
        domain: "UI/UX",
        phone: "9876543216",
        gender: "Female",
        age: 31,
        exp: "6+ years",
        skills: ["Design Systems", "Figma", "Interaction Design", "User Research", "Prototyping"],
        bio: "Lead Product Designer coaching engineers on design systems, user-centric interfaces, design token workflows, and Figma prototyping.",
      },
      {
        name: "Priya Sharma",
        title: "Staff Software Engineer",
        company: "Microsoft",
        domain: "Data Structures",
        phone: "9876543217",
        gender: "Female",
        age: 28,
        exp: "5+ years",
        skills: ["Algorithms", "Data Structures", "Dynamic Programming", "Graphs", "LeetCode"],
        bio: "Ex-FAANG engineer mentoring students in rigorous algorithmic problem solving, trees & graphs, and technical interview mastery.",
      },
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
        title: item.title,
        company: item.company,
        specialization: item.domain,
        skills: item.skills,
        phone: item.phone,
        gender: item.gender,
        age: item.age,
        experience: item.exp,
        bio: item.bio,
        status: "Active",
        profileComplete: true,
      });

      mentorsCreated.push({ auth: mentorAuth, doc: mentorDoc });
    }
    console.log(`✅ Created exactly ${mentorsCreated.length} curated Mentors`);

    // 2. Create Students
    const studentData = [
      {
        name: "Rahul Verma",
        email: "rahul@student.com",
        phone: "9123456780",
        gender: "Male",
        age: 21,
        desc: "Computer Science Junior aiming for SDE roles.",
      },
      {
        name: "Ananya Gupta",
        email: "ananya@student.com",
        phone: "9123456781",
        gender: "Female",
        age: 22,
        desc: "Final year student preparing for System Design interviews.",
      },
      {
        name: "Karan Patel",
        email: "karan@student.com",
        phone: "9123456782",
        gender: "Male",
        age: 23,
        desc: "Self-taught developer focusing on Full Stack Web Dev.",
      },
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
    console.log(`✅ Created ${studentsCreated.length} Students`);

    // 3. Generate Sample Appointments & Verified Ratings
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 3);

    // Completed appointment for Sarah Chen with Rahul Verma
    const apptCompleted = await appointmentModel.create({
      studentID: studentsCreated[0].doc._id,
      mentorID: mentorsCreated[0].doc._id,
      date: pastDate,
      timeSlot: "Morning",
      status: "Completed",
      reason: "React Architecture & Performance Review",
    });

    // Pending appointment for Michael Chang with Ananya Gupta
    const apptPending = await appointmentModel.create({
      studentID: studentsCreated[1].doc._id,
      mentorID: mentorsCreated[1].doc._id,
      date: tomorrow,
      timeSlot: "Afternoon",
      status: "Pending",
      reason: "Node.js Microservices scale strategy",
    });

    console.log(`✅ Created 2 Sample Appointments`);

    // 4. Sample Verified Transactions
    await transactionModel.create({
      userID: studentsCreated[0].auth._id,
      student: studentsCreated[0].doc._id,
      mentor: mentorsCreated[0].doc._id,
      appointment: apptCompleted._id,
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
      appointment: apptPending._id,
      orderID: `order_seed_${Date.now()}_2`,
      orderId: `order_seed_${Date.now()}_2`,
      paymentID: `pay_seed_${Date.now()}_2`,
      paymentId: `pay_seed_${Date.now()}_2`,
      signature: "seed_verified_hmac_signature_2",
      amount: 149900,
      currency: "INR",
      receipt: `receipt_seed_2`,
      items: [{ name: "Node.js Microservices Strategy", price: 1499, duration: "60 minutes" }],
      status: "success",
    });

    console.log(`✅ Created 2 Sample Verified Transactions`);

    // 5. Sample Verified Rating for Completed Session
    await ratingModel.create({
      mentorID: mentorsCreated[0].doc._id,
      studentID: studentsCreated[0].doc._id,
      appointmentID: apptCompleted._id,
      rating: 5,
      review:
        "Exceptional session! Sarah reviewed my component hierarchy, introduced memoization strategies, and clarified server vs client rendering in Next.js.",
    });

    console.log(`✅ Created 1 Sample Verified 5-Star Rating`);
    console.log("🎉 Database cleared & 8-Mentor Seeding Completed Successfully!");
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
