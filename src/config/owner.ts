import { client } from "./client";
export const site = {
	name: client.businessName,
	services: client.services.map((service) => ({
		title: service.title,
		slug: service.title,
	})),
};
