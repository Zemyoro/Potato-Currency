import { client } from './client';
import mongoose from 'mongoose';
require('pretty-error').start();
require('dotenv').config();

const db = mongoose.connection;
void mongoose.connect(process.env.MONGO_URL as string
	|| 'mongodb://localhost:27017/test');

import * as events from './events';
for (const event of Object.values(events)) {
	client.on(event.name, (...args) => event.execute([...args], client));
}

import * as commands from './commands';
for (const command of Object.values(commands)) {
	client.commands.set(command.name, command);
}

db.on('error', console.error);
db.on('open', () => console.log(`Connected to ${db.name}`));

void client.login(process.env.TOKEN);