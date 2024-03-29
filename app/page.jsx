import Link from "next/link";
import Image from "next/image";
import React from "react";
import data from "../data.json";
import { ProfileOrganizations } from "./components/orgs";
import { getUser } from "./data";

// import {RootLayout} from "./layout"

// import "../global.css";
// import { Inter } from "next/font/google";
// import LocalFont from "next/font/local";
// import data from "../data.json";
// import { Analytics } from '@vercel/analytics/react';


// /** @type {import('next').Metadata} */
// export const metadata = {
// 	title: {
// 		default: "Eric Sun",
// 		template: "Eric Sun",
// 	},
// 	description: "Eric Sun's Personal Website",
// 	robots: {
// 		index: true,
// 		follow: true,
// 		googleBot: {
// 			index: true,
// 			follow: true,
// 			"max-video-preview": -1,
// 			"max-image-preview": "large",
// 			"max-snippet": -1,
// 		},
// 	},
// 	icons: [
// 		{
// 			url: "/favicon.ico",
// 			rel: "icon",
// 			sizes: "any",
// 			type: "image/svg+xml",
// 		},
// 	]
// };
// const inter = Inter({
// 	subsets: ["latin"],
// 	variable: "--font-inter",
// });

// const calSans = LocalFont({
// 	src: "../public/fonts/CalSans-SemiBold.ttf",
// 	variable: "--font-calsans",
// });


const navigation = [
	{ name: "Projects", href: "/project_areas" },
	{ name: "Contact", href: "/contact" }
	// { name: "Blog", href: "/blog"}
];

const username =  process.env.GITHUB_USERNAME || data.githubUsername;
const promise = getUser(username);

export default function Home({
	searchParams: { customUsername },
}) {

	return (
		// <html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
		// 	<body
		// 		className={`bg-black ${
		// 			process.env.NODE_ENV === "development" ? "debug-screens" : ''
		// 		}`}>
		// 	<Analytics />
			<div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
				<nav className="my-10 animate-fade-in">
					<ul className="flex items-center justify-center gap-4">
						{navigation.map((item) => (
							<Link
								key={item.href}
								href={item.href + (customUsername ? `?customUsername=${customUsername}` : '')}
								className="mx-2 text-xl duration-500 text-zinc-700 hover:text-zinc-300"
							>
								{item.name}
							</Link>
						))}
						{/* <TryYourself customUsername={customUsername} /> */}
					</ul>
				</nav>
				<div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
				<UserIcon promise={promise} />

				<h1 className="flex items-center z-10 text-4xl hover:scale-110 text-transparent duration-1000 cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text bg-white p-5">
					{username} 
				</h1>

				<div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
				<div className="my-16 text-center animate-fade-in">
					<h2 className="text-lg text-zinc-700">
						<UserText promise={promise} />
						<ProfileOrganizations username={username} />
					</h2>
				</div>
			</div>
		// </body>
		// </html>
	);
}

const UserIcon = async ({ promise }) => {

	const user = await promise;

	return (
		<Image alt='👨‍💻' width={200} height={200} src={user.avatar_url || data.avatarUrl} className="float-right rounded-full mx-4" />
	);
};

const UserText = async ({ promise }) => {

	const user = await promise;

	return (
		<>
		<p>Hi, my name is Eric Sun.</p>
		</>
	);
};

