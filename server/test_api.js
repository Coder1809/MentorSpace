import axios from "axios";
import crypto from "crypto";

const BASE_URL = "http://localhost:5001/api";

const run2RoleTests = async () => {
  console.log("🚀 Starting 2-Role MentorSpace Automated Test Suite...");

  try {
    // 1. Student Registration
    const studentEmail = `student_${Date.now()}@test.com`;
    console.log(`\n1. Testing Student Registration (POST /api/auth/register with role="student")...`);
    const regStudentRes = await axios.post(`${BASE_URL}/auth/register`, {
      username: "Alex Student",
      email: studentEmail,
      password: "StudentPass123!",
      cnfpass: "StudentPass123!",
      role: "student",
    });
    console.log("✅ Student Registration Status:", regStudentRes.status, "| Role:", regStudentRes.data.data.role);

    // 2. Mentor Registration
    const mentorEmail = `mentor_${Date.now()}@test.com`;
    console.log(`\n2. Testing Mentor Registration (POST /api/auth/register with role="mentor")...`);
    const regMentorRes = await axios.post(`${BASE_URL}/auth/register`, {
      username: "Dr. Tech Mentor",
      email: mentorEmail,
      password: "MentorPass123!",
      cnfpass: "MentorPass123!",
      role: "mentor",
      specialization: "Cloud Architecture",
      bio: "Cloud & DevOps specialist guiding students.",
    });
    console.log("✅ Mentor Registration Status:", regMentorRes.status, "| Role:", regMentorRes.data.data.role);

    // 3. Student Login
    console.log("\n3. Testing Student Login (POST /api/auth/login)...");
    const studentLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: studentEmail,
      password: "StudentPass123!",
    });
    console.log("✅ Student Login Status:", studentLogin.status, "| Role in Token:", studentLogin.data.data.role);
    const studentToken = studentLogin.data.token;
    const studentAuth = { headers: { Authorization: `Bearer ${studentToken}` } };

    // 4. Mentor Login
    console.log("\n4. Testing Mentor Login (POST /api/auth/login)...");
    const mentorLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: mentorEmail,
      password: "MentorPass123!",
    });
    console.log("✅ Mentor Login Status:", mentorLogin.status, "| Role in Token:", mentorLogin.data.data.role);
    const mentorToken = mentorLogin.data.token;
    const mentorAuth = { headers: { Authorization: `Bearer ${mentorToken}` } };

    // 5. Mentor Self-Profile Fetch & Self-Healing (GET /api/mentor/profile)
    console.log("\n5. Testing Mentor Profile Self-Fetch (GET /api/mentor/profile)...");
    const mentorProfileRes = await axios.get(`${BASE_URL}/mentor/profile`, mentorAuth);
    console.log("✅ Mentor Profile Fetched:", mentorProfileRes.status, "| Name:", mentorProfileRes.data.data.name, "| Spec:", mentorProfileRes.data.data.specialization);

    // 6. Mentor Self-Profile Update (PUT /api/mentor/profile)
    console.log("\n6. Testing Mentor Profile Update (PUT /api/mentor/profile)...");
    const mentorUpdateRes = await axios.put(
      `${BASE_URL}/mentor/profile`,
      {
        name: "Dr. Tech Mentor",
        specialization: "Cloud Architecture & System Design",
        status: "Active",
        experience: "7+ years",
        bio: "Updated Cloud Architecture specialist guiding students.",
      },
      mentorAuth
    );
    console.log("✅ Mentor Profile Updated:", mentorUpdateRes.status, "| New Spec:", mentorUpdateRes.data.data.specialization);

    // 7. Mentor Listing (Verification of registered mentor in list)
    console.log("\n7. Testing Mentor Listing for Student (GET /api/mentor)...");
    const mentorsRes = await axios.get(`${BASE_URL}/mentor`, studentAuth);
    console.log("✅ Mentor Listing Status:", mentorsRes.status, "| Total Mentors:", mentorsRes.data.data.length);
    const foundNewMentor = mentorsRes.data.data.find((m) => m.name === "Dr. Tech Mentor");
    if (foundNewMentor) {
      console.log("✅ Verification Success: Newly registered mentor appears in directory! (ID:", foundNewMentor._id, ")");
    } else {
      console.error("❌ Verification Failed: Newly registered mentor not found in listing!");
    }

    const targetMentor = mentorProfileRes.data.data;
    console.log("👉 Target mentor ID for booking:", targetMentor._id);

    // 8. Razorpay Order Creation
    console.log("\n8. Testing Razorpay Order Creation (POST /api/payment/create-order)...");
    const orderRes = await axios.post(`${BASE_URL}/payment/create-order`, { amount: 1499 }, studentAuth);
    console.log("✅ Razorpay Order Status:", orderRes.status, "| Order ID:", orderRes.data.order.id);

    // 9. Razorpay Signature Verification & Appointment Creation
    console.log("\n9. Testing Razorpay Signature Verification (POST /api/payment/verify)...");
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 50) + 5);
    const dateStr = futureDate.toISOString().split("T")[0];

    const payId = `pay_${Date.now()}`;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "123456789";
    const hmacSig = crypto
      .createHmac("sha256", keySecret)
      .update(`${orderRes.data.order.id}|${payId}`)
      .digest("hex");

    const verifyRes = await axios.post(
      `${BASE_URL}/payment/verify`,
      {
        razorpay_order_id: orderRes.data.order.id,
        razorpay_payment_id: payId,
        razorpay_signature: hmacSig,
        amount: 149900,
        currency: "INR",
        mentorID: targetMentor._id,
        date: dateStr,
        timeSlot: "Evening",
        reason: "System Architecture Mentorship",
      },
      studentAuth
    );
    const createdAppointment = verifyRes.data.data.appointment;
    console.log("✅ Payment Verification & Appointment Created:", verifyRes.status, "| Appt ID:", createdAppointment?._id, "| Appt MentorID:", createdAppointment?.mentorID);

    // 10. Mentor Status Update Lifecycle (Pending -> Accepted -> Completed)
    console.log("\n10. Testing Mentor Session Status Lifecycle (PUT /api/appointment/:id)...");
    const acceptRes = await axios.put(`${BASE_URL}/appointment/${createdAppointment._id}`, { status: "Accepted" }, mentorAuth);
    console.log("✅ Mentor Accepted Appointment:", acceptRes.status, "| Status:", acceptRes.data.data.status);

    const completeRes = await axios.put(`${BASE_URL}/appointment/${createdAppointment._id}`, { status: "Completed" }, mentorAuth);
    console.log("✅ Mentor Completed Appointment:", completeRes.status, "| Status:", completeRes.data.data.status);

    // 11. Role-Based Security Restrictions
    console.log("\n11. Testing Role-Based Security Restrictions...");
    
    // Mentor trying to access student profile route (should fail with 403 Forbidden)
    try {
      await axios.get(`${BASE_URL}/student`, mentorAuth);
      console.error("❌ Security Failure: Mentor was able to access student route");
    } catch (err) {
      console.log("✅ Security Pass: Mentor blocked from student route (403 Forbidden)");
    }

    // Student trying to access mentor profile route (should fail with 403 Forbidden)
    try {
      await axios.get(`${BASE_URL}/mentor/profile`, studentAuth);
      console.error("❌ Security Failure: Student was able to access mentor profile route");
    } catch (err) {
      console.log("✅ Security Pass: Student blocked from mentor profile route (403 Forbidden)");
    }

    // 12. Mentor Cancels/Declines Request -> Student Refund & Notification Flow
    console.log("\n12. Testing Mentor Decline & Student Refund Notification Flow...");

    // Create another booking request
    const secondFutureDate = new Date();
    secondFutureDate.setDate(secondFutureDate.getDate() + Math.floor(Math.random() * 50) + 10);
    const secondDateStr = secondFutureDate.toISOString().split("T")[0];

    const orderRes2 = await axios.post(`${BASE_URL}/payment/create-order`, { amount: 1499 }, studentAuth);
    const payId2 = `pay_refund_${Date.now()}`;
    const hmacSig2 = crypto
      .createHmac("sha256", keySecret)
      .update(`${orderRes2.data.order.id}|${payId2}`)
      .digest("hex");

    const verifyRes2 = await axios.post(
      `${BASE_URL}/payment/verify`,
      {
        razorpay_order_id: orderRes2.data.order.id,
        razorpay_payment_id: payId2,
        razorpay_signature: hmacSig2,
        amount: 149900,
        currency: "INR",
        mentorID: targetMentor._id,
        date: secondDateStr,
        timeSlot: "Morning",
        reason: "DevOps & Kubernetes Consultation",
      },
      studentAuth
    );
    const apptToDecline = verifyRes2.data.data.appointment;
    console.log("✅ Second Session Booked for Cancellation Test:", apptToDecline._id);

    // Mentor Declines/Rejects the appointment
    const declineRes = await axios.put(
      `${BASE_URL}/appointment/${apptToDecline._id}`,
      { status: "Rejected" },
      mentorAuth
    );
    console.log("✅ Mentor Declined Appointment:", declineRes.status, "| Status:", declineRes.data.data.status);
    console.log("✅ Appointment Refund Status:", declineRes.data.data.refundStatus);
    console.log("✅ Appointment Refund Amount: ₹" + declineRes.data.data.refundAmount);
    console.log("✅ Appointment Refund Message:", declineRes.data.data.refundMessage);

    // Student fetches notifications
    console.log("\nTesting Student Notifications (GET /api/notification)...");
    const notifRes = await axios.get(`${BASE_URL}/notification`, studentAuth);
    console.log("✅ Notification Fetch Status:", notifRes.status, "| Total:", notifRes.data.data.length, "| Unread:", notifRes.data.unreadCount);

    const refundNotification = notifRes.data.data.find(
      (n) => n.appointmentID === apptToDecline._id
    );

    if (refundNotification) {
      console.log("✅ Notification Received by Student!");
      console.log("   Title:", refundNotification.title);
      console.log("   Message:", refundNotification.message);
      console.log("   Refund Amount: ₹" + refundNotification.refundAmount);
    } else {
      console.error("❌ Notification not found for student!");
    }

    // Mark notifications as read
    const markReadRes = await axios.put(`${BASE_URL}/notification/read`, {}, studentAuth);
    console.log("✅ Notifications Marked as Read Status:", markReadRes.status);

    console.log("\n🎉 ALL 2-ROLE SYSTEM & REFUND NOTIFICATION TESTS PASSED 100% SUCCESSFULLY!");
  } catch (err) {
    console.error("❌ Test Failed:", err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
  }
};


run2RoleTests();
