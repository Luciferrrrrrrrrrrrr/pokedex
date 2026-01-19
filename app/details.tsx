import StatBar from "./components/StatBar";
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
  stats: {
    base_stat: number;
    stat: {
        name:string;
    };

  }[];
  moves: {
    move: {
        name : string;
    };
  }[];
  species: {
    url : string;
  };
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



function extractEvolutions(chain:any, result: string []=[]) {
    if (!chain || !chain.species) return result;


    // add current species
    result.push(chain.species.name);

    //Traverse all evolutions at this level

    if (chain.evolves_to && chain.evolves_to.length > 0) {
        chain.evolves_to.forEach((evo: any )=>{
            extractEvolutions(evo, result);
        });
        

    }
    return result;


}

function getEvolutionSpriteUrlByName(name: string, evolutions: string[]) {
  const index = evolutions.indexOf(name);
  const id = index + 1; // evolution chains are ordered
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}


export default function Details() {

  const { name } = useLocalSearchParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading ,setLoading ] = useState(true);
  const [activeTab, setActiveTab] = useState<"info"|"stats"|"moves">("info"); 
  const [evolutions, setEvolutions] = useState<string[]>([]);

  useEffect(() => {
    if (name) fetchPokemonByName(name);
  }, [name]);

  if(loading){
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.skeletonTitle}/>
            <View style={styles.skeletonTypeRow}/>
            <View style={styles.skeletonImage}/>
            <View style={styles.skeletonBlock}/>
        </ScrollView>
    );
  }

  async function fetchPokemonByName(pokemonName: string) {
    
    try {

        // fetch main Pokemon Data
      setLoading(true);  
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      const data = await res.json();
      setPokemon(data);
      
      // fetch species data
      const speciesRes = await fetch (data.species.url);
      const speciesData = await speciesRes.json();

      //fetch evolution chain
      const evoRes = await fetch (speciesData.evolution_chain.url);
      const evoData = await evoRes.json(); 

      // Extraction evolution name
      const evoNames = extractEvolutions(evoData.chain);
      setEvolutions(evoNames);

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
         <View style={styles.tabs}>
                      <Text style={[
                        styles.tab,
                        activeTab == "info" && styles.activeTab,
                      ]}
                      onPress={()=>setActiveTab("info") }
                      >
                        INFO
                      </Text>
                      <Text style={[
                        styles.tab,
                        activeTab == "stats" && styles.activeTab,
                      ]}
                      onPress={()=>setActiveTab("stats") }> STATS
                      </Text>
                      <Text style={[
                        styles.tab,
                        activeTab == "moves" && styles.activeTab,
                      ]}
                      onPress={()=>setActiveTab("moves") }>MOVES

                      </Text>
            </View>

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
          {activeTab == "info" && (
            <>
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
        <View style={styles.section}>
  <Text style={styles.sectionTitle}>Evolution Chain</Text>

  <View style={styles.evolutionContainer}>
    {/* Sprites + arrows */}
    <View style={styles.evolutionRow}>
      {evolutions.map((evo, index) => (
        <View key={evo} style={styles.evolutionSpriteGroup}>
          <Image
            source={{ uri: getEvolutionSpriteUrlByName(evo, evolutions) }}
            style={styles.evolutionImage}
          />

          {index < evolutions.length - 1 && (
            <Text style={styles.evolutionArrow}>→</Text>
          )}
        </View>
      ))}
    </View>

    {/* Names */}
    <View style={styles.evolutionNamesRow}>
      {evolutions.map((evo) => (
        <Text key={evo} style={styles.evolutionName}>
          {evo}
        </Text>
      ))}
    </View>
  </View>
</View>

        
        </>
        
        
          )}
          {activeTab === "stats" &&(
        <View style={styles.section} >
            <Text style={styles.sectionTitle}>Base Stats</Text>
            {pokemon.stats.map((s)=>(
                <StatBar
                key = {s.stat.name}
                label={s.stat.name.toUpperCase()}
                value={s.base_stat}
                color = {colorByType[mainType]}

            />
            ))}
         </View>
          )}

        {activeTab === "moves" && (
        <View style={styles.section}>
         <Text style={styles.sectionTitle}>Moves</Text>
         {pokemon.moves.slice(0, 20).map((m) => (
      <Text key={m.move.name} style={styles.item}>
        • {m.move.name}
        </Text>
         ))}
         </View>
        )}


        
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
skeletonTitle: {
    height:150,
    backgroundColor:'#e0e0e0',
    borderRadius:12, 
},
skeletonTypeRow:{
    height:20,
    borderRadius: 12,
    backgroundColor:'#e0e0e0',
    width:'60%',
    alignContent:'center'

},
skeletonImage:{
    height:150,
    backgroundColor:'#e0e0e0',
    borderRadius:12, 

},
skeletonBlock:{
    height:150,
    backgroundColor:'#e0e0e0',
    borderRadius:12, 
},  
statRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
},
statLabel: {
  width: 60,
  fontSize: 12,
  fontWeight: "bold",
},
statBarBackground: {
  flex: 1,
  height: 8,
  backgroundColor: "#ddd",
  borderRadius: 4,
  overflow: "hidden",
},
statBarFill: {
  height: "100%",
  backgroundColor: "#4CAF50",
},
statValue: {
  width: 30,
  textAlign: "right",
  fontSize: 12,
},
tabs: {
  flexDirection: "row",
  justifyContent: "center",
  marginVertical: 12,
},
tab: {
  marginHorizontal: 12,
  paddingVertical: 6,
  fontWeight: "bold",
  color: "#555",
},
activeTab: {
  color: "#000",
  borderBottomWidth: 2,
},
evolutionRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  
},
evolutionItem: {
  alignItems: "center",
  
},
evolutionSpriteGroup:{
flexDirection: "row",
alignItems: "center",
},
evolutionImage: {
  width: 72,
  height: 72,
},
evolutionName: {
  fontSize: 12,
  width:72,
  textAlign: 'center',
  textTransform: "capitalize",
  marginTop: 4,
  
},
evolutionArrow: {
  fontSize: 20,
  marginHorizontal: 8,
  lineHeight: 72,
},
evolutionContainer:{
    alignItems: 'center',
},
evolutionNamesRow: {
  flexDirection: "row",
  justifyContent: "center",
  marginTop: 8,
  width: "100%",

},

});
