export const metadata = {
  title: "Al Alkeem Group — Lead Management",
  description: "WhatsApp Lead-Gen Bot backend for Al Alkeem Group real estate.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
