export function capitalizeWords(inputString) {
    // Split the input string by hyphens
    let words = inputString.split('-');
    if (words.length === 1) {
        words = inputString.split(' ');
    }

    // Capitalize the first letter of each word and make other letters lowercase
    const capitalizedWords = words.map(word => {
        // Capitalize the first letter and make the rest lowercase
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    // Join the words back together with spaces
    return capitalizedWords.join(' ');
}