import { OpenLibraryClient } from 'open-library-js';

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

export async function getWorkFromTitleAuthor(title, author) {
	const olc = new OpenLibraryClient();
	const searchCriteria = {
		title: title,
		author: author,
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

	let index_with_isbn = 0
	let isbn;

	while (isbn === undefined || isbn === null || isbn === '') {
		if (editionsSorted[index_with_isbn].isbn_13){
			isbn = editionsSorted[index_with_isbn].isbn_13[0]
		} else if (editionsSorted[index_with_isbn].isbn_10){
			isbn = editionsSorted[index_with_isbn].isbn_10[0]
		} else {
			index_with_isbn++
		}
	}

	return isbn
}


export async function getWorkCoverImage(isbn) {
	const olc = new OpenLibraryClient();

	return olc.fetchCoverByIsbn(isbn);
}