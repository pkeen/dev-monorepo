// date of citizenship eligilibiliy

const dateFirstArrival = new Date("2021-06-15");
const datePR = new Date("2024-05-14");
const today = new Date();

// Calculate the difference in milliseconds

function differenceInDays(dateEarlier: Date, dateLater: Date): number {
	const differenceInMilliseconds =
		dateLater.getTime() - dateEarlier.getTime();
	return differenceInMilliseconds / (1000 * 60 * 60 * 24);
}

// Function to add a specific number of days to a date
function addDays(date: Date, days: number): Date {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

const daysAsTR = differenceInDays(dateFirstArrival, datePR) * 0.5;
console.log("Days as TR: ", daysAsTR);
const daysAsPR = differenceInDays(datePR, today);
console.log("Days as PR: ", daysAsPR);

let daysDone = 0;
daysDone = daysAsTR;
daysDone += daysAsPR;
console.log("Days done: ", daysDone);

const daysNeeded = 1100;
const daysRemaining = daysNeeded - daysDone;
console.log("Days remaining: ", daysRemaining);

const dateCitizenship = addDays(today, daysRemaining);

console.log("Date of citizenship eligibility: ", dateCitizenship);
