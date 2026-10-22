// The classic 9-layer computing stack and who manages each layer in each
// service model. Shared by the layered 3D demos in Episodes 01 and 03.
export const LAYERS = ['Networking', 'Storage', 'Servers', 'Virtualisation', 'Operating system', 'Middleware', 'Runtime', 'Data', 'Application'];

// How many layers, counted from the bottom, the provider runs.
export const MODELS = {
  onprem: { name: 'On-premises', managed: 0 },
  iaas: { name: 'IaaS', managed: 4 },
  paas: { name: 'PaaS', managed: 7 },
  saas: { name: 'SaaS', managed: 9 }
};

// Real products students will meet, grouped by model.
export const EXAMPLES = [
  { model: 'onprem', name: 'College server room', who: 'the college IT team', url: 'https://en.wikipedia.org/wiki/Server_room', what: 'The college buys the servers, installs everything, and someone fixes it at 2 AM when it breaks.', you: ['Buy and install servers', 'Install and patch the OS', 'Install Python / Java', 'Deploy and run the app', 'Back up the data', 'Fix the AC, the power, the disks…'] },
  { model: 'iaas', name: 'AWS EC2', who: 'AWS', url: 'https://aws.amazon.com/ec2/', what: 'You rent a virtual machine. AWS runs the data centre; everything from the operating system up is yours.', you: ['Choose Ubuntu', 'Patch it (sudo apt upgrade)', 'Install the runtime', 'Deploy and run the app', 'Back up your data', 'Add VMs when traffic grows'] },
  { model: 'iaas', name: 'Azure Virtual Machines', who: 'Microsoft', url: 'https://azure.microsoft.com/en-us/products/virtual-machines', what: 'Microsoft’s version of the same deal: a VM in their data centre, the OS and up is your job.', you: ['Choose Windows or Linux', 'Patch the OS', 'Install the runtime', 'Deploy the app', 'Back up your data'] },
  { model: 'iaas', name: 'Google Compute Engine', who: 'Google', url: 'https://cloud.google.com/products/compute', what: 'Google’s VMs. Same responsibilities as EC2: hardware is theirs, the OS and up is yours.', you: ['Choose an OS image', 'Patch it', 'Install the runtime', 'Deploy the app', 'Back up your data'] },
  { model: 'paas', name: 'Google App Engine', who: 'Google', url: 'https://cloud.google.com/appengine', what: 'You upload code. Google runs the servers, the OS, the runtime and the scaling.', you: ['Write the code', 'Pick the runtime in app.yaml', 'Run gcloud app deploy', 'Look after your data'] },
  { model: 'paas', name: 'Heroku', who: 'Heroku', url: 'https://www.heroku.com/', what: 'Push your code with git; Heroku builds and runs it. No servers to babysit.', you: ['Write the code', 'git push heroku main', 'Look after your data'] },
  { model: 'paas', name: 'Azure App Service', who: 'Microsoft', url: 'https://azure.microsoft.com/en-us/products/app-service', what: 'Microsoft runs the web servers and runtimes; you deploy your web app into them.', you: ['Write the code', 'Deploy from GitHub or VS Code', 'Look after your data'] },
  { model: 'paas', name: 'Vercel', who: 'Vercel', url: 'https://vercel.com/', what: 'This very walkthrough lives here: we push to GitHub, Vercel builds and serves the site worldwide.', you: ['Write the code', 'Push to GitHub', 'That’s it. Seriously.'] },
  { model: 'saas', name: 'Gmail', who: 'Google', url: 'https://mail.google.com/', what: 'You just use it. Google runs every layer, from cables to the app.', you: ['Log in', 'Use a strong password + 2FA', 'Don’t click the scam links'] },
  { model: 'saas', name: 'Google Docs', who: 'Google', url: 'https://docs.google.com/', what: 'Open a browser and type. No install, no server, no updates.', you: ['Log in', 'Share files with the right people'] },
  { model: 'saas', name: 'Zoom', who: 'Zoom', url: 'https://zoom.us/', what: 'Click a link and you’re in a call. Zoom runs everything behind it.', you: ['Join the meeting', 'Keep your account secure'] },
  { model: 'saas', name: 'Canva', who: 'Canva', url: 'https://www.canva.com/', what: 'Design in the browser. The app, the storage and the servers are all Canva’s.', you: ['Log in', 'Make the poster'] }
];

// Things that happen to real systems, and which layer they hit. `owner`
// overrides the layer rule where reality is more subtle (scaling).
export const EVENTS = [
  { id: 'disk', name: '💽 A hard disk dies', layer: 1, you: 'Replace it and restore from your backup. Hope you had one.' },
  { id: 'power', name: '⚡ Power cut in the data centre', layer: 2, you: 'Run the generator, then reboot every server by hand.' },
  { id: 'patch', name: '🛡️ Urgent OS security patch', layer: 4, you: 'Run sudo apt update && sudo apt upgrade on every server.' },
  { id: 'python', name: '🐍 New Python version', layer: 6, you: 'Install it, test your app on it, then switch over.' },
  { id: 'backup', name: '🗄️ Database needs a backup', layer: 7, you: 'Schedule and test backups yourself. Every provider still expects you to own your data.' },
  { id: 'bug', name: '🐛 Bug in the app', layer: 8, you: 'Fix your code and redeploy. No cloud can fix your bug.' },
  { id: 'traffic', name: '📈 Results-day traffic ×10', layer: 2, owner: { onprem: 'you', iaas: 'you', paas: 'cloud', saas: 'cloud' }, you: 'On-prem: buy more servers (weeks). IaaS: launch more VMs or set up auto-scaling yourself.' }
];

export function ownerFor(model, event) {
  if (event.owner) return event.owner[model];
  return event.layer < MODELS[model].managed ? 'cloud' : 'you';
}

export function stackLayers(model) {
  const m = MODELS[model].managed;
  return LAYERS.map((label, i) => ({ label, owner: i < m ? 'cloud' : 'you' }));
}
