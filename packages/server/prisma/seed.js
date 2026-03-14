const { PrismaClient } = require("../generated/prisma/client.js");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");
require("dotenv").config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SUGGESTIONS = [
    "Your submission relies heavily on generic phrasing that lacks personal insight. Try grounding your arguments in specific examples from your own experience or the course material. Show your reasoning process rather than presenting conclusions without support.",
    "The structure of your response follows a very formulaic pattern. Consider varying your sentence structure and developing your own analytical voice. Engage more critically with the topic by questioning assumptions rather than restating them.",
    "Your writing lacks the kind of specific detail that comes from genuine engagement with the subject. Revisit the source material and ask yourself what you actually think about it. Your own perspective and analysis are what make academic writing valuable.",
    "Several sections of your submission read as summaries rather than original analysis. Push yourself to go beyond describing what something is and explain why it matters. Your critical thinking is what your instructor wants to see.",
    "The argument in your submission would benefit from more concrete evidence and personal reasoning. Instead of broad generalizations, anchor your points in specific details from the readings or your own observations. Original thinking is always more compelling than polished but hollow prose.",
];

const TEACHERS = [
    {
        name: "Jerry B. Agsunod",
        email: "jerry.agsunod@rethink.edu",
        color: "5e35b1",
    },
    {
        name: "Arnold Platon",
        email: "arnold.platon@rethink.edu",
        color: "1e88e5",
    },
    {
        name: "Joylyn Recon",
        email: "joylyn.recon@rethink.edu",
        color: "d81b60",
    },
    {
        name: "Edwardo Adalla",
        email: "edwardo.adalla@rethink.edu",
        color: "00897b",
    },
];

const COURSES = [
    {
        title: "Software Engineering",
        section: "BSCS 3-B",
        teacherIdx: 0,
        assignments: [
            {
                title: "Software Development Life Cycle Essay",
                description: "Write a 600-word essay comparing the Agile and Waterfall software development methodologies. Discuss the advantages and disadvantages of each, and argue which is more appropriate for a startup environment. Support your claims with real-world examples.",
            },
            {
                title: "Requirements Engineering Report",
                description: "Submit a 500-word requirements analysis report for a hypothetical student enrollment system. Identify at least 5 functional and 3 non-functional requirements. Explain your elicitation process and justify each requirement.",
            },
            {
                title: "Software Testing Reflection",
                description: "Write a 400-word reflective paper on the importance of software testing in the development process. Include discussion of unit testing, integration testing, and system testing. Relate your reflection to a real or hypothetical project scenario.",
            },
        ],
    },
    {
        title: "Networking Fundamentals",
        section: "BSCS 3-B",
        teacherIdx: 1,
        assignments: [
            {
                title: "OSI Model Analysis",
                description: "Write a 500-word technical report explaining each layer of the OSI model and its responsibilities. For each layer, provide a real-world analogy and identify a protocol that operates at that layer. Your report should demonstrate a clear understanding of how data flows through the model.",
            },
            {
                title: "IP Addressing and Subnetting",
                description: "Submit a 400-word written explanation of how IP addressing and subnetting work. Walk through an example of dividing a Class C network into 4 subnets, showing your work and explaining each step in plain language.",
            },
            {
                title: "Network Security Threats Essay",
                description: "Write a 600-word essay identifying and analyzing three common network security threats such as man-in-the-middle attacks, DDoS, or phishing. For each threat, explain how it works, the potential impact, and recommended mitigation strategies.",
            },
        ],
    },
    {
        title: "Art Appreciation",
        section: "BS Philosophy Major in History",
        teacherIdx: 2,
        assignments: [
            {
                title: "Artwork Analysis Paper",
                description: "Choose any painting from the Renaissance or Baroque period and write a 500-word formal analysis. Discuss the use of line, color, composition, and symbolism. Explain what the artwork communicates and how the artist achieved that effect.",
            },
            {
                title: "Contemporary vs. Classical Art Reflection",
                description: "Write a 400-word personal reflection comparing a classical artwork with a contemporary piece of your choosing. What has changed in how art communicates ideas? What has stayed the same? Use specific visual elements to support your comparison.",
            },
            {
                title: "Cultural Context Essay",
                description: "Select an artwork from a non-Western tradition and write a 550-word essay discussing its cultural and historical context. Explain how understanding the culture of origin changes or deepens your appreciation of the work.",
            },
        ],
    },
    {
        title: "The Contemporary World",
        section: "BS Philosophy Major in History",
        teacherIdx: 3,
        assignments: [
            {
                title: "Globalization Impact Essay",
                description: "Write a 600-word essay discussing the impact of globalization on a developing country of your choice. Consider economic, cultural, and political dimensions. Present a balanced argument that acknowledges both benefits and drawbacks.",
            },
            {
                title: "Global Issue Position Paper",
                description: "Choose a pressing global issue — climate change, migration, or digital inequality — and write a 500-word position paper arguing for a specific policy response. Your paper should cite at least two perspectives and demonstrate awareness of the complexity of the issue.",
            },
            {
                title: "Personal Globalization Reflection",
                description: "Write a 400-word personal reflection on how globalization has affected your own life, community, or culture. Be specific and honest. Connect your personal experience to at least one broader concept discussed in the course.",
            },
        ],
    },
];

const STUDENTS = [
    { name: "Jude Grutas", email: "jude.grutas@student.edu" },
    { name: "Carlos Mendez", email: "carlos.mendez@student.edu" },
    { name: "Priya Nair", email: "priya.nair@student.edu" },
    { name: "Liam Santos", email: "liam.santos@student.edu" },
    { name: "Arjay Begino", email: "arjay@student.edu" },
    { name: "Noah Kim", email: "noah.kim@student.edu" },
    { name: "Sofia Reyes", email: "sofia.reyes@student.edu" },
    { name: "Ethan Clarke", email: "ethan.clarke@student.edu" },
    { name: "Amara Osei", email: "amara.osei@student.edu" },
    { name: "Lucas Petrov", email: "lucas.petrov@student.edu" },
    { name: "Mei Lin", email: "mei.lin@student.edu" },
    { name: "Daniel Okafor", email: "daniel.okafor@student.edu" },
    { name: "Isabella Torres", email: "isabella.torres@student.edu" },
    { name: "Ryan Nakamura", email: "ryan.nakamura@student.edu" },
    { name: "Ian Forrest Rogel", email: "ian@student.edu" },
];

const ENROLLMENT_MAP = {
    0: [0, 1, 2, 3, 4, 5, 6, 7],
    1: [3, 4, 5, 8, 9, 10, 11, 12],
    2: [0, 2, 6, 8, 10, 12, 13, 14],
    3: [1, 3, 7, 9, 11, 13, 14, 5],
};

function randomAiScore(flagged) {
    if (flagged) {
        return parseFloat(faker.number.float({ min: 41, max: 95, fractionDigits: 2 }).toFixed(2));
    }
    return parseFloat(faker.number.float({ min: 1, max: 36, fractionDigits: 2 }).toFixed(2));
}

function randomDateInPastWeeks(weeksAgo) {
    const now = new Date();
    const start = new Date(now.getTime() - (weeksAgo + 1) * 7 * 24 * 60 * 60 * 1000);
    const end = new Date(now.getTime() - weeksAgo * 7 * 24 * 60 * 60 * 1000);
    return faker.date.between({ from: start, to: end });
}

function generateCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function seed() {
    console.log("Cleaning existing data...");
    await prisma.suggestion.deleteMany();
    await prisma.result.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.assignment.deleteMany();
    await prisma.material.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash("password123", 12);

    console.log("Seeding teachers...");
    const teachers = await Promise.all(
        TEACHERS.map((t) =>
            prisma.user.create({
                data: {
                    name: t.name,
                    email: t.email,
                    password: hashedPassword,
                    role: "teacher",
                    profilePicture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.name)}&backgroundColor=${t.color}`,
                },
            }),
        ),
    );

    console.log("Seeding students...");
    const students = await Promise.all(
        STUDENTS.map((s) =>
            prisma.user.create({
                data: {
                    ...s,
                    password: hashedPassword,
                    role: "student",
                    profilePicture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(s.name)}&backgroundColor=00897b`,
                },
            }),
        ),
    );

    console.log("Seeding courses...");
    const courses = await Promise.all(
        COURSES.map((c) =>
            prisma.course.create({
                data: {
                    title: c.title,
                    section: c.section,
                    code: generateCode(),
                    userId: teachers[c.teacherIdx].id,
                },
            }),
        ),
    );

    console.log("Seeding enrollments...");
    for (const [courseIdx, studentIdxs] of Object.entries(ENROLLMENT_MAP)) {
        for (const sIdx of studentIdxs) {
            await prisma.enrollment.create({
                data: {
                    userId: students[sIdx].id,
                    courseId: courses[courseIdx].id,
                },
            });
        }
    }

    console.log("Seeding assignments...");
    const assignments = [];
    for (let ci = 0; ci < courses.length; ci++) {
        for (const a of COURSES[ci].assignments) {
            const weeksFromNow = faker.number.int({ min: 1, max: 4 });
            const dueDate = new Date(Date.now() + weeksFromNow * 7 * 24 * 60 * 60 * 1000);
            const assignment = await prisma.assignment.create({
                data: {
                    title: a.title,
                    description: a.description,
                    dueDate,
                    courseId: courses[ci].id,
                    userId: teachers[COURSES[ci].teacherIdx].id,
                },
            });
            assignments.push({ ...assignment, courseIdx: ci });
        }
    }

    console.log("Seeding submissions and results...");
    let submissionCount = 0;
    let flaggedCount = 0;

    for (const assignment of assignments) {
        const enrolledIdxs = ENROLLMENT_MAP[assignment.courseIdx];

        for (const sIdx of enrolledIdxs) {
            const shouldSubmit = faker.datatype.boolean({ probability: 0.8 });
            if (!shouldSubmit) continue;

            const isFlagged = faker.datatype.boolean({ probability: 0.28 });
            const weekOffset = faker.number.int({ min: 0, max: 7 });
            const submittedAt = randomDateInPastWeeks(weekOffset);

            const submission = await prisma.submission.create({
                data: {
                    userId: students[sIdx].id,
                    assignmentId: assignment.id,
                    content: faker.lorem.paragraphs({ min: 3, max: 5 }),
                    submittedAt,
                },
            });

            const aiScore = randomAiScore(isFlagged);

            const result = await prisma.result.create({
                data: {
                    submissionId: submission.id,
                    ai_percentage: aiScore,
                    isFlagged,
                    detectedAt: submittedAt,
                },
            });

            if (isFlagged) {
                await prisma.suggestion.create({
                    data: {
                        resultId: result.id,
                        content: faker.helpers.arrayElement(SUGGESTIONS),
                        createdAt: submittedAt,
                    },
                });
                flaggedCount++;
            }

            submissionCount++;
        }
    }

    console.log(`\nDone. Seeded:`);
    console.log(`  ${teachers.length} teachers`);
    console.log(`  ${students.length} students`);
    console.log(`  ${courses.length} courses`);
    console.log(`  ${assignments.length} assignments`);
    console.log(`  ${submissionCount} submissions (${flaggedCount} flagged)`);
    console.log(`\nTeacher logins:`);
    TEACHERS.forEach((t) => console.log(`  ${t.email} / password123`));
    console.log(`\nSample student login:`);
    console.log(`  aiko.yamamoto@student.edu / password123`);
}

seed()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());