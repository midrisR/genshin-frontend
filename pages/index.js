import { useState, useCallback } from 'react';
import Character from '../components/card/character';
import Filter from '../components/filter/filter';
import filterData from '../api/filter';

export async function getServerSideProps() {
	const res = await fetch(process.env.URL);
	const data = await res.json();
	return {
		props: { data },
	};
}

export default function Home({ data }) {
	const [characters, setCharacters] = useState(data);
	const [vision, setVision] = useState('');
	const [rarity, setRarity] = useState('');
	const [openVision, setOpenVision] = useState(false);
	const [openRarity, setOpenRarity] = useState(false);

	const handleReset = () => {
		setCharacters(data);
		setOpenVision(false);
		setOpenRarity(false);
	};

	const handleSelect = useCallback((e) => {
		const name = e.target.innerText;
		setVision(name);
		handleFilter(name);
		setOpenVision((prevState) => !prevState);
	});

	const handleSelectRarity = useCallback((e) => {
		const name = e.target.innerText;
		setRarity(name);
		handleFilterRarity(name);
		setOpenRarity((prevState) => !prevState);
	});

	const handleFilterRarity = useCallback((value) => {
		const filter = data.filter((character) => {
			if (vision !== '') {
				return (
					character.filter_values.character_rarity === value &&
					character.filter_values.character_vision === vision
				);
			} else {
				return character.filter_values.character_rarity === value;
			}
		});
		setCharacters(filter);
	});

	const handleFilter = useCallback((value) => {
		const filter = data.filter((character) => {
			if (rarity !== '') {
				return (
					character.filter_values.character_rarity === rarity &&
					character.filter_values.character_vision === value
				);
			} else {
				return character.filter_values.character_vision === value;
			}
		});
		setCharacters(filter);
	});
	return (
		<div className="w-full lg:px-20 py-20 bg-slate-700 min-h-screen">
			<div className=" py-4 flex flex-wrap justify-center lg:justify-start">
				<Filter
					handleSelect={handleSelect}
					data={filterData.visions}
					show={openVision}
					handleShow={() => setOpenVision((prevState) => !prevState)}
					title={vision ? vision : 'Vision'}
				/>
				<Filter
					handleSelect={handleSelectRarity}
					data={filterData.quality}
					show={openRarity}
					handleShow={() => setOpenRarity((prevState) => !prevState)}
					title={rarity ? rarity : 'Quality'}
				/>
				<button
					className="px-8 py-1 text-orange-200 text-sm rounded-full border border-orange-200 focus:outline-none"
					onClick={handleReset}>
					Reset
				</button>
				<div className="w-full flex flex-wrap items-center">
					<Character characters={characters} />
				</div>
			</div>
		</div>
	);
}
