import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState, } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,

} from "react-native";

interface PokemonType {
  type: {
    name: string;
  };
}


interface PokemonDetails {
  name: string;
  height: number;
  weight: number;
  abilities:{
    ability:{name:string};
  }[];
  sprites: {
    front_default: string;
    back_default: string;
  };
  types: PokemonType[];
}

const colorByType: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export default function Details() {

  const { name } = useLocalSearchParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading ,setLoading ] = useState(true);

  useEffect(() => {
    if (name) fetchPokemonByName(name);
  }, [name]);

  async function fetchPokemonByName(pokemonName: string) {
    
    try {

      setLoading(true);  
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      const data = await res.json();
      setPokemon(data);
    } catch (error) {
      console.log(error);
    } finally {
        setLoading(false);
    }
  }

  if (!pokemon) return null;

  const mainType = pokemon.types[0].type.name;

  return (
    <>
      <Stack.Screen
        options={{
          title: pokemon.name.toUpperCase(),
          headerStyle: {
            backgroundColor: colorByType[mainType],
          },
          headerTintColor: "#fff",
        }}
      />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colorByType[mainType] + "40" },
        ]}
      >
        <Text style={styles.name}>{pokemon.name}</Text>

        <View style={styles.typeRow}>
          {pokemon.types.map((t) => (
            <View
              key={t.type.name}
              style={[
                styles.typeBadge,
                { backgroundColor: colorByType[t.type.name] },
              ]}
            >
              <Text style={styles.typeText}>{t.type.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.images}>
          <Image
            source={{ uri: pokemon.sprites.front_default }}
            style={styles.image}
          />
          <Image
            source={{ uri: pokemon.sprites.back_default }}
            style={styles.image}
          />
        </View>

        <View style={styles.stats}>
          <Text style={styles.stat}>Height: {pokemon.height}</Text>
          <Text style={styles.stat}>Weight: {pokemon.weight}</Text>
        </View>
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Abilities</Text>
            {pokemon.abilities.map((a) => (
        <Text key={a.ability.name} style={styles.item}>
            • {a.ability.name}
        </Text>
        ))}
        </View>

        
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "capitalize",
  },
  typeRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeText: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  images: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  image: {
    width: 150,
    height: 150,
  },
  stats: {
    alignItems: "center",
    gap: 8,
    
  },
  stat: {
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
  marginTop: 16,
},
sectionTitle: {
  fontSize: 20,
  fontWeight: "bold",
},
item: {
  fontSize: 16,
  textTransform: "capitalize",
},

});
