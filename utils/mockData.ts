export function generateMockBabyReading(hoursAgo: number = 0) {
  const fetalHeartRate = Math.floor(Math.random() * (160 - 110 + 1)) + 110;

  const movementCount = Math.floor(Math.random() * 11);

  const contractionLevel = Math.floor(Math.random() * 101);

  const cervicalDilation = Math.floor(Math.random() * 11);

  const recordedAt = new Date();
  recordedAt.setHours(recordedAt.getHours() - hoursAgo);

  return {
    fetalHeartRate,
    movementCount,
    contractionLevel,
    cervicalDilation,
    recordedAt,
  };
}

export function generateMockBabyReadingsHistory(count: number = 7) {
  const readings = [];
  for (let i = count - 1; i >= 0; i--) {
    readings.push(generateMockBabyReading(i));
  }
  return readings;
}
