'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Game } from './games';

export default function GameForm({ editing, onClose }: { editing?: Game | null, onClose?: () => void }) {
	const [dateTime, setDateTime] = useState<Date | null>(editing ? new Date(editing.datetime) : new Date());
	const [prizes, setPrizes] = useState<string[]>((editing && editing.prizes) || []);
	const [location, setLocation] = useState<string>(editing ? (editing.location || '') : 'Estádio Municipal Pedro Ferigatto');
	const [number, setNumber] = useState<number | undefined>(editing ? (editing.number || undefined) : undefined);	

	const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const data = {
			datetime: dateTime?.toISOString(),
			prizes,
			location,
			number
		};
		const supabase = createClient();

		if (editing) {
			await supabase.from('games').update(data).eq('id', editing.id);
		} else {
			await supabase.from('games').insert(data);
		}

		onClose?.();
	}

	return (
		<div tabIndex={0} className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
			<div className="bg-white rounded-lg p-6 min-w-[380px]">
				<form className="flex flex-col" onSubmit={formSubmit}>
					<div className='flex justify-between items-center'>
						<p className="text-2xl font-bold m-0">{
							editing
								? 'Editar jogo'
								: 'Novo jogo'
						}</p>
						<button
							onClick={onClose}
						>
							X
						</button>
					</div>
					
					<div>
						<label htmlFor="date">Data e hora</label>
						<DatePicker
							selected={dateTime}
							onChange={(date) => setDateTime(date)}
							showTimeSelect
							locale="pt-BR"
							timeFormat="HH:mm"
							dateFormat="dd/MM/yyyy HH:mm"
						/>
					</div>			

					<div>
						<label htmlFor="date">Número</label>
						<input
							type="number"
							id="number"
							value={number}
							onChange={(e) => setNumber(Number(e.target.value))}
						/>
					</div>

					<div>
						<label htmlFor="location">Local</label>
						<input
							type="text"
							id="location"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
						/>
					</div>

					<div className='mb-5'>
						<label htmlFor="prizes">Prêmios</label>
						<input
							type="text"
							id="prizes"
							value={prizes.join(', ')}
							onChange={(e) => setPrizes(e.target.value.split(',').map((p) => p.trim()))}
							placeholder='Digite os prêmios separados por vírgula'
						/>
					</div>

					<button
						type="submit"
						className="bg-blue-500 text-white px-4 py-2 rounded-lg"
					>
						Salvar
					</button>
				</form>
			</div>
		</div>
	)
}