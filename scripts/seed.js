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
  await mongoose.connect('mongodb+srv://immortalmourya_db_user:OBZAmPQWRU5xqSNk@cluster0.el71lhh.mongodb.net/placements-management-system');
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
    },
    {
      first_name: 'Arjun',
      last_name: 'Kumar',
      email: 'student3@cpms.local',
      password: studentHash,
      role: 'student',
      number: 9000000003,
      isProfileCompleted: true,
      studentProfile: {
        isApproved: true,
        rollNumber: 103,
        USN: 'USN003',
        department: 'Computer',
        year: 3,
        addmissionYear: 2023
      }
    },
    {
      first_name: 'Ananya',
      last_name: 'Singh',
      email: 'student4@cpms.local',
      password: studentHash,
      role: 'student',
      number: 9000000004,
      isProfileCompleted: true,
      studentProfile: {
        isApproved: true,
        rollNumber: 104,
        USN: 'USN004',
        department: 'AIDS',
        year: 4,
        addmissionYear: 2022
      }
    },
    {
      first_name: 'Vivaan',
      last_name: 'Mehta',
      email: 'student5@cpms.local',
      password: studentHash,
      role: 'student',
      number: 9000000005,
      isProfileCompleted: true,
      studentProfile: {
        isApproved: true,
        rollNumber: 105,
        USN: 'USN005',
        department: 'Computer',
        year: 3,
        addmissionYear: 2023
      }
    },
    {
      first_name: 'Aisha',
      last_name: 'Khan',
      email: 'student6@cpms.local',
      password: studentHash,
      role: 'student',
      number: 9000000006,
      isProfileCompleted: true,
      studentProfile: {
        isApproved: true,
        rollNumber: 106,
        USN: 'USN006',
        department: 'Computer',
        year: 4,
        addmissionYear: 2022
      }
    },
    {
      first_name: 'Rohan',
      last_name: 'Reddy',
      email: 'student7@cpms.local',
      password: studentHash,
      role: 'student',
      number: 9000000007,
      isProfileCompleted: true,
      studentProfile: {
        isApproved: true,
        rollNumber: 107,
        USN: 'USN007',
        department: 'AIDS',
        year: 3,
        addmissionYear: 2023
      }
    },
    {
      first_name: 'Saanvi',
      last_name: 'Gupta',
      email: 'student8@cpms.local',
      password: studentHash,
      role: 'student',
      number: 9000000008,
      isProfileCompleted: true,
      studentProfile: {
        isApproved: false,
        rollNumber: 108,
        USN: 'USN008',
        department: 'Computer',
        year: 2,
        addmissionYear: 2024
      }
    },
    {
      first_name: 'Kabir',
      last_name: 'Joshi',
      email: 'student9@cpms.local',
      password: studentHash,
      role: 'student',
      number: 9000000009,
      isProfileCompleted: true,
      studentProfile: {
        isApproved: true,
        rollNumber: 109,
        USN: 'USN009',
        department: 'AIDS',
        year: 4,
        addmissionYear: 2022
      }
    },
    {
      first_name: 'Priya',
      last_name: 'Verma',
      email: 'student10@cpms.local',
      password: studentHash,
      role: 'student',
      number: 9000000010,
      isProfileCompleted: true,
      studentProfile: {
        isApproved: true,
        rollNumber: 110,
        USN: 'USN010',
        department: 'Computer',
        year: 3,
        addmissionYear: 2023
      }
    },
    {
      first_name: 'Aditya',
      last_name: 'Nair',
      email: 'student11@cpms.local',
      password: studentHash,
      role: 'student',
      number: 9000000011,
      isProfileCompleted: false,
      studentProfile: {
        isApproved: false,
        rollNumber: 111,
        USN: 'USN011',
        department: 'Computer',
        year: 2,
        addmissionYear: 2024
      }
    },
    {
      first_name: 'Ishita',
      last_name: 'Rao',
      email: 'student12@cpms.local',
      password: studentHash,
      role: 'student',
      number: 9000000012,
      isProfileCompleted: true,
      studentProfile: {
        isApproved: true,
        rollNumber: 112,
        USN: 'USN012',
        department: 'AIDS',
        year: 4,
        addmissionYear: 2022
      }
    }
  ]);

  const companies = await Company.create([
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
    },
    {
      companyName: 'TechVista Solutions',
      companyDescription: 'Global IT consulting firm specializing in enterprise solutions.',
      companyWebsite: 'https://example.com',
      companyLocation: 'Hyderabad',
      companyDifficulty: 'Moderate'
    },
    {
      companyName: 'DataWave Analytics',
      companyDescription: 'Data science company focused on AI and machine learning solutions.',
      companyWebsite: 'https://example.com',
      companyLocation: 'Pune',
      companyDifficulty: 'Hard'
    },
    {
      companyName: 'CloudNine Technologies',
      companyDescription: 'Cloud infrastructure provider with enterprise-grade solutions.',
      companyWebsite: 'https://example.com',
      companyLocation: 'Bengaluru',
      companyDifficulty: 'Moderate'
    },
    {
      companyName: 'QuantumLeap Innovations',
      companyDescription: 'Cutting-edge research company working on quantum computing applications.',
      companyWebsite: 'https://example.com',
      companyLocation: 'Delhi',
      companyDifficulty: 'Very Hard'
    },
    {
      companyName: 'GreenTech Industries',
      companyDescription: 'Sustainable technology company focused on environmental solutions.',
      companyWebsite: 'https://example.com',
      companyLocation: 'Chennai',
      companyDifficulty: 'Easy'
    },
    {
      companyName: 'FinSecure Banking',
      companyDescription: 'Leading fintech company providing secure banking solutions.',
      companyWebsite: 'https://example.com',
      companyLocation: 'Mumbai',
      companyDifficulty: 'Hard'
    },
    {
      companyName: 'MediCare Systems',
      companyDescription: 'Healthcare technology company building patient management systems.',
      companyWebsite: 'https://example.com',
      companyLocation: 'Bengaluru',
      companyDifficulty: 'Moderate'
    },
    {
      companyName: 'EduTech Platform',
      companyDescription: 'E-learning platform revolutionizing online education.',
      companyWebsite: 'https://example.com',
      companyLocation: 'Noida',
      companyDifficulty: 'Easy'
    },
    {
      companyName: 'CyberShield Security',
      companyDescription: 'Cybersecurity firm specializing in threat detection and prevention.',
      companyWebsite: 'https://example.com',
      companyLocation: 'Hyderabad',
      companyDifficulty: 'Hard'
    },
    {
      companyName: 'GameForge Studios',
      companyDescription: 'Game development company creating immersive gaming experiences.',
      companyWebsite: 'https://example.com',
      companyLocation: 'Pune',
      companyDifficulty: 'Moderate'
    }
  ]);

  const jobs = await Job.create([
    {
      jobTitle: 'Frontend Developer Intern',
      jobDescription: 'Work with React, build UI components, and collaborate with product/design teams.',
      eligibility: 'Candidates with strong JavaScript fundamentals.',
      salary: 30000,
      howToApply: 'Apply through the portal and upload your resume.',
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      company: companies[0]._id
    },
    {
      jobTitle: 'Backend Developer (Node.js)',
      jobDescription: 'Build APIs with Express and MongoDB, design data models, and write integrations.',
      eligibility: 'Experience with Node.js, REST, and MongoDB.',
      salary: 900000,
      howToApply: 'Apply through the portal.',
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
      company: companies[1]._id
    },
    {
      jobTitle: 'Full Stack Developer',
      jobDescription: 'Develop end-to-end web applications using MERN stack.',
      eligibility: 'Strong understanding of JavaScript, React, Node.js, and databases.',
      salary: 1200000,
      howToApply: 'Submit resume and portfolio through the portal.',
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      company: companies[2]._id
    },
    {
      jobTitle: 'Data Scientist',
      jobDescription: 'Analyze large datasets, build predictive models, and derive insights.',
      eligibility: 'Strong background in statistics, Python, and machine learning.',
      salary: 1500000,
      howToApply: 'Apply with resume and cover letter.',
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25),
      company: companies[3]._id
    },
    {
      jobTitle: 'Cloud Engineer',
      jobDescription: 'Design and maintain cloud infrastructure on AWS/Azure.',
      eligibility: 'Experience with cloud platforms and DevOps practices.',
      salary: 1100000,
      howToApply: 'Apply through the portal with relevant certifications.',
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
      company: companies[4]._id
    },
    {
      jobTitle: 'Machine Learning Engineer',
      jobDescription: 'Develop and deploy ML models for production systems.',
      eligibility: 'Strong Python skills and experience with TensorFlow/PyTorch.',
      salary: 1800000,
      howToApply: 'Submit resume with GitHub profile.',
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28),
      company: companies[5]._id
    },
    {
      jobTitle: 'IoT Developer',
      jobDescription: 'Work on IoT devices and sustainable technology solutions.',
      eligibility: 'Knowledge of embedded systems and sensor integration.',
      salary: 700000,
      howToApply: 'Apply through the portal.',
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18),
      company: companies[6]._id
    },
    {
      jobTitle: 'Blockchain Developer',
      jobDescription: 'Build secure blockchain solutions for banking applications.',
      eligibility: 'Experience with Solidity, Ethereum, and smart contracts.',
      salary: 1600000,
      howToApply: 'Submit resume and blockchain project portfolio.',
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 22),
      company: companies[7]._id
    },
    {
      jobTitle: 'Software Engineer - Healthcare',
      jobDescription: 'Develop patient management systems and healthcare applications.',
      eligibility: 'Experience in web development with healthcare domain knowledge.',
      salary: 950000,
      howToApply: 'Apply through the portal.',
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 19),
      company: companies[8]._id
    },
    {
      jobTitle: 'Mobile App Developer',
      jobDescription: 'Create mobile applications for iOS and Android platforms.',
      eligibility: 'Experience with React Native or Flutter.',
      salary: 800000,
      howToApply: 'Submit resume with app store links.',
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 24),
      company: companies[9]._id
    },
    {
      jobTitle: 'Cybersecurity Analyst',
      jobDescription: 'Monitor systems for security threats and implement protective measures.',
      eligibility: 'Strong understanding of network security and ethical hacking.',
      salary: 1300000,
      howToApply: 'Apply with relevant certifications (CEH, CISSP).',
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 26),
      company: companies[10]._id
    },
    {
      jobTitle: 'Game Developer',
      jobDescription: 'Design and develop engaging video games using Unity or Unreal Engine.',
      eligibility: 'Experience with game engines and C++ or C# programming.',
      salary: 1000000,
      howToApply: 'Submit resume with game portfolio.',
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 23),
      company: companies[11]._id
    }
  ]);

  await User.updateOne(
    { _id: students[0]._id },
    {
      $push: {
        'studentProfile.appliedJobs': {
          jobId: jobs[0]._id,
          status: 'applied',
          appliedAt: new Date()
        }
      }
    }
  );

  await Job.updateOne(
    { _id: jobs[0]._id },
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

  await User.updateOne(
    { _id: students[1]._id },
    {
      $push: {
        'studentProfile.appliedJobs': [
          {
            jobId: jobs[1]._id,
            status: 'applied',
            appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
          },
          {
            jobId: jobs[2]._id,
            status: 'shortlisted',
            appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
          }
        ]
      }
    }
  );

  await Job.updateOne(
    { _id: jobs[1]._id },
    {
      $push: {
        applicants: {
          studentId: students[1]._id,
          currentRound: 'Technical Interview',
          roundStatus: 'cleared',
          status: 'applied',
          appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
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
    },
    {
      sender: tpo._id,
      sender_role: 'tpo_admin',
      receiver_role: 'student',
      title: 'Campus Drive - NovaTech',
      message: 'NovaTech will be conducting a campus drive on January 15th. Eligible students are requested to register.'
    },
    {
      sender: tpo._id,
      sender_role: 'tpo_admin',
      receiver_role: 'student',
      title: 'Resume Building Workshop',
      message: 'A resume building workshop will be conducted on January 10th at 2 PM in the seminar hall.'
    },
    {
      sender: management._id,
      sender_role: 'management_admin',
      receiver_role: 'student',
      title: 'Placement Guidelines',
      message: 'All students are required to follow the placement dress code and maintain professional conduct during interviews.'
    },
    {
      sender: tpo._id,
      sender_role: 'tpo_admin',
      receiver_role: 'student',
      title: 'Mock Interview Sessions',
      message: 'Mock interview sessions will be held from January 8th to 12th. Please book your slots in advance.'
    },
    {
      sender: management._id,
      sender_role: 'management_admin',
      receiver_role: 'tpo_admin',
      title: 'Quarterly Report Due',
      message: 'Please submit the quarterly placement report by the end of this month.'
    },
    {
      sender: tpo._id,
      sender_role: 'tpo_admin',
      receiver_role: 'student',
      title: 'Application Deadline Reminder',
      message: 'The application deadline for Skyline Systems is approaching. Apply before January 16th.'
    },
    {
      sender: tpo._id,
      sender_role: 'tpo_admin',
      receiver_role: 'student',
      title: 'Technical Aptitude Test',
      message: 'All registered students for DataWave Analytics must attend the aptitude test on January 20th.'
    },
    {
      sender: management._id,
      sender_role: 'management_admin',
      receiver_role: 'student',
      title: 'Document Verification',
      message: 'Students selected for final rounds must complete document verification by January 25th.'
    },
    {
      sender: tpo._id,
      sender_role: 'tpo_admin',
      receiver_role: 'student',
      title: 'Placement Season 2025',
      message: 'The placement season for 2025 has officially begun. Stay updated with all announcements and prepare well.'
    },
    {
      sender: tpo._id,
      sender_role: 'tpo_admin',
      receiver_role: 'student',
      title: 'Communication Skills Training',
      message: 'A communication skills training program will be conducted every weekend for the next month.'
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