// Same ideas, different brand names. Every name links to the provider's own page.
const ROWS = [
  ['Virtual machines (IaaS)', ['EC2', 'https://aws.amazon.com/ec2/'], ['Virtual Machines', 'https://azure.microsoft.com/en-us/products/virtual-machines/'], ['Compute Engine', 'https://cloud.google.com/products/compute']],
  ['File / object storage', ['S3', 'https://aws.amazon.com/s3/'], ['Blob Storage', 'https://azure.microsoft.com/en-us/products/storage/blobs/'], ['Cloud Storage', 'https://cloud.google.com/storage']],
  ['Run my web app (PaaS)', ['Elastic Beanstalk', 'https://aws.amazon.com/elasticbeanstalk/'], ['App Service', 'https://azure.microsoft.com/en-us/products/app-service/'], ['App Engine', 'https://cloud.google.com/appengine']],
  ['Serverless functions', ['Lambda', 'https://aws.amazon.com/lambda/'], ['Azure Functions', 'https://azure.microsoft.com/en-us/products/functions/'], ['Cloud Run functions', 'https://cloud.google.com/functions']],
  ['Managed SQL database', ['RDS', 'https://aws.amazon.com/rds/'], ['Azure SQL Database', 'https://azure.microsoft.com/en-us/products/azure-sql/database/'], ['Cloud SQL', 'https://cloud.google.com/sql']],
  ['Containers (Kubernetes)', ['EKS', 'https://aws.amazon.com/eks/'], ['AKS', 'https://azure.microsoft.com/en-us/products/kubernetes-service/'], ['GKE', 'https://cloud.google.com/kubernetes-engine']],
  ['Sign in / console', ['AWS Console', 'https://console.aws.amazon.com/'], ['Azure Portal', 'https://portal.azure.com/'], ['Google Cloud Console', 'https://console.cloud.google.com/']],
  ['Free for students', ['AWS Free Tier', 'https://aws.amazon.com/free/'], ['Azure for Students', 'https://azure.microsoft.com/en-us/free/students/'], ['Google Cloud Free', 'https://cloud.google.com/free']]
];
const L = ([name, url]) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="ext">
    {name}
  </a>
);

export default function ProviderTable() {
  return (
    <div className="scroll-x">
      <table className="table-sim" style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, minWidth: 620 }}>
        <thead>
          <tr>
            <th>What you need</th>
            <th style={{ color: '#ff9900' }}>AWS</th>
            <th style={{ color: '#4da3ff' }}>Microsoft Azure</th>
            <th style={{ color: '#46ecd5' }}>Google Cloud</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([need, a, z, g]) => (
            <tr key={need}>
              <td style={{ color: 'var(--text)' }}>{need}</td>
              <td>{L(a)}</td>
              <td>{L(z)}</td>
              <td>{L(g)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
