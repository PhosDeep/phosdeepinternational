import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {

  title:
    "Phosdeep International | Technology, Training & Innovation",

  description:
    "Phosdeep International is a technology company working across Cybersecurity, AI, Generative AI, Quantum Computing, Blockchain, Cloud and emerging technologies.",

  keywords: [
    "Phosdeep International",
    "Artificial Intelligence",
    "Generative AI",
    "Cybersecurity",
    "Quantum Computing",
    "Blockchain",
    "Cloud Computing",
    "Machine Learning",
    "Technology Training",
    "Technology Consulting",
  ],

  authors: [
    {
      name: "Phosdeep International",
    },
  ],

  creator:
    "Phosdeep International",

  publisher:
    "Phosdeep International",

  metadataBase:
    new URL(
      "https://phosdeepinternational.com"
    ),

  openGraph: {

    title:
      "Phosdeep International | Technology, Training & Innovation",

    description:
      "Building technology and developing the people capable of working with it.",

    siteName:
      "Phosdeep International",

    type: "website",

  },

  twitter: {

    card: "summary_large_image",

    title:
      "Phosdeep International | Technology, Training & Innovation",

    description:
      "Technology, training and innovation across Cybersecurity, AI, Quantum, Blockchain, Cloud and emerging technologies.",

  },

};


export default function RootLayout({
  children,
}: LayoutProps<"/">) {

  return (

    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 1. Suppress browser extension unhandled rejections
              window.addEventListener('unhandledrejection', function(event) {
                if (event.reason && (
                  (typeof event.reason.stack === 'string' && event.reason.stack.includes('chrome-extension://')) ||
                  (typeof event.reason.message === 'string' && event.reason.message.includes('M_ID'))
                )) {
                  event.preventDefault();
                }
              });

              // 2. Proactively neutralize Bitdefender Anti-tracker extension DOM attributes
              try {
                var cleanNode = function(el) {
                  if (!el || el.nodeType !== 1) return;
                  if (el.hasAttribute('bis_skin_checked')) el.removeAttribute('bis_skin_checked');
                  if (el.hasAttribute('bis_register')) el.removeAttribute('bis_register');
                  var attrs = el.attributes;
                  if (attrs) {
                    for (var i = attrs.length - 1; i >= 0; i--) {
                      var attrName = attrs[i].name;
                      if (attrName && (attrName.indexOf('bis_') === 0 || attrName.indexOf('__processed_') === 0)) {
                        el.removeAttribute(attrName);
                      }
                    }
                  }
                };

                var origSetAttr = Element.prototype.setAttribute;
                Element.prototype.setAttribute = function(name, val) {
                  if (name && (name.indexOf('bis_') === 0 || name.indexOf('__processed_') === 0)) {
                    return;
                  }
                  return origSetAttr.apply(this, arguments);
                };

                var observer = new MutationObserver(function(mutations) {
                  for (var m = 0; m < mutations.length; m++) {
                    var mut = mutations[m];
                    if (mut.type === 'attributes') {
                      cleanNode(mut.target);
                    } else if (mut.type === 'childList') {
                      for (var c = 0; c < mut.addedNodes.length; c++) {
                        var node = mut.addedNodes[c];
                        if (node.nodeType === 1) {
                          cleanNode(node);
                          var children = node.querySelectorAll ? node.querySelectorAll('*') : [];
                          for (var ch = 0; ch < children.length; ch++) {
                            cleanNode(children[ch]);
                          }
                        }
                      }
                    }
                  }
                });

                observer.observe(document.documentElement, {
                  attributes: true,
                  subtree: true,
                  childList: true,
                });
              } catch (e) {}

              // 3. Suppress Bitdefender Anti-tracker console error noise in dev overlay
              var origError = console.error;
              console.error = function() {
                for (var i = 0; i < arguments.length; i++) {
                  var arg = arguments[i];
                  if (typeof arg === 'string' && (
                    arg.indexOf('bis_skin_checked') !== -1 ||
                    arg.indexOf('bis_register') !== -1 ||
                    arg.indexOf('eppioce') !== -1
                  )) {
                    return;
                  }
                }
                origError.apply(console, arguments);
              };

              var origWarn = console.warn;
              console.warn = function() {
                for (var i = 0; i < arguments.length; i++) {
                  var arg = arguments[i];
                  if (typeof arg === 'string' && (
                    arg.indexOf('bis_skin_checked') !== -1 ||
                    arg.indexOf('bis_register') !== -1
                  )) {
                    return;
                  }
                }
                origWarn.apply(console, arguments);
              };
            `,
          }}
        />
      </head>

      <body className="min-h-full flex flex-col" suppressHydrationWarning>

        {children}

      </body>

    </html>

  );
}