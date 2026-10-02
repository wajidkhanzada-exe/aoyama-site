import './globals.css';

export const metadata = {
  title: 'Aoyama Elevator | Al Hamid Engineering Services, Karachi',
  description: 'Aoyama Elevator Global Ltd. sole distributor in Pakistan: Al Hamid Engineering Services, Gulistan-e-Jauhar, Karachi. Passenger, villa, cargo and hospital lifts, plus escalators.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;800&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
