export const SERVICE_DETAILS: Record<string, string> = {
  towing: "🚛 Towing",
  battery: "🔋 Battery Jump",
  "flat-tire": "🔧 Flat Tire Change",
  fuel: "⛽ Fuel Delivery",
  lockout: "🔑 Lockout Service",
  repair: "🔩 Minor Repair",
};

export const SERVICE_KEYS = Object.keys(SERVICE_DETAILS);

export function getServiceDistributionCounts(services: string[]): Record<string, number> {
  const counts: Record<string, number> = {
    towing: 0,
    battery: 0,
    "flat-tire": 0,
    fuel: 0,
    lockout: 0,
    repair: 0,
  };
  services.forEach((service) => {
    if (counts[service] !== undefined) counts[service]++;
  });
  return counts;
}
