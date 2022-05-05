import { Schema, model } from 'mongoose';

interface Potato {
	userid: string,
	potatoes: number
}

const PotatoSchema = new Schema<Potato>({
	userid: String,
	potatoes: Number
});

export let potatodb = model<Potato>('Potato', PotatoSchema);