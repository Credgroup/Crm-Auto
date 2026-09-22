export function obterIniciais(nome: string) {
    // Divide o nome em palavras
    const palavras = nome.split(' ');
    // Obtém as iniciais dos dois primeiros nomes ou as duas primeiras letras do primeiro nome
    let inicial1 = palavras[0].charAt(0);
    let inicial2 = palavras.length > 1 ? palavras[1].charAt(0) : palavras[0].charAt(1);
    // Retorna as iniciais
    return inicial1.toLocaleUpperCase() + inicial2.toLocaleUpperCase();
}