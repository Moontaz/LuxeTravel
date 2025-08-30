const prisma = require("./db.js");

async function test() {
  const buses = await prisma.buses.findMany({
    include: {
      route: { include: { departure_city: true, arrival_city: true } },
    },
  });
  console.log(buses);
}

test().catch(console.error);
