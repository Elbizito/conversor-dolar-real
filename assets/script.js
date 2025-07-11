let dolar = 0 // será atualizado pela API
// Elementos
const usdInput = document.querySelector("#usd")
const brlInput = document.querySelector("#brl")
// Função principal para buscar a cotação
async function fetchDollarRate() {
    try {
        const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD")
        const data = await res.json()
        dolar = data.rates.BRL
        console.log("Cotação carregada: 1 USD = R$ " + dolar.toFixed(2))
        // Atualiza a conversão inicial após a cotação ser carregada
        if (usdInput.value.trim() !== "") {
            convert("usd-to-brl")
        }
    } catch (error) {
        console.error("Erro ao buscar cotação:", error)
        alert("Erro ao carregar cotação do dólar. Tente novamente mais tarde.")
    }
}
// Converte os valores com base no tipo (de USD para BRL ou vice-versa)
function convert(type) {
    if (dolar === 0) return // Aguarda a cotação ser carregada
    if (type === "usd-to-brl") {
        if (usdInput.value.trim() === "") {
            brlInput.value = ""
            return
        }
        const valor = fixValue(usdInput.value)
        const convertido = valor * dolar
        brlInput.value = formatCurrency(convertido.toFixed(2))
    }
    if (type === "brl-to-usd") {
        if (brlInput.value.trim() === "") {
            usdInput.value = ""
            return
        }
        const valor = fixValue(brlInput.value)
        const convertido = valor / dolar
        usdInput.value = formatCurrency(convertido.toFixed(2))
    }
}
// Corrige o valor para float
function fixValue(value) {
    if (!value) return 0
    return parseFloat(value.replace(",", "."))
}
// Formata como moeda brasileira
function formatCurrency(value) {
    let number = parseFloat(value)
    if (isNaN(number)) return ""
    return new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: false
    }).format(number)
}
// Eventos nos inputs
usdInput.addEventListener("keyup", () => convert("usd-to-brl"))
brlInput.addEventListener("keyup", () => convert("brl-to-usd"))
usdInput.addEventListener("blur", () => {
    if (usdInput.value.trim() !== "") {
        usdInput.value = formatCurrency(usdInput.value)
    }
})
brlInput.addEventListener("blur", () => {
    if (brlInput.value.trim() !== "") {
        brlInput.value = formatCurrency(brlInput.value)
    }
})
// Valor inicial (apenas visual)
usdInput.value = "1000,00"
// Inicia o carregamento da API ao abrir o site
window.addEventListener("load", fetchDollarRate)