import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Central coordinates (Mumbai)
const CENTER_LAT = 19.0760;
const CENTER_LNG = 72.8777;

// Realistic disaster/emergency scenarios
const scenarios = [
  {
    category: 'MEDICAL',
    summary: 'Medical Emergency - Chest Pain',
    description: 'Elderly person experiencing severe chest pain and difficulty breathing. Immediate medical attention required.',
    urgency: 5,
  },
  {
    category: 'FLOOD',
    summary: 'Flood - Water Rising',
    description: 'Heavy rainfall has caused severe flooding. Water level rising rapidly in residential area. Multiple families trapped on upper floors.',
    urgency: 4,
  },
  {
    category: 'FOOD',
    summary: 'Food Assistance Needed',
    description: 'Family of 6 without food for 2 days due to flood situation. Unable to access local markets. Require immediate food supplies.',
    urgency: 3,
  },
  {
    category: 'RESCUE',
    summary: 'Rescue - Building Collapse',
    description: 'Partial building collapse reported. 3-4 people possibly trapped under debris. Urgent rescue operation needed.',
    urgency: 5,
  },
  {
    category: 'MEDICAL',
    summary: 'Medical Emergency - Accident',
    description: 'Road accident with multiple injuries. Victims need immediate medical assistance and ambulance service.',
    urgency: 4,
  },
];

// Helper function to generate random offset
function randomOffset(max: number = 0.05): number {
  return (Math.random() - 0.5) * 2 * max;
}

// Helper function to get random scenario
function getRandomScenario() {
  return scenarios[Math.floor(Math.random() * scenarios.length)];
}

async function main() {
  console.log('🌱 Starting seed...');

  // Delete all existing records
  const deleted = await prisma.helpRequest.deleteMany();
  console.log(`🗑️  Deleted ${deleted.count} existing records`);

  // Create 20 random incidents
  const incidents = [];
  
  for (let i = 0; i < 20; i++) {
    const scenario = getRandomScenario();
    
    const incident = {
      description: scenario.description,
      lat: CENTER_LAT + randomOffset(),
      lng: CENTER_LNG + randomOffset(),
      category: scenario.category,
      urgency: scenario.urgency,
      summary: scenario.summary,
      status: 'OPEN',
    };
    
    incidents.push(incident);
  }

  // Insert all incidents
  const result = await prisma.helpRequest.createMany({
    data: incidents,
  });

  console.log(`✅ Created ${result.count} help requests`);
  
  // Display sample of created data
  const samples = await prisma.helpRequest.findMany({
    take: 5,
    orderBy: { id: 'asc' },
  });
  
  console.log('\n📊 Sample of created records:');
  samples.forEach((sample) => {
    console.log(`  - [${sample.category}] ${sample.summary} (Urgency: ${sample.urgency})`);
  });
  
  console.log('\n🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

