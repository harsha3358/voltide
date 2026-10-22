import { EVENTS, EXAMPLES, LAYERS } from './stackModel.js';

// IaaS / PaaS / SaaS explained four ways. Every style has the same shape:
// layers (bottom → top), the four models (how many bottom layers the
// provider runs), real brands, and everyday "something happens" events.
// The visual style (colours, pattern, emoji) changes with each one.
export const MODEL_KEYS = ['onprem', 'iaas', 'paas', 'saas'];
export const MODEL_TAGS = { onprem: 'On-premises', iaas: 'IaaS', paas: 'PaaS', saas: 'SaaS' };

const byModel = m => EXAMPLES.filter(e => e.model === m).map(e => ({ name: e.name, url: e.url }));

export const ANALOGIES = {
  tech: {
    name: 'Real tech',
    icon: '🖥️',
    colors: { cloud: '#53eafd', you: '#ffdf20' },
    provider: 'Cloud provider',
    layers: LAYERS,
    models: {
      onprem: { managed: 0, title: 'Your own server room', line: 'You buy the hardware, install every layer, and fix it at 2 AM.', brands: byModel('onprem') },
      iaas: { managed: 4, title: 'Rent a virtual machine', line: 'The provider runs the data centre up to virtualisation. From the operating system up, it’s all yours.', brands: byModel('iaas') },
      paas: { managed: 7, title: 'Upload your code', line: 'The provider runs everything up to the runtime. You bring the app and look after your data.', brands: byModel('paas') },
      saas: { managed: 9, title: 'Just use the app', line: 'Every layer is the provider’s. You log in and use it.', brands: byModel('saas') }
    },
    events: EVENTS
  },
  pizza: {
    name: 'Pizza',
    icon: '🍕',
    colors: { cloud: '#ff6b4a', you: '#ffd166' },
    provider: 'Pizza place',
    layers: ['🏠 Kitchen, gas & power', '🔥 Oven', '🫓 Dough & sauce', '👨‍🍳 Baking it', '🧀 Toppings', '🍽️ Table & serving'],
    models: {
      onprem: { managed: 0, title: 'Make it at home', line: 'You buy the oven, the gas, the flour. Total control, total effort, total mess.', brands: [{ name: 'Your own kitchen' }] },
      iaas: { managed: 2, title: 'Rent a cloud kitchen', line: 'Someone else owns the kitchen and the oven. You still make the dough, bake, top and serve.', brands: [{ name: 'Rented commercial kitchen' }] },
      paas: { managed: 4, title: 'Pizza bar: pick toppings', line: 'They make the base and bake it. You just choose the toppings and take it home.', brands: [{ name: 'Build-your-own pizza counter' }] },
      saas: { managed: 6, title: 'Dine at Domino’s', line: 'Walk in, order, eat. Every layer is theirs. You just bring the hunger.', brands: [{ name: 'Domino’s', url: 'https://www.dominos.co.in/' }, { name: 'Pizza Hut', url: 'https://www.pizzahut.co.in/' }] }
    },
    events: [
      { id: 'gas', name: '⛽ Gas cylinder runs out', layer: 0, you: 'Book a refill and wait two days.' },
      { id: 'oven', name: '🔥 Oven breaks down', layer: 1, you: 'Repair it, or buy a new one.' },
      { id: 'dough', name: '🫓 Dough didn’t rise', layer: 2, you: 'Make a fresh batch. Start again.' },
      { id: 'burnt', name: '🖤 Pizza got burnt', layer: 3, you: 'Bake another one, and watch the timer this time.' },
      { id: 'cheese', name: '🧀 Out of cheese', layer: 4, you: 'Run to the shop for more cheese.' },
      { id: 'guests', name: '🎉 Six friends turn up', layer: 5, you: 'Find plates, chairs and space for everyone.' }
    ]
  },
  ride: {
    name: 'Getting around',
    icon: '🚗',
    colors: { cloud: '#00bcff', you: '#ff8904' },
    provider: 'Ride company',
    layers: ['🅿️ Parking & garage', '🚗 The vehicle', '🔧 Servicing & insurance', '⛽ Fuel', '🧑‍✈️ Driving', '📍 Where you go'],
    models: {
      onprem: { managed: 0, title: 'Own a car', line: 'You buy it, park it, fuel it, service it, insure it and drive it. Yes, even in traffic.', brands: [{ name: 'Your own car' }] },
      iaas: { managed: 3, title: 'Rent a self-drive car', line: 'They own, park and service the car. You fuel it, drive it and decide where to go.', brands: [{ name: 'Zoomcar', url: 'https://www.zoomcar.com/' }, { name: 'Revv', url: 'https://www.revv.co.in/' }] },
      paas: { managed: 5, title: 'Book a cab', line: 'Car, fuel and driver are theirs. You only pick the destination.', brands: [{ name: 'Uber', url: 'https://www.uber.com/in/en/' }, { name: 'Ola', url: 'https://www.olacabs.com/' }, { name: 'Rapido', url: 'https://www.rapido.bike/' }] },
      saas: { managed: 6, title: 'Ride the metro', line: 'Fixed routes, fixed stops. Tap your card and ride. Everything else is theirs.', brands: [{ name: 'Delhi Metro', url: 'https://www.delhimetrorail.com/' }, { name: 'Namma Metro', url: 'https://english.bmrc.co.in/' }] }
    },
    events: [
      { id: 'parking', name: '🅿️ No parking at college', layer: 0, you: 'Circle the block. Again. And again.' },
      { id: 'tyre', name: '🛞 Flat tyre on the highway', layer: 2, you: 'Change it yourself or call a mechanic.' },
      { id: 'fuel', name: '⛽ Fuel tank empty', layer: 3, you: 'Find a petrol pump and pay up.' },
      { id: 'traffic', name: '🚦 Massive traffic jam', layer: 4, you: 'You’re the driver. Sit in it, or find a way around.' },
      { id: 'plans', name: '🎯 Plans change: go to the mall', layer: 5, you: 'Change the destination. Easy, it’s your call.' }
    ]
  },
  home: {
    name: 'A place to live',
    icon: '🏠',
    colors: { cloud: '#00d492', you: '#ff637e' },
    provider: 'Landlord / hotel',
    layers: ['🏗️ Land & building', '💡 Electricity & water', '🛋️ Furniture', '🍛 Meals & cleaning', '🎒 Your stuff & your life'],
    models: {
      onprem: { managed: 0, title: 'Build your own house', line: 'You own the land, pay every bill and fix every leak. It’s yours, all of it.', brands: [{ name: 'Your own house' }] },
      iaas: { managed: 2, title: 'Rent an empty flat', line: 'The landlord gives you the building with power and water. You furnish it, cook and clean.', brands: [{ name: 'NoBroker', url: 'https://www.nobroker.in/' }, { name: '99acres', url: 'https://www.99acres.com/' }] },
      paas: { managed: 4, title: 'Stay in a PG', line: 'Furnished room, meals cooked, rooms cleaned. You just bring your stuff and live.', brands: [{ name: 'Stanza Living', url: 'https://www.stanzaliving.com/' }, { name: 'Zolo', url: 'https://zolostays.com/' }] },
      saas: { managed: 5, title: 'Book a hotel', line: 'Everything is taken care of, even fresh towels. You just show up.', brands: [{ name: 'OYO', url: 'https://www.oyorooms.com/' }, { name: 'Taj Hotels', url: 'https://www.tajhotels.com/' }] }
    },
    events: [
      { id: 'roof', name: '🌧️ Roof leaks in the monsoon', layer: 0, you: 'Hire someone to fix the roof. Bring buckets.' },
      { id: 'power', name: '⚡ Power cut at night', layer: 1, you: 'Call the electricity board, buy an inverter.' },
      { id: 'bed', name: '🛏️ Bed breaks', layer: 2, you: 'Buy a new bed and carry it up four floors.' },
      { id: 'dinner', name: '🍛 It’s dinner time', layer: 3, you: 'Cook. Or order Swiggy, again.' },
      { id: 'laptop', name: '💻 Your laptop charger is missing', layer: 4, you: 'That one’s always on you. Even in a hotel.' }
    ]
  }
};

// Quick-fire round: everyday things, mixed across the styles.
export const QUIZ = [
  ['Booking an Uber to college', 'paas', 'The car and driver are theirs; you only choose where to go. That’s PaaS.'],
  ['Renting a Zoomcar for a road trip', 'iaas', 'They give you the car (the infrastructure). You drive, fuel and plan. IaaS.'],
  ['Eating at Domino’s', 'saas', 'Every layer is theirs; you just eat. SaaS.'],
  ['Moving into a PG with meals', 'paas', 'Room, furniture, meals handled; you bring your life. PaaS.'],
  ['Using Gmail', 'saas', 'Google runs everything. You just log in. SaaS.'],
  ['Launching an Ubuntu VM on AWS EC2', 'iaas', 'AWS gives the virtual machine; the OS and up are yours. IaaS.'],
  ['Running servers in the college basement', 'onprem', 'Every layer, every bill, every 2 AM fix: on-premises.']
];

export function layersFor(style, model) {
  const a = ANALOGIES[style];
  const m = a.models[model].managed;
  return a.layers.map((label, i) => ({ label, owner: i < m ? 'cloud' : 'you', color: i < m ? a.colors.cloud : a.colors.you }));
}

export function ownerOf(style, model, event) {
  if (event.owner) return event.owner[model];
  return event.layer < ANALOGIES[style].models[model].managed ? 'cloud' : 'you';
}
