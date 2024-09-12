class RecintosZoo {
    constructor() {
        this.animaisValidos = [
            { especie: "LEAO", tamanho: 3, bioma: "Savana" },
            { especie: "LEOPARDO", tamanho: 2, bioma: "Savana" },
            { especie: "CROCODILO", tamanho: 3, bioma: "Rio" },
            { especie: "MACACO", tamanho: 1, bioma: ["Savana", "Floresta"] },
            { especie: "GAZELA", tamanho: 2, bioma: "Savana" },
            { especie: "HIPOPOTAMO", tamanho: 4, bioma: ["Savana", "Rio"] }
        ];

        this.recintos = [
            { numero: 1, bioma: "Savana", tamanho: 10, animais: [{ especie: "MACACO", quantidade: 3 }] },
            { numero: 2, bioma: "Floresta", tamanho: 5, animais: [] },
            { numero: 3, bioma: "Savana_Rio", tamanho: 7, animais: [{ especie: "GAZELA", quantidade: 1 }] },
            { numero: 4, bioma: "Rio", tamanho: 8, animais: [] },
            { numero: 5, bioma: "Savana", tamanho: 9, animais: [{ especie: "LEAO", quantidade: 1 }] }
        ];
    }

    analisaRecintos(animal, quantidade) {
        // Verificar se o animal é válido
        const animalInfo = this.animaisValidos.find(a => a.especie === animal.toUpperCase());
        if (!animalInfo) {
            return { erro: "Animal inválido", recintosViaveis: null };
        }

        // Verificar se a quantidade é válida
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }

        // Filtrar recintos adequados e calcular o espaço disponível
        const recintosViaveis = this.recintos
            .filter(recinto => {
                // Verificar bioma adequado
                if (Array.isArray(animalInfo.bioma)) {
                    return animalInfo.bioma.includes(recinto.bioma);
                } else {
                    return animalInfo.bioma === recinto.bioma;
                }
            })
            .map(recinto => {
                // Calcular espaço ocupado no recinto
                const espacoOcupado = recinto.animais.reduce((total, a) => {
                    const infoAnimal = this.animaisValidos.find(an => an.especie === a.especie);
                    return total + (infoAnimal ? infoAnimal.tamanho * a.quantidade : 0);
                }, 0);

                // Verificar se mais de uma espécie ocupa o recinto (ocupa 1 espaço extra)
                const espacoExtra = recinto.animais.length > 0 ? 1 : 0;
                let espacoDisponivel = recinto.tamanho - espacoOcupado - espacoExtra;

                // Calcular o espaço disponível após adicionar os novos animais
                const espacoLivre = espacoDisponivel - (animalInfo.tamanho * quantidade);

                return { recinto, espacoLivre };
            })
            // Filtrar os recintos que têm espaço suficiente para o animal e a quantidade
            .filter(recinto => recinto.espacoLivre >= 0)
            .sort((a, b) => a.recinto.numero - b.recinto.numero)
            .map(recinto => {
                // Retornar o recinto com o cálculo correto do espaço livre
                return `Recinto ${recinto.recinto.numero} (espaço livre: ${recinto.espacoLivre} total: ${recinto.recinto.tamanho})`;
            });

        // Verificar se há recintos viáveis
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }

        return { erro: null, recintosViaveis };
    }
}

export { RecintosZoo as RecintosZoo };
