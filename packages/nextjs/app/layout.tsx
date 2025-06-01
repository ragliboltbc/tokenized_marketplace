import ThreeBackground from "../components/ThreeBackground";
import "@rainbow-me/rainbowkit/styles.css";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import Navigation from "./navigation";

export const metadata = getMetadata({ title: "Scaffold-ETH 2 App", description: "Built with 🏗 Scaffold-ETH 2" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ScaffoldEthAppWithProviders>
          <ThemeProvider enableSystem>
            <Navigation />
            <main className="relative flex flex-col flex-1">{children}</main>
          </ThemeProvider>
        </ScaffoldEthAppWithProviders>
      </body>
    </html>
  );
}
