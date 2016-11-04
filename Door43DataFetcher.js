//Door43DataFetcher.js//

/**
 * @description - Grabs pages from the door43 github repository that
 * represents the most up-to-date information.
 * @author - Samuel Faulkner, Evan Wiederspan
 */
// This file should probably be moved to a new location later
const USFMParser = require('./USFMParse');
const TNParser = require("./tNParser");

const suppress = true;

class Door43DataFetcher {
	constructor() {
		this.bookList = null;
	}
	/**
  * @description - This function finds the ULB text within a book and returns it as
  * an object
  * @param {Object} book - book object from getBook() function that is to be parsed
  */
	getULBFromBook(book = { chapters: [] }) {
		let ulbData = { chapters: [] };
		if (!book.chapters) {
			console.error("Error: Input object is in incorrect format");
			return ulbData;
		}
		const usfmRegex = new RegExp("=+\\s*ulb:\\s*=+\\s*<usfm>([^<]+)<\\/usfm>", "i");
		for (let ch of book.chapters) {
			let chap = { num: -1, verses: [] };
			for (let v of ch.verses) {
				let regRes;
				try {
					[, regRes] = usfmRegex.exec(v.file);
				} catch (e) {
					if (!suppress) {
						console.warn("ULB Parse Warning: No ULB Data for chapter " + ch.num + " verse " + v.num);
						console.warn("File may be in incorrect format");
					}
					continue;
				}
				let parsed = USFMParser(regRes).chapters[0];
				if (parsed.num != -1) chap.num = parsed.num;
				chap.verses = chap.verses.concat(parsed.verses);
			}
			if (chap.verses.length != 0) ulbData.chapters.push(chap);
		}
		return ulbData;
	}
	getTNFromBook(book = {chapters: []}, bookAbbr = "?") {
    if (!book.chapters) {
      console.error("Error: Input object is in incorrect format");
      return {};
    }
    return TNParser(book, bookAbbr);
  }
}

module.exports = Door43DataFetcher;