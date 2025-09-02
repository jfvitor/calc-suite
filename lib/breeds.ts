export type SizeKey = "small" | "medium" | "large";
export type Species = "dog" | "cat";

export type Breed = {
    name: string;
    size: SizeKey;
    lifespan?: string; // ex.: "12–15"
};

// Raças de cães (amostra inicial)
export const dogBreeds: Breed[] = [
    { name: "Sem raça definida (SRD)", size: "medium" },
    { name: "Labrador Retriever", size: "large", lifespan: "11–13" },
    { name: "Golden Retriever", size: "large", lifespan: "10–12" },
    { name: "Pastor Alemão", size: "large", lifespan: "9–13" },
    { name: "Bulldog Francês", size: "small", lifespan: "10–12" },
    { name: "Poodle (Médio)", size: "medium", lifespan: "12–15" },
    { name: "Poodle (Toy/Mini)", size: "small", lifespan: "12–16" },
    { name: "Shih Tzu", size: "small", lifespan: "10–16" },
    { name: "Yorkshire Terrier", size: "small", lifespan: "11–15" },
    { name: "Beagle", size: "medium", lifespan: "12–15" },
    { name: "Boxer", size: "large", lifespan: "9–12" },
    { name: "Rottweiler", size: "large", lifespan: "9–10" },
    { name: "Border Collie", size: "medium", lifespan: "12–15" },
    { name: "Dachshund (Teckel)", size: "small", lifespan: "12–16" },
];

// Raças de gatos (amostra inicial)
export const catBreeds: Breed[] = [
    { name: "Sem raça definida (SRD)", size: "medium" },
    { name: "Siamês", size: "medium", lifespan: "12–20" },
    { name: "Persa", size: "medium", lifespan: "12–17" },
    { name: "Maine Coon", size: "large", lifespan: "10–15" },
    { name: "British Shorthair", size: "medium", lifespan: "12–17" },
    { name: "Ragdoll", size: "large", lifespan: "12–15" },
    { name: "Sphynx", size: "medium", lifespan: "9–15" },
];

export function getBreeds(species: Species): Breed[] {
    return species === "dog" ? dogBreeds : catBreeds;
}
