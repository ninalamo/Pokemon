import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import './App.css';

// Extended sample data with 20 Pokémon and generation info
const samplePokemonData = [
  { id: 1, name: 'Bulbasaur', type: ['Grass', 'Poison'], height: 7, weight: 69, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', base: null, next: 2, generation: 'Gen I' },
  { id: 2, name: 'Ivysaur', type: ['Grass', 'Poison'], height: 10, weight: 130, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png', base: 1, next: 3, generation: 'Gen I' },
  { id: 3, name: 'Venusaur', type: ['Grass', 'Poison'], height: 20, weight: 1000, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png', base: 2, next: null, generation: 'Gen I' },
  { id: 4, name: 'Charmander', type: ['Fire'], height: 6, weight: 85, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', base: null, next: 5, generation: 'Gen I' },
  { id: 5, name: 'Charmeleon', type: ['Fire'], height: 11, weight: 190, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png', base: 4, next: 6, generation: 'Gen I' },
  { id: 6, name: 'Charizard', type: ['Fire', 'Flying'], height: 17, weight: 905, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png', base: 5, next: null, generation: 'Gen I' },
  { id: 7, name: 'Squirtle', type: ['Water'], height: 5, weight: 90, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png', base: null, next: 8, generation: 'Gen I' },
  { id: 8, name: 'Wartortle', type: ['Water'], height: 10, weight: 225, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png', base: 7, next: 9, generation: 'Gen I' },
  { id: 9, name: 'Blastoise', type: ['Water'], height: 16, weight: 855, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png', base: 8, next: null, generation: 'Gen I' },
  { id: 10, name: 'Caterpie', type: ['Bug'], height: 3, weight: 29, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png', base: null, next: 11, generation: 'Gen I' },
  { id: 11, name: 'Metapod', type: ['Bug'], height: 7, weight: 99, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/11.png', base: 10, next: 12, generation: 'Gen II' },
  { id: 12, name: 'Butterfree', type: ['Bug', 'Flying'], height: 11, weight: 320, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/12.png', base: 11, next: null, generation: 'Gen II' },
  { id: 13, name: 'Weedle', type: ['Bug', 'Poison'], height: 3, weight: 32, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png', base: null, next: 14, generation: 'Gen II' },
  { id: 14, name: 'Kakuna', type: ['Bug', 'Poison'], height: 6, weight: 100, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/14.png', base: 13, next: 15, generation: 'Gen II' },
  { id: 15, name: 'Beedrill', type: ['Bug', 'Poison'], height: 10, weight: 295, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/15.png', base: 14, next: null, generation: 'Gen II' },
  { id: 16, name: 'Pidgey', type: ['Normal', 'Flying'], height: 3, weight: 18, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png', base: null, next: 17, generation: 'Gen II' },
  { id: 17, name: 'Pidgeotto', type: ['Normal', 'Flying'], height: 11, weight: 300, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/17.png', base: 16, next: 18, generation: 'Gen II' },
  { id: 18, name: 'Pidgeot', type: ['Normal', 'Flying'], height: 15, weight: 395, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/18.png', base: 17, next: null, generation: 'Gen II' },
  { id: 19, name: 'Rattata', type: ['Normal'], height: 3, weight: 35, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png', base: null, next: 20, generation: 'Gen II' },
  { id: 20, name: 'Raticate', type: ['Normal'], height: 7, weight: 185, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/20.png', base: 19, next: null, generation: 'Gen II' }
];

// Get unique types and generations for dropdown filters.
const allTypes = ['All', ...new Set(samplePokemonData.flatMap(pokemon => pokemon.type))];
const allGenerations = ['All', ...new Set(samplePokemonData.map(pokemon => pokemon.generation))];

// Helper to return an icon for the generation.
const getGenerationIcon = (generation) => {
  if (generation === 'Gen I') return '🔵';
  if (generation === 'Gen II') return '🟢';
  return '❓';
};

function Pokedex() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedGeneration, setSelectedGeneration] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const maxItems = 20;
  
  // Filter Pokémon based on search term, type, and generation.
  const filteredPokemon = samplePokemonData.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedType === 'All' || pokemon.type.includes(selectedType)) &&
    (selectedGeneration === 'All' || pokemon.generation === selectedGeneration)
  );

  // Limit the total items to maxItems (20) then paginate.
  const limitedResults = filteredPokemon.slice(0, maxItems);
  const totalPages = Math.ceil(limitedResults.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentResults = limitedResults.slice(startIdx, startIdx + itemsPerPage);

  // Handle pagination controls
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Reset page if filters change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
  };
  const handleGenerationChange = (e) => {
    setSelectedGeneration(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="pokedex-container">
      <h1 className="title">Pokédex</h1>
      <div className="filter-controls">
        <div className="control-group">
          <label htmlFor="search-input">Search Pokémon:</label>
          <input
            id="search-input"
            type="text"
            placeholder="Search Pokémon"
            className="search-bar"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="control-group">
          <label htmlFor="type-dropdown">Filter by Type:</label>
          <select
            id="type-dropdown"
            value={selectedType}
            className="type-dropdown"
            onChange={handleTypeChange}
          >
            {allTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label htmlFor="generation-dropdown">Filter by Generation:</label>
          <select
            id="generation-dropdown"
            value={selectedGeneration}
            className="generation-dropdown"
            onChange={handleGenerationChange}
          >
            {allGenerations.map(gen => (
              <option key={gen} value={gen}>
                {gen}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="legend">
        <span className="legend-item">🔵: Gen I</span>
        <span className="legend-item">🟢: Gen II</span>
      </div>
      <div className="pokemon-grid">
        {currentResults.length > 0 ? (
          currentResults.map(pokemon => (
            <Link key={pokemon.id} to={`/pokemon/${pokemon.id}`} className="pokemon-item">
              <div className="generation-badge">{getGenerationIcon(pokemon.generation)}</div>
              <img src={pokemon.sprite} alt={pokemon.name} className="pokemon-thumb" />
              <h3>{pokemon.name}</h3>
            </Link>
          ))
        ) : (
          <p>No Pokémon found.</p>
        )}
      </div>
      {limitedResults.length > itemsPerPage && (
        <div className="pagination-controls">
          <button onClick={goToPrevPage} disabled={currentPage === 1}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
}

function PokemonDetail() {
  const { id } = useParams();
  const pokemon = samplePokemonData.find(p => p.id === parseInt(id));
  if (!pokemon) return <p>Pokémon not found.</p>;

  const basePokemon = samplePokemonData.find(p => p.id === pokemon.base);
  const nextPokemon = samplePokemonData.find(p => p.id === pokemon.next);

  return (
    <div className="pokemon-detail-container">
      <Link to="/" className="back-button">Back to Pokédex</Link>
      <div className="pokemon-card">
        <h2 className="pokemon-name">{pokemon.name}</h2>
        <img src={pokemon.sprite} alt={pokemon.name} className="pokemon-image" />
        <div className="pokemon-info">
          <p><strong>Height:</strong> {pokemon.height}</p>
          <p><strong>Weight:</strong> {pokemon.weight}</p>
          <p><strong>Type:</strong> {pokemon.type.join(', ')}</p>
          <p><strong>Generation:</strong> {pokemon.generation} {getGenerationIcon(pokemon.generation)}</p>
        </div>
        <div className="evolution-links">
          {basePokemon && <Link to={`/pokemon/${basePokemon.id}`} className="evolution-link">Previous: {basePokemon.name}</Link>}
          {nextPokemon && <Link to={`/pokemon/${nextPokemon.id}`} className="evolution-link">Next: {nextPokemon.name}</Link>}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
