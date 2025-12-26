const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const Company = require('../models/company.model');
const Job = require('../models/job.model');
const Notice = require('../models/notice.model');

dotenv.config();

const argSet = new Set(process.argv.slice(2));
const shouldReset = argSet.has('--reset') || argSet.has('-r');

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

const connect = async () => {
  await mongoose.connect(requireEnv('MONGODB_URL'));
};

const safeDeleteAll = async () => {
  await Promise.all([
    Notice.deleteMany({}),
    Job.deleteMany({}),
    Company.deleteMany({}),
    User.deleteMany({})
  ]);
};

const hash = async (plain) => bcrypt.hash(plain, 10);

const seed = async () => {
  const port = process.env.PORT || '5000';

  const superuserEmail = process.env.SEED_SUPERUSER_EMAIL || 'admin@cpms.local';
  const superuserPassword = process.env.SEED_SUPERUSER_PASSWORD || 'Admin@12345';

  const tpoEmail = process.env.SEED_TPO_EMAIL || 'tpo@cpms.local';
  const tpoPassword = process.env.SEED_TPO_PASSWORD || 'Tpo@12345';

  const managementEmail = process.env.SEED_MANAGEMENT_EMAIL || 'management@cpms.local';
  const managementPassword = process.env.SEED_MANAGEMENT_PASSWORD || 'Management@12345';

  const studentPassword = process.env.SEED_STUDENT_PASSWORD || 'Student@12345';

  const existingAdmin = await User.findOne({ email: superuserEmail });
  if (existingAdmin) {
    throw new Error(`Seed aborted: a user already exists with email ${superuserEmail}. Use --reset if this is a dev database.`);
  }

  const [superuserHash, tpoHash, managementHash, studentHash] = await Promise.all([
    hash(superuserPassword),
    hash(tpoPassword),
    hash(managementPassword),
    hash(studentPassword)
  ]);

  const superuser = await User.create({
    first_name: 'Super',
    last_name: 'Admin',
    email: superuserEmail,
    password: superuserHash,
    role: 'superuser',
    number: 9999999999
  });

  const tpo = await User.create({
    first_name: 'TPO',
    last_name: 'Admin',
    email: tpoEmail,
    password: tpoHash,
    role: 'tpo_admin',
    number: 8888888888,
    tpoProfile: { position: 'Training & Placement Officer' }
  });

  const management = await User.create({
    first_name: 'Management',
    last_name: 'Admin',
    email: managementEmail,
    password: managementHash,
    role: 'management_admin',
    number: 7777777777,
    managementProfile: { position: 'Placement Coordinator' }
  });

  const students = await User.create([
    {
      first_name: 'Aarav',
      last_name: 'Sharma',
      email: 'student1@cpms.local',
      password: studentHash,
      role: 'student',
      number: 9000000001,
      isProfileCompleted: true,
      studentProfile: {
        isApproved: true,
        rollNumber: 101,
        USN: 'USN001',
        department: 'Computer',
        year: 4,
        addmissionYear: 2022
      }
    },
    {
      first_name: 'Diya',
      last_name: 'Patel',
      email: 'student2@cpms.local',
      password: studentHash,
      role: 'student',
      number: 9000000002,
      isProfileCompleted: true,
      studentProfile: {
        isApproved: true,
        rollNumber: 102,
        USN: 'USN002',
        department: 'AIDS',
        year: 4,
        addmissionYear: 2022
      }
    }
  ]);

  const [companyA, companyB] = await Company.create([
    {
      companyName: 'NovaTech',
      companyDescription: 'Product-focused software company building modern web platforms.',
      companyWebsite: 'https://example.com',
      companyLocation: 'Bengaluru',
      companyDifficulty: 'Moderate'
    },
    {
      companyName: 'Skyline Systems',
      companyDescription: 'Engineering-led team working on cloud-native services.',
      companyWebsite: 'https://example.com',
      companyLocation: 'Mumbai',
      companyDifficulty: 'Hard'
    }
  ]);

  const [job1, job2] = await Job.create([
    {
      jobTitle: 'Frontend Developer Intern',
      jobDescription: 'Work with React, build UI components, and collaborate with product/design teams.',
      eligibility: 'Candidates with strong JavaScript fundamentals.',
      salary: 30000,
      howToApply: 'Apply through the portal and upload your resume.',
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      company: companyA._id
    },
    {
      jobTitle: 'Backend Developer (Node.js)',
      jobDescription: 'Build APIs with Express and MongoDB, design data models, and write integrations.',
      eligibility: 'Experience with Node.js, REST, and MongoDB.',
      salary: 900000,
      howToApply: 'Apply through the portal.',
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
      company: companyB._id
    }
  ]);

  await User.updateOne(
    { _id: students[0]._id },
    {
      $push: {
        'studentProfile.appliedJobs': {
          jobId: job1._id,
          status: 'applied',
          appliedAt: new Date()
        }
      }
    }
  );

  await Job.updateOne(
    { _id: job1._id },
    {
      $push: {
        applicants: {
          studentId: students[0]._id,
          currentRound: 'Aptitude Test',
          roundStatus: 'pending',
          status: 'applied',
          appliedAt: new Date()
        }
      }
    }
  );

  await Notice.create([
    {
      sender: tpo._id,
      sender_role: 'tpo_admin',
      receiver_role: 'student',
      title: 'Welcome',
      message: `Seeded database is ready. Backend is expected at http://localhost:${port}.`
    },
    {
      sender: management._id,
      sender_role: 'management_admin',
      receiver_role: 'tpo_admin',
      title: 'Checklist',
      message: 'Verify job postings, student approvals, and dashboard data.'
    }
  ]);

  return {
    users: {
      superuser: { email: superuserEmail, password: superuserPassword },
      tpo: { email: tpoEmail, password: tpoPassword },
      management: { email: managementEmail, password: managementPassword },
      student: { email: 'student1@cpms.local', password: studentPassword }
    }
  };
};

const main = async () => {
  try {
    await connect();

    if (shouldReset) {
      await safeDeleteAll();
    }

    const result = await seed();

    console.log('Seed complete. Test credentials:');
    console.log(JSON.stringify(result, null, 2));

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    try {
      await mongoose.disconnect();
    } catch (_) {
      // ignore
    }
    process.exit(1);
  }
};

main();
