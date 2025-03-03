import { OpenLibraryClient } from 'open-library-api';

export async function getWorkFromTitle(title) {
	const olc = new OpenLibraryClient();
	const searchCriteria = {
		title: title,
		fields: 'key,title,author_name'
	}

	const searchResults = await olc.search(searchCriteria);
	const workKey = searchResults.docs[0].key;

	return olc.fetchWork(workKey)
}

export async function getIsbn(workKey) {
	const olc = new OpenLibraryClient();
	const editions = await olc.fetchEditions(workKey);

	const allowed_formats = ['paperback', 'hardcover', 'library binding']

	function checkForEnglish(entry) {
		let flag = false
		if ('languages' in entry) {
			entry.languages.forEach(language => flag = language.key === '/languages/eng')
		}
		return flag
	}

	const editionsFiltered = editions.entries.filter(entry => checkForEnglish(entry) && (!('physical_format' in entry) || allowed_formats.includes(entry.physical_format.toLocaleLowerCase())))
	const editionsSorted = editionsFiltered.sort((a, b) => b.latest_revision - a.latest_revision);

	return editionsSorted[0].isbn_13[0]
}


export async function getWorkCoverImage(isbn) {
	const olc = new OpenLibraryClient();

	return olc.fetchCoverByIsbn(isbn);
}