import { useIntersectionObserver, useQuery } from "@siberiacancode/reactuse";
import { useState } from "react";

const PORTION_OF_ITEMS = 4;

interface Pokemon {
  name: string;
}

function App() {
  const [offset, setOffset] = useState<number>(0);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  const { isLoading, isError, isSuccess, error } = useQuery(
    () =>
      fetch(
        `https://pokeapi.co/api/v2/pokemon/?limit=${PORTION_OF_ITEMS}&offset=${offset}`
      )
        .then((res) => res.json())
        .then((res) => res.results as Promise<Pokemon[]>),
    {
      keys: [offset],
      onSuccess: (fetchedPokemons) => {
        setPokemons((prevPokemons) => [...prevPokemons, ...fetchedPokemons]);
      },
    }
  );

  const { ref } = useIntersectionObserver<HTMLDivElement>({
    threshold: 1,
    onChange: (entry) => {
      if (entry.isIntersecting) setOffset((prev) => prev + PORTION_OF_ITEMS);
    },
  });

  if (isError)
    return (
      <div>
        {error?.name}: {error?.message}
      </div>
    );

  if (isLoading && !pokemons.length) return <div>Pending...</div>;

  if (isSuccess)
    return (
      <div>
        {pokemons.map((pokemon, index) => {
          return (
            <div key={index} className=" w-32 h-32">
              <h1>{pokemon.name}</h1>
              <img
                width={475}
                height={475}
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                  index + 1
                }.png`}
                alt={pokemon.name}
              />
            </div>
          );
        })}
        <div ref={ref}>Loading...</div>
      </div>
    );
}

export default App;
