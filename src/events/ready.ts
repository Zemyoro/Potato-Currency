import { Potato } from "../client";

export let ready = {
	name: 'ready',
	execute(arg: any[], client: Potato) {
		console.log(`${client.user?.tag} is ready!`);
	}
}